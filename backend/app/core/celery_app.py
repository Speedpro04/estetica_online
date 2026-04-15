from celery import Celery
from celery.schedules import crontab
from app.core.config import settings

celery_app = Celery(
    "odonto_connect_worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=[
        "app.services.tasks",
    ]
)

celery_app.conf.update(
    # Serialização
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",

    # Timezone
    timezone="America/Sao_Paulo",
    enable_utc=True,

    # Controle de execução
    task_track_started=True,
    task_time_limit=3600,        # Limite máximo: 1 hora
    task_soft_time_limit=1800,   # Aviso suave: 30 minutos
    worker_max_tasks_per_child=200,  # Recicla worker a cada 200 tarefas (previne memory leak)

    # Retry
    task_acks_late=True,         # Confirma a tarefa somente APÓS concluir (evita perda)
    worker_prefetch_multiplier=1, # Pega 1 tarefa por vez (melhor para tarefas pesadas)

    # Resultados
    result_expires=86400,  # Resultados expiram em 24h
)

# ─────────────────────────────────────────────
# Celery Beat - Tarefas Agendadas
# ─────────────────────────────────────────────
celery_app.conf.beat_schedule = {
    # Verifica assinaturas expiradas todos os dias às 6h
    "verificar-assinaturas-expiradas": {
        "task": "tasks.check_expired_subscriptions",
        "schedule": crontab(hour=6, minute=0),
        "options": {"queue": "scheduled"},
    },

    # Envia lembretes de consulta todos os dias às 8h
    "lembrete-consultas-diario": {
        "task": "tasks.send_appointment_reminders",
        "schedule": crontab(hour=8, minute=0),
        "options": {"queue": "scheduled"},
    },

    # Processa leads inativos para recuperação via IA às 10h e 15h
    "recuperar-leads-ia-manha": {
        "task": "tasks.process_inactive_leads",
        "schedule": crontab(hour=10, minute=0),
        "options": {"queue": "ai"},
    },
    "recuperar-leads-ia-tarde": {
        "task": "tasks.process_inactive_leads",
        "schedule": crontab(hour=15, minute=0),
        "options": {"queue": "ai"},
    },

    # Gera relatório de performance semanal (segunda-feira às 7h)
    "relatorio-semanal-performance": {
        "task": "tasks.generate_weekly_report",
        "schedule": crontab(hour=7, minute=0, day_of_week=1),
        "options": {"queue": "reports"},
    },
}

if __name__ == "__main__":
    celery_app.start()
