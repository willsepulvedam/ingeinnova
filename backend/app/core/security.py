from typing import Any
import bcrypt
from pydantic_core import core_schema


class PasswordSecure(str):
    """Clase personalizada para representar contraseñas válidas en texto plano."""

    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler: Any
    ) -> core_schema.CoreSchema:
        return core_schema.str_schema(min_length=8, max_length=128)


def hash_password(password_plana: str) -> str:
    """Genera el hash de una contraseña plana usando bcrypt nativo."""
    # Convertimos el string a bytes
    password_bytes = password_plana.encode('utf-8')
    # Generamos el salt y el hash
    salt = bcrypt.gensalt()
    hash_bytes = bcrypt.hashpw(password_bytes, salt)
    # Devolvemos el hash como string para la BD
    return hash_bytes.decode('utf-8')


def verificar_password(password_plana: str, hash_almacenado: str) -> bool:
    """Verifica la contraseña plana contra el hash guardado."""
    try:
        return bcrypt.checkpw(
            password_plana.encode('utf-8'), 
            hash_almacenado.encode('utf-8')
        )
    except Exception:
        return False