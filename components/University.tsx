import React, { useState } from 'react';
import { MOCK_UNI_STATS } from '../services/mockDb';
import { School, Users, Award, PieChart as PieIcon, ChevronDown, Target, Zap, Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const University: React.FC = () => {
  const data = MOCK_UNI_STATS;
  const [selectedUniName, setSelectedUniName] = useState(data[0].name);

  const selectedUni = data.find(u => u.name === selectedUniName) || data[0];

  // Fake data for the pie chart
  const errorData = [
    { name: 'Wrong Answer', value: 45 },
    { name: 'Time Limit', value: 30 },
    { name: 'Runtime Error', value: 15 },
    { name: 'Compilation Error', value: 10 },
  ];
  const COLORS = ['#ef4444', '#f59e0b', '#8b5cf6', '#64748b'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <School className="text-indigo-600" /> University Dashboard
          </h2>
          <p className="text-slate-500">Institutional performance analytics & rankings</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <label className="text-[10px] uppercase font-bold text-slate-400 absolute -top-2 left-3 bg-white px-1 z-10">Select Institution</label>
          <div className="relative">
            <select 
              value={selectedUniName}
              onChange={(e) => setSelectedUniName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 appearance-none focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700 font-bold pr-10"
            >
              {data.map(uni => (
                <option key={uni.name} value={uni.name}>{uni.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
          </div>
        </div>
      </div>

      {/* Selected University Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg md:col-span-2">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <School size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold leading-tight">{selectedUni.name}</h3>
              <p className="text-indigo-200 text-xs font-medium">Verified Institution</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <p className="text-[10px] text-indigo-200 font-bold uppercase">Total Solves</p>
              <p className="text-2xl font-black">{selectedUni.totalSolves.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <p className="text-[10px] text-indigo-200 font-bold uppercase">Active Rank</p>
              <p className="text-2xl font-black">Top 15%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-bold uppercase mb-4 flex items-center gap-2">
            <Users size={14} /> Global Participants
          </div>
          <p className="text-3xl font-black text-slate-800">{selectedUni.activeUsers}</p>
          <p className="text-xs text-slate-400 mt-2">Competitive members currently active in contests.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-bold uppercase mb-4 flex items-center gap-2">
            <Award size={14} className="text-yellow-500" /> Top Performer
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600 font-bold">
              {selectedUni.topPerformer.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{selectedUni.topPerformer}</p>
              <p className="text-[10px] text-slate-400 font-medium">Grandmaster Class</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Main University Table */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Globe size={20} className="text-indigo-600"/> National Rankings
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">University Name</th>
                            <th className="px-6 py-4 text-right">Total Solves</th>
                            <th className="px-6 py-4 text-right">Active Users</th>
                            <th className="px-6 py-4">Top Performer</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((uni, idx) => (
                            <tr key={idx} className={`hover:bg-slate-50 transition-colors ${uni.name === selectedUniName ? 'bg-indigo-50/50 ring-1 ring-inset ring-indigo-100' : ''}`}>
                                <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
                                  {uni.name === selectedUniName && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></div>}
                                  {uni.name}
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-indigo-600 font-bold">{uni.totalSolves}</td>
                                <td className="px-6 py-4 text-right text-slate-600">{uni.activeUsers}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${uni.name === selectedUniName ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}>
                                        <Award size={10} className="mr-1" /> {uni.topPerformer}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Comparative Charts */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Target size={18} className="text-indigo-600" /> Solves Comparison
              </h3>
              <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-bold uppercase">Volume Analysis</span>
            </div>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 40, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 9, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="totalSolves" radius={[0, 4, 4, 0]} barSize={24}>
                          {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.name === selectedUniName ? '#4f46e5' : '#e2e8f0'} />
                          ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Local Mistake Analysis */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2">
                <PieIcon size={20} className="text-red-500" /> Institutional Mistake Log
            </h3>
            <p className="text-xs text-slate-500 mb-6">Error distribution patterns specific to students from {selectedUniName}.</p>
            <div className="flex flex-col sm:flex-row items-center">
                <div className="h-64 w-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={errorData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                animationDuration={1000}
                            >
                                {errorData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-6 space-y-3 flex-1 w-full">
                    {errorData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                            <span className="text-xs font-medium text-slate-600">{item.name}</span>
                            <span className="text-xs font-black text-slate-800 ml-auto">{item.value}%</span>
                        </div>
                    ))}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                       <p className="text-[10px] text-slate-400 italic flex items-center gap-1">
                         <Zap size={10} /> Trends updated in real-time.
                       </p>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default University;