# 🍕 coding-cloud-challenge

![GitHub last commit](https://img.shields.io/github/last-commit/tu-usuario/coding-cloud-challenge?style=flat-square)
![GitHub repo size](https://img.shields.io/github/repo-size/tu-usuario/coding-cloud-challenge?style=flat-square)
![GitHub license](https://img.shields.io/github/license/tu-usuario/coding-cloud-challenge?style=flat-square)

Aplicación web para explorar un menú de pizzas, armar órdenes y realizar pedidos online con una interfaz simple, rápida y divertida.

---

## 📑 Tabla de Contenidos

- [🧾 Descripción del Proyecto](#-descripción-del-proyecto)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [⚙ Instalación y Configuración](#-instalación-y-configuración)
- [📡 API Endpoints](#-api-endpoints)
- [🖥️ Frontend](#️-frontend)
- [🚀 Mejoras Futuras](#-posibles-mejoras-futuras)

---

## 🧾 Descripción del Proyecto

`coding-cloud-challenge` es una aplicación web donde los usuarios pueden:

✅ Ver una lista de pizzas  
✅ Seleccionar y personalizar su orden  
✅ Confirmar su pedido fácilmente  

Construida con **React + Vite** en el frontend y **Node.js + Express** en el backend.

---

## 📁 Estructura del Proyecto

```plaintext
coding-cloud-challenge/
├── frontend/          # Aplicación cliente (React)
└── backend/           # API REST (Express)
```

### Frontend

📦 Estructura principal:

- `src/components`: Componentes reutilizables como `PizzaList` y `OrderSummary`.
- `src/pages`: Páginas como `Home` (menú) y `DetailOrder` (detalle de pedido).
- `src/api.js`: Configura Axios para consumir la API.
- `src/main.jsx`: Entrada de la app + configuración de rutas.

### Backend

📦 Contiene:

- `controllers/`: Lógica de pizzas y órdenes.
- `routes/`: Endpoints organizados.
- `data/`: Archivo JSON con pizzas.
- `tests/`: Pruebas unitarias con Jest.
- `server.js`: Entrada principal.
- `app.js`: Configuración de la app Express.

---

## ⚙ Instalación y Configuración

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/coding-cloud-challenge.git
cd coding-cloud-challenge
```

### 2. Backend

```bash
cd backend
npm install
```

🔧 Crea `.env` en `/backend` (opcional si usás variables):

```env
PORT=3000
```

▶ Ejecutar:

```bash
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
```

🔧 Crea `.env` en `/frontend`:

```env
VITE_API_BASE_URL=https://tu-backend.onrender.com
```

▶ Ejecutar:

```bash
npm run dev
```

---

## 📡 API Endpoints

### 🍕 `GET /api/pizzas`

- **Descripción:** Retorna todas las pizzas.
- **Respuesta:**
```json
[
  {
    "id": "pepperoni",
    "name": "Pepperoni",
    "price": 12.99,
    "ingredients": ["pepperoni", "cheese", "tomato sauce"]
  }
]
```

---

### 🧾 `POST /api/orders`

- **Descripción:** Crear nueva orden.
- **Cuerpo:**
```json
{
  "items": [
    { "pizzaId": "pepperoni", "quantity": 2 }
  ]
}
```

- **Respuesta exitosa (201):**
```json
{
  "id": 1,
  "items": [
    {
      "pizza": {
        "id": "pepperoni",
        "name": "Pepperoni",
        "price": 12.99,
        "ingredients": [...]
      },
      "quantity": 2
    }
  ]
}
```

---

### 📋 `GET /api/orders`

Lista todas las órdenes realizadas.

---

### 🔍 `GET /api/orders/:id`

Obtiene una orden específica.

- **404:** Si el ID no existe.

---

## 🖥️ Frontend

🔸 **Lista de pizzas:** Visual amigable con precios e ingredientes.  
🔸 **Resumen de orden:** Pizzas seleccionadas y precios.  
🔸 **Checkout:** Envío de la orden al backend y confirmación.

---

## 🚀 Posibles Mejoras Futuras

- 🔐 Autenticación de usuarios
- 👤 Gestión de perfil
- 💳 Integración de pagos
- 🧑‍🍳 Panel de administración
- 📏 Soporte para tamaños de pizza
- 🧪 Más pruebas automáticas