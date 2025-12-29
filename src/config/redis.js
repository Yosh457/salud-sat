const { createClient } = require('redis');
const config = require('./config');

const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.log('❌ Error en Redis Client', err));
client.on('connect', () => console.log('✅ Conectado a Redis'));

// Necesario en versiones modernas de node-redis
(async () => {
    if (config.NODE_ENV !== 'test') await client.connect();
})();

module.exports = client;