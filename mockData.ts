
import { Patient, PatientStatus, Appointment } from './types';

const now = new Date();
const getRecentTime = (minsAgo: number) => new Date(now.getTime() - minsAgo * 60000).toISOString();

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Mariana Silva',
    cpf: '123.456.789-01',
    birthDate: '1990-05-12',
    phone: '(11) 98888-0001',
    insurance: 'Bradesco',
    status: PatientStatus.SCHEDULED,
    risk: 'BAIXO',
    arrivalTime: '',
    alerts: [],
    lastVisit: '2024-12-10',
    specialty: 'Avaliação Inicial',
    history: []
  },
  {
    id: '2',
    name: 'Carlos Eduardo',
    cpf: '123.456.789-02',
    birthDate: '1985-08-15',
    phone: '(11) 98888-0002',
    insurance: 'Amil',
    status: PatientStatus.SCHEDULED,
    risk: 'MEDIO',
    arrivalTime: '',
    alerts: [],
    lastVisit: '2024-11-20',
    specialty: 'Limpeza',
    history: []
  },
  {
    id: '3',
    name: 'Ana Paula',
    cpf: '123.456.789-03',
    birthDate: '1982-03-25',
    phone: '(11) 98888-0003',
    insurance: 'Particular',
    status: PatientStatus.SCHEDULED,
    risk: 'ALTO',
    arrivalTime: '',
    alerts: ['Diabetes'],
    lastVisit: '2025-01-05',
    specialty: 'Extração',
    history: []
  },
  {
    id: '4',
    name: 'Roberto Alves',
    cpf: '123.456.789-04',
    birthDate: '1975-06-10',
    phone: '(11) 98888-0004',
    insurance: 'Unimed',
    status: PatientStatus.CONFIRMED,
    risk: 'ALTO',
    arrivalTime: '2025-02-15T14:00:00Z',
    alerts: [],
    lastVisit: '2024-10-15',
    specialty: 'Canal',
    history: []
  },
  {
    id: '5',
    name: 'Juliana Costa',
    cpf: '123.456.789-05',
    birthDate: '1995-12-01',
    phone: '(11) 98888-0005',
    insurance: 'Particular',
    status: PatientStatus.CONFIRMED,
    risk: 'BAIXO',
    arrivalTime: '2025-02-15T16:30:00Z',
    alerts: [],
    lastVisit: '2025-01-20',
    specialty: 'Clareamento',
    history: []
  },
  {
    id: '6',
    name: 'Fernando Souza',
    cpf: '123.456.789-06',
    birthDate: '1988-02-28',
    phone: '(11) 98888-0006',
    insurance: 'Bradesco',
    status: PatientStatus.WAITING,
    risk: 'MEDIO',
    arrivalTime: '2025-02-15T08:15:00Z',
    alerts: [],
    lastVisit: '2024-12-15',
    specialty: 'Manutenção Aparelho',
    history: []
  },
  {
    id: '7',
    name: 'Beatriz Lima',
    cpf: '123.456.789-07',
    birthDate: '1980-07-20',
    phone: '(11) 98888-0007',
    insurance: 'Particular',
    status: PatientStatus.ATTENDING,
    risk: 'ALTO',
    arrivalTime: '2025-02-15T07:50:00Z',
    alerts: [],
    lastVisit: '2024-09-10',
    specialty: 'Implante',
    history: []
  }
];

export const mockAppointments: Appointment[] = [
  { id: 'a1', patientId: '1', patientName: 'Carlos Eduardo Santos', date: '2025-02-15', time: '09:00', professional: 'Dr. Ricardo', specialty: 'Cardiologia', type: 'Consulta', isSpecialHour: false },
  { id: 'a2', patientId: '2', patientName: 'Ana Julia Pereira', date: '2025-02-15', time: '19:30', professional: 'Dra. Luana', specialty: 'Estética', type: 'Limpeza de Pele', isSpecialHour: true },
  { id: 'a3', patientId: '5', patientName: 'Pedro Cavalcanti', date: '2025-02-16', time: '10:00', professional: 'Dr. Roberto', specialty: 'Ortopedia', type: 'Retorno', isSpecialHour: true }, // Domingo
  { id: 'a4', patientId: '6', patientName: 'Julia Rosa', date: '2025-02-17', time: '11:00', professional: 'Dra. Aline', specialty: 'Nutrição', type: 'Avaliação', isSpecialHour: false },
];
