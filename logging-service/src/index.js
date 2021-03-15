const { createClient } = require('redis');
const DbConnection = require('./db');

const CHANNEL = 'log';
const client = createClient();
const db = new DbConnection();

client.on('connect', () => {
    console.log('\nConnected to redis! \n');

    client.on('message', (channel, data) => {
        if (channel === CHANNEL) {
            const log = JSON.parse(data);
            db.insertOne('logs', log)
                .then(id => console.log('New log id: ', id));
        }
    });

    client.on('error', () => {
        db.dispose();
        client.end();
        process.exit(1);
    });

    client.subscribe(CHANNEL);
});
