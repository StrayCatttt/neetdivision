"use client";
import Image from "next/image";
import { Twitter, Youtube, Twitch, Instagram, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function About() {
    const bgRef = useRef<HTMLDivElement>(null);
    const fgRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const bossWindowRef = useRef<HTMLDivElement>(null);
    const bossContentRef = useRef<HTMLDivElement>(null);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [isImagesLoaded, setIsImagesLoaded] = useState(false);

    useEffect(() => {
        let isCovered = false;

        // Load images
        let loadedCount = 0;
        const checkLoaded = () => {
            loadedCount++;
            if (loadedCount === 2) {
                setIsImagesLoaded(true);
            }
        };

        const bgImg = new window.Image();
        bgImg.src = "/images/about-bg-arena.webp";
        bgImg.onload = checkLoaded;
        bgImg.onerror = checkLoaded;

        const fgImg = new window.Image();
        fgImg.src = "/images/about-fg-k4sen.webp";
        fgImg.onload = checkLoaded;
        fgImg.onerror = checkLoaded;

        const handleScroll = () => {
            if (window.scrollY > 50) {
                setHasScrolled(true);
            } else {
                setHasScrolled(false);
            }

            if (scrollContainerRef.current && bossWindowRef.current && bossContentRef.current) {
                const rect = scrollContainerRef.current.getBoundingClientRect();
                const maxDistance = window.innerHeight * 2; 
                const distance = window.innerHeight - rect.top;
                let progress = Math.max(0, Math.min(1, distance / maxDistance));

                // 0-0.5: Window slides up (translateY 100vh -> 0)
                const slideProgress = Math.min(1, progress / 0.5);
                const y = 100 - (slideProgress * 100);
                const scale = 0.7 + (slideProgress * 0.3);
                
                // 0.5-0.7: Border radius and margins shrink
                const expandProgress = Math.max(0, Math.min(1, (progress - 0.5) / 0.2));
                const borderRadius = 24 * (1 - expandProgress);
                const margin = 16 * (1 - expandProgress);

                // 0.7-1.0: Content fades in
                const fadeProgress = Math.max(0, Math.min(1, (progress - 0.7) / 0.3));
                
                bossWindowRef.current.style.transform = `translateY(${y}vh) scale(${scale})`;
                bossWindowRef.current.style.opacity = slideProgress.toString();
                bossWindowRef.current.style.borderRadius = `${borderRadius}px ${borderRadius}px 0 0`;
                bossWindowRef.current.style.left = `${margin}px`;
                bossWindowRef.current.style.right = `${margin}px`;
                bossWindowRef.current.style.top = `${margin}px`;
                
                bossContentRef.current.style.opacity = fadeProgress.toString();
                // Avoid pointer events when not fully faded in to prevent clicking links early
                bossContentRef.current.style.pointerEvents = fadeProgress > 0.5 ? 'auto' : 'none';
                
                isCovered = progress >= 0.7;
            }
        };
        window.addEventListener('scroll', handleScroll);
        // Initial call to set correct state
        handleScroll();

        const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: window.innerWidth / 2, targetY: window.innerHeight / 2 };
        const maxOffsetBg = { x: 30, y: 20 };
        const maxOffsetFg = { x: 15, y: 10 };
        let animationFrameId: number;

        const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

        // --- Render Loop ---
        const render = () => {
            if (!isCovered) {
                mouse.x += (mouse.targetX - mouse.x) * 0.08;
                mouse.y += (mouse.targetY - mouse.y) * 0.08;

                const normX = (mouse.x / window.innerWidth) * 2 - 1;
                const normY = (mouse.y / window.innerHeight) * 2 - 1;

                if (bgRef.current) {
                    bgRef.current.style.transform = `translate3d(${normX * maxOffsetBg.x}px, ${normY * maxOffsetBg.y}px, 0) scale(1.05)`;
                }
                if (fgRef.current) {
                    fgRef.current.style.transform = `translate3d(${-normX * maxOffsetFg.x}px, ${-normY * maxOffsetFg.y}px, 0) scale(1.05)`;
                }
            }
            animationFrameId = requestAnimationFrame(render);
        };
        render();

        // --- Interaction Listeners ---
        const handleMouseMove = (e: MouseEvent) => {
            mouse.targetX = e.clientX;
            mouse.targetY = e.clientY;
        };

        const handleOrientation = (e: DeviceOrientationEvent) => {
            let x = e.gamma || 0;
            let y = e.beta || 0;
            if (x > 45) x = 45;
            if (x < -45) x = -45;
            if (y > 45) y = 45;
            if (y < -45) y = -45;

            const nX = x / 45;
            const nY = y / 45;

            mouse.targetX = window.innerWidth / 2 + (nX * window.innerWidth / 2);
            mouse.targetY = window.innerHeight / 2 + (nY * window.innerHeight / 2);
        };

        let usingGyro = false;
        
        if (!isMobile) {
            window.addEventListener('mousemove', handleMouseMove);
        } else {
            const initGyro = async () => {
                if (usingGyro) return;
                
                if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                    try {
                        const permission = await (DeviceOrientationEvent as any).requestPermission();
                        if (permission === 'granted') {
                            window.addEventListener('deviceorientation', handleOrientation);
                            usingGyro = true;
                        }
                    } catch (e) {
                        console.error("DeviceOrientation permission denied", e);
                    }
                } else {
                    window.addEventListener('deviceorientation', handleOrientation);
                    usingGyro = true;
                }
            };

            const onFirstInteraction = () => {
                initGyro();
                document.removeEventListener('click', onFirstInteraction);
                document.removeEventListener('touchstart', onFirstInteraction);
            };
            document.addEventListener('click', onFirstInteraction);
            document.addEventListener('touchstart', onFirstInteraction);
        }

        // --- Intersection Observer Setup ---
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observerCallback: IntersectionObserverCallback = (entries, observer) => {
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
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('deviceorientation', handleOrientation);
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
        };
    }, []);

    return (
        <div className="min-h-screen relative overflow-hidden text-white">
            {/* Loading Screen */}
            <div className={cn(
                "fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-1000 pointer-events-none",
                isImagesLoaded ? "opacity-0" : "opacity-100"
            )}>
                <div className="text-white font-futura-bold tracking-[0.2em] animate-pulse">
                    INITIALIZING...
                </div>
            </div>

            {/* 1. Background Arena */}
            <div 
                ref={bgRef}
                className="fixed inset-0 z-[1] bg-cover bg-center will-change-transform"
                style={{ backgroundImage: 'url(/images/about-bg-arena.webp)', transform: 'scale(1.05)' }}
            />

            {/* 2. Foreground Person */}
            <div 
                ref={fgRef}
                className="fixed inset-0 z-[2] bg-cover will-change-transform"
                style={{ 
                    backgroundImage: 'url(/images/about-fg-k4sen.webp)',
                    backgroundPosition: 'center 70%',
                    transform: 'scale(1.05)'
                }}
            />

            {/* 3. Black Overlay */}
            <div className="fixed inset-0 z-[3] bg-black/45 pointer-events-none" />

            {/* 4. Scroll Spacer (100vh) */}
            <div className="h-[100vh] w-full relative z-[10] flex flex-col items-center justify-center">
                <div 
                    className={`flex flex-col items-center justify-center transition-opacity duration-700 pointer-events-none ${hasScrolled ? 'opacity-0' : 'opacity-100 animate-pulse'}`}
                >
                    <span className="text-neon font-bold tracking-[0.3em] text-sm mb-2">SCROLL DOWN</span>
                    <ChevronDown className="text-neon w-10 h-10" />
                </div>
            </div>

            {/* 5. Main Content */}
            <div className="relative z-[10] pb-24 px-4 md:px-12 max-w-7xl mx-auto">
                <style>{`
                    [data-scroll-reveal] {
                        opacity: 0;
                        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
                    }
                    [data-scroll-reveal="up"] { transform: translateY(30px); }
                    [data-scroll-reveal].is-revealed { opacity: 1; transform: translateY(0); }
                    
                    /* Stagger Container */
                    [data-scroll-reveal="stagger-parent"] {
                        opacity: 1;
                        transform: none;
                    }
                    [data-scroll-reveal="stagger-parent"] .stagger-child-sm {
                        opacity: 0;
                        transform: translateY(20px);
                        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
                    }
                    [data-scroll-reveal="stagger-parent"] .stagger-child-lg {
                        opacity: 0;
                        transform: translateY(40px);
                        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
                    }
                    [data-scroll-reveal="stagger-parent"].is-revealed .stagger-child-sm,
                    [data-scroll-reveal="stagger-parent"].is-revealed .stagger-child-lg {
                        opacity: 1;
                        transform: translateY(0);
                    }
                `}</style>

                <h1 
                    data-scroll-reveal="up" 
                    className="text-6xl md:text-8xl font-heading font-bold mb-16 text-center text-white italic"
                >
                    ABOUT <span className="text-neon">US</span>
                </h1>

                <div data-scroll-reveal="stagger-parent" className="grid md:grid-cols-2 gap-16 items-center mb-32">
                    <div className="space-y-4 text-xl text-white leading-relaxed font-medium">
                        <p className="stagger-child-sm" style={{ transitionDelay: '0s' }}>
                            NEET DIVISIONは、k4senリスナーによって結成された、世界で最も「働きたくない（けどLoLはしたい）」精鋭たちの集まりです。
                        </p>
                        <p className="stagger-child-sm bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-8 rounded-xl" style={{ transitionDelay: '0.15s' }}>
                            我々はプロではありません。しかし、ニートとしての誇りと時間だけは無限にあります。 サモナーズリフトにおいて、我々の右に出る無職はいません。
                        </p>
                        <p className="stagger-child-sm" style={{ transitionDelay: '0.3s' }}>
                            そして、k4senさんのリスナーであれば、誰しもがNEET DIVISIONの一員なのです。
                        </p>
                    </div>
                    <div className="relative group stagger-child-sm" style={{ transitionDelay: '0.45s' }}>
                        <div className="relative overflow-hidden rounded-2xl">
                            <Image
                                src="/images/neet_division_logo.webp"
                                alt="NEET DIVISION INFO"
                                width={1200}
                                height={675}
                                className="w-full h-auto rounded-2xl"
                            />
                        </div>
                    </div>
                </div>

                <h2 data-scroll-reveal="up" className="text-5xl font-heading mb-12 tracking-tight text-center text-neon">ACTIVITY</h2>
                <div data-scroll-reveal="stagger-parent" className="grid md:grid-cols-3 gap-8 mb-32">
                    <div className="stagger-child-lg bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-10 rounded-xl" style={{ transitionDelay: '0s' }}>
                        <h3 className="text-2xl font-bold mb-4 text-neon tracking-wider">RANKED FLEX</h3>
                        <p className="text-white leading-relaxed">IronからGrandmasterまで、階級社会を無視したカオスなチームランク。24時間体制でフルパ募集が行われている。</p>
                    </div>
                    <div className="stagger-child-lg bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-10 rounded-xl" style={{ transitionDelay: '0.2s' }}>
                        <h3 className="text-2xl font-bold mb-4 text-neon tracking-wider">SCRIM</h3>
                        <p className="text-white leading-relaxed">配信者のカスタムゲームへの緊急出動。スクリム待機は日常茶飯事、人事部長の命令には逆らえない。</p>
                    </div>
                    <div className="stagger-child-lg bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-10 rounded-xl" style={{ transitionDelay: '0.4s' }}>
                        <h3 className="text-2xl font-bold mb-4 text-neon tracking-wider">SUB EVENTS</h3>
                        <p className="text-white leading-relaxed">時にはイベントにチームとして優先的に呼ばれる。その時まで爪を研ぎ続ける。</p>
                    </div>
                </div>

                {/* Original Site Link */}
                <div data-scroll-reveal="up" className="text-center text-zinc-500 font-bold tracking-widest text-lg">
                    <a href="https://neetdi.vision/" target="_blank" rel="noopener noreferrer" className="hover:text-neon transition-colors duration-300">
                        NEET DIVISION ORIGINAL SITE
                    </a>
                </div>
            </div>

            {/* 6. OUR BOSS Scroll Container (200vh) */}
            <div ref={scrollContainerRef} className="h-[200vh] w-full relative z-[10]" />

            {/* 7. OUR BOSS Window (Fixed) */}
            <div 
                ref={bossWindowRef}
                className="fixed z-[20] bg-zinc-900 bg-cover bg-center overflow-hidden will-change-transform shadow-[0_-8px_32px_rgba(0,0,0,0.5)]"
                style={{ 
                    backgroundImage: 'url(/images/bg-wallpaper.webp)',
                    transform: 'translateY(100vh) scale(0.7)',
                    opacity: 0,
                    top: '16px', bottom: '0px', left: '16px', right: '16px',
                    borderRadius: '24px 24px 0 0',
                    transformOrigin: 'bottom center'
                }}
            >
                <div ref={bossContentRef} className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-12 opacity-0 overflow-y-auto">
                    <h2 className="text-5xl font-heading mb-12 tracking-tight text-center text-white">OUR BOSS</h2>
                    <div className="w-48 h-48 md:w-64 md:h-64 relative rounded-full border-4 border-white overflow-hidden shrink-0 mx-auto mb-8">
                        <Image
                            src="/images/boss-icon.webp"
                            alt="k4sen"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="text-center max-w-2xl">
                        <h3 className="text-4xl md:text-5xl font-bold mb-2">k4sen</h3>
                        <p className="text-neon font-bold tracking-widest mb-6">THE LEGENDARY STREAMER</p>
                        <p className="text-white text-lg md:text-xl leading-relaxed mb-8">
                            我らがボスであり、全てのニートの希望の星。
                            彼の配信通知が我々の起床アラームであり、彼の言葉が我々の法律である。
                            NEET DIVISIONは、彼のために存在し、彼と共に歩む。
                        </p>
                        <a href="https://note.com/another_crown/n/n53bfbf0f56c8" target="_blank" rel="noopener noreferrer" className="text-neon font-bold underline hover:text-white transition-colors mb-8 inline-block active:scale-95">
                            k4senについて知る
                        </a>
                        <div className="flex gap-6 justify-center">
                            <a href="https://x.com/k4sen" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full backdrop-blur-md bg-white/95 border border-white/60 text-black hover:bg-white/50 hover:text-white hover:scale-110 active:scale-90 transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.4)]">
                                <Twitter size={28} />
                            </a>
                            <a href="https://www.youtube.com/@zzxk4sen" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full backdrop-blur-md bg-white/95 border border-white/60 text-black hover:bg-white/50 hover:text-white hover:scale-110 active:scale-90 transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.4)]">
                                <Youtube size={28} />
                            </a>
                            <a href="https://www.twitch.tv/k4sen" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full backdrop-blur-md bg-white/95 border border-white/60 text-black hover:bg-white/50 hover:text-white hover:scale-110 active:scale-90 transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.4)]">
                                <Twitch size={28} />
                            </a>
                            <a href="https://www.instagram.com/k4sen.denei/?hl=ja" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full backdrop-blur-md bg-white/95 border border-white/60 text-black hover:bg-white/50 hover:text-white hover:scale-110 active:scale-90 transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.4)]">
                                <Instagram size={28} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
