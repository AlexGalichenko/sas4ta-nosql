import express from 'express';
import DB from './src/db/DB.js';

const key = process.env.X_API_KEY;
const app = express();
const database = new DB();

app.use(async function(req, res, next) {
    const actualXApiKey = req.header('x-api-key');
    if (key && actualXApiKey !== key) {
        res.status(401);
        res.end();
    } else {
        next();
    }
});

app.use(async function(req, res, next) {
    try {
        await database.connection;
        next();
    } catch (e) {
        res.status(500);
        res.json(e);
    }
});

app.get('/api/fendata', async function (req, res) {
    const fenData = await database.getFen(req.query.fen);
    res.status(200);
    res.json(fenData);
});

app.get('/api/fenbase', async function (req, res) {
    const fenBase = await database.getFenBase();
    res.status(200);
    res.json(fenBase);
});

app.get('/api/base', async function (req, res) {
    const base = await database.getBase();
    res.status(200);
    res.json(base);
})

app.listen(process.env.PORT ?? 3000);
