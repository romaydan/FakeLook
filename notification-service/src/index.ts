import env from 'dotenv';
import { createClient } from 'redis';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import ClientManager from './services/client.manager.service';
import TYPES from './notification.types';

env.config();

const PORT = process.env.PORT || 5001;
const server = createServer();
const redisClient = createClient();
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
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

    socket.on('disconnect', () => {
        const client = clientManager.getClientBySocketId(socket.id);

        if (client) {
            console.log(`User: ${client.userId}, Socket: ${client.socket.id} has disconnected!`);
            clientManager.removeClient(client.userId);
        }
    });
});

//Redis pub/sub
redisClient.on('message', (channel: string, data: string) => {
    const notification = JSON.parse(data);

    switch (notification.type) {
        case TYPES.ADD_COMMENT:
        case TYPES.REMOVE_COMMENT:
        case TYPES.UPDATE_COMMENT:
        case TYPES.ADD_LIKE:
        case TYPES.REMOVE_LIKE:
        case TYPES.ADD_TAG:
        case TYPES.REMOVE_TAG:
        case TYPES.ADD_USERTAG:
        case TYPES.REMOVE_USERTAG:
            notifyAll(notification.event, notification);
            break;
        default:
            notifyUser(notification.event, notification);
            break;
    }
});

const notifyAll = (event: string, notification: any) => {
    io.emit(event, notification);
}

const notifyUser = (userId: string, notification: object) => {
    const client = clientManager.getClientByUserId(userId);
    client.socket.emit(userId, notification);
}

redisClient.subscribe('notification');

server.listen(PORT, () => {
  console.log(`Server now listening on port ${PORT}...`);
});
