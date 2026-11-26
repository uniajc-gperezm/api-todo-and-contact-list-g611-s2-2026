# Repaso de JavaScript para esta práctica

**Fundamentos Web · Grupo 611 · UNIAJC** · Complemento del [README](../README.md)

Este repaso explica **solo** lo que vas a usar en la práctica, con ejemplos sacados del mismo proyecto. Si un concepto no te queda claro, mira la clase enlazada. Casi todas son del curso **gratuito** de midudev [aprendejavascript.dev](https://aprendejavascript.dev) (videos cortos con ejercicios; si inicias sesión, guarda tu progreso).

> 💡 **Cómo probar los ejemplos:** abre una terminal, escribe `node` y pega el código. Para salir: `.exit`. También puedes usar la consola del navegador (`F12` → *Console*).

## Contenido

| # | Concepto | Dónde lo usas en la práctica | Clase |
| --- | --- | --- | --- |
| 1 | [Variables: `const` y `let`](#1-variables-const-y-let) | En todos los archivos | — |
| 2 | [Objetos](#2-objetos) | Una tarea, un contacto, `req`, `res` | [Objetos](https://aprendejavascript.dev/clase/objetos/introduccion) |
| 3 | [Arrays](#3-arrays) | La lista de tareas y de contactos | [¿Qué son los arrays?](https://aprendejavascript.dev/clase/arrays/arrays-que-son) |
| 4 | [Buscar y modificar en arrays](#4-buscar-y-modificar-en-arrays) | `GET /tareas/:id`, `PUT`, `DELETE` | [Métodos](https://aprendejavascript.dev/clase/arrays/metodos) · [Buscar](https://aprendejavascript.dev/clase/arrays/buscar) |
| 5 | [Funciones](#5-funciones) | Controladores y modelos | [Tu primera función](https://aprendejavascript.dev/clase/funciones/tu-primera-funcion) · [Parámetros](https://aprendejavascript.dev/clase/funciones/parametros) |
| 6 | [Funciones flecha](#6-funciones-flecha) | `t => t.id === id`, `(req, res) => {...}` | [Funciones flecha](https://aprendejavascript.dev/clase/funciones/flecha) |
| 7 | [Callbacks](#7-callbacks) | `app.get('/tareas', ...)`, `.find(...)` | [Callbacks](https://aprendejavascript.dev/clase/programacion-asincrona/callbacks) |
| 8 | [Desestructuración](#8-desestructuración) | `const { titulo } = req.body` | [MDN](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) |
| 9 | [Template literals](#9-template-literals) | Mensajes con `${...}` | [MDN](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Template_literals) |
| 10 | [`??` (nullish coalescing)](#10--nullish-coalescing) | `req.body ?? {}` | [MDN](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) |
| 11 | [Tipos y conversiones](#11-tipos-y-conversiones) | `Number(req.params.id)`, validaciones | — |
| 12 | [Promesas y `async`/`await`](#12-promesas-y-asyncawait) | Modelos y controladores (Parte 3) | [Promesas](https://aprendejavascript.dev/clase/programacion-asincrona/promises-basico) · [async/await](https://aprendejavascript.dev/clase/programacion-asincrona/async-await) |
| 13 | [Módulos: `require` y `module.exports`](#13-módulos-require-y-moduleexports) | Separar en varios archivos (Parte 3) | [¿Qué son los módulos?](https://aprendejavascript.dev/clase/modulos/que-son-los-modulos) |
| 14 | [JSON](#14-json) | Todo lo que viaja entre cliente y API | — |

---

## 1. Variables: `const` y `let`

```js
const PORT = 3000;     // const: NO se puede reasignar
let siguienteId = 4;   // let: SÍ se puede reasignar
siguienteId = 5;       // ✔
// PORT = 4000;        // ✖ TypeError: Assignment to constant variable
```

**Regla práctica:** usa `const` siempre y cambia a `let` solo si necesitas reasignar. No uses `var` (es la forma antigua).

> Ojo: `const` impide **reasignar** la variable, no modificar su contenido. Con `const tareas = []` sí puedes hacer `tareas.push(...)`.

## 2. Objetos

Un **objeto** agrupa datos relacionados en pares **clave: valor**. Una tarea es un objeto:

```js
const tarea = { id: 1, titulo: 'Aprender Express', completada: false };

tarea.titulo;            // 'Aprender Express'  → leer una propiedad
tarea.completada = true; // modificar una propiedad
tarea.prioridad = 'alta';// agregar una propiedad nueva
```

**Atajo (shorthand):** si la variable se llama igual que la propiedad, no hace falta repetirla:

```js
const titulo = 'Estudiar';
const nueva = { id: 4, titulo, completada: false }; // igual a { id: 4, titulo: titulo, completada: false }
```

En Express, `req` (la petición) y `res` (la respuesta) también son objetos: `req.params`, `req.body` y `res.status(...)` son propiedades y métodos de esos objetos.

📺 [Objetos](https://aprendejavascript.dev/clase/objetos/introduccion) · [Atajos de objetos](https://aprendejavascript.dev/clase/objetos/atajos)

## 3. Arrays

Un **array** (arreglo) es una **lista ordenada** de valores. Nuestra "base de datos" en memoria es un array de objetos:

```js
const tareas = [
  { id: 1, titulo: 'Aprender Express', completada: false },
  { id: 2, titulo: 'Crear una API REST', completada: false }
];

tareas.length;   // 2           → cuántos elementos tiene
tareas[0];       // { id: 1, ... } → el primero (las posiciones empiezan en 0)
tareas.push({ id: 3, titulo: 'Probar', completada: false }); // agrega al final
```

📺 [¿Qué son los arrays?](https://aprendejavascript.dev/clase/arrays/arrays-que-son) · [Métodos de arrays](https://aprendejavascript.dev/clase/arrays/metodos) · [Iterar arrays](https://aprendejavascript.dev/clase/arrays/iteracion)

## 4. Buscar y modificar en arrays

Estos métodos reciben una **función** (ver [callbacks](#7-callbacks)) que se ejecuta con cada elemento:

| Método | Qué devuelve | Ejemplo en la práctica |
| --- | --- | --- |
| `find(fn)` | El **primer elemento** que cumple, o `undefined` | `tareas.find(t => t.id === 2)` → la tarea 2 |
| `findIndex(fn)` | La **posición** del primero que cumple, o `-1` | `tareas.findIndex(t => t.id === 2)` → `1` |
| `some(fn)` | `true` si **alguno** cumple | `tareas.some(t => t.completada)` |
| `filter(fn)` | Un **array nuevo** con todos los que cumplen | `tareas.filter(t => !t.completada)` → pendientes |
| `splice(i, 1)` | **Quita** 1 elemento en la posición `i` (modifica el array) | Para el `DELETE` |

```js
// DELETE paso a paso
const indice = tareas.findIndex(t => t.id === 2);
if (indice === -1) {
  console.log('No existe');      // → en la API: 404
} else {
  tareas.splice(indice, 1);      // la quita del array
}
```

📺 [Buscar en arrays](https://aprendejavascript.dev/clase/arrays/buscar) · [Transformar arrays](https://aprendejavascript.dev/clase/arrays/transformacion)

## 5. Funciones

Una **función** es un bloque de código con nombre que puedes reutilizar. Recibe **parámetros** y puede **devolver** un valor con `return`:

```js
function sumar(a, b) {
  return a + b;
}
sumar(2, 3); // 5
```

`return` también **termina** la función. Por eso en los controladores verás:

```js
if (!tarea) {
  return res.status(404).json({ error: 'Tarea no encontrada' }); // responde y SALE
}
res.json(tarea); // solo llega aquí si la tarea existe
```

Sin ese `return`, la función seguiría y trataría de responder **dos veces** (error: *Cannot set headers after they are sent*).

📺 [Tu primera función](https://aprendejavascript.dev/clase/funciones/tu-primera-funcion) · [Parámetros](https://aprendejavascript.dev/clase/funciones/parametros) · [Function expression](https://aprendejavascript.dev/clase/funciones/function-expression)

## 6. Funciones flecha

Una forma más corta de escribir funciones. Estas tres hacen lo mismo:

```js
function esLaTarea(t) {
  return t.id === 2;
}

const esLaTarea2 = (t) => {
  return t.id === 2;
};

const esLaTarea3 = t => t.id === 2; // si es UNA sola expresión: sin llaves y sin return
```

Por eso `tareas.find(t => t.id === id)` se lee: *"busca la primera `t` cuyo `id` sea igual a `id`"*.

📺 [Funciones flecha](https://aprendejavascript.dev/clase/funciones/flecha)

## 7. Callbacks

Un **callback** es una función que le **pasas a otra función** para que **ella** la ejecute cuando corresponda. Ya los usas sin notarlo:

```js
// Le pasas a find una función; find la llama con cada tarea
tareas.find(t => t.id === 2);

// Le pasas a Express una función; Express la llama CADA VEZ que llega un GET /tareas
app.get('/tareas', (req, res) => {
  res.json(tareas);
});
```

Tú no llamas a `(req, res) => {...}`: lo hace Express cuando llega la petición, y te entrega `req` y `res` ya listos.

📺 [Callbacks](https://aprendejavascript.dev/clase/programacion-asincrona/callbacks)

## 8. Desestructuración

Sacar propiedades de un objeto a variables, en una línea:

```js
const body = { titulo: 'Estudiar', completada: false };

const { titulo, completada } = body;
// es lo mismo que:
// const titulo = body.titulo;
// const completada = body.completada;
```

En la práctica: `const { titulo } = req.body ?? {};`

📖 [MDN: desestructuración](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

## 9. Template literals

Textos entre **comillas invertidas** (`` ` ``) donde puedes meter variables con `${...}`:

```js
const PORT = 3000;
console.log(`Servidor corriendo en http://localhost:${PORT}`);
// Servidor corriendo en http://localhost:3000
```

📖 [MDN: template literals](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Template_literals)

## 10. `??` (nullish coalescing)

`a ?? b` devuelve `a`, **salvo** que `a` sea `null` o `undefined`; en ese caso devuelve `b`. Sirve para dar **valores por defecto**:

```js
undefined ?? {};    // {}
null ?? 'nada';     // 'nada'
false ?? true;      // false   ← false NO es null/undefined, se queda
0 ?? 10;            // 0
```

**¿Y `||`?** `a || b` devuelve `b` si `a` es *cualquier* valor "falso" (`false`, `0`, `''`, `null`, `undefined`). Por eso en el `PUT`:

```js
const completada = false; // el usuario QUIERE marcarla como no completada
completada || true;  // true   ✖ ¡ignoró lo que envió el usuario!
completada ?? true;  // false  ✔
```

📖 [MDN: operador ??](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)

## 11. Tipos y conversiones

Todo lo que llega en la **URL** es **texto** (`string`), aunque parezca un número:

```js
// GET /tareas/1
req.params.id;           // '1'  (texto)
'1' === 1;               // false ✖ por eso no encuentra la tarea
Number('1') === 1;       // true  ✔
```

`Number` vs `parseInt`:

```js
Number('1abc');    // NaN  (no es un número válido) → no encuentra nada → 404 ✔
parseInt('1abc');  // 1    (lee hasta donde puede)  → ¡encuentra la tarea 1! ✖
```

`typeof` dice el tipo de un valor. Lo usas para **validar**:

```js
typeof 'hola';   // 'string'
typeof 123;      // 'number'
typeof true;     // 'boolean'
typeof undefined;// 'undefined'

if (typeof titulo !== 'string' || !titulo.trim()) {
  // no es texto, o es texto vacío / solo espacios → 400
}
```

`.trim()` quita los espacios del inicio y del final: `'  hola  '.trim()` → `'hola'`. Solo existe en los textos: `(123).trim()` lanza un error, y por eso primero se revisa el tipo.

## 12. Promesas y `async`/`await`

Algunas operaciones **tardan**: leer un archivo, consultar una base de datos, pedir datos a otra API. JavaScript no se queda "congelado" esperando: esas operaciones devuelven una **promesa**, un objeto que representa *"un valor que va a llegar después"*. Una promesa puede **cumplirse** (llega el valor) o **rechazarse** (hubo un error).

`async` y `await` permiten escribir ese código como si fuera de arriba hacia abajo:

```js
// async: esta función devuelve una promesa
async function obtenerTodas() {
  return tareas;
}

// await: "espera a que la promesa se cumpla y dame el valor"
// Solo se puede usar dentro de una función async
async function listar(req, res) {
  const tareas = await obtenerTodas();
  res.json(tareas);
}
```

**¿Por qué los modelos son `async` si el arreglo responde al instante?** Porque las bases de datos (como MySQL, en el video de midudev) responden con promesas. Si hoy el controlador ya usa `await`, el día que el modelo consulte una base de datos el controlador **no cambia**.

> ⚠️ Error típico: olvidar el `await`. `const tareas = obtenerTodas();` guarda la **promesa**, no el arreglo, y la API responde `{}`.

📺 [Promesas, básico](https://aprendejavascript.dev/clase/programacion-asincrona/promises-basico) · [Promesas, avanzado](https://aprendejavascript.dev/clase/programacion-asincrona/promises-avanzado) · [async/await](https://aprendejavascript.dev/clase/programacion-asincrona/async-await)

## 13. Módulos: `require` y `module.exports`

Un **módulo** es un archivo que **exporta** cosas para que otros archivos las **importen**. Así separamos el proyecto en rutas, controladores y modelos.

```js
// src/models/tarea.model.js → EXPORTA
async function obtenerTodas() { /* ... */ }
module.exports = { obtenerTodas };

// src/controllers/tareas.controller.js → IMPORTA
const Tarea = require('../models/tarea.model');
Tarea.obtenerTodas();
```

- `../` significa "subir una carpeta". Desde `controllers/` se sube a `src/` y se entra a `models/`.
- No se escribe `.js` al final: `require` lo agrega.
- Este proyecto usa **CommonJS** (`require` / `module.exports`), el sistema clásico de Node. La clase de midudev enseña **ES Modules** (`import` / `export`), el sistema moderno. La idea es la misma, cambia la sintaxis; **no los mezcles** en un mismo proyecto.

📺 [¿Qué son los módulos?](https://aprendejavascript.dev/clase/modulos/que-son-los-modulos) · [Export e import](https://aprendejavascript.dev/clase/modulos/export-e-import)

## 14. JSON

**JSON** es el formato de texto con el que viajan los datos entre el cliente y la API. Se parece a un objeto de JavaScript, pero con reglas más estrictas: las claves van **siempre entre comillas dobles**, no hay comentarios y no hay comas al final.

```json
{ "titulo": "Estudiar", "completada": false }
```

Express hace la conversión por ti:

- `app.use(express.json())` convierte el **texto JSON que llega** en un objeto → `req.body`.
- `res.json(objeto)` convierte tu **objeto en texto JSON** y lo envía.

---

¿Dominas todo esto? Vuelve al [README](../README.md) y sigue con la práctica.
