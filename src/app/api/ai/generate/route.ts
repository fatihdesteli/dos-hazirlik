import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateQuestions } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subTopicId, count = 5, difficulty = 2 } = body;

    // Alt konuyu ve ust bilgilerini bul
    const subTopic = await prisma.subTopic.findUnique({
      where: { id: subTopicId },
      include: {
        topic: {
          include: { subject: true },
        },
      },
    });

    if (!subTopic) {
      return NextResponse.json(
        { error: "Alt konu bulunamadi" },
        { status: 404 }
      );
    }

    // AI ile soru uret
    const generated = await generateQuestions(
      subTopic.topic.subject.name,
      subTopic.topic.name,
      subTopic.name,
      count,
      difficulty
    );

    // Veritabanina kaydet
    const created = await prisma.question.createMany({
      data: generated.map((q) => ({
        text: q.text,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        optionE: q.optionE || null,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        subTopicId,
      })),
    });

    return NextResponse.json({
      success: true,
      count: created.count,
      message: `${created.count} soru olusturuldu`,
    });
  } catch (error) {
    console.error("Soru uretimi hatasi:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Soru uretimi basarisiz",
      },
      { status: 500 }
    );
  }
}
