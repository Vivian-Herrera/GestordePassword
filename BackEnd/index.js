const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const db = require('./db');
const { encrypt, decrypt } = require('./crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const MASTER_PASSWORD_HASH = process.env.MASTER_PASSWORD_HASH;

// Middleware para autenticar la contraseña maestra
async function authMiddleware(req, res, next) {
  const { masterPassword } = req.headers;
  if (!masterPassword) return res.status(401).json({ error: 'No master password' });

  const valid = await bcrypt.compare(masterPassword, MASTER_PASSWORD_HASH);
  if (!valid) return res.status(403).json({ error: 'Invalid master password' });

  next();
}

// Listar contraseñas
app.get('/api/passwords', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT id, name, username, password FROM passwords').all();
  const result = rows.map(row => ({
    ...row,
    password: decrypt(row.password)
  }));
  res.json(result);
});

// Crear nueva contraseña
app.post('/api/passwords', authMiddleware, (req, res) => {
  const { name, username, password } = req.body;
  const encryptedPassword = encrypt(password);
  db.prepare('INSERT INTO passwords (name, username, password) VALUES (?, ?, ?)')
    .run(name, username, encryptedPassword);
  res.json({ success: true });
});

// Eliminar contraseña
app.delete('/api/passwords/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM passwords WHERE id = ?').run(id);
  res.json({ success: true });
});

// Inicializar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
