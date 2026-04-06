import React, { useState, useEffect } from 'react';
import { useAppContext, Infraction } from '../lib/AppContext';
import { X, AlertTriangle } from 'lucide-react';
import { infractionTypes } from '../lib/mockData';

export default function IssueInfractionModal({ citizen, vehicles, onClose }: { citizen: any, vehicles: any[], onClose: () => void }) {
  const { addInfraction, infractions } = useAppContext();
  
  const [type, setType] = useState<'aviso' | 'multa'>('aviso');
  const [infractionTypeId, setInfractionTypeId] = useState(infractionTypes[0].id);
  const [vehicleMatricula, setVehicleMatricula] = useState(vehicles.length > 0 ? vehicles[0].matricula : '');
  const [forcedFineMessage, setForcedFineMessage] = useState('');

  // Intelligent logic: Check if a warning was issued for the same infraction type in the last 21 days
  useEffect(() => {
    if (type === 'aviso') {
      const twentyOneDaysAgo = new Date();
      twentyOneDaysAgo.setDate(twentyOneDaysAgo.getDate() - 21);

      const recentWarning = infractions.find(i => 
        i.citizenBi === citizen.bi && 
        i.type === 'aviso' && 
        i.infractionTypeId === infractionTypeId &&
        new Date(i.date) > twentyOneDaysAgo
      );

      if (recentWarning) {
        setType('multa');
        setForcedFineMessage(`O sistema converteu automaticamente para MULTA. O cidadão já recebeu um aviso por esta infração nos últimos 21 dias (Aviso: ${recentWarning.id} em ${new Date(recentWarning.date).toLocaleDateString('pt-PT')}).`);
      } else {
        setForcedFineMessage('');
      }
    } else {
      setForcedFineMessage('');
    }
  }, [type, infractionTypeId, citizen.bi, infractions]);

  // If citizen has suspended license, force "Condução Ilegal" fine
  useEffect(() => {
    if (citizen.licenseStatus === 'Suspensa') {
      setType('multa');
      setInfractionTypeId('conducao_ilegal');
      setForcedFineMessage('Cidadão com carta SUSPENSA. Infração de Condução Ilegal selecionada automaticamente.');
    }
  }, [citizen.licenseStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vehicleMatricula) {
      alert('Por favor, insira a matrícula da viatura.');
      return;
    }

    const selectedType = infractionTypes.find(t => t.id === infractionTypeId);
    if (!selectedType) return;

    const amount = type === 'multa' ? selectedType.baseAmount : 0;
    
    // Calculate deadline (15 days from now)
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + 15);

    const newInfraction: Omit<Infraction, 'id' | 'agentNif'> = {
      type,
      infractionTypeId,
      date: new Date().toISOString(),
      citizenBi: citizen.bi,
      vehicleMatricula,
      amount,
      status: type === 'multa' ? 'nao_pago' : 'aviso',
      deadline: type === 'multa' ? deadlineDate.toISOString() : null,
    };

    addInfraction(newInfraction);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">Registar Infração</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {forcedFineMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex gap-3 items-start text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="font-medium">{forcedFineMessage}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Condutor</label>
            <input type="text" value={`${citizen.name} (${citizen.bi})`} disabled className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 text-slate-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Viatura (Matrícula)</label>
            {vehicles.length > 0 ? (
              <select 
                value={vehicleMatricula} 
                onChange={(e) => setVehicleMatricula(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {vehicles.map(v => (
                  <option key={v.matricula} value={v.matricula}>{v.matricula} ({v.brand} {v.model})</option>
                ))}
              </select>
            ) : (
              <input 
                type="text" 
                value={vehicleMatricula} 
                onChange={(e) => setVehicleMatricula(e.target.value)}
                placeholder="Ex: LD-00-00-AA"
                required
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase" 
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Registo</label>
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${type === 'aviso' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <input type="radio" name="type" value="aviso" checked={type === 'aviso'} onChange={() => setType('aviso')} className="hidden" disabled={!!forcedFineMessage} />
                <span className="font-medium">Chamada de Atenção</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${type === 'multa' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <input type="radio" name="type" value="multa" checked={type === 'multa'} onChange={() => setType('multa')} className="hidden" />
                <span className="font-medium">Multa</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Infração</label>
            <select 
              value={infractionTypeId} 
              onChange={(e) => setInfractionTypeId(e.target.value)}
              disabled={citizen.licenseStatus === 'Suspensa'}
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {infractionTypes.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {type === 'multa' && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex justify-between items-center">
              <span className="text-slate-600 font-medium">Valor a Pagar:</span>
              <span className="text-xl font-bold text-slate-900">
                {infractionTypes.find(t => t.id === infractionTypeId)?.baseAmount.toLocaleString()} Kz
              </span>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" className={`flex-1 text-white px-4 py-2 rounded-lg font-medium transition-colors ${type === 'multa' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
              Confirmar Registo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
