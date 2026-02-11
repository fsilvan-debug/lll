
import React from 'react';
import { PLANETS, SUN } from './constants';
import { PlanetData } from './types';

interface SolarSystemViewProps {
  selectedPlanetId: string | null;
  onPlanetSelect: (planet: PlanetData) => void;
  animationEnabled: boolean;
  scaleMode?: boolean;
}

const SolarSystemView: React.FC<SolarSystemViewProps> = ({ 
  selectedPlanetId, 
  onPlanetSelect, 
  animationEnabled,
  scaleMode = false
}) => {
  const isMobile = window.innerWidth < 768;
  
  const getScaleSize = (realSizeStr: string) => {
    const diameter = parseInt(realSizeStr.replace(/,/g, ''));
    const earthDiameter = 12742;
    const ratio = diameter / earthDiameter;
    
    if (scaleMode) {
      if (diameter > 1000000) return isMobile ? 350 : 650; 
      return Math.max(3, ratio * 7); // כדור הארץ בערך 7 פיקסלים
    }
    
    if (diameter > 1000000) return isMobile ? 90 : 150; 
    const baseSize = diameter / 4000;
    return Math.max(16, Math.min(baseSize, 60));
  };

  const sunSize = getScaleSize(SUN.realSize);
  const baseRadius = scaleMode ? 500 : (isMobile ? 80 : 140);
  const radiusStep = scaleMode ? 180 : (isMobile ? 45 : 90);

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#020617]">
      <style>{`
        @keyframes self-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .planet-spin { animation: self-rotate 40s linear infinite; }
        .pause-animation { animation-play-state: paused !important; }
        .transition-galaxy { transition: all 1.5s cubic-bezier(0.22, 1, 0.36, 1); }
      `}</style>
      
      {/* רקע כוכבים עשיר יותר */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        {[...Array(200)].map((_, i) => (
          <div key={i} className="absolute bg-white rounded-full animate-pulse"
            style={{ 
              width: (Math.random() * 2 + 1) + 'px', 
              height: (Math.random() * 2 + 1) + 'px', 
              top: Math.random() * 100 + '%', 
              left: Math.random() * 100 + '%', 
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random()
            }}
          />
        ))}
      </div>

      {/* השמש */}
      <div className="absolute transition-galaxy flex items-center justify-center" 
        style={{ 
          width: sunSize, 
          height: sunSize, 
          left: scaleMode ? `-${sunSize * 0.75}px` : 'auto',
          zIndex: 10
        }}
      >
        <button 
          onClick={() => onPlanetSelect(SUN)} 
          className="relative w-full h-full rounded-full group focus:outline-none transition-transform hover:scale-105"
        >
          <div className="absolute inset-0 rounded-full bg-orange-600/30 blur-[120px] animate-pulse"></div>
          <div className="relative w-full h-full bg-gradient-to-tr from-yellow-300 via-orange-500 to-red-600 rounded-full shadow-[0_0_80px_rgba(234,179,8,0.4)] border-4 border-yellow-200/10"></div>
          {scaleMode && (
            <div className="absolute top-1/2 left-[110%] -translate-y-1/2 bg-black/60 backdrop-blur px-5 py-2 rounded-2xl border border-yellow-500/40 text-yellow-100 text-sm font-black whitespace-nowrap shadow-xl animate-in fade-in slide-in-from-left-4">
              השמש: גדולה פי 109 מכדור הארץ ☀️
            </div>
          )}
        </button>
      </div>

      {/* מסלולים ופלנטות */}
      {PLANETS.map((planet, index) => {
        const orbitRadius = baseRadius + (index + 1) * radiusStep;
        const isSelected = selectedPlanetId === planet.id;
        const displaySize = getScaleSize(planet.realSize);
        const orbitOffset = scaleMode ? -sunSize * 0.75 : 0;

        return (
          <div key={planet.id} 
            className={`absolute border rounded-full transition-galaxy pointer-events-none ${isSelected ? 'border-blue-400/70 border-2 z-40' : 'border-white/5'}`}
            style={{ 
              width: `${orbitRadius * 2}px`, 
              height: `${orbitRadius * 2}px`, 
              transform: `translateX(${orbitOffset}px)` 
            }}
          >
            <div className={`w-full h-full relative ${animationEnabled ? '' : 'pause-animation'}`}
              style={{ animation: `rotate-belt ${80 / planet.orbitalSpeed}s linear infinite` }}>
              <button onClick={() => onPlanetSelect(planet)}
                className={`absolute pointer-events-auto rounded-full transition-galaxy hover:scale-150 focus:outline-none group planet-spin ${animationEnabled ? '' : 'pause-animation'} ${isSelected ? 'ring-4 ring-white shadow-2xl z-50' : 'z-20'}`}
                style={{ 
                  width: `${displaySize}px`, 
                  height: `${displaySize}px`, 
                  backgroundColor: planet.color, 
                  top: '50%', 
                  right: `-${displaySize / 2}px`, 
                  marginTop: `-${displaySize / 2}px`, 
                  backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent, rgba(0,0,0,0.5))`, 
                  boxShadow: isSelected ? `0 0 30px ${planet.color}` : `0 0 10px ${planet.color}44` 
                }}
              >
                <div className={`absolute -bottom-14 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-black text-white bg-slate-900/95 px-3 py-1.5 rounded-xl border border-white/10 transition-all whitespace-nowrap shadow-2xl ${isSelected ? 'opacity-100 scale-125' : 'opacity-0 group-hover:opacity-100'}`}>
                  {planet.name}
                </div>
              </button>
            </div>
          </div>
        );
      })}

      <style>{` @keyframes rotate-belt { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `}</style>
    </div>
  );
};

export default SolarSystemView;
