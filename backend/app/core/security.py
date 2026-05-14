from typing import Any 
from pydantic_core import core_schema
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")





class PasswordSecure(str): 
    """Clase personalizada para representar contraseñas seguras.""" 
    
    
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type: Any, handler: Any) -> core_schema.CoreSchema: 
        return core_schema.no_info_after_validator_function(
            cls.validate,
            core_schema.str_schema(min_length=8, max_length=128)
        )
        
    @classmethod
    def validate(cls, v: str) -> str: 
        return pwd_context.hash(v)
    
    
    
def verificar_password(password_plana: str, hash_almacenado: str) -> bool: 
    return pwd_context.verify(password_plana, hash_almacenado)