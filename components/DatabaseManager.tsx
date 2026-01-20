import React, { useState, useEffect } from 'react';
import { Database, Server, Shield, Key, Search, UserPlus, RefreshCw, CheckCircle2, XCircle, Terminal, HardDrive, Trash2, HelpCircle, Info, Radio } from 'lucide-react';
import { DbConnection, UserCredential } from '../types';
import { GoogleGenAI } from "@google/genai";

const MOCK_CREDENTIALS: UserCredential[] = [
  { id: '1', username: 'AlgoMaster_99', email: 'algo@codeforge.edu', role: 'Admin', lastLogin: '2023-11-20 14:30', status: 'Active' },
  { id: '2', username: 'CoderX', email: 'coderx@state.edu', role: 'User', lastLogin: '2023-11-21 09:12', status: 'Active' },
  { id: '3', username: 'SevenK', email: 'sevenk@national.inst', role: 'Judge', lastLogin: '2023-11-19 22:45', status: 'Active' },
];

const DatabaseManager: React.FC = () => {
  const [connection, setConnection] = useState<DbConnection>({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'codeforge_db',
    ssl: true,
    isConnected: false
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [credentials, setCredentials] = useState<UserCredential[]>(MOCK_CREDENTIALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newCred, setNewCred] = useState({ username: '', email: '', role: 'User' as const });
  const [log, setLog] = useState<string[]>(['[SYSTEM] Waiting for MySQL handshake...']);

  const addLog = (msg: string) => setLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));

  const handleConnect = async () => {
    setIsConnecting(true);
    const protocol = connection.port === 33060 ? 'X Protocol v2.0' : 'Protocol v10';
    
    addLog(`TCP: SYN sent to ${connection.host}:${connection.port}...`);
    await new Promise(resolve => setTimeout(resolve, 600));
    addLog(`TCP: Connection accepted. Initializing ${protocol} handshake...`);
    
    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setConnection(prev => ({ ...prev, isConnected: true }));
    setIsConnecting(false);
    addLog(`SUCCESS: MySQL Connection Established via ${protocol}`);
  };

  const handleDisconnect = () => {
    setConnection(prev => ({ ...prev, isConnected: false }));
    addLog('INFO: Terminated session with database server.');
  };

  const handlePortChange = (val: string) => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        setConnection(prev => ({ ...prev, port: 0 }));
    } else {
        setConnection(prev => ({ ...prev, port: Math.min(Math.max(port, 1), 65535) }));
    }
  };

  const filteredCredentials = credentials.filter(c => 
    c.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpload = async () => {
    if (!newCred.username || !newCred.email) return;

    addLog(`UPLOADING: Preparing INSERT query for user '${newCred.username}'...`);
    setIsConnecting(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Validate if this data looks like a valid MySQL user credential entry: 
      Username: ${newCred.username}, Email: ${newCred.email}, Role: ${newCred.role}.
      Return JSON: { "valid": boolean, "sanitized_sql": "string" }`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text);
      
      if (result.valid) {
        const entry: UserCredential = {
          id: (credentials.length + 1).toString(),
          username: newCred.username,
          email: newCred.email,
          role: newCred.role,
          lastLogin: 'Never',
          status: 'Active'
        };
        setCredentials(prev => [entry, ...prev]);
        addLog(`DB EXEC: ${result.sanitized_sql}`);
        addLog(`SUCCESS: 1 row inserted into 'UserCredentials'.`);
        setShowUploadModal(false);
        setNewCred({ username: '', email: '', role: 'User' });
      }
    } catch (e) {
      addLog('ERROR: SQL Syntax error during upload simulation.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2 tracking-tight">
            <Server className="text-indigo-600" /> MySQL Integration Suite
          </h2>
          <p className="text-slate-500 text-sm">Manage MySQL connections and persistent user credentials.</p>
        </div>
        
        <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${connection.isConnected ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
          <div className={`w-2.5 h-2.5 rounded-full ${connection.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
          <span className="text-xs font-bold uppercase tracking-widest">
            {connection.isConnected ? `Node Active: ${connection.port}` : 'Offline Mode'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar: Connection Settings & Instructions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Connection Guide */}
          <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl shadow-sm">
            <h3 className="font-bold text-indigo-900 text-sm flex items-center gap-2 mb-3">
              <HelpCircle size={18} /> Connection Guide
            </h3>
            <ol className="space-y-3">
              {[
                { step: 1, text: "Provide your MySQL server endpoint or 'localhost'." },
                { step: 2, text: "Set the listener port (e.g. 3306 for standard, 8889 for MAMP)." },
                { step: 3, text: "Toggle SSL for cloud-hosted instances." },
                { step: 4, text: "Enter your username and database schema name." },
                { step: 5, text: "Click 'Test & Connect' to verify credentials." }
              ].map((item) => (
                <li key={item.step} className="flex gap-3 text-xs text-indigo-700 leading-relaxed font-medium">
                  <span className="bg-indigo-200 text-indigo-800 w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold">{item.step}</span>
                  {item.text}
                </li>
              ))}
            </ol>
            <div className="mt-4 pt-3 border-t border-indigo-200/50 flex items-center gap-2 text-[10px] text-indigo-500 italic">
              <Info size={12} /> External firewall access must be permitted.
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-50 pb-3">
              <Shield size={18} className="text-indigo-500" /> Connection Parameters
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">DB Host / Endpoint</label>
                <input 
                  type="text" 
                  disabled={connection.isConnected}
                  value={connection.host}
                  onChange={e => setConnection({...connection, host: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-between">
                    Port
                    {connection.port !== 3306 && <span className="text-indigo-500 lowercase font-normal italic">custom</span>}
                  </label>
                  <input 
                    type="number" 
                    disabled={connection.isConnected}
                    value={connection.port || ''}
                    onChange={e => handlePortChange(e.target.value)}
                    className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50 transition-colors ${connection.port !== 3306 ? 'border-indigo-200' : 'border-slate-200'}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">SSL Mode</label>
                  <select 
                    disabled={connection.isConnected}
                    value={connection.ssl ? 'on' : 'off'}
                    onChange={e => setConnection({...connection, ssl: e.target.value === 'on'})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
                  >
                    <option value="on">Required</option>
                    <option value="off">Disabled</option>
                  </select>
                </div>
              </div>

              {/* Port Quick Presets */}
              {!connection.isConnected && (
                <div className="flex flex-wrap gap-2">
                  {[3306, 3307, 8889, 33060].map(p => (
                    <button
                      key={p}
                      onClick={() => setConnection(prev => ({ ...prev, port: p }))}
                      className={`text-[10px] font-black px-2 py-1 rounded border transition-all ${
                        connection.port === p 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                          : 'bg-white text-slate-400 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      {p === 33060 ? '33060 (X)' : p}
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Auth User</label>
                <input 
                  type="text" 
                  disabled={connection.isConnected}
                  value={connection.user}
                  onChange={e => setConnection({...connection, user: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
                />
              </div>

              <div className="pt-4">
                {connection.isConnected ? (
                  <button 
                    onClick={handleDisconnect}
                    className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} /> TERMINATE CONNECTION
                  </button>
                ) : (
                  <button 
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isConnecting ? <RefreshCw size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                    TEST & CONNECT
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-indigo-300 p-4 rounded-2xl font-mono text-[10px] h-48 overflow-y-auto border border-slate-800 shadow-inner">
            <div className="flex items-center gap-2 mb-2 text-slate-500 sticky top-0 bg-slate-900 py-1">
              <Terminal size={12} /> CONSOLE LOG
            </div>
            {log.map((l, i) => <div key={i} className="mb-1">{l}</div>)}
          </div>
        </div>

        {/* Main: Credentials Management */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Key className="text-amber-500" /> User Credential Repository
              </h3>
              
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search credentials..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full"
                  />
                </div>
                <button 
                  onClick={() => setShowUploadModal(true)}
                  disabled={!connection.isConnected}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:grayscale"
                >
                  <UserPlus size={16} /> UPLOAD
                </button>
              </div>
            </div>

            {!connection.isConnected ? (
              <div className="flex-grow flex flex-col items-center justify-center text-slate-400 opacity-50 space-y-4">
                <HardDrive size={64} strokeWidth={1} />
                <div className="text-center">
                  <p className="font-bold">MySQL Link Inactive</p>
                  <p className="text-xs">Connect to a database node to access credential records.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Username</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Last Login</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredCredentials.map(cred => (
                      <tr key={cred.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-4 py-3 font-mono text-xs text-slate-400">#{cred.id}</td>
                        <td className="px-4 py-3 font-bold text-slate-800">{cred.username}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{cred.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            cred.role === 'Admin' ? 'bg-purple-50 border-purple-200 text-purple-600' :
                            cred.role === 'Judge' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                            'bg-slate-100 border-slate-200 text-slate-600'
                          }`}>
                            {cred.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400">{cred.lastLogin}</td>
                        <td className="px-4 py-3 text-right">
                          <button className="p-1 text-slate-300 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredCredentials.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-slate-400 text-sm">
                          No matching records found in database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 border border-slate-200 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-2 tracking-tight">
              <UserPlus className="text-indigo-600" /> Upload Credential
            </h3>
            <p className="text-slate-500 text-sm mb-6">Synchronize new user credentials with the MySQL instance.</p>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Username</label>
                <input 
                  type="text" 
                  value={newCred.username}
                  onChange={e => setNewCred({...newCred, username: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. AlgoWizard_22"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Email Address</label>
                <input 
                  type="email" 
                  value={newCred.email}
                  onChange={e => setNewCred({...newCred, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="user@university.edu"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">System Role</label>
                <select 
                  value={newCred.role}
                  onChange={e => setNewCred({...newCred, role: e.target.value as any})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="User">User (Default)</option>
                  <option value="Judge">Judge / Moderator</option>
                  <option value="Admin">Administrator</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  onClick={handleUpload}
                  className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  UPLOAD RECORD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseManager;