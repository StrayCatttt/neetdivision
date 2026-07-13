"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Coffee, CheckCircle2 } from "lucide-react";

export default function OrderSuccess() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 overflow-hidden relative">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon/10 rounded-full blur-[120px] pointer-events-none" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-zinc-900/50 backdrop-blur-xl border border-neon/30 p-12 text-center max-w-lg relative z-10 shadow-[0_0_50px_rgba(204,255,0,0.1)]"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                    className="w-20 h-20 bg-neon rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(204,255,0,0.5)]"
                >
                    <CheckCircle2 className="text-black w-10 h-10" />
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-heading font-black mb-6 tracking-tighter italic">
                    <span className="text-neon">PURCHASE</span>
                    <br />
                    COMPLETE
                </h1>

                <div className="space-y-4 mb-10">
                    <p className="text-white text-xl font-bold font-body leading-relaxed">
                        ご購入ありがとうございます！
                    </p>
                    <p className="text-gray-400 text-base font-body leading-relaxed">
                        デジタルアーカイブへのアクセス権が付与されました。
                        <br />
                        Strayの活動を支える貴重な<span className="text-neon font-bold">リソース</span>として活用させていただきます。
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <Link
                        href="/"
                        className="group relative inline-block px-10 py-4 bg-neon text-black font-black uppercase tracking-widest transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-[0_5px_15px_rgba(204,255,0,0.3)]"
                    >
                        <span className="relative z-10">Return to Slums</span>
                        <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                    </Link>
                    
                    <p className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] mt-4">
                        Securely processed by Stripe
                    </p>
                </div>
            </motion.div>

            {/* Decorative Coffee Icon */}
            <motion.div
                animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute bottom-10 right-10 text-neon/20 pointer-events-none"
            >
                <Coffee size={120} />
            </motion.div>
        </div>
    );
}
