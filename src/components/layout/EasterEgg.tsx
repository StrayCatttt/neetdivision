"use client";
import { useEffect } from "react";

export default function EasterEgg() {
    useEffect(() => {
        const s1 = "background:#ccff00;color:#000;font-size:20px;font-weight:bold;padding:10px;";
        const s2 = "background:#000;color:#ccff00;font-size:20px;font-weight:bold;padding:10px;";
        const red = "color:#ff0000;font-family:monospace;font-weight:bold;font-size:13px;";
        const cyber = "color:#00aa88;font-family:monospace;font-size:12px;";
        const dimStyle = "color:#888;font-family:monospace;font-size:12px;";
        const delStyle = "color:#cc3333;font-family:monospace;font-size:11px;font-style:italic;";

        const tid = "NDV-" + Math.random().toString(36).substring(2, 8).toUpperCase();
        const hash = Array.from({length:32}, () => "0123456789abcdef"[Math.floor(Math.random()*16)]).join('');
        const dots = [".", "..", "...", "...."];
        let di = 0, progress = 91;
        let startTime = 0, nextPT = 0, dly = 2000;
        let frozenEl = "", frozenIP = "";
        let animStarted = false;
        const origTitle = document.title;
        const W = 58;
        const bdr = "═".repeat(W);
        const ln = (s: string) => `║  ${s}${" ".repeat(Math.max(0, W - 2 - s.length))}║`;
        const pct = String.fromCharCode(37);

        let mainInterval: ReturnType<typeof setInterval> | null = null;

        // ── Main animation ──
        const startMain = () => {
            if (animStarted) return;
            animStarted = true;
            startTime = Date.now();
            nextPT = Date.now() + 2000;

            mainInterval = setInterval(() => {
                const now = Date.now();
                const done = progress >= 100;
                console.clear();
                console.log("%cConsole was deleted", delStyle);
                console.log("%c NEET DIVISION %c WELCOME TO SLUM DEV ", s1, s2);
                console.log("%c警告：覗くことは、覗かれることと同義だ。全貌を見せる予定はない。\n君を監視対象に追加した。せいぜい我々の管理下で大人しくしていることだ。", red);

                if (!done && now >= nextPT) { progress++; dly *= 1.65; nextPT = now + dly; }
                if (done) document.title = "🔒 SUBJECT_CAPTURED";
                else if (progress >= 93) document.title = "🔴 WATCHING YOU...";
                else document.title = "⚠️ SYSTEM ACCESSING...";

                let el: string;
                if (done) { if (!frozenEl) frozenEl = ((now-startTime)/1000).toFixed(1); el = frozenEl; }
                else el = ((now-startTime)/1000).toFixed(1);

                let ip: string, port: string;
                if (done) { if (!frozenIP) frozenIP = "DISCONNECTED"; ip = "DISCONNECTED"; port = "---"; }
                else {
                    ip = `${Math.floor(Math.random()*223+1)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
                    port = String([443,8080,22,3389,9001,4444][Math.floor(Math.random()*6)]);
                }

                const t = [
                    `╔${bdr}╗`, ln("[ SYSTEM_INTRUSION_LOG ]"), `╠${bdr}╣`, ln(""),
                    ln(`> SESSION    : ${hash}`),
                    ln(`> TARGET_ID  : ${tid}`),
                    ln(`> STATUS     : UNDER_SURVEILLANCE`),
                    ln(`> ELAPSED    : ${el}s`),
                    ln(""), `╠${bdr}╣`, ln("[ ACTIVE_THREADS ]"), `╠${bdr}╣`, ln(""),
                    ln(`◆ NET_TRACE      │ ${(ip+":"+port).padEnd(20)} │ TUNNELED`),
                    ln(`◆ PKT_ANALYSIS   │ ${"Decrypting TLS 1.3".padEnd(20)} │ LIVE`),
                    ln(`◆ KEYSTROKE_CAP  │ ${"Input-delay: 0.02ms".padEnd(20)} │ SYNCED`),
                    ln(`◆ DNS_INTERCEPT  │ ${"Queries rerouted".padEnd(20)} │ ACTIVE`),
                    ln(`◆ MEM_DUMP       │ ${"Heap snapshot ready".padEnd(20)} │ QUEUED`),
                    ln(""), `╠${bdr}╣`, ln("[ DATA_EXFILTRATION ]"), `╠${bdr}╣`,
                ].join('\n');
                console.log(`%c${t}`, cyber);

                const bLen = 28;
                const filled = Math.round((progress / 100) * bLen);
                const bar = "█".repeat(filled) + "░".repeat(bLen - filled);
                if (done) {
                    console.log(`%c${ln("")}\n${ln(`▓▓▓ [${bar}] 100${pct} Completed ▓▓▓`)}\n${ln("")}\n╠${bdr}╣`, red);
                } else {
                    const dot = dots[di].padEnd(4);
                    console.log(`%c${ln("")}\n${ln(`▓▓▓ [${bar}] ${progress}${pct} ${dot}`)}\n${ln("")}\n╠${bdr}╣`, dimStyle);
                }

                const lk = [
                    ln("[ EXTERNAL_ACCESS ]"), `╠${bdr}╣`, ln(""),
                    ln("► [MAIN_NODE] https://neet-division.com"),
                    ln("► [OPERATOR ] https://x.com/4EXP_"),
                    ln("► [RELAY_CH ] https://discord.gg/57VqX4DCD7"),
                    ln(""), `╚${bdr}╝`,
                ].join('\n');
                console.log(`%c${lk}`, cyber);

                if (!done) di = (di + 1) % dots.length;
            }, 1000);
        };

        // ── DevTools detection probe (runs silently until DevTools opens) ──
        const probeInterval = setInterval(() => {
            // Method 1: Object getter - Chrome only calls getters when rendering in open console
            let detected = false;
            const probe = Object.create(null);
            Object.defineProperty(probe, 'id', {
                get: () => { detected = true; return ''; },
                configurable: true,
                enumerable: true,
            });
            console.debug(probe);
            console.clear();

            // Method 2: Window size fallback (docked DevTools changes viewport)
            if (!detected) {
                const hDiff = window.outerHeight - window.innerHeight;
                const wDiff = window.outerWidth - window.innerWidth;
                if (hDiff > 100 || wDiff > 100) detected = true;
            }

            if (detected) {
                clearInterval(probeInterval);
                startMain();
            }
        }, 500);

        return () => {
            clearInterval(probeInterval);
            if (mainInterval) clearInterval(mainInterval);
            document.title = origTitle;
        };
    }, []);

    return <div className="hidden" />;
}
