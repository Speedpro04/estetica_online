import logging
from fastapi import APIRouter, Request, BackgroundTasks
from app.services.evolution_service import get_evolution_service
from app.services.ai_service import consult_ai
from app.core.supabase_client import supabase

router = APIRouter()
logger = logging.getLogger(__name__)

async def handle_whatsapp_message(payload: dict):
    """
    Processa a mensagem recebida via background task.
    1. Identifica a clínica (pela instância do Evolution)
    2. Identifica o paciente (pelo número de telefone)
    3. Chama a IA Solara (Gemini)
    4. Envia resposta via Evolution API
    5. Salva histórico no Supabase
    """
    try:
        data = payload.get("data", {})
        message = data.get("message", {})
        
        # Ignorar mensagens enviadas por mim (para evitar loop)
        if data.get("key", {}).get("fromMe"):
            return

        instance_id = payload.get("instance")
        remote_jid = data.get("key", {}).get("remoteJid")
        # Formato: 5511999999999@s.whatsapp.net
        phone = remote_jid.split("@")[0]
        
        # Extrair texto da mensagem
        user_text = message.get("conversation") or \
                    message.get("extendedTextMessage", {}).get("text") or \
                    message.get("imageMessage", {}).get("caption")

        if not user_text:
            return

        # 1. Buscar clínica vinculada a esta instância
        clinic_res = supabase.table("clinics") \
            .select("id, clinic_name") \
            .eq("whatsapp_instance_id", instance_id) \
            .limit(1) \
            .execute()
        
        if not clinic_res.data:
            # Caso não ache por instância, podemos usar uma instância global do sistema
            # Mas o ideal é que cada clínica tenha seu registro
            logger.warning(f"Instância {instance_id} não vinculada a nenhuma clínica.")
            return

        clinic_id = clinic_res.data[0]["id"]
        clinic_name = clinic_res.data[0]["clinic_name"]

        # 2. Buscar ou criar paciente no Supabase
        patient_res = supabase.table("patients") \
            .select("id, name") \
            .eq("clinic_id", clinic_id) \
            .eq("phone", phone) \
            .limit(1) \
            .execute()

        if not patient_res.data:
            # Cadastrar paciente básico se não existir
            new_patient = supabase.table("patients").insert({
                "clinic_id": clinic_id,
                "name": data.get("pushName") or "Paciente Novo",
                "phone": phone
            }).execute()
            patient_id = new_patient.data[0]["id"]
            patient_name = new_patient.data[0]["name"]
        else:
            patient_id = patient_res.data[0]["id"]
            patient_name = patient_res.data[0]["name"]

        # 3. Chamar IA Solara (Gemini)
        # Passamos o clinic_id para a IA saber qual contexto usar
        ai_response = consult_ai(
            message=user_text,
            tenant_id=clinic_id,
            user_name=patient_name
        )

        # 4. Enviar resposta via Evolution API
        evo = get_evolution_service()
        await evo.send_text_message(
            instance_id=instance_id,
            number=phone,
            text=ai_response
        )

        # 5. Salvar histórico de chat no Supabase
        # Salva a pergunta do paciente
        supabase.table("messages").insert({
            "clinic_id": clinic_id,
            "patient_id": patient_id,
            "sender_type": "patient",
            "content": user_text
        }).execute()

        # Salva a resposta da IA
        supabase.table("messages").insert({
            "clinic_id": clinic_id,
            "patient_id": patient_id,
            "sender_type": "ai",
            "content": ai_response
        }).execute()

    except Exception as e:
        logger.error(f"Erro ao processar webhook do WhatsApp: {str(e)}")

@router.post("/webhook")
async def evolution_webhook(request: Request, background_tasks: BackgroundTasks):
    """
    Recebe os eventos da Evolution API.
    Recomenda-se processar em BackgroundTask para responder logo a Evolution API (Avoid Timeout).
    """
    payload = await request.json()
    event = payload.get("event")

    # Somente processar novas mensagens
    if event in ["messages.upsert", "messages.set"]:
        background_tasks.add_task(handle_whatsapp_message, payload)
        return {"status": "processing"}

    return {"status": "ignored", "event": event}

@router.get("/status/{instance_id}")
async def get_status(instance_id: str):
    """Retorna o status da conexão da instância."""
    evo = get_evolution_service()
    return await evo.get_instance_status(instance_id)

@router.get("/qrcode/{instance_id}")
async def get_qrcode(instance_id: str):
    """Retorna o QR Code base64 para conexão."""
    evo = get_evolution_service()
    # Assume que o service tem o método _request que pode buscar o qrcode
    # Endpoint do Evolution API para QR Code base64 costuma ser instance/connect/{instance_id}
    return await evo._request("GET", f"instance/connect/{instance_id}")
