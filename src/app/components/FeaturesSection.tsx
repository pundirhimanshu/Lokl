"use client";

import { Banknote, Truck, HeartHandshake } from "lucide-react";
import { useLanguage } from '../context/LanguageContext';

export default function FeaturesSection() {
  const { t } = useLanguage();

  const icons = [
    <Banknote key="banknote" className="w-6 h-6 text-[#C08C5D]" />,
    <Truck key="truck" className="w-6 h-6 text-[#C08C5D]" />,
    <HeartHandshake key="heart" className="w-6 h-6 text-[#C08C5D]" />
  ];

  return (
    <section id="features" className="w-full py-24 px-4 bg-[#FCFAF8]">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Side: Text */}
        <div className="flex-1 text-center lg:text-left">
          <p className="text-sm font-bold tracking-widest uppercase text-[#8C6B4A] mb-4">{t.features.tagline}</p>
          <h2 className="font-playfair text-4xl md:text-5xl font-medium text-[#1A1A1A] mb-6 leading-tight">
            {t.features.headline} <span className="italic text-gold-gradient">{t.features.headlineHighlight}</span>
          </h2>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            Marketplaces are great, but they are built for them, not for you. Lokl is built specifically for neighborhood sellers who just want a simple, beautiful online presence without the headaches.
          </p>
        </div>

        {/* Right Side: Feature Cards */}
        <div className="flex-1 flex flex-col gap-4 w-full">
          {t.features.cards.map((feature, index) => (
            <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-[#F2EAE1] shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 rounded-xl bg-[#FCFAF8] border border-[#F2EAE1]">
                {icons[index]}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
