-- =====================================================================
-- Práctica de SQL: onboarding de bases de datos (Fundamentos Web 611)
-- Ejecuta este archivo con:   npm run sql
-- Guía: docs/GUIA_BASE_DE_DATOS.md (Parte A)
-- Regla del playground: termina cada sentencia con ; al final de la línea.
-- =====================================================================


-- ---------------------------------------------------------------------
-- PARTE 1 · TAREAS (ejemplo resuelto: léelo, ejecútalo y modifícalo)
-- ---------------------------------------------------------------------

-- 1. Crear la tabla
CREATE TABLE tareas (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo     TEXT    NOT NULL,
  completada INTEGER NOT NULL DEFAULT 0
);

-- 2. Insertar filas (no enviamos el id: lo genera la base de datos)
INSERT INTO tareas (titulo) VALUES ('Aprender Express');
INSERT INTO tareas (titulo) VALUES ('Crear una API REST');
INSERT INTO tareas (titulo, completada) VALUES ('Probar la API', 1);

-- 3. Leer todas las filas
SELECT * FROM tareas;

-- 4. Leer con filtro: solo las pendientes
SELECT id, titulo FROM tareas WHERE completada = 0;

-- 5. Actualizar UNA fila (¡siempre con WHERE!)
UPDATE tareas SET completada = 1 WHERE id = 1;

-- 6. Eliminar UNA fila (¡siempre con WHERE!)
DELETE FROM tareas WHERE id = 2;

-- 7. Ver cómo quedó
SELECT * FROM tareas;

-- 8. Esta falla a propósito: titulo es NOT NULL. Lee el mensaje de error.
INSERT INTO tareas (completada) VALUES (0);


-- ---------------------------------------------------------------------
-- PARTE 2 · CONTACTOS (te toca a ti: escribe el SQL debajo de cada TODO)
-- ---------------------------------------------------------------------

-- TODO 1. Crea la tabla contactos con las columnas:
--         id (clave primaria autoincremental), nombre (obligatorio),
--         apellido, telefono (obligatorio), email, ciudad.


-- TODO 2. Inserta 5 contactos inventados, al menos 2 de la ciudad 'Cali'.


-- TODO 3. Lista todos los contactos.


-- TODO 4. Lista solo nombre y telefono de los contactos de 'Cali'.


-- TODO 5. Lista todos los contactos ordenados por apellido (ORDER BY).


-- TODO 6. Cambia el teléfono del contacto con id 3.


-- TODO 7. Elimina el contacto con id 5.


-- TODO 8. Cuenta cuántos contactos quedan (pista: SELECT COUNT(*) ...).


-- TODO 9. Intenta insertar un contacto SIN telefono. ¿Qué error sale y por qué?
--         Escribe la explicación como comentario debajo de tu INSERT.

