
import React, { useState, useEffect, useMemo } from 'react';
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
  const [compareId, setCompareId] = useState<string>('earth');

  const allBodies = [SUN, ...PLANETS];
  const currentIndex = allBodies.findIndex(p => p.id === planet.id);
  const nextBody = allBodies[(currentIndex + 1) % allBodies.length];
  const prevBody = allBodies[(currentIndex - 1 + allBodies.length) % allBodies.length];

  const comparisonPlanet = allBodies.find(p => p.id === compareId);

  useEffect(() => {
    setChatHistory([]);
    setQuestion('');
  }, [planet.id]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: question };
    setChatHistory(prev => [...prev, userMsg]);
    const currentQ = question;
    setQuestion('');
    setLoading(true);

    const answer = await askAboutPlanet(planet.name, currentQ);
    setChatHistory(prev => [...prev, { role: 'model', text: answer }]);
    setLoading(false);
  };

  const insights = useMemo(() => {
    const list: string[] = [];
    const size = parseInt(planet.realSize.replace(/,/g, ''));
    if (size > 100000) list.push("זהו ענק גז/כוכב עצום - אין עליו קרקע מוצקה לעמוד עליה!");
    if (planet.moonsCount > 50) list.push(`עם ${planet.moonsCount} ירחים, הפלנטה הזו היא ממש מערכת שמש קטנה בפני עצמה.`);
    if (planet.temperature.includes('-')) list.push("הטמפרטורה כאן נמוכה בהרבה מכל מקום על פני כדור הארץ.");
    return list;
  }, [planet]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl pointer-events-auto" onClick={onClose}></div>
      
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-700/50 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row pointer-events-auto max-h-[90vh]">
        
        {/* Navigation Arrows */}
        <div className="hidden md:block absolute inset-y-0 left-0 right-0 z-30 pointer-events-none">
          <div className="flex justify-between items-center h-full px-4">
            <button onClick={() => onNavigate(prevBody)} className="pointer-events-auto p-4 bg-white/5 hover:bg-blue-600 rounded-full text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => onNavigate(nextBody)} className="pointer-events-auto p-4 bg-white/5 hover:bg-blue-600 rounded-full text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto order-2 md:order-1 scrollbar-hide text-right">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-white">{planet.name}</h2>
              <p className="text-blue-400 font-mono text-lg uppercase tracking-widest opacity-70">{planet.englishName}</p>
            </div>
            <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-red-500/20 rounded-2xl text-white transition-colors border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <p className="text-white text-xl leading-relaxed mb-8 italic bg-blue-500/5 p-6 rounded-3xl border border-blue-500/10 shadow-inner">"{planet.description}"</p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatItem label="טמפרטורה" value={planet.temperature} icon="🌡️" color="text-orange-400" />
            <StatItem label="ירחים" value={planet.moonsCount.toString()} icon="🌙" color="text-blue-300" />
            <StatItem label="מרחק מהשמש" value={planet.distanceFromSun} icon="☀️" color="text-yellow-400" />
            <StatItem label="קוטר" value={planet.realSize} icon="📏" color="text-emerald-400" />
          </div>

          {/* Insights */}
          {insights.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2"><span>💡</span> תובנות מדעיות</h3>
              <div className="space-y-2">
                {insights.map((ins, i) => (
                  <div key={i} className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-slate-200">● {ins}</div>
                ))}
              </div>
            </div>
          )}

          {/* Comparison Tool */}
          <div className="mb-10 bg-slate-800/50 p-6 rounded-3xl border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-blue-300">השוואה מול:</h3>
              <select 
                value={compareId} 
                onChange={(e) => setCompareId(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1 text-white"
              >
                {allBodies.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            {comparisonPlanet && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-black/20 p-3 rounded-lg">
                  <p className="text-slate-500 mb-1">גודל ({planet.name})</p>
                  <p className="font-bold text-white">{planet.realSize}</p>
                </div>
                <div className="bg-black/20 p-3 rounded-lg border-r-2 border-blue-500">
                  <p className="text-slate-500 mb-1">גודל ({comparisonPlanet.name})</p>
                  <p className="font-bold text-blue-300">{comparisonPlanet.realSize}</p>
                </div>
              </div>
            )}
          </div>

          {/* AI Chat */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              שאל את חוקר החלל (AI)
            </h3>
            <div className="space-y-4 mb-6 max-h-48 overflow-y-auto scrollbar-hide flex flex-col">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`p-4 rounded-2xl max-w-[85%] text-lg shadow-lg ${msg.role === 'user' ? 'bg-blue-600/20 mr-auto text-blue-100 border border-blue-500/20' : 'bg-slate-800 ml-auto border border-white/5 text-slate-200'}`}>
                  {msg.text}
                </div>
              ))}
              {loading && <div className="text-slate-500 text-sm animate-pulse mr-auto">מנתח נתונים...</div>}
            </div>
            <form onSubmit={handleAsk} className="flex gap-3">
              <input 
                type="text" 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="שאלו כל דבר על פלנטה זו..."
                className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-inner"
              />
              <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-2xl font-bold transition-all disabled:opacity-50 text-white shadow-xl">שלח</button>
            </form>
          </div>
        </div>

        {/* Visual Sidebar */}
        <div className="w-full md:w-[450px] h-[300px] md:h-auto shrink-0 bg-black relative order-1 md:order-2 overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
          <img src={planet.imageUrl} alt={planet.name} className="w-full h-full object-cover opacity-80 transition-transform duration-[20s] hover:scale-125" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value, icon, color }: { label: string, value: string, icon: string, color: string }) => (
  <div className="bg-slate-800/40 p-4 rounded-2xl border border-white/5">
    <div className="text-2xl mb-1">{icon}</div>
    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">{label}</div>
    <div className={`text-sm font-black leading-tight ${color}`}>{value}</div>
  </div>
);

export default PlanetDetails;
