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
};

import Header from "@/components/layout/Header";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body className={cn(futuraBold.variable, futuraLight.variable, "bg-black text-white font-sans selection:bg-neon selection:text-black")}>
                <Header />
                {children}
            </body>
        </html>
    );
}
