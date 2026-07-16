"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (document.readyState === 'complete') {
            setIsLoaded(true);
        } else {
            const handleLoad = () => setIsLoaded(true);
            window.addEventListener('load', handleLoad);
            return () => window.removeEventListener('load', handleLoad);
        }
    }, []);

    const navItems = [
        { name: 'HOME', path: '/' },
        { name: 'ABOUT', path: '/about' },
        { name: 'ACHIEVEMENTS', path: '/achievements' },
        { name: 'RECRUIT', path: '/recruit' },
        { name: 'CREATOR', path: '/creator' },
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                <Link href="/" className="text-2xl font-bold text-white tracking-tighter flex gap-2 active:scale-95 transition-transform origin-left">
                    <span className="font-futura-bold tracking-[-0.025em] drop-shadow-[0_0_8px_rgba(204,255,0,0.5)]">NEET</span> <span className="font-futura-light text-neon">DIVISION</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-8">
                    {navItems.map((item, index) => (
                        <motion.div
                            key={item.path}
                            initial={{ y: -30, opacity: 0 }}
                            animate={isLoaded ? { y: 0, opacity: 1 } : { y: -30, opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
                        >
                            <Link
                                href={item.path}
                                className={cn(
                                    "text-sm font-bold transition-all uppercase hover:text-neon hover:underline decoration-neon decoration-2 underline-offset-4 active:scale-90 inline-block",
                                    pathname === item.path ? "text-neon underline" : "text-gray-300"
                                )}
                            >
                                {item.name}
                            </Link>
                        </motion.div>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Nav */}
            <div className={cn("md:hidden absolute top-full left-0 w-full bg-black border-b border-neon transition-all duration-300 overflow-hidden", isOpen ? "max-h-96" : "max-h-0")}>
                <nav className="flex flex-col p-6 gap-4">
                    {navItems.map((item, index) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={cn(
                                "text-xl font-bold text-white hover:text-neon transition-all duration-500 ease-out",
                                isOpen 
                                    ? "opacity-100 translate-x-0" 
                                    : "opacity-0 translate-x-12"
                            )}
                            style={{ transitionDelay: isOpen ? `${index * 80}ms` : '0ms' }}
                            onClick={() => setIsOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
