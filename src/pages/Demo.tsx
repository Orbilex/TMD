import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, CheckCircle2, ArrowLeft, X, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CheckoutForm from '../components/CheckoutForm';
import { useCreator } from '../context/CreatorContext';

// Initialize Stripe outside of component render to avoid recreating Stripe object
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_dummy');

const DONUT_PRICE = 200; // $2.00 in cents

const INITIAL_SUPPORTERS = [
  { id: 1, name: 'Alex', amount: 3, message: 'Love the new CLI tool!' },
  { id: 2, name: 'Sam', amount: 1, message: 'Keep up the great work.' },
  { id: 3, name: 'Someone', amount: 5, message: 'Thanks for the help on Discord.' }
];

const NEW_MESSAGES = [
  { name: 'Jordan', amount: 2, message: 'This is awesome!' },
  { name: 'Taylor', amount: 1, message: '🍩🍩🍩' },
  { name: 'Casey', amount: 10, message: 'You saved me hours of work.' },
  { name: 'Riley', amount: 4, message: 'Great tutorial!' },
  { name: 'Morgan', amount: 1, message: 'Keep it up!' },
];

export default function Demo() {
  const { profile, addTransaction } = useCreator();
  const [donuts, setDonuts] = useState<number>(3);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supporters, setSupporters] = useState(INITIAL_SUPPORTERS);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      if (count < NEW_MESSAGES.length) {
        const newSupporter = { ...NEW_MESSAGES[count], id: Date.now() };
        setSupporters(prev => [newSupporter, ...prev].slice(0, 5));
        count++;
      } else {
        count = 0;
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch PaymentIntent when donuts amount changes
    const fetchPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: donuts * DONUT_PRICE }),
        });
        
        const text = await response.text();
        if (!text) {
          throw new Error('Empty response from server. The server might be restarting or missing environment variables.');
        }
        
        const data = JSON.parse(text);
        
        if (!response.ok) {
          throw new Error(data.error || `Server error: ${response.status}`);
        }
        
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      } catch (error) {
        console.error('Failed to fetch payment intent:', error);
      }
    };

    fetchPaymentIntent();
  }, [donuts]);

  const handleSuccess = () => {
    setIsSuccess(true);
    addTransaction({
      name: name || 'Anonymous',
      donuts,
      amount: (donuts * DONUT_PRICE) / 100,
    });
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <div className="min-h-screen bg-bg-main text-text-primary font-sans">
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <Link to="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-tawny-600 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Creator Info */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-card-bg rounded-2xl card-shadow overflow-hidden">
              <div 
                className="h-48 relative"
                style={{ backgroundColor: profile.accentColor, opacity: 0.8 }}
              >
                <img 
                  src="https://picsum.photos/seed/workspace/1000/400" 
                  alt="Banner" 
                  className="w-full h-full object-cover mix-blend-overlay opacity-50"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="px-8 pb-8 relative">
                <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden absolute -top-12 left-8 bg-white shadow-sm">
                  <img 
                    src="https://picsum.photos/seed/avatar/200/200" 
                    alt={profile.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="pt-16">
                  <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                  <p className="text-text-secondary text-lg mb-6">{profile.bio}</p>
                  
                  <div 
                    className="flex items-center gap-2 text-sm font-medium w-fit px-4 py-2 rounded-full"
                    style={{ color: profile.accentColor, backgroundColor: `${profile.accentColor}15` }}
                  >
                    <Heart className="w-4 h-4" />
                    <span>1,204 Supporters</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card-bg rounded-2xl card-shadow p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Live Supporters
              </h2>
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {supporters.map((supporter) => (
                    <motion.div
                      key={supporter.id}
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                      className="flex gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100"
                    >
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{ color: profile.accentColor, backgroundColor: `${profile.accentColor}15` }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="8" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">
                          {supporter.name} <span className="text-text-secondary font-normal">bought {supporter.amount} donut{supporter.amount > 1 ? 's' : ''}</span>
                        </p>
                        <p className="text-text-secondary mt-1">{supporter.message}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Column: Treat Me a Donut Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-8">
              <div className="bg-card-bg rounded-2xl card-shadow p-6 sm:p-8 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        Treat {profile.name.split(' ')[0]} a Donut <span className="text-3xl">🍩</span>
                      </h2>

                      <div 
                        className="border p-4 rounded-xl mb-6 flex items-center justify-between"
                        style={{ backgroundColor: `${profile.accentColor}08`, borderColor: `${profile.accentColor}30` }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🍩</span>
                          <span className="font-medium" style={{ color: profile.accentColor }}>x</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setDonuts(Math.max(1, donuts - 1))}
                            className="w-10 h-10 rounded-full bg-white border flex items-center justify-center transition-colors disabled:opacity-50"
                            style={{ borderColor: `${profile.accentColor}40`, color: profile.accentColor }}
                            disabled={donuts <= 1}
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          
                          <div className="w-16 h-16 flex items-center justify-center relative">
                            <AnimatePresence mode="popLayout">
                              <motion.div
                                key={donuts}
                                initial={{ opacity: 0, y: 20, scale: 0.5 }}
                                animate={{ 
                                  opacity: 1, 
                                  y: 0, 
                                  scale: 1 + Math.min((donuts - 1) * 0.15, 1.5)
                                }}
                                exit={{ opacity: 0, y: -20, scale: 0.5 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="absolute font-bold text-3xl"
                                style={{ color: profile.accentColor }}
                              >
                                {donuts}
                              </motion.div>
                            </AnimatePresence>
                          </div>

                          <button
                            onClick={() => setDonuts(donuts + 1)}
                            className="w-10 h-10 rounded-full bg-white border flex items-center justify-center transition-colors"
                            style={{ borderColor: `${profile.accentColor}40`, color: profile.accentColor }}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4 mb-8">
                        <input
                          type="text"
                          placeholder="Name or @twitter (optional)"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 transition-all bg-gray-50/50"
                          style={{ '--tw-ring-color': `${profile.accentColor}40` } as React.CSSProperties}
                        />
                        <textarea
                          placeholder="Say something nice... (optional)"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 transition-all bg-gray-50/50 resize-none"
                          style={{ '--tw-ring-color': `${profile.accentColor}40` } as React.CSSProperties}
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsModalOpen(true)}
                        disabled={!clientSecret}
                        className="w-full text-white font-semibold py-4 rounded-full transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                        style={{ backgroundColor: profile.accentColor }}
                      >
                        Support ${(donuts * DONUT_PRICE / 100).toFixed(2)}
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.5 }}
                      className="text-center py-12"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', bounce: 0.6 }}
                        className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                      >
                        <CheckCircle2 className="w-12 h-12" />
                      </motion.div>
                      <h2 className="text-3xl font-bold mb-4">Success! 🍩</h2>
                      <p className="text-text-secondary text-lg mb-8">
                        Thank you so much for treating {profile.name.split(' ')[0]} to {donuts} donut{donuts > 1 ? 's' : ''}!
                      </p>
                      <button
                        onClick={() => {
                          setIsSuccess(false);
                          setDonuts(3);
                          setName('');
                          setMessage('');
                        }}
                        className="font-medium transition-colors opacity-80 hover:opacity-100"
                        style={{ color: profile.accentColor }}
                      >
                        Send another treat
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {isModalOpen && clientSecret && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative flex flex-col max-h-[90vh]"
            >
              <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <Lock className="w-4 h-4 text-green-600" />
                  Secure Checkout
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                {clientSecret === 'pi_mock_secret_12345' ? (
                  <div className="space-y-6">
                    <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm font-medium border border-blue-100 flex items-start gap-3">
                      <div className="mt-0.5">ℹ️</div>
                      <div>
                        <p className="font-semibold mb-1">Mock Payment Mode</p>
                        <p>
                          Stripe is not configured. This is a simulated payment flow. Click the button below to complete the payment.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        handleSuccess();
                      }}
                      className="w-full text-white font-semibold py-4 rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm"
                      style={{ backgroundColor: profile.accentColor }}
                    >
                      Simulate Payment of ${(donuts * DONUT_PRICE / 100).toFixed(2)}
                    </button>
                  </div>
                ) : (
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: profile.accentColor, borderRadius: '12px' } } }}>
                    <CheckoutForm amount={donuts * DONUT_PRICE} onSuccess={() => {
                      setIsModalOpen(false);
                      handleSuccess();
                    }} />
                  </Elements>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
