/**
 * SM-2 Spaced Repetition Algorithm
 * Kaynak: https://en.wikipedia.org/wiki/SuperMemo#Algorithm_SM-2
 *
 * quality: Kullanicinin performansi (0-5)
 *   0 = Hic bilmiyor
 *   1 = Yanlis cevap ama tanimi biraz hatirladi
 *   2 = Yanlis cevap
 *   3 = Dogru ama zorlanarak
 *   4 = Dogru, biraz dusundu
 *   5 = Dogru, hemen bildi
 */

interface SM2Result {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: Date;
}

export function calculateSM2(
  quality: number,
  prevEaseFactor: number,
  prevInterval: number,
  prevRepetitions: number
): SM2Result {
  let easeFactor = prevEaseFactor;
  let interval: number;
  let repetitions: number;

  if (quality >= 3) {
    // Dogru cevap
    if (prevRepetitions === 0) {
      interval = 1;
    } else if (prevRepetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(prevInterval * easeFactor);
    }
    repetitions = prevRepetitions + 1;
  } else {
    // Yanlis cevap - bastan basla
    repetitions = 0;
    interval = 1;
  }

  // Ease factor guncelle
  easeFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Minimum ease factor
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    easeFactor: Math.round(easeFactor * 100) / 100,
    interval,
    repetitions,
    nextReview,
  };
}

/**
 * Kullanicinin cevabina gore SM-2 quality puani hesapla
 */
export function getQualityFromAnswer(
  isCorrect: boolean,
  timeSpentSeconds?: number
): number {
  if (!isCorrect) return 1;

  // Dogru cevap + sure bazli derecelendirme
  if (timeSpentSeconds === undefined) return 4;
  if (timeSpentSeconds <= 10) return 5; // Hizli dogru
  if (timeSpentSeconds <= 30) return 4; // Normal dogru
  return 3; // Yavas ama dogru
}
