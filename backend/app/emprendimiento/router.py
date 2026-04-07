from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import  Session
from uuid import UUID
from backend.app.database import get_session
from backend.app.emprendimiento.service import EmprendimientoService
from backend.app.emprendimiento.schema import EmprendimientoCreate, EmprendimientoRead, EmprendimientoUpdate

router = APIRouter(prefix="/emprendimiento", tags=["Emprendimiento"])
service = EmprendimientoService()

@router.post("/", response_model=EmprendimientoRead)
async def crear_emprendimiento(emprendimiento: EmprendimientoCreate, session: Session = Depends(get_session)):
    return service.crear(emprendimiento,session)

@router.get("/",response_model=list[EmprendimientoRead], tags=["Emprendimiento"])
async def listar(session: Session = Depends(get_session)):
    return service.listar(session)

@router.get("/{emprendimiento_id}", response_model=EmprendimientoRead)
async def obtener(emprendimiento_id: UUID, session: Session = Depends(get_session)):
    db_emprendimiento = service.obtener(emprendimiento_id, session)
    if not db_emprendimiento:
        raise HTTPException(status_code=404, detail="Emprendimiento no encontrado")
    return db_emprendimiento

@router.put("/{emprendimiento_id}", response_model=EmprendimientoRead)
async def actualizar(emprendimiento_id: UUID, emprendimiento: EmprendimientoUpdate, session: Session = Depends(get_session)):
    db_emprendimiento = service.actualizar(emprendimiento_id, emprendimiento, session)
    if not db_emprendimiento:
        raise HTTPException(status_code=404, detail="Emprendimiento no encontrado")
    return db_emprendimiento

@router.delete("/{emprendimiento_id}", status_code=204)
async def eliminar(emprendimiento_id: UUID, session: Session = Depends(get_session)) -> dict:
    success = service.eliminar(emprendimiento_id, session)
    if not success:
        raise HTTPException(status_code=404, detail="Emprendimiento no encontrado")
    return {"mensaje": "Emprendimiento eliminado correctamente"}
