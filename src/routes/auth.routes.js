const express = require('express');
const router = express.Router();
const { login, registro } = require('../controllers/auth.controller'); // <-- Asegúrate de importar registro

router.post('/login', login);
router.post('/registro', registro); // <-- Agrega esta línea

module.exports = router;