import { Chain, Common, Hardfork } from '@ethereumjs/common';
import { LegacyTransaction } from '@ethereumjs/tx';
import key from './key.js';
import ecdsa from './ecdsa.js';
import { bytesToHex as toHex } from '@noble/hashes/utils';

const privateKey = Buffer.from( /* Paste your private key here */ , 'hex');
const address = key.privateKeyToAddress(privateKey);

(async () => {
  let nonce;
  // You can set nonce manually here, or will fetch from chain
  // nonce = '0x0';

  if (!nonce) {
    const res = await fetch('https://rpc.sepolia.org', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getTransactionCount',
        id: 0,
        params: [address, 'latest'],
      }),
    });
    nonce = (await res.json()).result;
  }

  const chainId = 11155111; // sepolia
  const common = new Common({ chain: Chain.Sepolia, hardfork: Hardfork.Shanghai });
  let txParams = {
    nonce: nonce,
    gasPrice: 10000000000, // 10 Gwei
    gasLimit: 21000,
    to: /* Add destination address here */ ,
    value: '0x5AF3107A4000', // 0.0001 ETH
    // data: '0x' + Buffer.from('Hello Ethereum').toString('hex'),
    // simple ether transfer costs 21000 (0x5208) gas,
    // if you want to send transaction with data, increase gasLimit
  };
  let tx = LegacyTransaction.fromTxData(txParams, { common });

  let serializedTx = tx.serialize();
  serializedTx = Buffer.from([
    ...serializedTx.subarray(0, serializedTx.length - 3),
    0x83, 0xaa, 0x36, 0xa7, // EIP-155
    ...serializedTx.subarray(serializedTx.length - 2),
  ]);
  serializedTx[0] += 3;

  const signature = ecdsa.sign(serializedTx, privateKey);

  let v = (chainId * 2 + 35 + signature.recovery).toString(16);
  if (v.length % 2 !== 0) {
    v = '0' + v;
  }

  txParams = {
    ...txParams,
    v: Buffer.from(v, 'hex'),
    r: Buffer.from(signature.toCompactRawBytes()).subarray(0, 32),
    s: Buffer.from(signature.toCompactRawBytes()).subarray(32),
  };
  tx = LegacyTransaction.fromTxData(txParams, { common });

  const signedTx = tx.serialize();
  console.log(toHex(signedTx));
})();
