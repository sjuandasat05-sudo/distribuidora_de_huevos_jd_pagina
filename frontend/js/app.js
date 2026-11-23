/* =========================================================
   Distribuidora de Huevos JD · Lógica de la página (JavaScript)
   Estructura:
   1. Configuración y datos      5. Sección 2: recetas y nutrición
   2. Almacenamiento (estado)    6. Sección 3: pedidos y WhatsApp
   3. Utilidades de frescura     7. Inventario (solo administrador)
   4. Sección 1: tamaños         8. Acceso: registro / ingreso / salir
   ========================================================= */
{
  /* ---------- 1. Configuración y datos ---------- */
  const ADMIN = 'sjuandasat05@gamail.com';   // único usuario con acceso al inventario
  const WA_NUMERO = '3005461962';          // número de ejemplo: cámbialo por el real (57 + celular)
  const MIN_MAYOR = 10;                      // cubetas mínimas para venta por mayor
  const DIAS_MAX_VENTA = 21;                 // después de 21 días el lote no se vende

  const TAMANOS = [
    { id: 'jumbo', nombre: 'Jumbo', peso: '≥ 78 g',      esc: 1.18, detal: 22000, mayor: 19800, uso: 'Yema grande y mucha clara. Ideal para desayunos abundantes y huevos fritos o pochados de presentación.' },
    { id: 'aaa',   nombre: 'AAA',   peso: '67 – 77,9 g', esc: 1.08, detal: 18500, mayor: 16700, uso: 'El favorito de los hogares: rinde en tortillas, pericos y preparaciones donde el huevo es protagonista.' },
    { id: 'aa',    nombre: 'AA',    peso: '60 – 66,9 g', esc: 1.00, detal: 16500, mayor: 14900, uso: 'El estándar de las recetas de panadería y repostería: peso uniforme que da resultados constantes.' },
    { id: 'a',     nombre: 'A',     peso: '53 – 59,9 g', esc: .92,  detal: 14500, mayor: 13100, uso: 'Muy usado por panaderías para masas, pan de yema y galletas, con excelente relación precio–rendimiento.' },
    { id: 'b',     nombre: 'B',     peso: '46 – 52,9 g', esc: .85,  detal: 12500, mayor: 11300, uso: 'Buena opción económica para huevos cocidos, loncheras y apanados.' },
    { id: 'c',     nombre: 'C',     peso: '< 46 g',      esc: .78,  detal: 10500, mayor: 9500,  uso: 'Huevo pequeño, perfecto para porciones infantiles, codito de ensaladas y rellenos.' }
  ];

  const RECETAS = [
    { t: 'Huevos pericos', cat: 'hogar', min: 10, h: 3, ing: ['3 huevos AAA', '1 tomate maduro picado', '2 tallos de cebolla larga', 'Sal y aceite'], pasos: ['Sofríe la cebolla y el tomate 3 minutos.', 'Agrega los huevos batidos con sal.', 'Revuelve a fuego bajo hasta que cuajen cremosos.'], tip: 'Con huevo fresco la yema queda firme y de color intenso.' },
    { t: 'Tortilla de papa', cat: 'hogar', min: 35, h: 5, ing: ['5 huevos AA', '3 papas medianas en láminas', '1 cebolla', 'Aceite y sal'], pasos: ['Fríe la papa y la cebolla a fuego medio hasta ablandar.', 'Escurre y mezcla con los huevos batidos.', 'Cuaja en sartén 4 minutos por lado.'], tip: 'Deja reposar la mezcla 5 minutos antes de cuajar: queda más jugosa.' },
    { t: 'Huevo cocido perfecto', cat: 'hogar', min: 12, h: 1, ing: ['Huevos B o A', 'Agua', 'Hielo'], pasos: ['Pon los huevos en agua hirviendo 9 minutos (10 para Jumbo).', 'Pásalos a agua con hielo 5 minutos.', 'Pela desde la parte ancha.'], tip: 'Los huevos de 7 a 10 días se pelan más fácil que los recién puestos.' },
    { t: 'Pan de yema', cat: 'panaderia', min: 150, h: 6, ing: ['1 kg de harina de trigo', '6 yemas + 2 huevos A', '150 g de azúcar', '120 g de mantequilla', '20 g de levadura', '300 ml de leche tibia'], pasos: ['Activa la levadura en la leche con una cucharada de azúcar.', 'Amasa todos los ingredientes 12 minutos.', 'Deja leudar 1 hora, forma los panes y leuda 40 minutos más.', 'Barniza con huevo y hornea a 180 °C por 25 minutos.'], tip: 'Yemas frescas dan el color dorado característico sin colorantes.' },
    { t: 'Torta de vainilla', cat: 'panaderia', min: 60, h: 4, ing: ['4 huevos AA a temperatura ambiente', '250 g de harina', '200 g de azúcar', '200 g de mantequilla', '10 g de polvo de hornear', 'Vainilla'], pasos: ['Bate mantequilla y azúcar hasta blanquear.', 'Agrega los huevos uno a uno.', 'Incorpora la harina tamizada con el polvo de hornear.', 'Hornea a 175 °C por 40 minutos.'], tip: 'Usar siempre el mismo tamaño (AA) mantiene la receta estandarizada en producción.' },
    { t: 'Merengue suizo', cat: 'panaderia', min: 20, h: 4, ing: ['4 claras de huevo', '240 g de azúcar', 'Unas gotas de limón'], pasos: ['Calienta claras y azúcar al baño María hasta 60 °C, sin dejar de mover.', 'Bate a velocidad alta hasta picos firmes y brillantes.', 'Usa de inmediato para decorar.'], tip: 'Las claras frescas son más densas y forman un merengue más estable.' }
  ];

  const NUTRI = [
    { n: 'Proteína', v: '6,3 g', vd: 13, nota: 'proteína completa: músculos y saciedad' },
    { n: 'Colina', v: '147 mg', vd: 27, nota: 'memoria y desarrollo del cerebro' },
    { n: 'Selenio', v: '15 µg', vd: 27, nota: 'antioxidante, apoya las defensas' },
    { n: 'Vitamina B12', v: '0,45 µg', vd: 19, nota: 'formación de glóbulos rojos' },
    { n: 'Vitamina B2', v: '0,23 mg', vd: 18, nota: 'convierte los alimentos en energía' },
    { n: 'Vitamina D', v: '1,1 µg', vd: 6, nota: 'absorción del calcio, huesos' },
    { n: 'Energía', v: '72 kcal', vd: 4, nota: 'pocas calorías para tanto nutriente' }
  ];

  /* ---------- 2. Almacenamiento (estado en localStorage) ---------- */
  const $ = (s) => document.querySelector(s);
  const hoy = () => new Date(new Date().toDateString());
  const fechaHace = (d) => { const f = hoy(); f.setDate(f.getDate() - d); return f.toISOString().slice(0, 10); };
  const pesos = (n) => '$' + n.toLocaleString('es-CO');

  const estadoInicial = () => ({
    usuarios: [], sesion: null, pedidos: [], seqLote: 7, seqPedido: 1,
    lotes: [ // datos de ejemplo
      { id: 1, tam: 'c',     cant: 6,  fecha: fechaHace(24), prov: 'Granja El Rosal' },
      { id: 2, tam: 'b',     cant: 15, fecha: fechaHace(16), prov: 'Granja La Esperanza' },
      { id: 3, tam: 'a',     cant: 25, fecha: fechaHace(9),  prov: 'Granja El Rosal' },
      { id: 4, tam: 'aa',    cant: 35, fecha: fechaHace(4),  prov: 'Avícola San José' },
      { id: 5, tam: 'jumbo', cant: 12, fecha: fechaHace(3),  prov: 'Avícola San José' },
      { id: 6, tam: 'aaa',   cant: 40, fecha: fechaHace(2),  prov: 'Granja La Esperanza' }
    ]
  });

  let db;
  try { db = JSON.parse(localStorage.getItem('huevosJD')) || estadoInicial(); } catch { db = estadoInicial(); }
  const guardar = () => { try { localStorage.setItem('huevosJD', JSON.stringify(db)); } catch { /* sin almacenamiento */ } };

  const usuarioActual = () => db.sesion;
  const esAdmin = () => db.sesion?.correo === ADMIN;

  /* ---------- 3. Utilidades de frescura ---------- */
  const diasDesde = (f) => Math.round((hoy() - new Date(f + 'T00:00:00')) / 864e5);
  const estadoFrescura = (d) =>
    d <= 7 ? ['Muy fresco', 'b-ok'] :
    d <= 14 ? ['Fresco', 'b-fresh'] :
    d <= DIAS_MAX_VENTA ? ['Despachar ya', 'b-warn'] : ['Retirar', 'b-bad'];
  // Stock vendible: solo lotes de 21 días o menos
  const stockDe = (tam) => db.lotes.filter(l => l.tam === tam && diasDesde(l.fecha) <= DIAS_MAX_VENTA).reduce((s, l) => s + l.cant, 0);

  function pintarFrescuraHoy() {
    const vendibles = db.lotes.filter(l => l.cant > 0 && diasDesde(l.fecha) <= DIAS_MAX_VENTA);
    if (!vendibles.length) { $('#frescuraTxt').textContent = 'Sin lotes disponibles en este momento.'; return; }
    const d = Math.min(...vendibles.map(l => diasDesde(l.fecha)));
    $('#selloDias').textContent = d;
    $('#frescuraTxt').textContent = `Hoy: nuestro lote más reciente fue puesto hace ${d} día${d === 1 ? '' : 's'}`;
  }

  /* ---------- 4. Sección 1: tamaños y prueba de frescura ---------- */
  const huevoSVG = (esc) => `<svg viewBox="0 0 60 80" aria-hidden="true"><path transform="translate(30 44) scale(${esc}) translate(-30 -44)" d="M30 8C46 8 54 36 54 50C54 66 43 76 30 76C17 76 6 66 6 50C6 36 14 8 30 8Z" fill="#E7A06A"/><ellipse cx="21" cy="32" rx="4" ry="8" fill="#fff" opacity=".5"/></svg>`;

  $('#sizeGrid').innerHTML = TAMANOS.map(t => `
    <button class="size" data-id="${t.id}">${huevoSVG(t.esc)}<strong>${t.nombre}</strong><span>${t.peso}</span></button>`).join('');

  function mostrarTamano(id) {
    const t = TAMANOS.find(x => x.id === id);
    document.querySelectorAll('.size').forEach(b => b.classList.toggle('on', b.dataset.id === id));
    $('#sizeDetail').innerHTML = `<h3>Huevo ${t.nombre} · ${t.peso}</h3><p>${t.uso}</p><p class="muted small">Detal ${pesos(t.detal)} · Mayorista ${pesos(t.mayor)} por cubeta de 30.</p>`;
  }
  $('#sizeGrid').addEventListener('click', e => { const b = e.target.closest('.size'); if (b) mostrarTamano(b.dataset.id); });
  mostrarTamano('aa');

  const PRUEBA = [
    'Muy fresco (menos de una semana). Perfecto para cualquier preparación.',
    'Fresco (1 a 2 semanas). Bueno para todo; ideal para huevos cocidos.',
    'Tiene unas 3 semanas. Úsalo pronto y bien cocido, en horneados o tortas.',
    'No lo consumas: tiene una cámara de aire muy grande, señal de envejecimiento.'
  ];
  $('#pruebaChips').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    document.querySelectorAll('#pruebaChips button').forEach(x => x.classList.toggle('on', x === b));
    $('#pruebaOut').textContent = PRUEBA[b.dataset.r];
  });

  /* ---------- 5. Sección 2: recetas y nutrición ---------- */
  function pintarRecetas(filtro) {
    $('#recipeGrid').innerHTML = RECETAS.filter(r => filtro === 'todas' || r.cat === filtro).map(r => `
      <article class="card recipe">
        <span class="tag ${r.cat}">${r.cat === 'hogar' ? 'Hogar' : 'Panadería'}</span>
        <h3>${r.t}</h3>
        <p class="meta">${r.min} min · ${r.h} huevo${r.h > 1 ? 's' : ''}</p>
        <details><summary>Ver receta</summary>
          <ul>${r.ing.map(i => `<li>${i}</li>`).join('')}</ul>
          <ol>${r.pasos.map(p => `<li>${p}</li>`).join('')}</ol>
        </details>
        <p class="small"><b>Tip de frescura:</b> ${r.tip}</p>
      </article>`).join('');
  }
  $('#filtroRecetas').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    document.querySelectorAll('#filtroRecetas button').forEach(x => x.classList.toggle('on', x === b));
    pintarRecetas(b.dataset.f);
  });
  pintarRecetas('todas');

  $('#nutriBars').innerHTML = NUTRI.map(x => `
    <div class="bar-row"><span>${x.n}</span><div class="bar"><i data-w="${x.vd}"></i></div><span class="val">${x.v}</span>
    <small>${x.vd}% del valor diario · ${x.nota}</small></div>`).join('');
  // Las barras se llenan cuando la sección aparece en pantalla
  const obsBarras = new IntersectionObserver(ents => ents.forEach(en => {
    if (en.isIntersecting) { document.querySelectorAll('.bar i').forEach(i => i.style.width = Math.max(i.dataset.w * 2.5, 6) + '%'); obsBarras.disconnect(); }
  }));
  obsBarras.observe($('#nutriBars'));

  /* ---------- 6. Sección 3: pedidos y WhatsApp ---------- */
  let tipoVenta = 'detal';
  const carrito = {}; // { idTamaño: cubetas }

  function pintarCatalogo() {
    $('#catalogo').innerHTML = TAMANOS.map(t => {
      const s = stockDe(t.id);
      return `<article class="card prod">
        <h3>Cubeta ${t.nombre}</h3>
        <span class="muted small">30 huevos · ${t.peso} c/u</span>
        <span class="price">${pesos(t[tipoVenta])}</span>
        <span class="stock" style="color:var(${s ? '--ok' : '--bad'})">${s ? s + ' cubetas disponibles' : 'Agotado'}</span>
        <div class="stepper" data-id="${t.id}">
          <button type="button" data-d="-1" aria-label="Quitar">−</button>
          <input type="number" min="0" max="${s}" value="${carrito[t.id] || 0}" aria-label="Cubetas ${t.nombre}" ${s ? '' : 'disabled'}>
          <button type="button" data-d="1" aria-label="Agregar" ${s ? '' : 'disabled'}>+</button>
        </div></article>`;
    }).join('');
  }

  function fijarCantidad(id, n) {
    const max = stockDe(id);
    n = Math.max(0, Math.min(max, Number(n) || 0));
    if (n) carrito[id] = n; else delete carrito[id];
    pintarCarrito();
  }
  $('#catalogo').addEventListener('click', e => {
    const b = e.target.closest('button[data-d]'); if (!b) return;
    const st = b.closest('.stepper'); const inp = st.querySelector('input');
    fijarCantidad(st.dataset.id, (carrito[st.dataset.id] || 0) + Number(b.dataset.d));
    inp.value = carrito[st.dataset.id] || 0;
  });
  $('#catalogo').addEventListener('change', e => {
    const st = e.target.closest('.stepper'); if (!st) return;
    fijarCantidad(st.dataset.id, e.target.value); e.target.value = carrito[st.dataset.id] || 0;
  });

  const lineas = () => Object.entries(carrito).map(([id, n]) => { const t = TAMANOS.find(x => x.id === id); return { t, n, sub: n * t[tipoVenta] }; });
  const totalCarrito = () => lineas().reduce((s, l) => s + l.sub, 0);
  const cubetasCarrito = () => lineas().reduce((s, l) => s + l.n, 0);

  function pintarCarrito() {
    const ls = lineas();
    $('#carritoLista').innerHTML = ls.length
      ? ls.map(l => `<div class="cart-line"><span>${l.n} × Cubeta ${l.t.nombre}</span><span>${pesos(l.sub)}</span></div>`).join('')
      : '<p class="muted">Aún no has agregado productos.</p>';
    $('#carritoTotal').textContent = pesos(totalCarrito());
    const u = usuarioActual();
    $('#datosEntrega').innerHTML = u
      ? `Entregar a <b>${u.correo}</b><br>Cel. ${u.cel} · ${u.dir}`
      : 'Inicia sesión o regístrate para confirmar el pedido.';
    actualizarWhatsApp();
  }

  function mensajeWhatsApp() {
    const u = usuarioActual(); const ls = lineas();
    let m = `Hola Distribuidora de Huevos JD, quiero hacer un pedido (${tipoVenta === 'detal' ? 'al detal' : 'por mayor'}):\n`;
    m += ls.length ? ls.map(l => `- ${l.n} cubeta(s) ${l.t.nombre}: ${pesos(l.sub)}`).join('\n') + `\nTotal: ${pesos(totalCarrito())}` : '- (quiero información de precios)';
    if (u) m += `\n\nCorreo: ${u.correo}\nCelular: ${u.cel}\nDirección: ${u.dir}`;
    return m + '\nPago: contraentrega.';
  }
  function actualizarWhatsApp() {
    const url = `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(mensajeWhatsApp())}`;
    $('#btnWa').href = url; $('#waFloat').href = url;
  }
  $('#waNumero').textContent = '+' + WA_NUMERO.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})$/, '$1 $2 $3 $4');

  $('#tipoVenta').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    tipoVenta = b.dataset.t;
    document.querySelectorAll('#tipoVenta button').forEach(x => x.classList.toggle('on', x === b));
    pintarCatalogo(); pintarCarrito();
  });

  // Descuenta del inventario usando FIFO: primero los lotes más antiguos (que aún se pueden vender)
  function descontarFIFO(tam, n) {
    db.lotes.filter(l => l.tam === tam && diasDesde(l.fecha) <= DIAS_MAX_VENTA)
      .sort((a, b) => a.fecha.localeCompare(b.fecha))
      .forEach(l => { const q = Math.min(l.cant, n); l.cant -= q; n -= q; });
    db.lotes = db.lotes.filter(l => l.cant > 0);
  }

  function aviso(el, texto, ok) { el.textContent = texto; el.className = 'msg ' + (ok ? 'ok' : 'err'); }

  $('#btnConfirmar').addEventListener('click', () => {
    const msg = $('#pedidoMsg'); const u = usuarioActual();
    if (!cubetasCarrito()) return aviso(msg, 'Agrega al menos una cubeta.');
    if (!u) { abrirModal('registro'); return aviso(msg, 'Primero regístrate o inicia sesión.'); }
    if (tipoVenta === 'mayor' && cubetasCarrito() < MIN_MAYOR) return aviso(msg, `La venta por mayor es desde ${MIN_MAYOR} cubetas.`);
    const falta = lineas().find(l => l.n > stockDe(l.t.id));
    if (falta) return aviso(msg, `Solo quedan ${stockDe(falta.t.id)} cubetas ${falta.t.nombre}.`);

    const pedido = { n: db.seqPedido++, correo: u.correo, cel: u.cel, dir: u.dir, tipo: tipoVenta,
      items: lineas().map(l => `${l.n} ${l.t.nombre}`), total: totalCarrito(), fecha: new Date().toISOString().slice(0, 10), estado: 'Pendiente' };
    lineas().forEach(l => descontarFIFO(l.t.id, l.n));
    db.pedidos.unshift(pedido); guardar();
    Object.keys(carrito).forEach(k => delete carrito[k]);
    pintarTodo();
    aviso(msg, `Pedido N.º ${pedido.n} registrado. Pagas al recibir. Te contactaremos al ${u.cel}.`, true);
  });

  /* ---------- 7. Inventario (solo administrador) ---------- */
  $('#loteTam').innerHTML = TAMANOS.map(t => `<option value="${t.id}">${t.nombre}</option>`).join('');
  $('#loteFecha').value = fechaHace(0); $('#loteFecha').max = fechaHace(0);
  const nombreTam = (id) => TAMANOS.find(t => t.id === id).nombre;

  function pintarInventario() {
    if (!esAdmin()) return;
    const lotes = [...db.lotes].sort((a, b) => a.fecha.localeCompare(b.fecha));
    const vendible = lotes.filter(l => diasDesde(l.fecha) <= DIAS_MAX_VENTA).reduce((s, l) => s + l.cant, 0);
    const alerta = lotes.filter(l => diasDesde(l.fecha) > 14).length;
    const pend = db.pedidos.filter(p => p.estado !== 'Entregado').length;
    const edadProm = lotes.length ? Math.round(lotes.reduce((s, l) => s + diasDesde(l.fecha) * l.cant, 0) / lotes.reduce((s, l) => s + l.cant, 0)) : 0;
    $('#kpis').innerHTML = [
      ['Cubetas vendibles', vendible], ['Edad promedio (días)', edadProm],
      ['Lotes en alerta', alerta], ['Pedidos por entregar', pend]
    ].map(([t, v]) => `<div class="kpi"><b>${v}</b>${t}</div>`).join('');

    $('#tablaLotes tbody').innerHTML = lotes.map(l => {
      const d = diasDesde(l.fecha); const [txt, cls] = estadoFrescura(d);
      return `<tr><td>L-${String(l.id).padStart(3, '0')}</td><td>${nombreTam(l.tam)}</td><td class="num">${l.cant}</td>
        <td>${l.fecha}<br><span class="muted small">${l.prov}</span></td><td class="num">${d}</td>
        <td><span class="badge ${cls}">${txt}</span></td><td><button class="link" data-del="${l.id}">Dar de baja</button></td></tr>`;
    }).join('') || '<tr><td colspan="7">No hay lotes registrados.</td></tr>';

    $('#tablaPedidos tbody').innerHTML = db.pedidos.map(p => `
      <tr><td>${p.n}</td><td>${p.correo}<br><span class="muted small">${p.cel}</span></td><td>${p.dir}</td>
      <td>${p.items.join(', ')}<br><span class="muted small">${p.tipo === 'detal' ? 'Detal' : 'Mayorista'} · ${p.fecha}</span></td>
      <td class="num">${pesos(p.total)}</td>
      <td><button class="btn ${p.estado === 'Entregado' ? 'btn-ghost' : 'btn-orange'}" data-ped="${p.n}">${p.estado}</button></td></tr>`).join('')
      || '<tr><td colspan="6">Todavía no hay pedidos.</td></tr>';
  }

  $('#formLote').addEventListener('submit', e => {
    e.preventDefault();
    db.lotes.push({ id: db.seqLote++, tam: $('#loteTam').value, cant: Number($('#loteCant').value), fecha: $('#loteFecha').value, prov: $('#loteProv').value.trim() });
    guardar(); e.target.reset(); $('#loteFecha').value = fechaHace(0); pintarTodo();
  });
  $('#tablaLotes').addEventListener('click', e => {
    const id = Number(e.target.dataset.del); if (!id) return;
    db.lotes = db.lotes.filter(l => l.id !== id); guardar(); pintarTodo();
  });
  const SIG = { Pendiente: 'Despachado', Despachado: 'Entregado', Entregado: 'Pendiente' };
  $('#tablaPedidos').addEventListener('click', e => {
    const n = Number(e.target.dataset.ped); if (!n) return;
    const p = db.pedidos.find(x => x.n === n); p.estado = SIG[p.estado]; guardar(); pintarInventario();
  });

  /* ---------- 8. Acceso: registro / ingreso / salir ---------- */
  const reCorreo = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  const reCel = /^3\d{9}$/; // celular colombiano: 10 dígitos que empiezan por 3

  function abrirModal(vista) {
    $('#modal').hidden = false; cambiarVista(vista); $('#accesoMsg').textContent = '';
    setTimeout(() => (vista === 'ingreso' ? $('#ingCorreo') : $('#regCorreo')).focus(), 50);
  }
  const cerrarModal = () => { $('#modal').hidden = true; };
  function cambiarVista(v) {
    document.querySelectorAll('#tabsAcceso button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
    $('#formRegistro').hidden = v !== 'registro'; $('#formIngreso').hidden = v !== 'ingreso';
  }
  $('#tabsAcceso').addEventListener('click', e => { const b = e.target.closest('button'); if (b) cambiarVista(b.dataset.v); });
  $('#cerrarModal').addEventListener('click', cerrarModal);
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') cerrarModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarModal(); });

  $('#formRegistro').addEventListener('submit', e => {
    e.preventDefault();
    const correo = $('#regCorreo').value.trim().toLowerCase();
    const cel = $('#regCel').value.replace(/\D/g, '');
    const dir = $('#regDir').value.trim();
    const m = $('#accesoMsg');
    if (!reCorreo.test(correo)) return aviso(m, 'Escribe un correo válido.');
    if (!reCel.test(cel)) return aviso(m, 'El celular debe tener 10 dígitos y empezar por 3.');
    if (dir.length < 8) return aviso(m, 'Escribe la dirección completa de entrega.');
    const existe = db.usuarios.find(u => u.correo === correo);
    if (existe) Object.assign(existe, { cel, dir }); else db.usuarios.push({ correo, cel, dir });
    iniciarSesion({ correo, cel, dir });
  });

  $('#formIngreso').addEventListener('submit', e => {
    e.preventDefault();
    const correo = $('#ingCorreo').value.trim().toLowerCase();
    const m = $('#accesoMsg');
    if (!reCorreo.test(correo)) return aviso(m, 'Escribe un correo válido.');
    const u = db.usuarios.find(x => x.correo === correo) || (correo === ADMIN ? { correo, cel: '—', dir: 'Bodega principal' } : null);
    if (!u) { cambiarVista('registro'); $('#regCorreo').value = correo; return aviso(m, 'Ese correo no está registrado. Completa tus datos.'); }
    iniciarSesion(u);
  });

  function iniciarSesion(u) {
    db.sesion = u; guardar(); cerrarModal(); pintarTodo();
    location.hash = esAdmin() ? 'inventario' : 'pedidos';
  }

  function pintarAcceso() {
    const u = usuarioActual();
    $('#access').innerHTML = u
      ? `<span class="user-chip" title="${u.correo}">${esAdmin() ? 'Admin · ' : ''}${u.correo}</span><button class="btn btn-sun" id="btnSalir">Salir</button>`
      : '<button class="btn btn-sun" id="btnAcceso">Ingresar / Registrarse</button>';
    $('#navInventario').hidden = !esAdmin();
    $('#inventario').hidden = !esAdmin();
  }
  $('#access').addEventListener('click', e => {
    if (e.target.id === 'btnAcceso') abrirModal('registro');
    if (e.target.id === 'btnSalir') { db.sesion = null; guardar(); pintarTodo(); location.hash = 'nosotros'; }
  });

  // Resalta en el menú la sección visible
  const obsMenu = new IntersectionObserver(ents => ents.forEach(en => {
    if (en.isIntersecting) document.querySelectorAll('.menu a').forEach(a => a.classList.toggle('activo', a.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-40% 0px -55% 0px' });
  ['nosotros', 'recetas', 'pedidos', 'inventario'].forEach(id => obsMenu.observe(document.getElementById(id)));

  // Etiquetas de columnas para tablas en celular
  const obsTablas = new MutationObserver(() => {
    for (const c of document.querySelectorAll('.stack td:not([data-l])')) {
      let i = 0, p = c; while ((p = p.previousElementSibling)) i += p.colSpan;
      c.dataset.l = c.closest('table').rows[0].cells[i]?.textContent || '';
    }
  });
  obsTablas.observe(document.body, { childList: true, subtree: true });

  function pintarTodo() { pintarAcceso(); pintarFrescuraHoy(); pintarCatalogo(); pintarCarrito(); pintarInventario(); }
  pintarTodo();
}