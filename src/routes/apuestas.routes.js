const express = require('express');
const router = express.Router();
const apuestasController = require('../controllers/apuestas.controller');
const { verificarToken } = require('../middleware/auth.middleware');

router.get('/cuenta', verificarToken, apuestasController.cuenta);
router.get('/mis-apuestas', verificarToken, apuestasController.misApuestas);
router.get('/movimientos', verificarToken, apuestasController.movimientos);
router.post('/', verificarToken, apuestasController.crearApuesta);

module.exports = router;
