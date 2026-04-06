import httpx
import logging
from typing import Optional, Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

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

    async def _request(self, method: str, endpoint: str, json: Optional[Dict] = None) -> Dict[str, Any]:
        """Método generico para requests."""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.request(method, url, json=json, headers=self.headers)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                logger.error(f"Evolution API Error: {e.response.status_code} - {e.response.text}")
                return {"error": True, "status": e.response.status_code, "message": e.response.text}
            except Exception as e:
                logger.error(f"Evolution API Exception: {str(e)}")
                return {"error": True, "message": str(e)}

    async def get_instance_status(self, instance_id: str) -> Dict[str, Any]:
        """Verifica se a instância está conectada."""
        return await self._request("GET", f"instance/connectionState/{instance_id}")

    async def send_text_message(
        self, 
        instance_id: str, 
        number: str, 
        text: str,
        delay: int = 1200
    ) -> Dict[str, Any]:
        """
        Envia uma mensagem de texto com delay simulando presença humana.
        """
        # Formatar número (remover caracteres não numéricos)
        clean_number = "".join(filter(str.isdigit, number))
        
        payload = {
            "number": clean_number,
            "options": {
                "delay": delay,
                "presence": "composing",
                "linkPreview": True
            },
            "text": text
        }
        
        return await self._request("POST", f"message/sendText/{instance_id}", json=payload)

    async def send_media_message(
        self,
        instance_id: str,
        number: str,
        media_url: str,
        caption: str = "",
        type: str = "image"
    ) -> Dict[str, Any]:
        """Envia imagens ou documentos."""
        clean_number = "".join(filter(str.isdigit, number))
        payload = {
            "number": clean_number,
            "options": {
                "delay": 1200,
                "presence": "composing"
            },
            "mediaMessage": {
                "mediatype": type,
                "caption": caption,
                "media": media_url
            }
        }
        return await self._request("POST", f"message/sendMedia/{instance_id}", json=payload)

def get_evolution_service() -> EvolutionService:
    """Injeção de dependência usando as configurações do sistema."""
    return EvolutionService(
        base_url=settings.EVOLUTION_URL,
        api_key=settings.EVOLUTION_API_KEY
    )
