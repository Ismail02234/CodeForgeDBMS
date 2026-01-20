import { User, Problem, Difficulty, Submission, TopicStat, Contest, UniversityStat } from '../types';

// Mock Data Store
export const CURRENT_USER: User = {
  id: 'u1',
  username: 'AlgoMaster_99',
  rating: 1450,
  university: 'Tech University of Science',
  solvedCount: 342,
  rank: 'Specialist'
};

export const AVAILABLE_USERS = [
  'AlgoMaster_99',
  'CoderX',
  'SevenK',
  'FastCoder_X',
  'SilentNinja',
  'DatabasePro'
];

export const MOCK_PROBLEMS: Problem[] = [
  { id: 'p1', title: 'Dynamic Frog', topic: 'DP', difficulty: Difficulty.MEDIUM, solvedBy: 1240, tags: ['dp', 'greedy'] },
  { id: 'p2', title: 'Graph City', topic: 'Graph', difficulty: Difficulty.HARD, solvedBy: 450, tags: ['dfs', 'bfs'] },
  { id: 'p3', title: 'Simple Sum', topic: 'Math', difficulty: Difficulty.EASY, solvedBy: 5000, tags: ['math', 'implementation'] },
  { id: 'p4', title: 'Tree Query', topic: 'Trees', difficulty: Difficulty.EXPERT, solvedBy: 120, tags: ['trees', 'lca'] },
  { id: 'p5', title: 'String Hashing', topic: 'Strings', difficulty: Difficulty.MEDIUM, solvedBy: 890, tags: ['hashing', 'strings'] },
  { id: 'p6', title: 'Knapsack 101', topic: 'DP', difficulty: Difficulty.EASY, solvedBy: 3200, tags: ['dp'] },
  // New Simple Problems for the Judge
  { id: 'j1', title: 'A+B Problem', topic: 'Basics', difficulty: Difficulty.EASY, solvedBy: 15000, tags: ['basics', 'math'] },
  { id: 'j2', title: 'Even or Odd', topic: 'Basics', difficulty: Difficulty.EASY, solvedBy: 12000, tags: ['basics', 'conditions'] },
  { id: 'j3', title: 'Circle Area', topic: 'Math', difficulty: Difficulty.EASY, solvedBy: 8000, tags: ['math', 'precision'] },
  { id: 'j4', title: 'Factorial Calc', topic: 'Basics', difficulty: Difficulty.EASY, solvedBy: 9500, tags: ['basics', 'loops'] },
  { id: 'j5', title: 'Reverse String', topic: 'Strings', difficulty: Difficulty.EASY, solvedBy: 11000, tags: ['strings', 'basics'] },
];

// Problem Details including hidden test case info (simulated)
export const PROBLEM_DESCRIPTIONS: Record<string, string> = {
  'p1': 'A frog is at the start of a river with N lily pads. Each pad has a weight. The frog can jump either 1 or 2 pads forward. Find the path that minimizes the total weight of pads the frog lands on. Output the minimum weight.',
  'p2': 'You are given a map of City-X represented as an adjacency list of N nodes and M edges. Determine if the graph is fully connected. If not, output the minimum number of additional roads needed to make every city reachable from any other city.',
  'p3': 'Input a single integer N. Output the sum of all integers from 1 up to N (inclusive). Constraints: 1 <= N <= 10^9. Note: Your solution must be O(1) to pass the time limit.',
  'p4': 'Given a rooted tree with N nodes, answer Q queries. Each query consists of two nodes U and V. For each query, output the ID of the Lowest Common Ancestor (LCA) of U and V. Standard tree input formats apply.',
  'p5': 'Implement a fast string matching algorithm using rolling hashes. Given a text T and a pattern P, output the start index of every occurrence of P in T. Use a suitable prime and base to minimize collisions.',
  'p6': 'You have a knapsack with a maximum capacity W. There are N items, each with a value V and a weight M. Find the maximum total value you can achieve by selecting a subset of items such that their total weight does not exceed W.',
  'j1': 'Input two integers A and B. Output their sum A+B.',
  'j2': 'Input an integer N. Output "Even" if N is even, and "Odd" otherwise.',
  'j3': 'Input a radius R (float). Output the area of the circle (PI * R * R). Use PI = 3.1415926535. Results are accepted with tolerance < 1e-6.',
  'j4': 'Input an integer N (0 <= N <= 12). Output the factorial of N.',
  'j5': 'Input a string S. Output the reversed string.'
};

