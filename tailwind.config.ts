import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                neon: {
                    DEFAULT: "#CCFF00", // ZETA-ish Lime
                    dim: "rgba(204, 255, 0, 0.1)"
                }
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                'futura-bold': ['var(--font-futura-bold)', 'sans-serif'],
                'futura-light': ['var(--font-futura-light)', 'sans-serif'],
                heading: ['var(--font-inter)', 'sans-serif'],
            },
            animation: {
                'glitch': 'glitch 1s linear infinite',
                'slide-down-fade': 'slideDownFade 0.6s cubic-bezier(0.0, 0.0, 0.2, 1) both',
            },
            keyframes: {
                glitch: {
                    '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
                    '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
                    '62%': { transform: 'translate(0,0) skew(5deg)' },
                },
                slideDownFade: {
                    '0%': { transform: 'translateY(-30px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
};
export default config;
