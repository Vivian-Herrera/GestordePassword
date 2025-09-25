require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');
const { encrypt, decrypt } = require('./crypto');

const app = express();
app.use(cors());
app.use(express.json());

const MASTER_PASSWORD_HASH = process.env.MASTER_PASSWORD_HASH;

function authMiddleware(req, res, next) {
  const masterPassword = req.headers['masterpassword'];
  if (!masterPassword) return res.status(401).json({ error: 'No master password' });

  bcrypt.compare(masterPassword, MASTER_PASSWORD_HASH)
    .then(valid => {
      if (!valid) return res.status(403).json({ error: 'Invalid master password' });
      next();
    })
    .catch(() => res.status(500).json({ error: 'Auth error' }));
}

app.get('/api/passwords', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT id, name, username, password FROM passwords').all();
  const result = rows.map(row => ({
    ...row,
    password: decrypt(row.password),
    pass2: row.password
  }));
  res.json(result);
});

app.post('/api/passwords', authMiddleware, (req, res) => {
  const { name, username, password } = req.body;
  const encryptedPassword = encrypt(password);
  db.prepare('INSERT INTO passwords (name, username, password) VALUES (?, ?, ?)')
    .run(name, username, encryptedPassword);
  res.json({ success: true });
});

app.delete('/api/passwords/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM passwords WHERE id = ?').run(id);
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
