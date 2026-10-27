const apuestasService = require('../services/apuestas.service');
const mercadosService = require('../services/mercados.service');

async function cuenta(req, res) {
  try {
    const data = await apuestasService.obtenerCuentaPorCorreo(req.usuario.correo);
    if (!data) return res.status(404).json({ error: 'Cuenta no encontrada' });
    res.json(data);
  } catch (err) {
    console.error('[apuestas.controller] cuenta:', err.message);
    res.status(503).json({ error: 'Servicio de apuestas no disponible' });
  }
}

async function misApuestas(req, res) {
  try {
    res.json(await apuestasService.listarApuestas(req.usuario.correo));
  } catch (err) {
    console.error('[apuestas.controller] misApuestas:', err.message);
    res.status(503).json({ error: 'Servicio de apuestas no disponible' });
  }
}

async function movimientos(req, res) {
  try {
    res.json(await apuestasService.listarMovimientos(req.usuario.correo));
  } catch (err) {
    console.error('[apuestas.controller] movimientos:', err.message);
    res.status(503).json({ error: 'Servicio de apuestas no disponible' });
  }
}

async function crearApuesta(req, res) {
  const { id_cuota, juego, valor_apostado } = req.body;
  if (!id_cuota || !juego || !valor_apostado) {
    return res.status(400).json({ error: 'id_cuota, juego y valor_apostado son obligatorios' });
  }
  try {
    const apuesta = await apuestasService.crearApuesta(req.usuario.correo, id_cuota, juego, valor_apostado);

    // Auditoría en MongoDB: no bloquea la respuesta si falla, solo se registra en consola.
    mercadosService
      .registrarLog('APUESTA_CREADA', req.usuario.correo, { id_cuota, juego, valor_apostado })
      .catch((err) => console.error('[auditoria] no se pudo registrar el log:', err.message));

    res.status(201).json(apuesta);
  } catch (err) {
    if (err.message === 'CLIENTE_NO_ENCONTRADO' || err.message === 'CUOTA_NO_ENCONTRADA') {
      return res.status(404).json({ error: err.message });
    }
    console.error('[apuestas.controller] crearApuesta:', err.message);
    res.status(503).json({ error: 'Servicio de apuestas no disponible' });
  }
}

module.exports = { cuenta, misApuestas, movimientos, crearApuesta };
