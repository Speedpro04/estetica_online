from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api_v1 import api_router
from app.core.config import settings

from app.services.tasks import test_task

def get_application() -> FastAPI:
    _app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

    _app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"], # Recomendo configurar para o seu domínio da Hostinger depois
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    _app.include_router(api_router, prefix=settings.API_V1_STR)

    return _app

app = get_application()

@app.get("/")
def read_root():
    return {"message": "Assistente Solara API Operacional", "version": settings.VERSION}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "solara-backend"}

@app.post("/test-celery/{name}")
def trigger_celery_test(name: str):
    task = test_task.delay(name)
    return {"task_id": task.id, "status": "Tarefa enviada para a fila!"}
