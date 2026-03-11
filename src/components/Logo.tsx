import React from 'react';

export default function Logo() {
  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 shadow-sm" style={{ backgroundColor: '#FF7300' }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="7" />
      </svg>
    </div>
  );
}
