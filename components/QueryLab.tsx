import React, { useState } from 'react';
import { Database, Play, Code, Table as TableIcon, Info, Sparkles, Terminal, Download, FileJson } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface QueryResult {
  columns: string[];
  rows: any[];
  sql: string;
  explanation: string;
}

const PRESET_QUERIES: Record<string, QueryResult> = {
  'consistent_performers': {
    sql: `SELECT u.username, COUNT(DISTINCT s.problemId) as unique_solves, AVG(s.runtime) as avg_runtime
FROM Users u
JOIN Submissions s ON u.id = s.userId
WHERE s.verdict = 'AC'
GROUP BY u.id
HAVING COUNT(DISTINCT s.problemId) > 5
ORDER BY avg_runtime ASC;`,
    explanation: "Finds users who have solved more than 5 distinct problems, ranked by their average execution efficiency (runtime).",
    columns: ['Username', 'Unique Solves', 'Avg Runtime (ms)'],
    rows: [
      ['AlgoMaster_99', 12, 45.2],
      ['CoderX', 8, 52.1],
      ['SevenK', 15, 58.5],
    ]
  },
  'topic_bottlenecks': {
    sql: `SELECT p.topic, s.failedTestCase, COUNT(*) as failure_count
FROM Problems p
JOIN Submissions s ON p.id = s.problemId
WHERE s.verdict = 'WA'
GROUP BY p.topic, s.failedTestCase
ORDER BY failure_count DESC
LIMIT 5;`,
    explanation: "Identifies which topics and specific test cases are causing the most failures across the entire platform.",
    columns: ['Topic', 'Failed TC #', 'Failure Count'],
    rows: [
      ['Graph', 4, 125],
      ['DP', 12, 89],
      ['Math', 2, 76],
      ['Strings', 7, 45],
      ['Graph', 1, 32],
    ]
  },
  'uni_power_ranking': {
    sql: `WITH UniStats AS (
  SELECT university, AVG(rating) as avg_rating, COUNT(*) as user_count
  FROM Users
  GROUP BY university
)
SELECT university, avg_rating
FROM UniStats
WHERE user_count >= 5
ORDER BY avg_rating DESC;`,
    explanation: "Complex SQL using Common Table Expressions (CTE) to rank universities by average rating.",
    columns: ['University', 'Avg Rating'],
    rows: [
      ['National Institute', 1620.5],
      ['Tech University of Science', 1450.0],
      ['State College of Engineering', 1380.2],
    ]
  }
};

