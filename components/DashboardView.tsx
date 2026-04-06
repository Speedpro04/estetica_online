
import React, { useState } from 'react';
import { TrendingUp, Users, DollarSign, Clock, ChevronRight, Sun, Layers, MessageSquare, CheckCircle2, HelpCircle } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { Patient, PatientStatus, Appointment } from '../types';
import AIReportModal from './AIReportModal';

const dataPerformance = [
  { name: 'Seg', v: 4200 },
  { name: 'Ter', v: 3800 },
  { name: 'Qua', v: 4500 },
  { name: 'Qui', v: 4100 },
  { name: 'Sex', v: 5200 },
  { name: 'Sab', v: 2100 },
];

interface DashboardViewProps {
  patients: Patient[];
  appointments: Appointment[];
  onOpenPatient: (id: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ patients, appointments, onOpenPatient }) => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  
  const confirmedCount = patients.filter(p => [PatientStatus.TRIAGE, PatientStatus.ATTENDING].includes(p.status)).length;
  const waitingConfirmation = patients.filter(p => p.status === PatientStatus.WAITING).length;
  const specialHourCount = appointments.filter(a => a.isSpecialHour).length;

  const reportData = {
    totalPatients: patients.length,
    waiting: waitingConfirmation,
    specialHours: specialHourCount,
    performanceData: dataPerformance,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-inter">
      <AIReportModal 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
        data={reportData} 
      />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-light text-solara-primary tracking-tighter uppercase leading-none">Dashboard Operacional</h1>
          <p className="text-solara-text1 text-sm font-light uppercase tracking-[0.2em] mt-3">Solara Connect • Gestão Inteligente</p>
        </div>
        <div className="bg-white solara-border px-4 py-2 flex items-center gap-3 shadow-md">
          <Layers size={14} className="text-solara-accent2" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-solara-primary">Unidade Atendimento Geral</span>
        </div>
      </div>

      {/* Indicadores Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: 'Consultas Hoje', val: '24', icon: Users, color: 'text-solara-primary', bg: 'bg-solara-primary/10' },
          { label: 'Confirmados', val: confirmedCount.toString(), icon: CheckCircle2, color: 'text-solara-accent2', bg: 'bg-solara-accent2/10' },
          { label: 'Plantão IA', val: specialHourCount.toString(), icon: Clock, color: 'text-[#e55039]', bg: 'bg-[#e55039]/10' },
          { label: 'Aguardando Conf.', val: waitingConfirmation.toString(), icon: HelpCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Mensagens WhatsApp', val: '142', icon: MessageSquare, color: 'text-solara-accent1', bg: 'bg-solara-accent1/10' },
        ].map((stat, i) => (
          <div key={i} className="solara-card p-6 animate-stagger-item" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex justify-between items-start mb-6">
              <div className={`${stat.bg} p-3 rounded-solara ${stat.color} transition-transform hover:rotate-6`}>
                <stat.icon size={24} />
              </div>
              <span className="text-solara-accent2 text-[10px] font-light bg-solara-accent2/10 px-3 py-1 rounded-solara border border-solara-accent2/20 uppercase tracking-tighter">Live</span>
            </div>
            <p className="text-solara-text1 text-[11px] font-light uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <h3 className="text-3xl font-light text-solara-primary tracking-tighter">{stat.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico principal */}
        <div className="lg:col-span-2 bg-white solara-card p-8 animate-stagger-item" style={{ animationDelay: '400ms' }}>
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-light text-solara-primary text-sm uppercase tracking-[0.2em]">Fluxo de Atendimentos</h3>
            <div className="bg-solara-bg/30 p-1.5 rounded-solara flex gap-2 border-2 border-solara-border/20">
              <button className="px-4 py-2 text-[10px] font-light uppercase tracking-widest rounded-solara bg-white shadow-md text-solara-primary" title="Ver por semana">Semanal</button>
              <button className="px-4 py-2 text-[10px] font-light uppercase tracking-widest text-solara-text1" title="Ver por mês">Mensal</button>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataPerformance}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ccdd" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#82ccdd" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#d1d8e0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#57606f', fontWeight: 800}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #82ccdd', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontWeight: 300, fontSize: '14px', fontFamily: 'Inter' }}
                />
                <Area type="monotone" dataKey="v" stroke="#0a3d62" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card Solara IA */}
        <div className="bg-solara-primary rounded-solara p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl border-2 border-solara-border animate-stagger-item" style={{ animationDelay: '500ms' }}>
          <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-solara-accent2/10 blur-[100px] rounded-full"></div>
          
          <div className="relative z-10">
            <div className="bg-white/20 w-14 h-14 rounded-solara flex items-center justify-center backdrop-blur-md border border-white/20 mb-10">
              <Sun size={28} className="fill-white" />
            </div>
            <h2 className="text-4xl font-light mb-5 tracking-tighter leading-none uppercase italic">Solara IA</h2>
            <p className="text-solara-text2 font-light leading-relaxed mb-10 text-base italic border-l-4 border-solara-accent2 pl-5">
              "Detectamos uma alta demanda por consultas de rotatividade para amanhã. Sugerimos priorizar confirmações via WhatsApp."
            </p>
          </div>

          <button 
            onClick={() => setIsReportOpen(true)}
            className="relative z-10 bg-white text-solara-primary px-8 py-5 rounded-solara font-light hover:scale-[1.02] active:scale-95 transition-all w-full uppercase tracking-[0.2em] text-[11px] shadow-xl border border-solara-border"
            title="Ver relatório estratégico detalhado"
          >
            Ver Análise Estratégica
          </button>
        </div>
      </div>

      <div className="bg-white solara-card overflow-hidden animate-stagger-item" style={{ animationDelay: '600ms' }}>
          <div className="p-6 border-b border-solara-border/20 flex justify-between items-center bg-solara-bg/10">
            <h3 className="font-light text-solara-primary uppercase tracking-[0.2em] text-[11px]">Próximos em Fila</h3>
            <button className="text-solara-accent1 text-[10px] font-light uppercase tracking-widest hover:underline" title="Ir para gerenciamento de fluxo">Gerenciar Fluxo</button>
          </div>
          <div className="divide-y-2 divide-solara-border/10">
            {patients.slice(0, 4).map((p) => {
              const app = appointments.find(a => a.patientId === p.id);
              return (
                <div key={p.id} className="p-5 flex items-center justify-between hover:bg-solara-bg/20 transition-all cursor-pointer group" onClick={() => onOpenPatient(p.id)}>
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-solara flex items-center justify-center font-black text-white shadow-lg ${p.isUrgent ? 'bg-solara-accent1' : 'bg-solara-primary'}`}>
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-light text-solara-primary tracking-tighter group-hover:text-solara-accent1 transition-colors uppercase">{p.name}</p>
                        {app?.isSpecialHour && (
                          <span className="text-[7px] font-black bg-[#e55039]/10 text-[#e55039] px-2 py-0.5 rounded-full border border-[#e55039]/30 uppercase tracking-widest animate-pulse">Plantão</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] text-solara-text1 font-bold uppercase tracking-widest">{p.specialty || 'Clínica Geral'}</span>
                        <span className="w-1 h-1 bg-solara-border rounded-full"></span>
                        <span className="text-[9px] text-solara-text1 font-bold uppercase tracking-widest">{p.insurance}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-solara-border group-hover:text-solara-accent1 group-hover:translate-x-1 transition-all" />
                </div>
              );
            })}
          </div>
      </div>
    </div>
  );
};

export default DashboardView;
