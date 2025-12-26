const http = require('http');
const app = require('./app');
const config = require('./config/config');
const socketService = require('./services/socketService');

// 1. Crear el servidor HTTP nativo usando Express como handler
const server = http.createServer(app);

// 2. Inicializar Socket.IO sobre el servidor HTTP
socketService.init(server);

// 3. Iniciar el servidor en el puerto configurado (usamos server.listen en lugar de app.listen)
server.listen(config.PORT, () => {
    console.log(`🚀 Servidor corriendo en: http://localhost:${config.PORT}`); // <--- URL Clickeable
    console.log(`🌍 Entorno: ${config.NODE_ENV}`);
    console.log(`🔌 WebSockets: Activos`);
});