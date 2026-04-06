
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Kanban, 
  Bell, 
  Search, 
  Menu, 
  LogOut,
  Sun,
  ShieldCheck,
  UserCircle2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  MessageSquare,
  History,
  Stethoscope,
  DollarSign,
  Settings,
  UserPlus,
  Sparkles,
  BarChart3,
  Megaphone
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useAxosStore } from './store';
import DashboardView from './components/DashboardView';
import KanbanView from './components/KanbanView';
import PainelView from './components/PainelView';
import PatientListView from './components/PatientListView';
import PatientDetailView from './components/PatientDetailView';
import AgendaView from './components/AgendaView';
import FinanceiroView from './components/FinanceiroView';
import RecoveryView from './components/RecoveryView';
import AgendaAnalysisView from './components/AgendaAnalysisView';
import SpecialistsView from './components/SpecialistsView';
import CampanhasView from './components/CampanhasView';
import { CommandPalette } from './components/CommandPalette';
import SolaraAssistant from './components/SolaraAssistant';
import LandingView from './components/LandingView';
import RegisterView from './components/RegisterView';
import ForgotPasswordView from './components/ForgotPasswordView';
import { mockAppointments } from './mockData';

// Módulo de Identificação do Usuário na Sidebar
const UserAccessModule: React.FC<{ collapsed?: boolean }> = ({ collapsed }) => {
  const { currentUser } = useAxosStore();
  if (!currentUser) return null;

  return (
    <div className={`mx-4 mt-2 mb-4 p-4 rounded-2xl bg-white/5 border border-white/10 transition-all hover:bg-white/10 group ${collapsed ? 'px-2 items-center' : ''} flex flex-col gap-3 backdrop-blur-md`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7ed6df] to-[#00A3FF] flex items-center justify-center text-[#0f172a] shadow-lg shrink-0">
          <UserCircle2 size={collapsed ? 24 : 22} />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-[11px] font-light text-white uppercase tracking-tight truncate leading-none mb-1">
              {currentUser.name}
            </span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={10} className="text-[#7ed6df]" />
              <span className="text-[9px] font-light text-[#7ed6df] uppercase tracking-[0.15em] whitespace-nowrap">
                SUPER ADMIN
              </span>
            </div>
          </div>
        )}
      </div>
      {!collapsed && (
        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Autenticado</span>
          </div>
        </div>
      )}
    </div>
  );
};

const SolaraLogo: React.FC<{ collapsed?: boolean }> = ({ collapsed }) => (
  <div className={`flex items-center justify-center transition-all duration-700 ease-in-out ${collapsed ? 'w-full' : 'w-full px-2'}`}>
    <div className={`relative flex items-center justify-center gap-3 transition-all duration-700 ${collapsed ? 'w-12 h-12' : 'w-full'}`} style={{ minHeight: '48px' }}>
      <div
        style={{ width: '110px', height: '110px', maxWidth: collapsed ? '48px' : '110px', maxHeight: collapsed ? '48px' : '110px' }}
        className="relative flex items-center justify-center transition-all duration-700"
      >
        <img
          src="/sol_com_risco_em_baixo-removebg-preview.png"
          alt="Assistente Solara"
          style={{ width: collapsed ? '40px' : '110px', height: collapsed ? '40px' : '110px', objectFit: 'contain', transition: 'all 0.4s ease' }}
        />
      </div>
      {!collapsed && (
        <div className="flex flex-col ml-1">
          <span className="text-xl font-light text-white tracking-tighter uppercase leading-none">Assistente</span>
          <span className="text-xl font-light text-[#f6851e] tracking-tighter uppercase leading-none">Solara</span>
          <span className="text-[8px] font-light text-[#82ccdd] uppercase tracking-[0.25em] leading-none mt-2">IA de Recuperação</span>
        </div>
      )}
    </div>
  </div>
);

