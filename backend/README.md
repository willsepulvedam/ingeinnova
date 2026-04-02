# INGEINNOVA — Ecosistema Backend (FastAPI)

Lógica de servidor, API y gestión de datos. Arquitectura de alto rendimiento con `uv` como motor de dependencias.

---

## Estructura del proyecto
```
backend/
├── app/                  # Código fuente de la aplicación
│   ├── main.py           # Punto de entrada: crea la instancia FastAPI y registra routers
│   ├── models.py         # Modelos ORM: define las tablas de la base de datos
│   ├── schemas.py        # Esquemas Pydantic: valida y serializa datos de entrada/salida
│   ├── database.py       # Conexión y sesión con la BD (engine, SessionLocal)
│   └── routers/          # Endpoints agrupados por recurso (un archivo por router)
├── tests/                # Pruebas unitarias y de integración (Pytest)
├── .venv/                # Entorno virtual local — no subir a git
├── Dockerfile            # Imagen de contenedor Linux para producción
├── pyproject.toml        # Cerebro del proyecto: versiones de Python y dependencias
├── uv.lock               # Candado: fija exactamente cada versión instalada
└── requirements.txt      # Puente para Docker — auto-generado, no editar a mano
```

### ¿Qué hace cada archivo clave?

**`pyproject.toml`** — Fuente de verdad del entorno. Define qué versión de Python usar y qué librerías necesita el proyecto. Modificarlo siempre a través de `uv add`, nunca a mano.

**`uv.lock`** — Fija exactamente cada versión y hash de cada paquete. Garantiza que todos en el equipo instalen los mismos bits. Generado automáticamente por `uv` — nunca editarlo a mano.

**`requirements.txt`** — Puente para Docker. Se regenera con `uv export` cada vez que agregas una librería. No editar directamente.

---

## Gestión de dependencias

> **Importante:** No usar `pip install` directamente. Siempre usar `uv`.
```bash
# Agregar librería de producción
$ uv add sqlalchemy

# Agregar herramienta de desarrollo
$ uv add --group dev pytest

# Actualizar el puente para Docker (siempre después de agregar una librería)
$ uv export --format requirements-txt -o requirements.txt
```

---

## Pruebas

Antes de subir cualquier cambio:
```bash
$ uv run pytest
```

---

## Ejecución

Este servicio corre como contenedor dentro del ecosistema de microservicios. Para levantarlo:
```bash
$ docker compose up backend
```