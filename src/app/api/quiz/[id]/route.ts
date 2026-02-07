import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        answers: {
          include: {
            question: {
              include: {
                subTopic: {
                  include: {
                    topic: {
                      include: { subject: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz bulunamadi" }, { status: 404 });
    }

    // Quiz sorularini getir (cevaplananlar haric yeni sorulari da dahil et)
    // Bu endpoint quiz baslatildiginda zaten sorulari donduruyor,
    // ancak sayfa yenilenirse sorulari tekrar getirebilmek icin
    const questions = await prisma.question.findMany({
      where: {
        answers: {
          some: { quizId: id },
        },
      },
      include: {
        subTopic: {
          include: {
            topic: {
              include: { subject: true },
            },
          },
        },
      },
    });

    return NextResponse.json({
      ...quiz,
      questions: questions.length > 0 ? questions : [],
    });
  } catch (error) {
    console.error("Quiz getirilemedi:", error);
    return NextResponse.json(
      { error: "Quiz getirilemedi" },
      { status: 500 }
    );
  }
}
