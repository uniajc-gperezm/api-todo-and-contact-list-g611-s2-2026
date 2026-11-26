// Parte 3 y entregables: estructura del proyecto (README, secciones 7, 8 y 11).
// Estas pruebas no levantan el servidor: revisan archivos.
const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { RAIZ } = require('./helpers/servidor');

const existe = ruta => fs.existsSync(path.join(RAIZ, ruta));
const leer = ruta => fs.readFileSync(path.join(RAIZ, ruta), 'utf8');

describe('Parte 3: estructura y entregables', () => {
  for (const recurso of ['tareas', 'contactos']) {
    const singular = recurso === 'tareas' ? 'tarea' : 'contacto';

    test(`existen ruta, controlador y modelo de ${recurso}`, () => {
      for (const archivo of [
        `src/routes/${recurso}.routes.js`,
        `src/controllers/${recurso}.controller.js`,
        `src/models/${singular}.model.js`
      ]) {
        assert.ok(existe(archivo), `Falta el archivo ${archivo}`);
      }
    });

    test(`el controlador de ${recurso} usa el modelo`, () => {
      const archivo = `src/controllers/${recurso}.controller.js`;
      if (!existe(archivo)) assert.fail(`Falta el archivo ${archivo}`);
      assert.match(
        leer(archivo),
        new RegExp(`require\\(['"]\\.\\./models/${singular}\\.model(\\.js)?['"]\\)`),
        'El controlador debe importar su modelo con require(\'../models/...\')'
      );
    });
  }

  test('api.http existe y tiene pruebas de tareas y de contactos', () => {
    assert.ok(existe('api.http'), 'Falta api.http en la raíz del proyecto');
    const contenido = leer('api.http');
    assert.match(contenido, /\/tareas/, 'api.http no tiene peticiones a /tareas');
    assert.match(contenido, /\/contactos/, 'api.http no tiene peticiones a /contactos');
  });

  test('node_modules no está en el repositorio (.gitignore)', () => {
    assert.ok(existe('.gitignore'), 'Falta .gitignore');
    assert.match(leer('.gitignore'), /node_modules/, '.gitignore debe ignorar node_modules');
  });
});
