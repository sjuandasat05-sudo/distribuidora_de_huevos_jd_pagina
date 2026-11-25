import nodemailer from 'nodemailer';

const pesos = (n) => '$' + Number(n).toLocaleString('es-CO');

// Crea la conexión con Gmail usando los datos de backend/.env
function crearTransporte() {
  if (!process.env.CORREO_USUARIO || !process.env.CORREO_CLAVE) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.CORREO_USUARIO, pass: process.env.CORREO_CLAVE }
  });
}

// Envía al cliente el resumen de su pedido
export async function enviarConfirmacionPedido({ correo, numero, tipo, lineas, total, direccion }) {
  const transporte = crearTransporte();
  if (!transporte) {
    console.log('Correo no enviado: faltan CORREO_USUARIO o CORREO_CLAVE en backend/.env');
    return;
  }

  const filas = lineas.map(l => `
    <tr>
      <td style="padding:6px 10px;border-bottom:1px solid #eee">${l.cubetas} × ${l.nombre}</td>
      <td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right">${pesos(l.subtotal)}</td>
    </tr>`).join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#1E2A1F">
      <div style="background:#0F4D2A;color:#F8EBD3;padding:16px 20px;border-radius:12px 12px 0 0">
        <h2 style="margin:0">Distribuidora de Huevos JD</h2>
        <p style="margin:4px 0 0;color:#F6B712">Calidad y frescura en cada huevo</p>
      </div>
      <div style="border:1px solid #E6D7B8;border-top:0;padding:20px;border-radius:0 0 12px 12px">
        <p>¡Hola! Recibimos tu pedido <b>N.º ${numero}</b> (${tipo === 'mayor' ? 'por mayor' : 'al detal'}).</p>
        <table style="width:100%;border-collapse:collapse">${filas}
          <tr>
            <td style="padding:10px;font-weight:bold">Total</td>
            <td style="padding:10px;text-align:right;font-weight:bold;color:#D8701A">${pesos(total)}</td>
          </tr>
        </table>
        <p><b>Entrega:</b> ${direccion}<br><b>Pago:</b> contraentrega.</p>
        <p style="color:#5B6457;font-size:13px">Te contactaremos por WhatsApp para coordinar la entrega.</p>
      </div>
    </div>`;

  await transporte.sendMail({
    from: `"Distribuidora de Huevos JD" <${process.env.CORREO_USUARIO}>`,
    to: correo,
    subject: `Confirmación de tu pedido N.º ${numero}`,
    html
  });
  console.log(`Correo de confirmación enviado a ${correo}`);
}