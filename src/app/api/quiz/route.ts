import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { QuizConfig } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const config: QuizConfig = await request.json();
    const { mode, questionCount, topicIds, subTopicIds } = config;

    // Soru filtreleme kosullari
    const where: Record<string, unknown> = {};

    if (mode === "topic") {
      if (subTopicIds && subTopicIds.length > 0) {
        where.subTopicId = { in: subTopicIds };
      } else if (topicIds && topicIds.length > 0) {
        where.subTopic = { topicId: { in: topicIds } };
      }
    } else if (mode === "adaptive") {
      // Zayif konulardaki sorulari getir
      const weakTopics = await prisma.topicStats.findMany({
        where: { weaknessLevel: { gte: 2 } },
        orderBy: { accuracy: "asc" },
        take: 5,
      });

      if (weakTopics.length > 0) {
        where.subTopicId = { in: weakTopics.map((t) => t.subTopicId) };
      }
    } else if (mode === "spaced") {
      // Tekrar zamani gelen sorulari getir
      const dueRepetitions = await prisma.spacedRepetition.findMany({
        where: { nextReview: { lte: new Date() } },
        orderBy: { nextReview: "asc" },
        take: questionCount,
        select: { questionId: true },
      });

      if (dueRepetitions.length > 0) {
        where.id = { in: dueRepetitions.map((r) => r.questionId) };
      }
    }

    // Rastgele soru sec
    const totalAvailable = await prisma.question.count({ where });

    let questions: Awaited<ReturnType<typeof prisma.question.findMany>> = [];
    if (totalAvailable === 0) {
      // Hic soru yoksa bos quiz olustur
      questions = [];
    } else {
      // Rastgele secim icin skip kullan
      const skip = Math.max(0, Math.floor(Math.random() * Math.max(0, totalAvailable - questionCount)));
      questions = await prisma.question.findMany({
        where,
        take: questionCount,
        skip,
        include: {
          subTopic: {
            include: {
              topic: {
                include: {
                  subject: true,
                },
              },
            },
          },
        },
      });
    }

    // Quiz olustur
    const quiz = await prisma.quiz.create({
      data: {
        mode,
        totalQuestions: questions.length,
        title:
          mode === "mixed"
            ? "Karisik Test"
            : mode === "topic"
            ? "Konu Testi"
            : mode === "adaptive"
            ? "AI Onerisi"
            : "Tekrar Testi",
      },
    });

    return NextResponse.json({
      quizId: quiz.id,
      questions,
    });
  } catch (error) {
    console.error("Quiz olusturulamadi:", error);
    return NextResponse.json(
      { error: "Quiz olusturulamadi" },
      { status: 500 }
    );
  }
}
