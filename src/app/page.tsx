"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface StatsOverview {
  totalQuestions: number;
  totalAnswered: number;
  correctCount: number;
  accuracy: number;
  streak: number;
  todayCount: number;
}

interface TopicStat {
  subTopicId: string;
  subTopicName: string;
  topicName: string;
  subjectName: string;
  accuracy: number;
  totalAnswered: number;
  weaknessLevel: number;
}

export default function Dashboard() {
  const [overview, setOverview] = useState<StatsOverview | null>(null);
  const [weakTopics, setWeakTopics] = useState<TopicStat[]>([]);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        if (data.overview) setOverview(data.overview);
        if (data.topicStats) {
          setWeakTopics(data.topicStats.filter((t: TopicStat) => t.weaknessLevel >= 2));
        }
      })
      .catch(() => {});
  }, []);

  const o = overview || {
    totalQuestions: 0,
    totalAnswered: 0,
    accuracy: 0,
    streak: 0,
    todayCount: 0,
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* Ozet Kartlari */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Toplam Soru"
          value={`${o.totalQuestions}`}
          subtitle="veritabaninda"
          color="blue"
        />
        <StatCard
          title="Cozulen"
          value={`${o.totalAnswered}`}
          subtitle="soru cozuldu"
          color="green"
        />
        <StatCard
          title="Basari"
          value={`%${o.accuracy}`}
          subtitle="genel ortalama"
          color="purple"
        />
        <StatCard
          title="Streak"
          value={`${o.streak} gun`}
          subtitle="ardisik calisma"
          color="orange"
        />
      </div>

      {/* Hizli Erisim */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          href="/quiz?mode=mixed"
          className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="text-3xl mb-3">🎲</div>
          <h3 className="text-lg font-semibold mb-1">Karisik Test</h3>
          <p className="text-sm text-gray-500">
            Tum konulardan rastgele sorularla kendini test et
          </p>
        </Link>

        <Link
          href="/quiz?mode=spaced"
          className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="text-3xl mb-3">🔄</div>
          <h3 className="text-lg font-semibold mb-1">Tekrar Et</h3>
          <p className="text-sm text-gray-500">
            Aralikli tekrar ile zayif konularini pekistir
          </p>
        </Link>

        <Link
          href="/topics"
          className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="text-3xl mb-3">📚</div>
          <h3 className="text-lg font-semibold mb-1">Konuya Gore Calis</h3>
          <p className="text-sm text-gray-500">
            Belirli bir konu secip odaklanarak calis
          </p>
        </Link>

        <Link
          href="/quiz?mode=adaptive"
          className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="text-3xl mb-3">🤖</div>
          <h3 className="text-lg font-semibold mb-1">AI Onerisi</h3>
          <p className="text-sm text-gray-500">
            Yapay zeka zayif noktalarini analiz ederek soru secer
          </p>
        </Link>
      </div>

      {/* Zayif Konular */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Zayif Konular</h3>
        {weakTopics.length === 0 ? (
          <p className="text-sm text-gray-400">
            Henuz yeterli veri yok. Soru cozmeye baslayinca burada zayif konularin gorunecek.
          </p>
        ) : (
          <div className="space-y-3">
            {weakTopics.map((t) => (
              <div
                key={t.subTopicId}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium">
                    {t.subjectName} &gt; {t.topicName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t.totalAnswered} soru cozuldu
                  </p>
                </div>
                <p className="text-lg font-bold text-red-600">%{t.accuracy}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  color: "blue" | "green" | "purple" | "orange";
}) {
  const colorMap = {
    blue: "text-blue-700",
    green: "text-green-700",
    purple: "text-purple-700",
    orange: "text-orange-700",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-3xl font-bold mt-1 ${colorMap[color]}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}
