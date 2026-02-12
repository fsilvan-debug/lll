
import React, { useState } from 'react';
import { PLANETS, SUN } from './constants';
import { PlanetData } from './types';

interface SolarSystemViewProps {
  selectedPlanetId: string | null;
  hoveredPlanetId: string | null;
  onPlanetSelect: (planet: PlanetData) => void;
  animationEnabled: boolean;
  scaleMode?: boolean;
  fullView?: boolean;
}

const SolarSystemView: React.FC<SolarSystemViewProps> = ({ 
  selectedPlanetId, 
  hoveredPlanetId,
  onPlanetSelect, 
  animationEnabled,
  scaleMode = false,
  fullView = false
}) => {
  const isMobile = window.innerWidth < 768;
  const [internalHoverId, setInternalHoverId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  const currentHoveredId = hoveredPlanetId || internalHoverId;

  const handleImageError = (planetId: string) => {
    setImageErrors(prev => ({ ...prev, [planetId]: true }));
  };

  const getScaleSize = (realSizeStr: string) => {
    const diameter = parseInt(realSizeStr.replace(/,/g, ''));
    const earthDiameter = 12742;
    const ratio = diameter / earthDiameter;
    
    if (scaleMode) {
      const baseSize = fullView ? (isMobile ? 1.5 : 2.5) : (isMobile ? 3 : 5);
      if (diameter > 1000000) return baseSize * 109; 
      return Math.max(2, ratio * baseSize); 
    }
    
    if (diameter > 1000000) return fullView ? 60 : (isMobile ? 80 : 130); 
    if (diameter < 2000) return fullView ? 6 : 12; 
    const baseSize = diameter / 1200;
    const result = Math.max(fullView ? 12 : 22, Math.min(baseSize, 80));
    return fullView ? result * 0.6 : result;
  };

  const sunSize = getScaleSize(SUN.realSize);
  
  const baseRadius = fullView 
    ? (isMobile ? 40 : 60) 
    : (scaleMode ? 250 : (isMobile ? 100 : 160));
    
  const radiusStep = fullView 
    ? (isMobile ? 18 : 32) 
    : (scaleMode ? 120 : (isMobile ? 50 : 100));

  const getSelfSpinDuration = (planetId: string) => {
    switch(planetId) {
      case 'jupiter': return '4s'; 
      case 'saturn': return '5s';
      case 'uranus': return '8s';
      case 'neptune': return '9s';
      case 'earth': return '15s';
      case 'mars': return '16s';
      case 'mercury': return '40s';
      case 'venus': return '-80s'; 
      default: return '20s';
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#020617] transition-all duration-1000">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {[...Array(80)].map((_, i) => (
          <div key={i} className="absolute bg-white rounded-full animate-pulse" 
            style={{ 
              width: Math.random() * 2 + 'px', 
              height: Math.random() * 2 + 'px', 
              top: Math.random() * 100 + '%', 
              left: Math.random() * 100 + '%',
              animationDelay: `${Math.random() * 5}s`
            }} 
          />
        ))}
      </div>

      <div className="relative w-full h-full flex items-center justify-center transition-all duration-1000">
        <div className="relative flex items-center justify-center transition-all duration-1000">
          
          <div className="absolute rounded-full pointer-events-none transition-all duration-1000"
            style={{ 
              width: `${(baseRadius + 4.5 * radiusStep) * 2}px`, 
              height: `${(baseRadius + 4.5 * radiusStep) * 2}px`,
              border: '15px double rgba(148, 163, 184, 0.1)',
              filter: 'blur(1px)',
              background: 'radial-gradient(circle, transparent 60%, rgba(148, 163, 184, 0.05) 75%, transparent 90%)'
            }}
          >
             <div className="w-full h-full animate-slow-spin opacity-20 bg-[url('https://www.transparenttextures.com/patterns/pollen.png')] mix-blend-screen" />
          </div>

          <div className="absolute rounded-full pointer-events-none transition-all duration-1000"
            style={{ 
              width: `${(baseRadius + 11.5 * radiusStep) * 2}px`, 
              height: `${(baseRadius + 11.5 * radiusStep) * 2}px`,
              border: '40px solid rgba(59, 130, 246, 0.05)',
              filter: 'blur(3px)',
              background: 'radial-gradient(circle, transparent 50%, rgba(59, 130, 246, 0.03) 100%)'
            }}
          >
             <div className="w-full h-full animate-slow-spin-reverse opacity-15 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay" />
          </div>

          <div className="absolute z-10 flex items-center justify-center transition-all duration-1000" style={{ width: sunSize, height: sunSize }}>
            <button onClick={() => onPlanetSelect(SUN)} className="relative w-full h-full rounded-full group focus:outline-none transition-transform hover:scale-105 overflow-hidden shadow-[0_0_100px_rgba(234,179,8,0.5)]">
              <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-[40px] animate-pulse"></div>
              <img 
                src={SUN.imageUrl} 
                className="w-full h-full object-cover rounded-full border border-white/20 animate-spin-extremely-slow" 
                alt="Sun" 
                onError={() => handleImageError('sun')}
                style={{ visibility: imageErrors['sun'] ? 'hidden' : 'visible' }}
              />
              {imageErrors['sun'] && <div className="absolute inset-0 bg-yellow-500 rounded-full" />}
            </button>
          </div>

          {PLANETS.map((planet, index) => {
            const orbitRadius = baseRadius + (index + 1) * radiusStep;
            const isSelected = selectedPlanetId === planet.id;
            const isHovered = currentHoveredId === planet.id;
            const displaySize = getScaleSize(planet.realSize);
            const isHaumea = planet.id === 'haumea';
            const selfSpinTime = getSelfSpinDuration(planet.id);
            const hasImageError = imageErrors[planet.id];

            return (
              <div key={planet.id} 
                className={`absolute border rounded-full transition-all duration-1000 pointer-events-none 
                  ${isSelected ? 'border-blue-400 border-[2.5px] z-40 bg-blue-400/5' : 'border-white/5'}
                  ${isHovered ? 'border-blue-500 border-[2px] shadow-[0_0_40px_rgba(59,130,246,0.3)]' : ''}`}
                style={{ width: `${orbitRadius * 2}px`, height: `${orbitRadius * 2}px` }}
              >
                <div className={`w-full h-full relative ${animationEnabled ? '' : 'pause-animation'}`}
                  style={{ animation: `rotate-system ${180 / planet.orbitalSpeed}s linear infinite` }}>
                  
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 flex items-center justify-center"
                    onMouseEnter={() => setInternalHoverId(planet.id)}
                    onMouseLeave={() => setInternalHoverId(null)}
                    style={{ width: isHaumea ? `${displaySize * 1.5}px` : `${displaySize}px`, height: `${displaySize}px` }}
                  >
                    <button onClick={() => onPlanetSelect(planet)}
                      className={`relative pointer-events-auto transition-all duration-700 hover:scale-125 focus:outline-none group overflow-visible shadow-xl ${isSelected ? 'ring-2 ring-white z-50 scale-110' : 'z-20'}`}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        borderRadius: isHaumea ? '60% 40% 60% 40%' : '50%',
                        backgroundColor: planet.color,
                        backgroundImage: hasImageError ? 'none' : `url(${planet.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: 'none',
                        outline: 'none',
                        animation: animationEnabled ? `planet-self-rotate ${selfSpinTime} linear infinite` : 'none'
                      }}
                    >
                       {/* Hidden img for error detection */}
                       {!hasImageError && (
                         <img 
                          src={planet.imageUrl} 
                          className="hidden" 
                          alt="" 
                          onError={() => handleImageError(planet.id)} 
                         />
                       )}

                       <div className="absolute inset-0 rounded-inherit pointer-events-none shadow-[inset_-4px_-4px_12px_rgba(0,0,0,0.7)]" style={{ borderRadius: 'inherit' }} />

                       {(planet.id === 'saturn' || planet.id === 'uranus') && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                          style={{
                            width: '280%',
                            height: '280%',
                            background: 'radial-gradient(circle, transparent 40%, rgba(255,255,255,0.05) 44%, rgba(255,255,255,0.15) 55%, transparent 70%)',
                            transform: `translate(-50%, -50%) scaleY(${planet.id === 'uranus' ? 1 : 0.4}) rotate(${planet.id === 'uranus' ? 90 : 25}deg)`,
                          }}
                        />
                       )}
                    </button>

                    <div className={`absolute -top-12 whitespace-nowrap text-xs md:text-sm font-bold text-white bg-slate-900/90 px-3 py-1 rounded-xl border border-white/10 transition-all pointer-events-none z-50
                      ${isSelected || isHovered ? 'opacity-100 translate-y-0 scale-110' : 'opacity-0 translate-y-2'}`}>
                      {planet.name}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes planet-self-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rotate-system { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); } 
        }
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slow-spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes spin-extremely-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-extremely-slow { animation: spin-extremely-slow 400s linear infinite; }
        .animate-slow-spin { animation: slow-spin 200s linear infinite; }
        .animate-slow-spin-reverse { animation: slow-spin-reverse 400s linear infinite; }
        .pause-animation { animation-play-state: paused !important; }
      `}</style>
    </div>
  );
};

export default SolarSystemView;
