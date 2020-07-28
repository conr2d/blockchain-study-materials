import EthereumTx from "ethereumjs-tx";
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
        params: [address],
      },
    });
    nonce = response.result;
  }

  const chainId = 3; // ropsten
  const tx = new EthereumTx.Transaction({
    nonce: nonce,
    gasPrice: "0x2540BE400", // 10 Gwei
    gasLimit: "0x5208",
    to: "0xdf7A7D17BA30d77714a9DF4248743800faFf9D76",
    value: "0x2386F26FC10000",
    // data: "0x" + Buffer.from("Hello Ethereum").toString("hex"),
    // simple ether transfer costs 21000 (0x5208) gas,
    // if you want to send transaction with data, increase gasLimit
  }, { chain: "ropsten", hardfork: "muirGlacier" });

  // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md
  tx.raw[6] = Buffer.from(chainId.toString(16), "hex");

  const serializedTx = tx.serialize();
  // console.log(serializedTx.toString("hex"));
  const signature = ecdsa.sign(serializedTx, privateKey);

  tx.r = Buffer.from(signature.signature).slice(0, 32);
  tx.s = Buffer.from(signature.signature).slice(32);
  // Use raw[6] instead of v to bypass setter
  tx.raw[6] = Buffer.from((chainId * 2 + 35 + signature.recid).toString(16), "hex");

  const signedTx = tx.serialize();
  console.log(signedTx.toString("hex"));
})();
