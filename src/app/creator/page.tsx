"use client";
import { Twitter } from 'lucide-react';
import Image from 'next/image';
import { loadStripe } from '@stripe/stripe-js';

// STRIPE
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Creator() {

    const handleCheckout = async () => {
        try {
            const response = await fetch('/api/checkout_sessions', {
                method: 'POST',
            });
            const data = await response.json();
            if (!response.ok) {
                console.error("API Error:", data);
                return;
            }
            if (data.url) {
                window.open(data.url, '_blank');
            } else {
                console.error("No checkout URL found");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 md:px-12 bg-black text-white flex items-center justify-center">
            <div className="max-w-6xl w-full">
                <h1 className="text-6xl md:text-8xl font-bold mb-16 text-center italic">
                    THE <span className="text-neon">ARCHITECT</span>
                </h1>

                <div className="bg-zinc-900 border border-zinc-800 p-10 md:p-16 relative overflow-hidden group">


                    <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                        <div className="w-48 h-48 relative rounded-full border-4 border-neon overflow-hidden shrink-0 shadow-[0_0_30px_rgba(204,255,0,0.3)]">
                            <Image
                                src="/images/creator_icon.png"
                                alt="Stray"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-5xl font-bold mb-2 tracking-widest">Stray</h2>
                            <p className="text-neon font-bold tracking-[0.3em] mb-6 text-xl">MAIN DEVELOPER</p>
                            <p className="text-gray-300 text-lg leading-relaxed mb-8 font-body">
                                サイトを作るノウハウが1ミリもない哀れな開発者。
                                LoL自体はプレイしておらず、配信ばかり見ている猫が好きなだけのオタク。
                                マウスとキーボードより猫の肉球に触れていたい。三度の飯より猫だよなぁ？
                            </p>
                            <div className="flex flex-col gap-4 items-start">
                                <div className="flex gap-6 justify-center md:justify-start items-center">
                                    <a href="https://x.com/4EXP_" target="_blank" rel="noopener noreferrer" className="p-3 bg-black border border-zinc-800 rounded-full hover:text-neon hover:border-neon transition-all">
                                        <Twitter size={28} />
                                    </a>

                                    <button
                                        className="px-6 py-3 bg-black border border-gray-600 text-gray-500 font-bold uppercase cursor-not-allowed flex items-center gap-2"
                                        title="現在Stripeアカウント調整中のため停止中"
                                    >
                                        Strayを支援 (停止中)
                                    </button>
                                </div>

                                <span className="inline-block text-sm font-bold border-b border-neon text-neon hover:border-white hover:text-white transition-all w-fit cursor-pointer">
                                    <a href="https://stray-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer">
                                        Strayについて知る
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
