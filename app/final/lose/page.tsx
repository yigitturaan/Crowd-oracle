'use client';

import FinalView from '@/components/FinalView';

export default function LosePage() {
  return (
    <FinalView 
      outcome="lose"
      stats={{
        correctCount: 12,
        totalCount: 150,
        percentage: 8
      }}
      prices={{
        target: 3000,
        actual: 2840.20
      }}
      userVote={{ type: 'bull' }}
    />
  );
}

