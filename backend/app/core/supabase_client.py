from supabase import create_client, Client
from app.core.config import settings

def get_supabase_client() -> Client:
    """Cliente Supabase com service_role (acesso total, para backend)."""
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

def get_supabase_anon_client() -> Client:
    """Cliente Supabase com anon key (acesso restrito por RLS)."""
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)

# Singleton para reutilização
supabase: Client = get_supabase_client()
