// TARİHLERİ BURADAN YÖNETİYORUZ (2025-2026 Takvimi)
// Voting Deadline: 28 Aralık 2025 00:00:00 (Bu andan itibaren Lockdown başlar)
// Final Date: 1 Ocak 2026 00:00:00 (Bu andan itibaren Sonuçlar açıklanır)

export const VOTING_DEADLINE = new Date('2025-12-28T00:00:00').getTime();
export const FINAL_DATE = new Date('2026-01-01T00:00:00').getTime();

export type GameStage = 'VOTING' | 'LOCKDOWN' | 'FINAL';

export function getCurrentStage(): GameStage {
  const now = Date.now();

  if (now >= FINAL_DATE) {
    return 'FINAL';
  } else if (now >= VOTING_DEADLINE) {
    return 'LOCKDOWN';
  } else {
    return 'VOTING';
  }
}

