# DGS Hazirlik - Proje Ilerleme Takibi

## Proje Ozeti
DGS (Dikey Gecis Sinavi) hazirligi icin yapay zeka destekli web uygulamasi.
Konu bazli soru cozme, zayif konu tespiti, adaptif ogrenme ve aralikli tekrar sistemi.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma 5
- **AI:** OpenAI API (gpt-4o-mini)
- **Auth:** Basit pin/sifre (tek kullanici) - henuz eklenmedi
- **Styling:** Tailwind CSS 4
- **Deploy:** Vercel

---

## Asamalar ve Durum

### ASAMA 1: Proje Altyapisi ✅
- [x] Proje ilerleme dosyasi olustur
- [x] Next.js projesi olustur (App Router)
- [x] Tailwind CSS kurulumu
- [x] Prisma kurulumu (Supabase baglantisi .env.local'da ayarlanacak)
- [x] Veritabani semasini olustur (Subject, Topic, SubTopic, Question, UserAnswer, Quiz, SpacedRepetition, TopicStats, DailyActivity)
- [x] Temel layout ve navigasyon (Sidebar + responsive)

### ASAMA 2: Soru Veritabani ve Yonetim ✅
- [x] DGS mufredat yapisi (Unite > Konu > Alt Konu)
- [x] Soru modeli (coktan secmeli, aciklamali cevaplar)
- [x] Seed data: Matematik (23 konu), Geometri (6 konu), Turkce (4 konu)
- [x] AI ile toplu soru uretim API'si (/api/ai/generate)
- [x] Soru API route'lari (/api/questions, /api/questions/topics)

### ASAMA 3: Test Cozme Arayuzu ✅
- [x] Soru karti komponenti (QuestionCard)
- [x] Test baslatma arayuzu (konu sec / karisik / AI onerisi / tekrar)
- [x] Test cozme akisi (soru goster > cevapla > sonraki)
- [x] Yanlis cevap aciklamasi gosterimi
- [x] Test sonuc ozeti (QuizResults)

### ASAMA 4: Istatistik ve Ilerleme ✅
- [x] Cevap kaydetme (dogru/yanlis, sure, konu bilgisi)
- [x] Konu bazli basari orani hesaplama
- [x] Dashboard: Genel ozet kartlari
- [x] Zayif konu tespiti ve gorsellestirme
- [x] Gunluk hedef ve streak takibi

### ASAMA 5: AI Entegrasyonu ✅
- [x] OpenAI API baglantisi (lib/ai.ts)
- [x] Toplu soru uretimi (/api/ai/generate)
- [x] Zayif konu analizi ve AI oneri sistemi (/api/ai/adaptive)
- [x] Adaptif soru secimi (quiz mode: adaptive)
- [ ] AI ile konu aciklamasi / ipucu sistemi (gelecek)

### ASAMA 6: Aralikli Tekrar (Spaced Repetition) ✅
- [x] SM-2 algoritmasi implementasyonu (lib/spaced-repetition.ts)
- [x] Tekrar kuyrugu yonetimi (SpacedRepetition modeli)
- [x] Tekrar modu (quiz mode: spaced)
- [x] Tekrar sonrasi zorluk guncelleme (cevap kaydederken otomatik)

### ASAMA 7: Son Dokunuslar ve Deploy
- [x] Build basarili (tum TypeScript hatalari giderildi)
- [ ] Supabase veritabani olustur ve bagla
- [ ] prisma db push + prisma db seed calistir
- [ ] OpenAI API anahtari ekle
- [ ] Vercel deploy
- [ ] Test ve bug fix

---

## Baslatma Adimlari

1. **Supabase hesabi olustur** ve yeni bir proje ac
2. **.env.local dosyasini guncelle:**
   - `DATABASE_URL` → Supabase connection string (pooling)
   - `DIRECT_URL` → Supabase direct connection string
   - `OPENAI_API_KEY` → OpenAI API anahtarin
3. **Veritabanini kur:**
   ```bash
   npx prisma db push
   npm run db:seed
   ```
4. **Gelistirme sunucusunu baslat:**
   ```bash
   npm run dev
   ```
5. **Soru uretimi:** Konular sayfasinda "+5 Soru" butonuyla AI uzerinden soru uret

---

## Dosya Yapisi

```
src/
├── app/
│   ├── page.tsx                    # Dashboard
│   ├── layout.tsx                  # Ana layout + Sidebar
│   ├── globals.css                 # Tailwind
│   ├── quiz/
│   │   ├── page.tsx                # Test olusturma arayuzu
│   │   └── [id]/page.tsx           # Test cozme sayfasi
│   ├── topics/page.tsx             # Konu listesi + soru uretimi
│   ├── stats/page.tsx              # Istatistikler + AI analizi
│   └── api/
│       ├── questions/
│       │   ├── route.ts            # Soru listesi
│       │   └── topics/route.ts     # Konu agaci
│       ├── quiz/
│       │   ├── route.ts            # Quiz olustur
│       │   └── [id]/
│       │       ├── route.ts        # Quiz detay
│       │       └── complete/route.ts # Quiz tamamla
│       ├── answers/route.ts        # Cevap kaydet + istatistik guncelle
│       ├── stats/route.ts          # Genel istatistikler
│       └── ai/
│           ├── generate/route.ts   # AI ile soru uret
│           └── adaptive/route.ts   # AI zayif konu analizi
├── components/
│   ├── Sidebar.tsx                 # Navigasyon
│   ├── QuestionCard.tsx            # Soru gosterim karti
│   └── QuizResults.tsx             # Test sonuc ozeti
├── lib/
│   ├── db.ts                       # Prisma client
│   ├── ai.ts                       # OpenAI entegrasyonu
│   ├── spaced-repetition.ts        # SM-2 algoritmasi
│   └── scoring.ts                  # Puanlama ve streak
└── types/index.ts                  # TypeScript tipleri
```

---

## Notlar
- Sorular AI ile batch olarak uretilip veritabanina kaydedilecek
- Canli AI cagrisi sadece adaptif ogrenme ve zayif konu pekistirmede kullanilacak
- Tek kullanici sistemi (auth basit tutulacak)
- Vercel ucretsiz tier limitlerine dikkat edilecek
- Prisma 5 kullaniliyor (Prisma 7 breaking changes nedeniyle)

---

## Son Guncelleme
Tarih: 2026-02-07
Durum: ASAMA 1-6 TAMAMLANDI - Supabase baglantisi ve deploy bekleniyor
