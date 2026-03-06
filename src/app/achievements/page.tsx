import Image from "next/image";

export default function Achievements() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 md:px-12 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold mb-16 text-center md:text-right italic">
          HIS<span className="text-neon">TORY</span>
        </h1>

        <div className="space-y-12">
          {/* k4sen Academy - Global Link */}
          <a
            href="https://youtu.be/FmJC4M1Og4E?si=NWqv4ffJ-bIUEGat"
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="flex flex-col md:flex-row items-stretch border-l-4 border-neon bg-zinc-900/40 hover:bg-zinc-900 transition-all duration-500 overflow-hidden">
              <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                <Image
                  src="/images/k4sen_academy.jpg"
                  alt="k4sen Academy"
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-10 md:w-1/2 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-neon font-bold text-xl mb-1 block tracking-wider">2026.02 -</span>
                    <h3 className="text-4xl font-bold text-white group-hover:text-neon transition-colors tracking-tight">k4sen学院</h3>
                  </div>
                </div>
                <p className="text-lg text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors">
                  『k4sen学院』にてLoL初心者の練習相手として、数少ない新人NEET DIVISIONが集結し生徒の成長をサポート。時には数チーム同時に招集がかかることも。
                </p>
                <span className="inline-block text-sm font-bold border-b border-white group-hover:border-neon group-hover:text-neon transition-all self-start">
                  VIEW VIDEO
                </span>
              </div>
            </div>
          </a>

          {/* KZHCUP RUMBLE - Global Link */}
          <a
            href="https://www.youtube.com/watch?v=h3LbVGErd-c"
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="flex flex-col md:flex-row-reverse items-stretch border-r-4 border-white bg-zinc-900/40 hover:bg-zinc-900 transition-all duration-500 overflow-hidden">
              <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                <Image
                  src="/images/kzhcup_rumble.jpg"
                  alt="KZHCUP RUMBLE"
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-10 md:w-1/2 flex flex-col justify-center text-right items-end">
                <div className="mb-4">
                  <span className="text-white font-bold text-xl mb-1 block tracking-wider">2026.01.19</span>
                  <h3 className="text-4xl font-bold text-white group-hover:text-neon transition-colors tracking-tight">KZHCUP RUMBLE</h3>
                </div>
                <p className="text-lg text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors">
                  『KZH CUP RUMBLE in STREET FIGHTER 6』エキシビションマッチにて不破湊と対戦するk4senを支援するため、NEET DIVISIONが集結し集合知コーチングを実施。本番ではファンキーな戦いを披露し、見事に勝利を収めた。
                </p>
                <span className="inline-block text-sm font-bold border-b border-white group-hover:border-neon group-hover:text-neon transition-all self-end">
                  VIEW VIDEO
                </span>
              </div>
            </div>
          </a>

          {/* ZETA the k4sen - Global Link */}
          <a
            href="https://zetadivision.com/news/2025/07/09/36040"
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="flex flex-col md:flex-row items-stretch border-l-4 border-neon bg-zinc-900/40 hover:bg-zinc-900 transition-all duration-500 overflow-hidden">
              <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                <Image
                  src="/images/zeta_k4sen.webp"
                  alt="ZETA the k4sen"
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-10 md:w-1/2 flex flex-col justify-center">
                <div className="mb-4">
                  <span className="text-neon font-bold text-xl mb-1 block tracking-wider">2025.07.09</span>
                  <h3 className="text-4xl font-bold text-white group-hover:text-neon transition-colors tracking-tight">ZETA the k4sen</h3>
                </div>
                <p className="text-lg text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors">
                  公式チームとして参戦。プロゲーマーやストリーマーがひしめき合う最高峰の舞台で、
                  スラムの底力を世に知らしめた伝説の日。
                </p>
                <span className="inline-block text-sm font-bold border-b border-white group-hover:border-neon group-hover:text-neon transition-all self-start">
                  VIEW OFFICIAL NEWS
                </span>
              </div>
            </div>
          </a>

          {/* League the k4sen - Global Link */}
          <a
            href="https://league.thek4sen.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="flex flex-col md:flex-row-reverse items-stretch border-r-4 border-white bg-zinc-900/40 hover:bg-zinc-900 transition-all duration-500 overflow-hidden">
              <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                <Image
                  src="/images/league_k4sen.webp"
                  alt="League the k4sen"
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-10 md:w-1/2 flex flex-col justify-center text-right items-end">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-white font-bold text-xl mb-1 block tracking-wider">2025.06 - 12 (6 Months)</span>
                    <h3 className="text-4xl font-bold text-white group-hover:text-neon transition-colors tracking-tight">League the k4sen</h3>
                  </div>
                </div>
                <p className="text-lg text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors">
                  「Domination Crown」への道。ただの練習相手ではなく、
                  共に切磋琢磨し、高みを目指す「強敵（とも）」として君臨。
                  半年間に及ぶ激闘の末、参加者に多大なる影響を与えた。
                </p>
                <span className="inline-block text-sm font-bold border-b border-white group-hover:border-neon group-hover:text-neon transition-all self-end">
                  VISIT LTK WEBSITE
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
