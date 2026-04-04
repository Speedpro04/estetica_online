import httpx
from typing import Optional, Dict, Any
from app.core.config import settings

class EvolutionService:
    """
    Wrapper para comunicação com a Evolution API (WhatsApp).
    Hostinger + Docker rodando Evolution API.
    """
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url.rstrip("/")
        self.headers = {
            "apikey": api_key,
            "Content-Type": "application/json"
        }

    async def send_text_message(
        self, 
        instance_id: str, 
        number: str, 
        text: str
    ) -> Dict[Any, Any]:
        """
        Envia uma mensagem de texto simples.
        """
        url = f"{self.base_url}/message/sendText/{instance_id}"
        
        # O número deve estar no formato DDI + DDD + Número (ex: 5511999999999)
        payload = {
            "number": number,
            "options": {
                "delay": 1200, # Pequeno delay humano (ms)
                "presence": "composing"
            },
            "text": text
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    url, json=payload, headers=self.headers
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                # Log do erro aqui (importante para LGPD/Auditoria)
                return {"error": str(e), "status": e.response.status_code}
            except Exception as e:
                return {"error": str(e)}

# Injeção de dependência simples para uso nas rotas
def get_evolution_service() -> EvolutionService:
    # URL e KEY devem vir do seu .env configurado no Easypanel
    return EvolutionService(
        base_url=os.getenv("EVOLUTION_URL", "http://evolution:8080"),
        api_key=os.getenv("EVOLUTION_API_KEY", "SUA_KEY_AQUI")
    )
import os
