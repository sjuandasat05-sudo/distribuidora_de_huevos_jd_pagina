import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env'), quiet: true });

const usuario = process.env.CORREO_USUARIO;
const clave = process.env.CORREO_CLAVE;

// 1. ¿Se leyeron los datos del .env?
console.log('CORREO_USUARIO:', usuario || 'NO ENCONTRADO');
console.log('CORREO_CLAVE:', clave ? `${clave.length} caracteres` : 'NO ENCONTRADA');
if (!usuario || !clave) process.exit();

const transporte = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: usuario, pass: clave }
});

try {
  // 2. ¿Gmail acepta el usuario y la contraseña?
  await transporte.verify();
  console.log('✅ Gmail aceptó el usuario y la contraseña');

  // 3. Envía un correo de prueba a tu propio correo
  await transporte.sendMail({
    from: `"Distribuidora de Huevos JD" <${usuario}>`,
    to: usuario,
    subject: 'Prueba de correo - Huevos JD',
    text: 'Si lees esto, el envío de correos funciona.'
  });
  console.log(`✅ Correo de prueba enviado a ${usuario}`);
} catch (error) {
  console.log('❌ Error:', error.message);
}


