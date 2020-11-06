const {
    curve,
    p
} = require('./index');

function testCurve() {
    console.log(`Start test secp256k1 curve\n`);

    const X = [-2, (Math.cbrt(-7) + 0.000000000000001), -1, 0, 1, 2, 3, 4];

    for (const x of X) {
        console.log(`x: ${x};\ty: ${curve(x)}`);
    }

    console.log(`\nEnd test secp256k1 curve\n`);
}

function testP() {
    console.log(`Start test p value\n`);
    const buffer = Buffer.from([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 254, 255, 255, 252, 47]);
    const fromBuffer = Number.parseInt(buffer.toString('hex'), 16);
    // console.log(buffer.toString('hex'));
    // console.log(p, p.toString(16), Number.parseInt(p.toString(16), 16));
    // console.log(p === Number.parseInt(p.toString(16), 16));
    console.log(`${p} should be: ${fromBuffer}`);
    console.log(p === fromBuffer);
    console.log(`Hex:\t\t${buffer.toString('hex')}`);
    console.log(`Const hex:\tfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f`);

    console.log(`\nEnd test p value\n`);
}

const crypto = require('crypto')
const privateKey = Number.parseInt(crypto.randomBytes(32).toString('hex'), 16);
console.log(crypto.randomBytes(32).toString('hex'));

testCurve();
testP();