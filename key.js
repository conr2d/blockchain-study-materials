import crypto from 'crypto';
import { keccak_256 } from '@noble/hashes/sha3';
import { bytesToHex as toHex } from '@noble/hashes/utils';
import { secp256k1 } from '@noble/curves/secp256k1';
import Mnemonic from 'bitcore-mnemonic';

// A valid private key for secp256k1 should be in the range between
// 1 and 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140
function createPrivateKey() {
    let privateKey;
    do {
        privateKey = crypto.randomBytes(32);
    } while (secp256k1.utils.isValidPrivateKey(privateKey) === false);
    return privateKey;
}

// Ethereum uses uncompressed public key for address derivation.
function createPublicKey(privateKey, compressed = false) {
    return Buffer.from(secp256k1.getPublicKey(privateKey, compressed));
}

function createAddress(publicKey) {
    const hash = toHex(keccak_256(publicKey.slice(1)));
    return '0x' + hash.slice(24);
}

// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md#implementation
function toChecksumAddress (address) {
  address = address.toLowerCase().replace('0x', '');
  let hash = toHex(keccak_256(address));
  let ret = '0x';

  for (let i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase();
    } else {
      ret += address[i];
    }
  }

  return ret;
}

function privateKeyToAddress(privateKey) {
  const publicKey = createPublicKey(privateKey);
  const address = createAddress(publicKey);
  return toChecksumAddress(address);
}

// 12 words = 128bit entropy
// 24 words = 256bit entropy
function createMnemonic(numWords = 12) {
  if (numWords < 12 || numWords > 24 || numWords % 3 !== 0) {
    throw new Error('invalid number of words');
  }
  const entropy = 128 + ((numWords - 12) / 3 * 4) * 8;
  return new Mnemonic(entropy);
}

// https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
// https://github.com/satoshilabs/slips/blob/master/slip-0044.md
function mnemonicToPrivateKey(mnemonic) {
  const privateKey = mnemonic.toHDPrivateKey().derive("m/44'/60'/0'/0/0").privateKey;
  return Buffer.from(privateKey.toString(), 'hex');
}

export default {
  createPrivateKey,
  createPublicKey,
  createAddress,
  toChecksumAddress,
  privateKeyToAddress,
  createMnemonic,
  mnemonicToPrivateKey,
};
