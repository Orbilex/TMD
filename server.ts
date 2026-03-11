import express from 'express';
import { createServer as createViteServer } from 'vite';
import Stripe from 'stripe';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  let stripeClient: Stripe | null = null;
  function getStripe(): Stripe {
    if (!stripeClient) {
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) {
        throw new Error('STRIPE_SECRET_KEY environment variable is required');
      }
      stripeClient = new Stripe(key);
    }
    return stripeClient;
  }

  app.post('/api/create-payment-intent', async (req, res) => {
    try {
      const { amount, connectedAccountId } = req.body; // amount in cents
      
      if (!amount || typeof amount !== 'number') {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) {
        // Return a mock client secret for demo purposes if no key is provided
        console.warn('STRIPE_SECRET_KEY is missing. Returning a mock payment intent for demo purposes.');
        return res.json({ clientSecret: 'pi_mock_secret_12345' });
      }

      const stripe = getStripe();
      
      const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
        amount,
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
      };

      // If a connected account is provided, route the payment there (taking a 0% fee for demo)
      if (connectedAccountId) {
        paymentIntentParams.transfer_data = {
          destination: connectedAccountId,
        };
      }

      const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // Stripe Connect: Create an Express Account
  app.post('/api/connect/account', async (req, res) => {
    try {
      const stripe = getStripe();
      const account = await stripe.accounts.create({
        type: 'express',
        capabilities: {
          transfers: { requested: true },
        },
      });
      res.json({ accountId: account.id });
    } catch (error: any) {
      console.error('Error creating connect account:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // Stripe Connect: Create an Account Link for Onboarding
  app.post('/api/connect/account-link', async (req, res) => {
    try {
      const { accountId } = req.body;
      if (!accountId) return res.status(400).json({ error: 'Missing accountId' });

      const stripe = getStripe();
      const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;

      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: `${appUrl}/api/connect/refresh?account_id=${accountId}`,
        return_url: `${appUrl}/api/connect/return`,
        type: 'account_onboarding',
      });

      res.json({ url: accountLink.url });
    } catch (error: any) {
      console.error('Error creating account link:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // Stripe Connect: Return URL handler (closes popup and notifies parent)
  app.get('/api/connect/return', (req, res) => {
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'STRIPE_ONBOARDING_COMPLETE' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Onboarding complete. This window should close automatically.</p>
        </body>
      </html>
    `);
  });

  // Stripe Connect: Refresh URL handler
  app.get('/api/connect/refresh', (req, res) => {
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'STRIPE_ONBOARDING_REFRESH' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Please try onboarding again. This window should close automatically.</p>
        </body>
      </html>
    `);
  });

  // Stripe Connect: Get Account Details
  app.get('/api/connect/account/:id', async (req, res) => {
    try {
      const stripe = getStripe();
      const account = await stripe.accounts.retrieve(req.params.id);
      
      let externalAccount = null;
      if (account.external_accounts && account.external_accounts.data.length > 0) {
        externalAccount = account.external_accounts.data[0];
      }

      res.json({
        id: account.id,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        externalAccount: externalAccount ? {
          id: externalAccount.id,
          object: externalAccount.object, // 'bank_account' or 'card'
          last4: (externalAccount as any).last4,
          bankName: (externalAccount as any).bank_name || (externalAccount as any).brand,
        } : null
      });
    } catch (error: any) {
      console.error('Error retrieving connect account:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // Stripe Connect: Process a manual payout/transfer
  app.post('/api/connect/payout', async (req, res) => {
    try {
      const { accountId, amount } = req.body; // amount in cents
      if (!accountId || !amount) return res.status(400).json({ error: 'Missing accountId or amount' });

      const stripe = getStripe();
      
      // Transfer funds from platform to connected account
      const transfer = await stripe.transfers.create({
        amount,
        currency: 'usd',
        destination: accountId,
        description: 'Creator Payout from Treat Me A Donut',
      });

      res.json({ success: true, transferId: transfer.id });
    } catch (error: any) {
      console.error('Error processing payout:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  app.post('/api/create-checkout-session', async (req, res) => {
    try {
      const { amount, name, message } = req.body; // amount in cents
      
      if (!amount || typeof amount !== 'number') {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      const stripe = getStripe();
      const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Treat Jane to a Donut 🍩',
                description: message ? `Message: ${message}` : 'Support for Jane Doe',
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${appUrl}/?success=true`,
        cancel_url: `${appUrl}/?canceled=true`,
        metadata: {
          supporter_name: name || 'Anonymous',
          message: message || '',
        },
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
