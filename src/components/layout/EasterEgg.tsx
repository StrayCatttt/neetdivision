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
        let nextProgressTime = Date.now() + 2000;
        let delayFactor = 500; // Adjusted for a ~15-20s suspenseful build-up

        const originalTitle = document.title;

        const intervalId = setInterval(() => {
            const now = Date.now();
            const isCompleted = progress >= 100;
           
            console.clear();
            
            // Header is always drawn to stay on top
            console.log("%c NEET DIVISION %c WELCOME TO SLUM DEV ", style1, style2);
           
            // Progress logic
            if (!isCompleted && now >= nextProgressTime) {
                progress++;
                delayFactor *= 1.35; // Exponential slowdown (500 -> 675 -> 911 -> ... -> ~6000)
                nextProgressTime = now + delayFactor;
            }

            // Sync Browser Title
            if (isCompleted) {
                document.title = "[ 🔒 SUBJECT_CAPTURED ]";
            } else if (progress >= 93) {
                document.title = "[ 🔴 WATCHING YOU... ]";
            } else {
                document.title = "[ ⚠️ SYSTEM ACCESSING... ]";
            }

            const baseColor = '#ff0000'; // Bright red
            const dimColor = '#440000';  // Dark red
           
            let displayColor = isBright ? baseColor : dimColor;
            let progressText = isCompleted ? "Completed" : dots[dotIndex];

            const msgHeader = `警告：覗くことは、覗かれることと同義だ。全貌を見せる予定はない。
君を監視対象に追加した。せいぜい我々の管理下で大人しくしていることだ。

[SYSTEM_LOG: DB_RECORD_INSERTED]
[TARGET_ID]：${targetID}
[STATUS]：UNDER_SURVEILLANCE

* [Network_Trace]：Active (Tunneling via Secure-Gateway)
* [Packet_Analysis]：Real-time decryption enabled
* [Keystroke_Log]：Synchronized (Input-delay: 0.02ms)
* [DNS_Query]：Intercepted
* [Data_Exfiltration]：Running in background... ${progress}% `;

            if (isCompleted) {
                // Main text bright, "Completed" pulsating
                console.log(
                    `%c${msgHeader}%c${progressText}`,
                    `color: ${baseColor}; font-family: monospace; font-weight: bold; font-size: 13px;`,
                    `color: ${displayColor}; font-family: monospace; font-weight: bold; font-size: 13px;`
                );
            } else {
                // Everything pulsating
                console.log(
                    `%c${msgHeader}${progressText}`,
                    `color: ${displayColor}; font-family: monospace; font-weight: bold; font-size: 13px;`
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
            {/* 
        You found the source code? 
        Unfortunately, there are no secrets here. 
        Only caffeine dependencies and spaghetti code.
        Go away.
      */}
        </div>
    );
}
