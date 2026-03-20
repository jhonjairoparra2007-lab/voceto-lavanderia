// ============================================
//   LAVANDERÍA NEBULOSA — nebulosa.js
//   Lavadoras canvas · Simulador de carga
//   Calculadora de manchas · Rastreador ticket
//   Tambor de turno · Calculadora de precios
// ============================================

// ══════ DATA ══════
const maquinas = [
  {id:1, nombre:'Máquina 1', kg:8,  estado:'ocupada',    programa:'Algodón 60°', progreso:75, ticket:'4821', cliente:'Ana M.'},
  {id:2, nombre:'Máquina 2', kg:12, estado:'libre',      programa:'—',           progreso:0,  ticket:null,   cliente:null},
  {id:3, nombre:'Máquina 3', kg:8,  estado:'terminando', programa:'Sintéticos',  progreso:95, ticket:'5678', cliente:'Carlos R.'},
  {id:4, nombre:'Máquina 4', kg:10, estado:'ocupada',    programa:'Delicado 30°',progreso:40, ticket:'9012', cliente:'María J.'},
  {id:5, nombre:'Máquina 5', kg:8,  estado:'libre',      programa:'—',           progreso:0,  ticket:null,   cliente:null},
  {id:6, nombre:'Máquina 6', kg:15, estado:'ocupada',    programa:'Sábanas 90°', progreso:20, ticket:'3344', cliente:'Pedro L.'},
];

const prendas = [
  {nombre:'Camiseta',   icono:'👕', peso:0.3, color:'#e0e8ff'},
  {nombre:'Pantalón',   icono:'👖', peso:0.6, color:'#d0e0ff'},
  {nombre:'Vestido',    icono:'👗', peso:0.5, color:'#ffe0f0'},
  {nombre:'Ropa interior',icono:'🩲',peso:0.15,color:'#fff0e0'},
  {nombre:'Calcetines', icono:'🧦', peso:0.1, color:'#e0ffe0'},
  {nombre:'Chaqueta',   icono:'🧥', peso:1.2, color:'#f0e0ff'},
  {nombre:'Sábana',     icono:'🛏️', peso:1.5, color:'#e8f8ff'},
  {nombre:'Toalla',     icono:'🏊', peso:0.8, color:'#e0f4ff'},
  {nombre:'Shorts',     icono:'🩳', peso:0.4, color:'#fff8e0'},
  {nombre:'Camisa',     icono:'👔', peso:0.4, color:'#e8ffe8'},
];

const manchas = [
  {id:'sangre',    nombre:'Sangre',          icono:'🔴', nivel:3, servicio:'Especial',  precio:12000,
   consejos:['Lavar con agua FRÍA inmediatamente','Nunca usar agua caliente (fija la mancha)','Remojo con agua oxigenada al 3%'],
   desc:'Requiere tratamiento enzimático especializado.'},
  {id:'grasa',     nombre:'Grasa/Aceite',    icono:'🟡', nivel:2, servicio:'Especial',  precio:12000,
   consejos:['Aplicar talco o maicena para absorber','No frotar — empeora la mancha','Usar jabón desengrasante antes del lavado'],
   desc:'El tiempo importa — entre más rápido, mejor.'},
  {id:'vino',      nombre:'Vino tinto',       icono:'🍷', nivel:3, servicio:'Especial',  precio:12000,
   consejos:['Sal gruesa encima inmediatamente','Agua con gas como primer auxilio','Nunca seques al calor antes de tratar'],
   desc:'Una de las manchas más difíciles. Traiga rápido.'},
  {id:'cafe',      nombre:'Café/Té',          icono:'☕', nivel:2, servicio:'Normal',    precio:8000,
   consejos:['Agua fría de inmediato','Jabón de glicerina funciona bien','Evitar fregar fuerte'],
   desc:'Mancha relativamente tratable con lavado normal.'},
  {id:'hierba',    nombre:'Hierba/Pasto',     icono:'🌿', nivel:2, servicio:'Normal',    precio:8000,
   consejos:['Frotar con alcohol isopropílico','Luego lavar con detergente normal','No usar lejía en colores'],
   desc:'Tratable con nuestro lavado estándar.'},
  {id:'tinta',     nombre:'Tinta/Bolígrafo',  icono:'🖊️', nivel:3, servicio:'Especial',  precio:12000,
   consejos:['Alcohol puro (frotar hacia el centro)','Papel absorbente por detrás de la tela','Nunca usar agua directamente al inicio'],
   desc:'Requiere solventes específicos. No intentes en casa.'},
  {id:'sudor',     nombre:'Sudor/Sarro',      icono:'💧', nivel:1, servicio:'Normal',    precio:8000,
   consejos:['Remojo prolongado antes del lavado','Bicarbonato de sodio directo en la zona','Lavado normal a 40°C'],
   desc:'Lavado normal con buen resultado.'},
  {id:'barro',     nombre:'Barro/Tierra',     icono:'🟤', nivel:1, servicio:'Normal',    precio:8000,
   consejos:['Deja SECAR completamente primero','Sacudir y cepillar el exceso seco','Lavar normal después'],
   desc:'Error común: lavar mojado fija la mancha.'},
  {id:'maquillaje',nombre:'Maquillaje',       icono:'💄', nivel:2, servicio:'Delicado',  precio:15000,
   consejos:['Desmaquillante en aceite como pre-tratamiento','Agua FRÍA siempre','Tela delicada: traer aquí'],
   desc:'Requiere tratamiento delicado según la tela.'},
  {id:'comida',    nombre:'Comida en general', icono:'🍝', nivel:1, servicio:'Normal',   precio:8000,
   consejos:['Retirar el exceso con espátula o cuchara','Agua fría + jabón líquido','Remojo 30 minutos antes'],
   desc:'La mayoría de manchas de comida responden bien.'},
];

