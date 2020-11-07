const BN = require('bn.js');
const crypto = require('crypto');

const { curvesArr } = require('./curves');

class EllipticCurve {

    constructor(curve) {
        this.curve = curvesArr[curve];
    }

    setPrivatekey(privateKey) {
        this.privateKey = privateKey;
    }

    getPublickey() {
        const { G } = this.curve;

        if (!this.publickey) {
            this.publickey = this.mul(G, this.privateKey);
        }

        return this.publickey;
    }

    getSignature(m, kk) {
        const { G, n } = this.curve;
        let k = kk;

        if (!k) {
            do {
                k = new BN(crypto.randomBytes(32));
            } while (k.gte(n))   
        }

        const R = this.mul(G, k);
        const r = R.x;
        const s = k.invm(n).mul(m.add(this.privateKey.mul(r))).mod(n);

        return { r, s };
    }

    verifySignature(m, signature) {
        const { G, n, p } = this.curve;
        const { r, s } = signature;
        const w = s.invm(n);

        const [u1, u2] = [
            w.mul(m).mod(n),
            w.mul(r).mod(n)
        ];
        
        const P = this.add(this.mul(G, u1), this.mul(this.getPublickey(), u2));

        const valid = P.x.mod(p).toString('hex') === r.mod(p).toString('hex')

        return valid;
    }


    //utilities
    doubling(P) {
        const { a, p } = this.curve;
        const lambda = P.x.pow(new BN(2)).muln(3).addn(a).mul(P.y.muln(2).invm(p)).umod(p);
        const xr = lambda.pow(new BN(2)).sub(P.x.muln(2)).umod(p);
        const yr = lambda.mul(P.x.sub(xr)).sub(P.y).umod(p);

        return {
            x: xr,
            y: yr
        };
    }

    add(P, Q) {
        const { a, p } = this.curve;
        if (!Q && !P) {
            return null;
        } else if (!P && Q) {
            return this.clone(Q)
        } else if (!Q && P) {
            return this.clone(P);
        } else if (P.x.eq(Q.x) && P.y.eq(Q.y)) {
            return this.doubling(P);
        }

        const lambda = Q.y.sub(P.y).mul(Q.x.sub(P.x).invm(p)).umod(p);
        const xr = lambda.pow(new BN(2)).sub(P.x).sub(Q.x).umod(p);
        const yr = lambda.mul(P.x.sub(xr)).sub(P.y).umod(p);

        return {
            x: xr,
            y: yr
        }
    }

    mul(P, n) {
        const { a, p } = this.curve;

        if (n.ltn(2)) {
            return this.clone(P);
        }

        const bin = n.toString(2);

        let N = this.clone(P);
        let Q = null;

        for (let i = bin.length - 1; i >= 0; i--) {
            if (bin[i] === '1') {
                Q = this.add(Q, N);
            }
            N = this.doubling(N);
        }

        return {
            x: Q.x,
            y: Q.y
        };
    }

    clone(P) {
        return P && P.x && P.y && {
            x: P.x.clone(),
            y: P.y.clone()
        };
    }
}

exports.EllipticCurve = EllipticCurve;