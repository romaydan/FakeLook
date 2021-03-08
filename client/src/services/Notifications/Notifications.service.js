import { io } from 'socket.io-client';

class NotificationService {
    constructor() {
        this.socket = io('http://localhost:5001', {
            reconnectionAttempts: 5
        });
        this.close = this.disconnect.bind(this);
        this.connect = this.connect.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
    }

    connect() {
        this.socket.connect();
    }

    subscribe(event, listener) {
        if(this.socket.connected) {
            this.socket.on(event, listener);
        }
    }

    unsubscribe(event, listener) {
        if(this.socket.connected) {
            this.socket.off(event, listener);
        }
    }

    disconnect() {
        this.socket.disconnect();
    }
}

const service = new NotificationService();

export default service;