import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ProblemSet from './components/ProblemSet';
import Contests from './components/Contests';
import Rivalry from './components/Rivalry';
import University from './components/University';
import QueryLab from './components/QueryLab';
import HowItWorks from './components/HowItWorks';
import SchemaDiagram from './components/SchemaDiagram';
import DatabaseManager from './components/DatabaseManager';
import { CURRENT_USER } from './services/mockDb';

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard user={CURRENT_USER} />;
      case 'problems':
        return <ProblemSet />;
      case 'contests':
        return <Contests />;
      case 'rivalry':
        return <Rivalry />;
      case 'analytics':
        return <University />;
      case 'database':
        return <DatabaseManager />;
      case 'queries':
        return <QueryLab />;
      case 'how-it-works':
        return <HowItWorks onViewSchema={() => setActiveView('schema-diagram')} />;
      case 'schema-diagram':
        return <SchemaDiagram onBack={() => setActiveView('how-it-works')} />;
      default:
        return <Dashboard user={CURRENT_USER} />;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {renderView()}
    </Layout>
  );
}

export default App;