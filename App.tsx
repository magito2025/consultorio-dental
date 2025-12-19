
import React, { useState, useEffect } from 'react';
import { User } from './types';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PatientsManager from './components/PatientsManager';
import FinanceManager from './components/FinanceManager';
import Settings from './components/Settings';
import Agenda from './components/Agenda';
import { db } from './services/db';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Default to LIGHT mode as requested, ignore system pref for now unless stored explicitly
    if (localStorage.theme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    // Handle specific route logic
    if (currentView === 'patients' || currentView === 'patients-new') {
      return (
        <PatientsManager 
          onNavigate={setCurrentView} 
          autoOpenForm={currentView === 'patients-new'} 
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} onNavigate={setCurrentView} />;
      case 'finance':
        return <FinanceManager />;
      case 'settings':
        return <Settings user={user} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      case 'appointments':
        return <Agenda />;
      default:
        return <Dashboard user={user} onNavigate={setCurrentView} />;
    }
  };

  return (
    <Layout user={user} onLogout={handleLogout} currentView={currentView} onNavigate={setCurrentView}>
      {renderContent()}
    </Layout>
  );
};

export default App;
