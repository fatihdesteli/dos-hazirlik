import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { analyzeWeaknesses } from "@/lib/ai";

export async function GET() {
  try {
    // Tum konu istatistiklerini getir
    const topicStats = await prisma.topicStats.findMany({
      where: { totalAnswered: { gte: 1 } },
      orderBy: { accuracy: "asc" },
    });

    if (topicStats.length === 0) {
      return NextResponse.json({
        analysis: "Henuz yeterli veri yok. Soru cozmeye basla!",
        weakTopics: [],
      });
    }

    // Alt konu bilgilerini getir
    const subTopicIds = topicStats.map((s) => s.subTopicId);
    const subTopics = await prisma.subTopic.findMany({
      where: { id: { in: subTopicIds } },
      include: {
        topic: {
          include: { subject: true },
        },
      },
    });

    const subTopicMap = new Map(subTopics.map((st) => [st.id, st]));

    const statsWithNames = topicStats
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

    // AI analizi
    const analysis = await analyzeWeaknesses(statsWithNames);

    // Zayif konulari dondur
    const weakTopics = statsWithNames
      .filter((s) => s.weaknessLevel >= 2)
      .slice(0, 5);

    return NextResponse.json({ analysis, weakTopics });
  } catch (error) {
    console.error("Adaptif analiz hatasi:", error);
    return NextResponse.json(
      { error: "Analiz yapilamadi" },
      { status: 500 }
    );
  }
}
