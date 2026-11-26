// Utilidades para las pruebas: levanta TU API tal como lo haría `npm start`,
// espera a que responda y la apaga al final.
// No necesitas modificar este archivo.

const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

// 3000 por defecto. PUERTO_PRUEBAS permite otro puerto, pero solo funciona
// si tu server.js usa process.env.PORT (como en la Parte 3).
const PUERTO = Number(process.env.PUERTO_PRUEBAS ?? 3000);
const BASE = `http://127.0.0.1:${PUERTO}`;
const RAIZ = process.cwd();

let proceso = null;
let salida = '';

const esperar = ms => new Promise(r => setTimeout(r, ms));

async function respondeAlguien() {
  try {
    await fetch(BASE, { signal: AbortSignal.timeout(500) });
    return true;
  } catch {
    return false;
  }
}

// Lee el script "start" de package.json. Debe ser: node <archivo>
function archivoDeEntrada() {
  const pkg = JSON.parse(fs.readFileSync(path.join(RAIZ, 'package.json'), 'utf8'));
  const start = pkg.scripts?.start ?? '';
  const coincide = start.match(/^node\s+(?:--[\w-]+\s+)*([^\s]+)$/);
  if (!coincide) {
    throw new Error(
      `El script "start" de package.json debe ser "node <archivo>" y es: "${start}". Revisa el Paso 0.1.`
    );
  }
  return coincide[1];
}

async function iniciar() {
  if (await respondeAlguien()) {
    throw new Error(
      `Ya hay un servidor en el puerto ${PUERTO}. Detén "npm run dev" (Ctrl + C) antes de correr "npm test".`
    );
  }

  const archivo = archivoDeEntrada();
  salida = '';
  proceso = spawn(process.execPath, ['--no-warnings', archivo], {
    cwd: RAIZ,
    env: { ...process.env, PORT: String(PUERTO) },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  proceso.stdout.on('data', d => (salida += d));
  proceso.stderr.on('data', d => (salida += d));

  const limite = Date.now() + 10_000;
  while (Date.now() < limite) {
    if (proceso.exitCode !== null) {
      throw new Error(
        `"npm start" (node ${archivo}) terminó sin dejar la API escuchando en el puerto ${PUERTO}.\n` +
          `¿El script "start" apunta al servidor? (Paso 0.1)\nSalida del proceso:\n${salida}`
      );
    }
    if (await respondeAlguien()) return;
    await esperar(200);
  }
  throw new Error(`La API no respondió en 10 segundos en ${BASE}.\nSalida:\n${salida}`);
}

async function detener() {
  if (proceso && proceso.exitCode === null) {
    proceso.kill();
    await new Promise(r => proceso.once('exit', r));
  }
  proceso = null;
}

// Hace una petición y devuelve { status, body, headers }.
// body es el JSON parseado (o el texto, si la respuesta no es JSON).
async function pedir(metodo, ruta, cuerpo) {
  const opciones = { method: metodo, headers: {} };
  if (cuerpo !== undefined) {
    opciones.headers['Content-Type'] = 'application/json';
    opciones.body = JSON.stringify(cuerpo);
  }
  const res = await fetch(BASE + ruta, opciones);
  const texto = await res.text();
  let body = texto;
  try {
    body = texto ? JSON.parse(texto) : null;
  } catch {
    // no era JSON: se deja como texto
  }
  return { status: res.status, body, headers: res.headers };
}

module.exports = { iniciar, detener, pedir, RAIZ };