const servicios = [
  {icono:'🧺', nombre:'Lavado Normal',    precio:'$8.000/kg', unidad:'por kilogramo',  tiempo:'4–6 horas',  desc:'Ropa cotidiana, temperatura normal. Incluye secado y doblado.'},
  {icono:'✨', nombre:'Lavado Especial',  precio:'$12.000/kg',unidad:'por kilogramo',  tiempo:'6–8 horas',  desc:'Manchas difíciles, colores delicados, prendas especiales.'},
  {icono:'🌸', nombre:'Lavado Delicado', precio:'$15.000/kg', unidad:'por kilogramo',  tiempo:'8–10 horas', desc:'Seda, lino, cachemir y prendas de lujo. Atención especial.'},
  {icono:'👔', nombre:'Planchado',        precio:'$3.500',    unidad:'por prenda',     tiempo:'2–4 horas',  desc:'Planchado profesional con vapor. Camisas, vestidos, pantalones.'},
  {icono:'🛏️', nombre:'Sábanas y Ropa de cama',precio:'$10.000',unidad:'por juego', tiempo:'6–8 horas',  desc:'Juego completo: sábanas, fundas y cubreama. Tamaño estándar.'},
  {icono:'🧥', nombre:'Prendas Gruesas', precio:'$18.000',    unidad:'por prenda',     tiempo:'8–12 horas', desc:'Cobijas, abrigos, sacos de lana. Lavado a mano + secado completo.'},
  {icono:'⚡', nombre:'Servicio Express', precio:'+40%',       unidad:'sobre el total', tiempo:'3 horas',   desc:'¿Lo necesitas hoy? Servicio exprés con entrega garantizada.'},
  {icono:'🏠', nombre:'Domicilio',        precio:'$5.000',    unidad:'recogida+entrega',tiempo:'24–48h',    desc:'Recogemos y entregamos. Gratis en pedidos mayores a $50.000.'},
];

const ticketsDemo = {
  '1234': {cliente:'Ana María', prendas:8, maquina:1, estado:2, programa:'Algodón 60°', entrada:'9:30 AM', entrega:'3:30 PM'},
  '5678': {cliente:'Carlos Rodríguez', prendas:5, maquina:3, estado:4, programa:'Sintéticos 40°', entrada:'10:00 AM', entrega:'2:00 PM'},
  '9012': {cliente:'María Jiménez', prendas:12, maquina:4, estado:1, programa:'Delicado 30°', entrada:'11:00 AM', entrega:'5:00 PM'},
};

const pasosProceso = [
  {nombre:'Recibido y clasificado', icono:'📥', desc:'Tu ropa fue revisada y clasificada por tipo de tela'},
  {nombre:'Pre-tratamiento',        icono:'🧴', desc:'Manchas específicas tratadas individualmente'},
  {nombre:'En lavado',              icono:'🌀', desc:'Ciclo de lavado activo en máquina'},
  {nombre:'Secado',                 icono:'💨', desc:'Secado completo a temperatura controlada'},
  {nombre:'Doblado y empacado',     icono:'📦', desc:'Doblado con cuidado y empacado limpio'},
];

// ══════ STATE ══════
let simCarga = [];
let zonaSel = null;
let manchaSel = null;
let metodoPago = null;
let kgActual = 4;
let turnoNumero = null;
let tamborSpinning = false;
let tamborAngle = 0;

const PAY_LABELS = {efectivo:'💵 Efectivo al recibir',nequi:'📱 Nequi — 321 456 7890',daviplata:'🔴 Daviplata — 321 456 7890',transfer:'🏦 Transferencia / PSE'};

// ══════ INIT ══════
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initBurbujas();
  initHeroCanvas();
  initMiniLavadora('miniLavadora');
  initMiniLavadora('footerLav');
  renderMaquinas();
  renderPrendas();
  renderManchas();
  renderServicios();
  initTambor();
  animCounters();
  initReveal();
  calcularPrecio();
  updateHorario();
  setInterval(updateMaquinasProgreso, 3000);
});

