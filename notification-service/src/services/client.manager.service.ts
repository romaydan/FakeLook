import { IClient, Client } from '../models/client.model';
import { Socket } from 'socket.io';

interface Dictionary<TValue>  { 
    [key: string] : TValue 
}


class ClientManager {
    private clients: Dictionary<IClient> = {};
    private socketIdToUserId: Dictionary<string> = {};
    constructor() {
        this.addClient = this.addClient.bind(this);
        this.removeClient = this.removeClient.bind(this);
        this.getClientByUserId = this.getClientByUserId.bind(this);
        this.getClientBySocketId = this.getClientBySocketId.bind(this);
    }

    addClient(userId: string, socket: Socket): IClient {
        const client: IClient = new Client(socket, userId)
        this.clients[userId] = client;
        this.socketIdToUserId[socket.id] = userId;
        return client;
    }

    getClientByUserId(userId: string): IClient {
        return this.clients[userId];
    }

    getClientBySocketId(socketId: string) : IClient {
        const userId = this.socketIdToUserId[socketId];
        return this.clients[userId];
    }

    removeClient(userId: string): boolean {
       const result = delete this.clients[userId];
       return result;
    }
}

export default ClientManager;