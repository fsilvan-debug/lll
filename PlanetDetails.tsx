import React, { useMemo } from 'react';
import { PlanetData } from './types';
import { PLANETS, SUN } from './constants';

interface PlanetDetailsProps {
  planet: PlanetData;
  onClose: () => void;
  onNavigate: (planet: PlanetData) => void;
}

const PlanetDetails: React.FC<PlanetDetailsProps> = ({ planet, onClose, onNavigate }) => {
  const allBodies = [SUN, ...PLANETS];
  const currentIndex = allBodies.findIndex(p => p.id === planet.id);
  const nextBody = allBodies[(currentIndex + 1) % allBodies.length];
  const prevBody = allBodies[(currentIndex - 1 + allBodies.length) % allBodies.length];

  // חישוב יחס גודל לכדור הארץ להמחשה ויזואלית
  const sizeComparison = useMemo(() => {
    if (planet.id === 'sun') return 'השמש גדולה פי 109 מכדור הארץ';
    const pSize = parseInt(planet.realSize.replace(/,/g, ''));
    const earthSize = 12742;
    const ratio = pSize / earthSize;
    return ratio > 1 
      ? `גדול פי ${ratio.toFixed(1)} מכדור הארץ` 
      : `קטן פי ${(1/ratio).toFixed(1)} מכדור הארץ`;
  }, [planet]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 pointer-events-none overflow-y-auto">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md pointer-events-auto" onClick={onClose}></div>
      
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-700/50 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row pointer-events-auto max-h-[95vh] my-auto">
        
        {/* כפתורי ניווט צדדיים (דסקטופ) */}
        <div className="hidden md:flex absolute inset-y-0 left-0 right-0 justify-between items-center px-4 pointer-events-none z-30">
          <button 
            onClick={() => onNavigate(prevBody)} 
            className="pointer-events-auto p-4 bg-white/5 hover:bg-blue-600 rounded-full text-white transition-all hover:-translate-x-2 border border-white/10 shadow-lg backdrop-blur-sm"
            title={`הקודם: ${prevBody.name}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button 
            onClick={() => onNavigate(nextBody)} 
            className="pointer-events-auto p-4 bg-white/5 hover:bg-blue-600 rounded-full text-white transition-all hover:translate-x-2 border border-white/10 shadow-lg backdrop-blur-sm"
            title={`הבא: ${nextBody.name}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* תוכן - צד ימין (טקסט) */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto order-2 md:order-1 scrollbar-hide text-right">
          <div className="flex justify-between items-start mb-6">
            <div className="animate-in slide-in-from-right duration-500">
              <h2 className="text-4xl md:text-6xl font-black text-white">{planet.name}</h2>
              <p className="text-blue-400 font-mono text-lg uppercase tracking-widest opacity-70">{planet.englishName}</p>
            </div>
            <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-red-500/20 rounded-2xl text-white transition-colors border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="bg-blue-500/5 p-6 rounded-3xl border border-blue-500/10 shadow-inner mb-8">
            <p className="text-white text-xl md:text-2xl leading-relaxed italic">"{planet.description}"</p>
          </div>

          {/* המחשת סדר גודל מהירה */}
          <div className="mb-8 p-5 bg-slate-800/40 rounded-2xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]">ארץ</div>
               <div className="text-slate-400 text-2xl">↔</div>
               <div className="w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xl" style={{ backgroundColor: planet.color }}>{planet.name}</div>
            </div>
            <div className="text-left">
              <p className="text-blue-300 font-bold text-lg">{sizeComparison}</p>
              <p className="text-slate-500 text-xs">קוטר: {planet.realSize}</p>
            </div>
          </div>

          {/* כרטיסי מידע מורחבים - כל המידע המדעי */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <InfoCard label="טמפרטורה" value={planet.temperature} icon="🌡️" color="text-orange-400" />
            <InfoCard label="מרחק מהשמש" value={planet.distanceFromSun} icon="☀️" color="text-yellow-400" />
            <InfoCard label="משך היממה" value={planet.dayLength} icon="⏰" color="text-emerald-400" />
            <InfoCard label="משך השנה" value={planet.yearLength} icon="📅" color="text-indigo-400" />
            <InfoCard label="מים / קרח" value={planet.water} icon="💧" color="text-blue-400" />
            <InfoCard label="ירחים" value={planet.moonsCount.toString()} subValue={planet.moonsDetails} icon="🌙" color="text-blue-300" />
            <InfoCard label="סוג עולם" value={planet.type} icon="🌑" color="text-purple-400" />
            <InfoCard label="חקרנו באמצעות" value={planet.explorationTools} icon="🛰️" color="text-cyan-400" span />
            <InfoCard label="אטמוספירה" value={planet.atmosphere} icon="🌬️" color="text-slate-300" span />
          </div>

          {/* ניווט מהיר לנייד */}
          <div className="md:hidden flex justify-between gap-3 mt-4">
             <button onClick={() => onNavigate(prevBody)} className="flex-1 bg-slate-800 py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 border border-white/5 shadow-lg active:scale-95 transition-transform">
               <span>←</span> {prevBody.name}
             </button>
             <button onClick={() => onNavigate(nextBody)} className="flex-1 bg-slate-800 py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 border border-white/5 shadow-lg active:scale-95 transition-transform">
               {nextBody.name} <span>→</span>
             </button>
          </div>
        </div>

        {/* ויזואליה - צד שמאל (תמונה) */}
        <div className="w-full md:w-[450px] h-[300px] md:h-auto shrink-0 bg-black relative order-1 md:order-2 overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
          <img 
            src={planet.imageUrl} 
            alt={planet.name} 
            key={planet.id} 
            className="w-full h-full object-cover opacity-90 transition-transform duration-[30s] hover:scale-125 animate-in fade-in zoom-in duration-1000" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-left opacity-50">
             <p className="text-[10px] text-white font-mono uppercase tracking-widest">Planetary Visualization System v2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value, subValue, icon, color, span }: { label: string, value: string, subValue?: string, icon: string, color: string, span?: boolean }) => (
  <div className={`bg-slate-800/40 p-5 rounded-2xl border border-white/5 hover:bg-slate-800 transition-all shadow-lg flex flex-col justify-center ${span ? 'col-span-2 lg:col-span-3' : ''}`}>
    <div className="flex items-center gap-3 mb-1">
      <span className="text-2xl">{icon}</span>
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</span>
    </div>
    <div className={`text-base md:text-lg font-black leading-tight ${color}`}>{value}</div>
    {subValue && <div className="text-[10px] text-slate-400 mt-1 italic">{subValue}</div>}
  </div>
);

export default PlanetDetails;