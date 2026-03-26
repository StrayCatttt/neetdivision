"use client";
import { useEffect } from "react";

export default function EasterEgg() {
    useEffect(() => {
        const s1 = "background:#ccff00;color:#000;font-size:20px;font-weight:bold;padding:10px;";
        const s2 = "background:#000;color:#ccff00;font-size:20px;font-weight:bold;padding:10px;";
        const redStyle = "color:#ff0000;font-family:monospace;font-weight:bold;font-size:13px;";
        const cyber = "color:#00aa88;font-family:monospace;font-size:12px;";
        const dimStyle = "color:#888;font-family:monospace;font-size:12px;";

        const tid = "NDV-" + Math.random().toString(36).substring(2, 8).toUpperCase();
        const hash = Array.from({length:32}, () => "0123456789abcdef"[Math.floor(Math.random()*16)]).join('');
        const dots = [".", "..", "...", "...."];
        let di = 0, progress = 91;
        let nextPT = Date.now() + 2000, dly = 2000;
        let frozenEl = "", frozenIP = "";
        let titleUnlocked = false;
        const startTime = Date.now();
        const origTitle = document.title;
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
            
            console.clear();
            // Two empty lines after "Console was cleared" (which is printed by console.clear())
            // Note: Most browsers don't allow spacing *before* the first log after clear cleanly,
            // so we log two newlines at the start of our first visible block.
            
            console.log("\n\n");
            console.log("%c NEET DIVISION %c WELCOME TO SLUM DEV ", s1, s2);
            
            console.log("\n\n");
            console.log("%c警告：覗くことは、覗かれることと同義だ。全貌を見せる予定はない。\n君を監視対象に追加した。せいぜい我々の管理下で大人しくしていることだ。", redStyle);

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

            // Body without horizontal dividers
            const bodyLines = [
                "",
                "[ SYSTEM_INTRUSION_LOG ]",
                "",
                `  > SESSION    : ${hash}`,
                `  > TARGET_ID  : ${tid}`,
                `  > STATUS     : UNDER_SURVEILLANCE`,
                `  > ELAPSED    : ${el}s`,
                "",
                "[ ACTIVE_THREADS ]",
                "",
                `  ◆ NET_TRACE      │ ${(ip+":"+port).padEnd(20)} │ TUNNELED`,
                `  ◆ PKT_ANALYSIS   │ ${"Decrypting TLS 1.3".padEnd(20)} │ LIVE`,
                `  ◆ KEYSTROKE_CAP  │ ${"Input-delay: 0.02ms".padEnd(20)} │ SYNCED`,
                `  ◆ DNS_INTERCEPT  │ ${"Queries rerouted".padEnd(20)} │ ACTIVE`,
                `  ◆ MEM_DUMP       │ ${"Heap snapshot ready".padEnd(20)} │ QUEUED`,
                "",
                "[ DATA_EXFILTRATION ]",
                ""
            ].join('\n');
            console.log(`%c${bodyLines}`, cyber);

            // Progress Bar area
            const bLen = 35;
            const filled = Math.round((progress / 100) * bLen);
            const bar = "█".repeat(filled) + "░".repeat(bLen - filled);
            
            if (done) {
                // Static Red for 100% Completed
                console.log(`%c  [${bar}] 100${pct} Completed`, redStyle);
            } else {
                // Dim for in progress
                const dot = dots[di].padEnd(4);
                console.log(`%c  [${bar}] ${progress}${pct} ${dot}`, dimStyle);
            }

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