const App: React.FC = () => {
  const { 
    activeTab, setActiveTab, 
    isSidebarOpen, setSidebarOpen, 
    patients, 
    selectedPatientId, setSelectedPatientId,
    updatePatientStatus, updatePatient,
    currentUser, login, logout
  } = useAxosStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSolaraOpen, setIsSolaraOpen] = useState(false);
  
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showLanding, setShowLanding] = useState(!currentUser);
  const [authScreen, setAuthScreen] = useState<'login' | 'register' | 'forgot'>('login');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        setIsSolaraOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!userEmail.trim()) {
      setLoginError('Informe seu e-mail ou ID.');
      return;
    }
    if (!password.trim()) {
      setLoginError('Informe sua senha.');
      return;
    }
    setIsLoggingIn(true);
    try {
      await login(userEmail, password);
      setUserEmail('');
      setPassword('');
      setLoginError('');
    } catch (err) {
      setLoginError('E-mail ou senha incorretos.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowLanding(true);
  };

  if (showLanding && !currentUser) {
    return <LandingView onEnterApp={() => { setShowLanding(false); setAuthScreen('login'); }} />;
  }

  if (!currentUser && authScreen === 'register') {
    return <RegisterView onBack={() => setAuthScreen('login')} onSuccess={() => setAuthScreen('login')} />;
  }

  if (!currentUser && authScreen === 'forgot') {
    return <ForgotPasswordView onBack={() => setAuthScreen('login')} />;
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen premium-gradient flex items-center justify-center p-6 font-inter relative">
        <Toaster position="top-right" />
        {/* Botão voltar à landing */}
        <button
          onClick={() => setShowLanding(true)}
          className="absolute top-6 left-6 flex items-center gap-2 text-white/50 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Voltar ao início
        </button>
        <div className="w-full max-w-[440px] bg-white/5 backdrop-blur-2xl rounded-[40px] border border-white/10 p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-500">
          <div className="flex justify-center mb-12">
            <SolaraLogo />
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-white text-4xl font-light tracking-tight mb-4 uppercase leading-none">Assistente Solara</h1>
            <p className="text-[#82ccdd] text-xs font-light uppercase tracking-[0.3em]">Gestão Inteligente para Clínicas</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-3">
              <label htmlFor="login-email" className="text-[11px] font-light text-slate-500 uppercase tracking-widest ml-1">Usuário</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#7ed6df] transition-colors" size={20} />
                <input 
                  id="login-email"
                  type="text"
                  placeholder="E-mail ou ID"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-15 pr-6 text-white text-base focus:border-[#7ed6df]/50 focus:bg-white/10 outline-none transition-all placeholder:text-slate-600 font-light"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  autoFocus
                  title="Seu e-mail ou identificação"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="login-password" className="text-[11px] font-light text-slate-500 uppercase tracking-widest ml-1">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#7ed6df] transition-colors" size={20} />
                <input 
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-15 pr-15 text-white text-base focus:border-[#7ed6df]/50 focus:bg-white/10 outline-none transition-all placeholder:text-slate-600 font-light tracking-widest"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  title="Sua senha de acesso"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              {loginError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-3 text-red-400 text-xs font-bold uppercase tracking-widest text-center">
                  {loginError}
                </div>
              )}
              <button 
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-6 bg-[#7ed6df] text-[#0f172a] rounded-[24px] font-light uppercase tracking-[0.2em] text-xs shadow-[0_20px_40px_-10px_rgba(126,214,223,0.3)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Entrar no dashboard"
              >
                {isLoggingIn ? 'Autenticando...' : 'Entrar no Sistema'}
              </button>

              <button
                type="button"
                onClick={() => setAuthScreen('register')}
                className="w-full py-5 bg-white/5 border border-white/10 text-white/70 rounded-[24px] font-light uppercase tracking-[0.2em] text-xs hover:bg-white/10 hover:text-white transition-all"
              >
                Criar Conta
              </button>

              <button
                type="button"
                onClick={() => setAuthScreen('forgot')}
                className="w-full text-center text-[10px] text-[#82ccdd] font-light uppercase tracking-widest hover:text-white transition-colors pt-2"
              >
                Esqueci minha senha
              </button>

            </div>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-2">
             <ShieldCheck size={14} className="text-[#7ed6df]" />
             <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">Criptografia Militar Ativa</p>
          </div>
        </div>
      </div>
    );
  }

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const renderView = () => {
    if (selectedPatientId && selectedPatient) {
      return (
        <PatientDetailView 
          patient={selectedPatient} 
          onBack={() => setSelectedPatientId(null)} 
          onUpdate={updatePatient}
        />
      );
    }
    switch (activeTab) {
      case 'dashboard': return <PainelView patients={patients} onUpdateStatus={updatePatientStatus} onOpenPatient={setSelectedPatientId} />;
      case 'agenda': return <AgendaView appointments={mockAppointments} />;
      case 'kanban': return <KanbanView patients={patients} onUpdateStatus={updatePatientStatus} onOpenPatient={setSelectedPatientId} />;
      case 'patients': return (
        <PatientListView 
          patients={patients.filter(p => p.name.toLowerCase().includes(debouncedQuery.toLowerCase()) || p.cpf.includes(debouncedQuery))} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onOpenPatient={setSelectedPatientId} 
        />
      );
      case 'conversations': return (
        <div className="flex flex-col items-center justify-center p-20 bg-white solara-card shadow-lg animate-in fade-in zoom-in duration-500">
          <MessageSquare size={80} className="text-[#82ccdd] mb-6 opacity-40" />
          <h2 className="text-2xl font-black text-[#0a3d62] uppercase tracking-tighter mb-4">Conversas WhatsApp</h2>
          <p className="text-slate-500 text-center max-w-md font-medium uppercase text-[10px] tracking-widest leading-loose">
            Integração Evolution API ativa. O assistente IA está processando mensagens em tempo real.
          </p>
        </div>
      );
      case 'followups': return (
        <div className="flex flex-col items-center justify-center p-20 bg-white solara-card shadow-lg animate-in fade-in zoom-in duration-500">
          <History size={80} className="text-[#82ccdd] mb-6 opacity-40" />
          <h2 className="text-2xl font-black text-[#0a3d62] uppercase tracking-tighter mb-4">Follow-ups Automáticos</h2>
          <p className="text-slate-500 text-center max-w-md font-medium uppercase text-[10px] tracking-widest leading-loose">
            Régua de comunicação ativa. Lembretes de 24h e pós-consulta estão sendo enviados.
          </p>
        </div>
      );
      case 'specialists': return <SpecialistsView />;
      case 'finance': return <FinanceiroView />;
      case 'recovery': return <RecoveryView />;
      case 'campanhas': return <CampanhasView />;
      case 'ai-assistant': return (
        <div className="flex flex-col items-center justify-center p-20 bg-white solara-card shadow-lg animate-in fade-in zoom-in duration-500">
          <Sparkles size={80} className="text-[#ff7675] mb-6 opacity-40" />
          <h2 className="text-3xl font-light text-[#0a3d62] uppercase tracking-tighter mb-4">Assistente IA</h2>
          <p className="text-slate-500 text-center max-w-md font-light uppercase text-xs tracking-widest leading-loose">
            Configurações e logs do assistente de inteligência preditiva.
          </p>
        </div>
      );
      case 'agenda-analysis': return <AgendaAnalysisView />;
      default: return <DashboardView patients={patients} appointments={mockAppointments} onOpenPatient={setSelectedPatientId} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-inter">
      <Toaster position="top-right" />
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
        patients={patients}
        onSelectPatient={setSelectedPatientId}
      />
      
      <SolaraAssistant 
        isOpen={isSolaraOpen} 
        onClose={() => setIsSolaraOpen(false)} 
        context={{ activeTab, patientsCount: patients.length, currentUser }}
      />
      
      <aside 
        className={`${isSidebarOpen ? 'w-80' : 'w-24'} solara-header-sidebar text-white transition-all duration-300 flex flex-col z-50 shadow-2xl relative border-r-2 border-[#82ccdd]/30`}
      >
        <div className="px-4 h-24 flex items-center justify-center overflow-hidden border-b-2 border-[#82ccdd]/10">
          <SolaraLogo collapsed={!isSidebarOpen} />
        </div>
        
        <nav className="flex-1 mt-8 px-5 space-y-2 overflow-y-auto custom-scrollbar font-montserrat">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Painel' },
            { id: 'agenda', icon: Calendar, label: 'Agenda' },
            { id: 'patients', icon: Users, label: 'Pacientes' },
            { id: 'conversations', icon: MessageSquare, label: 'Conversas' },
            { id: 'followups', icon: Bell, label: 'Acompanhamento' },
            { id: 'specialists', icon: Stethoscope, label: 'Especialistas' },
            { id: 'finance', icon: DollarSign, label: 'Financeiro' },
            { id: 'recovery', icon: UserPlus, label: 'Recuperação' },
            { id: 'campanhas', icon: Megaphone, label: 'Campanhas IA' },
            { id: 'ai-assistant', icon: Sparkles, label: 'Assistente IA' },
            { id: 'agenda-analysis', icon: BarChart3, label: 'Análise de Agenda' },
            { id: 'settings', icon: Settings, label: 'Configurações' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-5 p-5 rounded-solara transition-all duration-300 group ${
                activeTab === item.id 
                  ? 'bg-[#ff7675] shadow-lg font-light' 
                  : 'text-white/60 hover:text-white hover:bg-white/5 font-light'
              }`}
              title={item.label}
            >
              <item.icon size={22} className={activeTab === item.id ? 'text-white' : 'text-white/40 group-hover:text-[#ff7675]'} />
              {isSidebarOpen && <span className="text-[11px] uppercase tracking-[0.2em] leading-none truncate">{item.label}</span>}
            </button>
          ))}
          <div className="flex-1 min-h-[40px]"></div>
        </nav>
        
        <div className="border-t-2 border-[#82ccdd]/10 bg-black/10 pt-4 pb-8">
          <UserAccessModule collapsed={!isSidebarOpen} />
          <div className="px-5">
            <button 
              onClick={handleLogout}
              className={`w-full flex items-center gap-5 p-5 text-white/40 hover:text-[#e55039] transition-all font-light uppercase text-[10px] tracking-widest group ${!isSidebarOpen ? 'justify-center' : ''}`}
              title="Encerrar Sessão"
            >
              <LogOut size={22} />
              {isSidebarOpen && <span>Encerrar Sessão</span>}
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 solara-header-sidebar px-10 flex items-center justify-between shadow-xl z-40 shrink-0 border-b-2 border-[#82ccdd]/20 relative">
          <div className="flex items-center gap-8 w-1/3">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)} 
              className="p-3 bg-white/5 hover:bg-white/10 rounded-solara text-[#82ccdd] border-2 border-[#82ccdd]/30 transition-all font-inter"
            >
              <Menu size={20} />
            </button>
            <div 
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden xl:flex items-center bg-white/5 px-6 py-3 rounded-solara w-full max-w-xs gap-4 border-2 border-[#82ccdd]/30 hover:border-[#82ccdd] cursor-text transition-all group hover:bg-white/10"
            >
              <Search size={18} className="text-[#82ccdd]" />
              <span className="text-xs font-bold text-[#82ccdd] uppercase text-[9px] tracking-widest">Buscar...</span>
            </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <h1 className="text-3xl font-light text-white tracking-[0.3em] uppercase italic">Assistente Solara</h1>
          </div>

          <div className="flex items-center justify-end gap-6 w-1/3">
            <button 
              onClick={() => setIsSolaraOpen(true)}
              className="hidden lg:flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border-2 border-white/20 px-6 py-3 rounded-solara shadow-lg group active:scale-95 transition-all"
            >
              <Sparkles size={18} className="text-white" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white">Assistente IA</span>
            </button>
            
            <div className="flex items-center gap-4 cursor-pointer group p-1.5 rounded-full transition-all">
              <div className="w-10 h-10 bg-[#e55039] rounded-full flex items-center justify-center text-white font-black text-sm uppercase shadow-lg shadow-red-500/20 border-2 border-white/20">
                {currentUser.name.charAt(0)}C
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-solara-bg">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
