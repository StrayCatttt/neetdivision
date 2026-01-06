"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function DonationSuccess() {



    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
            <div className="bg-zinc-900 border border-neon p-12 text-center max-w-lg">
                <h1 className="text-4xl font-heading font-bold mb-4 text-white">
                    <span className="text-neon">THANK YOU</span> FOR YOUR SUPPORT
                </h1>
                <p className="text-gray-300 mb-8 text-lg">
                    寄付ありがとうございます。
                    <br />
                    Strayのカフェイン濃度が上昇し、開発効率が0.1%向上しました。
                    <br />

                </p>
                <Link
                    href="/"
                    className="inline-block px-8 py-3 bg-neon text-black font-bold uppercase hover:bg-white transition-all"
                >
                    RETURN TO HOME
                </Link>
            </div>
        </div>
    );
}
