import React from 'react';
import { DollarSign, Clock, CheckCircle, EyeOff, MoreHorizontal, TrendingUp, TrendingDown } from 'lucide-react';

const FinanceiroView: React.FC = () => {
  const faturas = [
    { id: 'NV-2847', patient: 'Beatriz Almeida', value: 'R$ 180,00', due: '08/04/2026', status: 'Pago', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 'NV-2848', patient: 'Ricardo Fernandes', value: 'R$ 850,00', due: '08/04/2026', status: 'Pendente', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { id: 'NV-2849', patient: 'Camila Souza', value: 'R$ 320,00', due: '02/04/2026', status: 'Atrasado', color: 'bg-rose-50 text-rose-600 border-rose-100' },
    { id: 'NV-2850', patient: 'Fernando Lima', value: 'R$ 450,00', due: '13/04/2026', status: 'Pendente', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-light text-[#0a3d62] tracking-tighter uppercase italic">Financeiro</h2>
          <p className="text-[#57606f] text-sm font-light uppercase tracking-widest mt-3 opacity-70">Gerenciar receitas, faturas e planos</p>
        </div>
        <button className="bg-white border border-slate-200 text-[#0a3d62] px-8 py-3.5 rounded-xl font-light flex items-center gap-3 hover:bg-slate-50 transition-all uppercase text-[11px] tracking-widest shadow-sm active:scale-95" title="Ocultar valores monetários">
          <EyeOff size={18} /> Ocultar Valores
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'RECEITA DO MÊS', value: 'R$ 28.450,00', trend: '+12,3%', trendIcon: TrendingUp, icon: DollarSign, iconColor: 'text-teal-500 bg-teal-50' },
          { label: 'FATURAS PENDENTES', value: 'R$ 4.280,00', trend: '8 faturas', trendIcon: TrendingDown, icon: Clock, iconColor: 'text-blue-500 bg-blue-50' },
          { label: 'FATURAS PAGAS', value: 'R$ 24.170,00', trend: '47 faturas', trendIcon: CheckCircle, icon: CheckCircle, iconColor: 'text-emerald-500 bg-emerald-50' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className={`absolute top-10 right-10 p-4 rounded-full ${kpi.iconColor}`}>
              <kpi.icon size={28} />
            </div>
            <p className="text-[11px] font-light text-slate-400 uppercase tracking-[0.2em] mb-6">{kpi.label}</p>
            <h3 className="text-4xl font-light text-[#0a3d62] italic">{kpi.value}</h3>
            <div className="mt-6 flex items-center gap-3">
               <kpi.trendIcon size={16} className={i === 0 ? 'text-emerald-500' : 'text-slate-400'} />
               <span className={`text-[11px] font-light uppercase tracking-widest ${i === 0 ? 'text-emerald-500' : 'text-slate-500'}`}>{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Table Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-light text-[#0a3d62] uppercase tracking-[0.1em]">Faturas Recentes</h3>
            <select title="Filtrar por Status" className="bg-white border border-slate-200 rounded-xl px-5 py-3 text-[11px] font-light text-[#0a3d62] outline-none cursor-pointer hover:border-slate-300 transition-all">
              <option>Todos os status</option>
              <option>Pago</option>
              <option>Pendente</option>
              <option>Atrasado</option>
            </select>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-5 text-[10px] font-light text-slate-400 uppercase tracking-widest">Número</th>
                  <th className="px-6 py-5 text-[10px] font-light text-slate-400 uppercase tracking-widest">Paciente</th>
                  <th className="px-6 py-5 text-[10px] font-light text-slate-400 uppercase tracking-widest">Valor</th>
                  <th className="px-6 py-5 text-[10px] font-light text-slate-400 uppercase tracking-widest">Vencimento</th>
                  <th className="px-6 py-5 text-[10px] font-light text-slate-400 uppercase tracking-widest text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {faturas.map((f, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-6 text-[11px] font-light text-slate-400">{f.id}</td>
                    <td className="px-6 py-6 text-sm font-light text-[#0a3d62] italic">{f.patient}</td>
                    <td className="px-6 py-6 text-sm font-light text-[#0a3d62] italic">{f.value}</td>
                    <td className="px-6 py-6 text-[11px] font-light text-slate-400">{f.due}</td>
                    <td className="px-6 py-6">
                       <div className="flex justify-center">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-light uppercase tracking-widest border ${f.color}`}>
                          {f.status}
                        </span>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Plan Sidebar */}
        <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-[#82ccdd]/20 shadow-sm shadow-[#82ccdd]/10 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-10">
                 <h3 className="text-xs font-light text-[#0a3d62] uppercase tracking-[0.1em]">Plano Real</h3>
                 <MoreHorizontal size={20} className="text-slate-300" />
              </div>

              <div className="flex items-center justify-between mb-10">
                 <span className="bg-[#0a3d62] text-white text-[10px] font-light px-5 py-2.5 rounded-lg uppercase tracking-widest shadow-lg shadow-[#0a3d62]/20">
                    Plano Pro
                 </span>
                 <div className="text-right">
                    <span className="text-4xl font-light text-[#0a3d62] italic">R$ 249</span>
                 </div>
              </div>

              <div className="space-y-5 mb-12 border-t border-slate-100 pt-8">
                 <div className="flex justify-between text-[11px] font-light">
                    <span className="text-slate-400 uppercase tracking-widest">Dentistas</span>
                    <span className="text-[#0a3d62]">2 de 4</span>
                 </div>
                 <div className="flex justify-between text-[11px] font-light">
                    <span className="text-slate-400 uppercase tracking-widest">Próxima cobrança</span>
                    <span className="text-slate-600">01/05/2026</span>
                 </div>
              </div>

              <button className="w-full bg-[#0a3d62] text-white py-5 rounded-xl text-[11px] font-light uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center justify-center gap-4 active:scale-[0.98] shadow-xl shadow-[#0a3d62]/10" title="Ver opções de upgrade">
                 <TrendingUp size={18} /> Fazer upgrade
              </button>
           </div>

            <div className="space-y-5">
              <h3 className="text-xs font-light text-[#0a3d62] uppercase tracking-[0.1em]">Histórico de Pagamentos</h3>
              <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm flex items-center justify-between group hover:border-[#7ed6df]/50 transition-all cursor-pointer">
                 <div>
                    <p className="text-sm font-light text-[#0a3d62] italic">R$ 249,00</p>
                    <p className="text-[10px] font-light text-slate-400 mt-1 uppercase">01/04/2026</p>
                 </div>
                 <span className="bg-emerald-50 text-emerald-600 text-[9px] font-light px-4 py-1.5 rounded-full uppercase tracking-widest border border-emerald-100">
                    Aprovado
                 </span>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceiroView;
