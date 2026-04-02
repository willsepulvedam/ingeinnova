# INGEINNOVA — Ecosistema Frontend (React + Vite)

Interfaz de usuario del sistema INGEINNOVA. Construida con React 19 y Vite 8, orientada a componentes y lista para escalar.

---

## Estructura del proyecto
```
frontend/
├── app/                  # Código fuente de la aplicación
│   ├── assets/           # Recursos estáticos: imágenes, fuentes, iconos
│   ├── components/       # Componentes reutilizables (botones, cards, inputs, etc.)
│   ├── hooks/            # Custom hooks de React (lógica reutilizable)
│   ├── pages/            # Vistas completas de la aplicación (una por ruta)
│   ├── services/         # Llamadas a la API del backend (fetch, axios, etc.)
│   └── main.jsx          # Punto de entrada: monta la app en el DOM
├── node_modules/         # Dependencias instaladas — no subir a git
├── .gitignore
├── Dockerfile
├── package.json          # Dependencias y scripts del proyecto
├── package-lock.json     # Versiones exactas de cada paquete instalado
├── vite.config.js        # Configuración de Vite (puerto, plugins, host)
└── README.md
```

### ¿Qué hace cada carpeta de `app/`?

**`assets/`** — Archivos estáticos que forman parte del bundle: imágenes, fuentes personalizadas e iconos SVG. A diferencia de `public/`, estos pasan por Vite y se optimizan en el build.

**`components/`** — Piezas de UI reutilizables e independientes. Un componente no sabe en qué página vive — solo recibe props y renderiza. Ejemplos: `Button`, `Card`, `Modal`, `InputField`.

**`hooks/`** — Lógica de React extraída en funciones reutilizables. Ejemplos: `useAuth`, `useFetch`, `useLocalStorage`. Siguen la convención `use` + nombre.

**`pages/`** — Vistas completas asociadas a una ruta. Cada archivo representa una pantalla de la aplicación. Ejemplos: `Dashboard.jsx`, `Login.jsx`, `Usuarios.jsx`.

**`services/`** — Toda la comunicación con el backend va aquí. Centraliza las llamadas HTTP para que los componentes no hablen directamente con la API. Ejemplos: `authService.js`, `usuariosService.js`.

**`main.jsx`** — Punto de entrada de la aplicación. Monta el componente raíz en el DOM y configura providers globales (router, contexto, etc.).

---

## Scripts disponibles
```bash
# Desarrollo
docker compose up frontend

# Solo con Vite local
npm run dev:pro        # Aplicación principal
npm run dev:demo       # Demo standalone

# Build
npm run build:pro      # Build de producción
npm run build:demo     # Build de la demo
```

---

## Ejecución

Este servicio corre como contenedor dentro del ecosistema de microservicios:
```bash
docker compose up frontend
```