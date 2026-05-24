# Tests - Backend

## Configuración de la Base de Datos para Tests

Los tests están configurados para usar **PostgreSQL con una base de datos temporal** que se crea y elimina automáticamente en cada ejecución. Esto evita conflictos con la base de datos de desarrollo/producción.

### Requisitos Previos

1. **PostgreSQL debe estar ejecutándose** antes de correr los tests
2. **Variables de entorno configuradas** en el archivo `.env` en la raíz del proyecto

### Opciones para Ejecutar Tests

#### Opción 1: Usar Docker Compose (Recomendado)

Esta es la forma más fácil y consistente de ejecutar los tests:

```bash
# Iniciar los contenedores Docker (incluye PostgreSQL)
docker-compose up -d db

# Ejecutar tests desde la raíz del proyecto
python -m pytest backend/tests/ -v --tb=short

# Detener los contenedores cuando termines
docker-compose down
```

#### Opción 2: PostgreSQL Local

Si tienes PostgreSQL instalado localmente:

1. **Configurar la base de datos local:**
   ```bash
   # Crear usuario y base de datos (ejecutar en psql)
   CREATE USER ingeinnova WITH PASSWORD 'ingeinnova';
   CREATE DATABASE ingeinnova OWNER ingeinnova;
   GRANT ALL PRIVILEGES ON DATABASE ingeinnova TO ingeinnova;
   ```

2. **Actualizar el archivo `.env`** en la raíz del proyecto:
   ```env
   DATABASE_URL=postgresql+psycopg://ingeinnova:ingeinnova@localhost:5432/ingeinnova
   ```

3. **Ejecutar tests:**
   ```bash
   python -m pytest backend/tests/ -v --tb=short
   ```

### Cómo Funciona el Sistema de Tests

1. **Creación de Base de Datos Temporal:**
   - Al iniciar los tests, se crea una base de datos única con nombre: `test_ingeinnova_<uuid>`
   - Esto asegura que los tests no interfieran con la base de datos principal

2. **Aislamiento de Tests:**
   - Cada test se ejecuta dentro de una transacción
   - Al finalizar cada test, la transacción se revierte (rollback)
   - Esto garantiza que los tests sean independientes y repetibles

3. **Limpieza Automática:**
   - Al terminar todos los tests, la base de datos temporal se elimina automáticamente
   - No queda rastro en el sistema

### Estructura de Tests

```
backend/tests/
├── conftest.py           # Configuración de fixtures y base de datos
├── test_main.py          # Tests para endpoints principales
├── test_etapas.py        # Tests para endpoints de etapas
├── test_rutas.py         # Tests para endpoints de rutas
├── test_postulaciones.py # Tests para endpoints de postulaciones
└── README.md             # Esta documentación
```

### Comandos Útiles

```bash
# Ejecutar todos los tests
python -m pytest backend/tests/ -v

# Ejecutar tests con cobertura de código
python -m pytest backend/tests/ -v --cov=backend/app --cov-report=html

# Ejecutar un test específico
python -m pytest backend/tests/test_etapas.py::TestEtapasEndpoints::test_crear_etapa -v

# Ejecutar tests en modo silencioso (solo errores)
python -m pytest backend/tests/ -q

# Ejecutar tests y mostrar output local (print statements)
python -m pytest backend/tests/ -v -s
```

### Solución de Problemas Comunes

#### Error: "failed to resolve host 'db'"

**Causa:** Estás ejecutando los tests fuera de Docker y el archivo `.env` tiene `DATABASE_URL` apuntando al contenedor Docker (`db`).

**Solución:**
- Opción A: Usar Docker Compose (ver Opción 1 arriba)
- Opción B: Cambiar el `.env` para usar `localhost` (ver Opción 2 arriba)

#### Error: "database does not exist"

**Causa:** La base de datos de PostgreSQL no está creada o el usuario no tiene permisos.

**Solución:**
```bash
# Conectarse a PostgreSQL como superusuario
sudo -u postgres psql

# Crear usuario y base de datos
CREATE USER ingeinnova WITH PASSWORD 'ingeinnova';
CREATE DATABASE ingeinnova OWNER ingeinnova;
GRANT ALL PRIVILEGES ON DATABASE ingeinnova TO ingeinnova;
\q
```

#### Error: "email-validator is not installed"

**Causa:** Falta la dependencia `email-validator`.

**Solución:**
```bash
pip install email-validator
# o
pip install -r backend/requirements.txt
```

### Notas Importantes

1. **No modificar `conftest.py`** a menos que sepas lo que estás haciendo - maneja la creación y limpieza automática de la base de datos temporal.

2. **Los tests son independientes** - cada test se ejecuta en su propia transacción que se revierte al finalizar, por lo que no hay efectos secundarios entre tests.

3. **PostgreSQL es requerido** - los tests están diseñados para PostgreSQL ya que la aplicación usa características específicas como JSONB que no están disponibles en SQLite.

4. **Base de datos temporal** - cada ejecución de tests crea una base de datos nueva con nombre único, por lo que no hay riesgo de sobrescribir datos existentes.

### Dependencias

Las dependencias necesarias están en `backend/requirements.txt`:
- `pytest` - Framework de tests
- `python-dotenv` - Para cargar variables de entorno
- `sqlmodel` - ORM y schemas
- `psycopg` - Driver de PostgreSQL
- `email-validator` - Para validación de emails en Pydantic

### Contribución

Al agregar nuevos tests:
1. Usar los fixtures proporcionados (`client`, `db_session`, etc.)
2. No modificar la configuración de la base de datos
3. Mantener los tests independientes y aislados
4. Usar nombres descriptivos para las funciones de test