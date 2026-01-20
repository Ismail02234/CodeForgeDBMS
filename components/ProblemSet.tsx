import React, { useState } from 'react';
import { MOCK_PROBLEMS, getRecommendedProblems, MOCK_TOPIC_STATS, PROBLEM_DESCRIPTIONS } from '../services/mockDb';
import { Difficulty, Problem } from '../types';
import { Filter, Star, Zap, BarChart, Code, Play, CheckCircle, XCircle, AlertCircle, Cpu, Layers, Terminal } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface TestCaseResult {
  id: number;
  status: 'passed' | 'failed' | 'error';
  input: string;
  expected: string;
  actual: string;
  description: string;
  score: number;
}

interface JudgeVerdict {
  status: 'AC' | 'WA' | 'TLE' | 'RE' | 'CE';
  totalScore: number;
  maxScore: number;
  memoryUsage: string;
  runtime: string;
  errorLine?: number;
  errorMessage?: string;
  testCases: TestCaseResult[];
}

const ProblemSet: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<'python' | 'c' | 'cpp'>('python');
  const [isJudging, setIsJudging] = useState(false);
  const [verdict, setVerdict] = useState<JudgeVerdict | null>(null);

  const recommendations = getRecommendedProblems(MOCK_TOPIC_STATS);

  const getDifficultyColor = (diff: Difficulty) => {
    switch(diff) {
        case Difficulty.EASY: return 'bg-green-100 text-green-700 border-green-200';
        case Difficulty.MEDIUM: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case Difficulty.HARD: return 'bg-orange-100 text-orange-700 border-orange-200';
        case Difficulty.EXPERT: return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const filteredProblems = filter === 'All' 
    ? MOCK_PROBLEMS 
    : MOCK_PROBLEMS.filter(p => p.topic === filter || (filter === 'Basics' && p.topic === 'Basics'));

  const handleRunJudge = async () => {
    if (!selectedProblem || !code.trim()) return;

    setIsJudging(true);
    setVerdict(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are an Online Judge for a Competitive Programming platform. 
        Problem: ${selectedProblem.title}
        Description: ${PROBLEM_DESCRIPTIONS[selectedProblem.id]}
        
        Selected Language: ${language.toUpperCase()}
        Input Code: 
        \`\`\`${language}
        ${code}
        \`\`\`
        
        Evaluation Tasks:
        1. Parse the ${language} code carefully. Check for common syntax errors, missing semicolons (if C/C++), or indentation issues (if Python).
        2. Clean the code mentally.
        3. Check if the code would correctly handle input/output formats (using stdin/stdout).
        4. Simulate running the code against 5 test cases.
        5. For float problems, allow tolerance < 1e-6.
        6. Calculate memory usage (simulated, max 256MB) and runtime (max 2s). C/C++ should typically be faster than Python.
        7. Identify if there's a specific line of error.
        
        Return a JSON response matching this schema:
        {
          "status": "AC" | "WA" | "TLE" | "RE" | "CE",
          "totalScore": number,
          "maxScore": 100,
          "memoryUsage": "string (e.g. 15.4 MB)",
          "runtime": "string (e.g. 120 ms)",
          "errorLine": number (optional),
          "errorMessage": "string (optional description of error)",
          "testCases": [
            {
              "id": 1,
              "status": "passed" | "failed",
              "input": "string",
              "expected": "string",
              "actual": "string",
              "description": "Short explanation of what this test case represents",
              "score": 20
            }
          ]
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING },
              totalScore: { type: Type.NUMBER },
              maxScore: { type: Type.NUMBER },
              memoryUsage: { type: Type.STRING },
              runtime: { type: Type.STRING },
              errorLine: { type: Type.NUMBER },
              errorMessage: { type: Type.STRING },
              testCases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.NUMBER },
                    status: { type: Type.STRING },
                    input: { type: Type.STRING },
                    expected: { type: Type.STRING },
                    actual: { type: Type.STRING },
                    description: { type: Type.STRING },
                    score: { type: Type.NUMBER }
                  },
                  required: ["id", "status", "input", "expected", "actual", "description", "score"]
                }
              }
            },
            required: ["status", "totalScore", "maxScore", "memoryUsage", "runtime", "testCases"]
          }
        }
      });

      const result = JSON.parse(response.text);
      setVerdict(result);
    } catch (err) {
      console.error(err);
      alert("Judge simulation failed. Check console for details.");
    } finally {
      setIsJudging(false);
    }
  };

  if (selectedProblem) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => { setSelectedProblem(null); setVerdict(null); setCode(''); }}
          className="text-indigo-600 font-medium flex items-center gap-1 hover:underline"
        >
          &larr; Back to Problem Set
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Statement */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-800">{selectedProblem.title}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(selectedProblem.difficulty)}`}>
                {selectedProblem.difficulty}
              </span>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed mb-4">
                {PROBLEM_DESCRIPTIONS[selectedProblem.id] || "No description available for this problem yet."}
              </p>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4">
                <h4 className="text-sm font-bold text-slate-700 uppercase mb-2">Specifications</h4>
                <ul className="text-xs text-slate-500 space-y-1 list-disc ml-4">
                  <li>Memory Limit: 256 MB</li>
                  <li>Time Limit: 2.0 Seconds</li>
                  <li>Tolerance for Float: 1e-6</li>
                </ul>
              </div>
            </div>

            {verdict && (
              <div className={`mt-6 p-5 rounded-xl border ${verdict.status === 'AC' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {verdict.status === 'AC' ? <CheckCircle className="text-emerald-600" size={32} /> : <XCircle className="text-red-600" size={32} />}
                    <div>
                      <h3 className={`text-xl font-black ${verdict.status === 'AC' ? 'text-emerald-700' : 'text-red-700'}`}>
                        {verdict.status}
                      </h3>
                      <p className="text-xs text-slate-500">Score: {verdict.totalScore} / {verdict.maxScore}</p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-500 space-y-1">
                    <div className="flex items-center justify-end gap-1"><Cpu size={12}/> {verdict.memoryUsage}</div>
                    <div className="flex items-center justify-end gap-1"><Layers size={12}/> {verdict.runtime}</div>
                  </div>
                </div>

                {verdict.errorMessage && (
                  <div className="bg-white/50 p-3 rounded-lg border border-red-100 mb-4 text-sm text-red-800">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle size={14} /> <strong>Error Info:</strong>
                    </div>
                    {verdict.errorLine && <p>Line {verdict.errorLine}: {verdict.errorMessage}</p>}
                    {!verdict.errorLine && <p>{verdict.errorMessage}</p>}
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Test Case Breakdown</h4>
                  <div className="grid grid-cols-5 gap-1">
                    {verdict.testCases.map((tc) => (
                      <div 
                        key={tc.id} 
                        className={`h-2 rounded ${tc.status === 'passed' ? 'bg-emerald-500' : 'bg-red-500'}`}
                        title={tc.description}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Editor */}
          <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800 flex flex-col">
            <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-slate-300 text-xs font-mono">
                  <Code size={14} /> solution.{language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : 'c'}
                </div>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="python">Python 3</option>
                  <option value="c">C (GCC 11)</option>
                  <option value="cpp">C++ 20</option>
                </select>
              </div>
              <button 
                onClick={handleRunJudge}
                disabled={isJudging}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isJudging ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Play size={12} fill="currentColor" />}
                JUDGE CODE
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={
                language === 'python' 
                ? "# Write your Python solution here\nimport sys\nfor line in sys.stdin:\n    # Solve..." 
                : language === 'cpp'
                ? "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Solve...\n    return 0;\n}"
                : "#include <stdio.h>\n\nint main() {\n    // Solve...\n    return 0;\n}"
              }
              className="flex-grow bg-transparent p-6 font-mono text-sm text-indigo-300 outline-none resize-none spellcheck-false placeholder:text-slate-600 min-h-[400px]"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Smart Recommendations */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
            <Zap className="text-yellow-300" />
            <h2 className="text-2xl font-bold">Recommended for You</h2>
        </div>
        <p className="mb-6 text-indigo-100 max-w-2xl">
            Based on your recent activity, our database engine has selected these practice problems for you.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map(prob => (
                <div 
                  key={prob.id} 
                  onClick={() => setSelectedProblem(prob)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-bold">{prob.title}</span>
                        <span className="text-xs px-2 py-1 bg-white/20 rounded">{prob.difficulty}</span>
                    </div>
                    <div className="flex gap-2">
                        {prob.tags.map(tag => (
                            <span key={tag} className="text-xs text-indigo-100 opacity-80">#{tag}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Main Problem Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ListIcon /> Problem Set
            </h3>
            
            <div className="flex items-center gap-2">
                <Filter size={16} className="text-slate-400" />
                <select 
                    className="border-slate-200 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 bg-slate-50"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="All">All Topics</option>
                    <option value="Basics">Simple Basics</option>
                    <option value="DP">Dynamic Programming</option>
                    <option value="Graph">Graph Theory</option>
                    <option value="Math">Math</option>
                    <option value="Strings">Strings</option>
                </select>
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                    <tr>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Problem</th>
                        <th className="px-6 py-4">Tags</th>
                        <th className="px-6 py-4">Difficulty</th>
                        <th className="px-6 py-4 text-right">Solved By</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredProblems.map(prob => (
                        <tr 
                          key={prob.id} 
                          className="hover:bg-slate-50 transition-colors cursor-pointer group"
                          onClick={() => setSelectedProblem(prob)}
                        >
                            <td className="px-6 py-4">
                                <div className="w-5 h-5 rounded-full border-2 border-slate-200 group-hover:border-indigo-300"></div>
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-800">
                                <div className="group-hover:text-indigo-600 group-hover:underline">{prob.title}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-1 flex-wrap">
                                    {prob.tags.map(tag => (
                                        <span key={tag} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(prob.difficulty)}`}>
                                    <BarChart size={12} />
                                    {prob.difficulty}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right text-slate-500 flex items-center justify-end gap-1">
                                <Star size={14} className="text-slate-400" /> {prob.solvedBy}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

// Helper icon
const ListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
)

export default ProblemSet;