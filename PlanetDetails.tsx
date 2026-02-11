import React, { useState, useMemo } from 'react';
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

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: question };
    setChatHistory(prev => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    const answer = await askAboutPlanet(planet.name, question);
    const aiMsg: ChatMessage = { role: 'model', text: answer };
    setChatHistory(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-8 pointer-events-none overflow-y-auto">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md pointer-events-auto" onClick={onClose}></div>
      
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row pointer-events-auto max-h-[95vh] my-auto">
        
        {/* Desktop Quick Nav */}
        <div className="hidden md:flex absolute inset-y-0 left-0 right-0 justify-between items-center px-6 pointer-events-none z-30">
          <button 
            onClick={() => onNavigate(prevPlanet)}
            className="pointer-events-auto p-4 bg-slate-800/80 hover:bg-blue-600 rounded-full text-white shadow-2xl transition-all hover:-translate-x-2 border border-white/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => onNavigate(nextPlanet)}
            className="pointer-events-auto p-4 bg-slate-800/80 hover:bg-blue-600 rounded-full text-white shadow-2xl transition-all hover:translate-x-2 border border-white/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-12 overflow-y-auto order-2 md:order-1 scrollbar-hide text-right">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-1">{planet.name}</h2>
              <p className="text-blue-400 font-mono text-sm md:text-lg uppercase tracking-widest opacity-70">{planet.englishName}</p>
            </div>
            <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-red-500/20 rounded-2xl text-white transition-colors border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 mb-8">
            <p className="text-white text-lg md:text-xl leading-relaxed">{planet.description}</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatBox label="טמפרטורה" value={planet.temperature} icon="🌡️" />
            <StatBox label="מרחק מהשמש" value={planet.distanceFromSun} icon="☀️" />
            <StatBox label="יום" value={planet.dayLength} icon="⏰" />
            <StatBox label="שנה" value={planet.yearLength} icon="🌍" />
          </div>

          {/* AI Chat */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              שאל את הבינה המלאכותית
            </h3>
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto scrollbar-hide flex flex-col">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`p-4 rounded-2xl max-w-[90%] text-lg ${msg.role === 'user' ? 'bg-blue-600/20 mr-auto text-blue-100 border border-blue-500/30 self-start' : 'bg-slate-800 ml-auto border border-white/5 self-end'}`}>
                  {msg.text}
                </div>
              ))}
              {loading && <div className="text-slate-500 text-sm animate-pulse">המדען שלנו בודק את הנתונים...</div>}
            </div>
            <form onSubmit={handleAsk} className="flex gap-3">
              <input 
                type="text" 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="למשל: כמה חזקה שם כוח המשיכה?"
                className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-2xl font-bold transition-all disabled:opacity-50 shadow-lg">שאל</button>
            </form>
          </div>
        </div>

        {/* Visual */}
        <div className="w-full md:w-[450px] h-[300px] md:h-auto shrink-0 bg-black relative order-1 md:order-2 overflow-hidden">
          <img 
            src={planet.imageUrl} 
            alt={planet.name} 
            className="w-full h-full object-cover opacity-80" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, icon }: { label: string, value: string, icon: string }) => (
  <div className="bg-slate-800/40 p-4 rounded-2xl border border-white/5 hover:bg-slate-800 transition-colors">
    <div className="text-2xl mb-2">{icon}</div>
    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">{label}</div>
    <div className="text-sm md:text-base font-bold text-white leading-tight">{value}</div>
  </div>
);

export default PlanetDetails;