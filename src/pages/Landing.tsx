import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { MousePointerClick, CreditCard, CheckCircle, ShieldCheck, Lock, Fingerprint, Zap, ArrowRight, Server } from 'lucide-react';
import Logo from '../components/Logo';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg-main text-text-primary font-sans overflow-hidden selection:bg-tawny-200 selection:text-tawny-900">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-tawny-400/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-400/10 blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between py-6 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="font-bold text-xl tracking-tight hidden sm:block">Treat Me a Donut</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link 
            to="/creatordemo" 
            className="bg-white text-tawny-600 hover:text-tawny-700 font-medium transition-colors px-4 py-2 rounded-full hover:bg-gray-50 border border-gray-200"
          >
            Creator Demo
          </Link>
          <Link 
            to="/demo" 
            className="bg-tawny-500 hover:bg-tawny-600 text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            View Demo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center max-w-5xl mx-auto mt-16 md:mt-24 px-4"
      >
        {/* Visual Security Badge */}
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 font-medium text-sm mb-8 shadow-sm"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Bank-Grade Security Infrastructure</span>
        </motion.div>

        <motion.h1 
          variants={itemVariants} 
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-text-primary mb-6 leading-[1.1]"
        >
          Support Creators.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-tawny-500 to-orange-400">
            Powered by Stripe.
          </span>
        </motion.h1>
        
        <motion.p 
          variants={itemVariants} 
          className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          A portfolio project demonstrating seamless, secure payment flows using React, Vite, and the official Stripe SDK.
        </motion.p>
      </motion.div>

      {/* Visual Security Showcase (No Text Focus) */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-5xl mx-auto mt-16 px-4 relative z-10"
      >
        <div className="bg-zinc-900 rounded-3xl p-8 md:p-16 shadow-2xl overflow-hidden relative border border-zinc-800">
          {/* Animated Grid Background */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            {/* Left: Visual Flow */}
            <div className="flex-1 flex items-center justify-center gap-4 md:gap-8 w-full">
              {/* User Card */}
              <motion.div 
                animate={{ y: [-5, 5, -5] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 md:w-24 md:h-24 bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-700 shadow-lg relative"
              >
                <CreditCard className="w-10 h-10 text-tawny-400" />
                <motion.div 
                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }} 
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-zinc-900"
                />
              </motion.div>

              {/* Animated Connection */}
              <div className="flex-1 h-1 bg-zinc-800 relative rounded-full overflow-hidden">
                <motion.div 
                  animate={{ x: ['-100%', '200%'] }} 
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-green-400 to-transparent"
                />
              </div>

              {/* Encryption Node */}
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-green-500 to-emerald-700 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] relative z-10 border-4 border-zinc-900"
              >
                <Lock className="w-12 h-12 text-white" />
              </motion.div>

              {/* Animated Connection */}
              <div className="flex-1 h-1 bg-zinc-800 relative rounded-full overflow-hidden">
                <motion.div 
                  animate={{ x: ['-100%', '200%'] }} 
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
                  className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-tawny-400 to-transparent"
                />
              </div>

              {/* Server/Stripe */}
              <motion.div 
                animate={{ y: [5, -5, 5] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="w-20 h-20 md:w-24 md:h-24 bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-700 shadow-lg"
              >
                <Server className="w-10 h-10 text-[#635BFF]" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Role Selection Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-5xl mx-auto mt-24 px-4 relative z-10"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Who do you want to simulate?</h2>
          <p className="text-xl text-text-secondary">Choose a path to explore the platform from different perspectives.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* The Donator Card */}
          <Link to="/demo" className="group block h-full">
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white rounded-3xl p-8 md:p-10 card-shadow border border-gray-100 h-full flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-tawny-50 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110 duration-700"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 bg-tawny-100 text-tawny-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                  <CreditCard className="w-8 h-8" />
                </div>
                
                <h3 className="text-3xl font-bold mb-4 text-gray-900">The Donator</h3>
                <p className="text-text-secondary text-lg mb-8 flex-grow">
                  Experience the frictionless checkout flow. See how easy it is to support a creator using Stripe's secure payment elements.
                </p>
                
                <div className="flex items-center text-tawny-600 font-bold text-lg group-hover:translate-x-2 transition-transform">
                  Support a Creator <ArrowRight className="ml-2 w-5 h-5" />
                </div>
              </div>
            </motion.div>
          </Link>

          {/* The Creator Card */}
          <Link to="/creatordemo" className="group block h-full">
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-zinc-900 rounded-3xl p-8 md:p-10 shadow-2xl border border-zinc-800 h-full flex flex-col relative overflow-hidden text-white"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110 duration-700"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 bg-zinc-800 text-blue-400 rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-zinc-700">
                  <Zap className="w-8 h-8" />
                </div>
                
                <h3 className="text-3xl font-bold mb-4 text-white">The Creator</h3>
                <p className="text-zinc-400 text-lg mb-8 flex-grow">
                  Set up your profile, connect your bank account (simulated), and watch the donations roll into your dashboard in real-time.
                </p>
                
                <div className="flex items-center text-blue-400 font-bold text-lg group-hover:translate-x-2 transition-transform">
                  Start Accepting Donuts <ArrowRight className="ml-2 w-5 h-5" />
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* Modern Bento Grid Features */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-6xl mx-auto mt-24 px-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="md:col-span-2 bg-white p-8 rounded-3xl card-shadow border border-gray-100 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-tawny-50 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110 duration-700"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-tawny-100 text-tawny-600 rounded-2xl flex items-center justify-center mb-6">
                <Fingerprint className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3">PCI-DSS Compliant</h3>
              <p className="text-text-secondary text-lg max-w-md">
                Sensitive card data never touches our servers. Everything is tokenized and handled directly by Stripe's secure iframes.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl card-shadow border border-gray-100 overflow-hidden relative group">
             <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl transition-transform group-hover:scale-110 duration-700"></div>
             <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-text-secondary">
                Optimized React components ensure the checkout loads instantly, reducing drop-off rates.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Guide Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-6xl mx-auto mt-24 md:mt-32 px-4 pb-24"
      >
        <motion.h2 
          variants={itemVariants} 
          className="text-3xl md:text-5xl font-bold text-center mb-16"
        >
          How to use this Demo
        </motion.h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Donator Explanation (Tawny Background, White Text) */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-tawny-600 text-white rounded-xl flex items-center justify-center shadow-md">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">As a Donator</h3>
            </div>
            
            <div className="bg-tawny-500 p-8 rounded-3xl shadow-xl relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-tawny-400 rounded-full blur-3xl -mr-20 -mt-20 opacity-50"></div>
              
              <div className="relative z-10 space-y-12">
                {/* Step 1 */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-white text-tawny-600 flex items-center justify-center font-bold shrink-0 mt-1 shadow-sm">1</div>
                    <div>
                      <h4 className="font-bold text-xl mb-2">Pick a Donut Amount</h4>
                      <p className="text-tawny-100 leading-relaxed">Choose how many donuts to treat the creator. The UI updates dynamically, calculating the total and preparing a secure Stripe PaymentIntent in the background.</p>
                    </div>
                  </div>
                  {/* Visualizer 1 */}
                  <div className="bg-tawny-600/50 rounded-2xl p-6 border border-tawny-400/30 flex items-center justify-center">
                    <div className="w-full max-w-xs bg-white rounded-xl shadow-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🍩</span>
                        <span className="text-tawny-500 font-bold">x</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">-</div>
                        <span className="text-2xl font-bold text-tawny-500">3</span>
                        <div className="w-8 h-8 rounded-full border border-tawny-200 bg-tawny-50 flex items-center justify-center text-tawny-500">+</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-white text-tawny-600 flex items-center justify-center font-bold shrink-0 mt-1 shadow-sm">2</div>
                    <div>
                      <h4 className="font-bold text-xl mb-2">Use the Test Card</h4>
                      <p className="text-tawny-100 leading-relaxed">
                        When the secure checkout modal opens, enter the Stripe Test Card: <br/>
                        <code className="bg-tawny-700 px-2 py-1 rounded text-sm font-mono mt-2 inline-block border border-tawny-600 text-white">4242 4242 4242 4242</code> <br/>
                        Use any future date (e.g., 12/34) and any CVC (e.g., 123).
                      </p>
                    </div>
                  </div>
                  {/* Visualizer 2 */}
                  <div className="bg-tawny-600/50 rounded-2xl p-6 border border-tawny-400/30 flex items-center justify-center">
                    <div className="w-full max-w-xs bg-white rounded-xl shadow-lg p-4">
                      <div className="flex items-center gap-2 mb-3 text-gray-700 text-sm font-semibold border-b pb-2">
                        <Lock className="w-4 h-4 text-green-500" /> Secure Checkout
                      </div>
                      <div className="h-10 w-full bg-gray-50 border border-gray-200 rounded-lg flex items-center px-3 mb-3">
                        <span className="text-gray-400 font-mono text-sm tracking-widest">4242 4242 4242 4242</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-10 flex-1 bg-gray-50 border border-gray-200 rounded-lg flex items-center px-3">
                          <span className="text-gray-400 font-mono text-sm">12 / 34</span>
                        </div>
                        <div className="h-10 flex-1 bg-gray-50 border border-gray-200 rounded-lg flex items-center px-3">
                          <span className="text-gray-400 font-mono text-sm">123</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-white text-tawny-600 flex items-center justify-center font-bold shrink-0 mt-1 shadow-sm">3</div>
                    <div>
                      <h4 className="font-bold text-xl mb-2">See the Success</h4>
                      <p className="text-tawny-100 leading-relaxed">Watch the secure payment intent process. Upon success, the UI gracefully transitions to a thank you state, and the transaction is recorded in the creator's dashboard.</p>
                    </div>
                  </div>
                  {/* Visualizer 3 */}
                  <div className="bg-tawny-600/50 rounded-2xl p-6 border border-tawny-400/30 flex items-center justify-center">
                    <div className="w-full max-w-xs bg-white rounded-xl shadow-lg p-6 text-center">
                      <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <div className="h-4 w-24 bg-gray-200 rounded-full mx-auto mb-2"></div>
                      <div className="h-3 w-32 bg-gray-100 rounded-full mx-auto"></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Creator Explanation (White Background, Tawny Text) */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white text-tawny-600 rounded-xl flex items-center justify-center border border-gray-200 shadow-sm">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">As a Creator</h3>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-tawny-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
              
              <div className="relative z-10 space-y-12">
                {/* Step 1 */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-tawny-100 text-tawny-600 flex items-center justify-center font-bold shrink-0 mt-1 shadow-sm">1</div>
                    <div>
                      <h4 className="font-bold text-xl mb-2 text-gray-900">Set up Profile</h4>
                      <p className="text-text-secondary leading-relaxed">Personalize your public page. Add your name, a catchy bio, and choose a custom accent color. You can use the "Autofill" button to speed this up!</p>
                    </div>
                  </div>
                  {/* Visualizer 1 */}
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex items-center justify-center">
                    <div className="w-full max-w-xs bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-tawny-100 rounded-full"></div>
                        <div>
                          <div className="h-3 w-20 bg-gray-200 rounded-full mb-2"></div>
                          <div className="h-2 w-32 bg-gray-100 rounded-full"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-8 w-full bg-gray-50 border border-gray-100 rounded-lg"></div>
                        <div className="h-16 w-full bg-gray-50 border border-gray-100 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-tawny-100 text-tawny-600 flex items-center justify-center font-bold shrink-0 mt-1 shadow-sm">2</div>
                    <div>
                      <h4 className="font-bold text-xl mb-2 text-gray-900">Watch the Dashboard</h4>
                      <p className="text-text-secondary leading-relaxed">Once boarded, access your full-screen creator dashboard. See simulated donations appear in your overview, track total earnings, and manage your page.</p>
                    </div>
                  </div>
                  {/* Visualizer 2 */}
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex items-center justify-center">
                    <div className="w-full max-w-xs bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="h-4 w-20 bg-gray-200 rounded-full"></div>
                        <div className="h-6 w-16 bg-tawny-50 rounded-full border border-tawny-100"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div className="h-2 w-12 bg-gray-300 rounded-full mb-2"></div>
                          <div className="h-4 w-16 bg-tawny-500 rounded-full"></div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div className="h-2 w-12 bg-gray-300 rounded-full mb-2"></div>
                          <div className="h-4 w-16 bg-tawny-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                         <div className="h-8 w-full bg-gray-50 rounded-md border border-gray-100"></div>
                         <div className="h-8 w-full bg-gray-50 rounded-md border border-gray-100"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-tawny-100 text-tawny-600 flex items-center justify-center font-bold shrink-0 mt-1 shadow-sm">3</div>
                    <div>
                      <h4 className="font-bold text-xl mb-2 text-gray-900">Add Withdrawal Method</h4>
                      <p className="text-text-secondary leading-relaxed">Head over to the Payouts tab to simulate linking a bank account via Stripe Connect. Then, withdraw your available balance to see the payout history update.</p>
                    </div>
                  </div>
                  {/* Visualizer 3 */}
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex items-center justify-center">
                    <div className="w-full max-w-xs bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="bg-[#635BFF] p-3 text-white text-center text-xs font-bold">
                        Stripe Test Mode
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="h-8 w-full bg-gray-50 border border-gray-200 rounded-md flex items-center px-2">
                          <div className="h-2 w-16 bg-gray-300 rounded-full"></div>
                        </div>
                        <div className="h-8 w-full bg-gray-50 border border-gray-200 rounded-md flex items-center px-2">
                          <div className="h-2 w-24 bg-gray-300 rounded-full"></div>
                        </div>
                        <div className="h-8 w-full bg-[#635BFF] rounded-md mt-2"></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 text-center text-text-secondary">
        <p className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-500" /> Secure Demo Environment
        </p>
      </footer>
    </div>
  );
}
