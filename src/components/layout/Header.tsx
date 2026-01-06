"use client";
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

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
                <Link href="/" className="text-2xl font-bold text-white tracking-tighter flex gap-2">
                    <span className="font-futura-bold tracking-[-0.025em] drop-shadow-[0_0_8px_rgba(204,255,0,0.5)]">NEET</span> <span className="font-futura-light text-neon">DIVISION</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={cn(
                                "text-sm font-bold transition-all uppercase hover:text-neon hover:underline decoration-neon decoration-2 underline-offset-4",
                                pathname === item.path ? "text-neon underline" : "text-gray-300"
                            )}
                        >
                            {item.name}
                        </Link>
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
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className="text-xl font-bold text-white hover:text-neon"
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
