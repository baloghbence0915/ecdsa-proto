const BN = require('bn.js');

const Curves = {
    secp256k1: 'secp256k1',
    test1: 'test1',
    test2: 'test2'
};

const curvesArr = {
    [Curves.secp256k1]: {
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
    [Curves.test1]: {
        // https://crypto.stackexchange.com/questions/64456/problem-on-elliptic-curve-point-doubling/64457#64457?newreg=c94759dcaf10487693511769ebcc9acb
        a: 2,
        b: 2,
        G: {
            x: new BN(5),
            y: new BN(1)
        },
        p: new BN(17),
    },
    [Curves.test2]: {
        // diasor
        a: 5,
        b: 7,
        G: {
            x: new BN(2),
            y: new BN(5)
        },
        p: new BN(23),
    }
};

exports.Curves = Curves;
exports.curvesArr = curvesArr;
