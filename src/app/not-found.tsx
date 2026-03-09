'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';

const messages = [
  { emoji: '🏗️', title: 'אנחנו בונים את הדוח הזה...', subtitle: 'עוד מעט מוכן, סבלנות!' },
  { emoji: '🍕', title: 'הדוח עדיין באפייה...', subtitle: 'ניחוח הנתונים כבר מגיע' },
  { emoji: '⛏️', title: 'כורים נתונים עמוקים...', subtitle: 'הזהב הסטטיסטי כמעט בידינו' },
  { emoji: '🧪', title: 'הדוח במעבדה...', subtitle: 'המדענים שלנו עובדים על זה' },
  { emoji: '🚀', title: 'הדוח בדרך לחלל...', subtitle: 'צפו לנחיתה בקרוב' },
  { emoji: '🎨', title: 'מציירים גרפים יפים...', subtitle: 'אמנות לוקחת זמן' },
  { emoji: '🧁', title: 'הדוח עדיין בתנור...', subtitle: 'הציפוי של הנתונים כמעט מוכן' },
  { emoji: '🎸', title: 'הדוח עושה צ׳ק סאונד...', subtitle: 'ההופעה תתחיל בקרוב' },
  { emoji: '🏋️', title: 'הדוח באימון...', subtitle: 'עוד כמה סטים ומסיים' },
  { emoji: '🧶', title: 'סורגים את הדוח בעבודת יד...', subtitle: 'כל שורה בנתונים נעשית באהבה' },
  { emoji: '🔮', title: 'מנבאים את העתיד...', subtitle: 'כדור הבדולח עדיין מתחמם' },
  { emoji: '🐝', title: 'הנתונים עסוקים כמו דבורים...', subtitle: 'הדבש הסטטיסטי בדרך' },
];

export default function NotFound() {
  const [msg, setMsg] = useState(messages[0]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMsg(messages[Math.floor(Math.random() * messages.length)]);
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div className="flex-1 min-h-screen">
      <Header title={<>COMMUNi <span className="text-blue-600">Dashboard</span></>} />
      <div className="flex flex-col items-center justify-center py-24 px-4">
        <div className="text-6xl sm:text-7xl animate-bounce mb-6">
          {msg.emoji}
        </div>
        <div
          className="flex flex-col items-center gap-2 transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
          }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center">
            {msg.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 text-center">
            {msg.subtitle}
          </p>
          <p className="mt-4 text-xs text-gray-400 dark:text-gray-600 animate-pulse">
            🔄 חזרו אלינו בקרוב...
          </p>
        </div>
      </div>
    </div>
  );
}
