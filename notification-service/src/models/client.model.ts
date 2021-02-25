import { Socket } from 'socket.io';

export interface IClient {
    socket: Socket;
    userId: string;
}

export class Client implements IClient {
    constructor(public socket: Socket, public userId: string) {
    }
}