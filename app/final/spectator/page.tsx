import FinalView from '@/components/FinalView';

export default function DemoSpectatorPage() {
  // SUNUM İÇİN SABİT "İZLEYİCİ" EKRANI
  // Hiç oy vermemiş birinin göreceği ekranın demosudur.
  
  return (
    <FinalView 
      outcome="spectator" 
      stats={{
        correctCount: 42,
        totalCount: 150,
        percentage: 28
      }}
      prices={{
        target: 3000,
        actual: 3407.50
      }}
    />
  );
}