import express from "express";
import bodyParser from "body-parser";
import secp256k1 from "secp256k1";
import key from "./key.js";
import ecdsa from "./ecdsa.js";

const port = 3000;
const host = "127.0.0.1";

const app = express();
app.use(bodyParser.json());

let privateKey;

app.post("/", (_, response) => {
    response.send("success");
});

app.post("/create_key", (_, response) => {
    const mnemonic = key.createMnemonic();
    privateKey = key.mnemonicToPrivateKey(mnemonic);
    const address = key.privateKeyToAddress(privateKey);
    response.json({
        mnemonic: mnemonic.toString(),
        privateKey: privateKey.toString("hex"),
        address: address,
    });
});

app.post("/import_key", (request, response) => {
    try {
        if (!("privateKey" in request.body)) {
            throw new Error("'privateKey' is required");
        }
        const temp = Buffer.from(request.body.privateKey, "hex");
        if (secp256k1.privateKeyVerify(temp) === false) {
            throw new Error("invalid private key");
        }
        privateKey = temp;
        const address = key.privateKeyToAddress(privateKey);
        response.json({
            importedAddress: address,
        });
    } catch (error) {
        response.status(500).json({
            error: error.message,
        });
    }
});

app.post("/current_address", (_, response) => {
    try {
        if (!privateKey) {
            throw new Error("privateKey is not set");
        }
        const address = key.privateKeyToAddress(privateKey);
        response.json({
            currentAddress: address,
        })
    } catch (error) {
        response.status(500).json({
            error: error.message,
        });
    }
});

app.post("/sign", (request, response) => {
    try {
        if (!privateKey) {
            throw new Error("privateKey is not set");
        }
        if (!("message" in request.body)) {
            throw new Error("'message' is required");
        }
        const signature = ecdsa.sign(request.body.message, privateKey);
        response.json({
            signature: Buffer.from(signature.signature).toString("hex"),
            recid: signature.recid,
        });
    } catch (error) {
        response.status(500).json({
            error: error.message,
        });        
    }
});
app.listen(port, host);