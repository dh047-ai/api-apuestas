const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crea la carpeta "uploads" automáticamente si no existe
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configurar dónde y con qué nombre se guarda el archivo
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const nombreUsuario = req.body.nombre ? req.body.nombre.replace(/\s+/g, '_') : 'User';
        cb(null, `Cedula_${nombreUsuario}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });
const { verificarCedula } = require('../controllers/verificacion.controller');

router.post('/verificar-cedula', upload.single('cedula'), verificarCedula);

module.exports = router;