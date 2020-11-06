const BN = require('bn.js');


const data = [
    {
        // Secp256k1
        a: 0,
        b: 7,
        G: {
            x: new BN('79BE667E F9DCBBAC 55A06295 CE870B07 029BFCDB 2DCE28D9 59F2815B 16F81798'.toLowerCase().replace(/\s/g, ''), 'hex'),
            y: new BN('483ADA77 26A3C465 5DA4FBFC 0E1108A8 FD17B448 A6855419 9C47D08F FB10D4B8'.toLowerCase().replace(/\s/g, ''), 'hex')
        },
        p: new BN('FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFE FFFFFC2F'.toLowerCase().replace(/\s/g, ''), 'hex'),
        expected: {
            // For doubling
            xr: 'c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5',
            yr: '1ae168fea63dc339a3c58419466ceaeef7f632653266d0e1236431a950cfe52a'
        }
    },
    {
        // https://crypto.stackexchange.com/questions/64456/problem-on-elliptic-curve-point-doubling/64457#64457?newreg=c94759dcaf10487693511769ebcc9acb
        a: 2,
        b: 2,
        G: {
            x: new BN(5),
            y: new BN(1)
        },
        p: new BN(17),
        expected: {
            // For doubling
            lambda: 'd',
            xr: '6',
            xy: '3'
        }
    },
    {
        // diasor
        a: 5,
        b: 7,
        G: {
            x: new BN(2),
            y: new BN(5)
        },
        p: new BN(23),
        expected: {
            // For doubling
            lambda: '4',
            xr: 'c',
            xy: '1'
        }
    }
];

function doubling(a, P, p, debug = false) {
    // console.log(P.x.toString('hex'));
    // console.log(P.x.pow(new BN(2)).toString('hex'));
    // console.log(P.x.pow(new BN(2)).muln(3).toString('hex'));
    // console.log(P.x.pow(new BN(2)).muln(3).addn(a).toString('hex'));
    const lambda = P.x.pow(new BN(2)).muln(3).addn(a).mul(P.y.muln(2).invm(p)).umod(p);
    // console.log('lambda:\t', lambda.toString('hex'));
    // console.log(lambda.pow(new BN(2)).toString('hex'));
    // console.log(lambda.pow(new BN(2)).sub(P.x.muln(2)).toString('hex'));
    const xr = lambda.pow(new BN(2)).sub(P.x.muln(2)).umod(p);
    // console.log('xr:\t', xr.toString('hex'));
    // console.log(lambda.mul(P.x.sub(xr)).toString('hex'));
    // console.log(lambda.mul(P.x.sub(xr)).sub(P.y).toString('hex'));
    const xy = lambda.mul(P.x.sub(xr)).sub(P.y).umod(p);
    // console.log('xy:\t', xy.toString('hex'));
    // console.log(expected);

    return {
        lambda: debug ? lambda.toString('hex') : lambda,
        xr: debug ? xr.toString('hex') : xr,
        xy: debug ? xy.toString('hex') : xy
    }
}

function add(P, Q, p, debug = false) {
    const lambda = Q.y.sub(P.y).mul(Q.x.sub(P.x).invm(p)).umod(p);
    const xr = lambda.pow(new BN(2)).sub(P.x).sub(Q.x).umod(p);
    const xy = lambda.mul(P.x.sub(xr)).sub(P.y).umod(p);

    return {
        lambda: debug ? lambda.toString('hex') : lambda,
        xr: debug ? xr.toString('hex') : xr,
        xy: debug ? xy.toString('hex') : xy
    }
}

for (const d of data) {
    const {
        a,
        G,
        p,
        expected
    } = d;

    console.log(doubling(a, G, p, true), '\t\t// doubling');
    console.log(expected, '\t\t// expected');
}

const {
    G,
    p
} = data[2];

const Q = {
    x: new BN(12),
    y: new BN(1)
};

console.log(add(G, Q, p, true));


// Exports:
exports.doubling = doubling;
