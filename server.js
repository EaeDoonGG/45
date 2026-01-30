const WebSocket = require('ws');

// Porta padrão ou a fornecida pela hospedagem
const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

// Mapa para guardar jogadores: { uuid: { nick: string, socket: ws } }
const activePlayers = new Map();

wss.on('connection', (ws) => {
    console.log('Novo client conectado ao Shindo Network');

    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);

            if (message.type === 'login') {
                // Adiciona o player à lista global
                activePlayers.set(message.uuid, { 
                    nick: message.nick, 
                    socket: ws 
                });
                console.log(`Player ${message.nick} está online.`);
                broadcastStatus();
            }
        } catch (e) {
            console.error("Erro ao processar mensagem");
        }
    });

    ws.on('close', () => {
        // Remove o player quando ele fecha o Minecraft
        for (let [uuid, player] of activePlayers.entries()) {
            if (player.socket === ws) {
                activePlayers.delete(uuid);
                break;
            }
        }
        broadcastStatus();
    });
});

// Envia para todos o status atual (o que aparece no seu dashboard)
function broadcastStatus() {
    const status = {
        type: 'status_update',
        activeSessions: activePlayers.size,
        players: Array.from(activePlayers.values()).map(p => p.nick)
    };
    const payload = JSON.stringify(status);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}

console.log(`WebSocket Server rodando na porta ${PORT}`);