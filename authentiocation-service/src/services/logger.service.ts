import { injectable } from "inversify";
import { createClient, RedisClient } from 'redis';

export interface ILogger {
    log(log: any): void;
    error(error: any): void;
}

@injectable()
export class RedisPubSubLogger implements ILogger {
    private client: RedisClient;

    constructor() {
        this.client = createClient({
            host: process.env.REDIS_HOST ?? '127.0.0.1'
        });
    }

    log(log: any): void {
        this.client.publish('log', JSON.stringify({ ...log, type: 'log', time: new Date().toUTCString() }), (err, rep) => {
            if (err)
                console.error(err);
        })
    }

    error(error: any): void {
        this.client.publish('log', JSON.stringify({ ...error, type: 'error', time: new Date().toUTCString() }), (err, rep) => {
            if (err)
                console.error(err);
        })
    }

}