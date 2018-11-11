const ark = require('@arkecosystem/client');
const crypto = require('@arkecosystem/crypto');

const client = new ark('http://woodle.ngrok.io');
client.setVersion(2);

module.exports = function ({ amount, recipient, senderPublicKey, passphrase }, callback) {
    postTransaction({
        amount: amount,
        recipient: recipient,
        senderPublicKey: senderPublicKey,
        vendorField: 'from contract',
        passphrase: passphrase
    }).then(transaction => {
        console.log(transaction.id);
        callback(transaction.id);
    })
};

async function postTransaction({ amount, recipient, senderPublicKey, passphrase, vendorField }) {
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