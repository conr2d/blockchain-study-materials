import Common from "@ethereumjs/common";
import { Transaction } from "@ethereumjs/tx";
import request from "request-promise-native";
import key from "./key.js";
import ecdsa from "./ecdsa.js";

const privateKey = Buffer.from( /* Paste your private key here */ , "hex");
const address = key.privateKeyToAddress(privateKey);

(async () => {
  let nonce;
  // You can set nonce manually here, or will fetch from chain
  // nonce = "0x0";

  if (!nonce) {
    const response = await request.post({
      url: "https://ropsten-rpc.linkpool.io",
      json: {
        jsonrpc: "2.0",
        method: "eth_getTransactionCount",
        id: 0,
        params: [address, 'latest'],
      },
    });
    nonce = response.result;
  }

  const chainId = 3; // ropsten
  const common = new Common.default({ chain: 'ropsten', hardfork: 'berlin' });
  let txParams = {
    nonce: nonce,
    gasPrice: "0x2540BE400", // 10 Gwei
    gasLimit: "0x5208",
    to: "0xdf7A7D17BA30d77714a9DF4248743800faFf9D76",
    value: "0x2386F26FC10000",
    // data: "0x" + Buffer.from("Hello Ethereum").toString("hex"),
    // simple ether transfer costs 21000 (0x5208) gas,
    // if you want to send transaction with data, increase gasLimit
  };
  let tx = Transaction.fromTxData(txParams, { common });

  let serializedTx = tx.serialize();
  serializedTx[serializedTx.length - 3] = chainId;
  const signature = ecdsa.sign(serializedTx, privateKey);

  txParams = {
    ...txParams,
    v: Buffer.from((chainId * 2 + 35 + signature.recid).toString(16), "hex"),
    r: Buffer.from(signature.signature).slice(0, 32),
    s: Buffer.from(signature.signature).slice(32),
  };
  tx = Transaction.fromTxData(txParams, { common });

  const signedTx = tx.serialize();
  console.log(signedTx.toString("hex"));
})();
