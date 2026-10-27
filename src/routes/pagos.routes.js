const express = require('express');
const router = express.Router();
const { procesarPago } = require('../controllers/pagos.controller');

/**
 * @swagger
 * /api/pagos:
 *   post:
 *     summary: Procesa un pago (Firebase + PostgreSQL)
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario_id:
 *                 type: integer
 *                 example: 1
 *               monto:
 *                 type: number
 *                 example: 50000
 *               metodo_pago:
 *                 type: string
 *                 example: "Wompi"
 *     responses:
 *       200:
 *         description: Pago procesado exitosamente
 */
router.post('/', procesarPago);

module.exports = router;