const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

interface GeneratedQuestion {
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE?: string;
  correctAnswer: string;
  explanation: string;
  difficulty: number;
}

export async function generateQuestions(
  subject: string,
  topic: string,
  subTopic: string,
  count: number = 5,
  difficulty: number = 2
): Promise<GeneratedQuestion[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "sk-your-openai-api-key") {
    throw new Error("OpenAI API anahtari ayarlanmamis");
  }

  const difficultyLabel =
    difficulty === 1 ? "kolay" : difficulty === 2 ? "orta" : "zor";

  const prompt = `DGS (Dikey Gecis Sinavi) icin ${subject} dersinin "${topic}" konusunun "${subTopic}" alt basliginda ${count} adet ${difficultyLabel} seviye coktan secmeli soru uret.

Her soru icin:
- Soru metni acik ve net olmali
- 4 veya 5 secenek olmali (A, B, C, D ve opsiyonel E)
- Dogru cevap belirtilmeli
- Yanlis cevap verildiginde gosterilecek kisa bir aciklama olmali (cozum yolu dahil)

JSON formatinda don:
[
  {
    "text": "Soru metni",
    "optionA": "A secenegi",
    "optionB": "B secenegi",
    "optionC": "C secenegi",
    "optionD": "D secenegi",
    "optionE": "E secenegi veya null",
    "correctAnswer": "A",
    "explanation": "Cozum aciklamasi",
    "difficulty": ${difficulty}
  }
]

Sadece JSON array don, baska bir sey yazma.`;

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Sen bir DGS sinav soru yazarisin. Sorulari Turkce olarak, DGS mufredatina uygun sekilde uretirsin. Sadece JSON formatinda cevap ver.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API hatasi: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // JSON parse - bazen markdown code block icinde gelir
  const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const questions: GeneratedQuestion[] = JSON.parse(jsonStr);

  return questions;
}

export async function analyzeWeaknesses(
  stats: Array<{
    subTopicName: string;
    topicName: string;
    subjectName: string;
    accuracy: number;
    totalAnswered: number;
  }>
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "sk-your-openai-api-key") {
    return "AI analizi icin OpenAI API anahtari gerekli.";
  }

  const statsText = stats
    .map(
      (s) =>
        `${s.subjectName} > ${s.topicName} > ${s.subTopicName}: %${s.accuracy} basari (${s.totalAnswered} soru)`
    )
    .join("\n");

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Sen bir DGS hazirligi ogretmenisin. Ogrencinin zayif konularini analiz edip kisa ve motivasyonel oneriler verirsin.",
        },
        {
          role: "user",
          content: `Asagidaki konu bazli istatistiklerime bakarak bana oneriler ver. Hangi konulara oncelik vermeliyim? Nasil calismaliyim?\n\n${statsText}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) return "AI analizi sirasinda hata olustu.";

  const data = await response.json();
  return data.choices[0].message.content;
}
