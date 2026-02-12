
import React, { useState, useEffect } from 'react';
import { PlanetData } from './types';
import { PLANETS, SUN } from './constants';
import SolarSystemView from './SolarSystemView';
import PlanetDetails from './PlanetDetails';

const App: React.FC = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [hoveredPlanetId, setHoveredPlanetId] = useState<string | null>(null);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [scaleMode, setScaleMode] = useState(false);
  const [fullView, setFullView] = useState(false);

  const navigationItems = [SUN, ...PLANETS];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showWelcome) return;
      const currentIndex = selectedPlanet 
        ? navigationItems.findIndex(p => p.id === selectedPlanet.id) 
        : -1;

      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        const nextIndex = (currentIndex + 1) % navigationItems.length;
        setSelectedPlanet(navigationItems[nextIndex]);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        const prevIndex = currentIndex <= 0 ? navigationItems.length - 1 : currentIndex - 1;
        setSelectedPlanet(navigationItems[prevIndex]);
      } else if (e.key === 'Escape') {
        setSelectedPlanet(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPlanet, showWelcome]);

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-right" dir="rtl">
        <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(30,58,138,0.4)] text-center animate-in fade-in zoom-in duration-500">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 to-orange-600 rounded-full shadow-[0_0_40px_rgba(234,179,8,0.5)] animate-pulse"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            מסע במערכת השמש
          </h1>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            גלו את היקום האינטראקטיבית שלנו.
            עברו בין כוכבי הלכת, השוו גדלים וגלו סודות על השכנים שלנו בחלל.
          </p>
          <div className="flex justify-center">
            <button 
              onClick={() => setShowWelcome(false)}
              className="group relative inline-flex items-center justify-center px-12 py-4 font-bold text-white transition-all duration-300 bg-blue-600 rounded-2xl hover:bg-blue-500 text-2xl shadow-xl hover:scale-105 active:scale-95"
            >
              שיגור! 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-slate-950 text-slate-100 overflow-hidden select-none">
      <header className="absolute top-0 left-0 right-0 z-40 p-4 md:p-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-start">
          <div className="pointer-events-auto bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl">
            <h1 className="text-xl md:text-2xl font-black text-white">סימולטור מערכת השמש</h1>
            <p className="text-slate-400 text-[10px] md:text-xs mt-1">חיצים במקלדת למעבר בין פלנטות</p>
          </div>
          
          <div className="flex flex-col gap-2 pointer-events-auto items-end">
            <div className="flex gap-2">
              <button 
                onClick={() => setFullView(!fullView)}
                className={`px-4 py-2 backdrop-blur-md border rounded-xl text-[10px] md:text-xs font-bold transition-all flex items-center gap-2 shadow-lg ${fullView ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-900/80 border-slate-700 text-slate-300'}`}
              >
                <span>{fullView ? '🔍 מבט: מערכת מלאה' : '🔍 מבט: פנימית'}</span>
              </button>
              <button 
                onClick={() => setScaleMode(!scaleMode)}
                className={`px-4 py-2 backdrop-blur-md border rounded-xl text-[10px] md:text-xs font-bold transition-all flex items-center gap-2 shadow-lg ${scaleMode ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-900/80 border-slate-700 text-slate-300'}`}
              >
                <span>{scaleMode ? '📏 קנה מידה: מציאותי' : '📐 קנה מידה: תצוגה'}</span>
              </button>
            </div>
            <button 
              onClick={() => setAnimationEnabled(!animationEnabled)}
              className="px-4 py-2 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl text-[10px] md:text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg"
            >
              <div className={`w-2 h-2 rounded-full ${animationEnabled ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
              {animationEnabled ? 'תנועה פעילה' : 'תנועה מושהית'}
            </button>
          </div>
        </div>
      </header>

      <main className="w-full h-screen">
        <SolarSystemView 
          selectedPlanetId={selectedPlanet?.id || null} 
          hoveredPlanetId={hoveredPlanetId}
          onPlanetSelect={(p: PlanetData) => setSelectedPlanet(p)}
          animationEnabled={animationEnabled}
          scaleMode={scaleMode}
          fullView={fullView}
        />
      </main>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-5xl px-4 pointer-events-none">
        <div className="flex justify-start md:justify-center gap-3 overflow-x-auto py-3 px-6 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 pointer-events-auto scrollbar-hide shadow-2xl">
          {navigationItems.map((planet: PlanetData) => (
            <button
              key={planet.id}
              onClick={() => setSelectedPlanet(planet)}
              onMouseEnter={() => setHoveredPlanetId(planet.id)}
              onMouseLeave={() => setHoveredPlanetId(null)}
              className={`shrink-0 flex flex-col items-center transition-all duration-300 ${selectedPlanet?.id === planet.id || hoveredPlanetId === planet.id ? 'scale-110 opacity-100' : 'opacity-50 hover:opacity-100'}`}
            >
              <div 
                className="w-8 h-8 md:w-10 md:h-10 rounded-full mb-1 border-2 transition-all shadow-lg"
                style={{ 
                  backgroundColor: planet.color,
                  borderColor: selectedPlanet?.id === planet.id ? 'white' : 'transparent',
                  boxShadow: selectedPlanet?.id === planet.id || hoveredPlanetId === planet.id ? `0 0 10px ${planet.color}` : 'none'
                }}
              />
              <span className="text-[9px] md:text-[11px] font-bold text-white whitespace-nowrap">{planet.name}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedPlanet && (
        <PlanetDetails 
          planet={selectedPlanet} 
          onClose={() => setSelectedPlanet(null)} 
          onNavigate={(p: PlanetData) => setSelectedPlanet(p)}
        />
      )}
    </div>
  );
};

export default App;
