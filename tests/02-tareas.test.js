// Parte 1: CRUD de /tareas (README, sección 5).
// Cada prueba crea sus propios datos: no depende de las tareas de ejemplo.
const { describe, test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { iniciar, detener, pedir } = require('./helpers/servidor');

const crearTarea = titulo => pedir('POST', '/tareas', { titulo });

describe('Parte 1: API de tareas', () => {
  before(iniciar);
  after(detener);

  test('POST /tareas crea una tarea → 201 con id, titulo y completada=false', async () => {
    const { status, body } = await crearTarea('Probar POST');
    assert.equal(status, 201);
    assert.ok(body.id !== undefined, 'La tarea creada debe tener id');
    assert.equal(body.titulo, 'Probar POST');
    assert.equal(body.completada, false);
  });

  test('POST /tareas sin titulo → 400', async () => {
    const { status } = await pedir('POST', '/tareas', {});
    assert.equal(status, 400);
  });

  test('GET /tareas incluye la tarea creada', async () => {
    const { body: creada } = await crearTarea('Aparecer en la lista');
    const { status, body } = await pedir('GET', '/tareas');
    assert.equal(status, 200);
    assert.ok(body.some(t => t.id === creada.id), 'La tarea creada no aparece en GET /tareas');
  });

  test('GET /tareas/:id devuelve la tarea → 200', async () => {
    const { body: creada } = await crearTarea('Buscar por id');
    const { status, body } = await pedir('GET', `/tareas/${creada.id}`);
    assert.equal(status, 200);
    assert.equal(body.id, creada.id);
    assert.equal(body.titulo, 'Buscar por id');
  });

  test('GET /tareas/:id inexistente → 404', async () => {
    const { status } = await pedir('GET', '/tareas/999999');
    assert.equal(status, 404);
  });

  test('PUT /tareas/:id actualiza completada → 200', async () => {
    const { body: creada } = await crearTarea('Completar');
    const { status, body } = await pedir('PUT', `/tareas/${creada.id}`, { completada: true });
    assert.equal(status, 200);
    assert.equal(body.completada, true);
    assert.equal(body.titulo, 'Completar', 'PUT no debe borrar el título si no se envía');
  });

  test('PUT /tareas/:id inexistente → 404', async () => {
    const { status } = await pedir('PUT', '/tareas/999999', { titulo: 'Nada' });
    assert.equal(status, 404);
  });

  test('DELETE /tareas/:id → 204 y luego GET → 404', async () => {
    const { body: creada } = await crearTarea('Eliminar');
    const borrado = await pedir('DELETE', `/tareas/${creada.id}`);
    assert.equal(borrado.status, 204);
    const { status } = await pedir('GET', `/tareas/${creada.id}`);
    assert.equal(status, 404);
  });

  test('DELETE /tareas/:id inexistente → 404', async () => {
    const { status } = await pedir('DELETE', '/tareas/999999');
    assert.equal(status, 404);
  });
});
