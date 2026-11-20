// Cargando las dependencias necesarias
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para entender el formato JSON en las peticiones
app.use(express.json());

// Base de datos temporal en memoria
let tareas = [
  { id: 1, titulo: 'Aprender Express', completada: false },
  { id: 2, titulo: 'Crear una API REST', completada: false },
  { id: 3, titulo: 'Probar la API', completada: false }
];

// 1. Obtener todas las tareas (GET)
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Tareas usando Express y node js');
});


// 1. Obtener todas las tareas (GET)
app.get('/tareas', (req, res) => {
  res.json(tareas);
});

// 2. Crear una nueva tarea (POST)
app.post('/tareas', (req, res) => {
  const { titulo } = req.body;
  if (!titulo) {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }
  const nuevaTarea = {
    id: Date.now(),
    titulo,
    completada: false
  };
  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea);
});

// 3. Actualizar una tarea (PUT)
// app.put('/tareas/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const tarea = tareas.find(t => t.id === id);

//   if (!tarea) {
//     return res.status(404).json({ error: 'Tarea no encontrada' });
//   }

//   tarea.titulo = req.body.titulo ?? tarea.titulo;
//   tarea.completada = req.body.completada ?? tarea.completada;
//   res.json(tarea);
// });

// // 4. Eliminar una tarea (DELETE)
// app.delete('/tareas/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const indice = tareas.findIndex(t => t.id === id);

//   if (indice === -1) {
//     return res.status(404).json({ error: 'Tarea no encontrada' });
//   }

//   tareas.splice(indice, 1);
//   res.status(204).send();
// });

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
