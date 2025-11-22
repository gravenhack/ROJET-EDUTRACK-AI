import React, { useState, useEffect } from 'react';
import { Layout } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Assessment from './components/Assessment';
import Tutor from './components/Tutor';
import { ViewState } from './types';

// Mock user session
const MOCK_USER = {
  id: 1,
  name: "Koffi Mensah",
  grade: "Terminale C",
  school: "Lycée Béhanzin"
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [apiKey, setApiKey] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Initialize API Key from env if available
  useEffect(() => {
    if (process.env.API_KEY) {
      setApiKey(process.env.API_KEY);
    }
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={MOCK_USER} onChangeView={setCurrentView} />;
      case 'assessment':
        return <Assessment apiKey={apiKey} onComplete={() => setCurrentView('dashboard')} />;
      case 'tutor':
        return <Tutor apiKey={apiKey} user={MOCK_USER} />;
      default:
        return <Dashboard user={MOCK_USER} onChangeView={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-300">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-md text-slate-600"
            >
              <Layout size={20} />
            </button>
            <h2 className="text-xl font-bold text-slate-800 hidden sm:block">
              {currentView === 'dashboard' && 'Tableau de Bord'}
              {currentView === 'assessment' && 'Évaluation Adaptative'}
              {currentView === 'tutor' && 'Tuteur IA'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
             {!apiKey && (
               <div className="hidden md:flex items-center px-3 py-1 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-200">
                 Mode Demo (Clé API manquante)
               </div>
             )}
             <div className="flex items-center gap-3">
               <div className="text-right hidden md:block">
                 <p className="text-sm font-semibold text-slate-800">{MOCK_USER.name}</p>
                 <p className="text-xs text-slate-500">{MOCK_USER.grade}</p>
               </div>
               <div className="h-10 w-10 rounded-full bg-benin-green flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-white">
                 KM
               </div>
             </div>
          </div>
        </header>

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          {renderView()}
        </main>

      </div>
    </div>
  );
};

export default App;