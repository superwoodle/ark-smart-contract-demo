console.log('starting...');

const fs = require('fs');

// const contractSource = fs.readFileSync('./ipfs/contract.js');

var ipfsAPI = require('ipfs-api')

// connect to ipfs daemon API server
var ipfs = ipfsAPI('localhost', '5001', { protocol: 'http' }) // leaving out the arguments will default to these values

ipfs.files.cat('QmRn2qyCgHvj2DJTk4cpG3mJnSAyD8sBosuhVVrap9ocgL', function (err, file) {
    if (err) {
        throw err
    }

    console.log(file.toString('utf8'))
})