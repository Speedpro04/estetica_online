
import React, { useState } from 'react';
import { Patient, PatientStatus } from '../types';
import { Search, ChevronRight, Plus, Filter, User, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface PatientListViewProps {
  patients: Patient[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenPatient: (id: string) => void;
}

const getStatusStyles = (status: PatientStatus) => {
  switch (status) {
    case PatientStatus.CONFIRMED:
      return { bg: 'bg-solara-accent2/10', text: 'text-solara-accent2', border: 'border-solara-accent2/20' };
    case PatientStatus.ATTENDING:
      return { bg: 'bg-solara-primary/10', text: 'text-solara-primary', border: 'border-solara-primary/20' };
    case PatientStatus.FINISHED:
      return { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-slate-200' };
    case PatientStatus.CANCELLED:
      return { bg: 'bg-solara-accent1/10', text: 'text-solara-accent1', border: 'border-solara-accent1/20' };
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-400', border: 'border-slate-100' };
  }
};

const PatientListView: React.FC<PatientListViewProps> = ({ patients, searchQuery, setSearchQuery, onOpenPatient }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', cpf: '', birthDate: '', phone: '', insurance: '', specialty: '' });

  const handleSave = () => {
    if (!form.name.trim() || !form.cpf.trim()) {
      toast.error('Preencha nome e CPF.');
      return;
    }
    // In a real scenario this would call the backend API
    toast.success(`Paciente "${form.name}" cadastrado com sucesso!`);
    setForm({ name: '', cpf: '', birthDate: '', phone: '', insurance: '', specialty: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-inter">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-light text-solara-primary tracking-tight uppercase leading-none">Base de Pacientes</h1>
          <p className="text-solara-text1 font-light mt-2 text-xs uppercase tracking-[0.2em]">Gestão de Registros Solara</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="solara-button-primary px-10 py-5 flex items-center gap-3 w-fit shadow-xl group"
          title="Cadastrar novo paciente"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> 
          <span className="text-[11px] font-light uppercase tracking-widest">Novo Cadastro</span>
        </button>
      </div>

      <div className="solara-card overflow-hidden bg-white">
        <div className="p-8 border-b-2 border-solara-border/10 flex flex-col md:flex-row gap-6 items-center justify-between bg-solara-bg/10">
          <div className="relative w-full md:w-[500px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-solara-text1" size={20} />
            <input 
              type="text" 
              className="w-full pl-16 pr-8 py-5 bg-white solara-border outline-none focus:border-solara-accent2 text-base font-light text-solara-primary tracking-tight placeholder:text-solara-text1/30 transition-all shadow-sm"
              placeholder="Buscar por nome ou CPF..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              title="Buscar pacientes"
            />
          </div>
          <button 
            className="flex items-center gap-3 text-solara-primary font-light text-[11px] uppercase tracking-widest bg-white solara-border px-8 py-5 hover:bg-solara-bg/20 transition-all shadow-sm active:scale-95"
            title="Filtrar registros"
          >
            <Filter size={20} className="text-solara-accent2" /> Filtrar Registros
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-solara-primary text-white text-[11px] uppercase tracking-[0.15em] font-light">
                <th className="px-10 py-6">Paciente</th>
                <th className="px-10 py-6">Documentação</th>
                <th className="px-10 py-6">Status Atual</th>
                <th className="px-10 py-6">Convênio</th>
                <th className="px-10 py-6 text-right">Ficha</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-solara-border/10">
              {patients.map((p) => {
                const styles = getStatusStyles(p.status);
                return (
                  <tr 
                    key={p.id} 
                    className="hover:bg-solara-bg/20 transition-colors cursor-pointer group"
                    onClick={() => onOpenPatient(p.id)}
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-solara bg-solara-primary text-white flex items-center justify-center font-light text-xl shadow-lg border-2 border-solara-border/20 group-hover:bg-solara-accent1 transition-colors">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-lg font-light text-solara-primary tracking-tight group-hover:text-solara-accent1 transition-colors leading-none">{p.name}</p>
                          <p className="text-[11px] text-solara-text1 font-light uppercase tracking-widest mt-2 opacity-60">Nasc: {p.birthDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-sm font-light text-solara-primary tracking-wide">{p.cpf}</td>
                    <td className="px-10 py-8">
                      <span className={`text-[10px] font-light px-5 py-2 rounded-solara border-2 uppercase tracking-tight shadow-sm ${styles.bg} ${styles.text} ${styles.border}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-xs font-light text-solara-primary uppercase tracking-wide">{p.insurance}</td>
                    <td className="px-10 py-8 text-right">
                      <button 
                        className="p-3 text-solara-border group-hover:text-solara-accent1 transition-all bg-white solara-border shadow-sm group-hover:shadow-md"
                        title={`Ver ficha de ${p.name}`}
                      >
                        <ChevronRight size={24} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Novo Paciente */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6" onClick={() => setIsModalOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div 
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 fade-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-600 transition-colors rounded-xl hover:bg-slate-50">
              <X size={20} />
            </button>

            <h3 className="text-2xl font-light text-[#0a3d62] tracking-tight mb-2">Novo Paciente</h3>
            <p className="text-sm font-light text-slate-400 mb-8">Cadastre um novo paciente no sistema</p>

            <div className="space-y-6">
              <div>
                <label htmlFor="patient-name" className="text-[11px] font-light text-slate-500 uppercase tracking-widest mb-2 block">Nome completo *</label>
                <input
                  id="patient-name"
                  type="text"
                  placeholder="Nome do paciente"
                  className="w-full border border-slate-200 rounded-xl px-5 py-4 text-base font-light text-[#0a3d62] outline-none focus:border-[#7ed6df] transition-all placeholder:text-slate-300"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  title="Nome completo do paciente"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="patient-cpf" className="text-[11px] font-light text-slate-500 uppercase tracking-widest mb-2 block">CPF *</label>
                  <input
                    id="patient-cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    className="w-full border border-slate-200 rounded-xl px-5 py-4 text-base font-light text-[#0a3d62] outline-none focus:border-[#7ed6df] transition-all placeholder:text-slate-300"
                    value={form.cpf}
                    onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                    title="CPF do paciente"
                  />
                </div>
                <div>
                  <label htmlFor="patient-birth" className="text-[11px] font-light text-slate-500 uppercase tracking-widest mb-2 block">Data de nascimento</label>
                  <input
                    id="patient-birth"
                    type="date"
                    className="w-full border border-slate-200 rounded-xl px-5 py-4 text-base font-light text-[#0a3d62] outline-none focus:border-[#7ed6df] transition-all"
                    value={form.birthDate}
                    onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                    title="Data de nascimento"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="patient-phone" className="text-[11px] font-light text-slate-500 uppercase tracking-widest mb-2 block">Telefone</label>
                  <input
                    id="patient-phone"
                    type="text"
                    placeholder="(00) 00000-0000"
                    className="w-full border border-slate-200 rounded-xl px-5 py-4 text-base font-light text-[#0a3d62] outline-none focus:border-[#7ed6df] transition-all placeholder:text-slate-300"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    title="Telefone de contato"
                  />
                </div>
                <div>
                  <label htmlFor="patient-insurance" className="text-[11px] font-light text-slate-500 uppercase tracking-widest mb-2 block">Convênio</label>
                  <input
                    id="patient-insurance"
                    type="text"
                    placeholder="Particular, Amil..."
                    className="w-full border border-slate-200 rounded-xl px-5 py-4 text-base font-light text-[#0a3d62] outline-none focus:border-[#7ed6df] transition-all placeholder:text-slate-300"
                    value={form.insurance}
                    onChange={(e) => setForm({ ...form, insurance: e.target.value })}
                    title="Convênio ou Plano de Saúde"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 border border-slate-200 rounded-xl text-[11px] font-light uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                title="Cancelar cadastro"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-4 bg-[#0a3d62] text-white rounded-xl text-[11px] font-light uppercase tracking-widest hover:brightness-110 shadow-lg transition-all active:scale-95"
                title="Salvar novo paciente"
              >
                Cadastrar Paciente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientListView;
