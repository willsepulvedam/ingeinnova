# Flujo de pruebas de la API de INGEINNOVA

Este documento describe el flujo completo para probar la API del backend de INGEINNOVA.
Incluye los endpoints que se usan, el orden de llamada y ejemplos de datos del flujo real.

## 1. Crear un emprendimiento

Endpoint:
- `POST /emprendimiento/`

Body JSON de ejemplo:
```json
{
  "nombre": "Nuevo Emprendimiento Test",
  "propietario_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "descripcion": "Prueba completa de creación y listado"
}
```

Respuesta esperada:
- `id` del emprendimiento
- `nombre`
- `descripcion`
- `propietario_id`
- `fecha_creacion`
- `estado`

Ejemplo real de `emprendimiento_id` usado en esta prueba:
- `54332cc4-c766-4209-addb-433aab6b066c`

---

## 2. Obtener la ruta del emprendimiento

Endpoint:
- `GET /ruta/{emprendimiento_id}`

Ejemplo:
- `GET http://localhost:8000/ruta/54332cc4-c766-4209-addb-433aab6b066c`

Respuesta esperada:
```json
{
  "id": "5a4fbbc7-a6d9-4f74-b27f-3a39c6d82753",
  "emprendimiento_id": "54332cc4-c766-4209-addb-433aab6b066c",
  "etapa_actual": "BLOQUEADA",
  "fecha_inicio": "2026-04-08T18:50:26.501725"
}
```

El `id` de la ruta devuelto es el que se debe usar en los endpoints siguientes:
- `ruta_id`: `5a4fbbc7-a6d9-4f74-b27f-3a39c6d82753`

---

## 3. Listar etapas de la ruta

Endpoint:
- `GET /etapas/{emprendimiento_id}`

Ejemplo:
- `GET http://localhost:8000/etapas/54332cc4-c766-4209-addb-433aab6b066c`

Respuesta esperada: lista de etapas asociadas a la ruta.

Ejemplo de etapas:
```json
[
  {
    "id": "53fc9934-b2ac-42e9-93ec-62be9a282801",
    "nombre": "Único",
    "estado": "BLOQUEADA",
    "orden": 4,
    "ruta_id": "5a4fbbc7-a6d9-4f74-b27f-3a39c6d82753"
  },
  {
    "id": "8dd711f0-633e-4878-98a3-4aafad350b5d",
    "nombre": "Exploración",
    "estado": "COMPLETADA",
    "orden": 1,
    "ruta_id": "5a4fbbc7-a6d9-4f74-b27f-3a39c6d82753"
  },
  {
    "id": "0d75f1fb-56cb-4ab2-bb54-fea303c314f6",
    "nombre": "Ideacion",
    "estado": "COMPLETADA",
    "orden": 2,
    "ruta_id": "5a4fbbc7-a6d9-4f74-b27f-3a39c6d82753"
  },
  {
    "id": "99f42f49-d0fe-40d7-82d3-c92e928c8855",
    "nombre": "Traccion",
    "estado": "EN_PROGRESO",
    "orden": 3,
    "ruta_id": "5a4fbbc7-a6d9-4f74-b27f-3a39c6d82753"
  }
]
```

El `etapa_id` para la etapa en progreso es:
- `99f42f49-d0fe-40d7-82d3-c92e928c8855`

---

## 4. Avanzar la ruta

Endpoint:
- `POST /ruta/{ruta_id}/avanzar`

Ejemplo:
- `POST http://localhost:8000/ruta/5a4fbbc7-a6d9-4f74-b27f-3a39c6d82753/avanzar`

Este endpoint completa la etapa que está en `EN_PROGRESO` y pone la siguiente en `EN_PROGRESO`.

### Resultado esperado
- La etapa `Traccion` se marca como `COMPLETADA`.
- La siguiente etapa de orden `4` (`Único`) queda en `EN_PROGRESO`.

---

## 5. Consultar progreso de la ruta

Endpoint:
- `GET /ruta/{ruta_id}/progreso`

Ejemplo:
- `GET http://localhost:8000/ruta/5a4fbbc7-a6d9-4f74-b27f-3a39c6d82753/progreso`

Respuesta esperada:
```json
{
  "total_etapas": 4,
  "etapas_completadas": 3,
  "progreso": 75.0
}
```

> Nota: el endpoint actual en el código debe devolver un diccionario de progreso y no un modelo `Ruta`.

---

## 6. Consultar detalle de una etapa

Endpoint:
- `GET /etapas/{etapa_id}/detalle`

Ejemplo:
- `GET http://localhost:8000/etapas/99f42f49-d0fe-40d7-82d3-c92e928c8855/detalle`

Respuesta esperada: detalle completo de la etapa.

---

## 7. Completar una etapa manualmente

Endpoint:
- `POST /etapas/{etapa_id}/completar`

Ejemplo:
- `POST http://localhost:8000/etapas/99f42f49-d0fe-40d7-82d3-c92e928c8855/completar`

Este endpoint sirve para completar directamente una etapa específica.

---

## Resumen de IDs usados en el flujo

- `emprendimiento_id`: `54332cc4-c766-4209-addb-433aab6b066c`
- `ruta_id`: `5a4fbbc7-a6d9-4f74-b27f-3a39c6d82753`
- `etapa_id` activo inicial: `99f42f49-d0fe-40d7-82d3-c92e928c8855`

---

## Consejos rápidos

- Siempre usa el `emprendimiento_id` en los endpoints de `/ruta/{emprendimiento_id}` y `/etapas/{emprendimiento_id}`.
- Usa el `ruta_id` devuelto por `GET /ruta/{emprendimiento_id}` en los endpoints de `/ruta/{ruta_id}/...`.
- Usa el `etapa_id` devuelto por `GET /etapas/{emprendimiento_id}` en los endpoints de etapa.
- Si recibes un `500` en `POST /ruta/{ruta_id}/avanzar`, revisa que el `ruta_id` exista y que el servicio no esté retornando `None`.
