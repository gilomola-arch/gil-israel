
import React from 'react';
import { Play, Scissors, TrendingUp, DollarSign, Users, Award } from 'lucide-react';
import { CourseModule } from '../types';

const modules: CourseModule[] = [
  {
    id: 1,
    title: "יסודות הצילום והסטוריטלינג",
    description: "איך לתכנן סרטון שאי אפשר להפסיק לראות, זוויות צילום נכונות ותאורה ביתית מושלמת.",
    duration: "1.5 שעות",
    icon: "Play"
  },
  {
    id: 2,
    title: "עריכה מקצועית ב-InShot",
    description: "מעברים, כתוביות מעוצבות, אפקטים קוליים וצבעים שגורמים לסרטון להיראות קולנועי דרך האפליקציה המובילה.",
    duration: "3 שעות",
    icon: "Scissors"
  },
  {
    id: 3,
    title: "נוסחת הוויראליות",
    description: "איך לפצח את האלגוריתם של טיקטוק ואינסטגרם, מחקר טרנדים והוקים מנצחים.",
    duration: "2 שעות",
    icon: "TrendingUp"
  },
  {
    id: 4,
    title: "מוניטיזציה - לעשות כסף",
    description: "איך להשיג לקוחות ראשונים, כמה לגבות על עריכה ואיך לעבוד עם מותגים גדולים.",
    duration: "2.5 שעות",
    icon: "DollarSign"
  },
  {
    id: 5,
    title: "בניית מותג אישי",
    description: "איך להפוך לדמות מוכרת בנישה שלכם וליצור קהילה של עוקבים נאמנים.",
    duration: "1.5 שעות",
    icon: "Users"
  },
  {
    id: 6,
    title: "פרויקט הגמר וקבלת תעודה",
    description: "עריכת סרטון מושלם מאפס וקבלת משוב אישי מהצוות המקצועי שלנו.",
    duration: "בונוס",
    icon: "Award"
  }
];

const IconMap: Record<string, any> = {
  Play, Scissors, TrendingUp, DollarSign, Users, Award
};

export const CourseContent: React.FC = () => {
  return (
    <section id="course" className="py-24 bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">מה מחכה לכם בפנים?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">תכנית לימודים שלב אחר שלב, מהיסודות ועד לרמה של המקצוענים הכי גדולים בשוק.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => {
            const Icon = IconMap[m.icon];
            return (
              <div key={m.id} className="bg-glass p-8 rounded-3xl hover:border-pink-500/50 transition-all group">
                <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-6 text-pink-500 group-hover:scale-110 transition-transform">
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{m.title}</h3>
                <p className="text-slate-400 mb-6 line-clamp-2">{m.description}</p>
                <div className="text-sm font-medium text-slate-500">משך זמן: {m.duration}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
