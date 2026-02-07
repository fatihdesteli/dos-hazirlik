import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Quiz cevaplarini say
    const answers = await prisma.userAnswer.findMany({
      where: { quizId: id },
    });

    const correctCount = answers.filter((a) => a.isCorrect).length;
    const wrongCount = answers.filter((a) => !a.isCorrect).length;

    // Quiz guncelle
    await prisma.quiz.update({
      where: { id },
      data: {
        isCompleted: true,
        correctCount,
        wrongCount,
        completedAt: new Date(),
      },
    });

    // Gunluk aktivite guncelle
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.dailyActivity.upsert({
      where: { date: today },
      update: {
        questionsAnswered: { increment: answers.length },
        correctCount: { increment: correctCount },
      },
      create: {
        date: today,
        questionsAnswered: answers.length,
        correctCount,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quiz tamamlanamadi:", error);
    return NextResponse.json(
      { error: "Quiz tamamlanamadi" },
      { status: 500 }
    );
  }
}
