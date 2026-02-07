"use client";

import { useState } from "react";
import type { QuestionWithOptions } from "@/types";

interface QuestionCardProps {
  question: QuestionWithOptions;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (questionId: string, answer: string, isCorrect: boolean) => void;
  onNext: () => void;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime] = useState(Date.now());

  const options = [
    { key: "A", text: question.optionA },
    { key: "B", text: question.optionB },
    { key: "C", text: question.optionC },
    { key: "D", text: question.optionD },
    ...(question.optionE ? [{ key: "E", text: question.optionE }] : []),
  ];

  const handleSelect = (key: string) => {
    if (isAnswered) return;
    setSelectedAnswer(key);
  };

  const handleSubmit = () => {
    if (!selectedAnswer || isAnswered) return;

    const isCorrect = selectedAnswer === question.correctAnswer;
    setIsAnswered(true);
    onAnswer(question.id, selectedAnswer, isCorrect);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    onNext();
  };

  const getOptionStyle = (key: string) => {
    if (!isAnswered) {
      return selectedAnswer === key
        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
    }

    if (key === question.correctAnswer) {
      return "border-green-500 bg-green-50";
    }

    if (key === selectedAnswer && key !== question.correctAnswer) {
      return "border-red-500 bg-red-50";
    }

    return "border-gray-200 opacity-50";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">
          Soru {questionNumber} / {totalQuestions}
        </span>
        {question.subTopic && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {question.subTopic.topic.subject.name} &gt;{" "}
            {question.subTopic.topic.name} &gt; {question.subTopic.name}
          </span>
        )}
      </div>

      {/* Soru Metni */}
      <div className="p-6">
        <p className="text-base leading-relaxed mb-6">{question.text}</p>

        {/* Secenekler */}
        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option.key}
              onClick={() => handleSelect(option.key)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${getOptionStyle(
                option.key
              )}`}
            >
              <span className="font-semibold mr-3">{option.key})</span>
              {option.text}
              {isAnswered && option.key === question.correctAnswer && (
                <span className="ml-2 text-green-600">✓</span>
              )}
              {isAnswered &&
                option.key === selectedAnswer &&
                option.key !== question.correctAnswer && (
                  <span className="ml-2 text-red-600">✗</span>
                )}
            </button>
          ))}
        </div>
      </div>

      {/* Aciklama (yanlis cevap sonrasi) */}
      {isAnswered && selectedAnswer !== question.correctAnswer && (
        <div className="mx-6 mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm font-medium text-amber-800 mb-1">Aciklama:</p>
          <p className="text-sm text-amber-700">{question.explanation}</p>
        </div>
      )}

      {/* Dogru cevap mesaji */}
      {isAnswered && selectedAnswer === question.correctAnswer && (
        <div className="mx-6 mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-800">
            Dogru! Tebrikler.
          </p>
        </div>
      )}

      {/* Butonlar */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
        {!isAnswered ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            Cevapla
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
          >
            {questionNumber === totalQuestions ? "Sonuclari Gor" : "Sonraki"}
          </button>
        )}
      </div>
    </div>
  );
}
