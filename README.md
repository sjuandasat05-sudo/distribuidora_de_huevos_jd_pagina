# distribuidora_de_huevos_jd_pagina


# 🥚 Distribuidora de Huevos JD

Página web para la venta de huevo fresco al detal y al por mayor (panaderías) y el control de inventario por lotes, para los hogares de la urbanización Tricentenario (Medellín).

> **Propuesta de valor:** huevos con máximo 7 días desde la postura, pedidos por WhatsApp y pago contraentrega.

---

## 📋 Funcionalidades

- **Nosotros:** misión, visión, objetivo y tamaños de huevo (peso y características).
- **Prueba de frescura:** guía interactiva para saber si un huevo está fresco.
- **Recetas y nutrición:** recetas para hogar y panadería, con los aportes nutricionales del huevo.
- **Pedidos:** registro con correo, celular, bloque y apartamento; venta al detal o al por mayor (mínimo 10 cubetas); pago contraentrega y envío del pedido por WhatsApp.
- **Inventario (solo administrador):** registro de lotes con fecha de postura, estado de frescura, descuento automático por FIFO (primero en entrar, primero en salir) y seguimiento de pedidos.

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Servidor | Node.js con Express |
| Control de versiones | Git y GitHub |
| Comunicación con el cliente | WhatsApp |

---

## 📁 Estructura del proyecto

```
distribuidora-huevos-jd/
├── package.json        → arranque del proyecto (npm start)
├── README.md
├── frontend/
│   ├── index.html      → estructura de la página
│   ├── css/styles.css  → diseño y colores
│   ├── js/app.js       → lógica e interactividad
│   └── img/logo.png
├── backend/
│   ├── server.js       → servidor Express
│   ├── db.js           → conexión a base de datos (reservado)
│   └── package.json    → dependencias del servidor
└── database/
    └── script.sql      → script de base de datos (reservado)
```

---

## ▶️ Cómo ejecutarlo

**Requisito:** tener instalado [Node.js](https://nodejs.org) (versión LTS).

```bash
# 1. Clonar el repositorio
git clone https://github.com/sjuandasat05-sudo/distribuidora_de_huevos_jd_pagina.git
cd distribuidora_de_huevos_jd_pagina

# 2. Instalar dependencias (solo la primera vez)
npm --prefix backend install

# 3. Arrancar el servidor
npm start
```

Abrir en el navegador: **http://localhost:3000**

> También se puede abrir directamente el archivo `frontend/index.html` con doble clic.

---

## 🔑 Usuario de prueba

| Rol | Acceso |
|---|---|
| Administrador (inventario) | Ingresar con el correo `sjuandasat05@gmail.com` |
| Cliente | Registrarse con correo, celular, bloque y apartamento |

---

## 🎨 Paleta de colores

| Color | Código | Significado |
|---|---|---|
| Verde | `#0F4D2A` | Confianza y naturalidad |
| Amarillo | `#F6B712` | Alegría y frescura |
| Naranja | `#D8701A` | Energía y venta |
| Crema | `#F8EBD3` | Limpieza y calidad |

---

## 🌿 Flujo de trabajo en Git

- `main` → versión estable para entrega.
- `develop` → integración de funcionalidades.
- `feature/...` → una rama por funcionalidad (`feature/estructura`, `feature/frontend`, `feature/backend`).

Todos los Pull Requests se integran primero en `develop`.

---

## ⚠️ Limitaciones conocidas

- Los datos (usuarios, pedidos e inventario) se guardan en el navegador (`localStorage`); no se comparten entre equipos.
- El acceso de administrador se valida solo con el correo, sin contraseña.
- Los precios son de ejemplo.

**Mejoras previstas:** conexión a base de datos MySQL, autenticación con contraseña y publicación en un hosting.

---

## 👤 Autor

**Juan David Salazar Torres**
Tecnólogo en Análisis y Desarrollo de Software (ADSO) — SENA
Centro de Tecnología de la Manufactura Avanzada (CTMA), Regional Antioquia
Ficha: 3169901
Instructor: Mateo Arroyave