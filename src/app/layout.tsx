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
    title: "NEET DIVISION",
    description: "WE ARE THE SLUMS. NEET DIVISION Official Website.",
    verification: {
        google: "maOTMOwjA5BbAYPy_rkoO8LkXhiUedvHix47xvaC4v8",
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
