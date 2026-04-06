"""
Motor de Inteligência de Pacientes — Assistente Solara
Calcula o Score de Risco e gera sugestões automáticas de ação para recuperação.
Versão Supabase.
"""

from datetime import datetime, timedelta, timezone
from app.core.supabase_client import supabase


# ──────────────────────────────────────────────
# Regras de Score de Risco
# ──────────────────────────────────────────────
REGRAS_RISCO = {
    "CRITICO": {"dias_ausencia": 90,  "label": "Crítico",  "prioridade": 1},
    "ALTO":    {"dias_ausencia": 60,  "label": "Alto",     "prioridade": 2},
    "MEDIO":   {"dias_ausencia": 30,  "label": "Médio",    "prioridade": 3},
    "BAIXO":   {"dias_ausencia": 0,   "label": "Baixo",    "prioridade": 4},
}


def calcular_score_risco(last_visit: str | datetime | None) -> str:
    """
    Calcula o score de risco de abandono com base na última visita.
    """
    if last_visit is None:
        return "CRITICO"

    if isinstance(last_visit, str):
        # Supabase retorna ISO strings
        last_visit = datetime.fromisoformat(last_visit.replace('Z', '+00:00'))

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
    """Gera uma sugestão de ação personalizada."""
    sugestoes = {
        "CRITICO": {
            "inativo":      "Enviar convite urgente com desconto exclusivo de retorno",
            "em_recuperacao": "Acompanhar resposta e oferecer horário prioritário",
            "default":      "Iniciar campanha de reativação imediata via WhatsApp",
        },
        "ALTO": {
            "inativo":      "Campanha de limpeza preventiva — alta taxa de conversão",
            "em_recuperacao": "Reforçar contato com segundo convite personalizado",
            "default":      "Contatar por WhatsApp mencionando o último procedimento",
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


def calcular_faturamento_potencial(score: str) -> float:
    """Estima o faturamento potencial médio recuperável por paciente segundo o score."""
    faturamento = {
        "CRITICO": 850.0,
        "ALTO":    620.0,
        "MEDIO":   420.0,
        "BAIXO":   200.0,
    }
    return faturamento.get(score, 300.0)


# ──────────────────────────────────────────────
# Funções de consulta ao banco de dados (Supabase)
# ──────────────────────────────────────────────

def get_recovery_stats(clinic_id: str) -> dict:
    """Retorna os KPIs de recuperação calculados dinamicamente no Supabase."""
    res = supabase.table("patients").select("*").eq("clinic_id", clinic_id).execute()
    pacientes = res.data or []

    if not pacientes:
        return _mock_stats()

    total = len(pacientes)
    criticos = sum(1 for p in pacientes if calcular_score_risco(p["last_visit"]) == "CRITICO")
    altos     = sum(1 for p in pacientes if calcular_score_risco(p["last_visit"]) == "ALTO")
    em_risco  = criticos + altos
    inativos  = sum(1 for p in pacientes if p["status"] == "inativo")

    taxa_abandono = round((inativos / total) * 100, 1) if total > 0 else 0

    faturamento_potencial = sum(
        calcular_faturamento_potencial(calcular_score_risco(p["last_visit"]))
        for p in pacientes if p["status"] == "inativo"
    )

    return {
        "taxa_abandono":         f"{taxa_abandono}%",
        "pacientes_em_risco":    em_risco,
        "criticos":              criticos,
        "pacientes_inativos":    inativos,
        "faturamento_potencial": round(faturamento_potencial, 2),
        "total_pacientes":       total,
    }


def get_priority_patients(clinic_id: str, limit: int = 50) -> list[dict]:
    """Retorna lista de pacientes prioritários para recuperação."""
    res = supabase.table("patients") \
        .select("*") \
        .eq("clinic_id", clinic_id) \
        .in_("status", ["inativo", "em_recuperacao"]) \
        .execute()
    
    pacientes = res.data or []

    resultado = []
    for p in pacientes:
        score = calcular_score_risco(p["last_visit"])
        prioridade = REGRAS_RISCO.get(score, {}).get("prioridade", 4)
        resultado.append({
            "id":            str(p["id"]),
            "name":          p["name"],
            "phone":         p["phone"],
            "status":        p["status"],
            "last_visit":    p["last_visit"] if p["last_visit"] else "Nunca",
            "score":         score,
            "score_label":   REGRAS_RISCO[score]["label"],
            "prioridade":    prioridade,
            "canal":         "WhatsApp",
            "sugestão":      gerar_sugestao_acao(score, p["status"]),
            "faturamento_potencial": calcular_faturamento_potencial(score),
            "notes":         p["notes"] or "",
        })

    resultado.sort(key=lambda x: x["prioridade"])
    return resultado[:limit]


def _mock_stats() -> dict:
    return {
        "taxa_abandono":         "18.4%",
        "pacientes_em_risco":    32,
        "criticos":              12,
        "pacientes_inativos":    47,
        "faturamento_potencial": 28400.0,
        "total_pacientes":       256,
    }
