"use client";

import { useState, useEffect } from "react";

interface TopicStat {
  subTopicId: string;
  subTopicName: string;
  topicName: string;
  subjectName: string;
  accuracy: number;
  totalAnswered: number;
  weaknessLevel: number;
}

interface StatsData {
  overview: {
    totalQuestions: number;
    totalAnswered: number;
    correctCount: number;
    accuracy: number;
    streak: number;
    todayCount: number;
  };
  topicStats: TopicStat[];
}

export default function StatsPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((d) => {
        if (d.overview && d.topicStats) {
          setData(d);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchAIAnalysis = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch("/api/ai/adaptive");
      const d = await res.json();
      setAiAnalysis(d.analysis);
    } catch {
      setAiAnalysis("Analiz yapilamadi.");
    } finally {
      setLoadingAI(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <p className="text-gray-400">Yukleniyor...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto">
        <p className="text-gray-400">Veri yuklenemedi.</p>
      </div>
    );
  }

  const { overview, topicStats } = data;
  const weakTopics = topicStats.filter((t) => t.weaknessLevel >= 2);
  const strongTopics = topicStats.filter((t) => t.weaknessLevel === 1);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Istatistikler</h2>

      {/* Genel Ozet */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Cozulen Soru</p>
          <p className="text-3xl font-bold text-blue-700 mt-1">
            {overview.totalAnswered}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Basari Orani</p>
          <p className="text-3xl font-bold text-green-700 mt-1">
            %{overview.accuracy}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Streak</p>
          <p className="text-3xl font-bold text-orange-600 mt-1">
            {overview.streak} gun
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Bugun</p>
          <p className="text-3xl font-bold text-purple-700 mt-1">
            {overview.todayCount}
          </p>
        </div>
      </div>

      {/* AI Analizi */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">AI Analizi</h3>
          <button
            onClick={fetchAIAnalysis}
            disabled={loadingAI}
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loadingAI ? "Analiz ediliyor..." : "Analiz Et"}
          </button>
        </div>
        {aiAnalysis ? (
          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {aiAnalysis}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            Yapay zeka analizini gormek icin butona tiklayin.
          </p>
        )}
      </div>

      {/* Zayif Konular */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-red-600">
          Zayif Konular
        </h3>
        {weakTopics.length === 0 ? (
          <p className="text-sm text-gray-400">
            Zayif konu bulunmadi. Harika gidiyorsun!
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
                    {t.subjectName} &gt; {t.topicName} &gt; {t.subTopicName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t.totalAnswered} soru cozuldu
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">
                    %{t.accuracy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guclu Konular */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4 text-green-600">
          Guclu Konular
        </h3>
        {strongTopics.length === 0 ? (
          <p className="text-sm text-gray-400">
            Henuz guclu konu belirlenmedi. Soru cozmeye devam et!
          </p>
        ) : (
          <div className="space-y-3">
            {strongTopics.map((t) => (
              <div
                key={t.subTopicId}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium">
                    {t.subjectName} &gt; {t.topicName} &gt; {t.subTopicName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t.totalAnswered} soru cozuldu
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    %{t.accuracy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
