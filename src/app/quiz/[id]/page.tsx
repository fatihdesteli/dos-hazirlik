"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import QuestionCard from "@/components/QuestionCard";
import QuizResults from "@/components/QuizResults";
import type { QuestionWithOptions } from "@/types";

interface QuizData {
  id: string;
  questions: QuestionWithOptions[];
  mode: string;
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<
    Record<string, { answer: string; isCorrect: boolean }>
  >({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Once sessionStorage'dan kontrol et (yeni olusturulmus quiz)
    const cached = sessionStorage.getItem(`quiz_${quizId}`);
    if (cached) {
      try {
        const data = JSON.parse(cached);
        if (data.quizId && data.questions?.length > 0) {
          setQuiz({ id: data.quizId, questions: data.questions, mode: data.mode || "mixed" });
          setLoading(false);
          sessionStorage.removeItem(`quiz_${quizId}`);
          return;
        }
      } catch { /* fall through to API */ }
    }

    fetch(`/api/quiz/${quizId}`)
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        if (data.id && data.questions) {
          setQuiz(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [quizId]);

  const handleAnswer = async (
    questionId: string,
    answer: string,
    isCorrect: boolean
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { answer, isCorrect },
    }));

    // Cevabi kaydet
    await fetch("/api/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId,
        givenAnswer: answer,
        isCorrect,
        quizId,
      }),
    });
  };

  const handleNext = () => {
    if (!quiz) return;

    if (currentIndex + 1 >= quiz.questions.length) {
      setIsCompleted(true);
      // Quizi tamamla
      fetch(`/api/quiz/${quizId}/complete`, { method: "POST" });
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <p className="text-gray-400">Yukleniyor...</p>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <p className="text-gray-400">
          {!quiz ? "Quiz bulunamadi." : "Bu quiz icin soru bulunamadi. Once konular sayfasindan soru uretin."}
        </p>
      </div>
    );
  }

  if (isCompleted) {
    const correctCount = Object.values(answers).filter(
      (a) => a.isCorrect
    ).length;
    const wrongCount = Object.values(answers).filter(
      (a) => !a.isCorrect
    ).length;

    return (
      <QuizResults
        totalQuestions={quiz.questions.length}
        correctCount={correctCount}
        wrongCount={wrongCount}
        answers={answers}
        questions={quiz.questions}
        onRetry={() => router.push("/quiz")}
        onHome={() => router.push("/")}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Ilerleme</span>
          <span>
            {Object.keys(answers).length} / {quiz.questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                (Object.keys(answers).length / quiz.questions.length) * 100
              }%`,
            }}
          />
        </div>
      </div>

      <QuestionCard
        question={quiz.questions[currentIndex]}
        questionNumber={currentIndex + 1}
        totalQuestions={quiz.questions.length}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </div>
  );
}
