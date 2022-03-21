import { MongoClient } from 'mongodb';

export default class DB {
    uri = process.env.MONGO_URI;
    dbName = 'chess';
    collectionName = 'chess-collection';
    client = new MongoClient(this.uri);
    db = this.client.db(this.dbName);
    collection = this.db.collection(this.collectionName);
    connection = this.client.connect();

    async getFen(fen) {
        const fenData = await this.collection
            .find({fen})
            .sort({r: 1})
            .limit(1)
            .toArray()
        const fenRecord = fenData.pop();
        if (!fenRecord) return {}
        return {
            fen: fenRecord.fen,
            bestMove: fenRecord.m,
            score: fenRecord.e.v,
            depth: fenRecord.e.d,
            sp: fenRecord.e.v * 100
        }
    }

    async getFenBase() {
        const data = await this.collection.aggregate([
            {
                $sort: { r: 1 }
            },
            {
                $group: {
                    _id: '$fen',
                    bestMove: { $first: { bestMove: '$m', score: '$e.v', depth: '$e.d' } }
                }
            }])
            .toArray()

        return data.map(fen => ([fen._id, { ...fen.bestMove }]))
    }

    async getBase() {
        const data = await this.collection
            .find({})
            .sort({r: 1})
            .limit(0)
            .toArray();
        for (const fenRecord of data) {
            const parentRecord = data.find(fen => fen.currentFen === fenRecord.fen);
            if (parentRecord) {
                if (!parentRecord.s) {
                    parentRecord.s = []
                }
                parentRecord.s.push(fenRecord)
            }
        }
        const root = data.find(fen => !fen.m);
        return this.formatBase(root)
    }

    formatBase(node) {
        delete node._id;
        delete node.fen;
        delete node.currentFen;
        delete node.r;
        if (node.s) {
            for (const child of node.s) {
                this.formatBase(child);
            }
        }
        return node
    }
}
