import { Chess } from '../../node_modules/chess.js/chess';
import fs from 'fs';
const database = JSON.parse(fs.readFileSync('./database.json', 'utf8'));
const INITIAL_STATE = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
function parse(node, fenb, parentFen, rank) {
    const fenbase = fenb ?? [];
    const chess = new Chess(parentFen ?? INITIAL_STATE);
    if (node.m) {
        chess.move(node.m)
    }
    const fen = chess.fen();
    fenbase.push({
        m: node.m,
        n: node.n,
        e: node.e,
        c: node.c,
        fen: parentFen,
        currentFen: fen,
        r: (rank ?? 0) * 100
    });
    node.s.forEach((s, i) => {
        parse(s, fenbase, fen, i + 1)
    })
    return fenbase;
}

const fenbase = parse(database);

fs.writeFileSync('normalized.json', JSON.stringify(fenbase))
