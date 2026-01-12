
import React from 'react';

interface HeroProps {
  onCtaClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  return (
    <section className="relative pt-32 pb-32 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-pink-500 uppercase bg-pink-500/10 rounded-full animate-pulse">
            הקורס המקיף ביותר בישראל 2026
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight">
            תהפכו את הסמארטפון שלכם ל<br />
            <span className="gradient-text">מכונת ויראליות וכסף</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
            תלמדו איך לערוך סרטונים שמושכים מיליוני צפיות, לבנות קהילה נאמנה ולייצר הכנסה חודשית קבועה מעריכה ומהתוכן שלכם.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onCtaClick}
              className="px-12 py-5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-purple-500/25 transition-all transform hover:scale-105 active:scale-95"
            >
              הצטרפו עכשיו לנבחרת
            </button>
            <a 
              href="#course" 
              className="px-12 py-5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold text-lg transition-all active:scale-95"
            >
              מה נלמד בקורס?
            </a>
          </div>
          
          <div className="mt-20 flex items-center justify-center gap-8 md:gap-16 text-slate-500 flex-wrap">
            <div className="flex flex-col items-center">
              <span className="text-white font-black text-3xl">5K+</span>
              <span className="text-sm">תלמידים</span>
            </div>
            <div className="w-px h-12 bg-slate-800 hidden md:block"></div>
            <div className="flex flex-col items-center">
              <span className="text-white font-black text-3xl">100M+</span>
              <span className="text-sm">צפיות מצטברות</span>
            </div>
            <div className="w-px h-12 bg-slate-800 hidden md:block"></div>
            <div className="flex flex-col items-center">
              <span className="text-white font-black text-3xl">24/7</span>
              <span className="text-sm">ליווי בקהילה</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-purple-600/20 blur-[150px] rounded-full -z-0 pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-pink-600/10 blur-[120px] rounded-full -z-0 pointer-events-none"></div>
    </section>
  );
};
