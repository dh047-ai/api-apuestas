const deportesService = require('../services/deportes.service');

async function ligas(req, res) {
  try {
    res.json(await deportesService.listarLigas());
  } catch (err) {
    console.error('[deportes.controller] ligas:', err.message);
    res.status(503).json({ error: 'Servicio de deportes no disponible' });
  }
}

async function equipos(req, res) {
  try {
    res.json(await deportesService.listarEquipos());
  } catch (err) {
    console.error('[deportes.controller] equipos:', err.message);
    res.status(503).json({ error: 'Servicio de deportes no disponible' });
  }
}

async function partidos(req, res) {
  try {
    res.json(await deportesService.listarPartidos());
  } catch (err) {
    console.error('[deportes.controller] partidos:', err.message);
    res.status(503).json({ error: 'Servicio de deportes no disponible' });
  }
}

module.exports = { ligas, equipos, partidos };
