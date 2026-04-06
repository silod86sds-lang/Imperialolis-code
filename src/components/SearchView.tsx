import React, { useState } from 'react';
import { useAppContext } from '../lib/AppContext';
import { Search, User, Car } from 'lucide-react';
import CitizenView from './CitizenView';
import VehicleView from './VehicleView';

export default function SearchView() {
  const { citizens, vehicles } = useAppContext();
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<{ type: 'citizen' | 'vehicle' | 'none', data: any }>({ type: 'none', data: null });
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim().toUpperCase();
    if (!q) return;

    setHasSearched(true);

    // Try to find citizen by BI
    const citizen = citizens.find(c => c.bi.toUpperCase() === q);
    if (citizen) {
      setSearchResult({ type: 'citizen', data: citizen });
      return;
    }

    // Try to find vehicle by matricula
    const vehicle = vehicles.find(v => v.matricula.toUpperCase() === q);
    if (vehicle) {
      setSearchResult({ type: 'vehicle', data: vehicle });
      return;
    }

    setSearchResult({ type: 'none', data: null });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Consulta de Cidadão / Viatura</h2>
        <p className="text-slate-500">Insira o Nº do BI ou a Matrícula para verificar o histórico e estado legal.</p>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: 000000000LA012 ou LD-12-34-AA"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-lg uppercase"
            />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors text-lg">
            Pesquisar
          </button>
        </form>
      </div>

      {hasSearched && searchResult.type === 'none' && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-8 text-center">
          <p className="text-red-600 font-medium text-lg">Nenhum registo encontrado para "{query}".</p>
          <p className="text-red-500/80 mt-2">Verifique se o BI ou Matrícula foram digitados corretamente.</p>
        </div>
      )}

      {searchResult.type === 'citizen' && (
        <CitizenView citizen={searchResult.data} />
      )}

      {searchResult.type === 'vehicle' && (
        <VehicleView vehicle={searchResult.data} onOwnerClick={(bi) => {
          setQuery(bi);
          const citizen = citizens.find(c => c.bi === bi);
          if (citizen) setSearchResult({ type: 'citizen', data: citizen });
        }} />
      )}
    </div>
  );
}
