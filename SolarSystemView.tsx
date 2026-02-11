
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
      if (diameter > 1000000) return isMobile ? 350 : 650; // שמש דומיננטית
      return Math.max(2, ratio * 6); // כדור הארץ בגודל 6px
    }
    
    if (diameter > 1000000) return isMobile ? 90 : 140; 
    const baseSize = diameter / 4000;
    return Math.max(14, Math.min(baseSize, 55));
  };

  const sunSize = getScaleSize(SUN.realSize);
  const baseRadius = scaleMode ? 480 : (isMobile ? 80 : 130);
  const radiusStep = scaleMode ? 160 : (isMobile ? 45 : 85);

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#020617]">
      <style>{`
        @keyframes self-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .planet-spin { animation: self-rotate 30s linear infinite; }
        .pause-animation { animation-play-state: paused !important; }
        .transition-fast { transition: all 1.2s cubic-bezier(0.19, 1, 0.22, 1); }
      `}</style>
      
      {/* Background Stars */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        {[...Array(200)].map((_, i) => (
          <div key={i} className="absolute bg-white rounded-full animate-pulse"
            style={{ width: Math.random() * 2 + 'px', height: Math.random() * 2 + 'px', top: Math.random() * 100 + '%', left: Math.random() * 100 + '%', animationDelay: `${Math.random() * 5}s` }}
          />
        ))}
      </div>

      {/* The Sun */}
      <div className="absolute transition-fast flex items-center justify-center" 
        style={{ 
          width: sunSize, 
          height: sunSize, 
          left: scaleMode ? `-${sunSize * 0.75}px` : 'auto',
          zIndex: 10
        }}
      >
        <button onClick={() => onPlanetSelect(SUN)} className="relative w-full h-full rounded-full group focus:outline-none">
          <div className="absolute inset-0 rounded-full bg-orange-600/30 blur-[100px] animate-pulse"></div>
          <div className="relative w-full h-full bg-gradient-to-tr from-yellow-300 via-orange-500 to-red-600 rounded-full shadow-2xl border-4 border-yellow-200/10"></div>
          {scaleMode && (
            <div className="absolute top-1/2 left-[110%] -translate-y-1/2 bg-black/60 backdrop-blur px-5 py-2 rounded-2xl border border-yellow-500/40 text-yellow-100 text-sm font-black whitespace-nowrap shadow-xl">
              השמש: גדולה פי 109 מכדור הארץ ☀️
            </div>
          )}
        </button>
      </div>

      {/* Orbits and Planets */}
      {PLANETS.map((planet, index) => {
        const orbitRadius = baseRadius + (index + 1) * radiusStep;
        const isSelected = selectedPlanetId === planet.id;
        const displaySize = getScaleSize(planet.realSize);
        const orbitOffset = scaleMode ? -sunSize * 0.75 : 0;

        return (
          <div key={planet.id} 
            className={`absolute border rounded-full transition-fast pointer-events-none ${isSelected ? 'border-blue-400/60 border-2 z-40 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-white/5'}`}
            style={{ 
              width: `${orbitRadius * 2}px`, 
              height: `${orbitRadius * 2}px`, 
              transform: `translateX(${orbitOffset}px)` 
            }}
          >
            <div className={`w-full h-full relative ${animationEnabled ? '' : 'pause-animation'}`}
              style={{ animation: `rotate-belt ${60 / planet.orbitalSpeed}s linear infinite` }}>
              <button onClick={() => onPlanetSelect(planet)}
                className={`absolute pointer-events-auto rounded-full transition-fast hover:scale-150 focus:outline-none group planet-spin ${animationEnabled ? '' : 'pause-animation'} ${isSelected ? 'ring-4 ring-white shadow-2xl z-50' : 'z-20'}`}
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
