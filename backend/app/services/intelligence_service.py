"""
Motor de Inteligência de Pacientes — Assistente Solara
Calcula o Score de Risco e gera sugestões automáticas de ação para recuperação.
"""

from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.models.patient import Patient


# ──────────────────────────────────────────────
# Regras de Score de Risco
# ──────────────────────────────────────────────
REGRAS_RISCO = {
    "CRITICO": {"dias_ausencia": 90,  "label": "Crítico",  "prioridade": 1},
    "ALTO":    {"dias_ausencia": 60,  "label": "Alto",     "prioridade": 2},
    "MEDIO":   {"dias_ausencia": 30,  "label": "Médio",    "prioridade": 3},
    "BAIXO":   {"dias_ausencia": 0,   "label": "Baixo",    "prioridade": 4},
}


def calcular_score_risco(last_visit: datetime | None) -> str:
    """
    Calcula o score de risco de abandono com base na última visita.
    - CRITICO: > 90 dias de ausência
    - ALTO:    60–90 dias de ausência
    - MEDIO:   30–60 dias de ausência
    - BAIXO:   < 30 dias ou ativo
    """
    if last_visit is None:
        return "CRITICO"  # Paciente nunca veio → risco máximo

    agora = datetime.now(timezone.utc)
    if last_visit.tzinfo is None:
        last_visit = last_visit.replace(tzinfo=timezone.utc)

    dias_ausente = (agora - last_visit).days

    if dias_ausente >= 90:
        return "CRITICO"
    elif dias_ausente >= 60:
        return "ALTO"
    elif dias_ausente >= 30:
        return "MEDIO"
    else:
        return "BAIXO"


def gerar_sugestao_acao(score: str, status: str) -> str:
    """
    Gera uma sugestão de ação personalizada com base no score e status do paciente.
    """
    sugestoes = {
        "CRITICO": {
            "inativo":      "Enviar convite urgente com desconto exclusivo de retorno",
            "em_recuperacao": "Acompanhar resposta e oferecer horário prioritário",
            "default":      "Iniciar campanha de reativação imediata via WhatsApp",
        },
        "ALTO": {
            "inativo":      "Campanha de limpeza preventiva — alta taxa de conversão",
            "em_recuperacao": "Reforçar contato com segundo convite personalizado",
            "default":      "Contatarpor WhatsApp mencionando o último procedimento",
        },
        "MEDIO": {
            "inativo":      "Enviar lembrete de revisão preventiva agendada",
            "em_recuperacao": "Oferecer horários disponíveis para retorno",
            "default":      "Notificação de check-up preventivo recomendado",
        },
        "BAIXO": {
            "default": "Paciente ativo — manter comunicação de rotina",
        },
    }

    status_lower = status.lower().replace(" ", "_") if status else "default"
    mapa = sugestoes.get(score, {})
    return mapa.get(status_lower, mapa.get("default", "Manter monitoramento padrão"))


def obter_canal_preferido(patient: Patient) -> str:
    """
    Determina o canal de comunicação preferido do paciente.
    Atualmente padrão WhatsApp; pode ser expandido com histórico de resposta.
    """
    if patient.phone:
        return "WhatsApp"
    return "Email"


def calcular_faturamento_potencial(score: str) -> float:
    """
    Estima o faturamento potencial médio recuperável por paciente segundo o score.
    Valores baseados em ticket médio odontológico estimado.
    """
    faturamento = {
        "CRITICO": 850.0,
        "ALTO":    620.0,
        "MEDIO":   420.0,
        "BAIXO":   200.0,
    }
    return faturamento.get(score, 300.0)


# ──────────────────────────────────────────────
# Funções de consulta ao banco de dados
# ──────────────────────────────────────────────

def get_recovery_stats(tenant_id: str, db: Session) -> dict:
    """
    Retorna os KPIs de recuperação calculados dinamicamente a partir do banco.
    """
    pacientes = db.query(Patient).filter(Patient.tenant_id == tenant_id).all()

    if not pacientes:
        return _mock_stats()

    total = len(pacientes)
    criticos = sum(1 for p in pacientes if calcular_score_risco(p.last_visit) == "CRITICO")
    altos     = sum(1 for p in pacientes if calcular_score_risco(p.last_visit) == "ALTO")
    em_risco  = criticos + altos
    inativos  = sum(1 for p in pacientes if p.status == "inativo")

    taxa_abandono = round((inativos / total) * 100, 1) if total > 0 else 0

    faturamento_potencial = sum(
        calcular_faturamento_potencial(calcular_score_risco(p.last_visit))
        for p in pacientes if p.status == "inativo"
    )

    return {
        "taxa_abandono":         f"{taxa_abandono}%",
        "pacientes_em_risco":    em_risco,
        "criticos":              criticos,
        "pacientes_inativos":    inativos,
        "faturamento_potencial": round(faturamento_potencial, 2),
        "total_pacientes":       total,
    }


def get_priority_patients(tenant_id: str, db: Session, limit: int = 50) -> list[dict]:
    """
    Retorna lista de pacientes prioritários para recuperação,
    ordenados por score de risco (Crítico primeiro).
    """
    pacientes = (
        db.query(Patient)
        .filter(Patient.tenant_id == tenant_id)
        .filter(Patient.status.in_(["inativo", "em_recuperacao"]))
        .all()
    )

    resultado = []
    for p in pacientes:
        score = calcular_score_risco(p.last_visit)
        prioridade = REGRAS_RISCO.get(score, {}).get("prioridade", 4)
        resultado.append({
            "id":            str(p.id),
            "name":          p.name,
            "phone":         p.phone,
            "status":        p.status,
            "last_visit":    p.last_visit.strftime("%d/%m/%Y") if p.last_visit else "Nunca",
            "score":         score,
            "score_label":   REGRAS_RISCO[score]["label"],
            "prioridade":    prioridade,
            "canal":         obter_canal_preferido(p),
            "sugestão":      gerar_sugestao_acao(score, p.status),
            "faturamento_potencial": calcular_faturamento_potencial(score),
            "notes":         p.notes or "",
        })

    # Ordenar por prioridade (Crítico=1 primeiro) e depois por data de last_visit
    resultado.sort(key=lambda x: (x["prioridade"], x["last_visit"]))
    return resultado[:limit]


def recalcular_scores_tenant(tenant_id: str, db: Session) -> int:
    """
    Recalcula e atualiza o status dos pacientes com base no score de risco.
    Pacientes com score CRITICO ou ALTO e status 'ativo' são marcados como 'inativo'.
    Retorna o número de pacientes atualizados.
    """
    pacientes = db.query(Patient).filter(Patient.tenant_id == tenant_id).all()
    atualizados = 0

    for p in pacientes:
        score = calcular_score_risco(p.last_visit)
        if score in ["CRITICO", "ALTO"] and p.status == "ativo":
            p.status = "inativo"
            atualizados += 1

    db.commit()
    return atualizados


# ──────────────────────────────────────────────
# Fallback com dados de exemplo (quando DB vazio)
# ──────────────────────────────────────────────

def _mock_stats() -> dict:
    return {
        "taxa_abandono":         "18.4%",
        "pacientes_em_risco":    32,
        "criticos":              12,
        "pacientes_inativos":    47,
        "faturamento_potencial": 28400.0,
        "total_pacientes":       256,
    }
