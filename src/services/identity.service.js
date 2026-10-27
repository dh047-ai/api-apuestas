const { sql, getPool } = require('../config/sqlserver');

async function buscarPorCorreo(correo) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('correo', sql.VarChar, correo)
    .query(`
      SELECT u.id_usuario, u.correo, u.nombre, u.apellido, u.contrasena_hash,
             r.nombre_rol, e.nombre AS estado, e.permite_login
      FROM Usuario u
      JOIN Rol r ON u.id_rol = r.id_rol
      JOIN EstadoUsuario e ON u.id_estado = e.id_estado
      WHERE u.correo = @correo
    `);
  return result.recordset[0];
}

// Usado luego por el orquestador: "¿usuario activo?" antes de crear una apuesta.
async function buscarActivo(idUsuario) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('id', sql.Int, idUsuario)
    .query(`
      SELECT u.id_usuario, u.correo, u.nombre, r.nombre_rol, e.permite_login
      FROM Usuario u
      JOIN Rol r ON u.id_rol = r.id_rol
      JOIN EstadoUsuario e ON u.id_estado = e.id_estado
      WHERE u.id_usuario = @id AND e.permite_login = 1
    `);
  return result.recordset[0];
}

async function registrarLogin(idUsuario, ip, resultado) {
  const pool = await getPool();
  await pool
    .request()
    .input('id', sql.Int, idUsuario)
    .input('ip', sql.VarChar, ip)
    .input('resultado', sql.VarChar, resultado)
    .query(`INSERT INTO Login (id_usuario, ip_origen, resultado) VALUES (@id, @ip, @resultado)`);
}

module.exports = { buscarPorCorreo, buscarActivo, registrarLogin };
