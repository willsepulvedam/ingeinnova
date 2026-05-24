from pydantic import EmailStr
from sqlmodel import SQLModel
from sqlmodel._compat import SQLModelConfig

from backend.app.core.security import PasswordSecure


class EmprendedorLogin(SQLModel, table=False):
    email: EmailStr

    password: PasswordSecure

    model_config = SQLModelConfig(
        extra="forbid",
        from_attributes=True,
    )
