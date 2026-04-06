import React, { useState } from 'react';
import { Stethoscope, Phone, Mail, MoreVertical, Plus, UserCheck, UserX, Clock, Calendar, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Specialist {
  id: string;
  name: string;
  specialty: string;
  status: string;
  cro: string;
  phone: string;
  email?: string;
  color: string;
}

const SpecialistsView: React.FC = () => {
  const [specialists, setSpecialists] = useState<Specialist[]>([
    { id: '1', name: 'Dr. Ricardo Mendes', specialty: 'Implantodontia', status: 'Ativo', cro: 'CRO-SP 12345', phone: '(11) 98888-1111', color: 'bg-emerald-50 text-emerald-600' },
    { id: '2', name: 'Dra. Ana Paula', specialty: 'Ortodontia', status: 'Ativo', cro: 'CRO-SP 54321', phone: '(11) 98888-2222', color: 'bg-emerald-50 text-emerald-600' },
    { id: '3', name: 'Dr. Carlos Ferreira', specialty: 'Clínica Geral', status: 'Férias', cro: 'CRO-SP 67890', phone: '(11) 98888-3333', color: 'bg-amber-50 text-amber-600' },
    { id: '4', name: 'Dra. Juliana Silva', specialty: 'Endodontia', status: 'Inativo', cro: 'CRO-SP 09876', phone: '(11) 98888-4444', color: 'bg-slate-100 text-slate-500' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', specialty: '', cro: '', phone: '', email: '', status: 'Ativo' });

  const handleSave = () => {
    if (!form.name.trim() || !form.specialty.trim()) {
      toast.error('Preencha nome e especialidade.');
      return;
    }
    const statusColors: Record<string, string> = {
      'Ativo': 'bg-emerald-50 text-emerald-600',
      'Inativo': 'bg-slate-100 text-slate-500',
      'Férias': 'bg-amber-50 text-amber-600',
    };
    const newSpec: Specialist = {
      id: Date.now().toString(),
      name: form.name,
      specialty: form.specialty,
      cro: form.cro,
      phone: form.phone,
      email: form.email,
      status: form.status,
      color: statusColors[form.status] || 'bg-emerald-50 text-emerald-600',
    };
    setSpecialists(prev => [...prev, newSpec]);
    setForm({ name: '', specialty: '', cro: '', phone: '', email: '', status: 'Ativo' });
    setIsModalOpen(false);
    toast.success('Especialista cadastrado com sucesso!');
  };

  const columns = [
    { title: 'Ativos', status: 'Ativo', icon: UserCheck, color: 'text-emerald-500' },
    { title: 'Inativos', status: 'Inativo', icon: UserX, color: 'text-slate-400' },
    { title: 'Férias / Afastados', status: 'Férias', icon: Clock, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-light text-[#0a3d62] tracking-tight uppercase leading-none">Especialistas</h2>
          <p className="text-[#57606f] text-xs font-light uppercase tracking-widest mt-2 opacity-70">Gestão de corpo clínico e disponibilidade</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="solara-button-primary px-10 py-5 flex items-center gap-3 w-fit shadow-xl group"
          title="Cadastrar novo especialista"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> 
          <span className="text-[11px] font-light uppercase tracking-widest">Novo Especialista</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {columns.map((col) => {
          const colSpecialists = specialists.filter(s => s.status === col.status);
          return (
            <div key={col.title} className="space-y-6">
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-5">
                 <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-lg bg-white border border-slate-100 shadow-sm ${col.color}`}>
                       <col.icon size={18} />
                    </div>
                    <h3 className="text-xs font-light text-[#0a3d62] uppercase tracking-[0.1em]">{col.title}</h3>
                 </div>
                 <span className="text-xs font-light text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{colSpecialists.length}</span>
              </div>

              <div className="space-y-6">
                {colSpecialists.map((spec) => (
                  <div key={spec.id} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#7ed6df]/30 transition-all group relative">
                    <button className="absolute top-8 right-8 p-1.5 text-slate-300 hover:text-[#0a3d62] transition-colors" title={`Mais opções para ${spec.name}`}>
                       <MoreVertical size={18} />
                    </button>
                    
                    <div className="flex items-center gap-5 mb-8">
                       <div className={`w-14 h-14 rounded-full flex items-center justify-center font-light text-lg border-2 border-white shadow-md ${spec.color.replace('text-', 'bg-').split(' ')[0]} text-white`}>
                          {spec.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                       </div>
                       <div>
                          <h4 className="text-base font-light text-[#0a3d62] tracking-tight group-hover:text-[#e55039] transition-colors">{spec.name}</h4>
                          <p className="text-[11px] font-light text-[#7ed6df] uppercase tracking-widest mt-1">{spec.specialty}</p>
                       </div>
                    </div>

                    <div className="space-y-4 mb-8">
                       <div className="flex items-center gap-3 text-slate-500">
                          <Stethoscope size={16} className="opacity-40" />
                          <span className="text-sm font-light tracking-wide">{spec.cro}</span>
                       </div>
                       <div className="flex items-center gap-3 text-slate-500">
                          <Phone size={16} className="opacity-40" />
                          <span className="text-sm font-light tracking-wide">{spec.phone}</span>
                       </div>
                    </div>

                    <div className="flex gap-3">
                       <button 
                        className="flex-1 bg-slate-50 text-slate-400 py-3 rounded-xl text-[10px] font-light uppercase tracking-widest hover:bg-[#0a3d62] hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95"
                        title={`Agendar com ${spec.name}`}
                       >
                          <Calendar size={16} /> Agenda
                       </button>
                       <button 
                        className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all active:scale-95" 
                        title={`Enviar mensagem para ${spec.name}`}
                       >
                          <Mail size={18} />
                       </button>
                    </div>
                  </div>
                ))}

                {colSpecialists.length === 0 && (
                   <div className="py-12 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center opacity-30">
                      <Stethoscope size={32} className="text-slate-300" />
                      <span className="text-[9px] font-medium uppercase tracking-widest mt-2">Vazio</span>
                   </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Novo Especialista */}
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

            <h3 className="text-2xl font-light text-[#0a3d62] tracking-tight mb-2">Novo Especialista</h3>
            <p className="text-sm font-light text-slate-400 mb-8">Preencha os dados do profissional</p>

            <div className="space-y-6">
              <div>
                <label htmlFor="spec-name" className="text-[11px] font-light text-slate-500 uppercase tracking-widest mb-2 block">Nome completo *</label>
                <input
                  id="spec-name"
                  type="text"
                  placeholder="Ex: Dr. João Silva"
                  className="w-full border border-slate-200 rounded-xl px-5 py-4 text-base font-light text-[#0a3d62] outline-none focus:border-[#7ed6df] transition-all placeholder:text-slate-300"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  title="Nome completo"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="spec-specialty" className="text-[11px] font-light text-slate-500 uppercase tracking-widest mb-2 block">Especialidade *</label>
                  <input
                    id="spec-specialty"
                    type="text"
                    placeholder="Ex: Ortodontia"
                    className="w-full border border-slate-200 rounded-xl px-5 py-4 text-base font-light text-[#0a3d62] outline-none focus:border-[#7ed6df] transition-all placeholder:text-slate-300"
                    value={form.specialty}
                    onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                    title="Especialidade odontológica"
                  />
                </div>
                <div>
                  <label htmlFor="spec-cro" className="text-[11px] font-light text-slate-500 uppercase tracking-widest mb-2 block">CRO</label>
                  <input
                    id="spec-cro"
                    type="text"
                    placeholder="CRO-SP 00000"
                    className="w-full border border-slate-200 rounded-xl px-5 py-4 text-base font-light text-[#0a3d62] outline-none focus:border-[#7ed6df] transition-all placeholder:text-slate-300"
                    value={form.cro}
                    onChange={(e) => setForm({ ...form, cro: e.target.value })}
                    title="Registro no conselho regional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="spec-phone" className="text-[11px] font-light text-slate-500 uppercase tracking-widest mb-2 block">Telefone</label>
                  <input
                    id="spec-phone"
                    type="text"
                    placeholder="(00) 00000-0000"
                    className="w-full border border-slate-200 rounded-xl px-5 py-4 text-base font-light text-[#0a3d62] outline-none focus:border-[#7ed6df] transition-all placeholder:text-slate-300"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    title="Telefone de contato"
                  />
                </div>
                <div>
                  <label htmlFor="spec-status" className="text-[11px] font-light text-slate-500 uppercase tracking-widest mb-2 block">Status</label>
                  <select
                    id="spec-status"
                    title="Status do especialista"
                    className="w-full border border-slate-200 rounded-xl px-5 py-4 text-base font-light text-[#0a3d62] outline-none focus:border-[#7ed6df] transition-all bg-white"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="Férias">Férias / Afastado</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="spec-email" className="text-[11px] font-light text-slate-500 uppercase tracking-widest mb-2 block">E-mail</label>
                <input
                  id="spec-email"
                  type="email"
                  placeholder="email@clinica.com"
                  className="w-full border border-slate-200 rounded-xl px-5 py-4 text-base font-light text-[#0a3d62] outline-none focus:border-[#7ed6df] transition-all placeholder:text-slate-300"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  title="E-mail profissional"
                />
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
                title="Salvar novo especialista"
              >
                Salvar Especialista
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialistsView;
