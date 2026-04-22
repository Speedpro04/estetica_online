
import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  MoreVertical, 
  Trash2, 
  UserPlus, 
  Wifi, 
  WifiOff, 
  Settings2, 
  ExternalLink,
  PlusCircle,
  Clock,
  CheckCheck
} from 'lucide-react';

const WhatsAppView: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [evolutionUrl, setEvolutionUrl] = useState('https://api.evolution.io');
  const [evolutionKey, setEvolutionKey] = useState('');

  // Mock de instâncias e conversas
  const instance = {
    name: "Unidade Solara - Matriz",
    id: "inst_solara_001",
    status: isConnected ? "connected" : "disconnected",
    whatsapp: isConnected ? "+55 (11) 98888-7777" : "--",
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-700 font-inter">
      {/* Header do Módulo */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none italic">WhatsApp Live Connect</h2>
          <p className="text-[#7ed6df] font-black mt-3 text-[10px] uppercase tracking-[0.3em] opacity-90">Powered by Evolution API & Solara AI</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2.5 px-6 py-3 bg-white/5 border border-white/10 rounded-[13px] text-[10px] font-bold uppercase tracking-widest text-white/60 hover:bg-white/10 transition-all shadow-sm">
            <Trash2 size={16} /> Limpar logs
          </button>
          <button className="flex items-center gap-2.5 px-6 py-3 bg-[#7ed6df] border border-[#7ed6df]/10 rounded-[13px] text-[10px] font-bold uppercase tracking-widest text-[#40407a] hover:brightness-110 transition-all shadow-lg shadow-[#7ed6df]/20">
            <UserPlus size={16} /> Intervenção Humana
          </button>
        </div>
      </div>

      {/* Seletor de Instância / Status / Config */}
      <div className="bg-[#40407a]/40 backdrop-blur-md rounded-[13px] p-6 border border-white/5 shadow-xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 rounded-[13px] p-5 border border-white/10 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-[13px] flex items-center justify-center border-2 ${isConnected ? 'bg-[#7ed6df]/10 border-[#7ed6df]/30 text-[#7ed6df]' : 'bg-white/5 border-white/10 text-white/20'}`}>
                <MessageSquare size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5">Instância Ativa</p>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {isConnected ? instance.name : "Aguardando Conexão"}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Status</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#7ed6df] animate-pulse shadow-[0_0_10px_rgba(126,214,223,0.6)]' : 'bg-white/10'}`}></div>
                  <span className={`text-xs font-bold uppercase tracking-widest ${isConnected ? 'text-[#7ed6df]' : 'text-white/20'}`}>
                    {isConnected ? 'On-line' : 'Off-line'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-[13px] p-5 border border-white/10 shadow-sm flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1 space-y-1.5">
                <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest ml-1">Evolution API URL</label>
                <input 
                  type="text" 
                  value={evolutionUrl}
                  onChange={(e) => setEvolutionUrl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-[11px] px-4 py-2 text-xs text-white outline-none focus:border-[#7ed6df]/50 transition-all font-mono"
                  placeholder="https://..."
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest ml-1">Instance API Key</label>
                <input 
                  type="password" 
                  value={evolutionKey}
                  onChange={(e) => setEvolutionKey(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-[11px] px-4 py-2 text-xs text-white outline-none focus:border-[#7ed6df]/50 transition-all font-mono"
                  placeholder="••••••••••••"
                />
              </div>
            </div>
            <button 
              onClick={() => setIsConnected(!isConnected)}
              className={`w-full py-3 rounded-[11px] text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
                isConnected 
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 shadow-red-500/10' 
                : 'bg-[#7ed6df] text-[#40407a] hover:brightness-110 shadow-[#7ed6df]/20'
              }`}
            >
              {isConnected ? 'Interromper Conexão Evolution' : 'Validar & Conectar Instância'}
            </button>
          </div>
        </div>
      </div>


      {/* Main Layout: Conversas e Chat */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        
        {/* Coluna Esquerda: Lista de Conversas */}
        <div className="lg:col-span-4 flex flex-col bg-white/40 backdrop-blur-md rounded-[13px] border border-white/50 shadow-xl overflow-hidden min-h-0">
          <div className="p-6 border-b border-black/5 bg-white/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <h4 className="text-sm font-bold text-[#0a3d62] uppercase tracking-[0.15em]">Conversas</h4>
               <span className="bg-[#0a3d62]/10 text-[#0a3d62] text-[10px] font-bold px-2 py-0.5 rounded-full">0</span>
            </div>
            <PlusCircle size={20} className="text-[#0a3d62]/40 hover:text-[#0a3d62] cursor-pointer transition-colors" />
          </div>
          
          <div className="p-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0a3d62] transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Buscar conversa..."
                className="w-full bg-white/60 border border-black/5 rounded-[13px] py-3 pl-12 pr-4 text-xs font-light text-[#0a3d62] outline-none focus:bg-white focus:border-[#0a3d62]/20 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center text-center opacity-40">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
               <MessageSquare size={32} className="text-slate-300" />
             </div>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest max-w-[180px] leading-relaxed">
               Nenhuma conversa ainda para esta instância.
             </p>
          </div>
        </div>

        {/* Coluna Direita: Detalhamento / Chat */}
        <div className="lg:col-span-8 flex flex-col min-h-0">
          {/* Header da conversa selecionada */}
          <div className="bg-white/40 backdrop-blur-md rounded-[13px] p-6 border border-white/50 shadow-xl mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-100 rounded-[13px] flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-slate-300">
                  <span className="text-xl font-bold">C</span>
                </div>
                <div>
                  <h3 className="text-xl font-light text-[#0a3d62] tracking-tight italic">Nenhum cliente selecionado</h3>
                  <p className="text-[11px] font-black text-[#2f3640] uppercase tracking-widest">Sem número vinculado</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-[1px] bg-[#0a3d62]/10"></div>
                <div className="flex flex-col items-end">
                   <p className="text-[9px] font-black text-[#2f3640] uppercase tracking-widest">Instância</p>
                   <p className="text-xs font-bold text-[#0a3d62]">--</p>
                </div>
                <div className="h-10 w-[1px] bg-[#0a3d62]/10"></div>
                <div className="flex flex-col items-end">
                   <p className="text-[9px] font-black text-[#2f3640] uppercase tracking-widest">WhatsApp</p>
                   <p className="text-xs font-bold text-[#0a3d62]">--</p>
                </div>
              </div>
            </div>
          </div>

          {/* Área de Chat (Placeholder) */}
          <div className="flex-1 bg-white/40 backdrop-blur-md rounded-[13px] border border-white/50 shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-white/10 pointer-events-none"></div>
            
            <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center px-10">
               <div className="w-32 h-32 bg-slate-200/50 rounded-full flex items-center justify-center mb-8 border border-white/20">
                 <WifiOff size={48} className="text-slate-400" />
               </div>
               <h4 className="text-2xl font-light text-[#0a3d62] uppercase tracking-tighter mb-4 italic leading-none">Nenhuma conversa ativa</h4>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] max-w-[280px] leading-loose">
                 Conecte sua instância da Evolution API para visualizar e interagir com seus pacientes em tempo real.
               </p>
            </div>

            {/* Input Fake */}
            <div className="p-8 border-t border-white/40 bg-white/20 backdrop-blur-xl">
               <div className="w-full h-16 bg-white/60 border border-white rounded-[13px] flex items-center px-8 text-slate-300 italic text-sm shadow-inner group-hover:bg-white transition-all cursor-not-allowed">
                  Aguardando conexão...
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WhatsAppView;
