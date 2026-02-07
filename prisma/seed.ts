import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const curriculum = [
  {
    name: "Matematik",
    order: 1,
    topics: [
      {
        name: "Temel Kavramlar",
        subTopics: [
          "Sayi Basamaklari",
          "Bolunebilme Kurallari",
          "EBOB ve EKOK",
          "Asal Sayilar",
        ],
      },
      {
        name: "Sayilar",
        subTopics: [
          "Rasyonel Sayilar",
          "Irrasyonel Sayilar",
          "Ondalik Sayilar",
          "Kesirler",
          "Tam Sayilar",
        ],
      },
      {
        name: "Carpanlar ve Katlar",
        subTopics: [
          "Carpanlara Ayirma",
          "Ortak Carpanlar",
          "En Kucuk Ortak Kat",
        ],
      },
      {
        name: "Mutlak Deger",
        subTopics: [
          "Mutlak Deger Tanimi",
          "Mutlak Deger Denklemleri",
          "Mutlak Deger Esitsizlikleri",
        ],
      },
      {
        name: "Uslu Sayilar",
        subTopics: [
          "Us Kurallari",
          "Negatif Us",
          "Uslu Denklemler",
        ],
      },
      {
        name: "Koklu Sayilar",
        subTopics: [
          "Kok Islemleri",
          "Koklu Denklemler",
          "Eslenigi ile Carpma",
        ],
      },
      {
        name: "Faktoriyel",
        subTopics: [
          "Faktoriyel Tanimi",
          "Faktoriyelde Dort Islem",
          "Faktoriyel Sadele stirme",
        ],
      },
      {
        name: "Permutasyon ve Kombinasyon",
        subTopics: [
          "Permutasyon",
          "Kombinasyon",
          "Binom Acilimi",
        ],
      },
      {
        name: "Olasilik",
        subTopics: [
          "Temel Olasilik",
          "Kosullu Olasilik",
          "Bagimsiz Olaylar",
        ],
      },
      {
        name: "Kumeler",
        subTopics: [
          "Kume Islemleri",
          "Alt Kume",
          "Venn Semalari",
        ],
      },
      {
        name: "Mantik",
        subTopics: [
          "Onermeler",
          "Birlesik Onermeler",
          "Acik Onermeler",
        ],
      },
      {
        name: "Fonksiyonlar",
        subTopics: [
          "Fonksiyon Tanimi",
          "Bire Bir ve Orten Fonksiyonlar",
          "Bilesik Fonksiyon",
          "Ters Fonksiyon",
        ],
      },
      {
        name: "Polinomlar",
        subTopics: [
          "Polinom Islemleri",
          "Polinom Bolmesi",
          "Carpanlara Ayirma",
        ],
      },
      {
        name: "1. Dereceden Denklemler",
        subTopics: [
          "Birinci Derece Denklemler",
          "Problemler",
          "Denklem Sistemleri",
        ],
      },
      {
        name: "2. Dereceden Denklemler",
        subTopics: [
          "Kokler",
          "Delta ve Kok Formulleri",
          "Kok-Katsayi Iliskisi",
        ],
      },
      {
        name: "Esitsizlikler",
        subTopics: [
          "Birinci Derece Esitsizlikler",
          "Ikinci Derece Esitsizlikler",
          "Esitsizlik Sistemleri",
        ],
      },
      {
        name: "Trigonometri",
        subTopics: [
          "Trigonometrik Oranlar",
          "Trigonometrik Fonksiyonlar",
          "Trigonometrik Denklemler",
        ],
      },
      {
        name: "Logaritma",
        subTopics: [
          "Logaritma Tanimi",
          "Logaritma Ozellikleri",
          "Logaritmik Denklemler",
        ],
      },
      {
        name: "Diziler",
        subTopics: [
          "Aritmetik Dizi",
          "Geometrik Dizi",
          "Seriler",
        ],
      },
      {
        name: "Limit ve Sureklilik",
        subTopics: [
          "Limit Tanimi",
          "Limit Hesaplama",
          "Sureklilik",
        ],
      },
      {
        name: "Turev",
        subTopics: [
          "Turev Tanimi",
          "Turev Kurallari",
          "Turev Uygulamalari",
          "Maksimum ve Minimum",
        ],
      },
      {
        name: "Integral",
        subTopics: [
          "Belirsiz Integral",
          "Belirli Integral",
          "Alan Hesabi",
        ],
      },
      {
        name: "Matrisler ve Determinant",
        subTopics: [
          "Matris Islemleri",
          "Determinant",
          "Ters Matris",
        ],
      },
    ],
  },
  {
    name: "Geometri",
    order: 2,
    topics: [
      {
        name: "Temel Kavramlar",
        subTopics: [
          "Nokta, Dogru, Duzlem",
          "Acilar",
          "Aci Cesitleri",
        ],
      },
      {
        name: "Ucgenler",
        subTopics: [
          "Ucgen Cesitleri",
          "Ucgende Aci Ozellikleri",
          "Ucgende Alan",
          "Ucgende Eslik ve Benzerlik",
          "Ozel Ucgenler",
        ],
      },
      {
        name: "Cokgenler ve Dortgenler",
        subTopics: [
          "Dortgen Cesitleri",
          "Paralelkenar",
          "Dikdortgen ve Kare",
          "Yamuk",
        ],
      },
      {
        name: "Cember ve Daire",
        subTopics: [
          "Cemberde Aci",
          "Cemberde Uzunluk",
          "Daire Alani",
          "Cemberin Analitik Incelenmesi",
        ],
      },
      {
        name: "Katicisiniler",
        subTopics: [
          "Prizma",
          "Piramit",
          "Koni",
          "Silindir",
          "Kure",
        ],
      },
      {
        name: "Analitik Geometri",
        subTopics: [
          "Noktanin Analitigi",
          "Dogrunun Analitigi",
          "Cemberin Analitigi",
        ],
      },
    ],
  },
  {
    name: "Turkce",
    order: 3,
    topics: [
      {
        name: "Soz Bilgisi",
        subTopics: [
          "Sozcukte Anlam",
          "Cumlede Anlam",
          "Deyimler ve Atasozleri",
          "Anlam Iliskileri",
        ],
      },
      {
        name: "Dil Bilgisi",
        subTopics: [
          "Ses Bilgisi",
          "Yapi Bilgisi",
          "Soz Turleri",
          "Cumle Bilgisi",
          "Anlam Bozukluklari",
        ],
      },
      {
        name: "Paragraf",
        subTopics: [
          "Ana Dusunce",
          "Yardimci Dusunce",
          "Paragraf Tamamlama",
          "Paragraf Siralamasi",
        ],
      },
      {
        name: "Yazim Kurallari",
        subTopics: [
          "Buyuk Harf Kullanimi",
          "Yazimlari Karistirilan Sozcukler",
          "Noktalama Isaretleri",
          "Birlesik Sozcukler",
        ],
      },
    ],
  },
];

