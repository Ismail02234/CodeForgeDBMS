import React, { useState, useEffect } from 'react';
import { getRivalStats, AVAILABLE_USERS } from '../services/mockDb';
import { Swords, User as UserIcon, TrendingUp, ChevronDown } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Rivalry: React.FC = () => {
  const [user1Name, setUser1Name] = useState(AVAILABLE_USERS[0]);
  const [user2Name, setUser2Name] = useState(AVAILABLE_USERS[1]);
  
  const [user1Data, setUser1Data] = useState(getRivalStats(AVAILABLE_USERS[0]));
  const [user2Data, setUser2Data] = useState(getRivalStats(AVAILABLE_USERS[1]));

  useEffect(() => {
    setUser1Data(getRivalStats(user1Name));
  }, [user1Name]);

  useEffect(() => {
    setUser2Data(getRivalStats(user2Name));
  }, [user2Name]);

  // Transform data for Recharts to compare two data sets
  const comparisonData = user1Data.topicStrengths.map((item, index) => ({
    topic: item.topic,
    [user1Name]: item.value,
    [user2Name]: user2Data.topicStrengths[index].value,
    fullMark: 100
  }));

  const getLeader = () => {
    if (user1Data.rating > user2Data.rating) return user1Name;
    if (user2Data.rating > user1Data.rating) return user2Name;
    return "Neither (It's a tie!)";
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
          <Swords className="text-red-500" size={32} /> Rivalry Tracker
        </h2>
        <p className="text-slate-500 mt-2">Compare topic proficiencies between any two competitors.</p>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 mb-10">
        <div className="relative w-full md:w-64">
          <label className="text-[10px] uppercase font-bold text-slate-400 absolute -top-5 left-0">User 1 Selection</label>
          <div className="relative">
            <select 
              value={user1Name}
              onChange={(e) => setUser1Name(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 appearance-none focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700 font-bold shadow-sm pr-10"
            >
              {AVAILABLE_USERS.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center px-4">
          <span className="text-slate-300 font-black italic text-2xl">VS</span>
        </div>

        <div className="relative w-full md:w-64">
          <label className="text-[10px] uppercase font-bold text-slate-400 absolute -top-5 left-0">User 2 Selection</label>
          <div className="relative">
            <select 
              value={user2Name}
              onChange={(e) => setUser2Name(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 appearance-none focus:ring-2 focus:ring-red-500 focus:outline-none text-slate-700 font-bold shadow-sm pr-10"
            >
              {AVAILABLE_USERS.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User 1 Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
            <div className="w-20 h-20 bg-indigo-100 rounded-full mx-auto flex items-center justify-center text-indigo-600 text-3xl font-bold mb-4">
                {user1Name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-slate-800">{user1Name}</h3>
            <div className="mt-4 space-y-2">
                <div className="flex justify-between px-4 py-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-500 text-sm">Rating</span>
                    <span className="font-bold text-slate-800">{user1Data.rating}</span>
                </div>
                <div className="flex justify-between px-4 py-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-500 text-sm">Solved</span>
                    <span className="font-bold text-slate-800">{user1Data.solvedCount}</span>
                </div>
            </div>
        </div>

        {/* VS Chart */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 h-80 relative flex items-center justify-center">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-100 text-slate-400 font-black px-4 py-1 rounded-full text-[10px] z-10 uppercase tracking-widest">
                Data Overlay
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={comparisonData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="topic" fontSize={10} fontWeight="bold" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                    <Radar name={user1Name} dataKey={user1Name} stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                    <Radar name={user2Name} dataKey={user2Name} stroke="#ef4444" fill="#ef4444" fillOpacity={0.4} />
                    <Legend />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                </RadarChart>
            </ResponsiveContainer>
        </div>

        {/* User 2 Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            <div className="w-20 h-20 bg-red-100 rounded-full mx-auto flex items-center justify-center text-red-600 text-3xl font-bold mb-4">
                {user2Name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-slate-800">{user2Name}</h3>
            <div className="mt-4 space-y-2">
                <div className="flex justify-between px-4 py-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-500 text-sm">Rating</span>
                    <span className="font-bold text-slate-800">{user2Data.rating}</span>
                </div>
                <div className="flex justify-between px-4 py-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-500 text-sm">Solved</span>
                    <span className="font-bold text-slate-800">{user2Data.solvedCount}</span>
                </div>
            </div>
        </div>
      </div>
      
      {/* Comparison Insight */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
          <TrendingUp size={24} />
        </div>
        <div>
            <h4 className="font-bold text-slate-800 text-lg">Battle Insight</h4>
            <p className="text-slate-600 mt-1 leading-relaxed">
              Based on the latest database update: <span className="font-bold text-indigo-600">{getLeader()}</span> is currently performing better in the global rankings. 
              While <span className="font-bold">{user1Name}</span> shows significant mastery in <span className="text-indigo-600">Math</span>, 
              <span className="font-bold"> {user2Name}</span> tends to outpace them in <span className="text-red-500">Graph Theory</span> challenges.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Rivalry;