"use client";

import { useLanguage } from '../context/LanguageContext';

export default function HowItWorksSection() {
  const { t } = useLanguage();

  return (
    <section id="how-it-works" className="w-full py-24 px-4 bg-white relative">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        
        <p className="text-sm font-bold tracking-widest uppercase text-[#8C6B4A] mb-4">{t.howItWorks.tagline}</p>
        <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-medium text-[#1A1A1A] mb-16 leading-tight max-w-3xl">
          {t.howItWorks.headline} <span className="italic text-gold-gradient">{t.howItWorks.headlineHighlight}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative w-full">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-[1px] bg-gradient-to-r from-transparent via-[#E6D5C3] to-transparent z-0" />

          {t.howItWorks.steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center p-6 bg-white rounded-3xl border border-[#F2EAE1] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-24 h-24 rounded-2xl bg-[#FCFAF8] border border-[#E6D5C3] flex items-center justify-center mb-6 text-2xl font-playfair font-bold text-[#8C6B4A]">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
