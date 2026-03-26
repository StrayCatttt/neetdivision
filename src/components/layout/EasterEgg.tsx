"use client";
import { useEffect } from "react";

export default function EasterEgg() {
    useEffect(() => {
        const style1 = "background: #ccff00; color: #000; font-size: 20px; font-weight: bold; padding: 10px;";
        const style2 = "background: #000; color: #ccff00; font-size: 20px; font-weight: bold; padding: 10px;";

        const targetID = "#63087-SYS-B";
        const dots = [".  ", ".. ", "...", " ..", "  ."];
        let dotIndex = 0;
        let isBright = true;
        let progress = 91;
        
        let nextProgressTime = Date.now() + 1000;
        let delayFactor = 1000; 

        const originalTitle = document.title;

        const intervalId = setInterval(() => {
            const now = Date.now();
            const isCompleted = progress >= 100;
           
            console.clear();
            
            // Header
            console.log("%c NEET DIVISION %c WELCOME TO SLUM DEV ", style1, style2);
           
            // Progress logic (Calculated for ~4 minutes total duration from 91 -> 100)
            if (!isCompleted && now >= nextProgressTime) {
                progress++;
                delayFactor *= 1.8; // 1000 * (1.8^9) sum ~= 240,000ms = 4 mins
                nextProgressTime = now + delayFactor;
            }

            // Sync Browser Title (Dynamic)
            if (isCompleted) {
                document.title = "🔒 SUBJECT_CAPTURED";
            } else if (progress >= 93) {
                document.title = "🔴 WATCHING YOU...";
            } else {
                document.title = "⚠️ SYSTEM ACCESSING...";
            }

            // Colors
            const baseGrey = '#888888';
            const dimGrey = '#444444';
            const brightGrey = '#cccccc';

            const brightRed = '#ff0000';
            const dimRed = '#440000';
           
            let displayColor = isBright ? (isCompleted ? brightRed : brightGrey) : (isCompleted ? dimRed : dimGrey);
            let progressText = isCompleted ? "Completed" : dots[dotIndex];

            const msgTop = `警告：覗くことは、覗かれることと同義だ。全貌を見せる予定はない。\n君を監視対象に追加した。せいぜい我々の管理下で大人しくしていることだ。\n`;

            const msgBody = `
[SYSTEM_LOG: DB_RECORD_INSERTED]
[TARGET_ID]：${targetID}
[STATUS]：UNDER_SURVEILLANCE

* [Network_Trace]：Active (Tunneling via Secure-Gateway)
* [Packet_Analysis]：Real-time decryption enabled
* [Keystroke_Log]：Synchronized (Input-delay: 0.02ms)
* [DNS_Query]：Intercepted
* [Data_Exfiltration]：Running in background... `;

            if (isCompleted) {
                console.log(
                    `%c${msgTop}%c${msgBody}${progress}% %c${progressText}`,
                    `color: ${brightRed}; font-family: monospace; font-weight: bold; font-size: 13px;`,
                    `color: ${baseGrey}; font-family: monospace; font-weight: normal; font-size: 13px;`,
                    `color: ${displayColor}; font-family: monospace; font-weight: bold; font-size: 13px;`
                );
            } else {
                console.log(
                    `%c${msgTop}%c${msgBody}%c${progress}% ${progressText}`,
                    `color: ${brightRed}; font-family: monospace; font-weight: bold; font-size: 13px;`,
                    `color: ${baseGrey}; font-family: monospace; font-weight: normal; font-size: 13px;`,
                    `color: ${displayColor}; font-family: monospace; font-weight: normal; font-size: 13px;`
                );
            }
           
            dotIndex = (dotIndex + 1) % dots.length;
            isBright = !isBright;
           
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
