const Ticket = require('../models/ticketModel');

const crearTicket = async (req, res, next) => {
    try {
        const { titulo, descripcion, prioridad, categoria } = req.body;
        
        // El ID del usuario viene del Token (req.user.id) gracias al authMiddleware
        const nuevoId = await Ticket.create({
            usuario_id: req.user.id, 
            titulo, 
            descripcion, 
            prioridad, 
            categoria
        });

        res.status(201).json({ 
            status: 'success', 
            message: 'Ticket creado exitosamente',
            ticketId: nuevoId 
        });
    } catch (error) {
        next(error);
    }
};

const listarTickets = async (req, res, next) => {
    try {
        let tickets;
        // Si es Admin o Técnico, ve todo. Si es Funcionario, solo lo suyo.
        if (req.user.rol === 'admin' || req.user.rol === 'tecnico') {
            tickets = await Ticket.findAll();
        } else {
            tickets = await Ticket.findByUserId(req.user.id);
        }

        res.json({ status: 'success', data: tickets });
    } catch (error) {
        next(error);
    }
};

const obtenerTicket = async (req, res, next) => {
    try {
        const { id } = req.params;
        const ticket = await Ticket.findById(id);

        if (!ticket) {
            const error = new Error('Ticket no encontrado');
            error.statusCode = 404;
            throw error;
        }

        // Validación de seguridad:
        // Si es funcionario, SOLO puede ver SU ticket. Admin/Tecnico ven cualquiera.
        if (req.user.rol === 'funcionario' && ticket.usuario_id !== req.user.id) {
            const error = new Error('No tienes permiso para ver este ticket');
            error.statusCode = 403;
            throw error;
        }

        res.json({ status: 'success', data: ticket });
    } catch (error) {
        next(error);
    }
};

const actualizarTicket = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { estado, tecnico_id, prioridad, categoria } = req.body;

        // 1. Verificar que el ticket existe
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            const error = new Error('Ticket no encontrado');
            error.statusCode = 404;
            throw error;
        }

        // 2. Lógica de Negocio (Solo Admin y Tecnicos pueden editar gestión)
        if (req.user.rol === 'funcionario') {
            const error = new Error('No tienes permisos para gestionar tickets');
            error.statusCode = 403;
            throw error;
        }

        // 3. Preparar datos para actualizar (Modelo dinámico simple)
        // Nota: Idealmente esto iría en el Model, pero lo haremos aquí para agilizar
        // Vamos a necesitar agregar un método 'update' en ticketModel.js
        
        const cambios = {
            estado: estado || ticket.estado,
            tecnico_id: tecnico_id || ticket.tecnico_id, // Asignar técnico
            prioridad: prioridad || ticket.prioridad,
            categoria: categoria || ticket.categoria
        };

        // Llamamos al modelo (que crearemos abajo)
        await Ticket.update(id, cambios);

        res.json({ 
            status: 'success', 
            message: 'Ticket actualizado correctamente',
            data: cambios
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { crearTicket, listarTickets, obtenerTicket, actualizarTicket };