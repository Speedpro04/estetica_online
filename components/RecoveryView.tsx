import React from 'react';
import { UserMinus, Send, Calendar, MessageCircle, TrendingUp, AlertCircle, DollarSign, Activity, Brain, Phone, Mail, MessageSquare } from 'lucide-react';

const SCORE_STYLES: Record<string, { label: string; cls: string }> = {
  CRITICO:  { label: 'Crítico',  cls: 'bg-rose-100 text-rose-700 border-rose-200' },
  ALTO:     { label: 'Alto',     cls: 'bg-orange-100 text-orange-700 border-orange-200' },
  MODERADO: { label: 'Moderado', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  BAIXO:    { label: 'Baixo',    cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  WhatsApp: <MessageCircle size={13} className="text-emerald-500" />,
  SMS:      <Phone size={13} className="text-blue-500" />,
  Email:    <Mail size={13} className="text-slate-500" />,
  '--':     <span className="text-slate-300 text-xs">—</span>,
};

const RecoveryView: React.FC = () => {
  const recoveryList = [
    {
      id: '1', name: 'Marcos Vinícius', lastVisit: '15/07/2024',
      status: 'Faltou', score: 'CRITICO', attempts: 2,
      lastContact: '12/03', channel: 'WhatsApp',
      suggestion: 'Enviar convite urgente para revisão',
    },
    {
      id: '2', name: 'Helena Costa', lastVisit: '10/08/2024',
      status: 'Sem agendamento', score: 'ALTO', attempts: 1,
      lastContact: '18/03', channel: 'SMS',
      suggestion: 'Campanha de limpeza preventiva',
    },
    {
      id: '3', name: 'Sérgio Ramos', lastVisit: '22/06/2024',
      status: 'Revisão pendente', score: 'CRITICO', attempts: 3,
      lastContact: '05/03', channel: 'WhatsApp',
      suggestion: 'Oferecer horário prioritário',
    },
    {
      id: '4', name: 'Larissa Manoela', lastVisit: '05/09/2024',
      status: 'Desmarcou', score: 'BAIXO', attempts: 0,
      lastContact: '--', channel: '--',
      suggestion: 'Primeiro contato via WhatsApp',
    },
    {
      id: '5', name: 'Ana Souza', lastVisit: '01/08/2024',
      status: 'Revisão pendente', score: 'ALTO', attempts: 2,
      lastContact: '20/03', channel: 'Email',
      suggestion: 'Reforçar retorno pós-tratamento',
    },
    {
      id: '6', name: 'João Martins', lastVisit: '15/06/2024',
      status: 'Sem agendamento', score: 'CRITICO', attempts: 1,
      lastContact: '10/03', channel: 'WhatsApp',
      suggestion: 'Campanha implante — revisão urgente',
    },
    {
      id: '7', name: 'Fabiana Lima', lastVisit: '12/09/2024',
      status: 'Desmarcou', score: 'MODERADO', attempts: 1,
      lastContact: '22/03', channel: 'SMS',
      suggestion: 'Enviar convite para clareamento',
    },
  ];

  const kpis = [
    { label: 'TAXA DE ABANDONO',       value: '18.4%',     sub: '-2.1% vs mês anterior',       icon: UserMinus,    color: 'text-amber-500',  bg: 'bg-amber-50' },
    { label: 'CONVITES ENVIADOS',       value: '142',       sub: '85% entrega via WhatsApp',    icon: MessageCircle, color: 'text-blue-500',  bg: 'bg-blue-50' },
    { label: 'PACIENTES RECUPERADOS',  value: '24',        sub: 'Retornaram este mês',          icon: TrendingUp,   color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'FATURAMENTO RECUPERADO', value: 'R$ 12.480', sub: 'Receita reativada',            icon: DollarSign,   color: 'text-violet-500', bg: 'bg-violet-50' },
    { label: 'TAXA DE RECUPERAÇÃO',    value: '28%',       sub: 'Dos pacientes pós-campanha',  icon: Activity,     color: 'text-[#ff7675]', bg: 'bg-rose-50' },
    { label: 'PACIENTES EM RISCO',     value: '32',        sub: 'Podem abandonar tratamento',  icon: AlertCircle,  color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-montserrat">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-[#0a3d62] tracking-tighter uppercase italic">Recuperação de Pacientes</h2>
        <p className="text-[#57606f] text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">Reative pacientes ausentes com auxílio da IA</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className={`inline-flex p-2 rounded-xl ${kpi.bg} mb-3`}>
              <kpi.icon size={16} className={kpi.color} />
            </div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-tight">{kpi.label}</p>
            <h3 className={`text-xl font-black ${kpi.color} leading-none`}>{kpi.value}</h3>
            <p className="text-[8px] font-bold text-slate-400 mt-1.5 uppercase tracking-tight opacity-70 leading-tight">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Recovery Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div>
            <h3 className="text-[11px] font-black text-[#0a3d62] uppercase tracking-[0.1em]">Pacientes Prioritários para Recuperação</h3>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-70">Score IA identifica urgência automaticamente</p>
          </div>
          <button className="text-[9px] font-black uppercase text-[#0fbcf9] hover:underline">Ver todos os 85 pacientes</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-5 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">Paciente</th>
                <th className="px-5 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">Última Visita</th>
                <th className="px-5 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">Motivo</th>
                <th className="px-5 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">Score IA</th>
                <th className="px-5 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">Último Contato</th>
                <th className="px-5 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">Canal</th>
                <th className="px-5 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">Sugestão IA</th>
                <th className="px-5 py-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recoveryList.map((p, i) => {
                const score = SCORE_STYLES[p.score] ?? SCORE_STYLES['BAIXO'];
                return (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-[#0a3d62] italic">{p.name}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">{p.attempts} tentativa{p.attempts !== 1 ? 's' : ''}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[10px] font-bold text-slate-500 whitespace-nowrap">{p.lastVisit}</td>
                    <td className="px-5 py-4 text-[9px] font-black uppercase tracking-wide text-[#0a3d62] opacity-60">{p.status}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${score.cls}`}>
                        {score.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[9px] font-bold text-slate-500">{p.lastContact}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        {CHANNEL_ICONS[p.channel]}
                        <span className="text-[9px] font-bold text-slate-500">{p.channel}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Brain size={11} className="text-[#ff7675] shrink-0" />
                        <span className="text-[8px] font-bold text-slate-600 leading-tight">{p.suggestion}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all" title="Enviar Convite">
                          <Send size={14} />
                        </button>
                        <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 transition-all" title="Agendar Manual">
                          <Calendar size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Suggestion Card */}
      <div className="bg-[#0a3d62] rounded-2xl p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-8 border-2 border-[#ff7675]/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff7675]/10 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
          <Brain size={32} className="text-[#ff7675]" />
        </div>
        <div className="flex-1 space-y-2">
          <h4 className="text-[10px] font-black text-[#ff7675] uppercase tracking-[0.2em]">Dica do Assistente Solara</h4>
          <p className="text-sm font-medium text-slate-200 leading-relaxed italic">
            "Pacientes que faltaram há mais de 6 meses têm 40% mais chance de retornar se o convite mencionar o mesmo procedimento da última visita.
            Detectamos <strong className="text-white not-italic">12 pacientes</strong> neste perfil hoje."
          </p>
        </div>
        <button className="bg-[#ff7675] text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-[#ff7675]/20 transition-all whitespace-nowrap">
          Executar Campanha IA
        </button>
      </div>
    </div>
  );
};

export default RecoveryView;
