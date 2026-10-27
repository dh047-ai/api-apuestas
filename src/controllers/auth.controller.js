const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getPool } = require('../config/postgres');
const pool = getPool();

async function login(req, res) {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  try {
    const query = `
        SELECT c.numero_documento, c.nombre, c.correo, c.contrasena_hash, c.estado_cliente, cu.saldo 
        FROM cliente c
        JOIN cuenta cu ON c.numero_documento = cu.numero_documento_cliente
        WHERE c.correo = $1;
    `;
    const result = await pool.query(query, [correo]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const cliente = result.rows[0];

    const coincide = await bcrypt.compare(contrasena, cliente.contrasena_hash);
    if (!coincide) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    if (cliente.estado_cliente !== 'Activo') {
      return res.status(403).json({ error: 'Tu cuenta está suspendida' });
    }

    const token = jwt.sign(
      { sub: cliente.numero_documento, correo: cliente.correo },
      process.env.JWT_SECRET || 'secreto_super_seguro',
      { expiresIn: '2h' }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: { id: cliente.numero_documento, nombre: cliente.nombre, saldo: parseFloat(cliente.saldo) },
    });
  } catch (err) {
    res.status(500).json({ error: 'Error interno al iniciar sesión' });
  }
}

// NUEVA FUNCIÓN: Permite registrar clientes desde la página web
async function registro(req, res) {
  const { nombre, correo, contrasena } = req.body;

  try {
    // 1. Encriptamos la contraseña de verdad
    const hash = await bcrypt.hash(contrasena, 10);
    // 2. Inventamos un número de documento aleatorio para la prueba
    const documento = Math.floor(Math.random() * 1000000000).toString();

    // Iniciar transacción en PostgreSQL
    await pool.query('BEGIN'); 

    // 3. Insertar el cliente con los datos obligatorios de tu base de datos
    const insertCliente = `
      INSERT INTO cliente (numero_documento, nombre, apellido, tipo_documento, correo, ciudad, contrasena_hash, fecha_nacimiento, estado_cliente, rol_cliente)
      VALUES ($1, $2, 'Apellido', 'Cédula de Ciudadanía', $3, 'Bogotá', $4, '1995-01-01', 'Activo', 'Regular')
    `;
    await pool.query(insertCliente, [documento, nombre, correo, hash]);

    // 4. Crear la cuenta con saldo 0
    const insertCuenta = `
      INSERT INTO cuenta (numero_documento_cliente, saldo, estado_cuenta)
      VALUES ($1, 0, 'Activa')
    `;
    await pool.query(insertCuenta, [documento]);

    await pool.query('COMMIT'); // Guardar en BD
    res.status(201).json({ mensaje: 'Usuario creado exitosamente' });

  } catch (error) {
    await pool.query('ROLLBACK'); // Deshacer si hay error
    res.status(500).json({ error: 'Ese correo ya está registrado o hubo un error' });
  }
}

// Exportamos ambas funciones
module.exports = { login, registro };