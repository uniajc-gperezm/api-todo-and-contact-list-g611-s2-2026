# Práctica: API REST de Tareas y Contactos con Node.js + Express

**Fundamentos Web · Grupo 611 · UNIAJC · Semestre 2-2026**

> **Sesión del 26 de noviembre — trabajo autónomo.** El docente no estará en clase ese día. Esta guía está escrita para que avances solo/a (o en pareja) a tu ritmo.
> La **conexión a base de datos NO se hace en esta sesión**: la haremos juntos en clase. Hoy dejas la API funcionando **en memoria** y **bien organizada**, lista para conectarla a la BD.

---

## Contenido

1. [¿Qué vas a construir?](#1-qué-vas-a-construir)
2. [Material de apoyo (míralo primero)](#2-material-de-apoyo-míralo-primero)
3. [Preparar el proyecto](#3-preparar-el-proyecto)
4. [Paso 0 — Dos errores del repo base que debes corregir](#4-paso-0--dos-errores-del-repo-base-que-debes-corregir)
5. [Parte 1 — Completar la API de Tareas](#5-parte-1--completar-la-api-de-tareas)
6. [Parte 2 — Construir la API de Contactos desde cero](#6-parte-2--construir-la-api-de-contactos-desde-cero)
7. [Parte 3 — Organizar el código: rutas, controladores y modelos](#7-parte-3--organizar-el-código-rutas-controladores-y-modelos)
8. [Cómo probar tu API](#8-cómo-probar-tu-api)
9. [Parte 4 — Base de datos (se hace EN CLASE)](#9-parte-4--base-de-datos-se-hace-en-clase)
10. [Retos opcionales](#10-retos-opcionales)
11. [Entrega y criterios de evaluación](#11-entrega-y-criterios-de-evaluación)
12. [Errores comunes](#12-errores-comunes)

---

## 1. ¿Qué vas a construir?

Una API REST con **dos recursos**: `tareas` (todo list) y `contactos` (contact list). Ya hiciste estas dos apps en el frontend guardando los datos en el navegador (`localStorage`); ahora los datos vivirán en un **servidor** y cualquier cliente (navegador, Postman, otra app) podrá consultarlos por HTTP.

```
 Cliente (navegador / Thunder Client / REST Client)
        │   GET /tareas        POST /contactos   ...
        ▼
 ┌──────────────────────────────┐
 │  Servidor Express (Node.js)  │
 │   rutas → controladores →    │
 │   modelos (datos en memoria) │  ← en clase cambiaremos esto por una BD
 └──────────────────────────────┘
```

Al terminar deberías poder explicar:

- Qué es una API REST y por qué las URLs son **sustantivos en plural** (`/tareas`, `/contactos`) y la acción la da el **verbo HTTP** (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
- Qué son `req.params`, `req.body` y `req.query`.
- Qué **código de estado** devolver en cada caso (200, 201, 204, 400, 404).
- Por qué separamos el código en **rutas, controladores y modelos**, y por qué eso hace fácil conectar una base de datos después.

---

## 2. Material de apoyo (míralo primero)

| Recurso | Qué tomar de ahí |
| --- | --- |
| 🎥 [midudev — *Creamos una API desde cero* (clase 2)](https://www.youtube.com/watch?v=YmZE1HXjpd4) | **Obligatorio.** Servidor HTTP nativo → Express, `express.json()`, rutas, `req.body`, códigos de estado y probar con un archivo `.http`. |
| 📁 [midudev/curso-node-js](https://github.com/midudev/curso-node-js) | Código de cada clase. Mira `clase-2` (Express básico), `clase-3` (API de películas con CRUD) y `clase-4` (arquitectura con `routes/`, `controllers/`, `models/`). La `clase-5` es base de datos: **déjala para la clase presencial**. |
| 📁 [uniajc-gperezm/newspaper-api](https://github.com/uniajc-gperezm/newspaper-api) | Ejemplo guía de la materia. Lee `1_DOCUMENTACION.md` (qué es una API, REST, verbos HTTP), revisa `crud-api/app.js` (CRUD completo en memoria) y la **sección 2 de `2_GUIA_AVANZADA.md`** (separar rutas y controladores). `3_GUIA_SQLITE.md` es lo que veremos en clase. |
| 📁 [uniajc-gperezm/contact-list-server](https://github.com/uniajc-gperezm/contact-list-server) | Una API de contactos ya hecha con Express, del semestre anterior. Úsala como referencia de validación de campos, **no la copies**: tu versión debe seguir la estructura de esta guía. |
| 📄 [Express 5 — Guía de rutas](https://expressjs.com/es/guide/routing.html) | Documentación oficial: `app.get`, `app.post`, `express.Router()`. |
| 📄 [MDN — Códigos de estado HTTP](https://developer.mozilla.org/es/docs/Web/HTTP/Status) | Referencia para elegir el código correcto. |

> **Ojo con las versiones:** este repo usa **Express 5** (`"express": "^5.x"`). El curso de midudev y `newspaper-api` usan Express 4. Para lo que hacemos aquí funcionan igual, **excepto** por el detalle del Paso 0.2.

---

## 3. Preparar el proyecto

**Requisitos:** Node.js 20 o superior (`node -v`), Git y VS Code.

1. Haz un **fork** de este repositorio a tu cuenta de GitHub (botón *Fork*, arriba a la derecha).
2. Clona **tu fork** (no el del docente):

   ```bash
   git clone https://github.com/TU_USUARIO/api-todo-and-contact-list-g611-s2-2026.git
   cd api-todo-and-contact-list-g611-s2-2026
   ```

3. Instala las dependencias (crea la carpeta `node_modules`, que **no** se sube a GitHub gracias al `.gitignore`):

   ```bash
   npm install
   ```

4. Levanta el servidor en modo desarrollo (con `nodemon`, que lo reinicia solo cada vez que guardas):

   ```bash
   npm run dev
   ```

5. Abre <http://localhost:3000/tareas> en el navegador. Deberías ver las 3 tareas de ejemplo en JSON.

### ¿Qué trae el repo?

```
.
├── package.json      → dependencias (express) y scripts (start, dev)
└── src/
    ├── index.js      → un "Hola mundo" de la clase anterior (no es la API)
    └── server.js     → la API de tareas: GET y POST funcionan; PUT y DELETE están comentados
```

---

## 4. Paso 0 — Dos errores del repo base que debes corregir

Antes de programar, arregla esto. Son errores reales que te vas a encontrar en cualquier proyecto.

### 0.1 `npm start` no arranca la API

Prueba `npm start`: imprime *"Hola mundo desde Node.js…"* y termina. ¿Por qué? Abre `package.json`:

```json
"start": "node src/index.js",
"dev": "nodemon src/server.js"
```

`start` apunta al archivo equivocado. Corrígelo para que ambos scripts ejecuten **el mismo** archivo de entrada:

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

Aprovecha y cambia `"main": "index.js"` por `"main": "src/server.js"`.

> 💡 `npm start` es lo que ejecuta un servidor en producción (Render, Railway, etc.). Si apunta al archivo equivocado, tu API nunca se despliega.

### 0.2 Un `POST` sin cuerpo tumba la ruta

Con el servidor corriendo, envía un `POST /tareas` **sin** body (en la sección 8 ves cómo). Respuesta: un `500` con

```
TypeError: Cannot destructure property 'titulo' of 'req.body' as it is undefined.
```

**Por qué:** en **Express 5**, si la petición no trae JSON, `req.body` queda en `undefined` (en Express 4 era `{}`). Y `const { titulo } = undefined` explota.

**Arreglo:** usa un valor por defecto al desestructurar:

```js
const { titulo } = req.body ?? {};
```

Ahora la misma petición debe responder `400 { "error": "El título es obligatorio" }`. **Aplica este patrón en todas las rutas que lean `req.body`.**

Haz un commit con estos dos arreglos:

```bash
git add .
git commit -m "fix: npm start apunta a server.js y req.body vacío no rompe POST"
```

---

## 5. Parte 1 — Completar la API de Tareas

Recurso: **tarea**

```json
{ "id": 1, "titulo": "Aprender Express", "completada": false }
```

### Endpoints que debe tener

| Verbo | Ruta | Qué hace | Respuesta OK | Errores |
| --- | --- | --- | --- | --- |
| `GET` | `/tareas` | Lista todas las tareas | `200` + arreglo | — |
| `GET` | `/tareas/:id` | Una tarea por id | `200` + objeto | `404` si no existe |
| `POST` | `/tareas` | Crea una tarea | `201` + tarea creada | `400` si falta `titulo` |
| `PUT` | `/tareas/:id` | Actualiza `titulo` y/o `completada` | `200` + tarea actualizada | `404` / `400` |
| `DELETE` | `/tareas/:id` | Elimina la tarea | `204` sin cuerpo | `404` si no existe |

`GET /tareas` y `POST /tareas` ya existen. Te faltan **3**.

### 1.1 `GET /tareas/:id` (nuevo)

`:id` es un **parámetro de ruta**: lo lees con `req.params.id`. Llega siempre como **texto**, y en el arreglo los ids son **números**: conviértelo antes de comparar.

```js
app.get('/tareas/:id', (req, res) => {
  const id = Number(req.params.id);
  const tarea = tareas.find(t => t.id === id);

  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  res.json(tarea);
});
```

Pruébalo: `/tareas/1` → la tarea; `/tareas/999` → `404`.

### 1.2 `PUT /tareas/:id` y 1.3 `DELETE /tareas/:id`

Ya están escritos en `src/server.js`, pero **comentados**. Descoméntalos y antes de seguir **lee cada línea** y responde (escríbelo como comentario en el código):

- ¿Qué hace el operador `??` en `req.body.titulo ?? tarea.titulo`? ¿Qué pasaría si usaras `||` y envías `"completada": false`?
- ¿Por qué `DELETE` responde `204` y no `200`? ¿Por qué `res.status(204).send()` no lleva JSON?
- ¿Qué hace `splice(indice, 1)`?

Después **mejóralos**:

- Aplica `req.body ?? {}` (Paso 0.2).
- **Valida** en el `PUT`: si envían `titulo`, no puede ser un texto vacío; si envían `completada`, debe ser booleano (`typeof completada === 'boolean'`). Si no cumple → `400`.

> **Reto (+):** agrega `PATCH /tareas/:id/completar`, que solo cambia `completada` a `true`. Pregunta para tu informe: ¿en qué se diferencian `PUT` y `PATCH`?

Commit: `git commit -m "feat(tareas): GET por id, PUT y DELETE con validaciones"`

---

## 6. Parte 2 — Construir la API de Contactos desde cero

Ahora tú solo/a. Aplica lo mismo que hiciste con tareas a un nuevo recurso.

Recurso: **contacto**

```json
{
  "id": 1,
  "nombre": "Ana",
  "apellido": "Gómez",
  "telefono": "3001234567",
  "email": "ana@correo.com",
  "ciudad": "Cali"
}
```

### Endpoints

| Verbo | Ruta | Qué hace | Respuesta OK | Errores |
| --- | --- | --- | --- | --- |
| `GET` | `/contactos` | Lista todos | `200` | — |
| `GET` | `/contactos/:id` | Uno por id | `200` | `404` |
| `POST` | `/contactos` | Crea uno | `201` | `400` |
| `PUT` | `/contactos/:id` | Actualiza | `200` | `404` / `400` |
| `DELETE` | `/contactos/:id` | Elimina | `204` | `404` |

### Reglas de validación

- `nombre` y `telefono` son **obligatorios** → si faltan, `400` con un mensaje que diga **qué** campo falta.
- `telefono`: solo dígitos, entre 7 y 10 (pista: `/^\d{7,10}$/.test(telefono)`).
- `email` es opcional, pero si viene debe contener `@`.
- `apellido` y `ciudad` son opcionales.
- El `id` lo genera **el servidor**, nunca el cliente. Si el cliente manda un `id` en el body, ignóralo.

Arranca el arreglo con **al menos 3 contactos** de ejemplo (inventados, no datos reales de personas).

Commit: `git commit -m "feat(contactos): CRUD completo con validaciones"`

---

## 7. Parte 3 — Organizar el código: rutas, controladores y modelos

A estas alturas `server.js` tiene más de 150 líneas y mezcla todo. Vamos a separarlo como en un proyecto profesional — es la misma arquitectura de la **clase 4 de midudev** y de la **sección 2 de `2_GUIA_AVANZADA.md`** de newspaper-api, con una capa extra: el **modelo**.

### Estructura objetivo

```
src/
├── server.js                       → crea la app, middlewares y monta las rutas
├── routes/
│   ├── tareas.routes.js            → URL + verbo  →  función del controlador
│   └── contactos.routes.js
├── controllers/
│   ├── tareas.controller.js        → lee req, valida, responde con res
│   └── contactos.controller.js
└── models/
    ├── tarea.model.js              → ÚNICO lugar que toca los datos
    └── contacto.model.js
```

| Capa | Responsabilidad | No debe… |
| --- | --- | --- |
| **Ruta** | Decir qué función atiende cada `verbo + URL`. | …tener lógica. |
| **Controlador** | Leer `req`, validar, llamar al modelo, elegir el código de estado. | …saber dónde se guardan los datos. |
| **Modelo** | Leer y escribir los datos (hoy un arreglo, en clase una BD). | …conocer `req` ni `res`. |

> **¿Por qué el modelo?** Porque en la clase de base de datos **solo cambiaremos los archivos de `models/`**. Rutas y controladores quedarán intactos. Si hoy mezclas `tareas.push(...)` dentro del controlador, en clase te tocará reescribir todo.

### Ejemplo completo con tareas

Úsalo de plantilla y **replícalo tú para contactos**.

**`src/models/tarea.model.js`**

```js
// Datos en memoria: se pierden al reiniciar el servidor.
// En la clase de BD reemplazaremos este arreglo por consultas SQL.
let tareas = [
  { id: 1, titulo: 'Aprender Express', completada: false },
  { id: 2, titulo: 'Crear una API REST', completada: false },
  { id: 3, titulo: 'Probar la API', completada: false }
];
let siguienteId = 4;

// Las funciones son async a propósito: una BD responde con promesas,
// así que cuando la conectemos el controlador no tendrá que cambiar.
async function obtenerTodas() {
  return tareas;
}

async function obtenerPorId(id) {
  return tareas.find(t => t.id === id) ?? null;
}

async function crear({ titulo }) {
  const nueva = { id: siguienteId++, titulo, completada: false };
  tareas.push(nueva);
  return nueva;
}

// TODO: actualizar(id, cambios) → devuelve la tarea actualizada o null si no existe
// TODO: eliminar(id)            → devuelve true si la eliminó, false si no existía

module.exports = { obtenerTodas, obtenerPorId, crear };
```

**`src/controllers/tareas.controller.js`**

```js
const Tarea = require('../models/tarea.model');

async function listar(req, res) {
  const tareas = await Tarea.obtenerTodas();
  res.json(tareas);
}

async function obtener(req, res) {
  const tarea = await Tarea.obtenerPorId(Number(req.params.id));
  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  res.json(tarea);
}

async function crear(req, res) {
  const { titulo } = req.body ?? {};
  if (!titulo || !titulo.trim()) {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }
  const nueva = await Tarea.crear({ titulo: titulo.trim() });
  res.status(201).json(nueva);
}

// TODO: actualizar(req, res) y eliminar(req, res)

module.exports = { listar, obtener, crear };
```

**`src/routes/tareas.routes.js`**

```js
const { Router } = require('express');
const controller = require('../controllers/tareas.controller');

const router = Router();

// Las rutas son relativas: el prefijo /tareas se pone en server.js
router.get('/', controller.listar);
router.get('/:id', controller.obtener);
router.post('/', controller.crear);
// router.put('/:id', controller.actualizar);    ← descomenta cuando exista
// router.delete('/:id', controller.eliminar);   ← descomenta cuando exista

module.exports = router;
```

> ⚠️ Si dejas activa una ruta cuyo controlador todavía no existe (`controller.actualizar` es `undefined`), el servidor **no arranca**. Por eso están comentadas.

**`src/server.js`** (queda así de corto)

```js
const express = require('express');
const tareasRoutes = require('./routes/tareas.routes');
// const contactosRoutes = require('./routes/contactos.routes');

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API de Tareas y Contactos — Fundamentos Web 611');
});

app.use('/tareas', tareasRoutes);
// app.use('/contactos', contactosRoutes);

// Cualquier ruta que no exista → 404 en JSON (va de ÚLTIMA)
app.use((req, res) => {
  res.status(404).json({ error: `No existe la ruta ${req.method} ${req.originalUrl}` });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
```

**Verificación:** después de refactorizar, **todas** las peticiones de la sección 8 deben dar exactamente el mismo resultado que antes. Si algo cambió, el refactor tiene un error.

Commit: `git commit -m "refactor: separar rutas, controladores y modelos"`

---

## 8. Cómo probar tu API

El navegador solo hace `GET` desde la barra de direcciones. Para `POST`, `PUT` y `DELETE` usa una de estas opciones:

**Opción A — REST Client (la que usa midudev en el video).** Instala la extensión *REST Client* en VS Code y crea en la raíz del proyecto un archivo `api.http`. Cada bloque tiene un botón *Send Request*. **Este archivo es parte de la entrega.**

```http
### Listar tareas
GET http://localhost:3000/tareas

### Una tarea
GET http://localhost:3000/tareas/1

### Tarea que no existe → 404
GET http://localhost:3000/tareas/999

### Crear tarea
POST http://localhost:3000/tareas
Content-Type: application/json

{
  "titulo": "Estudiar códigos de estado HTTP"
}

### Crear tarea sin título → 400
POST http://localhost:3000/tareas
Content-Type: application/json

{}

### POST sin body (Paso 0.2) → 400, no 500
POST http://localhost:3000/tareas

### Marcar como completada
PUT http://localhost:3000/tareas/1
Content-Type: application/json

{
  "completada": true
}

### Eliminar → 204
DELETE http://localhost:3000/tareas/2

### Ruta inexistente → 404 en JSON
GET http://localhost:3000/no-existe
```

Agrega tú los bloques de **contactos**, incluyendo **al menos un caso de error por endpoint** (teléfono inválido, contacto inexistente, etc.).

**Opción B — Thunder Client** (extensión de VS Code) o **Postman**. Mismas peticiones, con interfaz gráfica.

### Chuleta de códigos de estado

| Código | Nombre | Cuándo |
| --- | --- | --- |
| `200` | OK | Lectura o actualización exitosa |
| `201` | Created | Se creó un recurso (`POST`) |
| `204` | No Content | Se eliminó y no hay nada que devolver |
| `400` | Bad Request | El cliente envió datos inválidos o incompletos |
| `404` | Not Found | El recurso (o la ruta) no existe |
| `500` | Internal Server Error | Falló **tu** código. Tu API no debería devolverlo por datos mal enviados. |

---

## 9. Parte 4 — Base de datos (se hace EN CLASE)

**No la hagas en esta sesión.** La conectaremos juntos en la próxima clase presencial. Lo que viene:

- Hoy los datos viven en un arreglo: **si reinicias el servidor, se pierden** los que creaste. Compruébalo: crea una tarea, guarda cualquier archivo (nodemon reinicia) y vuelve a listar.
- En clase crearemos las tablas `tareas` y `contactos`, y reescribiremos **solo** `models/` para que use SQL en lugar del arreglo.
- Usaremos **consultas parametrizadas** (`?`) para evitar inyección SQL.

**Para llegar preparado/a:**

1. Tu Parte 3 debe estar terminada: si tu controlador toca el arreglo directamente, no podrás seguir el ritmo de la clase.
2. Lee [`3_GUIA_SQLITE.md` de newspaper-api](https://github.com/uniajc-gperezm/newspaper-api/blob/main/3_GUIA_SQLITE.md) (solo leer) y, si quieres adelantar, mira la [clase 5 de midudev](https://www.youtube.com/watch?v=eCWNQfzuuso).
3. Escribe en un archivo `docs/modelo-datos.md` cómo serían las dos tablas: nombre de cada columna, tipo (`INTEGER`, `TEXT`, `BOOLEAN`…) y cuáles son obligatorias (`NOT NULL`). Lo usaremos en clase.

---

## 10. Retos opcionales

Solo si terminaste todo lo anterior:

1. **Filtros con query params:** `GET /tareas?completada=true` devuelve solo las completadas; `GET /contactos?ciudad=Cali` filtra por ciudad. Se leen con `req.query`.
2. **CORS + frontend:** instala `cors` (`npm install cors`, `app.use(cors())`) y haz que tu todo list o tu contact list del frontend consuman esta API con `fetch` en lugar de `localStorage`. Mira la [clase 3 de midudev](https://www.youtube.com/watch?v=-9d3KhCqOtU) y `main-api.js` de [contact-list-server](https://github.com/uniajc-gperezm/contact-list-server).
3. **Validación con Zod:** reemplaza tus `if` de validación por un esquema con [`zod`](https://zod.dev), como en la clase 3 de midudev (`schemas/`).
4. **Respuesta de error uniforme:** que **todos** los errores de tu API tengan la forma `{ "error": "mensaje" }`.

---

## 11. Entrega y criterios de evaluación

### Qué entregar

- El **enlace a tu fork** en GitHub, con todo subido (`git push`). Medio y fecha límite: los indicará el docente.
- Commits **pequeños y con mensaje claro**, uno por parte como mínimo (se revisa el historial: un solo commit gigante al final resta).
- El archivo **`api.http`** con las pruebas de tareas y contactos.
- Las **respuestas a las preguntas** de la sección 5 (como comentarios en el código o en `docs/respuestas.md`).
- `docs/modelo-datos.md` (sección 9).

### Checklist antes de entregar

- [ ] `npm install` y luego `npm start` levantan la API sin errores en un clon limpio.
- [ ] Los 5 endpoints de `/tareas` funcionan con los códigos de la tabla.
- [ ] Los 5 endpoints de `/contactos` funcionan con los códigos de la tabla.
- [ ] Ningún `POST`/`PUT` con datos inválidos o sin body devuelve `500`.
- [ ] El código está separado en `routes/`, `controllers/` y `models/`; los controladores **no** tocan el arreglo directamente.
- [ ] `node_modules/` **no** está en el repositorio.

### Criterios

| Criterio | Peso |
| --- | --- |
| Paso 0 corregido y API de tareas completa (5 endpoints, códigos correctos) | 25 % |
| API de contactos completa con validaciones | 30 % |
| Arquitectura rutas / controladores / modelos | 25 % |
| `api.http` con casos de éxito **y** de error | 10 % |
| Historial de commits, respuestas y `modelo-datos.md` | 10 % |

> El código que entregues debes poder **explicarlo en clase**. Usar IA o repos de referencia para entender está bien; entregar código que no sabes explicar, no.

---

## 12. Errores comunes

| Síntoma | Causa probable | Solución |
| --- | --- | --- |
| `Error: listen EADDRINUSE :::3000` | Ya hay otro servidor usando el puerto 3000 (¿dos terminales con `npm run dev`?). | Cierra la otra terminal con `Ctrl + C`, o cambia el puerto. |
| `Cannot destructure property ... of 'req.body'` | Express 5 deja `req.body` en `undefined` si no llega JSON. | `req.body ?? {}` (Paso 0.2). |
| `req.body` llega vacío aunque envías datos | Falta el header `Content-Type: application/json` o falta `app.use(express.json())`. | Revisa ambos. |
| `GET /tareas/1` devuelve `404` y la tarea sí existe | Comparas el texto `"1"` con el número `1` usando `===`. | `Number(req.params.id)`. |
| `Cannot GET /contactos` | La ruta no está montada o la escribiste distinto. | Revisa `app.use('/contactos', ...)` en `server.js`. |
| `TypeError: argument handler must be a function` al arrancar | Una ruta apunta a una función del controlador que no existe o no exportaste. | Revisa el `module.exports` del controlador. |
| `Cannot find module '../models/...'` | Ruta o nombre de archivo mal escrito (mayúsculas cuentan). | Compara el `require` con el nombre real del archivo. |
| Los datos que creé desaparecieron | Normal: están en memoria y nodemon reinició el servidor. | Se resuelve con la base de datos, en clase. |

---

¿Dudas? Escríbelas como *issue* en tu fork o tráelas a la próxima clase. **¡Éxitos!** 🚀
