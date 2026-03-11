import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Wallet, User, Mail, Link as LinkIcon, ArrowLeft, Wand2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCreator } from '../../context/CreatorContext';
import { useNavigate } from 'react-router-dom';

export default function OnboardingFlow() {
  const { updateProfile } = useCreator();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [slug, setSlug] = useState('');

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      handleCompleteOnboarding(e);
    }
  };

  const handleAutofill = () => {
    setName('Jane Doe');
    setSlug('jane-doe');
    setBio('Building cool open-source tools and sharing knowledge. I love coffee and coding!');
  };

  const handleCompleteOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to context
    updateProfile({
      name: name || 'Anonymous Creator',
      bio: bio || 'Creating awesome content.',
      slug: slug || name.toLowerCase().replace(/\s+/g, '-') || 'creator',
      isBoarded: true,
    });
    
    // Trigger confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  return (
    <div className="max-w-xl w-full mx-auto text-center relative">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-text-secondary mb-2 px-1">
          <span className={step >= 1 ? 'text-tawny-600' : ''}>Sign Up</span>
          <span className={step >= 2 ? 'text-tawny-600' : ''}>Profile</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-tawny-500 rounded-full"
            initial={{ width: '50%' }}
            animate={{ width: `${(step / 2) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-3xl card-shadow border border-gray-100 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleNextStep}
              className="space-y-6 text-left"
            >
              <div className="text-center mb-8 relative">
                <button 
                  type="button" 
                  onClick={() => navigate('/')}
                  className="absolute left-0 top-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('creator@example.com');
                    setPassword('password123');
                  }}
                  className="absolute right-0 top-0 flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-tawny-600 bg-tawny-50 hover:bg-tawny-100 rounded-lg transition-colors"
                >
                  <Wand2 className="w-4 h-4" />
                  Autofill
                </button>
                <div className="w-16 h-16 bg-tawny-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-tawny-500" />
                </div>
                <h2 className="text-2xl font-bold">Create your account</h2>
                <p className="text-text-secondary mt-2">Join thousands of creators getting treated to donuts.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tawny-500 focus:border-tawny-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tawny-500 focus:border-tawny-500 outline-none transition-all"
                />
              </div>
              
              <button type="submit" className="w-full bg-tawny-500 hover:bg-tawny-600 text-white py-3.5 rounded-xl font-bold text-lg transition-colors shadow-md shadow-tawny-500/20">
                Continue
              </button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleNextStep}
              className="space-y-6 text-left"
            >
              <div className="text-center mb-8 relative">
                <button
                  type="button"
                  onClick={handleAutofill}
                  className="absolute right-0 top-0 flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-tawny-600 bg-tawny-50 hover:bg-tawny-100 rounded-lg transition-colors"
                >
                  <Wand2 className="w-4 h-4" />
                  Autofill
                </button>
                <div className="w-16 h-16 bg-tawny-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-tawny-500" />
                </div>
                <h2 className="text-2xl font-bold">Set up your profile</h2>
                <p className="text-text-secondary mt-2">Personalize your public page.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Creator Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tawny-500 focus:border-tawny-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custom URL Slug</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 sm:text-sm">
                    treatmeadonut.com/demo/
                  </span>
                  <input 
                    type="text" 
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="your-slug"
                    className="flex-1 min-w-0 block w-full px-4 py-3 rounded-none rounded-r-xl border border-gray-200 focus:ring-2 focus:ring-tawny-500 focus:border-tawny-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea 
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell your supporters what you do..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tawny-500 focus:border-tawny-500 outline-none transition-all resize-none"
                />
              </div>
              
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="px-6 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <button type="submit" className="flex-1 bg-tawny-500 hover:bg-tawny-600 text-white py-3.5 rounded-xl font-bold text-lg transition-colors shadow-md shadow-tawny-500/20">
                  Complete Setup
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
