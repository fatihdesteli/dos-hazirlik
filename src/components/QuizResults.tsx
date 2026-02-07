"use client";

import type { QuestionWithOptions } from "@/types";

interface QuizResultsProps {
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  answers: Record<string, { answer: string; isCorrect: boolean }>;
  questions: QuestionWithOptions[];
  onRetry: () => void;
  onHome: () => void;
}

export default function QuizResults({
  totalQuestions,
  correctCount,
  wrongCount,
  answers,
  questions,
  onRetry,
  onHome,
}: QuizResultsProps) {
  const accuracy = Math.round((correctCount / totalQuestions) * 100);
  const wrongQuestions = questions.filter(
    (q) => answers[q.id] && !answers[q.id].isCorrect
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Test Sonucu</h2>

      {/* Ozet */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 text-center">
        <div
          className={`text-5xl font-bold mb-2 ${
            accuracy >= 80
              ? "text-green-600"
              : accuracy >= 50
              ? "text-orange-500"
              : "text-red-500"
          }`}
        >
          %{accuracy}
        </div>
        <p className="text-gray-500 text-sm">Basari Orani</p>

        <div className="flex justify-center gap-8 mt-6">
          <div>
            <p className="text-2xl font-bold text-green-600">{correctCount}</p>
            <p className="text-xs text-gray-500">Dogru</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-500">{wrongCount}</p>
            <p className="text-xs text-gray-500">Yanlis</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-600">{totalQuestions}</p>
            <p className="text-xs text-gray-500">Toplam</p>
          </div>
        </div>
      </div>

      {/* Yanlis Cevaplanan Sorular */}
      {wrongQuestions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            Yanlis Cevaplanan Sorular
          </h3>
          <div className="space-y-4">
            {wrongQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 bg-red-50 border border-red-100 rounded-lg"
              >
                <p className="text-sm font-medium mb-2">
                  {idx + 1}. {q.text}
                </p>
                <p className="text-xs text-red-600 mb-1">
                  Senin cevabin:{" "}
                  <strong>{answers[q.id]?.answer}</strong> | Dogru cevap:{" "}
                  <strong>{q.correctAnswer}</strong>
                </p>
                <p className="text-xs text-gray-600 mt-2 bg-white p-2 rounded">
                  {q.explanation}
                </p>
                {q.subTopic && (
                  <p className="text-xs text-gray-400 mt-1">
                    {q.subTopic.topic.subject.name} &gt;{" "}
                    {q.subTopic.topic.name} &gt; {q.subTopic.name}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Butonlar */}
      <div className="flex gap-4">
        <button
          onClick={onRetry}
          className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
        >
          Yeni Test
        </button>
        <button
          onClick={onHome}
          className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}
