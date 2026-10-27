const { getPool } = require('../config/postgres');

// El correo es el campo puente: viene del JWT (SQL Server) y existe también en cliente (Postgres).
async function obtenerCuentaPorCorreo(correo) {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT c.numero_documento, c.nombre, c.apellido, c.correo,
            cu.saldo, cu.estado_cuenta
     FROM cliente c
     JOIN cuenta cu ON c.numero_documento = cu.numero_documento_cliente
     WHERE c.correo = $1`,
    [correo]
  );
  return rows[0];
}

async function listarApuestas(correo) {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT a.id_apuesta, a.valor_apostado, a.ganancia_potencial, a.fecha_hora, a.estado_apuesta,
            cu.seleccion, cu.valor_cuota
     FROM apuesta a
     JOIN cliente c ON a.numero_documento_cliente = c.numero_documento
     JOIN cuota cu ON a.id_cuota = cu.id_cuota
     WHERE c.correo = $1
     ORDER BY a.fecha_hora DESC`,
    [correo]
  );
  return rows;
}

async function listarMovimientos(correo) {
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT t.id_transaccion, t.tipo_transaccion, t.valor, t.fecha_hora, t.estado_transaccion, t.metodo_pago
     FROM transaccion t
     JOIN cliente c ON t.numero_documento_cliente = c.numero_documento
     WHERE c.correo = $1
     ORDER BY t.fecha_hora DESC`,
    [correo]
  );
  return rows;
}

// id_partido viene de MySQL (etapa 2): aquí solo se referencia por número, sin Foreign Key real.
async function crearApuesta(correo, idCuota, juego, valorApostado) {
  const pool = getPool();

  const cliente = await pool.query('SELECT numero_documento FROM cliente WHERE correo = $1', [correo]);
  if (cliente.rows.length === 0) throw new Error('CLIENTE_NO_ENCONTRADO');
  const numeroDocumento = cliente.rows[0].numero_documento;

  const cuota = await pool.query('SELECT valor_cuota FROM cuota WHERE id_cuota = $1', [idCuota]);
  if (cuota.rows.length === 0) throw new Error('CUOTA_NO_ENCONTRADA');
  const gananciaPotencial = valorApostado * cuota.rows[0].valor_cuota;

  const { rows } = await pool.query(
    `INSERT INTO apuesta (numero_documento_cliente, id_cuota, juego, valor_apostado, ganancia_potencial, estado_apuesta)
     VALUES ($1, $2, $3, $4, $5, 'Pendiente')
     RETURNING id_apuesta, ganancia_potencial, estado_apuesta`,
    [numeroDocumento, idCuota, juego, valorApostado, gananciaPotencial]
  );
  return rows[0];
}

module.exports = { obtenerCuentaPorCorreo, listarApuestas, listarMovimientos, crearApuesta };
