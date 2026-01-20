import React, { useState, useEffect } from 'react';
import { MOCK_CONTESTS, MOCK_PROBLEMS, PROBLEM_DESCRIPTIONS } from '../services/mockDb';
import { Calendar, MapPin, Users, ChevronRight, Swords, Timer, Zap, Trophy, Play, CheckCircle, XCircle } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

const Contests: React.FC = () => {
  const [activeArenaContest, setActiveArenaContest] = useState<any | null>(null);
  const [inDuel, setInDuel] = useState(false);
  const [duelProblem, setDuelProblem] = useState<any>(null);
  const [code, setCode] = useState('');
  const [time, setTime] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [isJudging, setIsJudging] = useState(false);
  const [result, setResult] = useState<'victory' | 'defeat' | 'pending' | null>(null);

  // Timer and Opponent Progress simulation
  useEffect(() => {
    let interval: any;
    if (inDuel && !result) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
        setOpponentProgress(prev => {
          const next = prev + Math.random() * 2;
          if (next >= 100) return 100;
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [inDuel, result]);

  // Check if opponent finished
  useEffect(() => {
    if (opponentProgress >= 100 && !result) {
      setResult('defeat');
    }
  }, [opponentProgress]);

  const handleEnterContest = (contest: any) => {
    setActiveArenaContest(contest);
  };

  const startDuel = () => {
    setInDuel(true);
    setDuelProblem(MOCK_PROBLEMS[6]); // A+B Problem as a starter
    setTime(0);
    setOpponentProgress(0);
    setResult(null);
  };

  const handleRunJudge = async () => {
    setIsJudging(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Competitive Duel Mode: ${duelProblem.title}
        Evaluate this code for correctness.
        ${code}
        Return JSON { "correct": boolean }
      `;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: { correct: { type: Type.BOOLEAN } },
            required: ["correct"]
          }
        }
      });
      const data = JSON.parse(response.text);
      if (data.correct) {
        setResult('victory');
      } else {
        alert("Wrong Answer! Keep trying to beat your opponent.");
      }
    } catch (e) {
      alert("Error judging code.");
    } finally {
      setIsJudging(false);
    }
  };

  if (inDuel) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-indigo-600 rounded-lg"><Swords size={20} /></div>
            <div>
              <h2 className="font-bold">Live Duel Arena</h2>
              <p className="text-xs text-slate-400">Problem: {duelProblem.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Your Time</p>
              <p className="text-xl font-mono text-indigo-400">
                {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
              </p>
            </div>
            <div className="h-10 w-px bg-slate-700"></div>
            <div className="text-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Opponent</p>
              <div className="w-24 h-2 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div 
                  className="h-full bg-red-500 transition-all duration-1000" 
                  style={{ width: `${opponentProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {result ? (
          <div className={`p-12 text-center rounded-2xl border-2 ${result === 'victory' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            {result === 'victory' ? (
              <>
                <Trophy size={64} className="mx-auto text-yellow-500 mb-4 animate-bounce" />
                <h2 className="text-4xl font-black text-emerald-800">VICTORY!</h2>
                <p className="text-emerald-600 mt-2">You solved it in {time}s and beat the opponent!</p>
              </>
            ) : (
              <>
                <XCircle size={64} className="mx-auto text-red-500 mb-4" />
                <h2 className="text-4xl font-black text-red-800">DEFEAT</h2>
                <p className="text-red-600 mt-2">The opponent solved it before you. Better luck next time!</p>
              </>
            )}
            <button 
              onClick={() => { setInDuel(false); setResult(null); }}
              className="mt-8 px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800"
            >
              Return to Contest
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
               <h3 className="font-bold text-lg mb-4">Problem Statement</h3>
               <p className="text-slate-600 mb-4">{PROBLEM_DESCRIPTIONS[duelProblem.id]}</p>
               <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-xs font-mono">
                 <p className="text-slate-400 mb-2">// Sample Input</p>
                 <p>2 3</p>
                 <p className="text-slate-400 my-2">// Sample Output</p>
                 <p>5</p>
               </div>
            </div>
            <div className="bg-slate-900 rounded-xl overflow-hidden flex flex-col h-[400px]">
              <div className="p-2 bg-slate-800 flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-mono">solution.py</span>
                <button 
                  onClick={handleRunJudge}
                  disabled={isJudging}
                  className="bg-emerald-600 text-white text-[10px] px-3 py-1 rounded font-bold flex items-center gap-1"
                >
                  {isJudging ? 'Checking...' : 'SUBMIT'}
                </button>
              </div>
              <textarea 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-grow bg-transparent p-4 text-indigo-300 font-mono text-sm outline-none resize-none"
                placeholder="Write quickest solution..."
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeArenaContest) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setActiveArenaContest(null)}
          className="text-indigo-600 font-medium hover:underline flex items-center gap-1"
        >
          &larr; Exit Arena
        </button>
        <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl font-black mb-2 tracking-tight">{activeArenaContest.name}</h2>
            <p className="text-indigo-200 text-lg mb-8 opacity-90">
              Battle head-to-head in real-time. Solve problems as quickly as possible to climb the live leaderboard.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10">
                <p className="text-xs text-indigo-300 font-bold uppercase mb-1">Your Rank</p>
                <p className="text-2xl font-black">#42</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10">
                <p className="text-xs text-indigo-300 font-bold uppercase mb-1">Live Opponents</p>
                <p className="text-2xl font-black">512</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10">
                <p className="text-xs text-indigo-300 font-bold uppercase mb-1">Prize Pool</p>
                <p className="text-2xl font-black text-yellow-400">500 XP</p>
              </div>
            </div>
            <button 
              onClick={startDuel}
              className="group bg-white text-indigo-900 px-8 py-4 rounded-xl font-black text-lg flex items-center gap-3 hover:bg-indigo-50 transition-all transform hover:scale-105 active:scale-95 shadow-xl"
            >
              <Swords className="group-hover:rotate-12 transition-transform" /> 
              START HEAD-TO-HEAD DUEL
            </button>
          </div>
          <div className="absolute right-[-50px] bottom-[-50px] opacity-10">
             <Swords size={400} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
           <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 flex items-center gap-2">
             <Trophy size={18} className="text-yellow-500" /> Live Standings
           </div>
           <div className="divide-y divide-slate-100">
             {[
               { name: 'SevenK', score: 1200, time: '14:20' },
               { name: 'AlgoMaster_99', score: 1150, time: '16:05' },
               { name: 'FastCoder_X', score: 1100, time: '16:45' },
               { name: 'You', score: 950, time: '20:10', isUser: true },
             ].map((player, i) => (
               <div key={i} className={`flex items-center justify-between p-4 ${player.isUser ? 'bg-indigo-50 font-bold' : ''}`}>
                 <div className="flex items-center gap-4">
                   <span className="text-slate-400 font-mono w-4">#{i+1}</span>
                   <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">
                     {player.name.charAt(0)}
                   </div>
                   <span className="text-sm">{player.name}</span>
                 </div>
                 <div className="flex items-center gap-6">
                   <div className="text-right">
                     <p className="text-xs text-slate-400">Score</p>
                     <p className="text-sm font-bold">{player.score}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-xs text-slate-400">Total Time</p>
                     <p className="text-sm font-bold text-indigo-600">{player.time}</p>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Contests</h2>
            <p className="text-slate-500">Global and Local University Contests</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            Create Local Contest
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {MOCK_CONTESTS.map(contest => (
            <div key={contest.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${contest.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                        <Calendar size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-slate-800">{contest.name}</h3>
                            {contest.type === 'Local' && (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium flex items-center gap-1">
                                    <MapPin size={10} /> Local
                                </span>
                            )}
                            {contest.status === 'Active' && (
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                                <Calendar size={14} /> {contest.date}
                            </span>
                            <span className="flex items-center gap-1">
                                <Users size={14} /> {contest.participants} Participants
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                    {contest.status === 'Active' ? (
                        <button 
                          onClick={() => handleEnterContest(contest)}
                          className="w-full md:w-auto px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Zap size={16} fill="currentColor" /> Enter Arena
                        </button>
                    ) : (
                        <button className="w-full md:w-auto px-6 py-2 bg-slate-100 text-slate-600 font-medium rounded-lg hover:bg-slate-200 transition-colors">
                            View Standings
                        </button>
                    )}
                </div>
            </div>
        ))}
      </div>

      {/* Local Contest Management Banner */}
      <div className="bg-slate-900 rounded-xl p-8 text-white relative overflow-hidden mt-8">
        <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Organizing a Local Contest?</h3>
            <p className="text-slate-300 max-w-xl mb-6">
                Our database system allows professors and student clubs to host local offline contests. 
                We handle the judging, ranking, and test-case verification locally.
            </p>
            <button className="flex items-center gap-2 text-indigo-400 font-medium hover:text-indigo-300">
                Manage Local Contests <ChevronRight size={16} />
            </button>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-800/50 to-transparent"></div>
      </div>
    </div>
  );
};

export default Contests;