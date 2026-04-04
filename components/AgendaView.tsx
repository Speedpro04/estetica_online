import React from 'react';
import { Appointment } from '../types';
import { Clock, User, Plus, Search, ChevronDown, Filter } from 'lucide-react';

interface AgendaViewProps {
  appointments: Appointment[];
}

const AgendaView: React.FC<AgendaViewProps> = ({ appointments }) => {
  const availableSlots = [
    { time: '09:30', doctor: 'Dr. Carlos Mendes', duration: '30min' },
    { time: '13:00', doctor: 'Dra. Ana Paula', duration: '1h' },
    { time: '15:30', doctor: 'Dr. Carlos Mendes', duration: '30min' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 font-montserrat">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0a3d62] tracking-tighter uppercase italic leading-none">Agenda</h2>
          <p className="text-[#57606f] text-[10px] font-bold uppercase tracking-widest mt-2 opacity-70">Gerencie consultas e horários disponíveis</p>
        </div>
        <button className="bg-[#0a3d62] text-white px-6 py-3 rounded-xl font-black flex items-center gap-2 hover:brightness-110 shadow-lg shadow-[#0a3d62]/10 uppercase text-[10px] tracking-widest transition-all">
          <Plus size={18} /> Nova consulta
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2 text-[#0a3d62] font-black text-[10px] uppercase tracking-widest">
          <Filter size={14} /> Filtros:
        </div>
        
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-xs">
            <select title="Selecionar Dentista" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[10px] font-bold text-[#0a3d62] appearance-none cursor-pointer outline-none focus:border-[#7ed6df] transition-all uppercase tracking-widest">
              <option>Todos os dentistas</option>
              <option>Dr. Ricardo</option>
              <option>Dra. Luana</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative flex-1 max-w-xs">
            <select title="Selecionar Procedimento" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[10px] font-bold text-[#0a3d62] appearance-none cursor-pointer outline-none focus:border-[#7ed6df] transition-all uppercase tracking-widest">
              <option>Todos os procedimentos</option>
              <option>Limpeza</option>
              <option>Canal</option>
              <option>Extração</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-[#0a3d62] transition-all">
          <Search size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Scheduled Consultations */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-[11px] font-black text-[#0a3d62] uppercase tracking-[0.1em] mb-4">Consultas agendadas</h3>
          
          <div className="space-y-3">
             {[
               { id: 1, patient: 'Marina Rodriguez', time: '08:00', procedure: 'Limpeza', status: 'confirmado', doctor: 'Dr. Carlos Mendes', price: 'R$ 180,00' },
               { id: 2, patient: 'Rafael Costa', time: '09:00', procedure: 'Canal', status: 'aguardando', doctor: 'Dra. Ana Paula', price: 'R$ 850,00' },
               { id: 3, patient: 'Juliana Santos', time: '10:00', procedure: 'Restauração', status: 'confirmado', doctor: 'Dr. Carlos Mendes', price: 'R$ 320,00' },
             ].map((app) => (
               <div key={app.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-6 hover:shadow-md transition-all group">
                 <div className="flex flex-col gap-2 w-24 shrink-0">
                    <span className={`text-[8px] font-black px-2 py-1 rounded-md text-center uppercase tracking-widest ${
                      app.status === 'confirmado' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-orange-50 text-orange-600 border border-orange-100'
                    }`}>
                      {app.status}
                    </span>
                    <div className="flex items-center gap-1.5 text-[#0a3d62] font-black text-xs">
                      <Clock size={14} className="text-slate-400" />
                      {app.time}
                    </div>
                 </div>

                 <div className="flex-1">
                    <h4 className="font-black text-[#0a3d62] tracking-tight group-hover:text-[#e55039] transition-colors">{app.patient}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{app.procedure}</p>
                 </div>

                 <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest w-40">
                    <User size={14} />
                    {app.doctor}
                 </div>

                 <div className="flex items-center gap-6">
                    <span className="text-xs font-black text-[#0a3d62] italic">{app.price}</span>
                    <button className="bg-slate-50 text-slate-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 hover:text-[#0a3d62] transition-all">
                      Detalhes
                    </button>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Right Column: Available Slots */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-[11px] font-black text-[#0a3d62] uppercase tracking-[0.1em] mb-4">Horários disponíveis</h3>
          
          <div className="space-y-3">
            {availableSlots.map((slot, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-[#7ed6df]/50 transition-all group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-black text-[#0a3d62] tracking-tight">{slot.time}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">{slot.doctor}</p>
                    <p className="text-[9px] font-black text-[#7ed6df] mt-1 uppercase tracking-widest">{slot.duration}</p>
                  </div>
                  <button className="bg-slate-50 text-slate-400 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#0a3d62] hover:text-white transition-all shadow-sm">
                    Preencher
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaView;
