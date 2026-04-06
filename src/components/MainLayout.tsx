import React, { useState } from 'react';
import { useAppContext } from '../lib/AppContext';
import { Search, ShieldAlert, User, Car, AlertTriangle, FileText, LogOut, BarChart3 } from 'lucide-react';
import Dashboard from './Dashboard';
import SearchView from './SearchView';
import AgentPanel from './AgentPanel';

type Tab = 'dashboard' | 'search' | 'panel';

export default function MainLayout() {
  const { currentUser, logout } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <ShieldAlert className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="font-bold text-lg leading-tight">SIFT</h1>
            <p className="text-xs text-slate-400">Fiscalização</p>
          </div>
        </div>
        
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
              <User className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-slate-400">NIF: {currentUser.nif}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'search' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Search className="w-5 h-5" />
            <span className="font-medium">Consulta</span>
          </button>
          <button
            onClick={() => setActiveTab('panel')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'panel' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Meu Painel</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Terminar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && <Dashboard onNavigate={(tab) => setActiveTab(tab)} />}
        {activeTab === 'search' && <SearchView />}
        {activeTab === 'panel' && <AgentPanel />}
      </main>
    </div>
  );
}
