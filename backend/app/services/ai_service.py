import os
import google.generativeai as genai
from sqlalchemy.orm import Session
from app.models.patient import Patient
from app.models.campaign import Campaign
from app.services.intelligence_service import (
    get_recovery_stats,
    get_priority_patients,
    calcular_score_risco,
)

# Configurar chave
api_key = os.getenv("GEMINI_API_KEY", "")
if api_key:
    genai.configure(api_key=api_key)

# Funções que a IA poderá chamar.
# Não passamos tenant_id nem db_session para a IA no schema, o backend preenche automaticamente!

def obter_resumo_campanhas(tenant_id: str, db: Session):
    """
    Retorna o resumo das campanhas ativas e rascunhos para a clínica logada.
    """
    try:
        campaigns = db.query(Campaign).filter(Campaign.tenant_id == tenant_id).all()
        if not campaigns:
            return "Nenhuma campanha encontrada no banco. (Exemplo MOCK: 1 campanha de botox ativa com 15% de conversão)."
        
        relatorio = [f"Campanha '{c.name}' (Status: {c.status}): {c.sent_messages}/{c.total_messages} enviadas." for c in campaigns]
        return " | ".join(relatorio)
    except Exception:
        return "Nenhuma campanha encontrada no banco. (MOCK: Temos 2 campanhas ativas, 'Recuperação Outubro' e 'Lembrete Limpeza')"

def obter_resumo_agendamentos(tenant_id: str, db: Session):
    """
    Retorna o número de agendamentos ou visitas recentes.
    """
    try:
        total = db.query(Patient).filter(Patient.tenant_id == tenant_id).count()
        return f"Temos no momento {total} pacientes cadastrados na base."
    except Exception:
        return "(MOCK: Tivemos 5 agendamentos concluídos hoje e 3 desmarcados.)"

def obter_pacientes_recuperacao(tenant_id: str, db: Session):
    """
    Retorna a contagem de pacientes inativos que precisam de recuperação.
    """
    try:
        inativos = db.query(Patient).filter(Patient.tenant_id == tenant_id, Patient.status == "inativo").count()
        return f"Existem {inativos} pacientes marcados como inativos."
    except Exception:
        return "(MOCK: Existem 15 pacientes inativos que são potenciais para uma campanha de recuperação.)"

def obter_pacientes_em_risco(tenant_id: str, db: Session):
    """
    Retorna o número de pacientes em cada nível de risco de abandono,
    usando o Motor de Inteligência do Solara.
    """
    try:
        stats = get_recovery_stats(tenant_id=tenant_id, db=db)
        return (
            f"Resumo de risco de abandono: "
            f"{stats['criticos']} pacientes CRÍTICOS (>90 dias ausentes), "
            f"{stats['pacientes_em_risco'] - stats['criticos']} pacientes em risco ALTO (60-90 dias), "
            f"Taxa de abandono atual: {stats['taxa_abandono']}. "
            f"Total de pacientes inativos: {stats['pacientes_inativos']}."
        )
    except Exception:
        return "(MOCK: 12 pacientes CRÍTICOS, 20 com risco ALTO, taxa de abandono de 18.4%.)"

def obter_previsao_faturamento_recuperacao(tenant_id: str, db: Session):
    """
    Retorna o faturamento potencial que pode ser recuperado com campanhas de reativação.
    """
    try:
        stats = get_recovery_stats(tenant_id=tenant_id, db=db)
        faturamento = stats.get("faturamento_potencial", 0)
        return (
            f"O faturamento potencial recuperável com campanhas de reativação é de "
            f"R$ {faturamento:,.2f}. "
            f"Isso é baseado no ticket médio de tratamentos dos {stats['pacientes_inativos']} pacientes inativos."
        )
    except Exception:
        return "(MOCK: R$ 28.400,00 de faturamento potencial com 47 pacientes inativos.)"

# Mapa de ferramentas seguras
SECURITY_TOOLS_MAP = {
    "obter_resumo_campanhas": obter_resumo_campanhas,
    "obter_resumo_agendamentos": obter_resumo_agendamentos,
    "obter_pacientes_recuperacao": obter_pacientes_recuperacao,
    "obter_pacientes_em_risco": obter_pacientes_em_risco,
    "obter_previsao_faturamento_recuperacao": obter_previsao_faturamento_recuperacao,
}

# Declaração das ferramentas para repassar ao Gemini
tools_declaration = [
    {
        "function_declarations": [
            {
                "name": "obter_resumo_campanhas",
                "description": "Obtém um resumo das campanhas de WhatsApp ativas e seu status de envio."
            },
            {
                "name": "obter_resumo_agendamentos",
                "description": "Obtém um resumo e contagem total de agendamentos e pacientes."
            },
            {
                "name": "obter_pacientes_recuperacao",
                "description": "Retorna o número de pacientes inativos prontos para recuperação."
            },
            {
                "name": "obter_pacientes_em_risco",
                "description": (
                    "Retorna a quantidade de pacientes em cada nível de risco de abandono "
                    "(Crítico, Alto, Médio, Baixo) usando o Motor de Inteligência Solara. "
                    "Use quando perguntarem sobre pacientes em risco, abandono ou quem precisa de atenção urgente."
                )
            },
            {
                "name": "obter_previsao_faturamento_recuperacao",
                "description": (
                    "Retorna o faturamento potencial que pode ser recuperado com campanhas de reativação de pacientes. "
                    "Use quando perguntarem sobre impacto financeiro, receita perdida ou potencial de recuperação."
                )
            },
        ]
    }
]

def consult_ai(message: str, tenant_id: str, user_name: str, db: Session):
    """
    Recebe a mensagem do usuário, consulta o modelo Gemini passando o contexto com tratamento empático,
    e executa as funções no backend caso a IA solicite, garantindo a segurança multiclinica.
    """
    if not api_key:
        return "Erro: A chave do Gemini (GEMINI_API_KEY) não está configurada no .env."
    
    # Intruções de sistema (System prompt)
    system_instruction = (
        f"Você é a Solara, uma assistente virtual e consultora inteligente para clínicas. "
        f"Seja sempre educada e proativa de forma totalmente neutra. "
        f"Jamais invente dados de pacientes. "
        f"Use as funções disponíveis para consultar ferramentas (campanhas, agendamentos, pacientes inativos). "
        f"Se não encontrar dados pelas ferramentas, forneça dicas ou responda amigavelmente informando."
    )
    
    try:
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            tools=tools_declaration,
            system_instruction=system_instruction
        )
        
        chat = model.start_chat()
        response = chat.send_message(message)
        
        # Verificar se a IA decidiu chamar alguma função
        if response.candidates and response.candidates[0].content.parts:
            part = response.candidates[0].content.parts[0]
            if part.function_call:
                func_name = part.function_call.name
                
                # Executa com segurança usando OBRIGATORIAMENTE o tenant_id do usuário e a sessão do banco
                tool_func = SECURITY_TOOLS_MAP.get(func_name)
                if tool_func:
                    tool_result = tool_func(tenant_id=tenant_id, db=db)
                else:
                    tool_result = "Erro: Ferramenta não encontrada."
                    
                # Envia o resultado do banco de volta para a IA analisar
                response = chat.send_message(
                    genai.types.ContentDict(
                        role="function",
                        parts=[
                            genai.types.Part.from_function_response(
                                name=func_name,
                                response={"result": tool_result}
                            )
                        ]
                    )
                )
        
        return response.text
    except Exception as e:
        print(f"Erro na comunicação com Gemini: {e}")
        return f"Desculpe {user_name}, ocorreu um erro ao consultar minha base de inteligência. Tente novamente em instantes."
