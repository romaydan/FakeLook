import { injectable } from "inversify";
import { createClient, RedisClient } from 'redis';

export interface INotificationService {
    publish(notification: { event: string, type: string, payload: any });
}

@injectable()
export class NotificationService implements INotificationService {
    private client: RedisClient = createClient();

    constructor() {
        try {
            this.publish = this.publish.bind(this);
            this.client = createClient();

        } catch (error) { console.log(error); }
    }

    publish(notification: { event: string, type: string, payload: any }) {
        if (this.client)
            this.client.publish('notification', JSON.stringify(notification), (err, replay) => {
                err ? console.log(err) : console.log('replay:', replay);
            });
    }
}