const db = require('../config/db');

const TicketEvidence = {
    // Registrar la evidencia en la BD
    create: async (data) => {
        const { ticket_id, nombre_archivo, ruta_archivo, tipo_mime } = data;
        const [result] = await db.query(
            'INSERT INTO ticket_evidencias (ticket_id, nombre_archivo, ruta_archivo, tipo_mime) VALUES (?, ?, ?, ?)',
            [ticket_id, nombre_archivo, ruta_archivo, tipo_mime]
        );
        return result.insertId;
    },

    // Obtener todas las evidencias de un ticket
    findByTicketId: async (ticket_id) => {
        const [rows] = await db.query(
            'SELECT * FROM ticket_evidencias WHERE ticket_id = ? ORDER BY subido_at DESC',
            [ticket_id]
        );
        return rows;
    }
};

module.exports = TicketEvidence;