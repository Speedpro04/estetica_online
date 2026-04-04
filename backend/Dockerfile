# Usando imagem leve do Python
FROM python:3.11-slim

# Diretório de trabalho no container
WORKDIR /backend

# Evita que o Python gere arquivos .pyc e permite que logs cheguem ao console
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Instala dependências do sistema necessárias para o psycopg2
RUN apt-get update && apt-get install -y \
    postgresql-client \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copia e instala dependências do Python
COPY ./requirements.txt /backend/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /backend/requirements.txt

# Copia o código da aplicação
COPY ./app /backend/app

# Expõe a porta que o FastAPI vai rodar (Easypanel usa 80 ou Custom)
EXPOSE 8000

# Comando para rodar a aplicação
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
