"use client";
import { useState, useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>?/|{}[]~';

function ScrambleTitle() {
    const text = "JOIN US";
    const [displayText, setDisplayText] = useState(text);

    useEffect(() => {
        let iteration = 0;
        let interval: NodeJS.Timeout;

        interval = setInterval(() => {
            setDisplayText(
                text.split('')
                    .map((char, index) => {
                        if (index < iteration) return text[index];
                        if (char === ' ') return ' ';
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join('')
            );

            if (iteration >= text.length) {
                clearInterval(interval);
            }

            iteration += 1 / 4;
        }, 30);

        return () => clearInterval(interval);
    }, []);

    const joinPart = displayText.slice(0, 4);
    const spacePart = displayText.slice(4, 5);
    const usPart = displayText.slice(5);

    return (
        <h1 className="text-6xl md:text-8xl font-heading font-bold text-center italic uppercase drop-shadow-xl">
            {joinPart}{spacePart}<span className="text-neon">{usPart}</span>
        </h1>
    );
}

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);
    return isMobile;
}

export default function Recruit() {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const isMobile = useIsMobile();

    // Refs for video scrubbing (PC only)
    const currentTimeRef = useRef(0);
    const animationFrameId = useRef<number | null>(null);
    const progressRef = useRef(0);
    const cachedMaxScrollRef = useRef(0);

    // iOS Safari: prime the video decoder (PC only)
    useEffect(() => {
        if (isMobile) return;
        const video = videoRef.current;
        if (video) {
            video.play().then(() => {
                video.pause();
            }).catch(() => {});
        }
    }, [isMobile]);

    // Cache maxScroll (PC only)
    useEffect(() => {
        if (isMobile) return;
        const updateMaxScroll = () => {
            const docHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            cachedMaxScrollRef.current = Math.max(1, docHeight - windowHeight);
        };

        updateMaxScroll();
        const timeout = setTimeout(updateMaxScroll, 500);

        window.addEventListener('resize', updateMaxScroll);
        return () => {
            window.removeEventListener('resize', updateMaxScroll);
            clearTimeout(timeout);
        };
    }, [isMobile]);

    // Scroll mapping for video (PC only)
    useEffect(() => {
        if (isMobile) return;
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const maxScroll = cachedMaxScrollRef.current;

            const rawP = Math.max(0, Math.min(1, scrollTop / maxScroll));

            // 0.00 - 0.85 → video forward (0→1)
            // 0.85 - 1.00 → video backward (1→~0.7)
            let videoP: number;
            if (rawP <= 0.85) {
                videoP = rawP / 0.85;
            } else {
                videoP = 1 - ((rawP - 0.85) / 0.15) * 0.3;
            }

            progressRef.current = Math.max(0, Math.min(1, videoP));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isMobile]);

    // Video scrubbing render loop (PC only)
    useEffect(() => {
        if (isMobile) return;

        const loop = () => {
            if (!document.hidden && videoRef.current) {
                const video = videoRef.current;

                if (!isNaN(video.duration) && video.duration > 0) {
                    const maxTime = video.duration - 0.05;
                    const step = Math.round(progressRef.current * 60);
                    const stepProgress = step / 60;
                    const targetTime = Math.min(stepProgress * video.duration, maxTime);

                    currentTimeRef.current += (targetTime - currentTimeRef.current) * 0.15;

                    if (!video.seeking && Math.abs(video.currentTime - currentTimeRef.current) > 0.01) {
                        video.currentTime = currentTimeRef.current;
                    }
                }
            }
            animationFrameId.current = requestAnimationFrame(loop);
        };

        loop();

        const handleVisibilityChange = () => {
            if (document.hidden && animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            } else if (!document.hidden) {
                loop();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isMobile]);

    // IntersectionObserver for fade-in
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observerCallback: IntersectionObserverCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                } else {
                    entry.target.classList.remove('is-revealed');
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const revealElements = document.querySelectorAll('[data-scroll-reveal]');
        revealElements.forEach(el => observer.observe(el));

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <>
            {/* Background: completely outside any container for reliable fixed positioning on iOS */}
            <div className="fixed top-0 left-0 w-full pointer-events-none bg-black" style={{ height: '100svh', zIndex: -1, willChange: 'transform' }}>
                {/* PC: Video */}
                {!isMobile && (
                    <video 
                        ref={videoRef}
                        src="/videos/recruit-bg.mp4" 
                        className="w-full h-full object-cover"
                        playsInline 
                        muted 
                        preload="auto"
                    />
                )}
                {/* Mobile: Static image, original size then scaled to 70% */}
                {isMobile && (
                    <img
                        src="/images/recruit-bg.png"
                        alt=""
                        className="w-full h-full object-cover"
                        style={{ transform: 'scale(0.7)' }}
                    />
                )}
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50 pointer-events-none" />
            </div>

            {/* Main Container */}
            <div ref={containerRef} className="w-full relative min-h-screen">
                {/* Content Layer */}
                <div className="relative z-10 w-full">
                    <style>{`
                        [data-scroll-reveal] {
                            opacity: 0;
                            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
                        }
                        [data-scroll-reveal="up"] { transform: translateY(30px); }
                        [data-scroll-reveal].is-revealed { opacity: 1; transform: translateY(0); }
                    `}</style>

                    {/* Hero */}
                    <div className="h-screen flex flex-col items-center justify-center">
                        <ScrambleTitle />
                        <div className="mt-8 animate-bounce text-white/60">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M7 13l5 5 5-5" />
                                <path d="M7 7l5 5 5-5" />
                            </svg>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="max-w-4xl mx-auto px-4 md:px-12 pb-[40px]">
                        <div className="space-y-16 w-full">
                            <div data-scroll-reveal="up" className="bg-zinc-900/80 backdrop-blur-md border-2 border-red-600 p-8 rounded-sm shadow-2xl">
                                <h2 className="text-2xl font-bold text-red-500 mb-4 flex items-center gap-2 drop-shadow-md">
                                    ⚠ 警告：人生を棒に振る覚悟はありますか？
                                </h2>
                                <div className="space-y-4 text-white leading-relaxed font-body">
                                    <p>
                                        NEET DIVISIONへの入隊条件は極めて厳格です。
                                        「仕事をしている」「学業が順調である」「リア充である」
                                        これらに該当する場合、即座にブラウザを閉じてください。
                                    </p>
                                    <p className="font-bold text-white uppercase tracking-tighter bg-red-600/30 p-4 border-l-4 border-red-600">
                                        重要：k4senさんのDiscordサーバーに参加していない場合、招集されることはありません。
                                    </p>
                                </div>
                            </div>

                            <div data-scroll-reveal="up" className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-8 shadow-2xl">
                                <h3 className="text-xl font-bold mb-4 text-neon drop-shadow-sm">注意事項</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                                    <li>招集は常に不定期であり、あなたの「待ち時間」が試されます。</li>
                                    <li>スラムの住人としてのプライドを持ち、トキシックにならないこと。</li>
                                    <li>一度足を踏み入れれば、戻るべき道はないと思ってください。</li>
                                </ul>
                            </div>

                            <div data-scroll-reveal="up" className="bg-neon/10 backdrop-blur-md border border-neon p-8 text-center italic group shadow-2xl">
                                <p className="text-neon font-bold text-lg mb-4 drop-shadow-md">あなたはk4senさんの真のファンであることを誓いますか？</p>
                                <a
                                    href="https://discord.gg/57VqX4DCD7"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-8 py-3 bg-neon text-black font-bold uppercase transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(204,255,0,0.4)]"
                                >
                                    Discordサーバーに参加
                                </a>
                                <p className="mt-4 text-sm text-white tracking-wide drop-shadow-md">※これに参加していないと、スラムの門は開きません。</p>
                            </div>
                        </div>

                        <div data-scroll-reveal="up" className="mt-16 pb-4 text-center text-zinc-400 font-bold tracking-widest text-xs">
                            <a href="https://github.com/Slum-Dev/neetdiv_form" target="_blank" rel="noopener noreferrer" className="hover:text-neon transition-colors duration-300">
                                Recruit System
                            </a> Developed by SLUM DEV
                        </div>
                    </div>

                    {/* Extra scroll space for video reverse buffer (PC only) */}
                    {!isMobile && <div className="h-[30vh]" aria-hidden="true" />}
                </div>
            </div>
        </>
    );
}
