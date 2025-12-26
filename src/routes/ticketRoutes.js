const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Todas las rutas de tickets requieren autenticación
router.use(verificarToken);

// POST /api/tickets -> Crear ticket
router.post('/', ticketController.crearTicket);

// GET /api/tickets -> Listar tickets (con filtro automático por rol)
router.get('/', ticketController.listarTickets);

// GET /api/tickets/:id -> Ver detalle
router.get('/:id', ticketController.obtenerTicket);

// PUT /api/tickets/:id -> Actualizar (Asignar, Cerrar, Cambiar prioridad)
router.put('/:id', ticketController.actualizarTicket);

module.exports = router;