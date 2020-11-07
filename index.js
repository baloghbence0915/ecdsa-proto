const BN = require('bn.js');
const crypto = require('crypto')

const curves = [
    {
        // Secp256k1
        a: 0,
        b: 7,
        G: {
            x: new BN('79BE667E F9DCBBAC 55A06295 CE870B07 029BFCDB 2DCE28D9 59F2815B 16F81798'.toLowerCase().replace(/\s/g, ''), 'hex'),
            y: new BN('483ADA77 26A3C465 5DA4FBFC 0E1108A8 FD17B448 A6855419 9C47D08F FB10D4B8'.toLowerCase().replace(/\s/g, ''), 'hex')
        },
        p: new BN('FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFE FFFFFC2F'.toLowerCase().replace(/\s/g, ''), 'hex'),
        n: new BN('FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFE BAAEDCE6 AF48A03B BFD25E8C D0364141'.toLowerCase().replace(/\s/g, ''), 'hex'),
        h: 1
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
    }
];

function hash (obj) {
    return new BN(crypto.createHash('sha256').update(JSON.stringify(obj)).digest());
}

function clone(P) {
    return P && P.x && P.y && {
        x: P.x.clone(),
        y: P.y.clone()
    };
}

function printable(P) {
    return P && P.x && P.y && {
        x: P.x.toString('hex'),
        y: P.y.toString('hex')
    };
}

function doubling(a, P, p) {
    const lambda = P.x.pow(new BN(2)).muln(3).addn(a).mul(P.y.muln(2).invm(p)).umod(p);
    const xr = lambda.pow(new BN(2)).sub(P.x.muln(2)).umod(p);
    const yr = lambda.mul(P.x.sub(xr)).sub(P.y).umod(p);

    return {
        x: xr,
        y: yr
    }
}

function add(a, P, Q, p) {
    if (!Q && !P) {
        return null;
    } else if (!P && Q) {
        return clone(Q)
    } else if (!Q && P) {
        return clone(P);
    } else if (P.x.eq(Q.x) && P.y.eq(Q.y)) {
        return doubling(a, P, p);
    }

    const lambda = Q.y.sub(P.y).mul(Q.x.sub(P.x).invm(p)).umod(p);
    const xr = lambda.pow(new BN(2)).sub(P.x).sub(Q.x).umod(p);
    const yr = lambda.mul(P.x.sub(xr)).sub(P.y).umod(p);

    return {
        x: xr,
        y: yr
    }
}

function mul(a, P, n, p) {
    if (n.ltn(2)) {
        const copy = clone(P);
        return {
            x: debug ? copy.x.toString('hex') : copy.x,
            y: debug ? copy.y.toString('hex') : copy.y
        };
    }

    const bin = n.toString(2);

    let N = P;
    let Q = null;

    for (let i = bin.length - 1; i >= 0; i--) {
        if (bin[i] === '1') {
            Q = add(a, Q, N, p);
        }
        N = doubling(a, N, p);
    }



    // let R = P;
    // let i = new BN(1);
    // while (i.lt(n)) {
    //     const addition = add(a, R, P, p);
    //     R = { x: addition.xr.clone(), y: addition.yr.clone() }

    //     i.addn(1);
    // }

    return {
        x: Q.x,
        y: Q.y
    };
}

// for (const d of data) {
//     const {
//         a,
//         G,
//         p,
//         expected
//     } = d;

//     console.log(doubling(a, G, p, true), '\t\t// doubling');
//     console.log(expected, '\t\t// expected');
// }

// const {
//     G,
//     p
// } = data[2];

// const Q = {
//     x: new BN(12),
//     y: new BN(1)
// };

// console.log(add(G, Q, p, true), '\t\t// add');

const {
    a,
    G,
    p,
    n
} = curves[0];

const privateKey = new BN('a69591c3ac67de5ed31fb4934dfd3890578a31afabbc10587fca620d9175ec46', 'hex');
const publicKey = mul(a, G, privateKey, p);
const m = hash({ secret: 'xxx' });

let k = new BN(1234567890);
// let k = new BN(crypto.randomBytes(32));
// while (k.gte(n)) {
//     k = new BN(crypto.randomBytes(32));
// }

const R = mul(a,G,k,p);
const r = R.x;

// const s = m.add(privateKey.mul(r)).mul(k.invm(n)).mod(p)
const s = k.invm(n).mul(m.add(privateKey.mul(r))).mod(n);

const w = s.invm(n);

const [u1, u2] = [
    w.mul(m).mod(n),
    w.mul(r).mod(n)
];

const PP = add(a, mul(a, G, u1, p), mul(a, publicKey, u2, p), p);

console.log(
    {
        privateKey: privateKey.toString('hex'),
        publicKey: printable(publicKey),
        m: m.toString('hex'),
        k: k.toString('hex'),
        R: printable(R),
        s: s.toString('hex'),
        PP: printable(PP),
        xPmodp: PP.x.mod(p).toString('hex'),
        rmodp: r.mod(p).toString('hex'),
        valid: PP.x.mod(p).toString('hex') === r.mod(p).toString('hex')
    }
);



// Exports:
exports.doubling = doubling;
exports.hash = hash;
