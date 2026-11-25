-- =========================================================
-- Distribuidora de Huevos JD · Base de datos
-- =========================================================
DROP DATABASE IF EXISTS huevos_jd;
CREATE DATABASE huevos_jd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE huevos_jd;

-- 1 y 2. Usuarios registrados (cuentas creadas)
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  correo VARCHAR(120) NOT NULL UNIQUE,      -- no se puede registrar dos veces el mismo correo
  celular VARCHAR(15) NOT NULL,
  direccion VARCHAR(150) NOT NULL,          -- dirección de entrega
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Catálogo de cubetas (30 huevos) con precio al detal y al por mayor
CREATE TABLE productos (
  id VARCHAR(10) PRIMARY KEY,               -- mismo id que usa app.js
  nombre VARCHAR(30) NOT NULL,
  peso VARCHAR(20) NOT NULL,
  precio_detal INT NOT NULL,
  precio_mayor INT NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT 1         -- 1 = se vende, 0 = ya no se vende
);

-- 3 y 4. Pedidos al detal (hogares) y compras por mayor (panaderías)
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo ENUM('detal', 'mayor') NOT NULL,
  total INT NOT NULL,
  estado ENUM('Pendiente', 'Despachado', 'Entregado') NOT NULL DEFAULT 'Pendiente',
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Cubetas que lleva cada pedido
CREATE TABLE detalle_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  producto_id VARCHAR(10) NOT NULL,
  cubetas INT NOT NULL,
  precio_cubeta INT NOT NULL,               -- precio al momento de la compra
  subtotal INT NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Cubetas que se venden
INSERT INTO productos (id, nombre, peso, precio_detal, precio_mayor) VALUES
  ('jumbo', 'Cubeta Jumbo', '78 g o más',   22000, 19800),
  ('aaa',   'Cubeta AAA',   '67 - 77,9 g',  18500, 16700),
  ('aa',    'Cubeta AA',    '60 - 66,9 g',  16500, 14900),
  ('a',     'Cubeta A',     '53 - 59,9 g',  14500, 13100),
  ('b',     'Cubeta B',     '46 - 52,9 g',  12500, 11300),
  ('c',     'Cubeta C',     'menos de 46 g', 10500,  9500);

-- Comprobación
SHOW TABLES;
SELECT * FROM productos;