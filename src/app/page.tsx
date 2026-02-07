import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* Ozet Kartlari */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Toplam Soru"
          value="0"
          subtitle="veritabaninda"
          color="blue"
        />
        <StatCard
          title="Cozulen"
          value="0"
          subtitle="soru cozuldu"
          color="green"
        />
        <StatCard
          title="Basari"
          value="%0"
          subtitle="genel ortalama"
          color="purple"
        />
        <StatCard
          title="Streak"
          value="0 gun"
          subtitle="ardisik calisma"
          color="orange"
        />
      </div>

      {/* Hizli Erisim */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          href="/quiz?mode=mixed"
          className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="text-3xl mb-3">🎲</div>
          <h3 className="text-lg font-semibold mb-1">Karisik Test</h3>
          <p className="text-sm text-gray-500">
            Tum konulardan rastgele sorularla kendini test et
          </p>
        </Link>

        <Link
          href="/quiz?mode=spaced"
          className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="text-3xl mb-3">🔄</div>
          <h3 className="text-lg font-semibold mb-1">Tekrar Et</h3>
          <p className="text-sm text-gray-500">
            Aralikli tekrar ile zayif konularini pekistir
          </p>
        </Link>

        <Link
          href="/topics"
          className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="text-3xl mb-3">📚</div>
          <h3 className="text-lg font-semibold mb-1">Konuya Gore Calis</h3>
          <p className="text-sm text-gray-500">
            Belirli bir konu secip odaklanarak calis
          </p>
        </Link>

        <Link
          href="/quiz?mode=adaptive"
          className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="text-3xl mb-3">🤖</div>
          <h3 className="text-lg font-semibold mb-1">AI Onerisi</h3>
          <p className="text-sm text-gray-500">
            Yapay zeka zayif noktalarini analiz ederek soru secer
          </p>
        </Link>
      </div>

      {/* Zayif Konular */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Zayif Konular</h3>
        <p className="text-sm text-gray-400">
          Henuz yeterli veri yok. Soru cozmeye baslayinca burada zayif konularin gorunecek.
        </p>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  color: "blue" | "green" | "purple" | "orange";
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
    orange: "bg-orange-50 text-orange-700",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-3xl font-bold mt-1 ${colorMap[color].split(" ")[1]}`}>
        {value}
      </p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}
