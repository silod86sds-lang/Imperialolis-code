import React, { useState } from 'react';
import { useAppContext } from '../lib/AppContext';
import { User, ShieldAlert, Car, FileText, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import IssueInfractionModal from './IssueInfractionModal';

export default function CitizenView({ citizen }: { citizen: any }) {
  const { vehicles, infractions, suspendLicense } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const citizenVehicles = vehicles.filter(v => v.ownerBi === citizen.bi);
  const citizenInfractions = infractions.filter(i => i.citizenBi === citizen.bi).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const hasOverdueFines = citizenInfractions.some(i => i.status === 'em_atraso');
  
  const handleSuspend = () => {
    if (window.confirm(`Tem certeza que deseja SUSPENDER a carta de condução de ${citizen.name}? Esta ação é irreversível no sistema local.`)) {
      suspendLicense(citizen.bi);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Válida': return 'bg-green-100 text-green-700 border-green-200';
      case 'Suspensa': return 'bg-red-100 text-red-700 border-red-200';
      case 'Expirada': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getInfractionStatusBadge = (status: string) => {
    switch (status) {
      case 'pago': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Pago</span>;
      case 'nao_pago': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">Não Pago</span>;
      case 'em_atraso': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Em Atraso</span>;
      case 'aviso': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">Aviso</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Citizen Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row gap-6 items-start">
          <img src={citizen.photo} alt={citizen.name} className="w-32 h-32 rounded-lg object-cover border border-slate-200" />
          
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{citizen.name}</h3>
                <p className="text-slate-500 font-mono">BI: {citizen.bi}</p>
              </div>
              <div className={`px-4 py-2 rounded-lg border font-semibold ${getStatusColor(citizen.licenseStatus)}`}>
                Carta: {citizen.licenseStatus}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <p className="text-sm text-slate-500">Categoria da Carta</p>
                <p className="font-medium text-slate-900">{citizen.licenseCategory}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Validade</p>
                <p className="font-medium text-slate-900">{new Date(citizen.licenseExpiry).toLocaleDateString('pt-PT')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            Registar Infração / Aviso
          </button>
          
          {hasOverdueFines && citizen.licenseStatus === 'Válida' && (
            <button 
              onClick={handleSuspend}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Suspender Carta (Multas em Atraso)
            </button>
          )}

          {citizen.licenseStatus === 'Suspensa' && (
            <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium border border-red-200">
              <AlertTriangle className="w-4 h-4" />
              Atenção: Condução Ilegal se apanhado ao volante
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicles List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit">
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
            <Car className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-slate-800">Veículos Registados</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {citizenVehicles.length === 0 ? (
              <p className="p-4 text-slate-500 text-sm">Nenhum veículo registado.</p>
            ) : (
              citizenVehicles.map(v => (
                <div key={v.matricula} className="p-4">
                  <p className="font-bold text-slate-900">{v.matricula}</p>
                  <p className="text-sm text-slate-500">{v.brand} {v.model}</p>
                  <div className="mt-2 flex gap-2">
                    {v.taxPaid ? (
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-green-100 text-green-700 rounded">Imposto OK</span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-red-100 text-red-700 rounded">Imposto Dívida</span>
                    )}
                    {v.insuranceActive ? (
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-green-100 text-green-700 rounded">Seguro OK</span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-red-100 text-red-700 rounded">Sem Seguro</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Infractions History */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-slate-800">Histórico de Infrações</h3>
          </div>
          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {citizenInfractions.length === 0 ? (
              <p className="p-6 text-center text-slate-500">Registo limpo. Nenhuma infração registada.</p>
            ) : (
              citizenInfractions.map(inf => (
                <div key={inf.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-slate-900 mr-2">{inf.id}</span>
                      <span className="text-sm text-slate-500">{new Date(inf.date).toLocaleString('pt-PT')}</span>
                    </div>
                    {getInfractionStatusBadge(inf.status)}
                  </div>
                  <p className="text-slate-800 font-medium mb-1">
                    {inf.type === 'aviso' ? 'Chamada de Atenção: ' : 'Multa: '}
                    {inf.infractionTypeId.replace(/_/g, ' ').toUpperCase()}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-slate-500">Viatura: {inf.vehicleMatricula}</p>
                    {inf.type === 'multa' && (
                      <p className="font-bold text-slate-900">{inf.amount.toLocaleString()} Kz</p>
                    )}
                  </div>
                  {inf.deadline && inf.status !== 'pago' && (
                    <p className="text-xs text-red-500 mt-2 font-medium">
                      Prazo: {new Date(inf.deadline).toLocaleDateString('pt-PT')}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <IssueInfractionModal 
          citizen={citizen} 
          vehicles={citizenVehicles}
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}
