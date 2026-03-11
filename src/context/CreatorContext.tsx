import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Transaction {
  id: string;
  name: string;
  donuts: number;
  amount: number;
  date: string;
}

export interface WithdrawalMethod {
  type: 'bank_account' | 'debit_card';
  last4: string;
  bankName?: string;
}

export interface CreatorProfile {
  name: string;
  slug: string;
  bio: string;
  donuts: number;
  balance: number;
  totalPaidOut: number;
  isBoarded: boolean;
  accentColor: string;
  transactions: Transaction[];
  withdrawalMethod: WithdrawalMethod | null;
  stripeAccountId?: string;
  stripeAccountStatus?: 'pending' | 'active';
}

const defaultProfile: CreatorProfile = {
  name: 'Jane Doe',
  slug: 'jane-doe',
  bio: 'Creating awesome open-source tools and tutorials.',
  donuts: 0,
  balance: 0,
  totalPaidOut: 0,
  isBoarded: false,
  accentColor: '#CD5700', // Default Tawny
  transactions: [],
  withdrawalMethod: null,
};

interface CreatorContextType {
  profile: CreatorProfile;
  updateProfile: (updates: Partial<CreatorProfile>) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void;
  withdrawFunds: () => void;
  resetProfile: () => void;
}

const CreatorContext = createContext<CreatorContextType | undefined>(undefined);

export function CreatorProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<CreatorProfile>(() => {
    const saved = localStorage.getItem('creator_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse creator profile', e);
      }
    }
    return defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem('creator_profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<CreatorProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addTransaction = (tx: Omit<Transaction, 'id' | 'date'>) => {
    const newTx: Transaction = {
      ...tx,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    setProfile(prev => ({
      ...prev,
      donuts: prev.donuts + tx.donuts,
      balance: prev.balance + tx.amount,
      transactions: [newTx, ...prev.transactions],
    }));
  };

  const withdrawFunds = () => {
    setProfile(prev => ({
      ...prev,
      totalPaidOut: prev.totalPaidOut + prev.balance,
      balance: 0,
    }));
  };

  const resetProfile = () => {
    setProfile(defaultProfile);
  };

  return (
    <CreatorContext.Provider value={{ profile, updateProfile, addTransaction, withdrawFunds, resetProfile }}>
      {children}
    </CreatorContext.Provider>
  );
}

export function useCreator() {
  const context = useContext(CreatorContext);
  if (context === undefined) {
    throw new Error('useCreator must be used within a CreatorProvider');
  }
  return context;
}
