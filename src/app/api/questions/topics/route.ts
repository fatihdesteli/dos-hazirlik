import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { order: "asc" },
      include: {
        topics: {
          orderBy: { order: "asc" },
          include: {
            subTopics: {
              orderBy: { order: "asc" },
              include: {
                _count: { select: { questions: true } },
              },
            },
          },
        },
      },
    });

    const result = subjects.map((s) => ({
      ...s,
      topics: s.topics.map((t) => ({
        ...t,
        subTopics: t.subTopics.map((st) => ({
          id: st.id,
          name: st.name,
          topicId: st.topicId,
          order: st.order,
          questionCount: st._count.questions,
        })),
      })),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Konu listesi alinamadi:", error);
    return NextResponse.json([], { status: 500 });
  }
}