export const MOCK_SUBMISSIONS: Submission[] = [
  { id: 's1', problemId: 'p1', userId: 'u1', verdict: 'AC', timestamp: '2023-10-25T14:30:00', runtime: 120, memory: 4500, language: 'C++' },
  { id: 's2', problemId: 'p2', userId: 'u1', verdict: 'WA', timestamp: '2023-10-26T10:15:00', runtime: 30, memory: 1200, language: 'Python', failedTestCase: 4 },
  { id: 's3', problemId: 'p2', userId: 'u1', verdict: 'TLE', timestamp: '2023-10-26T10:45:00', runtime: 2000, memory: 1200, language: 'Python', failedTestCase: 12 },
  { id: 's4', problemId: 'p3', userId: 'u2', verdict: 'AC', timestamp: '2023-10-27T09:00:00', runtime: 15, memory: 800, language: 'Java' },
];

export const MOCK_TOPIC_STATS: TopicStat[] = [
  { topic: 'DP', solved: 45, total: 100, weaknessScore: 30 },
  { topic: 'Graph', solved: 12, total: 80, weaknessScore: 85 },
  { topic: 'Math', solved: 60, total: 70, weaknessScore: 10 },
  { topic: 'Greedy', solved: 50, total: 100, weaknessScore: 40 },
  { topic: 'Strings', solved: 20, total: 50, weaknessScore: 60 },
];

export const MOCK_CONTESTS: Contest[] = [
  { id: 'c1', name: 'CodeForge Round #45', type: 'Global', date: '2023-11-01', participants: 1200, status: 'Upcoming' },
  { id: 'c2', name: 'University Local Selection', type: 'Local', date: '2023-10-20', participants: 45, status: 'Past' },
  { id: 'c3', name: 'Weekly Sprint 12', type: 'Global', date: '2023-10-30', participants: 500, status: 'Active' },
];

export const MOCK_UNI_STATS: UniversityStat[] = [
  { name: 'Tech University of Science', totalSolves: 12450, activeUsers: 120, topPerformer: 'AlgoMaster_99' },
  { name: 'State College of Engineering', totalSolves: 9800, activeUsers: 95, topPerformer: 'CoderX' },
  { name: 'National Institute', totalSolves: 15600, activeUsers: 200, topPerformer: 'SevenK' },
];

export const getRecommendedProblems = (userWeakness: TopicStat[]): Problem[] => {
  const weakTopics = userWeakness.filter(t => t.weaknessScore > 50).map(t => t.topic);
  return MOCK_PROBLEMS.filter(p => 
    (weakTopics.includes(p.topic) && p.difficulty !== Difficulty.EXPERT) || 
    p.difficulty === Difficulty.EASY
  ).slice(0, 3);
};

export const getRivalStats = (name: string) => {
  // Generate deterministic-looking mock data based on name length/hash
  const seed = name.length;
  return {
    username: name,
    rating: 1200 + (seed * 42) % 600,
    solvedCount: 100 + (seed * 13) % 400,
    topicStrengths: [
        { topic: 'DP', value: 40 + (seed * 7) % 55 },
        { topic: 'Graph', value: 30 + (seed * 11) % 65 },
        { topic: 'Math', value: 50 + (seed * 3) % 45 },
        { topic: 'Greedy', value: 45 + (seed * 5) % 50 },
        { topic: 'Strings', value: 35 + (seed * 9) % 60 },
    ]
  };
};

export const getUserStatsForRadar = () => [
    { topic: 'DP', value: 70 },
    { topic: 'Graph', value: 15 }, 
    { topic: 'Math', value: 90 },
    { topic: 'Greedy', value: 60 },
    { topic: 'Strings', value: 40 },
];
