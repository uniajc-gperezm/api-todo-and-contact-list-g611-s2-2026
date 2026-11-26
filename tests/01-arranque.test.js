// Paso 0: el proyecto arranca con `npm start` y un POST sin body no rompe la API.
const { describe, test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { iniciar, detener, pedir } = require('./helpers/servidor');

describe('Paso 0: arranque', () => {
  before(iniciar);
  after(detener);

  test('npm start levanta la API y GET /tareas responde un arreglo', async () => {
    const { status, body } = await pedir('GET', '/tareas');
    assert.equal(status, 200);
    assert.ok(Array.isArray(body), 'GET /tareas debe responder un arreglo JSON');
  });

  test('POST /tareas sin body responde 400 (no 500)', async () => {
    const { status } = await pedir('POST', '/tareas');
    assert.equal(status, 400, 'Revisa el Paso 0.2: usa req.body ?? {}');
  });
});
