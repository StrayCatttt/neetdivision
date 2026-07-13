export type Achievement = {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
  link: string;
  linkLabel: string;
};

export const achievementsData: Achievement[] = [
  {
    id: "ltk3",
    date: "2026.05 - 06",
    title: "League the k4sen #3",
    description: "更にレベルアップして帰ってきたLTKのスクリム相手として集結。あまりにも強いニートにストリーマー達は阿鼻叫喚した。",
    image: "/images/ltk3.webp",
    link: "https://league.thek4sen.com/Pandemonium_Playoffs/",
    linkLabel: "VISIT LTK WEBSITE"
  },
  {
    id: "kasengakuin",
    date: "2026.02 - 04",
    title: "k4sen学院",
    description: "『k4sen学院』にてLoL初心者の練習相手として、数少ない新人NEET DIVISIONが集結し生徒の成長をサポート。時には数チーム同時に招集がかかることも。",
    image: "/images/k4sen_academy.webp",
    link: "https://youtu.be/FmJC4M1Og4E?si=NWqv4ffJ-bIUEGat",
    linkLabel: "VIEW VIDEO"
  },
  {
    id: "kzhcup",
    date: "2026.01.19",
    title: "KZHCUP RUMBLE",
    description: "『KZH CUP RUMBLE in STREET FIGHTER 6』エキシビションマッチにて不破湊と対戦するk4senを支援するため、NEET DIVISIONが集結し集合知コーチングを実施。本番ではファンキーな戦いを披露し、見事に勝利を収めた。",
    image: "/images/kzhcup_rumble.webp",
    link: "https://www.youtube.com/watch?v=h3LbVGErd-c",
    linkLabel: "VIEW VIDEO"
  },
  {
    id: "zeta-thek4sen",
    date: "2025.07.09",
    title: "ZETA the k4sen",
    description: "公式チームとして参戦。プロゲーマーやストリーマーがひしめき合う最高峰の舞台で、スラムの底力を世に知らしめた伝説の日。",
    image: "/images/zeta_k4sen.webp",
    link: "https://zetadivision.com/news/2025/07/09/36040",
    linkLabel: "VIEW OFFICIAL NEWS"
  },
  {
    id: "ltk-original",
    date: "2025.06 - 12",
    title: "League the k4sen",
    description: "「Domination Crown」への道。ただの練習相手ではなく、共に切磋琢磨し、高みを目指す「強敵（とも）」として君臨。半年間に及ぶ激闘の末、参加者に多大なる影響を与えた。",
    image: "/images/league_k4sen.webp",
    link: "https://league.thek4sen.com/",
    linkLabel: "VISIT LTK WEBSITE"
  }
];
