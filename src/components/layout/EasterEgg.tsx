"use client";
import { useEffect } from "react";

export default function EasterEgg() {
    useEffect(() => {
        // ── Styles ──
        const headerStyle1 = "background: #ccff00; color: #000; font-size: 20px; font-weight: bold; padding: 10px;";
        const headerStyle2 = "background: #000; color: #ccff00; font-size: 20px; font-weight: bold; padding: 10px;";
        const redBold = "color: #ff0000; font-family: monospace; font-weight: bold; font-size: 13px;";
        const grey = "color: #888888; font-family: monospace; font-weight: normal; font-size: 12px;";
        const greyDim = "color: #555555; font-family: monospace; font-weight: normal; font-size: 11px;";
        const cyanBold = "color: #00ffcc; font-family: monospace; font-weight: bold; font-size: 12px;";
        const cyanDim = "color: #007766; font-family: monospace; font-weight: normal; font-size: 11px;";
        const yellowDim = "color: #ccaa00; font-family: monospace; font-weight: normal; font-size: 11px;";

        // ── State ──
        const targetID = "NDV-" + Math.random().toString(36).substring(2, 8).toUpperCase();
        const sessionHash = Array.from({ length: 32 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join('');
        const dots = [".", "..", "...", "...."];
        let dotIndex = 0;
        let progress = 91;
        let nextProgressTime = 0;
        let delayFactor = 1000;
        let started = false;
        let startTime = 0;
        const originalTitle = document.title;

        // ── DevTools detection ──
        // Uses a trick: when DevTools is open, accessing .toString() on a logged object triggers
        let devToolsOpen = false;
        const devToolsCheck = /./;
        let lastCheckTime = 0;
        devToolsCheck.toString = function () {
            devToolsOpen = true;
            return '';
        };

        const intervalId = setInterval(() => {
            // Probe DevTools state every tick
            devToolsOpen = false;
            lastCheckTime = Date.now();
            console.log("%c", devToolsCheck as any);

            // If DevTools not open, do nothing (don't start the sequence)
            if (!devToolsOpen) {
                return;
            }

            // Initialize on first DevTools open
            if (!started) {
                started = true;
                startTime = Date.now();
                nextProgressTime = Date.now() + 2000; // first tick after 2s
                delayFactor = 2000;
            }

            const now = Date.now();
            const isCompleted = progress >= 100;

            console.clear();

            // ╔══════════════════════════════════════════════════╗
            //   HEADER
            // ╚══════════════════════════════════════════════════╝
            console.log("%c NEET DIVISION %c WELCOME TO SLUM DEV ", headerStyle1, headerStyle2);

            // ── Progress Logic (~4 min total: 91→100) ──
            if (!isCompleted && now >= nextProgressTime) {
                progress++;
                delayFactor *= 1.65; // Exponential: sum ≈ 240s
                nextProgressTime = now + delayFactor;
            }

            // ── Sync Tab Title ──
            if (isCompleted) {
                document.title = "🔒 SUBJECT_CAPTURED";
            } else if (progress >= 93) {
                document.title = "🔴 WATCHING YOU...";
            } else {
                document.title = "⚠️ SYSTEM ACCESSING...";
            }

            // ── Red Warning (top) ──
            const warning = `警告：覗くことは、覗かれることと同義だ。全貌を見せる予定はない。
君を監視対象に追加した。せいぜい我々の管理下で大人しくしていることだ。`;
            console.log(`%c${warning}`, redBold);

            // ── Cyber UI Body ──
            const elapsed = ((now - startTime) / 1000).toFixed(1);
            const fakeIP = `${Math.floor(Math.random()*223+1)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
            const fakePorts = [443, 8080, 22, 3389, 9001, 4444][Math.floor(Math.random() * 6)];

            console.log(
                `%c╔══════════════════════════════════════════════════════════════╗
║  %c[ SYSTEM_INTRUSION_LOG ]%c                                     ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  %c> SESSION    : ${sessionHash}%c  ║
║  %c> TARGET_ID  : ${targetID}                              %c  ║
║  %c> STATUS     : UNDER_SURVEILLANCE                       %c  ║
║  %c> ELAPSED    : ${elapsed}s                                 %c  ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  %c[ ACTIVE_THREADS ]%c                                          ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  %c◆ NET_TRACE      │ ${fakeIP}:${fakePorts} │ TUNNELED%c         ║
║  %c◆ PKT_ANALYSIS   │ Decrypting TLS 1.3    │ LIVE%c             ║
║  %c◆ KEYSTROKE_CAP  │ Input-latency: 0.02ms │ SYNCED%c           ║
║  %c◆ DNS_INTERCEPT  │ Queries rerouted      │ ACTIVE%c           ║
║  %c◆ MEM_DUMP       │ Heap snapshot ready   │ QUEUED%c           ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  %c[ DATA_EXFILTRATION ]%c                                       ║
╠══════════════════════════════════════════════════════════════╣`,
                greyDim, cyanBold, greyDim,
                cyanDim, greyDim,
                cyanDim, greyDim,
                yellowDim, greyDim,
                cyanDim, greyDim,
                cyanBold, greyDim,
                grey, greyDim,
                grey, greyDim,
                grey, greyDim,
                grey, greyDim,
                grey, greyDim,
                cyanBold, greyDim
            );

            // ── Progress Bar ──
            const barLength = 30;
            const filled = Math.round((progress / 100) * barLength);
            const empty = barLength - filled;
            const bar = "█".repeat(filled) + "░".repeat(empty);

            if (isCompleted) {
                // 100% - static red "100% Completed", no blinking
                console.log(
                    `%c║                                                              ║
║  %c▓▓▓ [${bar}] ${progress}% Completed ▓▓▓%c  ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`,
                    greyDim,
                    redBold,
                    greyDim
                );
            } else {
                // In progress - dots cycle in grey
                const dotStr = dots[dotIndex];
                console.log(
                    `%c║                                                              ║
║  %c▓▓▓ [${bar}] ${progress}% ${dotStr}%c                        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`,
                    greyDim,
                    grey,
                    greyDim
                );
            }

            dotIndex = (dotIndex + 1) % dots.length;

        }, 500);

        return () => {
            clearInterval(intervalId);
            document.title = originalTitle;
        };
    }, []);

    return (
        <div className="hidden">
        </div>
    );
}
