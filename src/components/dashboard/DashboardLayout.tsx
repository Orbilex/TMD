import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Palette, CreditCard, LogOut, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';
import { useCreator } from '../../context/CreatorContext';
import OverviewTab from './OverviewTab';
import CustomizationTab from './CustomizationTab';
import PayoutsTab from './PayoutsTab';

export default function DashboardLayout() {
  const { profile, resetProfile } = useCreator();
  const [activeTab, setActiveTab] = useState<'overview' | 'customization' | 'payouts'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'customization', label: 'My Page', icon: Palette },
    { id: 'payouts', label: 'Payouts', icon: CreditCard },
  ];

  return (
    <div className="flex h-screen bg-bg-main overflow-hidden w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <Logo />
          <span className="font-bold text-lg truncate">{profile.name}</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive 
                    ? 'bg-tawny-50 text-tawny-600' 
                    : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link
            to="/demo"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            View Live Page
          </Link>
          <button
            onClick={resetProfile}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <OverviewTab />
            </motion.div>
          )}
          {activeTab === 'customization' && (
            <motion.div
              key="customization"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <CustomizationTab />
            </motion.div>
          )}
          {activeTab === 'payouts' && (
            <motion.div
              key="payouts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <PayoutsTab />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
