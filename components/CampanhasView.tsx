import React, { useState } from 'react';
import { Megaphone, Brain, Play, CheckCircle2, BarChart2, Users, Send, Clock, TrendingUp, Zap, MessageCircle, Sparkles, ChevronRight } from 'lucide-react';

type CampanhaStatus = 'sugerida' | 'ativa' | 'concluida';

interface Campanha {
  id: string;
  tipo: string;
  descricao: string;
  pacientes: number;
  status: CampanhaStatus;
  canal: string;
  taxa?: string;
  recuperados?: number;
  iniciada?: string;
}

const CANAL_COLOR: Record<string, string> = {
  WhatsApp: 'text-emerald-500 bg-emerald-50',
  SMS:      'text-blue-500 bg-blue-50',
  Email:    'text-slate-500 bg-slate-50',
};

const CampanhasView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'sugeridas' | 'ativas' | 'resultados'>('sugeridas');

  const campanhasSugeridas: Campanha[] = [
    {
      id: 'c1', tipo: 'Revisão Odontológica', pacientes: 12, status: 'sugerida', canal: 'WhatsApp',
      descricao: '12 pacientes estão há mais de 6 meses sem retorno. Alta probabilidade de reengajamento.',
    },
    {
      id: 'c2', tipo: 'Limpeza Preventiva', pacientes: 8, status: 'sugerida', canal: 'SMS',
      descricao: '8 pacientes com limpeza atrasada. Ideal para início de trimestre.',
    },
    {
      id: 'c3', tipo: 'Clareamento / Estética', pacientes: 5, status: 'sugerida', canal: 'WhatsApp',
      descricao: '5 pacientes que demonstraram interesse em procedimentos estéticos anteriormente.',
    },
    {
      id: 'c4', tipo: 'Reativação Pós-Tratamento', pacientes: 18, status: 'sugerida', canal: 'WhatsApp',
      descricao: '18 pacientes com tratamento incompleto ou sem consulta de acompanhamento.',
    },
    {
      id: 'c5', tipo: 'Implante — Revisão Urgente', pacientes: 6, status: 'sugerida', canal: 'WhatsApp',
      descricao: '6 pacientes com implante realizado há mais de 7 meses sem revisão.',
    },
  ];

  const campanhasAtivas: Campanha[] = [
    {
      id: 'a1', tipo: 'Revisão de Rotina', pacientes: 32, status: 'ativa', canal: 'WhatsApp',
      descricao: 'Campanha iniciada em 28/03 com 32 pacientes inativos há 5+ meses.',
      iniciada: '28/03', taxa: '34%', recuperados: 11,
    },
    {
      id: 'a2', tipo: 'Campanha de Ortodontia', pacientes: 15, status: 'ativa', canal: 'SMS',
      descricao: 'Pacientes com aparelho fixo sem retorno há 4 meses.',
      iniciada: '01/04', taxa: '20%', recuperados: 3,
    },
  ];

  const campanhasConcluidas: Campanha[] = [
    {
      id: 'r1', tipo: 'Limpeza — Março', pacientes: 45, status: 'concluida', canal: 'WhatsApp',
      descricao: 'Campanha de limpeza preventiva encerrada com excelente resultado.',
      iniciada: '01/03', taxa: '42%', recuperados: 19,
    },
    {
      id: 'r2', tipo: 'Reativação — Fev', pacientes: 38, status: 'concluida', canal: 'Email',
      descricao: 'Campanha de reativação de pacientes com mais de 8 meses de ausência.',
      iniciada: '01/02', taxa: '18%', recuperados: 7,
    },
    {
      id: 'r3', tipo: 'Implante — Fev', pacientes: 10, status: 'concluida', canal: 'WhatsApp',
      descricao: 'Convites para revisão de implante com alto índice de resposta.',
      iniciada: '10/02', taxa: '60%', recuperados: 6,
    },
  ];

  const sections = [
    { id: 'sugeridas', label: 'Sugeridas pela IA', count: campanhasSugeridas.length, icon: Brain },
    { id: 'ativas',    label: 'Ativas',             count: campanhasAtivas.length,    icon: Play },
    { id: 'resultados',label: 'Resultados',          count: campanhasConcluidas.length,icon: BarChart2 },
  ] as const;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-montserrat">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-[#0a3d62] tracking-tighter uppercase italic">Campanhas Inteligentes</h2>
        <p className="text-[#57606f] text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">
          IA identifica pacientes e dispara campanhas automaticamente
        </p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Campanhas Ativas',     value: '2',      icon: Megaphone,    color: 'text-[#ff7675]', bg: 'bg-rose-50' },
          { label: 'Pacientes Alcançados', value: '47',     icon: Users,        color: 'text-blue-500',  bg: 'bg-blue-50' },
          { label: 'Taxa Média Retorno',   value: '28%',    icon: TrendingUp,   color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Faturamento Gerado',   value: 'R$ 12.480', icon: Zap,      color: 'text-violet-500', bg: 'bg-violet-50' },
        ].map((k, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className={`inline-flex p-2 rounded-xl ${k.bg} mb-3`}>
              <k.icon size={16} className={k.color} />
            </div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-tight">{k.label}</p>
            <h3 className={`text-2xl font-black ${k.color}`}>{k.value}</h3>
          </div>
        ))}
      </div>

      {/* Section Tabs */}
      <div className="flex gap-3">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
              activeSection === s.id
                ? 'bg-[#0a3d62] text-white border-[#0a3d62] shadow-lg'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}
          >
            <s.icon size={14} />
            {s.label}
            <span className={`w-5 h-5 rounded-full text-[8px] font-black flex items-center justify-center ${
              activeSection === s.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {s.count}
            </span>
          </button>
        ))}
      </div>

      {/* Sugeridas */}
      {activeSection === 'sugeridas' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={16} className="text-[#ff7675]" />
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
              IA analisou {campanhasSugeridas.reduce((a, c) => a + c.pacientes, 0)} pacientes e sugere as seguintes campanhas
            </p>
          </div>
          {campanhasSugeridas.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center gap-5 hover:shadow-md transition-all group">
              <div className="p-3 bg-[#ff7675]/10 rounded-xl border border-[#ff7675]/20">
                <Megaphone size={22} className="text-[#ff7675]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h4 className="text-[12px] font-black text-[#0a3d62] uppercase tracking-tight">{c.tipo}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest ${CANAL_COLOR[c.canal] ?? 'text-slate-500 bg-slate-50'}`}>
                    {c.canal}
                  </span>
                </div>
                <p className="text-[9px] font-medium text-slate-500 leading-relaxed">{c.descricao}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Users size={11} className="text-slate-400" />
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{c.pacientes} pacientes selecionados pela IA</span>
                </div>
              </div>
              <button className="shrink-0 flex items-center gap-2 bg-[#0a3d62] text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#ff7675] transition-all shadow-sm">
                <Sparkles size={13} />
                Executar com IA
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Ativas */}
      {activeSection === 'ativas' && (
        <div className="space-y-4">
          {campanhasAtivas.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <Play size={22} className="text-emerald-500" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="text-[12px] font-black text-[#0a3d62] uppercase tracking-tight">{c.tipo}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest ${CANAL_COLOR[c.canal] ?? 'text-slate-500 bg-slate-50'}`}>
                      {c.canal}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700">
                      Em andamento
                    </span>
                  </div>
                  <p className="text-[9px] font-medium text-slate-500">{c.descricao}</p>
                </div>
                <div className="flex gap-6 shrink-0 text-center">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Pacientes</p>
                    <p className="text-xl font-black text-[#0a3d62]">{c.pacientes}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Retornaram</p>
                    <p className="text-xl font-black text-emerald-500">{c.recuperados}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Taxa</p>
                    <p className="text-xl font-black text-[#ff7675]">{c.taxa}</p>
                  </div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-5">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Progresso da campanha</span>
                  <span className="text-[8px] font-black text-emerald-500">{c.taxa}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all"
                    style={{ width: c.taxa }}
                  />
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <Clock size={10} className="text-slate-400" />
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Iniciada em {c.iniciada}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resultados */}
      {activeSection === 'resultados' && (
        <div className="space-y-4">
          {/* Summary bar */}
          <div className="bg-gradient-to-r from-[#0a3d62] to-[#0c4f7d] rounded-2xl p-6 text-white flex flex-wrap gap-8 border-2 border-[#82ccdd]/20">
            {[
              { label: 'Campanhas concluídas', value: campanhasConcluidas.length.toString() },
              { label: 'Total de pacientes', value: campanhasConcluidas.reduce((a,c)=>a+c.pacientes,0).toString() },
              { label: 'Pacientes recuperados', value: campanhasConcluidas.reduce((a,c)=>a+(c.recuperados||0),0).toString() },
              { label: 'Faturamento estimado', value: 'R$ 18.200' },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-[8px] font-black text-[#82ccdd] uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-2xl font-black text-white">{s.value}</p>
              </div>
            ))}
          </div>

          {campanhasConcluidas.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <CheckCircle2 size={22} className="text-slate-400" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="text-[12px] font-black text-[#0a3d62] uppercase tracking-tight">{c.tipo}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest ${CANAL_COLOR[c.canal] ?? 'text-slate-500 bg-slate-50'}`}>
                      {c.canal}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest bg-slate-100 text-slate-500">
                      Concluída
                    </span>
                  </div>
                  <p className="text-[9px] font-medium text-slate-500">{c.descricao}</p>
                </div>
                <div className="flex gap-6 shrink-0 text-center">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Pacientes</p>
                    <p className="text-xl font-black text-[#0a3d62]">{c.pacientes}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Recuperados</p>
                    <p className="text-xl font-black text-emerald-500">{c.recuperados}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Taxa</p>
                    <p className="text-xl font-black text-[#ff7675]">{c.taxa}</p>
                  </div>
                </div>
              </div>
              {/* Completed bar */}
              <div className="mt-5">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-gradient-to-r from-slate-300 to-slate-400 rounded-full transition-all"
                    style={{ width: c.taxa }}
                  />
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <Clock size={10} className="text-slate-400" />
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Iniciada em {c.iniciada}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampanhasView;
