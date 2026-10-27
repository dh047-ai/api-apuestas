const mercadosService = require('../services/mercados.service');

async function mercados(req, res) {
  try {
    res.json(await mercadosService.listarMercados());
  } catch (err) {
    console.error('[mercados.controller] mercados:', err.message);
    res.status(503).json({ error: 'Servicio de reglas/mercados no disponible' });
  }
}

async function auditoria(req, res) {
  try {
    res.json(await mercadosService.listarAuditoria(req.usuario.correo));
  } catch (err) {
    console.error('[mercados.controller] auditoria:', err.message);
    res.status(503).json({ error: 'Servicio de auditoría no disponible' });
  }
}

module.exports = { mercados, auditoria };
