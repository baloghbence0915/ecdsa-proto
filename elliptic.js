const { hash } = require('./index');
const BN = require('bn.js');

var EC = require('elliptic').ec;
 
// Create and initialize EC context
// (better do it once and reuse it)
var ec = new EC('secp256k1');
 
// Generate keys
const privateKey = new BN('a69591c3ac67de5ed31fb4934dfd3890578a31afabbc10587fca620d9175ec46', 'hex');

var key = ec.keyFromPrivate(privateKey.toBuffer());
console.log(key.getPublic().getX().toString('hex'));
console.log(key.getPublic().getY().toString('hex'));
 
// Sign the message's hash (input must be an array, or a hex-string)
var msgHash = hash({ secret: 'xxx' })
var signature = key.sign(msgHash, { k: () => new BN(1234567890) });
console.log(signature.r.toString('hex'), signature.s.toString('hex'));
 
// Export DER encoded signature in Array
// var derSign = signature.toDER();
 
// Verify signature
// console.log(key.verify(msgHash, derSign));
 
// CHECK WITH NO PRIVATE KEY
 
// var pubPoint = key.getPublic();
// var x = pubPoint.getX();
// var y = pubPoint.getY();
 
// Public Key MUST be either:
// 1) '04' + hex string of x + hex string of y; or
// 2) object with two hex string properties (x and y); or
// 3) object with two buffer properties (x and y)
// var pub = pubPoint.encode('hex');                                 // case 1
// var pub = { x: x.toString('hex'), y: y.toString('hex') };         // case 2
// var pub = { x: x.toBuffer(), y: y.toBuffer() };                   // case 3
// var pub = { x: x.toArrayLike(Buffer), y: y.toArrayLike(Buffer) }; // case 3
 
// Import public key
// var key = ec.keyFromPublic(pub, 'hex');
 
// Signature MUST be either:
// 1) DER-encoded signature as hex-string; or
// 2) DER-encoded signature as buffer; or
// 3) object with two hex-string properties (r and s); or
// 4) object with two buffer properties (r and s)
 
// var signature = '3046022100...'; // case 1
// var signature = new Buffer('...'); // case 2
// var signature = { r: 'b1fc...', s: '9c42...' }; // case 3
 
// Verify signature
// console.log(key.verify(msgHash, signature));
