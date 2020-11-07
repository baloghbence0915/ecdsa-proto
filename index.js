const BN = require('bn.js');
const ECTest = require('elliptic').ec;
const crypto = require('crypto');
 
const { Curves } = require('./curves');
const { EllipticCurve } = require('./ec');
const { hash, printable } = require('./utils');

// Some common preset:
const privateKey = new BN(crypto.randomBytes(32));
const msg = hash({ secret: 'xxx' });
const k = new BN(1234567890);

// My implemntation:
const ec = new EllipticCurve(Curves.secp256k1);
ec.setPrivatekey(privateKey);
const publicKey = ec.getPublickey();
const signature = ec.getSignature(msg, k );
const isValid = ec.verifySignature(msg,  signature);

// Check by elliptic package:
const ec2 = new ECTest('secp256k1');
const keyPair = ec2.keyFromPrivate(privateKey.toBuffer());
const signature2 = keyPair.sign(msg, { k: () => k });
const isValid2 = keyPair.verify(msg, signature2);

console.log('************************ Private Key ***************************');
console.log(privateKey.toString('hex'));
console.log('****************************************************************\n');
console.log('************************ Public Keys ***************************');
console.log('#1: x:', printable(publicKey).x, '\ty:', printable(publicKey).y);
console.log('#2: x:', keyPair.getPublic().getX().toString('hex'), '\ty:', keyPair.getPublic().getY().toString('hex'));
console.log('****************************************************************\n');
console.log('************************* Signatures ***************************');
console.log('#1: s:', printable(signature).s, '\tr:', printable(signature).r);
console.log('#2: s:', signature2.s.toString('hex'), '\tr:', signature2.r.toString('hex'));
console.log('****************************************************************\n');
console.log('************************ Verifications *************************');
console.log('#1: s:', isValid);
console.log('#2: s:', isValid2);

