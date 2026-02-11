
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
      if (diameter > 1000000) return isMobile ? 400 : 700; // Sun massive in scale mode
      return Math.max(2, ratio * 6); // Earth is 6px baseline
    }
    
    if (diameter > 1000000) return isMobile ? 80 : 130; 
    const baseSize = diameter / 4000;
    return Math.max(12, Math.min(baseSize, 50));
  };

  const sunSize = getScaleSize(SUN.realSize);
  const baseRadius = scaleMode ? 500 : (isMobile ? 80 : 120);
  const radiusStep = scaleMode ? 250 : (isMobile ? 40 : 80);

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_100%)]">
      <style>{`
        @keyframes self-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .planet-spin { animation: self-rotate 25s linear infinite; }
        .pause-animation { animation-play-state: paused !important; }
        .transition-all-custom { transition: all 1.5s cubic-bezier(0.19, 1, 0.22, 1); }
      `}</style>
      
      {/* Moving stars background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        {[...Array(200)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: Math.random() * 2 + 'px',
              height: Math.random() * 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Sun */}
      <div 
        className="absolute transition-all-custom flex items-center justify-center"
        style={{ 
          width: sunSize, 
          height: sunSize,
          left: scaleMode ? `-${sunSize * 0.7}px` : 'auto', // Push sun to left in scale mode to see orbits better
        }}
      >
        <button 
          onClick={() => onPlanetSelect(SUN)}
          className="relative w-full h-full rounded-full transition-all group focus:outline-none"
        >
          <div className="absolute inset-0 rounded-full bg-orange-600/20 blur-[100px] animate-pulse"></div>
          <div className="relative w-full h-full bg-gradient-to-tr from-yellow-300 via-orange-500 to-red-600 rounded-full shadow-[0_0_120px_rgba(249,115,22,0.4)] border-4 border-yellow-100/10"></div>
          {scaleMode && (
            <div className="absolute top-1/2 left-[110%] -translate-y-1/2 whitespace-nowrap bg-black/60 backdrop-blur px-4 py-2 rounded-xl border border-yellow-500/30 text-yellow-200 text-sm font-bold">
              השמש: גדולה פי 109 מכדור הארץ
            </div>
          )}
        </button>
      </div>

      {/* Planets and Orbits */}
      {PLANETS.map((planet, index) => {
        const orbitRadius = baseRadius + (index + 1) * radiusStep;
        const isSelected = selectedPlanetId === planet.id;
        const displaySize = getScaleSize(planet.realSize);
        const orbitOffset = scaleMode ? -sunSize * 0.7 : 0;

        return (
          <div
            key={planet.id}
            className={`absolute border rounded-full transition-all-custom pointer-events-none ${isSelected ? 'border-blue-400/50 border-2 z-40' : 'border-white/5'}`}
            style={{
              width: `${orbitRadius * 2}px`,
              height: `${orbitRadius * 2}px`,
              transform: `translateX(${orbitOffset}px)`,
            }}
          >
            <div 
              className={`w-full h-full relative ${animationEnabled ? '' : 'pause-animation'}`}
              style={{
                animation: `rotate-belt ${60 / planet.orbitalSpeed}s linear infinite`,
              }}
            >
              <button
                onClick={() => onPlanetSelect(planet)}
                className={`absolute pointer-events-auto rounded-full transition-all-custom hover:scale-125 focus:outline-none group planet-spin ${animationEnabled ? '' : 'pause-animation'}
                  ${isSelected ? 'ring-4 ring-white shadow-[0_0_30px_white] z-50' : 'z-20 opacity-90 hover:opacity-100'}`}
                style={{
                  width: `${displaySize}px`,
                  height: `${displaySize}px`,
                  backgroundColor: planet.color,
                  top: '50%',
                  right: `-${displaySize / 2}px`,
                  marginTop: `-${displaySize / 2}px`,
                  backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent, rgba(0,0,0,0.5))`,
                  boxShadow: isSelected ? `0 0 25px ${planet.color}` : 'none'
                }}
              >
                {/* Scale Comparison Tooltip (Automatic for some planets) */}
                {scaleMode && (planet.id === 'earth' || planet.id === 'jupiter') && (
                  <div className="absolute bottom-[120%] left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 text-[10px] text-white whitespace-nowrap animate-bounce">
                    {planet.id === 'earth' ? 'נקודת ייחוס 📍' : '1,300 כדורי ארץ נכנסים כאן!'}
                  </div>
                )}

                <div className={`absolute -bottom-12 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-slate-900/90 px-3 py-1 rounded-lg border border-white/10 transition-all whitespace-nowrap shadow-xl ${isSelected ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100'}`}>
                  {planet.name}
                </div>
              </button>
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes rotate-belt { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default SolarSystemView;
