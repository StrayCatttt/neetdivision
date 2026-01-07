"use client";
import { useEffect } from "react";

export default function EasterEgg() {
    useEffect(() => {
        const style1 = "background: #ccff00; color: #000; font-size: 20px; font-weight: bold; padding: 10px;";
        const style2 = "background: #000; color: #ccff00; font-size: 20px; font-weight: bold; padding: 10px;";
        const style3 = "color: #ff0000; font-size: 14px; font-weight: bold; margin-top: 5px;";

        console.log("%c NEET DIVISION %c WELCOME TO THE SLUMS ", style1, style2);
        console.log("%c 警告：深淵を覗くとき、深淵もまたこちらを覗いている。", style3);
        console.log("%c (ソースコードを見ても猫の画像しかありませんよ？)", "color: #888; font-size: 12px;");
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
