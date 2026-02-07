"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SubjectWithTopics, QuizConfig } from "@/types";

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto"><p className="text-gray-400">Yukleniyor...</p></div>}>
      <QuizSetup />
    </Suspense>
  );
}

function QuizSetup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");

  const [subjects, setSubjects] = useState<SubjectWithTopics[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [mode, setMode] = useState<QuizConfig["mode"]>(
    (modeParam as QuizConfig["mode"]) || "mixed"
  );
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(10);

  useEffect(() => {
    fetch("/api/questions/topics")
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleStartQuiz = async () => {
    setCreating(true);
    try {
      const config: QuizConfig = {
        mode,
        questionCount,
        ...(mode === "topic" && { topicIds: selectedTopics }),
      };

      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      if (data.quizId) {
        router.push(`/quiz/${data.quizId}`);
      }
    } catch (err) {
      console.error("Quiz olusturulamadi:", err);
    } finally {
      setCreating(false);
    }
  };

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <p className="text-gray-400">Yukleniyor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Test Olustur</h2>

      {/* Mod Secimi */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Test Modu</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "mixed", label: "Karisik", desc: "Tum konulardan rastgele" },
            { key: "topic", label: "Konu Bazli", desc: "Belirli konulardan" },
            {
              key: "adaptive",
              label: "AI Onerisi",
              desc: "Zayif konulara odaklan",
            },
            {
              key: "spaced",
              label: "Tekrar",
              desc: "Aralikli tekrar sorulari",
            },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key as QuizConfig["mode"])}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                mode === m.key
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className="font-medium text-sm">{m.label}</p>
              <p className="text-xs text-gray-500 mt-1">{m.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Konu Secimi (sadece konu bazli modda) */}
      {mode === "topic" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Konu Sec
          </h3>
          {subjects.length === 0 ? (
            <p className="text-sm text-gray-400">
              Henuz konu eklenmemis. Konular sayfasindan konu ekleyin.
            </p>
          ) : (
            <div className="space-y-4">
              {subjects.map((subject) => (
                <div key={subject.id}>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {subject.name}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {subject.topics.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => toggleTopic(topic.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          selectedTopics.includes(topic.id)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {topic.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Soru Sayisi */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Soru Sayisi
        </h3>
        <div className="flex gap-3">
          {[5, 10, 15, 20, 30].map((n) => (
            <button
              key={n}
              onClick={() => setQuestionCount(n)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                questionCount === n
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Baslat */}
      <button
        onClick={handleStartQuiz}
        disabled={creating || (mode === "topic" && selectedTopics.length === 0)}
        className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {creating ? "Olusturuluyor..." : "Testi Baslat"}
      </button>
    </div>
  );
}
