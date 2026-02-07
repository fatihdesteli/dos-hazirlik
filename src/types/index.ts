export interface SubjectWithTopics {
  id: string;
  name: string;
  order: number;
  topics: TopicWithSubTopics[];
}

export interface TopicWithSubTopics {
  id: string;
  name: string;
  subjectId: string;
  order: number;
  subTopics: SubTopicWithStats[];
}

export interface SubTopicWithStats {
  id: string;
  name: string;
  topicId: string;
  order: number;
  questionCount: number;
  stats?: {
    accuracy: number;
    totalAnswered: number;
    weaknessLevel: number;
  };
}

export interface QuestionWithOptions {
  id: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string | null;
  correctAnswer: string;
  explanation: string;
  difficulty: number;
  subTopicId: string;
  subTopic?: {
    name: string;
    topic: {
      name: string;
      subject: {
        name: string;
      };
    };
  };
}

export interface QuizConfig {
  mode: "topic" | "mixed" | "adaptive" | "spaced";
  subTopicIds?: string[];
  topicIds?: string[];
  subjectIds?: string[];
  questionCount: number;
}

export interface QuizState {
  quizId: string;
  questions: QuestionWithOptions[];
  currentIndex: number;
  answers: Record<string, string>;
  results: Record<string, boolean>;
  isCompleted: boolean;
}

export interface StatsOverview {
  totalQuestions: number;
  totalAnswered: number;
  correctCount: number;
  accuracy: number;
  streak: number;
  todayCount: number;
  weakTopics: SubTopicWithStats[];
  strongTopics: SubTopicWithStats[];
}
