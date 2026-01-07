"use client";
import { useState } from 'react';

export default function Recruit() {
    return (
        <div className="min-h-screen pt-32 pb-24 px-4 md:px-12 bg-black text-white">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-6xl md:text-8xl font-heading font-bold mb-12 text-center italic">
                    JOIN <span className="text-neon">US</span>
                </h1>

                <div className="space-y-8 mb-16">
                    <div className="bg-zinc-900 border-2 border-red-600 p-8 rounded-sm">
                        <h2 className="text-2xl font-bold text-red-500 mb-4 flex items-center gap-2">
                            ⚠ 警告：人生を棒に振る覚悟はありますか？
                        </h2>
                        <div className="space-y-4 text-white leading-relaxed font-body">
                            <p>
                                NEET DIVISIONへの入隊条件は極めて厳格です。
                                「仕事をしている」「学業が順調である」「リア充である」
                                これらに該当する場合、即座にブラウザを閉じてください。
                            </p>
                            <p className="font-bold text-white uppercase tracking-tighter bg-red-600/20 p-4 border-l-4 border-red-600">
                                重要：k4senさんのDiscordサーバーに参加していない場合、招集されることはありません。
                            </p>
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 p-8">
                        <h3 className="text-xl font-bold mb-4 text-neon">注意事項</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm">
                            <li>招集は常に不定期であり、あなたの「待ち時間」が試されます。</li>
                            <li>スラムの住人としてのプライドを持ち、トキシックにならないこと。</li>
                            <li>一度足を踏み入れれば、戻るべき道はないと思ってください。</li>
                        </ul>
                    </div>

                    <div className="bg-neon/10 border border-neon p-8 text-center italic group">
                        <p className="text-neon font-bold text-lg mb-4">あなたはk4senさんの真のファンであることを誓いますか？</p>
                        <a
                            href="https://discord.gg/57VqX4DCD7"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-8 py-3 bg-neon text-black font-bold uppercase transition-all hover:bg-white hover:scale-105"
                            style={{ backgroundColor: '#ccff00', color: '#000' }}
                        >
                            Discordサーバーに参加
                        </a>
                        <p className="mt-4 text-sm text-white tracking-wide">※これに参加していないと、スラムの門は開きません。</p>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-gray-400 mb-8">すべての条件を満たし、覚悟が固まった者のみ、以下のリンクより志願してください。</p>
                    <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSeHHF9E10j1-xMHZxQmOXHOtbJ6xNLRqVFMN3bWHStMq88y-Q/viewform?pli=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-6 bg-white text-black font-heading font-black text-2xl md:text-3xl uppercase transition-all hover:bg-neon transform active:scale-95 leading-tight"
                        style={{ backgroundColor: '#fff', color: '#000' }}
                    >
                        <span className="inline-block">League of Legends部門</span>
                        <span className="inline-block">に登録する</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
