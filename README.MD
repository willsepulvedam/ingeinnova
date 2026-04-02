# INGEINNOVA

Plataforma de emprendimiento de la **Universidad de Colombia — Unicolombo**. Sistema diseñado para gestionar, visibilizar y potenciar los proyectos de emprendimiento de la institución.

---

## Arquitectura

INGEINNOVA está construido bajo una arquitectura de **microservicios**, donde cada servicio es independiente, se despliega por separado y se comunica a través de HTTP.
```
INGEINNOVA/
├── backend/       # API REST — FastAPI + Python 3.12
├── frontend/      # Interfaz de usuario — React 19 + Vite 8
└── docker-compose.yml  # Orquestador de servicios
```

### Backend
API REST construida con **FastAPI** y **Python 3.12**. Gestiona la lógica de negocio, modelos de datos y endpoints del sistema. Usa `uv` como gestor de dependencias para garantizar velocidad y reproducibilidad.

### Frontend
Interfaz de usuario construida con **React 19** y **Vite 8**. Organizada por componentes, páginas y servicios. Se comunica con el backend a través de la capa de servicios.

### Infraestructura
Cada servicio corre en su propio contenedor Docker. No se necesita instalar Python ni Node.js en la máquina local — solo Docker.

---

## Equipo de desarrollo

| Nombre | Rol | GitHub |
|--------|-----|--------|
|        |     |        |
|        |     |        |
|        |     |        |
|        |     |        |

---

## Requisitos

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/)

---

## Instalación y ejecución
```bash
# Clonar el repositorio
git clone https://github.com/tu-org/ingeinnova.git
cd INGEINNOVA

# Levantar el backend
docker compose up backend

# Levantar el frontend
docker compose up frontend

# Levantar todo junto
docker compose up
```

Una vez levantados los servicios:

- **Frontend** → http://localhost:5173
- **Backend** → http://localhost:8000
- **Documentación API** → http://localhost:8000/docs

---

## Solución de problemas comunes

### `error getting credentials - err: exit status 1`

Este error ocurre en **WSL (Windows Subsystem for Linux)** cuando Docker intenta usar el gestor de credenciales de Windows (`desktop.exe`) y no puede acceder a él desde el entorno Linux.

**Solución:**
```bash
nano ~/.docker/config.json
```

Elimina la línea `"credsStore": "desktop.exe"` y deja el archivo así:
```json
{
  "auths": {
    "https://index.docker.io/v1/": {}
  }
}
```

Guarda con `Ctrl+O`, `Enter`, sal con `Ctrl+X` y vuelve a correr el comando.

---

### `Import "fastapi" could not be resolved` (Pylance / VSCode)

Pylance no encuentra las dependencias porque está apuntando al intérprete equivocado.

**Solución:**

`Ctrl+Shift+P` → `Python: Select Interpreter` → selecciona el que tenga la ruta `./backend/.venv/bin/python`.

Si no aparece, selecciona `Enter interpreter path` y escríbela manualmente.

---

### El contenedor levanta pero los cambios no se reflejan

El contenedor tiene una imagen cacheada. Forzar rebuild:
```bash
docker compose up backend --build
docker compose up frontend --build
```

---

## Ramas del repositorio

| Rama | Descripción |
|------|-------------|
| `main` | Código de producción |
| `demo` | Demo standalone para presentaciones |