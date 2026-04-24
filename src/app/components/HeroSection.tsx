"use client";

import { useState, useRef, useEffect } from "react";
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();
  
  const [trails, setTrails] = useState<{ id: number, x: number, y: number, imgUrl: string, rotation: number }[]>([]);
  const lastPosition = useRef({ x: 0, y: 0 });
  const imageIndex = useRef(0);
  
  const images = [
    '/local_seller_1_1777011996907.png',
    '/local_seller_2_1777012015295.png',
    '/local_seller_3_1777012036738.png',
    '/local_seller_4_1777012053679.png',
    '/local_seller_5_1777012075631.png',
    '/local_seller_6_1777012095776.png'
  ];

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const distance = Math.hypot(clientX - lastPosition.current.x, clientY - lastPosition.current.y);

    if (distance > 120) {
      const id = Date.now() + Math.random();
      const imgUrl = images[imageIndex.current % images.length];
      const rotation = (Math.random() - 0.5) * 20; // random rotation between -10 and 10 degrees
      
      imageIndex.current++;
      lastPosition.current = { x: clientX, y: clientY };

      setTrails((prev) => [...prev, { id, x: clientX, y: clientY, imgUrl, rotation }]);

      setTimeout(() => {
        setTrails((prev) => prev.filter(t => t.id !== id));
      }, 1200);
    }
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative w-full pt-40 pb-24 px-4 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]"
    >
      <style>{`
        @keyframes pop-fade {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5) rotate(var(--rot)); }
          15% { opacity: 1; transform: translate(-50%, -50%) scale(1.05) rotate(var(--rot)); box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
          30% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(var(--rot)); }
          80% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(var(--rot)); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8) rotate(var(--rot)); }
        }
        .trail-anim {
          animation: pop-fade 1.2s forwards cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>

      {/* Cursor Trails */}
      {trails.map((trail) => (
        <img
          key={trail.id}
          src={trail.imgUrl}
          className="fixed w-32 h-44 md:w-40 md:h-56 object-cover rounded-xl shadow-xl pointer-events-none z-0 trail-anim"
          style={{
            left: trail.x,
            top: trail.y,
            '--rot': `${trail.rotation}deg`,
          } as React.CSSProperties}
          alt="Local Seller"
        />
      ))}

      <div className="absolute inset-0 z-0 pointer-events-none bg-glow-radial opacity-60" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 pointer-events-none">
        
        <div 
          onMouseMove={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E6D5C3] bg-white/50 backdrop-blur-sm text-[#8C6B4A] text-sm font-semibold tracking-wide uppercase pointer-events-auto"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C08C5D] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C08C5D]"></span>
          </span>
          {t.hero.tagline}
        </div>

        <h1 
          onMouseMove={(e) => e.stopPropagation()}
          className="font-playfair text-5xl md:text-7xl lg:text-8xl font-medium text-[#1A1A1A] tracking-tight leading-[1.1] pointer-events-auto mix-blend-multiply"
        >
          {t.hero.headline}
        </h1>

        <p 
          onMouseMove={(e) => e.stopPropagation()}
          className="text-gray-500 text-xl md:text-2xl max-w-2xl font-light leading-relaxed pointer-events-auto"
        >
          {t.hero.subheadline}
        </p>

        <div 
          onMouseMove={(e) => e.stopPropagation()}
          className="pt-8 flex flex-col sm:flex-row gap-4 items-center justify-center pointer-events-auto"
        >
          <Link 
            href="/login"
            className="px-8 py-4 rounded-full bg-[#C08C5D] hover:bg-[#A67345] transition-all transform hover:scale-[1.02] text-white text-lg font-semibold shadow-[0_8px_30px_rgba(192,140,93,0.3)]"
          >
            {t.hero.cta}
          </Link>
        </div>

        <p 
          onMouseMove={(e) => e.stopPropagation()}
          className="text-sm text-gray-400 mt-6 flex items-center gap-2 pointer-events-auto"
        >
          <svg className="w-4 h-4 text-[#C08C5D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {t.hero.guarantee}
        </p>

      </div>
    </section>
  );
}
