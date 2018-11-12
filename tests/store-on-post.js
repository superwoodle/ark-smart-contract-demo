const express = require('express')
const app = express()
const port = 3000

var bodyParser = require('body-parser')

// Stores a value in the vendor field of a transaction

const ark = require('@arkecosystem/client');
const crypto = require('@arkecosystem/crypto');

const vendorField = 'Chris is a cool dude';

const client = new ark('http://woodle.ngrok.io');
client.setVersion(2);

app.use(bodyParser.json())

async function postTransaction({ amount, recipient, vendorField, senderPublicKey, passphrase }) {
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



app.get('/', (req, res) => res.send('Hello World!'))
app.post('/', (req, res) => {
    console.log(req.body)
    console.log(req.body.name)
    
    postTransaction({
        amount: 10,
        recipient: 'ANBkoGqWeTSiaEVgVzSKZd3jS7UWzv9PSo',
        senderPublicKey: 'ANBkoGqWeTSiaEVgVzSKZd3jS7UWzv9PSo',
        vendorField: req.body.name,
        passphrase: 'clay harbor enemy utility margin pretty hub comic piece aerobic umbrella acquire'
    }).then(transaction => {
        console.log(transaction.id);
        const interval = setInterval(() => {
            client.resource('transactions').get(transaction.id).then(response => {
                console.log('Created data.');
                console.log(response.data);
                res.send(response.data)
                clearInterval(interval);
            }).catch(err => {
                console.log('Transaction not ready...');
            });
        }, 1000);
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))