// ══════ BURBUJAS ══════
function initBurbujas() {
  const c = document.getElementById('burbujasBg');
  if (!c) return;
  for (let i = 0; i < 16; i++) {
    const b = document.createElement('div');
    b.className = 'burbuja';
    const s = 10 + Math.random() * 50;
    b.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*100}%;animation-duration:${10+Math.random()*20}s;animation-delay:${Math.random()*15}s`;
    c.appendChild(b);
  }
}

// ══════ MINI LAVADORA (nav + footer) ══════
function initMiniLavadora(id) {
  const c = document.getElementById(id);
  if (!c) return;
  const ctx = c.getContext('2d');
  let angle = 0;
  function draw() {
    ctx.clearRect(0,0,c.width,c.height);
    const cx = c.width/2, cy = c.height/2, r = cx*0.85;
    // Cuerpo
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.fillStyle='#1a7aff'; ctx.fill();
    // Ventana
    ctx.beginPath(); ctx.arc(cx,cy,r*0.65,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,0.15)'; ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.6)'; ctx.lineWidth=1.5; ctx.stroke();
    // Ropa girando
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(angle);
    for (let i=0;i<3;i++) {
      const a = (i/3)*Math.PI*2;
      ctx.beginPath(); ctx.arc(Math.cos(a)*r*0.35, Math.sin(a)*r*0.35, r*0.12, 0, Math.PI*2);
      ctx.fillStyle=['rgba(255,220,100,0.7)','rgba(100,220,255,0.7)','rgba(255,140,180,0.7)'][i];
      ctx.fill();
    }
    ctx.restore();
    // Centro
    ctx.beginPath(); ctx.arc(cx,cy,r*0.1,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.fill();
    angle += 0.04;
    requestAnimationFrame(draw);
  }
  draw();
}

// ══════ HERO CANVAS ══════
function initHeroCanvas() {
  const c = document.getElementById('heroCanvas');
  if (!c) return;
  c.width = c.offsetWidth * window.devicePixelRatio || 600;
  c.height = 420;
  const ctx = c.getContext('2d');

  // 3 lavadoras en fila
  const lavs = [
    {x:80,  color:'#4a90e8', agua:'rgba(74,154,255,0.6)', fill:0.6, angle:0, speed:0.025},
    {x:220, color:'#50c878', agua:'rgba(80,200,120,0.6)', fill:0.8, angle:1, speed:0.035},
    {x:360, color:'#9a60e8', agua:'rgba(154,96,232,0.6)', fill:0.4, angle:2, speed:0.02},
  ];

  function drawLav(lav, t) {
    const {x,color,agua,fill,angle} = lav;
    const cy = 200, r = 85;

    // Sombra
    ctx.beginPath(); ctx.ellipse(x,cy+r+10,r*0.6,8,0,0,Math.PI*2);
    ctx.fillStyle='rgba(0,0,0,0.08)'; ctx.fill();

    // Cuerpo lavadora
    const body = ctx.createRoundRect ? null : null;
    ctx.beginPath();
    roundRect(ctx, x-r, cy-r, r*2, r*2, 18);
    ctx.fillStyle='#f0f4f8'; ctx.fill();
    ctx.strokeStyle='#d0dae8'; ctx.lineWidth=2; ctx.stroke();

    // Ventana circular
    ctx.save();
    ctx.beginPath(); ctx.arc(x, cy, r*0.68, 0, Math.PI*2);
    ctx.clip();

    // Agua
    const waveY = cy + r*0.68*(1-fill*2+1);
    ctx.beginPath();
    ctx.moveTo(x-r*0.68, cy+r*0.68);
    for (let i=-r*0.68; i<=r*0.68; i+=3) {
      const wave = Math.sin((i*0.05) + t*3 + angle) * 8;
      ctx.lineTo(x+i, waveY+wave);
    }
    ctx.lineTo(x+r*0.68, cy+r*0.68);
    ctx.closePath();
    ctx.fillStyle=agua; ctx.fill();

    // Ropa girando
    ctx.rotate && (() => {})();
    ctx.translate(x, cy);
    ctx.rotate(t * lav.speed * 60);
    ['rgba(255,200,80,0.8)','rgba(255,120,160,0.8)','rgba(120,200,255,0.8)','rgba(200,255,120,0.8)'].forEach((col,i) => {
      const a = (i/4)*Math.PI*2 + t*lav.speed*60;
      ctx.beginPath();
      ctx.ellipse(Math.cos(a)*r*0.32, Math.sin(a)*r*0.28, r*0.18, r*0.1, a, 0, Math.PI*2);
      ctx.fillStyle=col; ctx.fill();
    });
    ctx.restore();

    // Borde ventana
    ctx.beginPath(); ctx.arc(x, cy, r*0.68, 0, Math.PI*2);
    ctx.strokeStyle=color; ctx.lineWidth=4; ctx.stroke();

    // Burbujas
    for (let b=0; b<4; b++) {
      const bx = x + Math.sin(t*2+b*1.5)*r*0.4;
      const by = waveY + Math.cos(t*1.5+b)*r*0.3;
      ctx.beginPath(); ctx.arc(bx,by,2+Math.random()*3,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.fill();
    }

    // Panel inferior
    ctx.beginPath();
    roundRect(ctx, x-r, cy+r+2, r*2, 22, [0,0,8,8]);
    ctx.fillStyle='#e0e8f0'; ctx.fill();

    // LED estado
    ctx.beginPath(); ctx.arc(x-r+15, cy+r+13, 5, 0, Math.PI*2);
    ctx.fillStyle=color; ctx.fill();
    ctx.shadowColor=color; ctx.shadowBlur=8;
    ctx.fill(); ctx.shadowBlur=0;

    // Perilla
    ctx.beginPath(); ctx.arc(x+r-18, cy+r+13, 7, 0, Math.PI*2);
    ctx.fillStyle='#c0cad8'; ctx.fill();
    ctx.beginPath(); ctx.arc(x+r-18+Math.cos(t)*4, cy+r+13+Math.sin(t)*4, 2, 0, Math.PI*2);
    ctx.fillStyle='#707888'; ctx.fill();
  }

  let t = 0;
  function frame() {
    ctx.clearRect(0,0,c.width,c.height);
    // Fondo suave
    const grad = ctx.createLinearGradient(0,0,0,c.height);
    grad.addColorStop(0,'rgba(232,242,255,0.5)');
    grad.addColorStop(1,'rgba(200,220,255,0.2)');
    ctx.fillStyle=grad; ctx.fillRect(0,0,c.width,c.height);
    lavs.forEach(lav => drawLav(lav, t));
    t += 0.016;
    requestAnimationFrame(frame);
  }
  frame();
}

function roundRect(ctx, x, y, w, h, r) {
  if (typeof r === 'number') r = [r,r,r,r];
  ctx.moveTo(x+r[0], y);
  ctx.lineTo(x+w-r[1], y);
  ctx.quadraticCurveTo(x+w, y, x+w, y+r[1]);
  ctx.lineTo(x+w, y+h-r[2]);
  ctx.quadraticCurveTo(x+w, y+h, x+w-r[2], y+h);
  ctx.lineTo(x+r[3], y+h);
  ctx.quadraticCurveTo(x, y+h, x, y+h-r[3]);
  ctx.lineTo(x, y+r[0]);
  ctx.quadraticCurveTo(x, y, x+r[0], y);
}

// ══════ MÁQUINAS ══════
const maquinaCanvases = {};

function renderMaquinas() {
  const grid = document.getElementById('maquinasGrid');
  if (!grid) return;
  grid.innerHTML = maquinas.map(m => `
    <div class="maquina-card ${m.estado} neb-reveal">
      <div class="mc-num">MÁQUINA #${m.id} · ${m.kg}kg</div>
      <div class="mc-canvas-wrap">
        <canvas id="mc_${m.id}" width="120" height="120" style="border-radius:50%"></canvas>
      </div>
      <div class="mc-estado ${m.estado}">
        <div class="mc-dot"></div>
        ${{libre:'Disponible',ocupada:'En uso',terminando:'Casi lista'}[m.estado]}
      </div>
      <div class="mc-info">
        ${m.estado !== 'libre' ? `${m.programa}<br/>Ticket: #${m.ticket || '—'}` : 'Lista para usar'}
      </div>
      ${m.estado !== 'libre' ? `
        <div class="mc-prog"><div class="mc-prog-fill" style="width:${m.progreso}%;background:${m.estado==='terminando'?'var(--azul)':'var(--verde)'}"></div></div>
        <div style="font-size:0.65rem;color:var(--text-l);font-family:var(--font-mn,monospace);margin-top:4px;text-align:right">${m.progreso}%</div>
      ` : ''}
    </div>`).join('');

  setTimeout(() => {
    maquinas.forEach(m => {
      const c = document.getElementById('mc_' + m.id);
      if (c) iniciarLavadoraCard(c, m);
    });
    initReveal();
  }, 100);
}

function iniciarLavadoraCard(c, m) {
  const ctx = c.getContext('2d');
  const colors = {libre:'#50c878', ocupada:'#1a7aff', terminando:'#f0a010'};
  const aguas  = {libre:'rgba(80,200,120,0.4)', ocupada:'rgba(74,154,255,0.5)', terminando:'rgba(240,160,16,0.4)'};
  let t = Math.random() * Math.PI * 2;
  const fill = m.estado === 'libre' ? 0 : (m.progreso / 100) * 0.7 + 0.1;

  function frame() {
    ctx.clearRect(0,0,c.width,c.height);
    const cx = c.width/2, cy = c.height/2, r = cx - 4;
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.fillStyle='#f0f4f8'; ctx.fill();
    ctx.strokeStyle=colors[m.estado]; ctx.lineWidth=3; ctx.stroke();

    // Agua con ola
    if (m.estado !== 'libre') {
      ctx.save();
      ctx.beginPath(); ctx.arc(cx,cy,r-3,0,Math.PI*2); ctx.clip();
      const wy = cy + r*(1-fill*2);
      ctx.beginPath(); ctx.moveTo(cx-r,cy+r);
      for (let i=-r; i<=r; i+=2) {
        ctx.lineTo(cx+i, wy + Math.sin(i*0.08+t*2)*5);
      }
      ctx.lineTo(cx+r,cy+r); ctx.closePath();
      ctx.fillStyle=aguas[m.estado]; ctx.fill();
      ctx.restore();
    }

    // Ropa girando
    if (m.estado !== 'libre') {
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(t * 0.6);
      for (let i=0;i<3;i++) {
        const a = (i/3)*Math.PI*2;
        ctx.beginPath(); ctx.arc(Math.cos(a)*r*0.35, Math.sin(a)*r*0.35, 6, 0, Math.PI*2);
        ctx.fillStyle=['rgba(255,200,80,0.8)','rgba(255,140,180,0.8)','rgba(120,200,255,0.8)'][i];
        ctx.fill();
      }
      ctx.restore();
    }

    // Icono libre
    if (m.estado === 'libre') {
      ctx.fillStyle=colors[m.estado]; ctx.font='28px serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('✓', cx, cy);
    }

    // Centro
    ctx.beginPath(); ctx.arc(cx,cy,6,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.fill();
    t += 0.02;
    requestAnimationFrame(frame);
  }
  frame();
  maquinaCanvases[m.id] = {ctx, m, t};
}

function updateMaquinasProgreso() {
  maquinas.forEach(m => {
    if (m.estado === 'ocupada' && m.progreso < 90) m.progreso += Math.random() * 2;
    if (m.estado === 'terminando') m.progreso = Math.min(100, m.progreso + 0.5);
    // Update progress bar
    const bar = document.querySelector(`#mc_${m.id}`)?.closest('.maquina-card')?.querySelector('.mc-prog-fill');
    if (bar) { bar.style.width = m.progreso + '%'; }
  });
}

