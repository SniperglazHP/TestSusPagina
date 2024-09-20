const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Configurar EJS como el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configurar la base de datos SQLite
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    image TEXT
  )`);
});

// Ruta para listar usuarios
app.get('/', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      throw err;
    }
    res.render('index', { users: rows });
  });
});

// Ruta para agregar un usuario
app.post('/add', (req, res) => {
  const { name, password, image } = req.body;
  db.run('INSERT INTO users (name, password, image) VALUES (?, ?, ?)', [name, password, image], (err) => {
    if (err) {
      throw err;
    }
    res.redirect('/');
  });
});

// Ruta para eliminar un usuario
app.post('/delete/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM users WHERE id = ?', [id], (err) => {
    if (err) {
      throw err;
    }
    res.redirect('/');
  });
});

// Ruta para editar un usuario
app.post('/edit/:id', (req, res) => {
  const { id } = req.params;
  const { name, password, image } = req.body;
  db.run('UPDATE users SET name = ?, password = ?, image = ? WHERE id = ?', [name, password, image, id], (err) => {
    if (err) {
      throw err;
    }
    res.redirect('/');
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
