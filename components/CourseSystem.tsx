
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Plus, Trash2, Video, BookOpen, ChevronLeft, Save, ExternalLink, 
  Sparkles, Loader2, Bot, Wand2, Upload, Link as LinkIcon, X, FileVideo,
  CheckCircle, Circle, Layout, Users, MessageSquare, Trophy, ArrowRight,
  CreditCard, ShieldCheck, Mail, Phone, User as UserIcon, BarChart3, TrendingUp, DollarSign, Activity, Download, RefreshCw,
  Share2, Copy, Globe, QrCode, ShoppingBag
} from 'lucide-react';
import { Lesson, CourseModule, CommunityPost, Student } from '../types';
import { explainLessonConcepts, generateFullLessonContent } from '../services/geminiService';

const INITIAL_MODULES: CourseModule[] = [
  { id: 1, title: "מבוא ליצירת תוכן", description: "הבסיס לכל סרטון ויראלי", duration: "1.5 שעות", icon: "Play" },
  { id: 2, title: "עריכה מתקדמת ב-InShot", description: "כל הסודות של האפליקציה", duration: "3 שעות", icon: "Scissors" },
  { id: 3, title: "מוניטיזציה וכסף", description: "איך להרוויח מהצפיות", duration: "2 שעות", icon: "DollarSign" }
];

const SEED_LESSONS: Lesson[] = [
  { id: 'l1', moduleId: 1, title: 'ברוכים הבאים לאקדמיה', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'בשיעור הזה נלמד איך להוציא את המקסימום מהקורס ולבנות תוכנית עבודה לשנה הקרובה.', completed: true },
  { id: 'l2', moduleId: 1, title: 'מיינדסט של יוצר ויראלי', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'למה רוב האנשים נכשלים? ואיך אתם הולכים להצליח.', completed: false },
  { id: 'l3', moduleId: 2, title: 'עקרונות העריכה המהירה', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'איך לערוך סרטון שלם ב-10 דקות בלבד בלי להתפשר על איכות.', completed: false }
];

