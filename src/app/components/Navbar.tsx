"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="w-full fixed top-6 left-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="w-full max-w-6xl bg-white/95 backdrop-blur-md rounded-full flex items-center justify-between px-4 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#F2EAE1] pointer-events-auto">
        
        {/* Logo */}
        <Link href="/" className="flex items-center pl-2">
          <Image 
            src="/Logo.png" 
            alt="Lokl Logo" 
            width={120} 
            height={32} 
            className="h-7 w-auto object-contain"
            priority
          />
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">{t.nav.features}</Link>
          <Link href="#how-it-works" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">{t.nav.howItWorks}</Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="text-xs font-bold text-gray-400 hover:text-black transition-colors px-2 py-1 uppercase tracking-widest border border-transparent hover:border-gray-200 rounded"
          >
            {language === 'en' ? 'HI' : 'EN'}
          </button>
          
          <Link 
            href="/login"
            className="px-5 py-2 rounded-full bg-[#C08C5D] hover:bg-[#A67345] transition-colors text-white text-sm font-semibold shadow-sm whitespace-nowrap"
          >
            {t.nav.getStarted}
          </Link>
        </div>
        
      </nav>
    </div>
  );
}
