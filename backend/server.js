import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 1. Permite recibir datos en formato JSON y muestra la página
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Validaciones básicas
const reCorreo = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const reCelular = /^3\d{9}$/;
const MIN_MAYOR = 10;

// 2. Prueba del servidor
app.get('/api/estado', (req, res) => {
  res.json({ ok: true, mensaje: 'Servidor de Distribuidora de Huevos JD funcionando' });
});

// 3. Productos: cubetas que se venden
app.get('/api/productos', async (req, res) => {
  try {
    const [productos] = await db.query(
      'SELECT id, nombre, peso, precio_detal, precio_mayor FROM productos WHERE activo = 1'
    );
    res.json(productos);
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al consultar productos', error: error.message });
  }
});

// 4. Registrar usuario (si el correo ya existe, actualiza celular y dirección)
app.post('/api/usuarios', async (req, res) => {
  const correo = String(req.body.correo || '').trim().toLowerCase();
  const celular = String(req.body.celular || '').replace(/\D/g, '');
  const direccion = String(req.body.direccion || '').trim();

  if (!reCorreo.test(correo)) return res.status(400).json({ ok: false, mensaje: 'Correo no válido' });
  if (!reCelular.test(celular)) return res.status(400).json({ ok: false, mensaje: 'Celular no válido' });
  if (direccion.length < 5) return res.status(400).json({ ok: false, mensaje: 'Dirección no válida' });

  try {
    const [existe] = await db.query('SELECT id FROM usuarios WHERE correo = ?', [correo]);
    if (existe.length) {
      await db.query('UPDATE usuarios SET celular = ?, direccion = ? WHERE correo = ?', [celular, direccion, correo]);
    } else {
      await db.query('INSERT INTO usuarios (correo, celular, direccion) VALUES (?, ?, ?)', [correo, celular, direccion]);
    }
    const [usuario] = await db.query('SELECT id, correo, celular, direccion FROM usuarios WHERE correo = ?', [correo]);
    res.json({ ok: true, usuario: usuario[0] });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al registrar usuario', error: error.message });
  }
});

// 5. Buscar una cuenta ya creada (para "Ya tengo cuenta")
app.get('/api/usuarios/:correo', async (req, res) => {
  try {
    const correo = String(req.params.correo).trim().toLowerCase();
    const [usuario] = await db.query('SELECT id, correo, celular, direccion FROM usuarios WHERE correo = ?', [correo]);
    if (!usuario.length) return res.status(404).json({ ok: false, mensaje: 'El correo no está registrado' });
    res.json({ ok: true, usuario: usuario[0] });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al buscar usuario', error: error.message });
  }
});

// 6. Registrar pedido (al detal o por mayor)
app.post('/api/pedidos', async (req, res) => {
  const correo = String(req.body.correo || '').trim().toLowerCase();
  const tipo = req.body.tipo;
  const items = Array.isArray(req.body.items) ? req.body.items : [];

  if (!['detal', 'mayor'].includes(tipo)) return res.status(400).json({ ok: false, mensaje: 'Tipo de venta no válido' });
  const lineas = items
    .map(i => ({ producto_id: String(i.producto_id), cubetas: Number(i.cubetas) }))
    .filter(i => Number.isInteger(i.cubetas) && i.cubetas > 0);
  if (!lineas.length) return res.status(400).json({ ok: false, mensaje: 'El pedido no tiene productos' });

  const totalCubetas = lineas.reduce((s, l) => s + l.cubetas, 0);
  if (tipo === 'mayor' && totalCubetas < MIN_MAYOR) {
    return res.status(400).json({ ok: false, mensaje: `La venta por mayor es desde ${MIN_MAYOR} cubetas` });
  }

  const conexion = await db.getConnection();
  try {
    const [usuario] = await conexion.query('SELECT id FROM usuarios WHERE correo = ?', [correo]);
    if (!usuario.length) return res.status(404).json({ ok: false, mensaje: 'Primero debes registrarte' });

    // Los precios se toman de la base de datos, no del navegador
    const [productos] = await conexion.query(
      'SELECT id, precio_detal, precio_mayor FROM productos WHERE activo = 1 AND id IN (?)',
      [lineas.map(l => l.producto_id)]
    );
    const precios = Object.fromEntries(productos.map(p => [p.id, tipo === 'detal' ? p.precio_detal : p.precio_mayor]));
    const falta = lineas.find(l => !(l.producto_id in precios));
    if (falta) return res.status(400).json({ ok: false, mensaje: `Producto no disponible: ${falta.producto_id}` });

    const total = lineas.reduce((s, l) => s + l.cubetas * precios[l.producto_id], 0);

    // Transacción: se guarda el pedido completo o no se guarda nada
    await conexion.beginTransaction();
    const [pedido] = await conexion.query(
      'INSERT INTO pedidos (usuario_id, tipo, total) VALUES (?, ?, ?)',
      [usuario[0].id, tipo, total]
    );
    for (const l of lineas) {
      const precio = precios[l.producto_id];
      await conexion.query(
        'INSERT INTO detalle_pedido (pedido_id, producto_id, cubetas, precio_cubeta, subtotal) VALUES (?, ?, ?, ?, ?)',
        [pedido.insertId, l.producto_id, l.cubetas, precio, l.cubetas * precio]
      );
    }
    await conexion.commit();
    res.json({ ok: true, pedido: { id: pedido.insertId, total } });
  } catch (error) {
    await conexion.rollback();
    res.status(500).json({ ok: false, mensaje: 'Error al registrar el pedido', error: error.message });
  } finally {
    conexion.release();
  }
});

// 7. Listar pedidos (para el administrador)
app.get('/api/pedidos', async (req, res) => {
  try {
    const [pedidos] = await db.query(`
      SELECT p.id, p.tipo, p.total, p.estado, p.fecha,
             u.correo, u.celular, u.direccion,
             GROUP_CONCAT(CONCAT(d.cubetas, ' ', pr.nombre) SEPARATOR ', ') AS detalle
      FROM pedidos p
      JOIN usuarios u ON u.id = p.usuario_id
      JOIN detalle_pedido d ON d.pedido_id = p.id
      JOIN productos pr ON pr.id = d.producto_id
      GROUP BY p.id, u.id
      ORDER BY p.id DESC
    `);
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al consultar pedidos', error: error.message });
  }
});

// 8. Cambiar el estado de un pedido
app.patch('/api/pedidos/:id/estado', async (req, res) => {
  const estado = req.body.estado;
  if (!['Pendiente', 'Despachado', 'Entregado'].includes(estado)) {
    return res.status(400).json({ ok: false, mensaje: 'Estado no válido' });
  }
  try {
    await db.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, Number(req.params.id)]);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar el pedido', error: error.message });
  }
});

// 9. Arranca el servidor
app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});