
import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { CourseContent } from './components/CourseContent';
import { ViralGenerator } from './components/ViralGenerator';
import { Pricing } from './components/Pricing';
import { CourseSystem } from './components/CourseSystem';
import { ApplePayButton } from './components/ApplePayButton';
import { 
  MessageCircle, Instagram, Youtube, Phone, User, Lock, X, 
  CheckCircle2, Menu, ShieldCheck, Mail, User as UserIcon, 
  Phone as PhoneIcon, CreditCard, Key, Loader2, Check, ShoppingBag
} from 'lucide-react';
import { AppView, Student } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'info' | 'payment' | 'processing' | 'success'>('info');
  const [adminPass, setAdminPass] = useState('');
  const [isPurchased, setIsPurchased] = useState(() => localStorage.getItem('is_purchased') === 'true');
  const [checkoutData, setCheckoutData] = useState({ name: '', email: '', phone: '' });
  const [showLiveToast, setShowLiveToast] = useState(false);
  const [lastBuyer, setLastBuyer] = useState({ name: 'מיכאל', city: 'תל אביב' });

  // Social Proof Logic
  useEffect(() => {
    const names = ['עומר', 'נועה', 'איתי', 'מאיה', 'גיא', 'שירה', 'יונתן', 'רוני'];
    const cities = ['תל אביב', 'ראשון לציון', 'ירושלים', 'חיפה', 'נתניה', 'באר שבע', 'חולון'];
    
    const interval = setInterval(() => {
      setLastBuyer({
        name: names[Math.floor(Math.random() * names.length)],
        city: cities[Math.floor(Math.random() * cities.length)]
      });
      setShowLiveToast(true);
      setTimeout(() => setShowLiveToast(false), 5000);
    }, 25000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (view !== 'landing') window.scrollTo(0, 0);
  }, [view]);

  const handleStudentAreaClick = () => {
    if (isPurchased) {
      setView('platform');
    } else {
      alert('אופס! נראה שעדיין לא רכשת את הקורס. בוא נבחר מסלול!');
      const pricingSection = document.getElementById('pricing');
      pricingSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const validateInfo = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (checkoutData.name.length < 2) return alert('נא להזין שם מלא תקין');
    if (!emailRegex.test(checkoutData.email)) return alert('נא להזין כתובת אימייל תקינה');
    setCheckoutStep('payment');
  };

  const processPayment = async (method: 'card' | 'apple') => {
    setCheckoutStep('processing');
    await new Promise(resolve => setTimeout(resolve, 2500));

    const existingStudents = JSON.parse(localStorage.getItem('viral_academy_students') || '[]');
    const newStudent: Student = {
      id: Date.now().toString(),
      name: checkoutData.name,
      email: checkoutData.email,
      phone: checkoutData.phone,
      joinDate: new Date().toLocaleDateString('he-IL'),
      progress: 0,
      status: 'active'
    };
    
    localStorage.setItem('viral_academy_students', JSON.stringify([...existingStudents, newStudent]));
    localStorage.setItem('is_purchased', 'true');
    setIsPurchased(true);
    setCheckoutStep('success');
    
    setTimeout(() => {
      setShowCheckout(false);
      setView('platform');
      setCheckoutStep('info');
    }, 3000);
  };

  const handleApplePay = async () => {
    if (window.PaymentRequest) {
      const methodData = [{
        supportedMethods: 'https://apple.com/apple-pay',
        data: {
          version: 3,
          merchantIdentifier: 'merchant.com.viralacademy',
          merchantCapabilities: ['supports3DS'],
          supportedNetworks: ['amex', 'discover', 'masterCard', 'visa'],
          countryCode: 'IL',
        },
      }];
      const details = {
        total: { label: 'Viral Academy VIP', amount: { currency: 'ILS', value: '297.00' } },
      };
      
      try {
        const request = new PaymentRequest(methodData, details);
        const response = await request.show();
        await response.complete('success');
        processPayment('apple');
      } catch (e) {
        processPayment('apple');
      }
    } else {
      processPayment('apple');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === '1234') setView('admin');
    else alert('קוד מנהל שגוי');
  };

  if (view === 'admin-login') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 w-full max-sm text-center">
          <div className="w-16 h-16 bg-pink-600/20 text-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6"><Key size={32} /></div>
          <h2 className="text-2xl font-bold mb-2">כניסת מנהל</h2>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input type="password" placeholder="קוד גישה" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-center text-xl tracking-[1em] focus:ring-2 focus:ring-pink-500 outline-none" />
            <button type="submit" className="w-full bg-pink-600 py-3 rounded-xl font-bold">כניסה</button>
            <button type="button" onClick={() => setView('landing')} className="w-full text-slate-500 text-sm">חזרה לאתר</button>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'platform') return <CourseSystem mode="platform" onBack={() => setView('landing')} />;
  if (view === 'admin') return <CourseSystem mode="admin" onBack={() => setView('landing')} />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-pink-500 selection:text-white relative">
      {/* Social Proof Toast */}
      <div className={`fixed bottom-8 right-8 z-[200] transition-all duration-500 transform ${showLiveToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <div className="bg-white text-slate-900 p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-100 min-w-[280px]">
          <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white shrink-0"><ShoppingBag size={20} /></div>
          <div>
            <div className="text-sm font-bold">{lastBuyer.name} מ{lastBuyer.city}</div>
            <div className="text-[10px] text-slate-500 font-medium">הצטרף/ה הרגע לאקדמיה הוויראלית 🚀</div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-900 w-full max-w-lg rounded-[3rem] border border-slate-800 p-8 md:p-12 relative shadow-2xl overflow-hidden">
            {checkoutStep !== 'processing' && checkoutStep !== 'success' && (
              <button onClick={() => setShowCheckout(false)} className="absolute top-8 left-8 text-slate-500 hover:text-white transition-colors"><X size={28} /></button>
            )}

            {checkoutStep === 'info' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4">
                <div className="text-center">
                  <h2 className="text-3xl font-black mb-2 italic">כמעט שם! 🚀</h2>
                  <p className="text-slate-400">הכנס פרטים כדי לקבל גישה מיידית</p>
                </div>
                <div className="space-y-4">
                  <div className="relative"><UserIcon size={18} className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-500" /><input value={checkoutData.name} onChange={e => setCheckoutData({...checkoutData, name: e.target.value})} type="text" placeholder="שם מלא" className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-12 py-4 text-white focus:ring-2 focus:ring-pink-500 outline-none" /></div>
                  <div className="relative"><Mail size={18} className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-500" /><input value={checkoutData.email} onChange={e => setCheckoutData({...checkoutData, email: e.target.value})} type="email" placeholder="אימייל לקבלת הקורס" className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-12 py-4 text-white focus:ring-2 focus:ring-pink-500 outline-none" /></div>
                  <div className="relative"><PhoneIcon size={18} className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-500" /><input value={checkoutData.phone} onChange={e => setCheckoutData({...checkoutData, phone: e.target.value})} type="tel" placeholder="טלפון" className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-12 py-4 text-white focus:ring-2 focus:ring-pink-500 outline-none" /></div>
                </div>
                <button onClick={validateInfo} className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-lg transition-all active:scale-95">המשך לתשלום</button>
              </div>
            )}

            {checkoutStep === 'payment' && (
              <div className="space-y-8 animate-in slide-in-from-right-4">
                <div className="text-center">
                  <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">סיכום הזמנה: ₪297</h2>
                  <p className="text-slate-500 text-sm">התשלום מאובטח ומוצפן</p>
                </div>
                <div className="space-y-4">
                  <ApplePayButton onClick={handleApplePay} />
                  <div className="flex items-center gap-4 py-2"><div className="h-px bg-slate-800 flex-1"></div><span className="text-xs text-slate-500 uppercase font-bold">או כרטיס אשראי</span><div className="h-px bg-slate-800 flex-1"></div></div>
                  <button onClick={() => processPayment('card')} className="w-full bg-slate-800 hover:bg-slate-700 h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all">
                    <CreditCard size={20} /> שלם באשראי
                  </button>
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><ShieldCheck size={14} /> SSL Secure</span>
                  <span className="flex items-center gap-1"><CheckCircle2 size={14} /> גישה לכל החיים</span>
                </div>
              </div>
            )}

            {checkoutStep === 'processing' && (
              <div className="py-20 flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in">
                <div className="relative">
                  <Loader2 size={64} className="text-pink-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldCheck size={24} className="text-pink-500/50" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">מעבד תשלום...</h3>
                  <p className="text-slate-400">אנא אל תסגור את הדף</p>
                </div>
              </div>
            )}

            {checkoutStep === 'success' && (
              <div className="py-20 flex flex-col items-center justify-center space-y-6 text-center animate-in zoom-in-95">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 animate-bounce">
                  <Check size={40} className="text-white" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-3xl font-black mb-2 text-white">הרכישה הושלמה!</h3>
                  <p className="text-slate-400">ברוך הבא לנבחרת הוויראלית, {checkoutData.name}</p>
                </div>
                <div className="text-xs text-slate-500">מעביר אותך לקורס בעוד רגע...</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Landing Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="text-2xl font-black tracking-tighter flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-10 h-10 bg-gradient-to-tr from-pink-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-600/20"><span className="text-white text-xl italic font-serif">V</span></div>
            VIRAL<span className="text-pink-500">ACADEMY</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#course" className="text-slate-400 hover:text-white transition-colors">מה נלמד?</a>
            <button onClick={handleStudentAreaClick} className="text-pink-500 hover:text-pink-400 font-bold flex items-center gap-2 px-4 py-2 border border-pink-500/20 rounded-xl bg-pink-500/5 transition-all"><User size={18} />אזור תלמידים</button>
            <button onClick={() => setShowCheckout(true)} className="bg-pink-600 hover:bg-pink-500 px-6 py-2 rounded-xl font-bold transition-all">הרשמה עכשיו</button>
          </div>
        </div>
      </nav>

      <main>
        <Hero onCtaClick={() => setShowCheckout(true)} />
        <CourseContent />
        <ViralGenerator />
        <Pricing onPlanSelect={() => setShowCheckout(true)} />
        <section className="py-12 flex justify-center opacity-20 hover:opacity-100 transition-opacity"><button onClick={() => setView('admin-login')} className="flex items-center gap-2 text-slate-500 text-sm hover:text-pink-400"><Lock size={12} /> ניהול קורס (Admin)</button></section>
      </main>

      <footer className="py-12 bg-slate-950 border-t border-slate-900 text-center"><div className="container mx-auto px-4"><div className="text-xl font-black mb-4">VIRAL<span className="text-pink-500">ACADEMY</span></div><div className="text-slate-500 text-sm">© 2026 כל הזכויות שמורות - יחד נהפוך אותך למותג.</div></div></footer>
    </div>
  );
};

export default App;
