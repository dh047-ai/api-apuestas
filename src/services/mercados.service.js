const { getDb } = require('../config/mongo');

async function listarMercados() {
  const db = await getDb();
  return db.collection('mercados').find({ activo: true }).toArray();
}

// Usado luego por el orquestador: validar que el mercado exista antes de aceptar una apuesta.
async function obtenerMercadoPorTipo(tipoApuesta) {
  const db = await getDb();
  return db.collection('mercados').findOne({ tipo_apuesta: tipoApuesta, activo: true });
}

async function registrarLog(evento, correoUsuario, detalle) {
  const db = await getDb();
  await db.collection('auditoria').insertOne({
    evento,
    correo_usuario: correoUsuario,
    detalle,
    fecha: new Date(),
  });
}

async function listarAuditoria(correoUsuario) {
  const db = await getDb();
  return db
    .collection('auditoria')
    .find({ correo_usuario: correoUsuario })
    .sort({ fecha: -1 })
    .limit(50)
    .toArray();
}

module.exports = { listarMercados, obtenerMercadoPorTipo, registrarLog, listarAuditoria };
