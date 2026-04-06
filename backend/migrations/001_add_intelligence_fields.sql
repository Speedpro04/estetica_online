-- Migração: Módulo de Inteligência e Recuperação de Pacientes
-- Solara v2.0 — Motor de Score de Risco
-- Executar no banco PostgreSQL (Hostinger VPS / Supabase)

-- Adicionar campos de inteligência na tabela de pacientes
ALTER TABLE patients
  ADD COLUMN IF NOT EXISTS risk_score         VARCHAR(20)  DEFAULT 'BAIXO',
  ADD COLUMN IF NOT EXISTS missed_appointments INTEGER      DEFAULT 0,
  ADD COLUMN IF NOT EXISTS treatment_type     VARCHAR(255),
  ADD COLUMN IF NOT EXISTS treatment_value    FLOAT,
  ADD COLUMN IF NOT EXISTS last_contact_date  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS preferred_channel  VARCHAR(50)  DEFAULT 'WhatsApp';

-- Índice para queries eficientes por score e status
CREATE INDEX IF NOT EXISTS idx_patients_risk_score ON patients(tenant_id, risk_score);
CREATE INDEX IF NOT EXISTS idx_patients_status_risk ON patients(tenant_id, status, risk_score);

-- Recalcular score para pacientes existentes com base em last_visit
-- CRITICO: ausente > 90 dias | ALTO: 60-90 dias | MEDIO: 30-60 dias | BAIXO: < 30 dias
UPDATE patients SET
  risk_score = CASE
    WHEN last_visit IS NULL                                           THEN 'CRITICO'
    WHEN CURRENT_TIMESTAMP - last_visit > INTERVAL '90 days'         THEN 'CRITICO'
    WHEN CURRENT_TIMESTAMP - last_visit > INTERVAL '60 days'         THEN 'ALTO'
    WHEN CURRENT_TIMESTAMP - last_visit > INTERVAL '30 days'         THEN 'MEDIO'
    ELSE 'BAIXO'
  END
WHERE risk_score = 'BAIXO' OR risk_score IS NULL;

-- Marcar como inativos os pacientes com score CRITICO ou ALTO que ainda estão como 'ativo'
UPDATE patients SET status = 'inativo'
WHERE risk_score IN ('CRITICO', 'ALTO')
  AND status = 'ativo';

COMMENT ON COLUMN patients.risk_score IS 'Score de risco de abandono: CRITICO (>90d), ALTO (60-90d), MEDIO (30-60d), BAIXO (<30d)';
COMMENT ON COLUMN patients.missed_appointments IS 'Número de consultas perdidas sem reagendamento';
COMMENT ON COLUMN patients.treatment_type IS 'Tipo de tratamento odontológico realizado (Ortodontia, Implante, Limpeza, etc.)';
COMMENT ON COLUMN patients.treatment_value IS 'Valor estimado do tratamento pendente ou realizado';
COMMENT ON COLUMN patients.last_contact_date IS 'Data do último contato de recuperação realizado pela clínica';
COMMENT ON COLUMN patients.preferred_channel IS 'Canal preferido de comunicação: WhatsApp, SMS ou Email';
