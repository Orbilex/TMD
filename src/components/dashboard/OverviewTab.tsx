import React from 'react';
import { useCreator } from '../../context/CreatorContext';
import { Link } from 'react-router-dom';
import { ExternalLink, DollarSign, TrendingUp, Users } from 'lucide-react';

export default function OverviewTab() {
  const { profile } = useCreator();

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Overview</h1>
        <Link 
          to="/demo" 
          className="flex items-center gap-2 bg-white border border-gray-200 text-text-primary px-4 py-2 rounded-full font-medium shadow-sm hover:bg-gray-50 transition-colors"
        >
          <ExternalLink className="w-4 h-4" /> Live Preview
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 text-text-secondary mb-2">
            <DollarSign className="w-5 h-5 text-tawny-500" />
            <span className="font-medium">Total Earnings</span>
          </div>
          <div className="text-4xl font-bold text-gray-900">${(profile.balance + profile.totalPaidOut).toFixed(2)}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 text-text-secondary mb-2">
            <span className="text-xl">🍩</span>
            <span className="font-medium">Donuts Received</span>
          </div>
          <div className="text-4xl font-bold text-gray-900">{profile.donuts}</div>
        </div>
        <div className="bg-[#FFF4ED] p-6 rounded-2xl border border-tawny-100 shadow-sm">
          <div className="flex items-center gap-3 text-tawny-700 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Available Balance</span>
          </div>
          <div className="text-4xl font-bold text-tawny-600">${profile.balance.toFixed(2)}</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-tawny-500" /> Recent Supporters
          </h2>
        </div>
        
        {profile.transactions.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">🍩</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Waiting for your first donut</h3>
            <p className="text-text-secondary">Share your page link to start receiving support!</p>
            <Link 
              to="/demo" 
              className="mt-6 inline-flex items-center gap-2 bg-tawny-500 text-white px-6 py-3 rounded-full font-medium hover:bg-tawny-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> View My Page
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {profile.transactions.map((tx) => (
              <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-tawny-50 text-tawny-600 rounded-full flex items-center justify-center font-bold text-lg">
                    {tx.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{tx.name}</p>
                    <p className="text-sm text-text-secondary">Bought {tx.donuts} donut{tx.donuts > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${tx.amount.toFixed(2)}</p>
                  <p className="text-sm text-text-secondary">
                    {new Date(tx.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
