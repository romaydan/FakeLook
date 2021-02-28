import env from 'dotenv';
import { createClient } from 'redis';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import ClientManager from './services/client.manager.service';

env.config();

const PORT = process.env.PORT || 5003;
const server = createServer();
const redisClient = createClient();
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const clientManager = new ClientManager();

//Socket.io
io.on('connection', (socket: Socket) => {

    socket.on('init', (userId: string) => {
        const client = clientManager.addClient(userId, socket);
        console.log(`User: ${client.userId}, Socket: ${client.socket.id} has connected!`);
    });

    socket.on('disconnect', () => {
        const client = clientManager.getClientBySocketId(socket.id);
        
        if(client) {
            console.log(`User: ${client.userId}, Socket: ${client.socket.id} has disconnected!`);
            clientManager.removeClient(client.userId);
        }
    });
});


//Redis pub/sub
redisClient.on('message', (channel: string, message: string) => {
    if (channel === 'notification') {
        const { userIds, notification } = JSON.parse(message);
        userIds.forEach(userId => {
            notifyUser(userId, notification);
        })
    }
});

const notifyUser = (userId: string, notification: object) => {
    const client = clientManager.getClientByUserId(userId);
    client.socket.emit('notification', notification);
}

redisClient.subscribe('notification');

server.listen(PORT, () => {
    console.log(`Server now listening on port ${PORT}...`);
});