// ══════ SIMULADOR DE CARGA ══════
let simAngle = 0, simCanvas2Ref = null;

function renderPrendas() {
  const cont = document.getElementById('prendasDisponibles');
  if (!cont) return;
  cont.innerHTML = prendas.map(p => `
    <div class="prenda-chip" onclick="agregarPrenda('${p.nombre}',${p.peso},'${p.icono}')" style="border-left:4px solid ${p.color}">
      ${p.icono} ${p.nombre}
    </div>`).join('');
  initSimCanvas();
}

function initSimCanvas() {
  const c = document.getElementById('simCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');

  function frame() {
    ctx.clearRect(0,0,c.width,c.height);
    const cx = c.width/2, cy = c.height/2, r = cx-6;

    // Borde máquina
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.fillStyle='#1a2a3e'; ctx.fill();

    // Agua según carga
    const totalPeso = simCarga.reduce((s,p)=>s+p.peso,0);
    const maxKg = 8;
    const fill = Math.min(totalPeso/maxKg, 1) * 0.7;
    if (fill > 0) {
      ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,r-4,0,Math.PI*2); ctx.clip();
      const wy = cy + (r-4)*(1-fill*2.2+0.8);
      ctx.beginPath(); ctx.moveTo(cx-(r-4),cy+(r-4));
      for (let i=-(r-4); i<=(r-4); i+=3) {
        ctx.lineTo(cx+i, wy+Math.sin(i*0.07+simAngle*2)*6);
      }
      ctx.lineTo(cx+(r-4),cy+(r-4)); ctx.closePath();
      ctx.fillStyle=`rgba(74,154,255,${0.3+fill*0.4})`; ctx.fill();
      ctx.restore();
    }

    // Prendas girando
    if (simCarga.length > 0) {
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(simAngle);
      simCarga.slice(0,6).forEach((p,i) => {
        const a = (i/Math.max(simCarga.length,1))*Math.PI*2;
        const pr = Math.min(r*0.5, 20+simCarga.length*2);
        ctx.beginPath(); ctx.arc(Math.cos(a)*pr, Math.sin(a)*pr, 10, 0, Math.PI*2);
        ctx.fillStyle=`hsla(${i*60+200},70%,65%,0.8)`; ctx.fill();
        ctx.fillStyle='white'; ctx.font='9px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(p.icono.length>2?'👕':p.icono, Math.cos(a)*pr, Math.sin(a)*pr);
      });
      ctx.restore();
    }

    // Ventana central
    ctx.beginPath(); ctx.arc(cx,cy,r*0.2,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,0.1)'; ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=2; ctx.stroke();

    // Texto central si vacío
    if (simCarga.length === 0) {
      ctx.fillStyle='rgba(255,255,255,0.3)';
      ctx.font='13px Space Grotesk'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('Vacía', cx, cy);
    }
    simAngle += simCarga.length > 0 ? 0.025 : 0;
    requestAnimationFrame(frame);
  }
  frame();
}