export const CourseSystem: React.FC<{ mode: 'admin' | 'platform', onBack: () => void }> = ({ mode, onBack }) => {
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem('viral_academy_lessons');
    if (saved && JSON.parse(saved).length > 0) return JSON.parse(saved);
    return SEED_LESSONS; 
  });
  
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('viral_academy_students');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('viral_community_posts');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', author: 'דניאל כהן', avatar: 'https://i.pravatar.cc/150?u=dan', content: 'חברים! הסרטון הראשון שלי עבר את ה-50K צפיות תוך יומיים בזכות ההוק שלמדנו בשיעור 2!', likes: 24, timestamp: 'לפני שעה', videoThumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bb91d13?auto=format&fit=crop&q=80&w=200' },
      { id: '2', author: 'מאיה לוי', avatar: 'https://i.pravatar.cc/150?u=maya', content: 'מישהו יכול לתת לי פידבק על הסקריפט שכתבתי לעסק שלי?', likes: 12, timestamp: 'לפני 3 שעות' },
    ];
  });

  const [activeTab, setActiveTab] = useState<'lessons' | 'dashboard' | 'community' | 'students' | 'analytics' | 'launch'>(
    mode === 'admin' ? 'analytics' : 'dashboard'
  );
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(lessons[0] || null);
  const [isAdding, setIsAdding] = useState(false);
  const [newLesson, setNewLesson] = useState({ title: '', videoUrl: '', description: '', moduleId: 1 });
  
  const [newPostContent, setNewPostContent] = useState('');
  const [aiChat, setAiChat] = useState<{role: 'bot' | 'user', text: string}[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('viral_academy_lessons', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem('viral_community_posts', JSON.stringify(communityPosts));
  }, [communityPosts]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = "Name,Email,Join Date,Progress\n";
      const rows = students.map(s => `${s.name},${s.email},${s.joinDate},${s.progress}%`).join("\n");
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'students_list.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsExporting(false);
    }, 1500);
  };

  const toggleLessonComplete = (lessonId: string) => {
    setLessons(prev => prev.map(l => l.id === lessonId ? {...l, completed: !l.completed} : l));
  };

  const deleteLesson = (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את השיעור?')) {
      setLessons(prev => prev.filter(l => l.id !== id));
      if (selectedLesson?.id === id) setSelectedLesson(null);
    }
  };

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    const lesson: Lesson = { ...newLesson, id: Date.now().toString(), completed: false };
    setLessons([...lessons, lesson]);
    setIsAdding(false);
    setNewLesson({ title: '', videoUrl: '', description: '', moduleId: 1 });
    setSelectedLesson(lesson);
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    const newPost: CommunityPost = { id: Date.now().toString(), author: 'אתה', avatar: 'https://i.pravatar.cc/150?u=me', content: newPostContent, likes: 0, timestamp: 'עכשיו' };
    setCommunityPosts([newPost, ...communityPosts]);
    setNewPostContent('');
  };

  const handleGenerateAnyLesson = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingLesson(true);
    try {
      const content = await generateFullLessonContent(aiPrompt);
      const lesson: Lesson = { id: Date.now().toString(), moduleId: 1, title: content.title, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: content.description, completed: false };
      setLessons(prev => [...prev, lesson]);
      setSelectedLesson(lesson);
      setAiPrompt('');
      setIsAdding(false);
    } catch (error) {
      alert('שגיאה ביצירת שיעור עם AI');
    } finally {
      setIsGeneratingLesson(false);
    }
  };

  const handleAskAI = async () => {
    if (!selectedLesson) return;
    setAiLoading(true);
    const userMsg = `סכם לי את השיעור "${selectedLesson.title}"`;
    setAiChat(prev => [...prev, {role: 'user', text: userMsg}]);
    try {
      const explanation = await explainLessonConcepts(selectedLesson.title, selectedLesson.description);
      setAiChat(prev => [...prev, {role: 'bot', text: explanation}]);
    } catch (error) { alert('שגיאה'); } finally { setAiLoading(false); }
  };

  const completedCount = lessons.filter(l => l.completed).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
  const totalRevenue = students.length * 297; // Updated price from 997 to 297

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-slate-900 border-l border-slate-800 flex flex-col max-h-screen overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm transition-colors hover:translate-x-1"><ChevronLeft size={16} /> חזרה</button>
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold italic gradient-text">Viral Learning</div>
            {mode === 'admin' && <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded text-[10px] font-bold">LIVE ADMIN</span>}
          </div>
        </div>

        <div className="flex border-b border-slate-800 bg-slate-900/50 overflow-x-auto no-scrollbar">
          {mode === 'platform' ? (
            <>
              <button onClick={() => { setActiveTab('dashboard'); setSelectedLesson(null); }} className={`flex-1 min-w-[80px] py-4 flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-pink-500 border-b-2 border-pink-500 bg-pink-500/5' : 'text-slate-500 hover:text-slate-300'}`}><Layout size={18} /><span className="text-[10px] font-bold">ראשי</span></button>
              <button onClick={() => setActiveTab('lessons')} className={`flex-1 min-w-[80px] py-4 flex flex-col items-center gap-1 transition-all ${activeTab === 'lessons' ? 'text-pink-500 border-b-2 border-pink-500 bg-pink-500/5' : 'text-slate-500 hover:text-slate-300'}`}><Play size={18} /><span className="text-[10px] font-bold">שיעורים</span></button>
              <button onClick={() => { setActiveTab('community'); setSelectedLesson(null); }} className={`flex-1 min-w-[80px] py-4 flex flex-col items-center gap-1 transition-all ${activeTab === 'community' ? 'text-pink-500 border-b-2 border-pink-500 bg-pink-500/5' : 'text-slate-500 hover:text-slate-300'}`}><Users size={18} /><span className="text-[10px] font-bold">קהילה</span></button>
            </>
          ) : (
            <>
              <button onClick={() => setActiveTab('analytics')} className={`flex-1 min-w-[70px] py-4 flex flex-col items-center gap-1 transition-all ${activeTab === 'analytics' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-400/5' : 'text-slate-500 hover:text-slate-300'}`}><BarChart3 size={18} /><span className="text-[10px] font-bold">נתונים</span></button>
              <button onClick={() => setActiveTab('lessons')} className={`flex-1 min-w-[70px] py-4 flex flex-col items-center gap-1 transition-all ${activeTab === 'lessons' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-400/5' : 'text-slate-500 hover:text-slate-300'}`}><Play size={18} /><span className="text-[10px] font-bold">תוכן</span></button>
              <button onClick={() => setActiveTab('students')} className={`flex-1 min-w-[70px] py-4 flex flex-col items-center gap-1 transition-all ${activeTab === 'students' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-400/5' : 'text-slate-500 hover:text-slate-300'}`}><Users size={18} /><span className="text-[10px] font-bold">תלמידים</span></button>
              <button onClick={() => setActiveTab('launch')} className={`flex-1 min-w-[70px] py-4 flex flex-col items-center gap-1 transition-all ${activeTab === 'launch' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-400/5' : 'text-slate-500 hover:text-slate-300'}`}><Share2 size={18} /><span className="text-[10px] font-bold">השקה</span></button>
            </>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {activeTab === 'lessons' ? (
            <div className="space-y-6">
              {INITIAL_MODULES.map(module => (
                <div key={module.id} className="space-y-2">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase px-2">{module.title}</h3>
                  <div className="space-y-1">
                    {lessons.filter(l => l.moduleId === module.id).map(lesson => (
                      <button key={lesson.id} onClick={() => { setSelectedLesson(lesson); setIsAdding(false); }} className={`w-full text-right p-3 rounded-xl transition-all flex items-center justify-between group ${selectedLesson?.id === lesson.id ? (mode === 'admin' ? 'bg-indigo-600 shadow-xl shadow-indigo-500/20' : 'bg-pink-600 shadow-xl shadow-pink-500/20') + ' text-white' : 'bg-slate-800/30 text-slate-400 hover:bg-slate-800/50'}`}>
                        <div className="flex items-center gap-2 truncate">{lesson.completed ? <CheckCircle size={16} className="text-green-400 shrink-0" /> : <Circle size={16} className="text-slate-600 shrink-0" />}<span className="truncate text-sm font-medium">{lesson.title}</span></div>
                        {mode === 'admin' && <Trash2 size={14} className="text-white/40 opacity-0 group-hover:opacity-100 hover:text-red-400" onClick={(e) => { e.stopPropagation(); deleteLesson(lesson.id); }} />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {mode === 'admin' && <button onClick={() => setIsAdding(true)} className="w-full p-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-600 hover:text-indigo-400 hover:border-indigo-400/50 transition-all flex items-center justify-center gap-2 font-bold"><Plus size={20} /> הוסף שיעור</button>}
            </div>
          ) : activeTab === 'analytics' && mode === 'admin' ? (
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3">סטטיסטיקה חיה</h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center"><span className="text-xs text-slate-400">תלמידים</span><span className="text-white font-bold">{students.length}</span></div>
                  <div className="flex justify-between items-center"><span className="text-xs text-slate-400">הכנסות</span><span className="text-green-400 font-bold">₪{totalRevenue.toLocaleString()}</span></div>
                </div>
              </div>
              <div className="p-4"><h6 className="text-[10px] font-bold text-slate-500 uppercase mb-2">פעילות אחרונה</h6><div className="space-y-2">{students.slice(0, 3).map(s => (<div key={s.id} className="text-[10px] text-slate-400 flex items-center gap-2"><Activity size={10} className="text-green-500" /> {s.name} רכש את הקורס</div>))}</div></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6 rounded-3xl text-white shadow-xl">
                <h4 className="font-bold mb-1 italic">Level Up! ⚡</h4>
                <p className="text-xs opacity-90">הדרך ל-1M צפיות מתחילה כאן.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto bg-slate-950 custom-scrollbar">
        {activeTab === 'analytics' && mode === 'admin' ? (
          <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div><h1 className="text-4xl font-black mb-2">Admin Dashboard 🎩</h1><p className="text-slate-400 font-medium">המערכת פועלת ומסנכרנת נתונים בזמן אמת.</p></div>
              <div className="flex items-center gap-4">
                 <button onClick={handleExportCSV} disabled={isExporting} className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all">
                   {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                   ייצוא תלמידים
                 </button>
                 <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 text-center min-w-[200px] shadow-2xl shadow-green-500/5"><div className="text-3xl font-black text-green-400">₪{totalRevenue.toLocaleString()}</div><div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Total Sales</div></div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
                <Users size={32} className="text-indigo-400 mb-4" />
                <div className="text-3xl font-black">{students.length}</div>
                <div className="text-sm text-slate-500 font-bold">Students Enrolled</div>
                <div className="absolute top-4 right-4 text-indigo-500/10"><Users size={64} /></div>
              </div>
              <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 relative overflow-hidden group hover:border-pink-500/30 transition-all">
                <Video size={32} className="text-pink-400 mb-4" />
                <div className="text-3xl font-black">{lessons.length}</div>
                <div className="text-sm text-slate-500 font-bold">Active Lessons</div>
              </div>
              <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp size={32} className="text-yellow-400" />
                  <span className="text-xs text-green-400 font-bold">+12% השבוע</span>
                </div>
                <div className="text-3xl font-black">84%</div>
                <div className="text-sm text-slate-500 font-bold">Completion Rate</div>
              </div>
              <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 relative overflow-hidden">
                <DollarSign size={32} className="text-green-400 mb-4" />
                <div className="text-3xl font-black">₪297</div>
                <div className="text-sm text-slate-500 font-bold">Price Point</div>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 overflow-hidden">
               <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-bold">רשימת נרשמים אחרונים</h3>
                 <button className="text-slate-500 hover:text-white transition-colors"><RefreshCw size={18} /></button>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-right">
                   <thead><tr className="text-slate-500 text-[10px] border-b border-slate-800 uppercase tracking-widest"><th className="pb-4 font-black">שם התלמיד</th><th className="pb-4 font-black">כתובת אימייל</th><th className="pb-4 font-black">תאריך הרשמה</th><th className="pb-4 font-black text-center">סטטוס תשלום</th></tr></thead>
                   <tbody className="divide-y divide-slate-800">
                     {students.length === 0 ? (
                       <tr><td colSpan={4} className="py-20 text-center text-slate-600 italic">המערכת ממתינה למכירה הראשונה... 🚀</td></tr>
                     ) : (
                       students.map(s => (
                         <tr key={s.id} className="text-sm text-slate-300 hover:bg-white/[0.02] transition-colors"><td className="py-5 font-bold flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">{s.name[0]}</div>{s.name}</td><td className="py-5 font-mono text-xs">{s.email}</td><td className="py-5 text-slate-500">{s.joinDate}</td><td className="py-5 text-center"><span className="px-4 py-1.5 bg-green-500/10 text-green-500 text-[10px] rounded-full font-black border border-green-500/20">PAID</span></td></tr>
                       ))
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        ) : activeTab === 'launch' && mode === 'admin' ? (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
             <header>
               <h1 className="text-4xl font-black mb-2">Launch & Share 🚀</h1>
               <p className="text-slate-400">כאן תמצא את הקישור שצריך להפיץ לעולם כדי להתחיל למכור.</p>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 space-y-6">
                 <div className="p-4 bg-indigo-500/10 rounded-2xl flex items-center gap-4 border border-indigo-500/20">
                   <Globe className="text-indigo-400" />
                   <div>
                     <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Public URL</div>
                     <div className="text-sm font-mono truncate">{window.location.origin}</div>
                   </div>
                 </div>
                 <div className="space-y-2">
                   <h3 className="font-bold">קישור דף הנחיתה</h3>
                   <p className="text-xs text-slate-500 italic">זה הקישור שאתה מעלה בביו של אינסטגרם / טיקטוק.</p>
                 </div>
                 <div className="flex gap-2">
                   <button onClick={handleCopyLink} className="flex-1 bg-white text-slate-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all">
                     {showCopySuccess ? <CheckCircle size={18} /> : <Copy size={18} />}
                     {showCopySuccess ? 'הועתק!' : 'העתק קישור'}
                   </button>
                   <button onClick={() => window.open(window.location.origin, '_blank')} className="px-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all"><ExternalLink size={18} /></button>
                 </div>
               </div>

               <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
                 <div className="w-32 h-32 bg-white p-2 rounded-2xl flex items-center justify-center">
                   <QrCode size={100} className="text-black" />
                 </div>
                 <div>
                   <h3 className="font-bold">QR Code להורדה</h3>
                   <p className="text-xs text-slate-500">לשימוש בסטורי או בהדפסות.</p>
                 </div>
                 <button className="text-indigo-400 text-xs font-bold underline">הורד תמונה (PNG)</button>
               </div>
             </div>

             <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 p-10 rounded-[3rem] border border-indigo-500/20">
               <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><ShoppingBag size={24} className="text-indigo-400" /> איך מתבצעת המכירה?</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="space-y-2">
                   <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                   <p className="text-sm font-bold">התלמיד נכנס לדף</p>
                   <p className="text-xs text-slate-500 leading-relaxed">הוא קורא על הקורס בדף הנחיתה המעוצב שבנינו.</p>
                 </div>
                 <div className="space-y-2">
                   <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                   <p className="text-sm font-bold">תשלום מאובטח</p>
                   <p className="text-xs text-slate-500 leading-relaxed">הוא לוחץ על Apple Pay או אשראי ומשלם ₪297.</p>
                 </div>
                 <div className="space-y-2">
                   <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                   <p className="text-sm font-bold">כניסה אוטומטית</p>
                   <p className="text-xs text-slate-500 leading-relaxed">הוא מקבל גישה מיידית לאזור התלמידים והקהילה.</p>
                 </div>
               </div>
             </div>
          </div>
        ) : activeTab === 'dashboard' ? (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div><h1 className="text-4xl font-black mb-2 italic">היי יוצר! 🎬</h1><p className="text-slate-400">הנה מה שחדש באקדמיה שלך היום.</p></div>
              <button onClick={() => setActiveTab('lessons')} className="bg-pink-600 hover:bg-pink-500 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-pink-600/20 transition-all hover:scale-105 active:scale-95">המשך למידה <ArrowRight size={20} /></button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 group cursor-pointer hover:border-pink-500/50 transition-all shadow-xl">
                <Wand2 size={32} className="text-pink-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-bold mb-2">מצא טרנדים חדשים</h4>
                <p className="text-slate-500 text-sm leading-relaxed">ה-AI שלנו סרק את טיקטוק ומצא 3 טרנדים שמתאימים לך בול השבוע. אל תפספס!</p>
              </div>
              <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 group cursor-pointer hover:border-indigo-500/50 transition-all shadow-xl">
                <MessageSquare size={32} className="text-indigo-400 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-bold mb-2">זום שבועי</h4>
                <p className="text-slate-500 text-sm leading-relaxed">המפגש הקרוב ביום שלישי ב-20:00. ננתח סרטונים שלכם בלייב ונבנה אסטרטגיה.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-tr from-pink-600/10 to-indigo-600/10 p-12 rounded-[3rem] border border-white/5 text-center">
              <Trophy size={48} className="text-yellow-500 mx-auto mb-6 animate-bounce" />
              <h3 className="text-2xl font-bold mb-4">האתגר השבועי: הוק ב-5 שניות</h3>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto italic">העלו סרטון קצר עם הוק חזק לקבוצת ה-VIP. המנצח יקבל שעת ייעוץ אישית בחינם!</p>
              <button onClick={() => setActiveTab('community')} className="bg-white/5 hover:bg-white/10 px-8 py-3 rounded-2xl text-sm font-bold transition-all border border-white/10">לקהילה</button>
            </div>
          </div>
        ) : isAdding && mode === 'admin' ? (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 p-10 rounded-[3rem] border border-indigo-500/20 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Sparkles className="text-indigo-400" /> יצירת שיעור מהיר עם AI</h2>
              <div className="flex gap-4">
                <input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="נושא לשיעור (למשל: עריכת סאונד בטיקטוק)..." className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                <button disabled={isGeneratingLesson || !aiPrompt.trim()} onClick={handleGenerateAnyLesson} className="bg-indigo-600 hover:bg-indigo-500 px-10 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all disabled:opacity-50">
                  {isGeneratingLesson ? <Loader2 size={20} className="animate-spin" /> : <Wand2 size={20} />} צור תוכן
                </button>
              </div>
            </div>
            <div className="bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">הוספת שיעור ידנית</h2>
              <form onSubmit={handleAddLesson} className="space-y-6">
                <input required type="text" value={newLesson.title} onChange={e => setNewLesson({...newLesson, title: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500" placeholder="כותרת השיעור" />
                <input required type="text" value={newLesson.videoUrl} onChange={e => setNewLesson({...newLesson, videoUrl: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500" placeholder="Embed URL (YouTube/Vimeo/Wistia)" />
                <textarea rows={4} value={newLesson.description} onChange={e => setNewLesson({...newLesson, description: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500" placeholder="תיאור השיעור, נקודות מרכזיות ושיעורי בית..." />
                <div className="flex gap-4 pt-4"><button type="submit" className="flex-1 bg-indigo-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-indigo-500"><Save size={20} /> שמור שיעור</button><button type="button" onClick={() => setIsAdding(false)} className="px-12 py-4 bg-slate-800 rounded-2xl font-bold hover:bg-slate-700">ביטול</button></div>
              </form>
            </div>
          </div>
        ) : selectedLesson ? (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in">
             <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl relative">
               <iframe src={selectedLesson.videoUrl} className="w-full h-full" frameBorder="0" allowFullScreen></iframe>
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
               <div className="lg:col-span-2 space-y-6">
                 <div className="flex items-center justify-between">
                   <h1 className="text-3xl font-black">{selectedLesson.title}</h1>
                   <button onClick={() => toggleLessonComplete(selectedLesson.id)} className={`px-8 py-3 rounded-2xl font-black transition-all ${selectedLesson.completed ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}>{selectedLesson.completed ? 'סיימתי את השיעור!' : 'סמן כבוצע'}</button>
                 </div>
                 <div className="bg-slate-900/50 p-10 rounded-[2.5rem] border border-slate-800 text-slate-300 leading-relaxed whitespace-pre-wrap text-lg">{selectedLesson.description}</div>
               </div>
               <div className="bg-slate-900 rounded-[2.5rem] border border-indigo-500/20 p-8 flex flex-col h-[600px] shadow-2xl">
                 <div className="flex items-center gap-3 mb-8"><div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl"><Bot size={24} /></div><div><span className="font-bold block text-white">AI Learning Coach</span><span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Online</span></div></div>
                 <div className="flex-1 overflow-y-auto space-y-4 mb-6 custom-scrollbar pr-2">
                   {aiChat.length === 0 && <div className="text-center py-10 text-slate-500 text-sm italic leading-loose">שאל אותי משהו על השיעור או בקש סיכום של הנקודות החשובות...</div>}
                   {aiChat.map((m, i) => (<div key={i} className={`p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'bot' ? 'bg-indigo-500/10 text-indigo-100 border border-indigo-500/10' : 'bg-slate-800 text-white self-end'}`}>{m.text}</div>))}
                   {aiLoading && <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold animate-pulse"><Loader2 size={12} className="animate-spin" /> העוזר מעבד את המידע...</div>}
                 </div>
                 <button onClick={handleAskAI} disabled={aiLoading} className="w-full bg-indigo-600 hover:bg-indigo-500 py-5 rounded-2xl font-black text-sm transition-all transform active:scale-95 disabled:opacity-50 shadow-lg shadow-indigo-600/20">סכם לי את השיעור</button>
               </div>
             </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in py-20">
            <div className="w-32 h-32 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 shadow-2xl relative">
               <Video size={56} className="text-slate-800" />
               <div className="absolute inset-0 bg-pink-500/5 blur-3xl rounded-full"></div>
            </div>
            <div className="max-w-md">
              <h2 className="text-3xl font-black mb-4">מוכנים לשיעור הבא? 🎬</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">בחרו שיעור מהתפריט בצד ימין כדי להתחיל ללמוד את הסודות של הסרטונים הוויראליים. כל שיעור מקרב אתכם למיליון הצפיות הראשון.</p>
              <button onClick={() => setActiveTab('lessons')} className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-2xl">לרשימת השיעורים המלאה</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
