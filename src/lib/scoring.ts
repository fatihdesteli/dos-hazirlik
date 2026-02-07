/**
 * Zayiflik seviyesi hesaplama
 * 0 = Henuz veri yok
 * 1 = Guclu (>= %80 basari)
 * 2 = Orta (%50-%79 basari)
 * 3 = Zayif (< %50 basari)
 */
export function calculateWeaknessLevel(
  correctCount: number,
  totalAnswered: number
): number {
  if (totalAnswered < 3) return 0; // Yeterli veri yok

  const accuracy = (correctCount / totalAnswered) * 100;

  if (accuracy >= 80) return 1;
  if (accuracy >= 50) return 2;
  return 3;
}

/**
 * Basari oranini yuzde olarak hesapla
 */
export function calculateAccuracy(
  correctCount: number,
  totalAnswered: number
): number {
  if (totalAnswered === 0) return 0;
  return Math.round((correctCount / totalAnswered) * 100);
}

/**
 * Streak (ardisik gun) hesaplama
 */
export function calculateStreak(
  activityDates: Date[]
): number {
  if (activityDates.length === 0) return 0;

  const sorted = activityDates
    .map((d) => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActivity = new Date(sorted[0]);
  lastActivity.setHours(0, 0, 0, 0);

  // Bugun veya dun aktivite yoksa streak 0
  const diffDays = Math.floor(
    (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays > 1) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const current = new Date(sorted[i - 1]);
    current.setHours(0, 0, 0, 0);
    const prev = new Date(sorted[i]);
    prev.setHours(0, 0, 0, 0);

    const diff = Math.floor(
      (current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
