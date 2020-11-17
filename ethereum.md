# Ethereum Local Testnet

## Install go-ethereum (geth) client

```
sudo add-apt-repository ppa:ethereum/ethereum
sudo apt install ethereum
```

## Create or import miner account

1. Create new account

```
geth account new --datadir ./data
```

2. Import existing account

Private key should consist of 64 characters of hex string. (32 bytes)
`cat > filename` will be terminated by (Ctrl + D).

```
cat > keyfile.txt
geth account import keyfile.txt --datadir ./data
```

## Generate genesis configuration

Use clique consensus algorithm and export in JSON format.

```
puppeth
```

## Initiate new chain

```
geth init genesis.json --datadir ./data
```

## Run chain

```
cat > password.txt
geth --datadir ./data --http --http.addr 0.0.0.0 --http.port 8545 --http.api eth,web3,net --http.corsdomain "*" --networkid 9999 --mine --password password.txt --allow-insecure-unlock --unlock 0xdf7A7D17BA30d77714a9DF4248743800faFf9D76
```
