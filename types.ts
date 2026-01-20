export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
  EXPERT = 'Expert'
}

export interface User {
  id: string;
  username: string;
  rating: number;
  university: string;
  solvedCount: number;
  rank: string;
}

export interface UserCredential {
  id: string;
  username: string;
  email: string;
  role: 'Admin' | 'User' | 'Judge';
  lastLogin: string;
  status: 'Active' | 'Suspended';
}

export interface DbConnection {
  host: string;
  port: number;
  user: string;
  database: string;
  ssl: boolean;
  isConnected: boolean;
}

export interface Problem {
  id: string;
  title: string;
  topic: string; // e.g., DP, Graph, Math
  difficulty: Difficulty;
  solvedBy: number; // Used for "Auto-Adjust" feature
  tags: string[];
}

export interface Submission {
  id: string;
  problemId: string;
  userId: string;
  verdict: 'AC' | 'WA' | 'TLE' | 'RE';
  timestamp: string;
  runtime: number; // ms
  memory: number; // KB
  language: string;
  failedTestCase?: number; // For "Mistake Log"
}

export interface TopicStat {
  topic: string;
  solved: number;
  total: number;
  weaknessScore: number; // 0-100, calculated by DB
}

export interface Contest {
  id: string;
  name: string;
  type: 'Global' | 'Local';
  date: string;
  participants: number;
  status: 'Upcoming' | 'Active' | 'Past';
}

export interface UniversityStat {
  name: string;
  totalSolves: number;
  activeUsers: number;
  topPerformer: string;
}