function agregarPrenda(nombre, peso, icono) {
  simCarga.push({nombre, peso, icono});
  actualizarSimInfo();
  playBloop();
}

function resetSim() {
  simCarga = [];
  actualizarSimInfo();
}

function actualizarSimInfo() {
  const cant = simCarga.length;
  const peso = simCarga.reduce((s,p)=>s+p.peso,0);
  const pesoReal = Math.max(4, peso); // mínimo 4kg
  const precio = pesoReal * 8000;
  const tiempo = cant < 5 ? 45 : cant < 10 ? 60 : 90;

  setT('simCant', cant);
  setT('simPeso', peso.toFixed(1) + ' kg');
  setT('simPrecio', cant > 0 ? '$' + precio.toLocaleString('es-CO') : '$0');
  setT('simTiempo', cant > 0 ? tiempo + ' min' : '—');

  // Lista
  const lista = document.getElementById('cargaLista');
  if (lista) {
    if (!simCarga.length) { lista.innerHTML='<p class="carga-empty">Vacío — agrega prendas →</p>'; return; }
    const counts = {};
    simCarga.forEach(p => { counts[p.nombre] = (counts[p.nombre]||{icono:p.icono,peso:p.peso,cnt:0}); counts[p.nombre].cnt++; });
    lista.innerHTML = Object.entries(counts).map(([n,v]) => `
      <div class="carga-item">
        <div><div class="ci-nombre">${v.icono} ${n} ×${v.cnt}</div><div class="ci-peso">${(v.peso*v.cnt).toFixed(2)} kg</div></div>
        <button class="ci-del" onclick="quitarPrenda('${n}')">✕</button>
      </div>`).join('');
  }
}

function quitarPrenda(nombre) {
  const idx = simCarga.findLastIndex(p => p.nombre === nombre);
  if (idx >= 0) simCarga.splice(idx, 1);
  actualizarSimInfo();
}

// ══════ MANCHAS ══════
function renderManchas() {
  const grid = document.getElementById('tipoManchaGrid');
  if (!grid) return;
  grid.innerHTML = manchas.map(m => `
    <button class="tm-btn" id="tm_${m.id}" onclick="selMancha('${m.id}')">
      <span class="tm-ico">${m.icono}</span> ${m.nombre}
    </button>`).join('');
}

function selZona(el) {
  document.querySelectorAll('.zona-mancha').forEach(z => z.classList.remove('sel'));
  el.classList.add('sel');
  zonaSel = el.dataset.zona;
  setT('pfZonaSel', '📍 ' + zonaSel);
  checkManchaBtn();
}

function selMancha(id) {
  manchaSel = id;
  document.querySelectorAll('.tm-btn').forEach(b => b.classList.remove('sel'));
  document.getElementById('tm_' + id)?.classList.add('sel');
  checkManchaBtn();
}

function checkManchaBtn() {
  const btn = document.getElementById('btnCalcMancha');
  if (btn) btn.disabled = !(zonaSel && manchaSel);
}

function calcularMancha() {
  if (!zonaSel || !manchaSel) return;
  const m = manchas.find(x => x.id === manchaSel);
  if (!m) return;
  const niveles = ['Fácil','Moderada','Difícil'];
  const ncolors = ['var(--verde)','#e08010','var(--rojo,#e03020)'];
  const res = document.getElementById('manchaResultado');
  if (!res) return;
  res.innerHTML = `
    <div class="mr-contenido">
      <div class="mr-titulo">${m.icono} Mancha de ${m.nombre}</div>
      <div class="mr-zona">📍 ${zonaSel}</div>
      <div class="mr-nivel">
        <span class="mrn-label">Dificultad:</span>
        <div class="mrn-bar"><div class="mrn-fill" style="width:${m.nivel/3*100}%;background:${ncolors[m.nivel-1]}"></div></div>
        <span class="mrn-val" style="color:${ncolors[m.nivel-1]}">${niveles[m.nivel-1]}</span>
      </div>
      <p style="font-size:0.82rem;color:var(--text);margin-bottom:14px;line-height:1.6">${m.desc}</p>
      <div class="mr-servicio">
        <div class="mrs-titulo">SERVICIO RECOMENDADO</div>
        <div class="mrs-nombre">✓ Lavado ${m.servicio}</div>
        <div class="mrs-precio">Desde $${m.precio.toLocaleString('es-CO')}/kg</div>
      </div>
      <div style="font-size:0.8rem;font-weight:600;color:var(--oscuro);margin:12px 0 6px">💡 Qué puedes hacer antes de traerla:</div>
      <ul class="mr-consejos">
        ${m.consejos.map(c=>`<li>${c}</li>`).join('')}
      </ul>
      <button class="btn-neb" style="width:100%;margin-top:16px" onclick="document.getElementById('domicilio').scrollIntoView({behavior:'smooth'})">
        Pedir recogida ahora →
      </button>
    </div>`;
  playBloop();
}

