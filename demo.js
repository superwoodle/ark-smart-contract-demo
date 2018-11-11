const ark = require('@arkecosystem/client');
const crypto = require('@arkecosystem/crypto');
const client = new ark('http://woodle.ngrok.io');
client.setVersion(2);

const fs = require('fs');
const ipfsAPI = require('ipfs-api')
// connect to ipfs daemon API server
const ipfs = ipfsAPI('localhost', '5001', { protocol: 'http' });

let contractHash;

Promise.resolve()
    .then(writeContractToIpfs)
    .then(fetchWallet)
    .then(response => {
        console.log(response.data);
        return postTransaction({
            amount: 10,
            recipient: 'ANBkoGqWeTSiaEVgVzSKZd3jS7UWzv9PSo',
            senderPublicKey: 'ANBkoGqWeTSiaEVgVzSKZd3jS7UWzv9PSo',
            passphrase: 'clay harbor enemy utility margin pretty hub comic piece aerobic umbrella acquire'
        });
    }).then(transaction => {
        console.log(transaction);
        return getTransaction(transaction.id);
    }).then(transaction => {
        console.log(transaction);
        return getContract(transaction.vendorField);
    }).then(contract => {
        console.log(contract);
        return executeContract(contract)
    }).then(transactionId => {
        console.log(transactionId);
        return getTransaction(transactionId);
    }).then(transaction => {
        console.log(transaction);
        return;
    }).catch(err => {
        console.log(error);
    })

async function writeContractToIpfs() {
    const contractSource = fs.readFileSync('./ipfs/contract.js');
    console.log('Writing contract to ipfs...');
    let results = await ipfs.files.add(ipfs.types.Buffer(contractSource));
    console.log(results)
    contractHash = results[0].hash;
    console.log('contract written');
}

async function fetchWallet() {
    return client.resource('wallets').get('ANBkoGqWeTSiaEVgVzSKZd3jS7UWzv9PSo');
}

async function getTransaction(id) {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            client.resource('transactions').get(id).then(response => {
                console.log(response.data);
                clearInterval(interval);
                resolve(response.data.data);
            }).catch(error => {
                console.log('Transaction not ready.');
            });
        }, 1000);
    })
}

async function postTransaction({ amount, recipient, senderPublicKey, passphrase }) {
    const vendorField = contractHash;
    if (!vendorField) throw new Error('Missing contractHash!')
    try {
        const transaction = crypto.transactionBuilder.transfer()
            .amount(amount)
            .vendorField(vendorField)
            .recipientId(recipient)
            .senderPublicKey(senderPublicKey)
            .sign(passphrase)
            .getStruct();

        client.resource('transactions').create({ transactions: [transaction] });
        return transaction;
    } catch (error) {
        console.log('An error has occured while posting the transaction:', error)
    }
}

async function getContract(hash) {
    return new Promise((resolve, reject) => {
        console.log('fetching contract from ipfs...');
        ipfs.files.cat(hash, function (err, file) {
            if (err) {
                throw err
            }
            console.log(file.toString('utf8'))
            resolve(file.toString('utf8'));
        })
    });
}

async function executeContract(contract) {
    return new Promise((resolve, reject) => {
        const { NodeVM } = require('vm2');
        const vm = new NodeVM({
            require: {
                external: ['@arkecosystem/client', '@arkecosystem/crypto']
            }
        });

        const runContract = vm.run(contract, 'vm.js');
        runContract({
            amount: 1,
            recipient: 'ANBkoGqWeTSiaEVgVzSKZd3jS7UWzv9PSo',
            senderPublicKey: 'ANBkoGqWeTSiaEVgVzSKZd3jS7UWzv9PSo',
            passphrase: 'clay harbor enemy utility margin pretty hub comic piece aerobic umbrella acquire'
        }, (transactionId) => {
            resolve(transactionId);
        });
    });
}