import redis
from app.core.config import settings

class RedisService:
    """
    Gerenciador de conexões Redis para o Assistente Solara.
    Facilita o uso de filas (Queues) e Cache rápida.
    """
    def __init__(self, redis_url: str):
        self.r = redis.Redis.from_url(redis_url, decode_responses=True)

    def set_value(self, key: str, value: str, expire: int = 3600):
        """
        Salva um valor com tempo de expiração (ideal para tokens de sessão).
        """
        self.r.set(key, value, ex=expire)

    def get_value(self, key: str):
        return self.r.get(key)

    def enqueue_campaign_task(self, campaign_id: str):
        """
        Adiciona uma campanha na fila para o Worker processar os disparos.
        """
        self.r.lpush("campaign_queue", campaign_id)

def get_redis_service() -> RedisService:
    return RedisService(redis_url=settings.REDIS_URL)
