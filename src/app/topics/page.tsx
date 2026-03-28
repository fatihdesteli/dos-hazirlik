"use client";

import { useState, useEffect } from "react";
import type { SubjectWithTopics } from "@/types";

export default function TopicsPage() {
  const [subjects, setSubjects] = useState<SubjectWithTopics[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchTopics = () => {
    fetch("/api/questions/topics")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setSubjects(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleGenerate = async (
    subTopicId: string,
    subTopicName: string,
    count: number = 5
  ) => {
    setGenerating(subTopicId);
    setMessage(null);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subTopicId, count, difficulty: 2 }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage(`${subTopicName}: ${data.count} soru olusturuldu!`);
        fetchTopics(); // Listeyi guncelle
      } else {
        setMessage(`Hata: ${data.error}`);
      }
    } catch {
      setMessage("Soru uretimi sirasinda hata olustu.");
    } finally {
      setGenerating(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <p className="text-gray-400">Yukleniyor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Konular</h2>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          {message}
        </div>
      )}

      {subjects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500 mb-4">
            Henuz konu eklenmemis. Veritabanini seed ile doldurmaniz gerekiyor.
          </p>
          <code className="text-sm bg-gray-100 px-3 py-1 rounded">
            npx prisma db seed
          </code>
        </div>
      ) : (
        <div className="space-y-6">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-lg">{subject.name}</h3>
              </div>

              <div className="p-6 space-y-4">
                {subject.topics.map((topic) => (
                  <div key={topic.id}>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">
                      {topic.name}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {topic.subTopics.map((subTopic) => (
                        <div
                          key={subTopic.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="text-sm">{subTopic.name}</p>
                            <p className="text-xs text-gray-400">
                              {subTopic.questionCount} soru
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleGenerate(subTopic.id, subTopic.name)
                            }
                            disabled={generating === subTopic.id}
                            className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                          >
                            {generating === subTopic.id
                              ? "Uretiliyor..."
                              : "+5 Soru"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
