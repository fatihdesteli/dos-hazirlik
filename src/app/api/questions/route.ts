import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subTopicId = searchParams.get("subTopicId");
  const topicId = searchParams.get("topicId");
  const limit = parseInt(searchParams.get("limit") || "20");

  try {
    const where: Record<string, unknown> = {};

    if (subTopicId) {
      where.subTopicId = subTopicId;
    } else if (topicId) {
      where.subTopic = { topicId };
    }

    const questions = await prisma.question.findMany({
      where,
      take: limit,
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

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Sorular alinamadi:", error);
    return NextResponse.json([], { status: 500 });
  }
}
