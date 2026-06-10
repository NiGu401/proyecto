# 📊 Resumen Técnico — Presentación del Proyecto

## "Instantes Dulces" — Web App de Pastelería

---

## 🏗️ Arquitectura General

La aplicación es una **SPA (Single Page Application)** con arquitectura cliente-servidor:

| Componente | Tecnología |
|---|---|
| **Frontend** | React 19 + Vite 4 + React Router 7 + Bootstrap 5 |
| **Backend** | Node.js + Express 5 |
| **Base de Datos** | MySQL (mysql2) |
| **Comunicación** | REST API (fetch) con proxy inverso en desarrollo |

---

## 🌐 FRONTEND

### Tecnologías
- **Framework:** React 19 (functional components + hooks)
- **Build Tool:** Vite (compilación rápida, HMR)
- **Routing:** React Router v7 (navegación SPA)
- **UI:** Bootstrap 5 + React-Bootstrap (componentes)
- **Notificaciones:** React Toastify (mensajes flotantes)
- **Gráficos:** Recharts (dashboards con gráficos)
- **Exportación:** jspdf, xlsx (PDF y Excel desde el admin)

### Estructura de Páginas (`src/pages/`)

```
src/
├── pages/
│   ├── index.jsx           → Página de inicio (pública)
│   ├── Login.jsx           → Autenticación con CAPTCHA
│   ├── Registro.jsx        → Registro de nuevos usuarios
│   ├── ProtectedRoute.jsx  → Guard de rutas protegidas
│   ├── Menu.jsx            → Menú de productos (pública)
│   ├── Postres.jsx         → Galería de postres (pública)
│   ├── AgendaEventos.jsx   → Formulario de reservas (público)
│   ├── Contacto.jsx        → Formulario de contacto (público)
│   ├── Panel.jsx           → Redirige a AdminPanel
│   └── AdminPanel.jsx      → Panel de administración (requiere login + admin)
├── componentes/
│   ├── Header.jsx          → Barra de navegación superior
│   └── LogoutButton.jsx    → Botón de cerrar sesión
└── css.css                 → Estilos globales
```

### Rutas del Router
| Ruta | Componente | Protegida | Requiere Admin |
|---|---|---|---|
| `/` | Inicio | No | No |
| `/menu` | Menú de productos | No | No |
| `/postres` | Postres | No | No |
| `/agenda-eventos` | Reservas | No | No |
| `/contacto` | Contacto | No | No |
| `/login` | Login | No | No |
| `/registro` | Registro | No | No |
| `/admin-panel` | Panel Admin | Sí | Sí |

### Autenticación del Frontend
1. El usuario ingresa credenciales + CAPTCHA en `/login`
2. El backend retorna un **JWT token** y datos del usuario
3. Se almacenan en `localStorage`: `token` y `usuario`
4. `ProtectedRoute` verifica el token y `rol_id` antes de renderizar
5. El Header lee `localStorage` para mostrar datos del usuario/logueado

### Comunicación con el Backend
- Las URLs de API usan `API_URL = ''` (vacío) porque el **proxy de Vite** redirige las peticiones al backend en desarrollo
- En desarrollo, Vite proxy redirige a `http://localhost:3001` las peticiones que comienzan con: `/api`, `/login`, `/logout`, `/captcha`, `/registro`
- En producción, el frontend y backend se despliegan juntos y las rutas relativas funcionan directamente

---

## 🔙 BACKEND

### Tecnologías
- **Runtime:** Node.js
- **Framework:** Express 5
- **Base de datos:** MySQL2 (conexión directa a MySQL)
- **Seguridad:** JWT (jsonwebtoken) + bcrypt (hash de contraseñas)
- **Captcha:** svg-captcha (imágenes SVG generadas en el servidor)
- **CORS:** cors (orígenes: localhost:5173, 192.168.250.92:5173)

### Configuración
| Variable | Valor |
|---|---|
| **Puerto** | 3001 |
| **Base de datos** | reposteria (MySQL) |
| **JWT Secret** | Variable de entorno (.env) |
| **Vida del token** | 8 horas |

### Base de Datos — Tablas

| Tabla | Descripción |
|---|---|
| `usuarios` | Usuarios con roles (admin=1, usuario=2), estado y contraseña hasheada |
| `roles` | Roles: 1=admin, 2=usuario |
| `reservas` | Reservas de tartas personalizadas (tipo, sabor, diseño, fecha, etc.) |
| `pedidos` | Pedidos con cliente, productos, total, estado |
| `productos` | Catálogo de productos (nombre, precio, categoría) |
| `mensajes_contacto` | Mensajes enviados por visitantes (nombre, email, mensaje) |
| `logs_acceso` | Registro de auditoría (usuario, IP, evento, navegador) |

