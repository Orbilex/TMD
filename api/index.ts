import express from 'express';
import Stripe from 'stripe';

const app = express();
app.use(express.json());

// Helper for Stripe
let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY environment variable is required');
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

// --- BASIC API ROUTES ---

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TMD Backend is live on Vercel' });
});

// --- CHECKOUT & PAYMENTS ---

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, connectedAccountId } = req.body;
    if (!amount || typeof amount !== 'number') {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      transfer_data: connectedAccountId ? { destination: connectedAccountId } : undefined,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('Payment Intent Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { amount, name, message } = req.body;
    if (!amount || typeof amount !== 'number') {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const stripe = getStripe();
    // Vercel provides VERCEL_URL automatically in production
    const appUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : (process.env.APP_URL || 'http://localhost:3000');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { 
            name: 'Treat Me A Donut 🍩', 
            description: message ? `Message: ${message}` : 'Support for Creator' 
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${appUrl}/?success=true`,
      cancel_url: `${appUrl}/?canceled=true`,
      metadata: { supporter_name: name || 'Anonymous', message: message || '' },
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout Session Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- STRIPE CONNECT (CREATOR ONBOARDING) ---

app.post('/api/connect/account', async (req, res) => {
  try {
    const stripe = getStripe();
    const account = await stripe.accounts.create({
      type: 'express',
      capabilities: { transfers: { requested: true } },
    });
    res.json({ accountId: account.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/connect/account-link', async (req, res) => {
  try {
    const { accountId } = req.body;
    if (!accountId) return res.status(400).json({ error: 'Missing accountId' });

    const stripe = getStripe();
    const appUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : (process.env.APP_URL || 'http://localhost:3000');

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${appUrl}/api/connect/refresh?account_id=${accountId}`,
      return_url: `${appUrl}/api/connect/return`,
      type: 'account_onboarding',
    });

    res.json({ url: accountLink.url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/connect/account/:id', async (req, res) => {
  try {
    const stripe = getStripe();
    const account = await stripe.accounts.retrieve(req.params.id);
    res.json({
      id: account.id,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- CALLBACK HANDLERS ---

app.get('/api/connect/return', (req, res) => {
  res.send(`
    <html><body><script>
      if (window.opener) {
        window.opener.postMessage({ type: 'STRIPE_ONBOARDING_COMPLETE' }, '*');
        window.close();
      } else {
        window.location.href = '/';
      }
    </script></body></html>
  `);
});

app.get('/api/connect/refresh', (req, res) => {
  res.send(`
    <html><body><script>
      if (window.opener) {
        window.opener.postMessage({ type: 'STRIPE_ONBOARDING_REFRESH' }, '*');
        window.close();
      } else {
        window.location.href = '/';
      }
    </script></body></html>
  `);
});

app.post('/api/connect/payout', async (req, res) => {
  try {
    const { accountId, amount } = req.body;
    if (!accountId || !amount) return res.status(400).json({ error: 'Missing accountId or amount' });

    const stripe = getStripe();
    const transfer = await stripe.transfers.create({
      amount,
      currency: 'usd',
      destination: accountId,
      description: 'Creator Payout from TMD',
    });

    res.json({ success: true, transferId: transfer.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// VERY IMPORTANT: Export the app so Vercel can find it
export default app;
