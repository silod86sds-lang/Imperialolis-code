import React from 'react';
import { useAppContext } from '../lib/AppContext';
import { Car, User, FileText, AlertTriangle } from 'lucide-react';

export default function VehicleView({ vehicle, onOwnerClick }: { vehicle: any, onOwnerClick: (bi: string) => void }) {
  const { citizens, infractions } = useAppContext();
  
  const owner = citizens.find(c => c.bi === vehicle.ownerBi);
  const vehicleInfractions = infractions.filter(i => i.vehicleMatricula === vehicle.matricula).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
      {/* Vehicle Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-32 h-32 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
            <Car className="w-16 h-16 text-slate-400" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 tracking-wider">{vehicle.matricula}</h3>
                <p className="text-slate-500 text-lg">{vehicle.brand} {vehicle.model}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <p className="text-sm text-slate-500 mb-1">Estado do Imposto</p>
                {vehicle.taxPaid ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Pago</span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">Em Dívida</span>
                )}
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Seguro Automóvel</p>
                {vehicle.insuranceActive ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Ativo</span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">Inativo</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Owner Info Bar */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-slate-500" />
            <span className="text-slate-600">Proprietário:</span>
            <span className="font-semibold text-slate-900">{owner?.name || 'Desconhecido'}</span>
            <span className="text-sm text-slate-500">({vehicle.ownerBi})</span>
          </div>
          <button 
            onClick={() => onOwnerClick(vehicle.ownerBi)}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
          >
            Ver Perfil do Proprietário
          </button>
        </div>
      </div>

      {/* Infractions History */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-800">Histórico de Infrações da Viatura</h3>
        </div>
        <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
          {vehicleInfractions.length === 0 ? (
            <p className="p-6 text-center text-slate-500">Nenhuma infração registada para esta viatura.</p>
          ) : (
            vehicleInfractions.map(inf => (
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
                  <p className="text-sm text-slate-500">Condutor BI: {inf.citizenBi}</p>
                  {inf.type === 'multa' && (
                    <p className="font-bold text-slate-900">{inf.amount.toLocaleString()} Kz</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
