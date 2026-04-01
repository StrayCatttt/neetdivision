"use client";
import { Twitter, Monitor, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export default function Creator() {

    const handleCheckout = async () => {
        // Stripe integration removed
    };

    return (
        <div className="min-h-screen pt-32 pb-24 px-4 md:px-12 bg-black text-white flex flex-col items-center">
            <div className="max-w-6xl w-full">
                <h1 className="text-6xl md:text-8xl font-bold mb-16 text-center italic">
                    THE <span className="text-neon">ARCHITECT</span>
                </h1>

                <div className="space-y-12">
                    {/* Developer Section */}
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
                                            disabled
                                            className="px-6 py-3 bg-zinc-800 text-zinc-500 font-bold uppercase cursor-not-allowed flex items-center gap-2 transition-all opacity-50"
                                        >
                                            お布団と融合中
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

                    {/* Wallpaper Engine Section */}
                    <div className="relative">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px flex-1 bg-zinc-800"></div>
                            <h2 className="text-2xl font-bold tracking-[0.4em] text-neon flex items-center gap-3">
                                <Monitor size={24} />
                                WALLPAPER ENGINE
                            </h2>
                            <div className="h-px flex-1 bg-zinc-800"></div>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 overflow-hidden group hover:border-neon/50 transition-colors">
                            <div className="flex flex-col lg:flex-row">
                                <div className="lg:w-2/3 relative aspect-video overflow-hidden">
                                    <Image
                                        src="/images/ltk_wallpaper.png"
                                        alt="LTK Wallpaper"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                                </div>
                                <div className="lg:w-1/3 p-8 md:p-12 flex flex-col justify-center">
                                    <h3 className="text-3xl font-bold mb-4 tracking-tighter">LTK Wallpaper</h3>
                                    <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                        あの時の熱狂をもう一度。<br />
                                        LTK Dash Ladderでパフォーマンスを最大限発揮するための必須アイテム。
                                    </p>
                                    <a
                                        href="https://steamcommunity.com/sharedfiles/filedetails/?id=3697089836"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-neon text-black font-black uppercase tracking-widest hover:bg-white transition-colors group/btn w-full md:w-fit"
                                    >
                                        STEAM WORKSHOP
                                        <ExternalLink size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
