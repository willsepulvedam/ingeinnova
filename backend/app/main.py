from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.core.database import engine, init_db # noqa: F401
from backend.app.postulacion.models.emprendedor import Tabla_Emprendedor # noqa: F401
from backend.app.postulacion.models.emprendimiento import Tabla_Emprendimiento # noqa: F401
from backend.app.postulacion.models.detalles_emprendimiento import (
    Tabla_DetallesEmprendimiento,  # noqa: F401
)

from backend.app.postulacion.router import router as postulacion_router
from backend.app.etapa.router import router as etapa_router
from backend.app.ruta.router import router as ruta_router
from backend.app.shared.responses import standard_response

from backend.app.postulacion.exceptions.emprendimiento_exception import (
    EmpredimientoNotFoundError,
)
from backend.app.postulacion.exceptions.postulacion_incompleted import (
    PostulacionIncompletedError,
)
from backend.app.etapa.exceptions.etapa_not_found_error import EtapaNotFoundError
from backend.app.etapa.exceptions.etapa_fecha_invalida import EtapaFechasInvalidasError
from backend.app.ruta.exceptions.ruta_not_found import RutaNotFoundError
from backend.app.ruta.exceptions.ruta_contenido_invalidad import (
    RutaContenidoInvalidoError,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="Ingeinnova API - Sistema de Emprendimiento Universitario",
    version="1.0.0",
    description="""
    API institucional para la gestión, seguimiento y desarrollo de proyectos de emprendimiento 
    en el marco del programa Ingeinnova de la Universidad.
    
    ## Funcionalidades
    
    * **Postulaciones**: Registro y administración de emprendedores universitarios y sus ideas de negocio.
    * **Etapas**: Configuración del ciclo de vida y fases del programa institucional.
    * **Rutas**: Gestión de planes de trabajo, entregas y tutorías de seguimiento.
    
    ## Autenticación
    
    La API utiliza tokens JWT para garantizar la seguridad de los accesos de estudiantes, egresados y administradores.
    """,
    contact={
        "name": "Soporte de Emprendimiento Ingeinnova",
        "url": "https://ingeinnova.com",
        "email": "soporte@ingeinnova.com",
    },
    license_info={
        "name": "Propiedad Intelectual Reservada - Universidad Unicolombo",
        "url": "https://unicolombo.edu.co",
    },
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(postulacion_router, prefix="/api/v1/postulaciones")
app.include_router(etapa_router, prefix="/api/v1/etapas", tags=["Etapas"])
app.include_router(ruta_router, prefix="/api/v1/rutas", tags=["Rutas"])


@app.get("/", response_model=dict, tags=["Health"])
async def root():
    return standard_response(
        success=True,
        message="API de Ingeinnova funcionando correctamente",
        data={"version": "1.0.0", "status": "active"},
    )


@app.get("/health", response_model=dict, tags=["Health"])
async def health_check():
    return standard_response(
        success=True, message="Servicio saludable", data={"status": "healthy"}
    )


@app.exception_handler(EmpredimientoNotFoundError)
async def emprendimiento_not_found_handler(request, exc: EmpredimientoNotFoundError):
    return standard_response(
        success=False, message=exc.message, status_code=exc.status_code, data=None
    )


@app.exception_handler(PostulacionIncompletedError)
async def postulacion_incompleted_handler(request, exc: PostulacionIncompletedError):
    return standard_response(
        success=False, message=exc.message, status_code=exc.status_code, data=None
    )


@app.exception_handler(EtapaNotFoundError)
async def etapa_not_found_handler(request, exc: EtapaNotFoundError):
    return standard_response(
        success=False, message=exc.message, status_code=exc.status_code, data=None
    )


@app.exception_handler(EtapaFechasInvalidasError)
async def etapa_fechas_invalidas_handler(request, exc: EtapaFechasInvalidasError):
    return standard_response(
        success=False, message=exc.message, status_code=exc.status_code, data=None
    )


@app.exception_handler(RutaNotFoundError)
async def ruta_not_found_handler(request, exc: RutaNotFoundError):
    return standard_response(
        success=False, message=exc.message, status_code=exc.status_code, data=None
    )


@app.exception_handler(RutaContenidoInvalidoError)
async def ruta_contenido_invalido_handler(request, exc: RutaContenidoInvalidoError):
    return standard_response(
        success=False, message=exc.message, status_code=exc.status_code, data=None
    )
