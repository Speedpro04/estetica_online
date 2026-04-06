import React, { useState } from 'react';
import { Patient, PatientStatus } from '../types';
import { ChevronRight, MessageSquare, Clock, User, UserMinus, TrendingUp, MessageCircle, DollarSign, Activity, AlertTriangle, Zap, X, Send, Users } from 'lucide-react';
import toast from 'react-hot-toast';

interface PainelViewProps {
  patients: Patient[];
  onUpdateStatus: (id: string, status: PatientStatus) => void;
  onOpenPatient: (id: string) => void;
}

const PainelView: React.FC<PainelViewProps> = ({ patients, onUpdateStatus, onOpenPatient }) => {
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    name: 'Recuperação — Pacientes 6+ Meses',
    channel: 'whatsapp',
    targetCount: '15',
    message: 'Olá! Percebemos que faz tempo desde sua última visita. Gostaríamos de convidá-lo(a) para retomar seu tratamento. Agende sua consulta conosco! 🦷',
  });

  const handleLaunchCampaign = () => {
    if (!campaignForm.name.trim()) {
      toast.error('Informe o nome da campanha.');
      return;
    }
    toast.success(`Campanha "${campaignForm.name}" iniciada com sucesso! ${campaignForm.targetCount} pacientes serão contactados.`);
    setIsCampaignModalOpen(false);
  };

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
    <div className="space-y-8 animate-in fade-in duration-700 font-inter">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-light text-[#0a3d62] tracking-tight uppercase">Painel</h2>
        <p className="text-[#57606f] text-sm font-light uppercase tracking-widest mt-2 opacity-70">Acompanhe o fluxo de pacientes de hoje</p>
      </div>

      {/* Alerta Inteligente da IA */}
      <div className="bg-gradient-to-r from-[#0a3d62] to-[#0c4f7d] rounded-2xl px-8 py-5 flex flex-col md:flex-row items-center gap-5 border-2 border-[#ff7675]/30 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[#ff7675]/5 pointer-events-none" />
        <div className="p-3 bg-[#ff7675]/20 rounded-xl border border-[#ff7675]/30 backdrop-blur-sm shrink-0">
          <Zap size={24} className="text-[#ff7675]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-light text-[#ff7675] uppercase tracking-[0.2em] mb-2">Alerta da IA — Ação Recomendada</p>
          <p className="text-base font-light text-slate-200 leading-snug">
            <span className="font-light text-white">15 pacientes</span> estão há mais de 6 meses sem retorno.
            Existe alto risco de abandono de tratamento. Recomendamos iniciar campanha de recuperação.
          </p>
        </div>
        <button 
          onClick={() => setIsCampaignModalOpen(true)}
          className="shrink-0 bg-[#ff7675] text-white px-7 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:brightness-110 shadow-lg shadow-[#ff7675]/30 transition-all whitespace-nowrap active:scale-95"
        >
          Iniciar Campanha Automática
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className={`bg-white rounded-2xl p-6 border ${kpi.border} shadow-sm relative overflow-hidden group hover:shadow-md transition-all`}>
            <div className={`inline-flex p-3 rounded-xl ${kpi.bg} mb-4`}>
              <kpi.icon size={20} className={kpi.color} />
            </div>
            <p className="text-[10px] font-light text-slate-400 uppercase tracking-widest leading-tight mb-2">{kpi.label}</p>
            <h3 className={`text-2xl font-light ${kpi.color} leading-none`}>{kpi.value}</h3>
            <p className="text-[9px] font-light text-slate-400 mt-2 uppercase tracking-tight opacity-70 leading-tight">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Kanban de Fluxo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {columns.map((column) => {
          const columnPatients = patients.filter(p => p.status === column.status);
          return (
            <div key={column.status} className="flex flex-col gap-5">
              <div className="flex items-center justify-between px-5 py-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-xs font-light text-[#0a3d62] uppercase tracking-[0.1em]">{column.title}</h3>
                <span className="bg-slate-100 text-slate-500 text-[11px] font-light px-3 py-1 rounded-full">{columnPatients.length}</span>
              </div>

              <div className="flex flex-col gap-4">
                {columnPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                  >
                    {/* Top Section: Risk & Time */}
                    <div className="flex justify-between items-start mb-5">
                      <span className={`text-[9px] font-light px-3 py-1.5 rounded-md border ${getRiskColor(patient.risk)} uppercase tracking-widest`}>
                        {patient.risk}
                      </span>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={14} />
                        <span className="text-[11px] font-light">09:00</span>
                      </div>
                    </div>

                    {/* Middle Section: Patient Details */}
                    <div onClick={() => onOpenPatient(patient.id)} className="cursor-pointer mb-6">
                      <h4 className="text-base font-light text-[#0a3d62] tracking-tight group-hover:text-[#ff7675] transition-colors">
                        {patient.name}
                      </h4>
                      <p className="text-[11px] font-light text-slate-400 uppercase tracking-widest mt-1.5">
                        {patient.specialty || 'Consulta Geral'}
                      </p>
                    </div>

                    {/* Bottom Section: Action */}
                    <div className="flex items-center gap-3">
                      <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-[#0a3d62] transition-all" title={`Enviar mensagem para ${patient.name}`}>
                        <MessageSquare size={18} />
                      </button>

                      {getNextStatus(patient.status) && (
                        <button
                          onClick={() => onUpdateStatus(patient.id, getNextStatus(patient.status)!)}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-light uppercase tracking-widest transition-all ${getButtonColor(patient.status)} active:scale-95`}
                          title={`Mover ${patient.name} para o próximo status`}
                        >
                          {getButtonLabel(patient.status)}
                          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {columnPatients.length === 0 && (
                  <div className="py-12 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center opacity-30 grayscale">
                    <User size={32} className="text-slate-300" />
                    <span className="text-[9px] font-medium uppercase tracking-widest mt-2">Sem pacientes</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Campanha Automática */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6" onClick={() => setIsCampaignModalOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 fade-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setIsCampaignModalOpen(false)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-600 transition-colors rounded-xl hover:bg-slate-50">
              <X size={20} />
            </button>

            <div className="flex items-center gap-5 mb-8">
              <div className="p-4 bg-[#ff7675]/10 rounded-xl border border-[#ff7675]/20">
                <Zap size={28} className="text-[#ff7675]" />
              </div>
              <div>
                <h3 className="text-2xl font-light text-[#0a3d62] tracking-tight">Campanha Automática</h3>
                <p className="text-sm font-light text-slate-400">Configure e inicie a campanha de recuperação</p>
              </div>
            </div>

            <div className="bg-[#ff7675]/5 border border-[#ff7675]/15 rounded-2xl p-6 mb-8 flex items-center gap-4">
              <Users size={22} className="text-[#ff7675] shrink-0" />
              <p className="text-sm font-light text-slate-600">
                <span className="font-light text-[#ff7675]">{campaignForm.targetCount} pacientes</span> identificados pela IA com risco de abandono serão impactados por esta campanha.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="campaign-name" className="text-[11px] font-light text-slate-500 uppercase tracking-widest mb-2 block">Nome da campanha</label>
                <input
                  id="campaign-name"
                  type="text"
                  className="w-full border border-slate-200 rounded-xl px-5 py-4 text-base font-light text-[#0a3d62] outline-none focus:border-[#7ed6df] transition-all"
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                  title="Nome da campanha"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="campaign-channel" className="text-[11px] font-light text-slate-500 uppercase tracking-widest mb-2 block">Canal</label>
                  <select
                    id="campaign-channel"
                    title="Canal de envio"
                    className="w-full border border-slate-200 rounded-xl px-5 py-4 text-base font-light text-[#0a3d62] outline-none focus:border-[#7ed6df] transition-all bg-white"
                    value={campaignForm.channel}
                    onChange={(e) => setCampaignForm({ ...campaignForm, channel: e.target.value })}
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="sms">SMS</option>
                    <option value="email">E-mail</option>
                    <option value="multi">Multicanal</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="campaign-target" className="text-[11px] font-light text-slate-500 uppercase tracking-widest mb-2 block">Pacientes alvo</label>
                  <input
                    id="campaign-target"
                    type="text"
                    className="w-full border border-slate-200 rounded-xl px-5 py-4 text-base font-light text-[#0a3d62] outline-none focus:border-[#7ed6df] transition-all bg-slate-50 font-light"
                    value={`${campaignForm.targetCount} pacientes`}
                    readOnly
                    title="Quantidade de pacientes alvo"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="campaign-message" className="text-[11px] font-light text-slate-500 uppercase tracking-widest mb-2 block">Mensagem de convite</label>
                <textarea
                  id="campaign-message"
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl px-5 py-4 text-base font-light text-[#0a3d62] outline-none focus:border-[#7ed6df] transition-all resize-none"
                  value={campaignForm.message}
                  onChange={(e) => setCampaignForm({ ...campaignForm, message: e.target.value })}
                  title="Conteúdo da mensagem"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => setIsCampaignModalOpen(false)}
                className="flex-1 py-4 border border-slate-200 rounded-xl text-[11px] font-light uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                title="Cancelar campanha"
              >
                Cancelar
              </button>
              <button
                onClick={handleLaunchCampaign}
                className="flex-1 py-4 bg-[#ff7675] text-white rounded-xl text-[11px] font-light uppercase tracking-widest hover:brightness-110 shadow-lg shadow-[#ff7675]/30 transition-all flex items-center justify-center gap-3 active:scale-95"
                title="Sincronizar e iniciar campanha"
              >
                <Send size={18} /> Iniciar Campanha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PainelView;
