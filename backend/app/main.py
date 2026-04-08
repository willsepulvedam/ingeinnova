from contextlib import asynccontextmanager
from fastapi import FastAPI
from backend.app.database import create_db_and_tables
from backend.app.emprendimiento.router import router as emprendimiento_router
from backend.app.ruta.router import router as ruta_router
from backend.app.etapa.router import router as etapa_router
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield
    
    
app = FastAPI(lifespan=lifespan)


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# pasamos los routers a la aplicación
app.include_router(emprendimiento_router)
app.include_router(ruta_router)
app.include_router(etapa_router)