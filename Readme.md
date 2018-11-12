
Demo Smart Contracts on ARK, created at HackPrinceton Fall 2018

https://devpost.com/software/ark-io-smart-contract

# About
Transactions on Ark can only contain small amounts of vendor data. So instead of creating an assembly like language similar to Ethereum would be an incredibly difficult feat to accomplish in a short time, or forking the implementation to increase the transaction payload size, this demo stores a "contract" which is just javascript, in IPFS. Each smart contract transaction contains a pointer an IPFS contract file. When the transaction is mined, the contract is loaded from IPFS and executed using vm2 as a sandbox.

This design provides great flexibility with javascript, and keeps the blockchain small. However, it requires an outside provider; IPFS. 

_There is currently no way to pay to a hash/contract, so the account just pays to its self_

# Setup

Run Docker container for ARK Testnet, (run from Ubuntu VM with ngrok)
```
sudo docker run -p 4003:4003 kaiserkarel/hackark
```
>> Starts ARK node on port 4003


Run IPFS on local machine
```
ipfs daemon
```

# Notes

* https://www.npmjs.com/package/vm2
* https://github.com/ArkEcosystem/core/blob/develop/packages/core/lib/config/testnet/delegates.json


* https://docs.ipfs.io/introduction/install/
* https://github.com/ipfs/js-ipfs-api
