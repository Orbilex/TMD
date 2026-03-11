import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCreator } from '../../context/CreatorContext';
import { Building2, CheckCircle2, DollarSign, Loader2, ArrowRightLeft, Plus, CreditCard, AlertCircle, Calendar, TrendingUp } from 'lucide-react';

export default function PayoutsTab() {
  const { profile, withdrawFunds, updateProfile } = useCreator();
  const [payoutStatus, setPayoutStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [payoutError, setPayoutError] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'STRIPE_ONBOARDING_COMPLETE') {
        if (profile.stripeAccountId) {
          try {
            const res = await fetch(`/api/connect/account/${profile.stripeAccountId}`);
            const data = await res.json();
            
            if (data.externalAccount) {
              updateProfile({
                stripeAccountStatus: 'active',
                withdrawalMethod: {
                  type: data.externalAccount.object === 'bank_account' ? 'bank_account' : 'debit_card',
                  last4: data.externalAccount.last4,
                  bankName: data.externalAccount.bankName || 'Stripe Connected Account'
                }
              });
            }
          } catch (error) {
            console.error('Error fetching account details:', error);
          }
        }
        setIsConnecting(false);
      } else if (event.data?.type === 'STRIPE_ONBOARDING_REFRESH') {
        setIsConnecting(false);
        alert('Stripe onboarding was interrupted. Please try again.');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [profile.stripeAccountId, updateProfile]);

  const handlePayout = async () => {
    if (profile.balance <= 0 || !profile.withdrawalMethod || !profile.stripeAccountId) return;
    setPayoutStatus('processing');
    setPayoutError('');
    
    try {
      const res = await fetch('/api/connect/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: profile.stripeAccountId,
          amount: Math.round(profile.balance * 100) // Convert to cents
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process payout');
      }
      
      withdrawFunds();
      setPayoutStatus('success');
      setTimeout(() => setPayoutStatus('idle'), 3000);
    } catch (error: any) {
      console.error('Payout error:', error);
      setPayoutStatus('error');
      setPayoutError(error.message);
      setTimeout(() => setPayoutStatus('idle'), 5000);
    }
  };

  const handleAddMethod = async () => {
    setIsConnecting(true);
    try {
      let accountId = profile.stripeAccountId;
      
      // Create account if we don't have one
      if (!accountId) {
        const res = await fetch('/api/connect/account', { method: 'POST' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        accountId = data.accountId;
        updateProfile({ stripeAccountId: accountId, stripeAccountStatus: 'pending' });
      }

      // Get account link
      const linkRes = await fetch('/api/connect/account-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId })
      });
      const linkData = await linkRes.json();
      if (!linkRes.ok) throw new Error(linkData.error);

      // Open popup
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      window.open(
        linkData.url,
        'stripe_onboarding',
        `width=${width},height=${height},left=${left},top=${top}`
      );
      
    } catch (error) {
      console.error('Error starting Stripe Connect:', error);
      setIsConnecting(false);
      alert('Failed to connect to Stripe. Please check your API keys.');
    }
  };

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold">Payouts</h1>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Balances & Withdrawal Method */}
        <div className="xl:col-span-7 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Available Balance */}
            <div className="bg-tawny-500 p-8 rounded-3xl shadow-lg text-white relative overflow-hidden flex flex-col justify-between min-h-[240px]">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="text-tawny-100 font-medium mb-2 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" /> Available Balance
                </div>
                <div className="text-5xl font-bold mb-8">${profile.balance.toFixed(2)}</div>
              </div>
              
              <div className="relative z-10 mt-auto">
                {!profile.withdrawalMethod ? (
                  <div className="bg-tawny-600/50 p-4 rounded-xl flex items-start gap-3 border border-tawny-400/30">
                    <AlertCircle className="w-5 h-5 text-tawny-200 shrink-0 mt-0.5" />
                    <p className="text-sm text-tawny-100">Add a withdrawal method below to cash out your balance.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button 
                      onClick={handlePayout}
                      disabled={payoutStatus === 'processing' || profile.balance <= 0}
                      className={`bg-white text-tawny-600 px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors w-full flex items-center justify-center gap-3 shadow-md ${
                        (payoutStatus === 'processing' || profile.balance <= 0) ? 'opacity-90 cursor-not-allowed' : ''
                      }`}
                    >
                      {payoutStatus === 'processing' ? (
                        <><Loader2 className="w-6 h-6 animate-spin" /> Processing Payout...</>
                      ) : payoutStatus === 'success' ? (
                        <><CheckCircle2 className="w-6 h-6 text-green-500" /> Payout Successful</>
                      ) : payoutStatus === 'error' ? (
                        <><AlertCircle className="w-6 h-6 text-red-500" /> Payout Failed</>
                      ) : (
                        <><Building2 className="w-6 h-6" /> Withdraw to Bank</>
                      )}
                    </button>
                    {payoutError && (
                      <p className="text-xs text-red-200 text-center bg-red-900/50 p-2 rounded-lg backdrop-blur-sm">
                        {payoutError}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Total Paid Out */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center min-h-[240px]">
              <div className="text-text-secondary font-medium mb-2 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-gray-400" /> Total Paid Out
              </div>
              <div className="text-5xl font-bold text-gray-900">${profile.totalPaidOut.toFixed(2)}</div>
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-sm text-text-secondary flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Processed securely via Stripe
                </p>
              </div>
            </div>
          </div>

          {/* Withdrawal Method */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">Withdrawal Method</h2>
              {!profile.withdrawalMethod && (
                <button 
                  onClick={handleAddMethod}
                  disabled={isConnecting}
                  className="flex items-center gap-2 text-sm font-medium text-tawny-600 bg-tawny-50 hover:bg-tawny-100 px-4 py-2 rounded-lg transition-colors disabled:opacity-70"
                >
                  {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {isConnecting ? 'Connecting...' : 'Add Method'}
                </button>
              )}
            </div>
            
            <div className="p-6">
              {profile.withdrawalMethod ? (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
                      {profile.withdrawalMethod.type === 'bank_account' ? (
                        <Building2 className="w-6 h-6 text-gray-600" />
                      ) : (
                        <CreditCard className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {profile.withdrawalMethod.bankName || 'Bank Account'}
                      </p>
                      <p className="text-sm text-text-secondary">
                        •••• {profile.withdrawalMethod.last4}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                    <button 
                      onClick={() => updateProfile({ withdrawalMethod: null, stripeAccountStatus: 'pending' })}
                      className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No withdrawal method</h3>
                  <p className="text-text-secondary mb-6 max-w-sm mx-auto">
                    Add a bank account or debit card to receive your earnings.
                  </p>
                  <button 
                    onClick={handleAddMethod}
                    disabled={isConnecting}
                    className="inline-flex items-center gap-2 bg-tawny-500 hover:bg-tawny-600 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm disabled:opacity-70"
                  >
                    {isConnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                    {isConnecting ? 'Connecting to Stripe...' : 'Add Bank Account'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: History & Insights */}
        <div className="xl:col-span-5 space-y-8">
          
          {/* Next Expected Payout */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Next Automatic Payout</h2>
                <p className="text-sm text-text-secondary">Scheduled for the 1st of next month</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
              <span className="text-gray-600 font-medium">Pending Balance</span>
              <span className="font-bold text-gray-900">${profile.balance.toFixed(2)}</span>
            </div>
          </div>

          {/* Payout History */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">Payout History</h2>
              <button className="text-sm text-tawny-600 font-medium hover:text-tawny-700">View All</button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {profile.totalPaidOut === 0 ? (
                <div className="p-12 text-center h-full flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArrowRightLeft className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No payouts yet</h3>
                  <p className="text-text-secondary text-sm max-w-[200px] mx-auto">Your payout history will appear here once you withdraw funds.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {/* Mock a few historical payouts if totalPaidOut > 0 */}
                  <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Manual Payout</p>
                        <p className="text-xs text-text-secondary">To {profile.withdrawalMethod?.bankName || 'Bank'} •••• {profile.withdrawalMethod?.last4 || '6789'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${profile.totalPaidOut.toFixed(2)}</p>
                      <p className="text-xs text-green-600 font-medium">Completed</p>
                    </div>
                  </div>
                  
                  {/* Fake older payout to fill space */}
                  {profile.totalPaidOut > 50 && (
                    <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">Automatic Payout</p>
                          <p className="text-xs text-text-secondary">To {profile.withdrawalMethod?.bankName || 'Bank'} •••• {profile.withdrawalMethod?.last4 || '6789'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">$45.00</p>
                        <p className="text-xs text-text-secondary font-medium">Oct 1, 2025</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