// ══════ RASTREADOR DE ROPA ══════
function probarTicket(num) {
  document.getElementById('ticketInput').value = num;
  rastrearRopa();
}

function rastrearRopa() {
  const input = document.getElementById('ticketInput');
  if (!input) return;
  const num = input.value.trim();
  if (!num || num.length < 4) { showToast('⚠️ Ingresa un número de ticket válido'); return; }

  const res = document.getElementById('rastreoResultado');
  const proc = document.getElementById('procesoVisual');
  const ticket = ticketsDemo[num];

  if (!ticket) {
    if (res) res.innerHTML = `
      <div class="rr-placeholder">
        <span>❌</span>
        <p>Ticket #${num} no encontrado.<br/>Verifica el número o contáctanos.</p>
      </div>`;
    if (proc) proc.style.display = 'none';
    return;
  }

  const estadoActivo = ticket.estado;
  const dots = Array(pasosProceso.length).fill(0).map((_,i) => i < estadoActivo ? 'done' : i === estadoActivo ? 'active' : '');

  if (res) res.innerHTML = `
    <div class="rr-contenido">
      <div class="rr-ticket">TICKET #${num}</div>
      <div class="rr-nombre">👋 Hola, ${ticket.cliente}</div>
      <div class="rr-ciclo">
        <div class="rrm-dot" style="background:${estadoActivo>=4?'var(--verde)':'var(--azul)'}"></div>
        <div class="rrm-info">
          <strong>${pasosProceso[estadoActivo]?.nombre || 'Completado'}</strong>
          <span>${pasosProceso[estadoActivo]?.desc || '¡Lista para recoger!'} · ${ticket.prendas} prendas · Máq. #${ticket.maquina}</span>
        </div>
      </div>
      <div style="font-size:0.72rem;color:rgba(255,255,255,0.4);font-family:'DM Mono',monospace;margin-bottom:8px">Entrada: ${ticket.entrada} · Entrega est: ${ticket.entrega}</div>
      <div class="rr-prgs">
        ${dots.map(d=>`<div class="rr-prg-dot ${d}"></div>`).join('')}
      </div>
    </div>`;

  // Proceso visual
  if (proc) {
    proc.style.display = 'grid';
    const steps = document.getElementById('pvSteps');
    if (steps) steps.innerHTML = pasosProceso.map((p,i) => `
      <div class="pvs-step ${i<estadoActivo?'done':i===estadoActivo?'active':''}">
        <div class="pvs-num">${i<estadoActivo?'✓':(i+1)}</div>
        <div class="pvs-info">
          <strong>${p.icono} ${p.nombre}</strong>
          <span>${p.desc}</span>
        </div>
      </div>`).join('');
    setT('pvLavLabel', 'Máquina #' + ticket.maquina);
    initRastreoCanvas(ticket.maquina, estadoActivo);
  }
  playBloop();
}

