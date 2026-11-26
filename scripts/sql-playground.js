// Playground de SQL: ejecuta un archivo .sql contra una base de datos SQLite
// en memoria y muestra el resultado de cada sentencia.
//
// Uso:  npm run sql                      (ejecuta docs/sql/practica.sql)
//       npm run sql -- otro-archivo.sql
//
// Cada ejecución empieza con una base de datos VACÍA: puedes correrlo las
// veces que quieras sin dañar nada.
// Regla: termina cada sentencia con ; al final de la línea.

const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const archivo = process.argv[2] ?? path.join('docs', 'sql', 'practica.sql');
const sql = fs.readFileSync(archivo, 'utf8');

// Quita el comentario (--) de una línea, sin tocar un -- que esté dentro de
// un texto entre comillas simples, como 'a--b'.
function sinComentario(linea) {
  let enTexto = false;
  for (let i = 0; i < linea.length; i++) {
    if (linea[i] === "'") enTexto = !enTexto;
    else if (!enTexto && linea[i] === '-' && linea[i + 1] === '-') return linea.slice(0, i);
  }
  return linea;
}

// Quita los comentarios y separa por ; al final de línea
const sentencias = sql
  .split(/\r?\n/)
  .map(sinComentario)
  .join('\n')
  .split(/;\s*(?:\n|$)/)
  .map(s => s.trim())
  .filter(Boolean);

const db = new DatabaseSync(':memory:');

console.log(`\nEjecutando ${archivo} (${sentencias.length} sentencias)\n`);

for (const [i, sentencia] of sentencias.entries()) {
  const resumen = sentencia.replace(/\s+/g, ' ');
  console.log(`▶ [${i + 1}] ${resumen.length > 90 ? resumen.slice(0, 87) + '...' : resumen}`);
  try {
    const stmt = db.prepare(sentencia);
    if (/^(select|with|pragma)\b/i.test(sentencia)) {
      const filas = stmt.all();
      if (filas.length === 0) console.log('  (0 filas)');
      else console.table(filas.map(f => ({ ...f })));
    } else {
      const { changes } = stmt.run();
      console.log(`  ✔ OK (${changes} fila(s) afectada(s))`);
    }
  } catch (error) {
    console.log(`  ✖ ERROR: ${error.message}`);
  }
  console.log();
}
