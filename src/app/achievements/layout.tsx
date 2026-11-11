import { Metadata } from 'next';
import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/noto-sans-jp/700.css";
import "@fontsource/noto-sans-jp/900.css";

export const metadata: Metadata = {
  title: 'HISTORY | NEET DIVISION',
  robots: {
    index: false, // 検索エンジンのインデックスから除外
    follow: true,
  },
};

export default function AchievementsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
