const MongoClient = require('mongodb').MongoClient;

const CONNECTION_STRING = process.env.CONNECTION_STRING || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'logs'


class DbConnection {
    constructor() {
        MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, ((err, client) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }

            this.client = client;

            // Storing a reference to the database so you can use it later
            this.db = this.client.db(DB_NAME);

            console.log(`Connected MongoDB: ${CONNECTION_STRING}`);
            console.log(`Database: ${DB_NAME}`);

        }).bind(this));

        this.dispose = this.dispose.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getOneBy = this.getOneBy.bind(this);
        this.getOneById = this.getOneById.bind(this);
        this.insertMany = this.insertMany.bind(this);
        this.insertOne = this.insertOne.bind(this);
        this.removeMany = this.removeMany.bind(this);
        this.removeOne = this.removeOne.bind(this);
        this.updateMany = this.updateMany.bind(this);
        this.updateOneById = this.updateOneById.bind(this);
    }

    async insertOne(collectionName, item) {
        const doc = await this.db.collection(collectionName).insertOne(item);
        return doc.insertedId.toString();
    }

    insertMany(collectionName, items) {
        return this.db.collection(collectionName).insertMany(items)
            .then(res => Object.values(res.insertedIds).map(id => id.toString()));
    }

    removeOne(collectionName, id) {
        return this.db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });
    }

    removeMany(collectionName, filter) {
        if (!filter || filter == {}) {
            throw new Error('query musn\'t be empty!');
        }

        return this.db.collection(collectionName).deleteMany(filter);
    }

    updateOneById(collectionName, updatedItem) {
        const filter = { _id: new ObjectId(updatedItem._id) };
        delete updatedItem._id;

        const update = { $set: { ...updatedItem } };

        return this.db.collection(collectionName).updateOne(filter, update);
    }

    updateMany(collectionName, query, updatedValues) {
        if (!query || query == {}) {
            throw new Error('query musn\'t be empty!');
        }

        const update = { $set: updatedValues };
        return this.db.collection(collectionName).updateMany(query, update);
    }

    getAll(collectionName, query = {}) {
        return this.db.collection(collectionName).find(query).toArray();
    }

    getOneById(collectionName, id) {
        return this.db.collection(collectionName).findOne({ _id: new ObjectId(id) });
    }

    getOneBy(collectionName, filter) {
        return this.db.collection(collectionName).findOne(filter);
    }

    dispose() {
        this.client.close();
    }
}

module.exports = DbConnection;