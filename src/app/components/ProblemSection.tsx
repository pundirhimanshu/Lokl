"use client";

import { Globe, Users, Image as ImageIcon } from "lucide-react";
import { useLanguage } from '../context/LanguageContext';

export default function ProblemSection() {
  const { t } = useLanguage();

  const icons = [
    <Globe key="globe" className="w-6 h-6 text-[#C08C5D]" />,
    <Users key="users" className="w-6 h-6 text-[#C08C5D]" />,
    <ImageIcon key="image" className="w-6 h-6 text-[#C08C5D]" />
  ];

  return (
    <section id="problems" className="w-full py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        
        {/* Left Side: Headline */}
        <div className="flex-1 text-center lg:text-left">
          <p className="text-sm font-bold tracking-widest uppercase text-[#8C6B4A] mb-4">{t.problems.tagline}</p>
          <h2 className="font-playfair text-4xl md:text-5xl font-medium text-[#1A1A1A] mb-6 leading-tight">
            {t.problems.headline} <span className="italic text-gray-400">{t.problems.headlineHighlight}</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
            {t.problems.description}
          </p>
        </div>

        {/* Right Side: Problems List */}
        <div className="flex-1 flex flex-col gap-6 w-full">
          {t.problems.cards.map((problem, index) => (
            <div key={index} className="flex items-start gap-4 p-6 bg-[#FCFAF8] rounded-2xl border border-[#F2EAE1]">
              <div className="p-3 rounded-xl bg-white border border-[#F2EAE1] shadow-sm">
                {icons[index]}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{problem.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{problem.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
