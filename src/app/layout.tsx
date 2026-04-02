import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";

const futuraBold = localFont({
    src: '../font/futura-bold_freefontdownload_org/futura-bold.ttf',
    variable: '--font-futura-bold'
});

const futuraLight = localFont({
    src: '../font/futura-light_freefontdownload_org/futura-light.ttf',
    variable: '--font-futura-light'
});

export const metadata: Metadata = {
    metadataBase: new URL('https://neetdivision.vercel.app'),
    title: "NEET DIVISION",
    description: "WE ARE THE SLUMS. NEET DIVISION Official Website.",
    keywords: [
        "k4sen", "カセガク", "学院", "the k4sen", "かせん", "カセン", "shaka", "釈迦", "葛葉", "kuzuha", 
        "lol", "League of Legends", "リーグ・オブ・レジェンド", "配信者", "ぶいすぽ", "vspo", "にじさんじ", 
        "nijisanji", "ローレン・イロアス", "アルス・アルマル", "LTK", "LTKDL", "スラム街", "discord", "鯖", 
        "サーバー", "ニーディビ", "入り方", "募集", "昏昏アリア", "ネオポルテ", "天帝フォルテ", "夜絆ニウ", 
        "vtuber", "streamer", "鷹宮リオン", "らいじん", "らいさま", "たかやスペシャル", "zerost", "しゃるる", 
        "Eugeo", "TFT", "橘ひなの", "花芽すみれ", "一ノ瀬うるは", "白波らむね", "龍巻ちせ", "銀城サイネ", 
        "胡桃のあ", "小森めと", "猫汰つな", "如月れん", "紫宮るな", "甘結もか", "蝶屋はなび", "千燈ゆうひ", 
        "紡木こかげ", "小雀とと", "花芽なずな", "兎咲ミミ", "藍沢エマ", "英リサ", "夢野あかり", "八雲べに", 
        "神成きゅぴ", "空澄セナ", "夜乃くろむ", "nqrse", "なるせ", "おぼ", "まざー", "トナカイト", "ツルギ", 
        "valorant", "vct", "ljl", "白那しずく"
    ],
    alternates: {
        canonical: '/',
    },
    verification: {
        google: "eNtYJ2YSpa4EWCJkSFHmbCX3P1OrDN4C5LERfHXcC_g",
    },
    other: {
        "google-adsense-account": "ca-pub-9269179060215740",
    },
    openGraph: {
        title: "NEET DIVISION",
        description: "WE ARE THE SLUMS. NEET DIVISION Official Website.",
        url: 'https://neetdivision.vercel.app',
        siteName: 'NEET DIVISION',
        locale: 'ja_JP',
        type: 'website',
        images: [
            {
                url: '/images/ogp_final.png',
                width: 1200,
                height: 630,
                alt: 'NEET DIVISION',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "NEET DIVISION",
        description: "WE ARE THE SLUMS. NEET DIVISION Official Website.",
        images: ['/images/ogp_final.png'], // Default to light mode image as primary
    },
};

import Script from "next/script";
import Header from "@/components/layout/Header";
import ScrollToTop from "@/components/layout/ScrollToTop";
import EasterEgg from "@/components/layout/EasterEgg";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <head>
                {/* Google AdSense */}
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9269179060215740"
                    crossOrigin="anonymous"
                    strategy="beforeInteractive"
                />
            </head>
            <body className={cn(futuraBold.variable, futuraLight.variable, "bg-black text-white font-sans selection:bg-neon selection:text-black")}>
                <meta name="color-scheme" content="light" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            "name": "NEET DIVISION",
                            "alternateName": ["neetdivision", "neet division"],
                            "url": "https://neetdivision.vercel.app",
                        }),
                    }}
                />
                <EasterEgg />
                <Header />
                {children}
                <ScrollToTop />
            </body>
        </html>
    );
}
