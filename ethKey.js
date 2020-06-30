import Web3 from "web3";

const web3 = new Web3();

const privateKey = "0x762C749EEB18AF214BA491C3E8C65E5681F198671319C4603354753664FA1CA2";
const account = web3.eth.accounts.privateKeyToAccount(privateKey);

console.log(account);