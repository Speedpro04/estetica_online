
import React from 'react';
import { 
  Clock, 
  Users, 
  ChevronRight, 
  Plus, 
  Activity, 
  CheckCircle2, 
  LayoutDashboard,
  Calendar,
  UserPlus
} from 'lucide-react';
import { Patient, Appointment } from '../types';

interface DashboardViewProps {
  patients: Patient[];
  appointments: Appointment[];
  onOpenPatient: (id: string) => void;
}

const DashboardStatusCard: React.FC<{ icon: any, label: string, value: string, color: string }> = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-white shadow-sm flex items-center gap-4 flex-1 min-w-[200px]">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} shadow-sm border border-white`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
      <h3 className="text-sm font-bold text-[#0a3d62] uppercase tracking-tight">{value}</h3>
    </div>
  </div>
);

const DashboardView: React.FC<DashboardViewProps> = ({ patients, appointments, onOpenPatient }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-inter">
      
      {/* Indicadores do Topo */}
      <div className="flex flex-wrap gap-6 items-center">
        <DashboardStatusCard 
          icon={Activity} 
          label="Conexão instável" 
          value="Atendimentos hoje: 0" 
          color="bg-amber-50 text-amber-500" 
        />
        <DashboardStatusCard 
          icon={Clock} 
          label="Tempo médio de espera" 
          value="-- min" 
          color="bg-[#7ed6df]/10 text-[#0a3d62]" 
        />
        <DashboardStatusCard 
          icon={Activity} 
          label="Última atualização" 
          value="agora" 
          color="bg-[#7ed6df]/10 text-[#0a3d62]" 
        />
        <div className="flex gap-4 ml-auto">
          <button className="bg-[#7ed6df] text-[#0a3d62] px-8 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-[#7ed6df]/20 hover:scale-[1.02] active:scale-95 transition-all">
            + Novo atendimento
          </button>
          <button className="bg-white border border-black/5 text-[#0a3d62] px-8 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all">
            + Novo agendamento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Coluna Principal: Fluxo e Agendamentos */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Fluxo de Atendimento */}
          <div className="bg-white/40 backdrop-blur-md rounded-[40px] border border-white/50 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-black/5 flex justify-between items-center bg-white/50">
              <h3 className="text-sm font-bold text-[#0a3d62] uppercase tracking-[0.15em]">Fluxo de atendimento</h3>
              <span className="text-[10px] font-bold text-[#b2bec3] uppercase bg-slate-50 px-3 py-1.5 rounded-lg border border-black/5">Operação</span>
            </div>
            <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
               {[
                 { label: 'Novo', val: '0', color: 'text-[#0a3d62]' },
                 { label: 'Em andamento', val: '0', color: 'text-[#0a3d62]' },
                 { label: 'Aguardando', val: '0', color: 'text-[#0a3d62]' },
                 { label: 'Concluído', val: '0', color: 'text-[#0a3d62]' },
               ].map((item, i) => (
                 <div key={i} className="bg-white/80 p-6 rounded-3xl border border-white shadow-sm hover:translate-y-[-4px] transition-all cursor-pointer group">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{item.label}</p>
                   <h3 className={`text-4xl font-light ${item.color} group-hover:text-[#7ed6df] transition-colors`}>{item.val}</h3>
                   <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-4">Clique para abrir</p>
                 </div>
               ))}
            </div>
          </div>

          {/* Próximos Agendamentos */}
          <div className="bg-white/40 backdrop-blur-md rounded-[40px] border border-white/50 shadow-xl overflow-hidden">
             <div className="p-8 border-b border-black/5 flex justify-between items-center bg-white/50">
               <h3 className="text-sm font-bold text-[#0a3d62] uppercase tracking-[0.15em]">Próximos agendamentos</h3>
               <span className="text-[10px] font-bold text-[#b2bec3] uppercase bg-slate-50 px-3 py-1.5 rounded-lg">Hoje</span>
             </div>
             <div className="p-12 text-center flex flex-col items-center justify-center opacity-40 grayscale">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-8 border-4 border-white shadow-sm">
                  <Calendar size={40} className="text-slate-300" />
                </div>
                <h4 className="text-xl font-light text-[#0a3d62] uppercase tracking-tight italic">Nenhum agendamento hoje</h4>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-4 mb-10">Organize o dia com um novo horário.</p>
                <button className="bg-[#7ed6df] text-[#0a3d62] px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-[#7ed6df]/20 hover:scale-[1.02] active:scale-95 transition-all">
                  Agendar consulta
                </button>
             </div>
          </div>

        </div>

        {/* Coluna Lateral: Fila e Clientes Recentes */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           
           {/* Fila de Atendimento */}
           <div className="bg-white/40 backdrop-blur-md rounded-[40px] border border-white/50 shadow-xl overflow-hidden flex flex-col min-h-[400px]">
             <div className="p-8 border-b border-black/5 flex justify-between items-center bg-white/50">
                <h3 className="text-sm font-bold text-[#0a3d62] uppercase tracking-[0.15em]">Fila de atendimento</h3>
             </div>
             <div className="flex-1 flex flex-col items-center justify-center p-8 opacity-40">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Nenhum atendimento agora.</p>
             </div>
             <div className="p-8 border-t border-black/5 bg-white/20">
                <button className="w-full py-4 border-2 border-[#7ed6df]/30 text-[#0a3d62] rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#7ed6df]/10 transition-all">
                  Abrir atendimento
                </button>
             </div>
           </div>

           {/* Clientes Recentes */}
           <div className="bg-white/40 backdrop-blur-md rounded-[40px] border border-white/50 shadow-xl overflow-hidden flex flex-col">
             <div className="p-8 border-b border-black/5 flex justify-between items-center bg-white/50">
                <h3 className="text-sm font-bold text-[#0a3d62] uppercase tracking-[0.15em]">Clientes recentes</h3>
             </div>
             <div className="p-8 flex flex-col gap-4">
               {patients.slice(0, 3).map((p) => (
                 <div key={p.id} className="bg-white/80 p-4 rounded-2xl border border-white shadow-sm flex items-center justify-between hover:scale-[0.98] transition-all cursor-pointer hover:bg-white" onClick={() => onOpenPatient(p.id)}>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-[#0a3d62]/10 rounded-xl flex items-center justify-center font-bold text-[#0a3d62]">
                         {p.name.charAt(0)}
                       </div>
                       <div>
                         <p className="text-[11px] font-bold text-[#0a3d62] leading-none mb-1">{p.name}</p>
                         <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{p.cpf}</p>
                       </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300" />
                 </div>
               ))}
               {patients.length === 0 && (
                 <div className="py-8 text-center opacity-40">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sem clientes cadastrados.</p>
                 </div>
               )}
             </div>
           </div>

        </div>

      </div>
    </div>
  );
};

export default DashboardView;
