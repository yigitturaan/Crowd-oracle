'use client';

import FinalView from '@/components/FinalView';

export default function WinPage() {
  return (
    <FinalView 
      outcome="win"
      stats={{
        correctCount: 42,
        totalCount: 150,
        percentage: 28
      }}
      prices={{
        target: 3000,
        actual: 3250.50
      }}
      userVote={{ type: 'bull' }}
    />
  );
}

