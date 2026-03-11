import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface CheckoutFormProps {
  amount: number;
  onSuccess: () => void;
}

export default function CheckoutForm({ amount, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // We don't want to redirect, we handle success locally
        return_url: window.location.href,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message ?? 'An unknown error occurred');
      setIsLoading(false);
    } else {
      // Payment succeeded
      setIsLoading(false);
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm font-medium border border-blue-100 flex items-start gap-3">
        <div className="mt-0.5">ℹ️</div>
        <div>
          <p className="font-semibold mb-1">Portfolio Demo Mode</p>
          <p>
            Use test card <code className="bg-blue-100 px-1.5 py-0.5 rounded">4242 4242 4242 4242</code> with any future date and CVC.
          </p>
        </div>
      </div>

      <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/50">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {errorMessage && (
        <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={!stripe || isLoading}
        type="submit"
        className="w-full bg-tawny-500 hover:bg-tawny-600 text-white font-semibold py-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${(amount / 100).toFixed(2)}`
        )}
      </motion.button>
    </form>
  );
}
