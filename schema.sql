-- ==========================================================
-- CodeForge DBMS Project Schema & Dummy Data
-- ==========================================================

-- 1. Create Tables

CREATE TABLE Users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    rating INTEGER DEFAULT 1200,
    university VARCHAR(255),
    solvedCount INTEGER DEFAULT 0,
    rank VARCHAR(50)
);

CREATE TABLE Problems (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    topic VARCHAR(100),
    difficulty VARCHAR(50),
    solvedBy INTEGER DEFAULT 0,
    tags TEXT -- Stored as comma-separated values for simplicity
);

CREATE TABLE Submissions (
    id VARCHAR(50) PRIMARY KEY,
    problemId VARCHAR(50),
    userId VARCHAR(50),
    verdict VARCHAR(10), -- 'AC', 'WA', 'TLE', 'RE'
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    runtime INTEGER, -- in ms
    memory INTEGER, -- in KB
    language VARCHAR(50),
    failedTestCase INTEGER,
    FOREIGN KEY (userId) REFERENCES Users(id),
    FOREIGN KEY (problemId) REFERENCES Problems(id)
);

CREATE TABLE TopicStats (
    topic VARCHAR(100) PRIMARY KEY,
    solved INTEGER DEFAULT 0,
    total INTEGER DEFAULT 0,
    weaknessScore INTEGER -- 0-100
);

CREATE TABLE Contests (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20), -- 'Global', 'Local'
    date DATE,
    participants INTEGER DEFAULT 0,
    status VARCHAR(20) -- 'Upcoming', 'Active', 'Past'
);

CREATE TABLE Universities (
    name VARCHAR(255) PRIMARY KEY,
    totalSolves INTEGER DEFAULT 0,
    activeUsers INTEGER DEFAULT 0,
    topPerformer VARCHAR(100)
);

-- 2. Insert Dummy Data

-- Users
INSERT INTO Users (id, username, rating, university, solvedCount, rank) VALUES
('u1', 'AlgoMaster_99', 1450, 'Tech University of Science', 342, 'Specialist'),
('u2', 'CoderX', 1520, 'State College of Engineering', 360, 'Expert');

-- Problems
INSERT INTO Problems (id, title, topic, difficulty, solvedBy, tags) VALUES
('p1', 'Dynamic Frog', 'DP', 'Medium', 1240, 'dp,greedy'),
('p2', 'Graph City', 'Graph', 'Hard', 450, 'dfs,bfs'),
('p3', 'Simple Sum', 'Math', 'Easy', 5000, 'math,implementation'),
('p4', 'Tree Query', 'Trees', 'Expert', 120, 'trees,lca'),
('p5', 'String Hashing', 'Strings', 'Medium', 890, 'hashing,strings'),
('p6', 'Knapsack 101', 'DP', 'Easy', 3200, 'dp');

-- Submissions
INSERT INTO Submissions (id, problemId, userId, verdict, timestamp, runtime, memory, language, failedTestCase) VALUES
('s1', 'p1', 'u1', 'AC', '2023-10-25 14:30:00', 120, 4500, 'C++', NULL),
('s2', 'p2', 'u1', 'WA', '2023-10-26 10:15:00', 30, 1200, 'Python', 4),
('s3', 'p2', 'u1', 'TLE', '2023-10-26 10:45:00', 2000, 1200, 'Python', 12),
('s4', 'p3', 'u2', 'AC', '2023-10-27 09:00:00', 15, 800, 'Java', NULL);

-- TopicStats
INSERT INTO TopicStats (topic, solved, total, weaknessScore) VALUES
('Dynamic Programming', 45, 100, 30),
('Graph Theory', 12, 80, 85),
('Number Theory', 60, 70, 10),
('Greedy', 50, 100, 40),
('Strings', 20, 50, 60);

-- Contests
INSERT INTO Contests (id, name, type, date, participants, status) VALUES
('c1', 'CodeForge Round #45', 'Global', '2023-11-01', 1200, 'Upcoming'),
('c2', 'University Local Selection', 'Local', '2023-10-20', 45, 'Past'),
('c3', 'Weekly Sprint 12', 'Global', '2023-10-30', 500, 'Active');

-- Universities
INSERT INTO Universities (name, totalSolves, activeUsers, topPerformer) VALUES
('Tech University of Science', 12450, 120, 'AlgoMaster_99'),
('State College of Engineering', 9800, 95, 'CoderX'),
('National Institute', 15600, 200, 'SevenK');