function initRastreoCanvas(machNum, estado) {
  const c = document.getElementById('rastreoCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  const maq = maquinas.find(m => m.id === machNum);
  let t = 0;
  const colors = ['#50c878','#1a7aff','#9a60e8','#f0a010','#50c878','#e04060'];
  const color = colors[(machNum-1) % colors.length];

  function frame() {
    ctx.clearRect(0,0,c.width,c.height);
    const cx=c.width/2, cy=c.height/2, r=cx-6;
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.fillStyle='#1a2a3e'; ctx.fill();
    if (estado >= 2 && estado < 5) {
      ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,r-4,0,Math.PI*2); ctx.clip();
      const wy = cy+r*0.2;
      ctx.beginPath(); ctx.moveTo(cx-(r-4),cy+(r-4));
      for (let i=-(r-4);i<=(r-4);i+=3) { ctx.lineTo(cx+i,wy+Math.sin(i*0.08+t*2)*7); }
      ctx.lineTo(cx+(r-4),cy+(r-4)); ctx.closePath();
      ctx.fillStyle=`rgba(74,154,255,0.45)`; ctx.fill();
      ctx.restore();
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(t*0.04);
      for (let i=0;i<3;i++) { const a=(i/3)*Math.PI*2; ctx.beginPath(); ctx.arc(Math.cos(a)*r*0.3,Math.sin(a)*r*0.3,8,0,Math.PI*2); ctx.fillStyle=['rgba(255,200,80,0.8)','rgba(255,140,180,0.8)','rgba(120,200,255,0.8)'][i]; ctx.fill(); }
      ctx.restore();
    }
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.strokeStyle=color; ctx.lineWidth=4; ctx.stroke();
    if (estado>=4) { ctx.fillStyle=color; ctx.font='32px serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('✓',cx,cy); }
    t++; requestAnimationFrame(frame);
  }
  frame();
}

// ══════ SERVICIOS ══════
function renderServicios() {
  const grid = document.getElementById('serviciosGrid');
  if (!grid) return;
  grid.innerHTML = servicios.map((s,i) => `
    <div class="srv-card neb-reveal" style="transition-delay:${i*0.06}s">
      <span class="srv-icono">${s.icono}</span>
      <div class="srv-nombre">${s.nombre}</div>
      <div class="srv-desc">${s.desc}</div>
      <div class="srv-precio">${s.precio}</div>
      <div class="srv-unidad">${s.unidad}</div>
      <div class="srv-tiempo">⏱ ${s.tiempo}</div>
    </div>`).join('');
  setTimeout(()=>initReveal(),80);
}

// ══════ CALCULADORA DE PRECIO ══════
function cambiarKg(delta) {
  kgActual = Math.max(4, Math.min(30, kgActual + delta));
  setT('cpKg', kgActual);
  calcularPrecio();
}

function calcularPrecio() {
  const tarifa = parseInt(document.getElementById('cpTipo')?.value || 8000);
  const planch = document.getElementById('cpPlanchado')?.checked;
  const lavado = kgActual * tarifa;
  const planchado = planch ? kgActual * 3500 : 0;
  const dom = lavado + planchado >= 50000 ? 0 : 5000;
  const total = lavado + planchado + dom;

  setT('cprLavado', '$'+lavado.toLocaleString('es-CO'));
  setT('cprPlanchado', planch ? '$'+planchado.toLocaleString('es-CO') : '—');
  setT('cprDom', dom === 0 ? '¡GRATIS! 🎉' : '$'+dom.toLocaleString('es-CO'));
  setT('cprTotal', '$'+total.toLocaleString('es-CO'));
  // Sync resumen
  setT('drKg', kgActual+' kg');
  setT('drTipo', document.getElementById('cpTipo')?.options[document.getElementById('cpTipo')?.selectedIndex]?.text.split('(')[0].trim() || '—');
  setT('drPlanch', planch ? 'Sí' : 'No');
  setT('drTotal', '$'+total.toLocaleString('es-CO'));
}

// ══════ PAGO ══════
function selPago(method, el) {
  metodoPago = method;
  document.querySelectorAll('.ps-opt').forEach(o => o.classList.remove('activo'));
  el.classList.add('activo');
  document.querySelectorAll('[id^="psi-"]').forEach(i => {i.style.background='';i.style.boxShadow='';});
  const ind = document.getElementById('psi-'+method);
  if (ind) {ind.style.background='var(--azul-cl)';ind.style.boxShadow='0 0 8px rgba(74,154,255,0.5)';}
  const copy = document.getElementById('psCopy');
  const lbl = document.getElementById('psCopyLabel');
  if (method==='nequi'||method==='daviplata') {if(copy)copy.style.display='flex';if(lbl)lbl.textContent=method==='nequi'?'Número Nequi:':'Número Daviplata:';}
  else if(copy) copy.style.display='none';
  const msgs = {efectivo:'Paga en efectivo cuando lleguemos.',nequi:'Transfiere antes de la recogida.',daviplata:'Transfiere antes de la recogida.',transfer:'Te enviamos los datos bancarios.'};
  setT('psMsg', msgs[method]||'');
  setT('drPago', PAY_LABELS[method]);
  playBloop();
}

function copiarNum() {
  navigator.clipboard.writeText('3214567890').then(()=>showToast('📋 Número copiado')).catch(()=>showToast('Número: 321 456 7890'));
}

function confirmarDomicilio() {
  const nombre = document.getElementById('dNombre')?.value.trim();
  const tel = document.getElementById('dTelefono')?.value.trim();
  const dir = document.getElementById('dDir')?.value.trim();
  if (!nombre||!tel) {showToast('⚠️ Completa nombre y teléfono');return;}
  if (!dir) {showToast('📍 ¿A qué dirección vamos?');return;}
  if (!metodoPago) {showToast('💳 Elige cómo vas a pagar');return;}

  const tarifa=parseInt(document.getElementById('cpTipo')?.value||8000);
  const planch=document.getElementById('cpPlanchado')?.checked;
  const lavado=kgActual*tarifa, planchado=planch?kgActual*3500:0, dom=lavado+planchado>=50000?0:5000;

  document.getElementById('mnDetalle').innerHTML=`
    👤 <strong>${nombre}</strong><br/>
    📱 ${tel}<br/>
    📍 ${dir}<br/>
    🧺 ${kgActual} kg · Lavado ${document.getElementById('cpTipo')?.options[document.getElementById('cpTipo')?.selectedIndex]?.text.split('(')[0].trim()}<br/>
    ${planch?'👔 Con planchado<br/>':''} 
    💳 ${PAY_LABELS[metodoPago]}<br/>
    💰 Total estimado: <strong>$${(lavado+planchado+dom).toLocaleString('es-CO')}</strong> ${dom===0?'(domicilio gratis 🎉)':''}
  `;
  document.getElementById('modalDom').classList.add('open');
  playWin();
}

// ══════ TAMBOR DE TURNO ══════
const turnosEnCola = [12,15,18,21,24,27,30,33,36,42,45,48];

function initTambor() {
  const c = document.getElementById('tamborCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  drawTambor(ctx, c.width, c.height, 0, null);
}

function drawTambor(ctx, w, h, angle, ganador) {
  ctx.clearRect(0,0,w,h);
  const cx=w/2, cy=h/2, r=cx-8;
  const slice=(Math.PI*2)/turnosEnCola.length;
  turnosEnCola.forEach((num,i) => {
    const start=i*slice+angle, end=start+slice;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,start,end); ctx.closePath();
    const hue=(i/turnosEnCola.length)*240+180;
    ctx.fillStyle=`hsl(${hue},70%,${ganador===num?45:60}%)`; ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=2; ctx.stroke();
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(start+slice/2);
    ctx.textAlign='right'; ctx.fillStyle='white';
    ctx.font=`bold ${ganador===num?16:13}px DM Mono,monospace`;
    ctx.fillText('#'+num, r-10, 5);
    ctx.restore();
  });
  // Centro
  ctx.beginPath(); ctx.arc(cx,cy,22,0,Math.PI*2);
  ctx.fillStyle='white'; ctx.fill();
  ctx.strokeStyle='var(--azul)'; ctx.lineWidth=3; ctx.stroke();
  ctx.fillStyle='var(--azul)'; ctx.font='bold 14px Syne,sans-serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('N', cx, cy);
  // Flecha
  ctx.beginPath(); ctx.moveTo(cx,8); ctx.lineTo(cx-10,28); ctx.lineTo(cx+10,28); ctx.closePath();
  ctx.fillStyle='var(--azul)'; ctx.fill();
}

function abrirModalTurno() {
  const modal = document.getElementById('modalTurno');
  if (modal) modal.classList.add('open');
  document.getElementById('turnoResultado').style.display='none';
  document.getElementById('btnGirar').disabled=false;
  tamborAngle=0;
  const c=document.getElementById('tamborCanvas');
  if (c) drawTambor(c.getContext('2d'),c.width,c.height,0,null);
}

function girarTambor() {
  const nombre=document.getElementById('turnoNombre')?.value.trim();
  if (!nombre) {showToast('✏️ Escribe tu nombre primero');return;}
  if (tamborSpinning) return;
  tamborSpinning=true;
  document.getElementById('btnGirar').disabled=true;

  const c=document.getElementById('tamborCanvas');
  if (!c) return;
  const ctx=c.getContext('2d');
  const totalRot=(Math.PI*2)*(5+Math.random()*6)+Math.random()*Math.PI*2;
  const dur=3000+Math.random()*1500;
  const start=performance.now();
  const initAngle=tamborAngle;

  function easeOut(t){return 1-Math.pow(1-t,4);}

  function frame(ts) {
    const prog=Math.min((ts-start)/dur,1);
    tamborAngle=initAngle+totalRot*easeOut(prog);
    drawTambor(ctx,c.width,c.height,tamborAngle,null);
    if (prog<1) {requestAnimationFrame(frame);return;}
    // Ganador
    tamborSpinning=false;
    const slice=(Math.PI*2)/turnosEnCola.length;
    const norm=(Math.PI*3/2-tamborAngle%(Math.PI*2)+Math.PI*2)%(Math.PI*2);
    const idx=Math.floor(norm/slice)%turnosEnCola.length;
    turnoNumero=turnosEnCola[idx];
    drawTambor(ctx,c.width,c.height,tamborAngle,turnoNumero);
    setT('trNumero','#'+turnoNumero);
    const espera=turnosEnCola.indexOf(turnoNumero)*3;
    setT('trEspera','Espera aproximada: '+espera+' min');
    document.getElementById('turnoResultado').style.display='block';
    document.getElementById('nnTurno').innerHTML=`🎫 Turno: <span id="turnoActual">#${turnoNumero}</span>`;
    playWin();
  }
  requestAnimationFrame(frame);
  playSpinSnd();
}

function cerrarModal(id) {
  document.getElementById(id)?.classList.remove('open');
}
function cerrarModalPedido() { cerrarModal('modalDom'); }

// ══════ NAV / REVEAL ══════
function initNav() {
  window.addEventListener('scroll',()=>{
    document.getElementById('navNebulosa')?.classList.add('visible');
    document.getElementById('navNebulosa')?.classList.toggle('scrolled',window.scrollY>60);
  });
  setTimeout(()=>document.getElementById('navNebulosa')?.classList.add('visible'),100);
  document.getElementById('nnHam')?.addEventListener('click',()=>document.getElementById('nnMob').classList.toggle('open'));
}
function closeMob(){document.getElementById('nnMob').classList.remove('open');}

function initReveal(){
  const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vis');});},{threshold:0.1});
  document.querySelectorAll('.neb-reveal').forEach(el=>obs.observe(el));
}

function animCounters(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      const el=e.target,target=parseInt(el.dataset.target);
      let cur=0;const step=Math.ceil(target/60);
      const iv=setInterval(()=>{cur=Math.min(cur+step,target);el.textContent=cur.toLocaleString('es-CO');if(cur>=target)clearInterval(iv);},25);
      obs.unobserve(el);
    });
  },{threshold:0.3});
  document.querySelectorAll('[data-target]').forEach(el=>obs.observe(el));
}

