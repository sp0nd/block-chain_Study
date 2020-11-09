const Blockchain = require('./Blockchain');
const bitcoin = new Blockchain();

const bc1 = {
    "chain": [
    {
    "index": 1,
    "timestamp": 1604899479984,
    "transactions": [],
    "nonce": 100,
    "hash": "0",
    "prevBlockHash": "0"
    },
    {
    "index": 2,
    "timestamp": 1604899497656,
    "transactions": [],
    "nonce": 18140,
    "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
    "prevBlockHash": "0"
    }
    ],
    "newTransactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "dd8cdce0224b11eba02ad96a89f35d1e",
    "transactionId": "e81b7fe0224b11eba02ad96a89f35d1e"
    }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": []
    }
console.log('Valid :', bitcoin.chainIsValid(bc1.chain));