import React from 'react';
import { useAppContext } from '../lib/AppContext';
import { FileText, CheckCircle2, Clock, TrendingUp } from 'lucide-react';

export default function AgentPanel() {
  const { currentUser, infractions, markAsPaid } = useAppContext();

  if (!currentUser) return null;

  const myInfractions = infractions.filter(i => i.agentNif === currentUser.nif);
  const myFines = myInfractions.filter(i => i.type === 'multa');
  
  const paidFines = myFines.filter(i => i.status === 'pago');
  const unpaidFines = myFines.filter(i => i.status === 'nao_pago' || i.status === 'em_atraso');

  const totalPaidAmount = paidFines.reduce((sum, fine) => sum + fine.amount, 0);
  const commission = totalPaidAmount * 0.01; // 1% commission

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Meu Painel de Desempenho</h2>
        <p className="text-slate-500">Acompanhe as suas estatísticas e multas emitidas.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 font-medium mb-1">Total de Registos</p>
          <p className="text-3xl font-bold text-slate-900">{myInfractions.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 font-medium mb-1">Multas Emitidas</p>
          <p className="text-3xl font-bold text-slate-900">{myFines.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 font-medium mb-1">Multas Pagas</p>
          <p className="text-3xl font-bold text-green-600">{paidFines.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-sm border border-blue-700 text-white">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-blue-200" />
            <p className="text-sm text-blue-100 font-medium">Incentivo Estimado</p>
          </div>
          <p className="text-3xl font-bold">{commission.toLocaleString()} Kz</p>
          <p className="text-xs text-blue-200 mt-1">1% sobre multas pagas</p>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-slate-800">Minhas Multas Emitidas</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500">
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Data</th>
                <th className="p-4 font-medium">Condutor (BI)</th>
                <th className="p-4 font-medium">Viatura</th>
                <th className="p-4 font-medium">Valor</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myFines.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">Nenhuma multa emitida ainda.</td>
                </tr>
              ) : (
                myFines.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(fine => (
                  <tr key={fine.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">{fine.id}</td>
                    <td className="p-4 text-sm text-slate-500">{new Date(fine.date).toLocaleDateString('pt-PT')}</td>
                    <td className="p-4 text-sm text-slate-900">{fine.citizenBi}</td>
                    <td className="p-4 text-sm text-slate-900">{fine.vehicleMatricula}</td>
                    <td className="p-4 text-sm font-medium text-slate-900">{fine.amount.toLocaleString()} Kz</td>
                    <td className="p-4">
                      {fine.status === 'pago' && <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3"/> Pago</span>}
                      {fine.status === 'nao_pago' && <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700 flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/> Pendente</span>}
                      {fine.status === 'em_atraso' && <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/> Em Atraso</span>}
                    </td>
                    <td className="p-4 text-right">
                      {fine.status !== 'pago' && (
                        <button 
                          onClick={() => {
                            if(window.confirm(`Confirmar pagamento da multa ${fine.id}? Na vida real, isto seria automático via banco.`)) {
                              markAsPaid(fine.id);
                            }
                          }}
                          className="text-xs font-medium text-blue-600 hover:text-blue-800 underline"
                        >
                          Simular Pagamento
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
