
import React, { useState } from 'react';
import { Sparkles, Loader2, Send, FileText, Image as ImageIcon, Copy } from 'lucide-react';
import { generateViralHooks, generateFullScript, generateThumbnailIdea } from '../services/geminiService';
import { AIData, ScriptData } from '../types';

export const ViralGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [thumbLoading, setThumbLoading] = useState(false);
  const [result, setResult] = useState<AIData | null>(null);
  const [script, setScript] = useState<ScriptData | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setScript(null);
    setThumbnailUrl(null);
    try {
      const data = await generateViralHooks(topic);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert('משהו השתבש ביצירת ההוקים, נסה שוב מאוחר יותר.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetScript = async (hook: string) => {
    setScriptLoading(true);
    try {
      const data = await generateFullScript(hook, topic);
      setScript(data);
    } catch (error) {
      alert('שגיאה ביצירת התסריט');
    } finally {
      setScriptLoading(false);
    }
  };

  const handleGetThumbnail = async () => {
    setThumbLoading(true);
    try {
      const url = await generateThumbnailIdea(topic);
      setThumbnailUrl(url);
    } catch (error) {
      alert('שגיאה ביצירת התמונה');
    } finally {
      setThumbLoading(false);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-[40px] p-8 md:p-12 shadow-2xl relative">
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <Sparkles size={120} className="text-white" />
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-5xl font-black mb-4">ארגז הכלים של AI</h2>
              <p className="text-purple-200">מנוע הוויראליות המבוסס Gemini שיעזור לכם לבנות סרטונים מאפס בשניות.</p>
            </div>

            <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4 mb-10">
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="על מה הסרטון הבא שלך? (למשל: סקירת אייפון 15, טיפ לעריכה...)"
                className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button 
                disabled={loading}
                className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-pink-100 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                {loading ? 'מנתח...' : 'צור אסטרטגיה'}
              </button>
            </form>

            {result && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {result.hooks.map((h, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all flex flex-col">
                      <div className="text-pink-400 font-bold mb-2">הוק #{i + 1}</div>
                      <div className="font-bold text-xl mb-4 italic">"{h.hook}"</div>
                      <p className="text-sm text-purple-200/70 mb-6 flex-1">{h.explanation}</p>
                      <button 
                        onClick={() => handleGetScript(h.hook)}
                        className="flex items-center justify-center gap-2 w-full py-2 bg-pink-600/20 text-pink-400 rounded-xl hover:bg-pink-600 hover:text-white transition-all text-sm font-bold"
                      >
                        {scriptLoading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                        צור תסריט להוק הזה
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Script Results */}
                  {script && (
                    <div className="bg-glass p-8 rounded-[32px] border-pink-500/30 border animate-in slide-in-from-right duration-500">
                      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <FileText className="text-pink-500" />
                        התסריט הוויראלי שלך
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <span className="text-xs font-bold text-pink-500 uppercase tracking-widest">פתיחה (0-3 שניות)</span>
                          <p className="bg-white/5 p-4 rounded-xl mt-2 border border-white/5">{script.opening}</p>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-pink-500 uppercase tracking-widest">גוף הסרטון</span>
                          <p className="bg-white/5 p-4 rounded-xl mt-2 border border-white/5">{script.body}</p>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-pink-500 uppercase tracking-widest">קריאה לפעולה</span>
                          <p className="bg-white/5 p-4 rounded-xl mt-2 border border-white/5 font-bold">{script.cta}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Thumbnail Assistant */}
                  <div className="bg-glass p-8 rounded-[32px] border-indigo-500/30 border">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <ImageIcon className="text-indigo-400" />
                      עוזר תמונות ממוזערות
                    </h3>
                    {thumbnailUrl ? (
                      <div className="space-y-4">
                        <img src={thumbnailUrl} className="w-full rounded-2xl shadow-2xl border border-white/10" alt="Generated Thumbnail Idea" />
                        <button 
                          onClick={() => setThumbnailUrl(null)}
                          className="w-full py-3 bg-slate-800 rounded-xl font-bold text-sm hover:bg-slate-700 transition-colors"
                        >
                          צור רעיון חדש
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-10 space-y-6">
                        <p className="text-slate-400">ה-AI שלנו ייצר עבורכם רקע מקצועי לתמונה הממוזערת של הסרטון בהתבסס על הנושא שלכם.</p>
                        <button 
                          onClick={handleGetThumbnail}
                          disabled={thumbLoading}
                          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold flex items-center gap-2 mx-auto transition-all disabled:opacity-50"
                        >
                          {thumbLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                          ייצר רקע לתמונה
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
