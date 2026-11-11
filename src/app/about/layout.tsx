import { Metadata } from 'next';
import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';

export const metadata: Metadata = {
  title: 'ABOUT | NEET DIVISION',
  robots: {
    index: false, // 検索エンジンのインデックスから除外
    follow: true,
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
