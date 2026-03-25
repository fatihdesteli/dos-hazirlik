import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// DGS konulari - her konu kendi basina bir Topic, alt konusu kendisi
const curriculum = [
  {
    name: "Matematik",
    order: 1,
    topics: [
      "Temel Kavramlar",
      "Tek ve Çift Sayılar",
      "Pozitif ve Negatif Sayılar",
      "Asal ve Ardışık Sayılar",
      "Asal Çarpanlar ve Bölen Sayısı",
      "Faktöriyel",
      "Rasyonel Sayılar ve Ondalık Kesirler",
      "Sayı Sistemleri ve Basamak Kavramı",
      "Bölme ve Bölünebilme Kuralları",
      "Denklem Çözme",
      "Basit Eşitsizlikler ve Sıralama",
      "Mutlak Değer",
      "Üslü Sayılar",
      "Kareköklü Sayılar",
      "Çarpanlara Ayırma ve Özdeşlikler",
      "Oran Orantı",
      "Sayı Problemleri",
      "Kesir Problemleri",
      "Sayfa Problemleri",
      "Saat Problemleri",
      "Yaş Problemleri",
      "Yüzde Problemleri",
      "Kâr ve Zarar Problemleri",
      "Karışım Problemleri",
      "Hız – Hareket Problemleri",
      "İşçi Problemleri",
      "Küme Problemleri",
      "Rutin Olmayan Problemler",
      "Grafik Problemleri",
      "Kümeler",
      "Fonksiyonlar",
      "İşlem",
      "Modüler Aritmetik",
      "Permütasyon",
      "Kombinasyon",
      "Olasılık",
      "Sayısal Mantık",
    ],
  },
  {
    name: "Geometri",
    order: 2,
    topics: [
      "Geometrik Kavramlar",
      "Doğruda Açılar",
      "Üçgenler ve Özellikleri",
      "Çokgenler ve Dörtgenler",
      "Çember ve Daire",
      "Analitik Geometri",
      "Katı Cisimler",
    ],
  },
];

async function main() {
  console.log("Eski veriler temizleniyor...");

  // Eski verileri temizle (sirasiyla foreign key'lere gore)
  await prisma.spacedRepetition.deleteMany();
  await prisma.userAnswer.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.topicStats.deleteMany();
  await prisma.dailyActivity.deleteMany();
  await prisma.question.deleteMany();
  await prisma.subTopic.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.subject.deleteMany();

  console.log("Seed basladi...");

  for (const subjectData of curriculum) {
    const subject = await prisma.subject.create({
      data: {
        name: subjectData.name,
        order: subjectData.order,
      },
    });

    console.log(`Unite: ${subject.name}`);

    for (let tIdx = 0; tIdx < subjectData.topics.length; tIdx++) {
      const topicName = subjectData.topics[tIdx];

      const topic = await prisma.topic.create({
        data: {
          name: topicName,
          subjectId: subject.id,
          order: tIdx + 1,
        },
      });

      // Her konunun alt konusu olarak kendisini ekle (flat yapi)
      await prisma.subTopic.create({
        data: {
          name: topicName,
          topicId: topic.id,
          order: 1,
        },
      });

      console.log(`  Konu: ${topicName}`);
    }
  }

  console.log("Seed tamamlandi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
