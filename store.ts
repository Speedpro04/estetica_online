
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Patient, PatientStatus, MedicalRecord } from './types';
import { mockPatients } from './mockData';
import toast from 'react-hot-toast';

interface User {
  name: string;
  role: string;
  lastAccess: string;
  token?: string;
  tenant_id?: string;
}

interface AxosState {
  patients: Patient[];
  isSidebarOpen: boolean;
  activeTab: 'dashboard' | 'agenda' | 'kanban' | 'patients' | 'conversations' | 'followups' | 'specialists' | 'finance' | 'recovery' | 'campanhas' | 'ai-assistant' | 'agenda-analysis' | 'settings';
  selectedPatientId: string | null;
  isLoading: boolean;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  currentUser: User | null;
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: AxosState['activeTab']) => void;
  setSelectedPatientId: (id: string | null) => void;
  setSyncStatus: (status: AxosState['syncStatus']) => void;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  
  // Patient management
  updatePatientStatus: (id: string, status: PatientStatus) => Promise<void>;
  updatePatient: (updatedPatient: Patient) => Promise<void>;
  addMedicalRecord: (patientId: string, record: MedicalRecord) => Promise<void>;
  
  // n8n sync helper
  syncToN8N: (endpoint: string, data: any) => Promise<any>;
}

const API_BASE_URL = 'http://localhost:8000/api/v1'; 
const N8N_BASE_URL = ''; 

export const useAxosStore = create<AxosState>()(
  devtools(
    persist(
      (set, get) => ({
        patients: mockPatients,
        isSidebarOpen: true,
        activeTab: 'dashboard',
        selectedPatientId: null,
        isLoading: false,
        syncStatus: 'idle',
        currentUser: null,

        setSidebarOpen: (open) => set({ isSidebarOpen: open }),
        setActiveTab: (tab) => set({ activeTab: tab, selectedPatientId: null }),
        setSelectedPatientId: (id) => set({ selectedPatientId: id }),
        setSyncStatus: (status) => set({ syncStatus: status }),
        
        login: async (email, password) => {
          set({ isLoading: true });
          try {
            const params = new URLSearchParams();
            params.append('username', email);
            if (password) params.append('password', password);

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: params
            });

            if (!response.ok) {
              throw new Error('Credenciais inválidas');
            }
            
            const data = await response.json();
            
            set({ 
              currentUser: { 
                name: email.split('@')[0].toUpperCase(), 
                role: 'Super Admin', 
                lastAccess: new Date().toISOString(),
                token: data.access_token,
                tenant_id: data.tenant_id
              },
              isLoading: false
            });
            toast.success('Login realizado com sucesso!');
          } catch (error: any) {
            // Modo demo: se backend está offline, permite login local
            if (error?.message === 'Failed to fetch' || error?.name === 'TypeError') {
              set({ 
                currentUser: { 
                  name: email.split('@')[0].toUpperCase() || 'ADMIN', 
                  role: 'Super Admin (Demo)', 
                  lastAccess: new Date().toISOString()
                },
                isLoading: false
              });
              toast.success('Login em modo demonstração (backend offline)');
              return;
            }
            set({ isLoading: false });
            toast.error('Acesso negado: Verifique seu login/senha.');
            throw error;
          }
        },

        logout: () => {
          set({ currentUser: null, activeTab: 'dashboard', selectedPatientId: null });
          toast.success('Sessão encerrada com segurança');
        },

        updatePatientStatus: async (id, status) => {
          const previousPatients = get().patients;
          set({
            patients: previousPatients.map(p => 
              p.id === id ? { ...p, status, isSyncing: true } : p
            )
          });

          try {
            await get().syncToN8N('/update-status', { patientId: id, status });
            
            set({
              patients: get().patients.map(p => 
                p.id === id ? { ...p, isSyncing: false } : p
              )
            });
            toast.success(`Fluxo atualizado para ${status}`);
          } catch (error) {
            set({ patients: previousPatients });
            toast.error('Erro na sincronização de dados.');
          }
        },

        updatePatient: async (updated) => {
          set(state => ({
            patients: state.patients.map(p => p.id === updated.id ? updated : p)
          }));
          
          get().syncToN8N('/update-patient', updated).catch(console.error);
        },

        addMedicalRecord: async (patientId, record) => {
          const patient = get().patients.find(p => p.id === patientId);
          if (!patient) return;

          const updatedPatient = {
            ...patient,
            history: [record, ...patient.history]
          };

          set(state => ({
            patients: state.patients.map(p => p.id === patientId ? updatedPatient : p)
          }));

          toast.success('Prontuário atualizado e assinado');
          get().syncToN8N('/new-record', { patientId, record }).catch(console.error);
        },

        syncToN8N: async (endpoint, data) => {
          set({ syncStatus: 'syncing' });
          
          if (!N8N_BASE_URL) {
            await new Promise(r => setTimeout(r, 1000));
            set({ syncStatus: 'success' });
            setTimeout(() => set({ syncStatus: 'idle' }), 2000);
            return;
          }
          
          try {
            const response = await fetch(`${N8N_BASE_URL}${endpoint}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...data,
                timestamp: new Date().toISOString(),
                source: 'Painel Admin'
              })
            });

            if (!response.ok) throw new Error(`n8n sync failed: ${response.statusText}`);
            
            set({ syncStatus: 'success' });
            setTimeout(() => set({ syncStatus: 'idle' }), 2000);
            
            return response.json();
          } catch (error) {
            set({ syncStatus: 'error' });
            setTimeout(() => set({ syncStatus: 'idle' }), 3000);
            throw error;
          }
        }
      }),
      { name: 'painel-gestao-storage' }
    )
  )
);
