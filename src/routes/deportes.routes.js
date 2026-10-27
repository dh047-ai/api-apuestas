const express = require('express');
const router = express.Router();
const deportesController = require('../controllers/deportes.controller');
const { verificarToken } = require('../middleware/auth.middleware');

router.get('/ligas', verificarToken, deportesController.ligas);
router.get('/equipos', verificarToken, deportesController.equipos);
router.get('/partidos', verificarToken, deportesController.partidos);

module.exports = router;
