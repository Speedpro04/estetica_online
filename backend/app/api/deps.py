from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.user import User

# O token JWT deve chegar via header Authorization: Bearer <TOKEN>
reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

def get_db() -> Generator:
    # Gerador de sessão do banco de dados (mockado inicialmente)
    # Aqui o usuário configurará a conexão oficial do Postgres no Hostinger
    db = None 
    try:
        yield db
    finally:
        pass

def get_current_user(
    db: Session = Depends(get_db), 
    token: str = Depends(reusable_oauth2)
) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        # Extraímos o tenant_id e o sub (ID do usuário)
        user_id: str = payload.get("sub")
        tenant_id: str = payload.get("tenant_id")
        
        if user_id is None or tenant_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Token inválido: falta tenant_id ou sub",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Não foi possível validar as credenciais",
        )
    
    # Busca usuário no banco (Mock)
    # num sistema real: user = db.query(User).filter(User.id == user_id).first()
    user = User(tenant_id=tenant_id, id=user_id) 
    
    if not user:
        raise HTTPException(
            status_code=404, detail="Usuário não encontrado"
        )
    return user
