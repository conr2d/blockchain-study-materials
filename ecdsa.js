import crypto from "crypto";
import secp256k1 from "secp256k1";
import createKeccakHash from "keccak";
import key from "./key.js";
import Web3 from "web3";

function sign(message, privateKey) {
    const hash = crypto.createHash("sha256").update(message).digest();
    return secp256k1.ecdsaSign(hash, privateKey);
}

function recover(message, signature) {
    const hash = crypto.createHash("sha256").update(message).digest();
    return Buffer.from(secp256k1.ecdsaRecover(signature.signature, signature.recid, hash, false));
}

function ethSign(message, privateKey) {
    const prefix = "\x19Ethereum Signed Message:\n" + message.length;
    const buffer = Buffer.from(prefix + message);
    const hash = createKeccakHash("keccak256").update(buffer).digest();
    return secp256k1.ecdsaSign(hash, privateKey);
}

function ethRecover(message, signature) {
    const prefix = "\x19Ethereum Signed Message:\n" + message.length;
    const buffer = Buffer.from(prefix + message);
    const hash = createKeccakHash("keccak256").update(buffer).digest();
    const publicKey = Buffer.from(secp256k1.ecdsaRecover(signature.signature, signature.recid, hash, false));
    const address = key.createAddress(publicKey);
    return key.toChecksumAddress(address);
}

export default {
    sign,
    recover,
    ethSign,
    ethRecover,
};