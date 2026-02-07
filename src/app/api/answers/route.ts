import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculateSM2, getQualityFromAnswer } from "@/lib/spaced-repetition";
import { calculateWeaknessLevel, calculateAccuracy } from "@/lib/scoring";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, givenAnswer, isCorrect, quizId, timeSpent } = body;

    // Cevabi kaydet
    await prisma.userAnswer.create({
      data: {
        questionId,
        givenAnswer,
        isCorrect,
        quizId: quizId || null,
        timeSpent: timeSpent || null,
      },
    });

    // Sorunun alt konusunu bul
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { subTopicId: true },
    });

    if (question) {
      // Konu istatistiklerini guncelle
      const stats = await prisma.topicStats.upsert({
        where: { subTopicId: question.subTopicId },
        update: {
          totalAnswered: { increment: 1 },
          correctCount: isCorrect ? { increment: 1 } : undefined,
          wrongCount: !isCorrect ? { increment: 1 } : undefined,
          lastPracticed: new Date(),
        },
        create: {
          subTopicId: question.subTopicId,
          totalAnswered: 1,
          correctCount: isCorrect ? 1 : 0,
          wrongCount: isCorrect ? 0 : 1,
          lastPracticed: new Date(),
        },
      });

      // Zayiflik seviyesini ve basari oranini guncelle
      const weaknessLevel = calculateWeaknessLevel(
        stats.correctCount,
        stats.totalAnswered
      );
      const accuracy = calculateAccuracy(
        stats.correctCount,
        stats.totalAnswered
      );

      await prisma.topicStats.update({
        where: { subTopicId: question.subTopicId },
        data: { weaknessLevel, accuracy },
      });

      // Spaced Repetition guncelle
      const quality = getQualityFromAnswer(isCorrect, timeSpent);
      const existing = await prisma.spacedRepetition.findUnique({
        where: { questionId },
      });

      if (existing) {
        const sm2 = calculateSM2(
          quality,
          existing.easeFactor,
          existing.interval,
          existing.repetitions
        );
        await prisma.spacedRepetition.update({
          where: { questionId },
          data: sm2,
        });
      } else {
        const sm2 = calculateSM2(quality, 2.5, 1, 0);
        await prisma.spacedRepetition.create({
          data: {
            questionId,
            ...sm2,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cevap kaydedilemedi:", error);
    return NextResponse.json(
      { error: "Cevap kaydedilemedi" },
      { status: 500 }
    );
  }
}
