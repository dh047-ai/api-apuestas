const { firebaseDb } = require('../config/firebase');
const { getPool } = require('../config/postgres');
const pool = getPool();

const procesarPago = async (req, res) => {
    // Capturamos el documento del cliente, el monto y el método elegido
    const { usuario_id, monto, metodo_pago } = req.body; 

    try {
        // 1. Guardar el recibo/auditoría en Firebase Firestore
        const reciboFirebase = await firebaseDb.collection('pasarela_pagos').add({
            numero_documento_cliente: usuario_id,
            monto: parseFloat(monto),
            metodo_pago: metodo_pago || 'PSE',
            estado: 'Aprobada',
            fecha: new Date()
        });

        // 2. Actualizar el saldo en PostgreSQL (Tabla: cuenta | PK: numero_documento_cliente)
        const queryUpdate = `
            UPDATE cuenta 
            SET saldo = saldo + $1 
            WHERE numero_documento_cliente = $2 
            RETURNING saldo;
        `;
        const resultUpdate = await pool.query(queryUpdate, [monto, usuario_id]);

        if (resultUpdate.rows.length === 0) {
            return res.status(404).json({ error: "La cuenta del cliente no existe en PostgreSQL" });
        }

        // 3. Registrar el historial de transacción en PostgreSQL
        const queryTransaccion = `
            INSERT INTO transaccion (numero_documento_cliente, metodo_pago, tipo_transaccion, valor, referencia_pago, estado_transaccion)
            VALUES ($1, $2, 'Deposito', $3, $4, 'Aprobada');
        `;
        await pool.query(queryTransaccion, [usuario_id, metodo_pago || 'PSE', monto, reciboFirebase.id]);

        // 4. Responder al frontend con el nuevo saldo
        res.status(200).json({
            mensaje: "Pago procesado y saldo actualizado exitosamente",
            id_transaccion_firebase: reciboFirebase.id,
            nuevo_saldo: parseFloat(resultUpdate.rows[0].saldo)
        });

    } catch (error) {
        console.error("Error en la pasarela de pagos:", error);
        res.status(500).json({ error: "Error interno al procesar el pago en la base de datos" });
    }
};

module.exports = { procesarPago };