const QueryLab: React.FC = () => {
  const [activeQueryKey, setActiveQueryKey] = useState<string>('consistent_performers');
  const [isExecuting, setIsExecuting] = useState(false);
  const [customSql, setCustomSql] = useState<string>('SELECT * FROM Users WHERE rating > 1400 LIMIT 10;');
  const [customResult, setCustomResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentQuery = activeQueryKey === 'custom' 
    ? (customResult || { sql: customSql, explanation: 'Your custom SQL query results.', columns: [], rows: [] })
    : PRESET_QUERIES[activeQueryKey];

  const handleRun = async () => {
    setIsExecuting(true);
    setError(null);

    if (activeQueryKey !== 'custom') {
      setTimeout(() => setIsExecuting(false), 600);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `You are a SQL engine for a competitive programming platform database. 
        The schema is:
        - Users (id, username, rating, university, solvedCount, rank)
        - Problems (id, title, topic, difficulty, solvedBy, tags)
        - Submissions (id, problemId, userId, verdict [AC, WA, TLE, RE], timestamp, runtime, memory, language, failedTestCase)
        - TopicStats (topic, solved, total, weaknessScore)
        
        Execute this SQL query and return the result in JSON format:
        SQL: ${customSql}
        
        Return ONLY a JSON object with this structure:
        {
          "columns": ["Col1", "Col2", ...],
          "rows": [ ["Row1Val1", "Row1Val2"], ["Row2Val1", "Row2Val2"] ],
          "explanation": "Brief technical explanation of how this query was processed."
        }`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              columns: { type: Type.ARRAY, items: { type: Type.STRING } },
              rows: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.STRING } } },
              explanation: { type: Type.STRING }
            },
            required: ["columns", "rows", "explanation"]
          }
        },
      });

      const result = JSON.parse(response.text);
      setCustomResult({
        ...result,
        sql: customSql
      });
    } catch (err) {
      console.error(err);
      setError("Failed to execute custom query. Ensure your SQL is valid for the described schema.");
    } finally {
      setIsExecuting(false);
    }
  };

  const downloadSql = () => {
    fetch('/schema.sql')
      .then(res => res.text())
      .then(text => {
        const blob = new Blob([text], { type: 'text/sql' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'schema.sql';
        a.click();
      })
      .catch(err => {
        // Fallback if file fetch fails
        alert("SQL File created manually for this project. Check schema.sql in the project root.");
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Database className="text-indigo-600" /> DBMS Query Lab
          </h2>
          <p className="text-slate-500">Solve complex SQL problems and verify database connectivity.</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm overflow-x-auto max-w-full">
          {Object.keys(PRESET_QUERIES).map((key) => (
            <button
              key={key}
              onClick={() => setActiveQueryKey(key)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                activeQueryKey === key 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {key.replace(/_/g, ' ').toUpperCase()}
            </button>
          ))}
          <button
            onClick={() => setActiveQueryKey('custom')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
              activeQueryKey === 'custom' 
              ? 'bg-purple-600 text-white' 
              : 'text-purple-600 hover:bg-purple-50'
            }`}
          >
            <Terminal size={14} /> CUSTOM
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SQL Editor Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
              <div className="flex items-center gap-2 text-slate-300 text-xs font-mono">
                <Code size={14} /> query.sql
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={downloadSql}
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded text-xs font-bold transition-colors"
                  title="Download Project Schema"
                >
                  <Download size={12} /> SQL SCHEMA
                </button>
                <button 
                  onClick={handleRun}
                  disabled={isExecuting}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-bold transition-colors disabled:opacity-50 ${
                    activeQueryKey === 'custom' ? 'bg-purple-600 hover:bg-purple-500' : 'bg-emerald-600 hover:bg-emerald-500'
                  } text-white`}
                >
                  {isExecuting ? 'EXECUTING...' : <><Play size={12} fill="currentColor" /> RUN QUERY</>}
                </button>
              </div>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto min-h-[200px]">
              {activeQueryKey === 'custom' ? (
                <textarea
                  value={customSql}
                  onChange={(e) => setCustomSql(e.target.value)}
                  className="w-full h-full min-h-[160px] bg-transparent text-indigo-300 outline-none resize-none spellcheck-false"
                  placeholder="Enter your SQL here..."
                />
              ) : (
                <pre className="text-indigo-300">
                  {currentQuery.sql.split('\n').map((line, i) => (
                    <div key={i} className="flex">
                      <span className="w-8 text-slate-600 select-none">{i + 1}</span>
                      <span className="text-slate-100">{line}</span>
                    </div>
                  ))}
                </pre>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Info size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Query Logic</h4>
              <p className="text-slate-600 text-sm mt-1">
                {activeQueryKey === 'custom' && !customResult 
                  ? "Write an SQL query above and click RUN to simulate a database response." 
                  : currentQuery.explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[300px]">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                <TableIcon size={16} /> Result Set
              </h3>
              <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase font-bold">
                {currentQuery.rows.length} rows
              </span>
            </div>
            <div className="overflow-x-auto">
              {isExecuting ? (
                <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-3">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-medium">Fetching from Database...</span>
                </div>
              ) : currentQuery.columns.length > 0 ? (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                    <tr>
                      {currentQuery.columns.map((col, i) => (
                        <th key={i} className="px-4 py-3 whitespace-nowrap">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {currentQuery.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        {row.map((cell: any, j: number) => (
                          <td key={j} className="px-4 py-3 text-slate-700 font-medium whitespace-nowrap">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center text-slate-400">
                  <Terminal size={32} className="mx-auto mb-2 opacity-20" />
                  <p className="text-xs">Execute a query to see results.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-indigo-600 rounded-xl p-5 text-white shadow-md">
            <h3 className="font-bold flex items-center gap-2 mb-2">
              <Sparkles size={18} /> DB Optimization Tip
            </h3>
            <p className="text-xs text-indigo-100 leading-relaxed">
              When using <strong>JOINs</strong>, ensure you are joining on primary keys. 
              Our schema uses <code>id</code> for primary entities and <code>userId</code> / <code>problemId</code> for foreign keys.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryLab;