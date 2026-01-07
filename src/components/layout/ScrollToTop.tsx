"use client";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 1 screen height
      if (window.scrollY > window.innerHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 p-3 bg-neon text-black rounded-full shadow-[0_0_20px_rgba(204,255,0,0.5)] hover:bg-white hover:scale-110 transition-all duration-300 z-50 group"
      aria-label="Scroll to top"
      style={{ colorScheme: 'light' }}
    >
      <ArrowUp size={24} strokeWidth={3} className="group-hover:-translate-y-1 transition-transform duration-300" style={{ color: '#000' }} />
    </button>
  );
}
