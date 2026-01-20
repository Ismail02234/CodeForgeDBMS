import React from 'react';
import { BookOpen, Database, Zap, Cpu, Swords, BarChart3, Terminal, ShieldCheck, Share2 } from 'lucide-react';

interface HowItWorksProps {
  onViewSchema: () => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onViewSchema }) => {
  const sections = [
    {
      title: 'Database Engine & Schema',
      icon: <Database className="text-indigo-600" />,
      description: 'The foundation of the platform is a relational database schema designed for high-performance CP tracking.',
      details: [
        'Relational Mapping: Tracks Users, Problems, Submissions, and Contests with strict Foreign Key constraints.',
        'Normalization: University and Topic data are normalized to reduce redundancy and enable global aggregate queries.',
        'Mock Implementation: Currently powered by an ESM module that simulates SQL state transitions and data persistence.'
      ]
    },
    {
      title: 'AI Code Judge (Gemini 3 Pro)',
      icon: <Cpu className="text-emerald-600" />,
      description: 'The system uses Gemini 3 Pro to simulate a real-time Linux-based judge environment.',
      details: [
        'Multi-Language Support: Specific syntax checking for C (GCC 11), C++ (C++20), and Python 3.',
        'Simulation Logic: Gemini parses the code, identifies algorithmic complexity, and generates 5 deterministic test cases based on the problem description.',
        'Verdict Mapping: AI logic determines if the code produces the correct output, exceeds time limits (TLE), or causes memory overflows.'
      ]
    },
    {
      title: 'Smart Recommendation Engine',
      icon: <Zap className="text-yellow-500" />,
      description: 'A custom algorithm analyzes user weaknesses to suggest the most effective practice problems.',
      details: [
        'Weakness Scoring: The system calculates a Weakness Score (0-100) per topic based on the Ratio of (Wrong Submissions + TLE) / Total Attempts.',
        'Difficulty Auto-Adjustment: Problems solved by a high percentage of the community are dynamically downgraded in perceived difficulty.',
        'Adaptive Filtering: Recommendations prioritize EASY problems for high-weakness topics to rebuild fundamentals.'
      ]
    },
    {
      title: 'Head-to-Head Battle Arena',
      icon: <Swords className="text-red-500" />,
      description: 'A real-time simulation of competitive pressure and speed-coding.',
      details: [
        'Opponent Simulation: Uses a "Random Walk" algorithm where the rival progress (0-100%) increases by a variable delta every second.',
        'Victory Conditions: Success is determined by the intersection of user submission correctness (via AI Judge) and the rival completion state.',
        'Live Leaderboards: Aggregates real-time solve durations across the active session.'
      ]
    },
    {
      title: 'University Analytics',
      icon: <BarChart3 className="text-purple-600" />,
      description: 'Institutional performance is derived from complex aggregations of individual user records.',
      details: [
        'Error Distribution: Aggregates the `failedTestCase` attribute across all university members to identify common pitfalls (Mistake Log).',
        'Solve Volume: Tracks total institutional impact via a horizontal solve comparison chart.',
        'Top Performer Logic: Dynamically calculates the user with the highest rating-to-solve ratio within each specific organization.'
      ]
    },
    {
      title: 'SQL Lab & LLM Integration',
      icon: <Terminal className="text-slate-700" />,
      description: 'Allows users to interact directly with the schema using natural language or raw SQL.',
      details: [
        'Context Injection: The Gemini model is provided with the full SQL schema as system instructions for every custom query.',
        'Execution Simulation: The LLM acts as a virtual SQLite engine, interpreting the query and returning structured JSON row/column data.',
        'Explanation Engine: Provides a natural language breakdown of the SQL execution plan.'
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="text-indigo-600" size={32} />
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Technical Architecture</h1>
        </div>
        <p className="text-slate-600 leading-relaxed max-w-3xl">
          Welcome to the CodeForge DBMS Project Documentation. This section provides a look under the hood 
          at how we integrate standard relational database principles with modern LLM capabilities to create 
          a next-generation competitive programming platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-50 rounded-lg group-hover:scale-110 transition-transform">
                {section.icon}
              </div>
              <h3 className="font-bold text-lg text-slate-800">{section.title}</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4 font-medium">
              {section.description}
            </p>
            <div className="space-y-3">
              {section.details.map((detail, dIdx) => (
                <div key={dIdx} className="flex items-start gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></div>
                  <p className="text-xs text-slate-600 leading-relaxed">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-indigo-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <ShieldCheck size={20} className="text-indigo-300" /> System Integrity
          </h3>
          <p className="text-indigo-200 text-sm max-w-lg">
            This project follows strict DBMS guidelines. All simulations are designed to mimic real-world ACID properties 
            while leveraging AI to provide dynamic, adaptive content that traditional static databases cannot offer.
          </p>
        </div>
        <div className="flex gap-4 relative z-10">
           <button 
             onClick={() => window.alert("Sharing not implemented in mock environment.")}
             className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
           >
             <Share2 size={14} /> SHARE REPORT
           </button>
           <button 
             onClick={onViewSchema}
             className="bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded-lg text-xs font-bold transition-all"
           >
             VIEW FULL SCHEMA
           </button>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
          <Database size={200} />
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;