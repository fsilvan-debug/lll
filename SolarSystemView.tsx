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
      // Realistic Scale: Earth is tiny (4px). Jupiter is bigger (44px). Sun is massive.
      if (diameter > 1000000) return 600; // Sun limited to 600px for screen space
      return Math.max(2, ratio * 4);
    }
    
    // Schematic Mode (Default)
    if (diameter > 1000000) return isMobile ? 80 : 130; 
    const baseSize = diameter / 4000;
    return Math.max(12, Math.min(baseSize, 50));
  };

  const sunSize = getScaleSize(SUN.realSize);
  const baseRadius = scaleMode ? 400 : (isMobile ? 80 : 120);
  const radiusStep = scaleMode ? 150 : (isMobile ? 40 : 80);

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_100%)]">
      <style>{`
        @keyframes self-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .planet-spin { animation: self-rotate 25s linear infinite; }
        .pause-animation { animation-play-state: paused !important; }
        .transition-all-custom { transition: all 1.2s cubic-bezier(0.23, 1, 0.32, 1); }
      `}</style>
      
      {/* Moving stars background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden">
        {[...Array(150)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: Math.random() * 2 + 'px',
              height: Math.random() * 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      {/* Sun */}
      <button 
        onClick={() => onPlanetSelect(SUN)}
        className="relative z-30 transition-all-custom group focus:outline-none flex items-center justify-center"
        style={{ 
          width: sunSize, 
          height: sunSize,
          transform: selectedPlanetId === 'sun' ? 'scale(1.05)' : 'scale(1)'
        }}
      >
        <div className={`absolute inset-0 rounded-full bg-orange-500/30 blur-[60px] transition-all duration-1000 ${selectedPlanetId === 'sun' ? 'opacity-100 scale-150' : 'opacity-60 scale-110'}`}></div>
        <div className="relative w-full h-full bg-gradient-to-tr from-yellow-300 via-orange-500 to-red-600 rounded-full shadow-[0_0_80px_rgba(249,115,22,0.6)] border-4 border-yellow-200/20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-50">
          <span className="text-black font-black text-sm bg-white/90 px-4 py-1 rounded-full shadow-2xl">השמש</span>
        </div>
      </button>

      {/* Planets and Orbits */}
      {PLANETS.map((planet, index) => {
        const orbitRadius = baseRadius + (index + 1) * radiusStep;
        const isSelected = selectedPlanetId === planet.id;
        const displaySize = getScaleSize(planet.realSize);

        return (
          <div
            key={planet.id}
            className={`absolute border rounded-full transition-all-custom pointer-events-none ${isSelected ? 'border-blue-400/50 border-2 z-40' : 'border-white/5'}`}
            style={{
              width: `${orbitRadius * 2}px`,
              height: `${orbitRadius * 2}px`,
            }}
          >
            <div 
              className={`w-full h-full relative ${animationEnabled ? '' : 'pause-animation'}`}
              style={{
                animation: `rotate-belt ${40 / planet.orbitalSpeed}s linear infinite`,
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
                {(planet.id === 'saturn' || planet.id === 'uranus') && (
                   <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/20 rounded-full pointer-events-none" 
                    style={{
                      width: `${displaySize * 2.4}px`,
                      height: `${displaySize * 0.7}px`,
                      transform: `translate(-50%, -50%) rotate(${planet.id === 'uranus' ? '80deg' : '20deg'})`,
                      background: 'radial-gradient(ellipse at center, transparent 40%, rgba(255,255,255,0.15) 100%)'
                    }}
                   />
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
      
      {scaleMode && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-blue-600/20 backdrop-blur-md px-6 py-2 rounded-full border border-blue-500/30 text-blue-200 text-sm font-bold animate-pulse pointer-events-none">
          מצב סדר גודל מציאותי: כדור הארץ קטן פי 100 מהשמש!
        </div>
      )}
    </div>
  );
};

export default SolarSystemView;