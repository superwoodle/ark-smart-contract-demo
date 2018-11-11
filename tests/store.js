// Stores a value in the vendor field of a transaction

const ark = require('@arkecosystem/client');
const crypto = require('@arkecosystem/crypto');

const vendorField = 'Chris is a cool dude';

const client = new ark('http://woodle.ngrok.io');
client.setVersion(2);

postTransaction({
    amount: 10,
    recipient: 'ANBkoGqWeTSiaEVgVzSKZd3jS7UWzv9PSo',
    senderPublicKey: 'ANBkoGqWeTSiaEVgVzSKZd3jS7UWzv9PSo',
    passphrase: 'clay harbor enemy utility margin pretty hub comic piece aerobic umbrella acquire'
}).then(transaction => {
    console.log(transaction.id);
    setInterval(() => {
        client.resource('transactions').get(transaction.id).then(response => {
            console.log('Created data.');
            console.log(response.data);
            process.exit();
        }).catch(err => {
            console.log('Transaction not ready...');
        });
    }, 1000);
})

async function postTransaction({ amount, recipient, senderPublicKey, passphrase }) {
    try {
        const transaction = crypto.transactionBuilder.transfer()
            .amount(amount)
            .vendorField(vendorField)
            .recipientId(recipient)
            .senderPublicKey(senderPublicKey)
            .sign(passphrase)
            .getStruct()

        client.resource('transactions').create({ transactions: [transaction] })

        return transaction
    } catch (error) {
        console.log('An error has occured while posting the transaction:', error)
    }
}

