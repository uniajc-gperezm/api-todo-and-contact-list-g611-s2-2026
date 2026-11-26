// Parte 2: CRUD de /contactos (README, sección 6).
const { describe, test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { iniciar, detener, pedir } = require('./helpers/servidor');

const contactoValido = (extra = {}) => ({
  nombre: 'Prueba',
  apellido: 'Automática',
  telefono: '3001234567',
  email: 'prueba@correo.com',
  ciudad: 'Cali',
  ...extra
});

const crearContacto = datos => pedir('POST', '/contactos', datos);

describe('Parte 2: API de contactos', () => {
  before(iniciar);
  after(detener);

  test('GET /contactos responde un arreglo con al menos 3 contactos de ejemplo', async () => {
    const { status, body } = await pedir('GET', '/contactos');
    assert.equal(status, 200);
    assert.ok(Array.isArray(body), 'GET /contactos debe responder un arreglo');
    assert.ok(body.length >= 3, 'Arranca con al menos 3 contactos de ejemplo');
  });

  test('POST /contactos crea un contacto → 201 con id y los campos enviados', async () => {
    const datos = contactoValido();
    const { status, body } = await crearContacto(datos);
    assert.equal(status, 201);
    assert.ok(body.id !== undefined, 'El contacto creado debe tener id');
    for (const campo of ['nombre', 'apellido', 'telefono', 'email', 'ciudad']) {
      assert.equal(body[campo], datos[campo], `El campo "${campo}" no coincide`);
    }
  });

  test('POST /contactos sin nombre → 400', async () => {
    const { status } = await crearContacto(contactoValido({ nombre: undefined }));
    assert.equal(status, 400);
  });

  test('POST /contactos sin telefono → 400', async () => {
    const { status } = await crearContacto(contactoValido({ telefono: undefined }));
    assert.equal(status, 400);
  });

  test('POST /contactos con telefono inválido ("12") → 400', async () => {
    const { status } = await crearContacto(contactoValido({ telefono: '12' }));
    assert.equal(status, 400);
  });

  test('GET /contactos/:id → 200 y GET de uno inexistente → 404', async () => {
    const { body: creado } = await crearContacto(contactoValido({ nombre: 'Buscar' }));
    const encontrado = await pedir('GET', `/contactos/${creado.id}`);
    assert.equal(encontrado.status, 200);
    assert.equal(encontrado.body.nombre, 'Buscar');
    const { status } = await pedir('GET', '/contactos/999999');
    assert.equal(status, 404);
  });

  test('PUT /contactos/:id actualiza → 200', async () => {
    const { body: creado } = await crearContacto(contactoValido());
    const cambios = contactoValido({ ciudad: 'Palmira', telefono: '3109876543' });
    const { status, body } = await pedir('PUT', `/contactos/${creado.id}`, cambios);
    assert.equal(status, 200);
    assert.equal(body.ciudad, 'Palmira');
    assert.equal(body.telefono, '3109876543');
  });

  test('PUT /contactos/:id inexistente → 404', async () => {
    const { status } = await pedir('PUT', '/contactos/999999', contactoValido());
    assert.equal(status, 404);
  });

  test('DELETE /contactos/:id → 204 y luego GET → 404', async () => {
    const { body: creado } = await crearContacto(contactoValido());
    const borrado = await pedir('DELETE', `/contactos/${creado.id}`);
    assert.equal(borrado.status, 204);
    const { status } = await pedir('GET', `/contactos/${creado.id}`);
    assert.equal(status, 404);
  });

  test('DELETE /contactos/:id inexistente → 404', async () => {
    const { status } = await pedir('DELETE', '/contactos/999999');
    assert.equal(status, 404);
  });
});
