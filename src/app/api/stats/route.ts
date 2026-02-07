import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculateAccuracy, calculateStreak } from "@/lib/scoring";

export async function GET() {
  try {
    // Genel istatistikler
    const totalQuestions = await prisma.question.count();
    const allAnswers = await prisma.userAnswer.findMany({
      select: { isCorrect: true },
    });
    const totalAnswered = allAnswers.length;
    const correctCount = allAnswers.filter((a) => a.isCorrect).length;
    const accuracy = calculateAccuracy(correctCount, totalAnswered);

    // Streak hesapla
    const activities = await prisma.dailyActivity.findMany({
      select: { date: true },
      orderBy: { date: "desc" },
    });
    const streak = calculateStreak(activities.map((a) => a.date));

    // Bugunun aktivitesi
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayActivity = await prisma.dailyActivity.findUnique({
      where: { date: today },
    });
    const todayCount = todayActivity?.questionsAnswered || 0;

    // Konu bazli istatistikler
    const topicStatsRaw = await prisma.topicStats.findMany({
      where: { totalAnswered: { gte: 1 } },
      orderBy: { accuracy: "asc" },
    });

    const subTopicIds = topicStatsRaw.map((s) => s.subTopicId);
    const subTopics = await prisma.subTopic.findMany({
      where: { id: { in: subTopicIds } },
      include: {
        topic: {
          include: { subject: true },
        },
      },
    });
    const subTopicMap = new Map(subTopics.map((st) => [st.id, st]));

    const topicStats = topicStatsRaw
      .filter((s) => subTopicMap.has(s.subTopicId))
      .map((s) => {
        const st = subTopicMap.get(s.subTopicId)!;
        return {
          subTopicId: s.subTopicId,
          subTopicName: st.name,
          topicName: st.topic.name,
          subjectName: st.topic.subject.name,
          accuracy: s.accuracy,
          totalAnswered: s.totalAnswered,
          weaknessLevel: s.weaknessLevel,
        };
      });

    return NextResponse.json({
      overview: {
        totalQuestions,
        totalAnswered,
        correctCount,
        accuracy,
        streak,
        todayCount,
      },
      topicStats,
    });
  } catch (error) {
    console.error("Istatistikler alinamadi:", error);
    return NextResponse.json(
      { error: "Istatistikler alinamadi" },
      { status: 500 }
    );
  }
}
