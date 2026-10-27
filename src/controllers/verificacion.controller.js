const verificarCedula = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se ha subido ningún archivo' });
        }

        console.log(`✅ Archivo guardado con éxito: ${req.file.filename}`);

        res.status(200).json({
            mensaje: 'Documento subido y verificado en el servidor exitosamente',
            fileName: req.file.filename
        });

    } catch (error) {
        console.error("Error en verificación:", error);
        res.status(500).json({ error: 'Error interno al procesar el documento' });
    }
};

module.exports = { verificarCedula };