### Endpoints del API

#### 🔐 Autenticación
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/captcha` | Genera un CAPTCHA SVG con ID único |
| POST | `/login` | Inicia sesión con credenciales + CAPTCHA |
| POST | `/registro` | Registra un nuevo usuario |
| POST | `/logout` | Cierra sesión + registra log |

#### 📅 Reservas
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/reserva` | Crear nueva reserva (público) |
| GET | `/api/reservas` | Obtener todas las reservas |
| PUT | `/api/reserva/:id` | Actualizar estado de reserva |
| DELETE | `/api/reserva/:id` | Eliminar reserva |

#### 📩 Contacto
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/contacto` | Enviar mensaje (público) |
| GET | `/api/contactos` | Obtener todos los mensajes |
| PUT | `/api/contacto/:id` | Marcar como leído |
| DELETE | `/api/contacto/:id` | Eliminación lógica (leido = -1) |



#### 🛍️ Productos
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/productos` | Listar productos |
| POST | `/api/producto` | Crear producto |
| PUT | `/api/producto/:id` | Actualizar producto |
| DELETE | `/api/producto/:id` | Eliminar producto |

#### 📊 Otros
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/top5-vendidos` | Top 5 productos más vendidos |
| GET | `/api/logs` | Logs de acceso (admin) |

### Middleware de Seguridad
```
Verificar JWT → Verificar rol_id → Acceso concedido
```
- `verificarToken`: Valida el JWT y extrae datos del usuario
- `verificarRol(...roles)`: Solo permite roles especificados (ej. rol_id = 1 para admin)

### Registros de Auditoría
Cada login/logout registra en `logs_acceso`:
- **Usuario** que accedió
- **IP** real (capturada del proxy)
- **Evento** (ingreso / salida)
- **Navegador** (Chrome, Firefox, Safari, etc.)

---

## 🔄 Flujo de Datos Completo

### 1. Login
```
Frontend (Login.jsx)          Backend (authRoutes.js)         BD (MySQL)
│
│  GET /captcha
│  ──────────────────────►   Genera SVG + ID en Map
│
│  POST /login (email + pass + captcha)
│  ──────────────────────►   Verifica captcha, busca usuario
│  ◄─────────────────────    Compara bcrypt, genera JWT
│
│  Guarda token + usuario en localStorage
```

### 2. Reservas (público)
```
Frontend (AgendaEventos.jsx)    Backend (reservaContactoRoutes.js)    BD (MySQL)
│
│  POST /api/reserva
│  ──────────────────────►    INSERT INTO reservas
│  ◄─────────────────────      Retorna id y mensaje
```

### 3. Panel Admin (protegido)
```
Frontend (ProtectedRoute)       Frontend (AdminPanel.jsx)    Backend         BD
│
│  Lee localStorage               │                           │
│  Verifica rol_id=1              │                           │
│  ◄─────────────────────────────┘                           │
│                           GET /api/reservas                 │
│  ──────────────────────►    SELECT * FROM reservas          │
│  ◄─────────────────────      Retorna JSON                    │
│
│  Muestra datos en tablas + gráficos
│  PUT /api/reserva/:id     UPDATE estado                      │
│  DELETE /api/reserva/:id  DELETE                            │
```

---

## 📱 Funcionalidades Clave

1. **Sistema de autenticación** con CAPTCHA SVG y JWT
2. **Registro de usuarios** con roles (admin/usuario)
3. **Reservas de tartas** personalizadas con formulario validado
4. **Formulario de contacto** para consultas generales
5. **Panel de administración** con:
   - CRUD de reservas (crear, editar estado, eliminar)
   - CRUD de productos
   - CRUD de pedidos
   - Vista de mensajes de contacto
   - Logs de acceso de usuarios
   - Gráficos con Recharts
   - Exportación a PDF y Excel
6. **Navegación SPA** sin recargas con React Router
7. **Notificaciones toast** con React Toastify
8. **Diseño responsive** con Bootstrap

---

## 🚀 Despliegue

### Desarrollo
```bash
# Backend
npm run dev:backend    # nodemon en puerto 3001

# Frontend (desde raíz)
npm run dev            # Vite en puerto 5173 con proxy a :3001
```

### Producción
```bash
npm run build          # Compila frontend
npm run start          # Ejecuta backend
```

El frontend compilado se sirve estáticamente y el backend expone el API.
