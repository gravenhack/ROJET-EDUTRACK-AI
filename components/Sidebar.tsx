import React from 'react';
import { LayoutDashboard, GraduationCap, MessageSquareText, Settings, LogOut, X, BookOpen } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
    { id: 'assessment', label: 'Évaluation', icon: GraduationCap },
    { id: 'tutor', label: 'Tuteur IA', icon: MessageSquareText },
  ];

  const sidebarClass = `
    fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    lg:relative lg:translate-x-0
  `;

  return (
    <aside className={sidebarClass}>
      <div className="h-full flex flex-col">
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-benin-green font-bold text-xl">
            <div className="bg-benin-green text-white p-1 rounded">
              <BookOpen size={20} />
            </div>
            <span>EduTrack<span className="text-slate-800">AI</span></span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onChangeView(item.id as ViewState);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <item.icon size={20} className={isActive ? 'text-primary-600' : 'text-slate-400'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">
                <Settings size={20} className="text-slate-400" />
                Paramètres
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg">
                <LogOut size={20} />
                Déconnexion
            </button>
        </div>
        
        {/* Mini Footer Info */}
        <div className="p-6 text-xs text-slate-400 text-center">
            v1.0.0 • EduTrack Bénin
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;