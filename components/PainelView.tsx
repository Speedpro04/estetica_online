import React from 'react';
import { Patient, PatientStatus } from '../types';
import { ChevronRight, MessageSquare, Clock, User, UserMinus, TrendingUp, MessageCircle, DollarSign, Activity, AlertTriangle, Zap } from 'lucide-react';

interface PainelViewProps {
  patients: Patient[];
  onUpdateStatus: (id: string, status: PatientStatus) => void;
  onOpenPatient: (id: string) => void;
}

const PainelView: React.FC<PainelViewProps> = ({ patients, onUpdateStatus, onOpenPatient }) => {
  const columns = [
    { title: 'Agendados', status: PatientStatus.SCHEDULED, color: 'border-slate-200' },
    { title: 'Confirmados', status: PatientStatus.CONFIRMED, color: 'border-slate-200' },
    { title: 'Em Espera', status: PatientStatus.WAITING, color: 'border-slate-200' },
    { title: 'Em Atendimento', status: PatientStatus.ATTENDING, color: 'border-slate-200' },
  ];

  const kpis = [
    {
      label: 'TAXA DE ABANDONO',
      value: '18.4%',
      sub: '-2.1% este mês',
      icon: UserMinus,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      label: 'CONVITES ENVIADOS',
      value: '142',
      sub: '85% entrega via WhatsApp',
      icon: MessageCircle,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      label: 'PACIENTES RECUPERADOS',
      value: '24',
      sub: 'Este mês',
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      label: 'FATURAMENTO RECUPERADO',
      value: 'R$ 12.480',
      sub: 'Receita reativada',
      icon: DollarSign,
      color: 'text-violet-500',
      bg: 'bg-violet-50',
      border: 'border-violet-100',
    },
    {
      label: 'TAXA DE RECUPERAÇÃO',
      value: '28%',
      sub: 'Pós-campanha automática',
      icon: Activity,
      color: 'text-[#ff7675]',
      bg: 'bg-rose-50',
      border: 'border-rose-100',
    },
    {
      label: 'PACIENTES EM RISCO',
      value: '32',
      sub: 'Podem abandonar tratamento',
      icon: AlertTriangle,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      border: 'border-orange-100',
    },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'BAIXO': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'MEDIO': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'ALTO': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const getButtonColor = (status: PatientStatus) => {
    switch (status) {
      case PatientStatus.SCHEDULED: return 'bg-[#00b894] text-white hover:brightness-110';
      default: return 'bg-[#786fa6] text-white hover:brightness-110';
    }
  };

  const getButtonLabel = (status: PatientStatus) => {
    switch (status) {
      case PatientStatus.SCHEDULED: return 'Confirmar';
      default: return 'Avançar';
    }
  };

  const getNextStatus = (current: PatientStatus): PatientStatus | null => {
    switch (current) {
      case PatientStatus.SCHEDULED: return PatientStatus.CONFIRMED;
      case PatientStatus.CONFIRMED: return PatientStatus.WAITING;
      case PatientStatus.WAITING: return PatientStatus.ATTENDING;
      case PatientStatus.ATTENDING: return PatientStatus.FINISHED;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-montserrat">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-[#0a3d62] tracking-tighter uppercase italic">Painel</h2>
        <p className="text-[#57606f] text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">Acompanhe o fluxo de pacientes de hoje</p>
      </div>

      {/* Alerta Inteligente da IA */}
      <div className="bg-gradient-to-r from-[#0a3d62] to-[#0c4f7d] rounded-2xl px-8 py-5 flex flex-col md:flex-row items-center gap-5 border-2 border-[#ff7675]/30 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[#ff7675]/5 pointer-events-none" />
        <div className="p-3 bg-[#ff7675]/20 rounded-xl border border-[#ff7675]/30 backdrop-blur-sm shrink-0">
          <Zap size={24} className="text-[#ff7675]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black text-[#ff7675] uppercase tracking-[0.2em] mb-1">Alerta da IA — Ação Recomendada</p>
          <p className="text-sm font-medium text-slate-200 leading-snug">
            <span className="font-black text-white">15 pacientes</span> estão há mais de 6 meses sem retorno.
            Existe alto risco de abandono de tratamento. Recomendamos iniciar campanha de recuperação.
          </p>
        </div>
        <button className="shrink-0 bg-[#ff7675] text-white px-7 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-[#ff7675]/30 transition-all whitespace-nowrap">
          Iniciar Campanha Automática
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className={`bg-white rounded-2xl p-5 border ${kpi.border} shadow-sm relative overflow-hidden group hover:shadow-md transition-all`}>
            <div className={`inline-flex p-2 rounded-xl ${kpi.bg} mb-3`}>
              <kpi.icon size={16} className={kpi.color} />
            </div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-tight mb-1">{kpi.label}</p>
            <h3 className={`text-xl font-black ${kpi.color} leading-none`}>{kpi.value}</h3>
            <p className="text-[8px] font-bold text-slate-400 mt-1.5 uppercase tracking-tight opacity-70 leading-tight">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Kanban de Fluxo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {columns.map((column) => {
          const columnPatients = patients.filter(p => p.status === column.status);
          return (
            <div key={column.status} className="flex flex-col gap-5">
              <div className="flex items-center justify-between px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-[11px] font-black text-[#0a3d62] uppercase tracking-[0.1em]">{column.title}</h3>
                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">{columnPatients.length}</span>
              </div>

              <div className="flex flex-col gap-4">
                {columnPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                  >
                    {/* Top Section: Risk & Time */}
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-[8px] font-black px-2 py-1 rounded-md border ${getRiskColor(patient.risk)} uppercase tracking-widest`}>
                        {patient.risk}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock size={12} />
                        <span className="text-[10px] font-bold">09:00</span>
                      </div>
                    </div>

                    {/* Middle Section: Patient Details */}
                    <div onClick={() => onOpenPatient(patient.id)} className="cursor-pointer mb-5">
                      <h4 className="text-sm font-black text-[#0a3d62] tracking-tight group-hover:text-[#ff7675] transition-colors">
                        {patient.name}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {patient.specialty || 'Consulta Geral'}
                      </p>
                    </div>

                    {/* Bottom Section: Action */}
                    <div className="flex items-center gap-2">
                      <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-[#0a3d62] transition-all">
                        <MessageSquare size={16} />
                      </button>

                      {getNextStatus(patient.status) && (
                        <button
                          onClick={() => onUpdateStatus(patient.id, getNextStatus(patient.status)!)}
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${getButtonColor(patient.status)}`}
                        >
                          {getButtonLabel(patient.status)}
                          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {columnPatients.length === 0 && (
                  <div className="py-12 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center opacity-30 grayscale">
                    <User size={32} className="text-slate-300" />
                    <span className="text-[9px] font-bold uppercase tracking-widest mt-2">Sem pacientes</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PainelView;
