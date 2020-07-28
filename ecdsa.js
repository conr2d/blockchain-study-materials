import secp256k1 from "secp256k1";
import createKeccakHash from "keccak";

function hashMessage(message) {
  return createKeccakHash("keccak256").update(message).digest();
  // return crypto.createHash("sha256").update(message).digest();
}

function sign(message, privateKey) {
    const hash = hashMessage(message);
    return secp256k1.ecdsaSign(hash, privateKey);
}

function recover(message, signature) {
    const hash = hashMessage(message);
    return Buffer.from(secp256k1.ecdsaRecover(signature.signature, signature.recid, hash, false));
}

export default {
    sign,
    recover,
};
