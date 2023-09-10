import { keccak_256 } from '@noble/hashes/sha3';
import { secp256k1 } from '@noble/curves/secp256k1';

function hashMessage(message) {
  return keccak_256(message);
  // return sha256(message);
}

function sign(message, privateKey) {
  const hash = hashMessage(message);
  return secp256k1.sign(hash, privateKey);
}

function recover(message, signature) {
  const hash = hashMessage(message);
  return Buffer.from(signature.recoverPublicKey(hash).toRawBytes(false));
}

export default {
    sign,
    recover,
};
