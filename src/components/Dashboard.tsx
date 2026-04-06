import React, { useState } from 'react';
import { useAppContext } from '../lib/AppContext';
import { Search, AlertTriangle, Car, FileText, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function Dashboard({ onNavigate }: { onNavigate: (tab: 'search') => void }) {
  const { infractions, vehicles, citizens } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  const today = new Date().toISOString().split('T')[0];
  
  const todayInfractions = infractions.filter(i => i.date.startsWith(today));
  const totalFines = todayInfractions.filter(i => i.type === 'multa').length;
  
  // Alerts logic
  const overdueFines = infractions.filter(i => i.status === 'em_atraso');
  const suspendedCitizens = citizens.filter(c => c.licenseStatus === 'Suspensa');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app we'd pass this query to the search view
      onNavigate('search');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Visão Geral</h2>
        <p className="text-slate-500">Resumo das atividades e alertas do dia.</p>
      </header>

      {/* Quick Search */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Pesquisa Rápida</h3>
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nº do BI ou Matrícula da viatura..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Consultar
          </button>
        </form>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Car className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Veículos Fiscalizados (Hoje)</p>
            <p className="text-2xl font-bold text-slate-900">{todayInfractions.length * 2 /* Mocking a number */ + 5}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Infrações Registadas (Hoje)</p>
            <p className="text-2xl font-bold text-slate-900">{todayInfractions.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <FileText className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Multas Emitidas (Hoje)</p>
            <p className="text-2xl font-bold text-slate-900">{totalFines}</p>
          </div>
        </div>
      </section>

      {/* Alerts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-red-50 border-b border-red-100 p-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Alertas: Multas em Atraso</h3>
          </div>
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {overdueFines.length === 0 ? (
              <p className="p-6 text-center text-slate-500">Nenhuma multa em atraso detetada recentemente.</p>
            ) : (
              overdueFines.map(inf => (
                <div key={inf.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-slate-900">{inf.vehicleMatricula}</span>
                    <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-700 rounded-full">Em Atraso</span>
                  </div>
                  <p className="text-sm text-slate-500">BI Associado: {inf.citizenBi}</p>
                  <p className="text-sm text-slate-500">Valor: {inf.amount.toLocaleString()} Kz</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-amber-50 border-b border-amber-100 p-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-amber-900">Alertas: Cartas Suspensas</h3>
          </div>
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {suspendedCitizens.length === 0 ? (
              <p className="p-6 text-center text-slate-500">Nenhum condutor com carta suspensa.</p>
            ) : (
              suspendedCitizens.map(c => (
                <div key={c.bi} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-slate-900">{c.name}</span>
                    <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-700 rounded-full">Suspensa</span>
                  </div>
                  <p className="text-sm text-slate-500">BI: {c.bi}</p>
                  <p className="text-sm text-slate-500">Categoria: {c.licenseCategory}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
