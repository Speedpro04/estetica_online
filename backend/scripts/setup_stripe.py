import stripe
import os
from dotenv import load_dotenv

load_dotenv()
# Stripe API Key
STRIPE_API_KEY = os.getenv("STRIPE_SECRET_KEY")
stripe.api_key = STRIPE_API_KEY

plans = [
    {
        "id": "essencial",
        "name": "Solara Essencial",
        "price_brl": 147,
        "description": "Para clínicas pequenas (1 a 2 especialistas)",
        "features": ["Atendimento automático WhatsApp", "Agendamento inteligente", "Confirmações automáticas", "Painel de gestão básico"]
    },
    {
        "id": "profissional",
        "name": "Solara Profissional",
        "price_brl": 257,
        "description": "O melhor custo-benefício (3 a 5 especialistas)",
        "features": ["Tudo do plano Essencial", "Kanban de gestão visual", "Relatórios de NPS e faltas", "Integração Solara AI completa"]
    },
    {
        "id": "clinica",
        "name": "Solara Clínica",
        "price_brl": 367,
        "description": "Para grandes operações (6 a 10 especialistas)",
        "features": ["Tudo do plano Profissional", "Insights avançados de IA", "Campanhas automáticas", "Suporte prioritário dedicado"]
    }
]

def setup_stripe():
    print("🚀 Iniciando configuração de Produtos e Preços no Stripe...")
    
    for plan in plans:
        try:
            # 1. Criar ou Buscar Produto
            product = stripe.Product.create(
                name=plan["name"],
                description=plan["description"],
                metadata={
                    "plan_id": plan["id"],
                    "features": ", ".join(plan["features"])
                }
            )
            
            # 2. Criar Preço Recorrente (Mensal)
            price = stripe.Price.create(
                product=product.id,
                unit_amount=int(plan["price_brl"] * 100), # Valor em centavos
                currency="brl",
                recurring={"interval": "month"},
                metadata={"plan_id": plan["id"]}
            )
            
            print(f"✅ Plano {plan['name']} criado!")
            print(f"   - Product ID: {product.id}")
            print(f"   - Price ID: {price.id}")
            print(f"   - Valor: R$ {plan['price_brl']}/mês")
            print("-" * 30)
            
        except Exception as e:
            print(f"❌ Erro ao criar plano {plan['name']}: {str(e)}")

if __name__ == "__main__":
    setup_stripe()