function updateHorario(){
  const h=new Date().getHours();
  const el=document.getElementById('hthEstado');
  if(!el)return;
  const abierto=h>=7&&h<19;
  el.textContent=abierto?'● Abierto ahora':'○ Cerrado ahora';
  el.style.color=abierto?'var(--verde)':'var(--gris)';
}

// ══════ AUDIO ══════
let audioCtx=null;
function getCtx(){if(!audioCtx){try{audioCtx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){return null;}}return audioCtx;}
function playBloop(){
  const ctx=getCtx();if(!ctx)return;
  const o=ctx.createOscillator(),g=ctx.createGain();
  o.connect(g);g.connect(ctx.destination);
  o.type='sine';o.frequency.value=523;
  g.gain.setValueAtTime(0.05,ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.15);
  o.start();o.stop(ctx.currentTime+0.18);
}
function playWin(){
  const ctx=getCtx();if(!ctx)return;
  [523,659,784,1047].forEach((f,i)=>{
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.connect(g);g.connect(ctx.destination);
    o.type='sine';o.frequency.value=f;
    g.gain.setValueAtTime(0.06,ctx.currentTime+i*0.1);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+i*0.1+0.4);
    o.start(ctx.currentTime+i*0.1);o.stop(ctx.currentTime+i*0.1+0.5);
  });
}
function playSpinSnd(){
  const ctx=getCtx();if(!ctx)return;
  const o=ctx.createOscillator(),g=ctx.createGain();
  o.connect(g);g.connect(ctx.destination);
  o.type='sawtooth';
  o.frequency.setValueAtTime(400,ctx.currentTime);
  o.frequency.exponentialRampToValueAtTime(80,ctx.currentTime+3.5);
  g.gain.setValueAtTime(0.04,ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+3.8);
  o.start();o.stop(ctx.currentTime+4);
}

// ══════ UTILS ══════
function setT(id,v){const el=document.getElementById(id);if(el)el.textContent=v;}
function showToast(msg){
  const t=document.createElement('div');
  t.style.cssText=`position:fixed;bottom:24px;right:24px;background:var(--azul);color:white;font-family:'Space Grotesk',sans-serif;font-size:0.85rem;padding:12px 18px;z-index:9999;border-radius:10px;box-shadow:0 6px 20px rgba(26,122,255,0.3);max-width:280px`;
  t.textContent=msg;document.body.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transition='opacity 0.4s';},2300);
  setTimeout(()=>t.remove(),2800);
}
