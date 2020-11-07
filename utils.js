const BN = require('bn.js');
const crypto = require('crypto');

function hash (obj) {
    return new BN(crypto.createHash('sha256').update(JSON.stringify(obj)).digest());
}

function printable(P) {
    if (P && P.x && P.y) {
        return {
            x: P.x.toString('hex'),
            y: P.y.toString('hex')
        };    
    } else if (P && P.r && P.s) {
        return {
            r: P.r.toString('hex'),
            s: P.s.toString('hex')
        };
    }
}

exports.hash = hash;
exports.printable = printable;
