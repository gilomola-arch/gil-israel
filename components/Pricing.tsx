
import React from 'react';
import { Check } from 'lucide-react';

interface PricingProps {
  onPlanSelect?: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ onPlanSelect }) => {
  return (
    <section id="pricing" className="py-24 bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">בחרו את המסלול שלכם</h2>
          <p className="text-slate-400 max-w-xl mx-auto">השקעה חד פעמית שתפתח לכם דלת לעולם של יצירה והכנסה. המחירים כוללים גישה לכל החיים.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto gap-8">
          {/* Starter Plan */}
          <div className="bg-glass p-10 rounded-[40px] border-slate-700 relative hover:border-slate-600 transition-all flex flex-col h-full">
            <div className="text-xl font-bold mb-2">מסלול לומד עצמאי</div>
            <div className="flex items-end gap-2 mb-8">
              <span className="text-5xl font-black">₪147</span>
              <span className="text-slate-400 mb-2">תשלום חד פעמי</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-3 text-slate-300">
                <div className="bg-green-500/10 text-green-500 rounded-full p-1"><Check size={16} /></div>
                גישה מלאה לכל השיעורים המוקלטים
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <div className="bg-green-500/10 text-green-500 rounded-full p-1"><Check size={16} /></div>
                עדכוני תוכן לכל החיים
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <div className="bg-green-500/10 text-green-500 rounded-full p-1"><Check size={16} /></div>
                קבצי עזר, פריסטים ומוזיקה
              </li>
              <li className="flex items-center gap-3 text-slate-500 line-through">
                <div className="bg-slate-700/50 text-slate-600 rounded-full p-1"><Check size={16} /></div>
                גישה לקהילת ה-VIP בווטסאפ
              </li>
            </ul>
            <button 
              onClick={onPlanSelect}
              className="w-full py-4 rounded-2xl border border-slate-700 font-bold hover:bg-slate-800 transition-all active:scale-95"
            >
              בחירה במסלול זה
            </button>
          </div>

          {/* VIP Plan */}
          <div className="bg-gradient-to-br from-pink-600/20 to-purple-600/20 p-10 rounded-[40px] border-2 border-pink-500 relative transform md:scale-105 shadow-2xl shadow-pink-500/10 flex flex-col h-full">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-6 py-1 rounded-full text-sm font-bold uppercase tracking-widest">
              הכי פופולרי
            </div>
            <div className="text-xl font-bold mb-2">מסלול VIP + קהילה</div>
            <div className="flex items-end gap-2 mb-8">
              <span className="text-5xl font-black">₪297</span>
              <span className="text-slate-400 mb-2">תשלום חד פעמי</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-3 text-slate-200">
                <div className="bg-pink-500 text-white rounded-full p-1"><Check size={16} /></div>
                כל מה שיש במסלול העצמאי
              </li>
              <li className="flex items-center gap-3 text-slate-200">
                <div className="bg-pink-500 text-white rounded-full p-1"><Check size={16} /></div>
                <strong>גישה לקהילת ה-VIP בווטסאפ</strong>
              </li>
              <li className="flex items-center gap-3 text-slate-200">
                <div className="bg-pink-500 text-white rounded-full p-1"><Check size={16} /></div>
                מפגשי זום שבועיים עם המרצים
              </li>
              <li className="flex items-center gap-3 text-slate-200">
                <div className="bg-pink-500 text-white rounded-full p-1"><Check size={16} /></div>
                ביקורת אישית על סרטונים שלכם
              </li>
              <li className="flex items-center gap-3 text-slate-200">
                <div className="bg-pink-500 text-white rounded-full p-1"><Check size={16} /></div>
                עזרה במציאת לקוחות ראשונים
              </li>
            </ul>
            <button 
              onClick={onPlanSelect}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 font-bold text-lg hover:shadow-xl hover:shadow-pink-500/30 transition-all transform hover:scale-[1.02] active:scale-95"
            >
              אני רוצה להיות VIP
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
