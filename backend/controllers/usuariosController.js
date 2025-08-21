const db = require('../config/db');

const bcrypt = require('bcryptjs');

exports.listarUsuarios = (req, res) => {
  const sql = 'SELECT id_usuario, nombre, email, rol FROM usuarios';
  db.query(sql, (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    res.json(resultados);
  });
};

exports.crearUsuario = async (req, res) => {
  const { nombre, email, rol, contraseña, contrasena } = req.body;
  const pass = contraseña || contrasena;

  if (!nombre || !email || !pass || !rol) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const contraseñaHasheada = await bcrypt.hash(pass, 10);

    const sql = 'INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES (?, ?, ?, ?)';
    db.query(sql, [nombre, email, contraseñaHasheada, rol], (err, resultado) => {
      if (err) return res.status(500).json({ error: 'Error al crear usuario' });
      res.status(201).json({ mensaje: 'Usuario creado', id: resultado.insertId });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al hashear contraseña' });
  }
};

exports.modificarUsuario = (req, res) => {
  const { id } = req.params;
  const { nombre, email, rol } = req.body;

  if (!nombre || !email || !rol) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  const sql = 'UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id_usuario = ?';
  db.query(sql, [nombre, email, rol, id], (err, resultado) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });
    res.json({ mensaje: 'Usuario modificado correctamente' });
  });
};

exports.eliminarUsuario = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM usuarios WHERE id_usuario = ?';
  db.query(sql, [id], (err, resultado) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar usuario' });
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  });
};
