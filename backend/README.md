# INGEINNOVA — Ecosistema Backend (FastAPI)

Lógica de servidor, API y gestión de datos. Arquitectura de alto rendimiento con `uv` como motor de dependencias.

---

## Estructura del proyecto

```
backend/
├── app/
│   ├── main.py                          # Punto de entrada: instancia FastAPI y registra routers
│   ├── core/                            # Configuración central
│   │   ├── config.py                    # Variables de entorno y settings
│   │   ├── database.py                  # Engine, SessionLocal, Base ORM
│   │   └── security.py                  # JWT, hashing, dependencias de auth
│   │
│   ├── shared/                          # Utilidades reutilizables entre módulos
│   │   ├── pagination.py
│   │   └── responses.py
│   │
│   ├── etapa/                           # Módulo simple
│   │   ├── enums/
│   │   ├── models/
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   ├── create.py
│   │   │   ├── detail.py
│   │   │   ├── out.py
│   │   │   └── update.py
│   │   ├── exceptions.py
│   │   ├── repository.py
│   │   ├── router.py
│   │   └── service.py
│   │
│   ├── ruta/                            # Módulo simple (misma estructura que etapa)
│   │   ├── enums/
│   │   ├── models/
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   ├── create.py
│   │   │   ├── out.py
│   │   │   └── update.py
│   │   ├── exceptions.py
│   │   ├── repository.py
│   │   ├── router.py
│   │   └── service.py
│   │
│   └── postulacion/                     # Módulo compuesto
│       ├── models/
│       ├── schemas/                     # Schemas divididos por subentidad
│       │   ├── detalles_emprendimiento/
│       │   │   ├── enums/
│       │   │   ├── __init__.py
│       │   │   ├── base.py
│       │   │   ├── create.py
│       │   │   └── out.py
│       │   ├── emprendedor/
│       │   ├── emprendimiento/
│       │   └── informacion_academica/
│       │       └── __init__.py
│       ├── exceptions.py
│       ├── repository.py
│       ├── router.py
│       └── service.py
│
├── diagrams/                            # Diagramas de arquitectura y flujos
├── tests/                               # Pruebas unitarias y de integración (Pytest)
├── .venv/                               # Entorno virtual local — no subir a git
├── Dockerfile
├── mypy.ini
├── pyproject.toml
├── uv.lock
└── requirements.txt
```

---

## Arquitectura por tipo de módulo

Hay dos patrones de módulo en el proyecto:

### Módulo simple — `etapa` / `ruta`

Dominio con una única entidad principal. Estructura plana y directa:

```
Router → Service → Repository → Model
           ↕
        Schemas (base / create / update / detail / out)
```

| Capa | Archivo | Responsabilidad |
|------|---------|-----------------|
| **API** | `router.py` | Define los endpoints HTTP y delega al servicio |
| **Negocio** | `service.py` | Orquesta la lógica, valida reglas de dominio |
| **Datos** | `repository.py` | Ejecuta queries contra la base de datos |
| **ORM** | `models/` | Define la tabla en la base de datos |
| **Contratos** | `schemas/` | Valida y serializa datos de entrada y salida |
| **Errores** | `exceptions.py` | Excepciones específicas del dominio |

### Módulo compuesto — `postulacion`

Dominio que agrupa múltiples subentidades relacionadas. Los schemas se organizan por subentidad en lugar de por operación:

```
Router → Service → Repository → Models
           ↕
        schemas/
          ├── detalles_emprendimiento/
          ├── emprendedor/
          ├── emprendimiento/
          └── informacion_academica/
```

Cada subcarpeta de schemas replica la misma convención (`base`, `create`, `out`, `enums/`) pero acotada a su subentidad. Las capas de servicio, repositorio y router siguen siendo únicas por módulo.

---

## Diagramas

### Inyección Externa

![Diagrama de Inyección Externa](diagrams/Injeccione-Externa-2026-05-13-184324.svg)

> Flujo actualizado:

![Inyección Externa (actualizado)](diagrams/Injeccione%20Externa-2026-05-22-224939.svg)

### Postulación y Etapa

![Diagrama Postulación y Etapa](diagrams/Postulacion%20and%20Etapa-2026-05-22-225506.svg)

---

## Archivos clave

**`pyproject.toml`** — Fuente de verdad del entorno. Define qué versión de Python usar y qué librerías necesita el proyecto. Modificarlo siempre a través de `uv add`, nunca a mano.

**`uv.lock`** — Fija exactamente cada versión y hash de cada paquete. Garantiza que todos en el equipo instalen los mismos bits. Generado automáticamente por `uv` — nunca editarlo a mano.

**`requirements.txt`** — Puente para Docker. Se regenera con `uv export` cada vez que agregas una librería. No editar directamente.

---

## Gestión de dependencias

> **Importante:** No usar `pip install` directamente. Siempre usar `uv`.

```bash
# Agregar librería de producción
$ uv add sqlmodel

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