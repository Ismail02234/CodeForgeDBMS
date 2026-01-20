import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';
import { User, TopicStat } from '../types';
import { MOCK_TOPIC_STATS, getUserStatsForRadar, MOCK_SUBMISSIONS } from '../services/mockDb';
import { Clock, AlertTriangle, Activity, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  user: User;
}

// Activity data for Heatmap simulation (Last 7 days)
const activityData = [
  { day: 'Mon', submissions: 12 },
  { day: 'Tue', submissions: 5 },
  { day: 'Wed', submissions: 18 },
  { day: 'Thu', submissions: 8 },
  { day: 'Fri', submissions: 25 }, // High activity
  { day: 'Sat', submissions: 4 },
  { day: 'Sun', submissions: 10 },
];

const timeAnalysisData = [
  { time: '00-04', count: 2 },
  { time: '04-08', count: 0 },
  { time: '08-12', count: 15 },
  { time: '12-16', count: 45 }, // Peak time
  { time: '16-20', count: 30 },
  { time: '20-24', count: 12 },
];

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const radarData = getUserStatsForRadar();

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 col-span-1 md:col-span-4 lg:col-span-1">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-2xl">
              {user.username.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{user.username}</h2>
              <p className="text-slate-500 text-sm">{user.university}</p>
              <span className="inline-block px-2 py-0.5 mt-2 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                {user.rank}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
            <div className="text-slate-500 text-sm font-medium flex items-center gap-2">
                <Activity size={16} /> Total Solved
            </div>
            <div className="text-3xl font-bold text-slate-800 mt-1">{user.solvedCount}</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
             <div className="text-slate-500 text-sm font-medium flex items-center gap-2">
                <CheckCircle2 size={16} /> Global Rating
            </div>
            <div className="text-3xl font-bold text-indigo-600 mt-1">{user.rating}</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
            <div className="text-slate-500 text-sm font-medium flex items-center gap-2">
                <AlertTriangle size={16} /> Weakest Topic
            </div>
            <div className="text-3xl font-bold text-red-500 mt-1">Graph</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Weakness Analyzer */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="text-indigo-500" /> Topic Proficiency
          </h3>
          <p className="text-slate-500 text-sm mb-4">
             Database analysis of your acceptance rate per topic. Lower score indicates weakness.
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="topic" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Proficiency"
                  dataKey="value"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Submission Time Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Clock className="text-indigo-500" /> Submission Time Analysis
          </h3>
          <p className="text-slate-500 text-sm mb-4">
             Your most active hours based on submission timestamps.
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeAnalysisData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Submission Heatmap */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
         <h3 className="text-lg font-bold text-slate-800 mb-6">Activity Heatmap (Last 7 Days)</h3>
         <div className="flex items-end justify-between h-32 gap-2">
            {activityData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div 
                        className="w-full bg-indigo-500 rounded-t-sm transition-all duration-500 relative group-hover:bg-indigo-600"
                        style={{ height: `${(d.submissions / 25) * 100}%` }}
                    >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {d.submissions}
                        </div>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{d.day}</span>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;