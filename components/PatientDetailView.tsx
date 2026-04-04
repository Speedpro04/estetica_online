
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Phone, 
  Plus, 
  Sun,
  Clock,
  ExternalLink,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { Patient, MedicalRecord } from '../types';
import { useAxosStore } from '../store';
import { useAIAnalysis } from '../hooks/useAIAnalysis';
import { usePageAnalytics } from '../hooks/usePageAnalytics';
import { AILoadingIndicator } from './LoadingStates';
import toast from 'react-hot-toast';

interface PatientDetailViewProps {
  patient: Patient;
  onBack: () => void;
  onUpdate: (patient: Patient) => Promise<void>;
}

const PatientDetailView: React.FC<PatientDetailViewProps> = ({ patient, onBack, onUpdate }) => {
  const { addMedicalRecord, syncStatus } = useAxosStore();
  const { runSymptomAnalysis, runMedicalSummary, isProcessing } = useAIAnalysis();
  
  const [activeTab, setActiveTab] = useState<'records' | 'history' | 'files'>('records');
  const [newNote, setNewNote] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);

  const noteInputRef = useRef<HTMLTextAreaElement>(null);

  usePageAnalytics('patient-detail', { 
    patientId: patient.id,
    patientName: patient.name,
    hasAlerts: patient.alerts.length > 0
  });

  const saveSymptomsDraft = useDebouncedCallback((text: string) => {
    sessionStorage.setItem(`axos-symptoms-draft-${patient.id}`, text);
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  }, 1000);

  const handleSymptomsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSymptoms(value);
    saveSymptomsDraft(value);
  };

  useEffect(() => {
    const draft = sessionStorage.getItem(`axos-symptoms-draft-${patient.id}`);
    if (draft) setSymptoms(draft);

    const hasSeenIntro = sessionStorage.getItem('solara-intro-seen');
    if (!hasSeenIntro) {
      setTimeout(() => {
        toast('☀️ Olá! Sou a Solara, sua assistente IA. Estou aqui para ajudar!', {
          duration: 4000,
          icon: '☀️',
          position: 'bottom-right',
          style: { background: '#FF9500', color: '#fff', fontWeight: 'bold', borderRadius: '12px' },
        });
        sessionStorage.setItem('solara-intro-seen', 'true');
      }, 2000);
    }
  }, [patient.id]);

  const handleSymptomAnalysis = async () => {
    const result = await runSymptomAnalysis(symptoms, patient.id);
    if (result) {
      setAiInsight(result.reasoning);
      if (result.isUrgent) {
        await onUpdate({ 
          ...patient, 
          isUrgent: true, 
          alerts: Array.from(new Set([...patient.alerts, 'URGÊNCIA SOLARA']))
        });
      }
    }
  };

  const handleSaveNote = async () => {
    if (!newNote) return;
    const record: MedicalRecord = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString('pt-BR'),
      professional: 'Administrador Painel',
      notes: newNote
    };
    await addMedicalRecord(patient.id, record);
    setNewNote('');
  };

  const handleSummarize = async (recordId: string) => {
    const record = patient.history.find(h => h.id === recordId);
    if (!record) return;
    const summary = await runMedicalSummary(record.notes, patient.id);
    if (summary) {
      const updatedHistory = patient.history.map(h => 
        h.id === recordId ? { ...h, summary } : h
      );
      await onUpdate({ ...patient, history: updatedHistory });
    }
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-500 pb-12 font-inter">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-[#7ed6df] transition-all group font-semibold uppercase text-[10px] tracking-widest">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Voltar ao Painel</span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-orange-500/20">
            <Sun size={14} className="sun-pulse fill-white" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Solara Ativa</span>
          </div>
          {syncStatus === 'syncing' && (
            <div className="flex items-center gap-2 bg-orange-50 text-[#FF9500] px-3 py-2 rounded-xl border border-orange-200">
              <Loader2 className="animate-spin h-3 w-3" />
              <span className="text-[9px] font-bold uppercase">Sync</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="premium-gradient p-10 text-center">
              <div className="w-20 h-20 bg-white/10 rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-white backdrop-blur-md border border-white/20">
                {patient.name.charAt(0)}
              </div>
              <h2 className="text-xl font-semibold text-white tracking-tight">{patient.name}</h2>
              <p className="text-[#7ed6df] text-[10px] mt-1 font-bold uppercase tracking-widest">{patient.cpf}</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nascimento</p>
                  <p className="text-sm font-semibold text-[#130f40]">{new Date(patient.birthDate).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contato</p>
                  <p className="text-sm font-semibold text-[#130f40]">{patient.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {patient.alerts && patient.alerts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <h3 className="text-red-700 font-bold text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertTriangle size={14} /> Alertas Críticos
              </h3>
              <div className="space-y-2">
                {patient.alerts.map((alert, i) => (
                  <div key={i} className="bg-white border border-red-200 text-red-700 text-[10px] px-3 py-2 rounded-lg font-bold uppercase tracking-wider">
                    {alert}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 space-y-8">
          <nav className="flex border-b border-slate-200 gap-10">
            {['records', 'history', 'files'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex items-center gap-2 pb-4 text-[10px] font-bold transition-all relative tracking-wider uppercase ${
                  activeTab === tab ? 'text-[#7ed6df]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab === 'records' && <Activity size={16} />}
                {tab === 'history' && <Clock size={16} />}
                {tab === 'files' && <ExternalLink size={16} />}
                {tab === 'records' ? 'Evolução Clínica' : tab === 'history' ? 'Histórico' : 'Arquivos'}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#7ed6df] rounded-t-full"></div>}
              </button>
            ))}
          </nav>

          {activeTab === 'records' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              {/* Card de Triagem Solara - Agora com cor Laranja Original */}
              <div className="bg-[#FF9500] p-8 rounded-2xl shadow-xl relative overflow-hidden border border-white/10 solara-card">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-[60px] rounded-full"></div>
                
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                      <Sun size={22} className="text-[#FF9500] fill-[#FF9500]" />
                    </div>
                    <div>
                      <h3 className="font-black text-white tracking-tight text-base uppercase">Triagem Solara</h3>
                      <p className="text-white/80 text-[9px] font-bold uppercase tracking-widest">Diagnóstico por Inteligência Nativa</p>
                    </div>
                  </div>
                  {isProcessing && <AILoadingIndicator message="Solara Analisando..." variant="compact" />}
                </div>

                <div className="flex flex-col gap-4 relative z-10">
                  <textarea 
                    className="w-full h-28 p-5 bg-white/10 border border-white/20 rounded-xl outline-none focus:border-white focus:bg-white/20 text-white transition-all font-medium text-sm placeholder:text-white/40 resize-none focus:shadow-lg"
                    placeholder="Descreva os sintomas do paciente para análise imediata..."
                    value={symptoms}
                    onChange={handleSymptomsChange}
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-6 flex items-center gap-4">
                      {draftSaved && (
                        <div className="text-[10px] text-white/60 flex items-center gap-1.5 animate-in fade-in">
                          <CheckCircle2 className="w-3 h-3" />
                          Salvo
                        </div>
                      )}
                      {aiInsight && (
                        <div className="text-[10px] text-white font-black italic border-l-2 border-white/50 pl-4 py-0.5 animate-in fade-in uppercase tracking-wider leading-tight">
                          ☀️ Insight: {aiInsight}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={handleSymptomAnalysis}
                      disabled={isProcessing || !symptoms}
                      className="bg-white text-[#FF9500] px-6 py-3.5 rounded-xl font-black flex items-center gap-2 hover:bg-slate-50 transition-all disabled:opacity-30 text-[10px] uppercase tracking-[0.15em] shadow-lg"
                    >
                      {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <Sun size={16} className="fill-[#FF9500]" />}
                      Executar Triagem
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-[#130f40] text-xs uppercase tracking-widest mb-6">Nova Evolução Clínica</h3>
                <textarea 
                  ref={noteInputRef}
                  className="w-full h-40 p-6 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#7ed6df] text-slate-700 transition-all font-medium text-sm leading-relaxed resize-none shadow-inner"
                  placeholder="Relatório clínico detalhado..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <div className="flex justify-end mt-6">
                  <button 
                    onClick={handleSaveNote}
                    disabled={!newNote}
                    className="bg-[#7ed6df] text-[#130f40] px-8 py-3.5 rounded-xl font-bold flex items-center gap-3 hover:brightness-110 transition-all disabled:opacity-50 text-[10px] uppercase tracking-widest shadow-lg shadow-[#7ed6df]/20"
                  >
                    <Plus size={18} /> Salvar Evolução
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {!patient.history || patient.history.length === 0 ? (
                  <div className="text-center py-20 animate-in fade-in">
                    <div className="w-24 h-24 bg-orange-50 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-orange-100">
                      <Sun size={40} className="text-[#FF9500]" />
                    </div>
                    <h3 className="text-[#130f40] font-bold text-lg mb-2">Nenhum registro ainda</h3>
                    <p className="text-slate-500 text-sm mb-2">Inicie a primeira evolução clínica deste paciente.</p>
                    <p className="text-[#FF9500] text-xs font-bold uppercase tracking-wider mb-6">A Solara está pronta para ajudar ☀️</p>
                    <button 
                      onClick={() => noteInputRef.current?.focus()}
                      className="bg-[#7ed6df] text-[#130f40] px-8 py-3.5 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:brightness-110 transition-all shadow-lg shadow-[#7ed6df]/20"
                    >
                      Adicionar Primeiro Registro
                    </button>
                  </div>
                ) : (
                  patient.history.map((record, index) => (
                    <article 
                      key={record.id} 
                      className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-lg overflow-hidden border-l-8 border-l-[#7ed6df] transition-all animate-stagger-item"
                      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
                    >
                      <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-500">
                              <User size={28} />
                            </div>
                            <div>
                              <p className="font-bold text-[#130f40] text-base">{record.professional}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{record.date}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleSummarize(record.id)}
                            disabled={isProcessing}
                            className="text-[10px] font-bold text-[#FF9500] bg-orange-50 px-5 py-3 rounded-xl border border-orange-100 hover:bg-orange-100 transition-all flex items-center gap-2 uppercase tracking-widest shadow-sm"
                          >
                            <Sun size={14} className={isProcessing ? "animate-spin fill-[#FF9500]" : "fill-[#FF9500]"} />
                            {isProcessing ? 'Gerando...' : 'Resumo Solara'}
                          </button>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-xl text-slate-700 text-sm leading-relaxed font-medium border border-slate-100">
                          {record.notes}
                        </div>
                        {record.summary && (
                          <div className="bg-gradient-to-r from-orange-50 to-orange-50/30 border border-orange-200 rounded-xl p-6 mt-6 animate-in zoom-in-95 shadow-sm">
                            <h4 className="text-[#FF9500] text-[9px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Sun size={12} className="fill-[#FF9500]" /> Insights Solara
                            </h4>
                            <p className="text-slate-800 text-sm italic font-medium leading-relaxed border-l-4 border-orange-300 pl-4">
                              {record.summary}
                            </p>
                          </div>
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetailView;
