-- ─── SOLARA ESTÉTICA - SCHEMA COMPLETO (SUPABASE) ───
-- Versão 2.1 - Suporte a Stripe, Agendamentos e Especialistas
-- Foco: Clínicas de Estética Avançada

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. CLÍNICAS (TENANTS)
CREATE TABLE IF NOT EXISTS public.clinics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    whatsapp_instance_id VARCHAR(100), -- Evolution API Instance
    stripe_customer_id VARCHAR(100),   -- Stripe Customer Reference
    status VARCHAR(50) DEFAULT 'active', -- active, trialing, past_due, canceled
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USUÁRIOS
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY, -- Relacionado ao Supabase Auth
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin', -- admin, specialist, receptionist
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ASSINATURAS (STRIPE INTEGRATION)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(100) UNIQUE,
    plan_type VARCHAR(50) NOT NULL, -- essencial, profissional, clinica
    status VARCHAR(50) DEFAULT 'pending', -- active, incomplete, canceled
    dentist_limit INT DEFAULT 2, -- Limite de especialistas baseado no plano
    current_period_end TIMESTAMPTZ,
    price DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ESPECIALISTAS (MÉDICOS, ESTETICISTAS, BIOMÉDICOS)
CREATE TABLE IF NOT EXISTS public.specialists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255), -- Botox, Bioestimuladores, etc.
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LEADS / PACIENTES
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    name VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'onboarding', -- onboarding, qualificado, agendado, recuperacao, perdido
    risk_score VARCHAR(20) DEFAULT 'BAIXO',  -- Score de Churn: BAIXO, MEDIO, ALTO, CRITICO
    last_contact_date TIMESTAMPTZ,
    expected_value DECIMAL(10,2) DEFAULT 0.0,
    ai_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. AGENDAMENTOS (CALENDÁRIO)
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    specialist_id UUID REFERENCES public.specialists(id) ON DELETE SET NULL,
    procedure_name VARCHAR(255) NOT NULL,
    scheduled_time TIMESTAMPTZ NOT NULL,
    duration_minutes INT DEFAULT 60,
    -- Status: pendente, confirmado, concluido, cancelado, reagendado, no_show
    status VARCHAR(50) DEFAULT 'pendente',
    notes TEXT,
    cancellation_reason TEXT,
    original_appointment_id UUID REFERENCES public.appointments(id), -- Histórico de reagendamento
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MENSAGENS (WHATSAPP LOGS)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL, -- customer, ai, human
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CAMPANHAS DE RECUPERAÇÃO
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    message_template TEXT NOT NULL,
    whatsapp_instance VARCHAR(100),
    status VARCHAR(50) DEFAULT 'rascunho', -- rascunho, agendada, enviando, concluida
    scheduled_at TIMESTAMPTZ,
    total_messages INT DEFAULT 0,
    sent_messages INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. AUDITORIA E LOGS DE RECUPERAÇÃO
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID REFERENCES public.clinics(id),
    user_id UUID,
    action VARCHAR(100),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ÍNDICES PARA PERFORMANCE ───
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.leads(tenant_id, phone);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_appointments_time ON public.appointments(tenant_id, scheduled_time);
CREATE INDEX IF NOT EXISTS idx_specialists_active ON public.specialists(tenant_id, active);
CREATE INDEX IF NOT EXISTS idx_messages_lead ON public.messages(lead_id);

-- ─── RLS (ROW LEVEL SECURITY) ───
-- Garantindo que uma clínica nunca acesse os dados de outra
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Exemplo de política de segurança (Simplificado para o Admin)
-- Nota: Em produção, usar (auth.uid() IN (SELECT id FROM users WHERE clinic_id = tenant_id))
CREATE POLICY "Clínicas acessam apenas seus dados" ON public.leads 
    FOR ALL USING (tenant_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));
