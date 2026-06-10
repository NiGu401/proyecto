# 🍰 Instantes Dulces - Proyecto Web

## Configuración de Desarrollo

### 1. Levantar el Backend

```bash
cd backend
node server.js
```

El backend estará corriendo en `http://127.0.0.1:3001`

### 2. Levantar el Frontend

```bash
npm run dev
```

El frontend estará corriendo en `http://localhost:5173`

### 3. Acceder a la aplicación

Abre en tu navegador:
- http://localhost:5173

---

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el frontend Vite en modo desarrollo |
| `npm run build` | Construye el proyecto para producción |
| `npm run preview` | Preview del build de producción |
| `npm run dev:backend` | Inicia el backend con nodemon |

## Endpoints API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/captcha` | Genera un nuevo CAPTCHA |
| POST | `/login` | Inicia sesión |
| POST | `/registro` | Registra un nuevo usuario |
| POST | `/logout` | Cierra sesión |
| GET | `/api/pedidos` | Obtiene todos los pedidos |
| POST | `/api/pedido` | Crea un nuevo pedido |
| PUT | `/api/pedido/:id` | Actualiza un pedido |
| DELETE | `/api/pedido/:id` | Elimina un pedido |
| GET | `/api/productos` | Obtiene todos los productos |
| POST | `/api/producto` | Crea un nuevo producto |
| PUT | `/api/producto/:id` | Actualiza un producto |
| DELETE | `/api/producto/:id` | Elimina un producto |
| GET | `/api/reservas` | Obtiene todas las reservas |
| POST | `/api/reserva` | Crea una nueva reserva |
| PUT | `/api/reserva/:id` | Actualiza el estado de una reserva |
| DELETE | `/api/reserva/:id` | Elimina una reserva |
| GET | `/api/contactos` | Obtiene todos los contactos |
| POST | `/api/contacto` | Envía un mensaje de contacto |
| PUT | `/api/contacto/:id` | Marca un mensaje como leído |
| DELETE | `/api/contacto/:id` | Elimina un mensaje |
| GET | `/api/logs` | Obtiene los logs de acceso |

## Notas

- El frontend se conecta al backend automáticamente mediante Vite proxy
- No necesitas configurar CORS ni cambiar las URLs de la API
- El frontend usa `http://192.168.250.92:5173` para redes locales
- El backend usa `http://127.0.0.1:3001` para desarrollo local
