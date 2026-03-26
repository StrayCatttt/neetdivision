"use client";
import { useEffect } from "react";

export default function EasterEgg() {
    useEffect(() => {
        const s1 = "background:#ccff00;color:#000;font-size:20px;font-weight:bold;padding:10px;";
        const s2 = "background:#000;color:#ccff00;font-size:20px;font-weight:bold;padding:10px;";
        const red = "color:#ff0000;font-family:monospace;font-weight:bold;font-size:13px;";
        const cyber = "color:#00aa88;font-family:monospace;font-size:12px;";
        const dimStyle = "color:#888;font-family:monospace;font-size:12px;";
        const greyStyle = "color:#666;font-family:monospace;font-size:11px;font-style:italic;";
        const btnStyle = "background:#003322;color:#00ffcc;border:1px solid #00ffcc;padding:2px 8px;font-family:monospace;font-weight:bold;font-size:11px;border-radius:3px;";

        const tid = "NDV-" + Math.random().toString(36).substring(2, 8).toUpperCase();
        const hash = Array.from({length:32}, () => "0123456789abcdef"[Math.floor(Math.random()*16)]).join('');
        const dots = [".", "..", "...", "...."];
        let di = 0, progress = 91;
        let nextPT = Date.now() + 2000, dly = 2000;
        let frozenEl = "", frozenIP = "";
        let titleUnlocked = false;
        const startTime = Date.now();
        const origTitle = document.title;
        const W = 58;
        const bdr = "═".repeat(W);
        const ln = (s: string) => `║  ${s}${" ".repeat(Math.max(0, W - 2 - s.length))}║`;
        const pct = String.fromCharCode(37);

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j'))) {
                titleUnlocked = true;
            }
        };
        window.addEventListener('keydown', onKeyDown);

        const initH = window.innerHeight;
        const initW = window.innerWidth;
        const onResize = () => {
            if (initH - window.innerHeight > 50 || initW - window.innerWidth > 50) {
                titleUnlocked = true;
            }
        };
        window.addEventListener('resize', onResize);

        const mainInterval = setInterval(() => {
            const now = Date.now();
            const done = progress >= 100;
            
            // Console management
            console.clear();
            // Using a slightly delayed log or single log to avoid "Console was cleared" if possible, 
            // but in Chrome it's hard. We'll just provide the grey version.
            console.log("%cConsole was deleted", greyStyle);
            
            console.log("%c NEET DIVISION %c WELCOME TO SLUM DEV ", s1, s2);
            console.log("%c警告：覗くことは、覗かれることと同義だ。全貌を見せる予定はない。\n君を監視対象に追加した。せいぜい我々の管理下で大人しくしていることだ。", red);

            if (!done && now >= nextPT) {
                progress++;
                dly *= 1.65;
                nextPT = now + dly;
            }

            if (titleUnlocked) {
                if (done) document.title = "🔒 SUBJECT_CAPTURED";
                else if (progress >= 93) document.title = "🔴 WATCHING YOU...";
                else document.title = "⚠️ SYSTEM ACCESSING...";
            }

            let el: string;
            if (done) { if (!frozenEl) frozenEl = ((now - startTime) / 1000).toFixed(1); el = frozenEl; }
            else el = ((now - startTime) / 1000).toFixed(1);

            let ip: string, port: string;
            if (done) { if (!frozenIP) frozenIP = "DISCONNECTED"; ip = "DISCONNECTED"; port = "---"; }
            else {
                ip = `${Math.floor(Math.random()*223+1)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
                port = String([443, 8080, 22, 3389, 9001, 4444][Math.floor(Math.random() * 6)]);
            }

            const tHead = [
                `╔${bdr}╗`,
                ln("[ SYSTEM_INTRUSION_LOG ]"),
                `╠${bdr}╣`,
                ln(""),
                ln(`> SESSION    : ${hash}`),
                ln(`> TARGET_ID  : ${tid}`),
                ln(`> STATUS     : UNDER_SURVEILLANCE`),
                ln(`> ELAPSED    : ${el}s`),
                ln(""),
                `╠${bdr}╣`,
                ln("[ ACTIVE_THREADS ]"),
                `╠${bdr}╣`,
                ln(""),
                ln(`◆ NET_TRACE      │ ${(ip+":"+port).padEnd(20)} │ TUNNELED`),
                ln(`◆ PKT_ANALYSIS   │ ${"Decrypting TLS 1.3".padEnd(20)} │ LIVE`),
                ln(`◆ KEYSTROKE_CAP  │ ${"Input-delay: 0.02ms".padEnd(20)} │ SYNCED`),
                ln(`◆ DNS_INTERCEPT  │ ${"Queries rerouted".padEnd(20)} │ ACTIVE`),
                ln(`◆ MEM_DUMP       │ ${"Heap snapshot ready".padEnd(20)} │ QUEUED`),
                ln(""),
                `╠${bdr}╣`,
                ln("[ DATA_EXFILTRATION ]"),
                `╠${bdr}╣`,
            ].join('\n');
            console.log(`%c${tHead}`, cyber);

            const bLen = 28;
            const filled = Math.round((progress / 100) * bLen);
            const bar = "█".repeat(filled) + "░".repeat(bLen - filled);
            
            if (done) {
                console.log(`%c${ln("")}\n${ln(`▓▓▓ [${bar}] 100${pct} Completed ▓▓▓`)}\n${ln("")}\n╚${bdr}╝`, red);
            } else {
                const dot = dots[di].padEnd(4);
                console.log(`%c${ln("")}\n${ln(`▓▓▓ [${bar}] ${progress}${pct} ${dot}`)}\n${ln("")}\n╚${bdr}╝`, dimStyle);
            }

            // Links as stylish "Buttons"
            console.log("\n%c[ ACCESS_TERMINALS ]", cyber);
            console.log(
                "%c MAIN_NODE %c  https://neet-division.com\n" +
                "%c OPERATOR  %c  https://x.com/4EXP_\n" +
                "%c RELAY_CH  %c  https://discord.gg/57VqX4DCD7",
                btnStyle, cyber,
                btnStyle, cyber,
                btnStyle, cyber
            );

            if (!done) di = (di + 1) % dots.length;
        }, 1000);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('resize', onResize);
            clearInterval(mainInterval);
            document.title = origTitle;
        };
    }, []);

    return <div className="hidden" />;
}
