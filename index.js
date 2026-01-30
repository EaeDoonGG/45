const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

// Armazena players: { uuid: { nick, version } }
let activePlayers = new Map();

wss.on('connection', (ws) => {
    console.log('Nova conexão estabelecida');

    ws.on('message', (data) => {
        try {
            const msg = JSON.parse(data);

            // Quando o Client do Minecraft loga
            if (msg.type === 'login') {
                ws.isPlayer = true;
                ws.playerUUID = msg.uuid;
                activePlayers.set(msg.uuid, { nick: msg.nick, version: msg.version || '1.8.9' });
                broadcastUpdate();
            }
        } catch (e) {
            console.error("Erro no parse do JSON");
        }
    });

    ws.on('close', () => {
        if (ws.isPlayer && ws.playerUUID) {
            activePlayers.delete(ws.playerUUID);
            broadcastUpdate();
        }
    });
});

function broadcastUpdate() {
    const payload = JSON.stringify({
        type: 'status_update',
        activeSessions: activePlayers.size,
        timestamp: new Date().toLocaleTimeString()
    });

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}

console.log(`Servidor Shindo rodando na porta ${PORT}`);
