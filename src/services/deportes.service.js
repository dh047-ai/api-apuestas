const { getPool } = require('../config/mysql');

async function listarLigas() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT id_liga, nombre_liga, categoria, descripcion FROM Liga');
  return rows;
}

async function listarEquipos() {
  const pool = getPool();
  const [rows] = await pool.query(`
    SELECT e.id_equipo, e.nombre_equipo, e.ciudad, e.escudo_url, es.nombre_estadio
    FROM Equipo e
    JOIN Estadio es ON e.id_estadio = es.id_estadio
  `);
  return rows;
}

async function listarPartidos() {
  const pool = getPool();
  const [rows] = await pool.query(`
    SELECT p.id_partido, p.fecha_hora, p.marcador_local, p.marcador_visitante,
           el.nombre_equipo AS equipo_local, ev.nombre_equipo AS equipo_visitante,
           est.nombre_estadio, ep.nombre AS estado,
           j.numero_jornada, l.nombre_liga
    FROM Partido p
    JOIN Equipo el ON p.id_equipo_local = el.id_equipo
    JOIN Equipo ev ON p.id_equipo_visitante = ev.id_equipo
    JOIN Estadio est ON p.id_estadio = est.id_estadio
    JOIN EstadoPartido ep ON p.id_estado = ep.id_estado
    JOIN Jornada j ON p.id_jornada = j.id_jornada
    JOIN Liga l ON j.id_liga = l.id_liga
    ORDER BY p.fecha_hora
  `);
  return rows;
}

// Usado luego por el orquestador: validar que el partido exista y siga activo antes de aceptar una apuesta.
async function obtenerPartidoActivo(idPartido) {
  const pool = getPool();
  const [rows] = await pool
    .query(`
      SELECT p.id_partido, p.fecha_hora, ep.nombre AS estado, ep.partido_activo
      FROM Partido p
      JOIN EstadoPartido ep ON p.id_estado = ep.id_estado
      WHERE p.id_partido = ?
    `, [idPartido]);
  return rows[0];
}

module.exports = { listarLigas, listarEquipos, listarPartidos, obtenerPartidoActivo };
