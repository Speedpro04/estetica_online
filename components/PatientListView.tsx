
import React from 'react';
import { Patient, PatientStatus } from '../types';
import { Search, ChevronRight, Plus, Filter, User } from 'lucide-react';

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
  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-montserrat">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-solara-primary tracking-tighter uppercase leading-none">Base de Pacientes</h1>
          <p className="text-solara-text1 font-bold mt-2 text-[10px] uppercase tracking-[0.3em]">Gestão de Registros Solara</p>
        </div>
        <button className="solara-button-primary px-8 py-4 flex items-center gap-3 w-fit shadow-xl group">
          <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
          <span className="text-[10px] font-black uppercase tracking-widest">Novo Cadastro</span>
        </button>
      </div>

      <div className="solara-card overflow-hidden bg-white">
        <div className="p-8 border-b-2 border-solara-border/10 flex flex-col md:flex-row gap-6 items-center justify-between bg-solara-bg/10">
          <div className="relative w-full md:w-[450px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-solara-text1" size={18} />
            <input 
              type="text" 
              className="w-full pl-14 pr-6 py-4 bg-white solara-border outline-none focus:border-solara-accent2 text-sm font-black text-solara-primary uppercase tracking-tighter placeholder:text-solara-text1/30 transition-all shadow-sm"
              placeholder="Buscar por nome ou CPF..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-3 text-solara-primary font-black text-[10px] uppercase tracking-widest bg-white solara-border px-6 py-4 hover:bg-solara-bg/20 transition-all shadow-sm active:scale-95">
            <Filter size={18} className="text-solara-accent2" /> Filtrar Registros
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-solara-primary text-white text-[10px] uppercase tracking-[0.2em] font-black italic">
                <th className="px-10 py-5">Paciente</th>
                <th className="px-10 py-5">Documentação</th>
                <th className="px-10 py-5">Status Atual</th>
                <th className="px-10 py-5">Convênio</th>
                <th className="px-10 py-5 text-right">Ficha</th>
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
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-solara bg-solara-primary text-white flex items-center justify-center font-black text-lg shadow-lg border-2 border-solara-border/20 group-hover:bg-solara-accent1 transition-colors">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-solara-primary uppercase tracking-tighter group-hover:text-solara-accent1 transition-colors leading-none">{p.name}</p>
                          <p className="text-[9px] text-solara-text1 font-black uppercase tracking-widest mt-1.5 opacity-60 italic">Nasc: {p.birthDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-[11px] font-black text-solara-primary tracking-widest">{p.cpf}</td>
                    <td className="px-10 py-6">
                      <span className={`text-[9px] font-black px-4 py-1.5 rounded-solara border-2 uppercase tracking-tighter shadow-sm ${styles.bg} ${styles.text} ${styles.border}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-[10px] font-black text-solara-primary uppercase tracking-widest italic">{p.insurance}</td>
                    <td className="px-10 py-6 text-right">
                      <button className="p-2.5 text-solara-border group-hover:text-solara-accent1 transition-all bg-white solara-border shadow-sm group-hover:shadow-md">
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientListView;
