import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 1. Permite recibir datos en formato JSON
app.use(express.json());

// 2. Muestra la página web (carpeta frontend)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// 3. Ruta de prueba del servidor
app.get('/api/estado', (req, res) => {
  res.json({ ok: true, mensaje: 'Servidor de Distribuidora de Huevos JD funcionando' });
});

// 4. Arranca el servidor
app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});