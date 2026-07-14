import { Metadata } from 'next';

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
