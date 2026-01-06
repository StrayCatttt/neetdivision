import Image from "next/image";
import { Twitter, Youtube, Twitch } from "lucide-react";

export default function About() {
    return (
        <div className="min-h-screen pt-32 pb-24 px-4 md:px-12 bg-black text-white">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-6xl md:text-8xl font-heading font-bold mb-16 text-center md:text-left italic">
                    ABOUT <span className="text-neon">US</span>
                </h1>

                <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
                    <div className="space-y-8 text-xl text-gray-300 leading-relaxed font-medium">
                        <p>
                            NEET DIVISIONは、k4senリスナーによって結成された、世界で最も「働きたくない（けどLoLはしたい）」精鋭たちの集まりです。
                        </p>
                        <p className="border-l-4 border-neon pl-6 py-2 bg-neon/5">
                            我々はプロではありません。しかし、ニートとしての誇りと時間だけは無限にあります。 サモナーズリフトにおいて、我々の右に出る無職はいません。
                        </p>
                        <p>
                            そして、k4senさんのリスナーであれば、誰しもがNEET DIVISIONの一員なのです。
                        </p>
                    </div>
                    <div className="relative group">
                        <div className="relative overflow-hidden aspect-[4/3]">
                            <Image
                                src="/images/neet_division_logo.png"
                                alt="NEET DIVISION INFO"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>

                <h2 className="text-5xl font-heading mb-12 border-l-8 border-neon pl-6 tracking-tight">ACTIVITY</h2>
                <div className="grid md:grid-cols-3 gap-8 mb-32">
                    <div className="bg-zinc-900 p-10 border-t border-zinc-800">
                        <h3 className="text-2xl font-bold mb-4 text-neon tracking-wider">RANKED FLEX</h3>
                        <p className="text-gray-400 leading-relaxed">IronからGrandmasterまで、階級社会を無視したカオスなチームランク。24時間体制でフルパ募集が行われている。</p>
                    </div>
                    <div className="bg-zinc-900 p-10 border-t border-zinc-800">
                        <h3 className="text-2xl font-bold mb-4 text-neon tracking-wider">SCRIM</h3>
                        <p className="text-gray-400 leading-relaxed">配信者のカスタムゲームへの緊急出動。スクリム待機は日常茶飯事、人事部長の命令には逆らえない。</p>
                    </div>
                    <div className="bg-zinc-900 p-10 border-t border-zinc-800">
                        <h3 className="text-2xl font-bold mb-4 text-neon tracking-wider">SUB EVENTS</h3>
                        <p className="text-gray-400 leading-relaxed">時にはイベントにチームとして優先的に呼ばれる。その時まで爪を研ぎ続ける。</p>
                    </div>
                </div>

                {/* OUR BOSS Section */}
                <h2 className="text-5xl font-heading mb-12 border-l-8 border-neon pl-6 tracking-tight">OUR BOSS</h2>
                <div className="bg-zinc-900 border border-zinc-800 p-12 flex flex-col md:flex-row items-center gap-12">
                    <div className="w-48 h-48 relative rounded-full border-4 border-neon overflow-hidden shrink-0">
                        <Image
                            src="/images/k4sen_icon.jpg"
                            alt="k4sen"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-4xl font-bold mb-2">k4sen</h3>
                        <p className="text-neon font-bold tracking-widest mb-4">THE LEGENDARY STREAMER</p>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            我らがボスであり、全てのニートの希望の星。
                            彼の配信通知が我々の起床アラームであり、彼の言葉が我々の法律である。
                            NEET DIVISIONは、彼のために存在し、彼と共に歩む（コメント欄で）。
                        </p>
                        <a href="https://note.com/another_crown/n/n53bfbf0f56c8" target="_blank" rel="noopener noreferrer" className="text-neon font-bold underline hover:text-white transition-colors mb-8 block">
                            k4senについて知る
                        </a>
                        <div className="flex gap-6">
                            <a href="https://x.com/k4sen" target="_blank" rel="noopener noreferrer" className="p-3 bg-black border border-zinc-800 rounded-full hover:text-neon hover:border-neon transition-all">
                                <Twitter size={24} />
                            </a>
                            <a href="https://www.youtube.com/@zzxk4sen" target="_blank" rel="noopener noreferrer" className="p-3 bg-black border border-zinc-800 rounded-full hover:text-neon hover:border-neon transition-all">
                                <Youtube size={24} />
                            </a>
                            <a href="https://www.twitch.tv/k4sen" target="_blank" rel="noopener noreferrer" className="p-3 bg-black border border-zinc-800 rounded-full hover:text-neon hover:border-neon transition-all">
                                <Twitch size={24} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
