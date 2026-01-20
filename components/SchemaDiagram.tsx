import React from 'react';
import { ArrowLeft, Database, Key, Link as LinkIcon } from 'lucide-react';

interface SchemaDiagramProps {
  onBack: () => void;
}

const SchemaDiagram: React.FC<SchemaDiagramProps> = ({ onBack }) => {
  const tables = [
    {
      name: 'Users',
      color: 'bg-indigo-600',
      fields: [
        { name: 'id', type: 'VARCHAR(50)', pk: true },
        { name: 'username', type: 'VARCHAR(100)', unique: true },
        { name: 'rating', type: 'INTEGER' },
        { name: 'university', type: 'VARCHAR(255)', fk: 'Universities.name' },
        { name: 'solvedCount', type: 'INTEGER' },
        { name: 'rank', type: 'VARCHAR(50)' },
      ]
    },
    {
      name: 'UserCredentials',
      color: 'bg-slate-800',
      fields: [
        { name: 'id', type: 'VARCHAR(50)', pk: true },
        { name: 'username', type: 'VARCHAR(100)', fk: 'Users.username' },
        { name: 'email', type: 'VARCHAR(255)', unique: true },
        { name: 'role', type: 'VARCHAR(20)' },
        { name: 'lastLogin', type: 'DATETIME' },
        { name: 'status', type: 'VARCHAR(20)' },
      ]
    },
    {
      name: 'Problems',
      color: 'bg-emerald-600',
      fields: [
        { name: 'id', type: 'VARCHAR(50)', pk: true },
        { name: 'title', type: 'VARCHAR(255)' },
        { name: 'topic', type: 'VARCHAR(100)' },
        { name: 'difficulty', type: 'VARCHAR(50)' },
        { name: 'solvedBy', type: 'INTEGER' },
        { name: 'tags', type: 'TEXT' },
      ]
    },
    {
      name: 'Submissions',
      color: 'bg-rose-600',
      fields: [
        { name: 'id', type: 'VARCHAR(50)', pk: true },
        { name: 'problemId', type: 'VARCHAR(50)', fk: 'Problems.id' },
        { name: 'userId', type: 'VARCHAR(50)', fk: 'Users.id' },
        { name: 'verdict', type: 'VARCHAR(10)' },
        { name: 'timestamp', type: 'DATETIME' },
        { name: 'runtime', type: 'INTEGER' },
        { name: 'memory', type: 'INTEGER' },
        { name: 'language', type: 'VARCHAR(50)' },
        { name: 'failedTestCase', type: 'INTEGER' },
      ]
    },
    {
      name: 'Universities',
      color: 'bg-amber-600',
      fields: [
        { name: 'name', type: 'VARCHAR(255)', pk: true },
        { name: 'totalSolves', type: 'INTEGER' },
        { name: 'activeUsers', type: 'INTEGER' },
        { name: 'topPerformer', type: 'VARCHAR(100)' },
      ]
    },
    {
      name: 'TopicStats',
      color: 'bg-purple-600',
      fields: [
        { name: 'topic', type: 'VARCHAR(100)', pk: true },
        { name: 'solved', type: 'INTEGER' },
        { name: 'total', type: 'INTEGER' },
        { name: 'weaknessScore', type: 'INTEGER' },
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-bold transition-colors group"
        >
          <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-indigo-50">
            <ArrowLeft size={20} />
          </div>
          BACK TO DOCUMENTATION
        </button>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <Database className="text-indigo-600" size={20} />
          <h2 className="font-black text-slate-800 tracking-tight">ENTITY RELATIONSHIP DIAGRAM</h2>
        </div>
      </div>

      <div className="relative p-8 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 min-h-[800px] overflow-x-auto">
        {/* Background Grid Decoration */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
          {tables.map((table) => (
            <div key={table.name} className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col min-w-[280px] transform hover:scale-[1.02] transition-transform">
              <div className={`${table.color} p-3 text-white flex items-center justify-between`}>
                <span className="font-black tracking-wider text-sm">{table.name}</span>
                <Database size={16} className="opacity-50" />
              </div>
              <div className="p-0">
                {table.fields.map((field, idx) => (
                  <div key={idx} className={`px-4 py-2 flex items-center justify-between border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors`}>
                    <div className="flex items-center gap-2">
                      {field.pk && <Key size={12} className="text-amber-500" title="Primary Key" />}
                      {field.fk && <LinkIcon size={12} className="text-indigo-400" title={`Foreign Key to ${field.fk}`} />}
                      <span className={`text-xs font-bold ${field.pk ? 'text-slate-900' : 'text-slate-700'}`}>
                        {field.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{field.type}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-12 flex flex-wrap gap-6 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200 inline-block">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <Key size={14} className="text-amber-500" /> PRIMARY KEY (PK)
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <LinkIcon size={14} className="text-indigo-400" /> FOREIGN KEY (FK)
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <div className="w-3 h-3 rounded-full bg-slate-300"></div> FIELD TYPE
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-2">Relationship Summary</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
            <span><strong>UserCredentials (username)</strong> links to <strong>Users (username)</strong> [One-to-One]</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
            <span><strong>Submissions (userId)</strong> links to <strong>Users (id)</strong> [Many-to-One]</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
            <span><strong>Users (university)</strong> links to <strong>Universities (name)</strong> [Many-to-One]</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
            <span><strong>Problems (topic)</strong> relates to <strong>TopicStats (topic)</strong> [One-to-One Context]</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SchemaDiagram;