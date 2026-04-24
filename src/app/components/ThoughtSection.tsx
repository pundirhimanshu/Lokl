"use client";

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function ThoughtSection() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full py-32 px-4 overflow-hidden bg-[#FCFAF8]">
      {/* Soft Glow Background, identical to the hero */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-glow-radial opacity-70" />
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-medium text-[#1A1A1A] tracking-tight mb-2">
          {t.thought.headline}
        </h2>
        <p className="font-playfair text-4xl md:text-5xl lg:text-6xl font-medium italic text-gold-gradient tracking-tight">
          {t.thought.subheadline}
        </p>
        
        <Link 
          href="/login"
          className="mt-12 px-8 py-4 rounded-full bg-[#C08C5D] hover:bg-[#A67345] transition-all transform hover:scale-[1.02] text-white text-base font-semibold shadow-[0_8px_30px_rgba(192,140,93,0.3)]"
        >
          {t.thought.cta}
        </Link>
      </div>
    </section>
  );
}
