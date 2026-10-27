const express = require('express');
const router = express.Router();
const mercadosController = require('../controllers/mercados.controller');
const { verificarToken } = require('../middleware/auth.middleware');

router.get('/', verificarToken, mercadosController.mercados);
router.get('/auditoria', verificarToken, mercadosController.auditoria);

module.exports = router;