async function main() {
  console.log("Seed basladi...");

  for (const subjectData of curriculum) {
    const subject = await prisma.subject.upsert({
      where: { name: subjectData.name },
      update: { order: subjectData.order },
      create: {
        name: subjectData.name,
        order: subjectData.order,
      },
    });

    console.log(`Unite: ${subject.name}`);

    for (let tIdx = 0; tIdx < subjectData.topics.length; tIdx++) {
      const topicData = subjectData.topics[tIdx];

      const topic = await prisma.topic.upsert({
        where: {
          subjectId_name: {
            subjectId: subject.id,
            name: topicData.name,
          },
        },
        update: { order: tIdx + 1 },
        create: {
          name: topicData.name,
          subjectId: subject.id,
          order: tIdx + 1,
        },
      });

      console.log(`  Konu: ${topic.name}`);

      for (let stIdx = 0; stIdx < topicData.subTopics.length; stIdx++) {
        const subTopicName = topicData.subTopics[stIdx];

        await prisma.subTopic.upsert({
          where: {
            topicId_name: {
              topicId: topic.id,
              name: subTopicName,
            },
          },
          update: { order: stIdx + 1 },
          create: {
            name: subTopicName,
            topicId: topic.id,
            order: stIdx + 1,
          },
        });

        console.log(`    Alt Konu: ${subTopicName}`);
      }
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
