const socketIo = require('socket.io');

let io;

const init = (httpServer) => {
    io = socketIo(httpServer, {
        cors: {
            origin: "*", // En producción, pon aquí tu dominio real (ej: https://mahosalud.cl)
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('🔌 Nuevo cliente conectado:', socket.id);

        // Aquí podemos escuchar eventos del cliente si fuera necesario
        // socket.on('disconnect', () => { ... });
    });

    return io;
};

// Función para obtener la instancia desde otros archivos (Controladores)
const getIo = () => {
    if (!io) {
        throw new Error('Socket.io no está inicializado');
    }
    return io;
};

module.exports = { init, getIo };