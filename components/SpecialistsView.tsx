import React from 'react';
import { Stethoscope, Phone, Mail, MoreVertical, Plus, UserCheck, UserX, Clock } from 'lucide-react';

const SpecialistsView: React.FC = () => {
  const specialists = [
    { id: '1', name: 'Dr. Ricardo Mendes', specialty: 'Implantodontia', status: 'Ativo', cro: 'CRO-SP 12345', phone: '(11) 98888-1111', color: 'bg-emerald-50 text-emerald-600' },
    { id: '2', name: 'Dra. Ana Paula', specialty: 'Ortodontia', status: 'Ativo', cro: 'CRO-SP 54321', phone: '(11) 98888-2222', color: 'bg-emerald-50 text-emerald-600' },
    { id: '3', name: 'Dr. Carlos Ferreira', specialty: 'Clínica Geral', status: 'Férias', cro: 'CRO-SP 67890', phone: '(11) 98888-3333', color: 'bg-amber-50 text-amber-600' },
    { id: '4', name: 'Dra. Juliana Silva', specialty: 'Endodontia', status: 'Inativo', cro: 'CRO-SP 09876', phone: '(11) 98888-4444', color: 'bg-slate-100 text-slate-500' },
  ];

  const columns = [
    { title: 'Ativos', status: 'Ativo', icon: UserCheck, color: 'text-emerald-500' },
    { title: 'Inativos', status: 'Inativo', icon: UserX, color: 'text-slate-400' },
    { title: 'Férias / Afastados', status: 'Férias', icon: Clock, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-montserrat">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0a3d62] tracking-tighter uppercase italic leading-none">Especialistas</h2>
          <p className="text-[#57606f] text-[10px] font-bold uppercase tracking-widest mt-2 opacity-70">Gestão de corpo clínico e disponibilidade</p>
        </div>
        <button className="bg-[#0a3d62] text-white px-6 py-3 rounded-xl font-black flex items-center gap-2 hover:brightness-110 shadow-lg shadow-[#0a3d62]/10 uppercase text-[10px] tracking-widest transition-all">
          <Plus size={18} /> Novo Especialista
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {columns.map((col) => {
          const colSpecialists = specialists.filter(s => s.status === col.status);
          return (
            <div key={col.title} className="space-y-6">
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
                 <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-white border border-slate-100 shadow-sm ${col.color}`}>
                       <col.icon size={16} />
                    </div>
                    <h3 className="text-[11px] font-black text-[#0a3d62] uppercase tracking-[0.1em]">{col.title}</h3>
                 </div>
                 <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">{colSpecialists.length}</span>
              </div>

              <div className="space-y-4">
                {colSpecialists.map((spec) => (
                  <div key={spec.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#7ed6df]/30 transition-all group relative">
                    <button className="absolute top-6 right-6 p-1 text-slate-300 hover:text-[#0a3d62] transition-colors" title="Mais Opções">
                       <MoreVertical size={16} />
                    </button>
                    
                    <div className="flex items-center gap-4 mb-6">
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-sm border-2 border-white shadow-md ${spec.color.replace('text-', 'bg-').split(' ')[0]} text-white`}>
                          {spec.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                       </div>
                       <div>
                          <h4 className="text-sm font-black text-[#0a3d62] tracking-tight group-hover:text-[#e55039] transition-colors italic">{spec.name}</h4>
                          <p className="text-[10px] font-bold text-[#7ed6df] uppercase tracking-widest mt-0.5">{spec.specialty}</p>
                       </div>
                    </div>

                    <div className="space-y-3 mb-6">
                       <div className="flex items-center gap-3 text-slate-500">
                          <Stethoscope size={14} className="opacity-40" />
                          <span className="text-[10px] font-bold uppercase tracking-tight">{spec.cro}</span>
                       </div>
                       <div className="flex items-center gap-3 text-slate-500">
                          <Phone size={14} className="opacity-40" />
                          <span className="text-[10px] font-bold uppercase tracking-tight">{spec.phone}</span>
                       </div>
                    </div>

                    <div className="flex gap-2">
                       <button className="flex-1 bg-slate-50 text-slate-400 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#0a3d62] hover:text-white transition-all flex items-center justify-center gap-2">
                          <Calendar size={14} /> Agenda
                       </button>
                       <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all" title="Enviar Mensagem">
                          <Mail size={16} />
                       </button>
                    </div>
                  </div>
                ))}

                {colSpecialists.length === 0 && (
                   <div className="py-12 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center opacity-30">
                      <Stethoscope size={32} className="text-slate-300" />
                      <span className="text-[9px] font-bold uppercase tracking-widest mt-2">Vazio</span>
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

export default SpecialistsView;
