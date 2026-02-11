
import React, { useState, useEffect } from 'react';
import { PlanetData, ChatMessage } from './types';
import { askAboutPlanet } from './geminiService';
import { PLANETS, SUN } from './constants';

interface PlanetDetailsProps {
  planet: PlanetData;
  onClose: () => void;
  onNavigate: (planet: PlanetData) => void;
}

const PlanetDetails: React.FC<PlanetDetailsProps> = ({ planet, onClose, onNavigate }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const allCelestialBodies = [SUN, ...PLANETS];
  const currentIndex = allCelestialBodies.findIndex(p => p.id === planet.id);
  
  const nextPlanet = allCelestialBodies[(currentIndex + 1) % allCelestialBodies.length];
  const prevPlanet = allCelestialBodies[(currentIndex - 1 + allCelestialBodies.length) % allCelestialBodies.length];

  // Reset chat when switching planets
  useEffect(() => {
    setChatHistory([]);
    setQuestion('');
  }, [planet.id]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: question };
    setChatHistory(prev => [...prev, userMsg]);
    const currentQuestion = question;
    setQuestion('');
    setLoading(true);

    const answer = await askAboutPlanet(planet.name, currentQuestion);
    const aiMsg: ChatMessage = { role: 'model', text: answer };
    setChatHistory(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const earthSize = 12742;
  const planetSize = parseInt(planet.realSize.replace(/,/g, ''));
  const sizeRatio = (planetSize / earthSize).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 pointer-events-none overflow-y-auto">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md pointer-events-auto" onClick={onClose}></div>
      
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-700/50 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row pointer-events-auto max-h-[90vh] my-auto">
        
        {/* Navigation Buttons */}
        <div className="hidden md:flex absolute inset-y-0 left-0 right-0 justify-between items-center px-4 pointer-events-none z-30">
          <button onClick={() => onNavigate(prevPlanet)} className="pointer-events-auto p-4 bg-white/5 hover:bg-blue-600 rounded-full text-white transition-all border border-white/10 backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => onNavigate(nextPlanet)} className="pointer-events-auto p-4 bg-white/5 hover:bg-blue-600 rounded-full text-white transition-all border border-white/10 backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* Info Column */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto order-2 md:order-1 scrollbar-hide text-right">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-white">{planet.name}</h2>
              <p className="text-blue-400 font-mono text-sm md:text-lg uppercase tracking-[0.2em] opacity-70">{planet.englishName}</p>
            </div>
            <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-red-500/20 rounded-2xl text-white transition-colors border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="bg-blue-500/5 p-6 rounded-3xl border border-blue-500/10 mb-8 shadow-inner">
            <p className="text-white text-lg md:text-xl leading-relaxed italic">"{planet.description}"</p>
          </div>

          {/* Scale Comparison Indicator */}
          {planet.id !== 'sun' && (
            <div className="mb-8 p-5 bg-slate-800/40 border border-white/5 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-blue-300 font-bold text-sm mb-1">יחס גודל לכדור הארץ:</h4>
                <p className="text-white text-lg font-black">
                  {parseFloat(sizeRatio) > 1 ? `גדול פי ${sizeRatio}` : `קטן פי ${(1/parseFloat(sizeRatio)).toFixed(1)}`}
                </p>
              </div>
              <div className="flex items-end gap-3 px-4">
                <div className="w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" title="כדור הארץ"></div>
                <div 
                  className="rounded-full border border-white/20" 
                  style={{ 
                    width: `${Math.max(4, 16 * parseFloat(sizeRatio))}px`, 
                    height: `${Math.max(4, 16 * parseFloat(sizeRatio))}px`,
                    backgroundColor: planet.color
                  }}
                ></div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatItem label="טמפרטורה" value={planet.temperature} icon="🌡️" />
            <StatItem label="ירחים" value={planet.moonsCount.toString()} icon="🌙" />
            <StatItem label="מרחק מהשמש" value={planet.distanceFromSun} icon="☀️" />
            <StatItem label="קוטר" value={planet.realSize} icon="📏" />
          </div>

          {/* AI Chat */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              שאל את המומחה (AI)
            </h3>
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto scrollbar-hide flex flex-col px-2">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`p-4 rounded-2xl max-w-[85%] text-lg shadow-lg ${msg.role === 'user' ? 'bg-blue-600/20 mr-auto text-blue-100 border border-blue-500/20' : 'bg-slate-800 ml-auto border border-white/5 text-slate-200'}`}>
                  {msg.text}
                </div>
              ))}
              {loading && <div className="text-slate-500 text-sm animate-pulse mr-auto">מעבד נתונים...</div>}
            </div>
            <form onSubmit={handleAsk} className="flex gap-3">
              <input 
                type="text" 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="שאלו כל דבר על עולם זה..."
                className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-inner"
              />
              <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-2xl font-bold transition-all disabled:opacity-50 text-white shadow-lg">שלח</button>
            </form>
          </div>
        </div>

        {/* Visual Sidebar */}
        <div className="w-full md:w-[450px] h-[300px] md:h-auto shrink-0 bg-black relative order-1 md:order-2 overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
          <img 
            src={planet.imageUrl} 
            alt={planet.name} 
            className="w-full h-full object-cover opacity-80 transition-transform duration-[20s] hover:scale-125" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value, icon }: { label: string, value: string, icon: string }) => (
  <div className="bg-slate-800/40 p-4 rounded-2xl border border-white/5">
    <div className="text-2xl mb-1">{icon}</div>
    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">{label}</div>
    <div className="text-sm font-black text-white leading-tight">{value}</div>
  </div>
);

export default PlanetDetails;
