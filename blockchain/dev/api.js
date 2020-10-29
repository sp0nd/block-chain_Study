const express = require('express');
const {v1: uuid} =require('uuid');
const Blockchain = require('./blockchain');
var nodeAddress = uuid().split('-').join('');
var app = new express();
var bitcoin = new Blockchain();
const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.post('/blockchain',function(req,res){
    res.send(bitcoin)
});
// app.get('/blockchain',function(req,res){
//     res.send(bitcoin)
// });
app.post('/transaction', function(req,res){
    // console.log(req.body); // 요청 내용을 콘솔에 출력
    // //요청 결과를 문자열로 반환
    // res.send(`The amount of the transaction is ${req.body.amount} bitcoin from ${req.body.sender} to ${req.body.recipient}.`);
    const blockIndex = bitcoin.createNewTransaction(
        req.body.amount,
        req.body.sender,
        req.body.recipient
    )
    res.json({note: `Transaction will be added in block ${blockIndex}.`});
});
app.post('/mine', function(req,res){
    const lastBlock = bitcoin.getLastBlock();
    const preBlockHash = lastBlock[`hash`];
    const curBlockData = {
        transaction: bitcoin.newTransactions,
        Index: lastBlock[`index`] + 1
    };
    const nonce = bitcoin.proofOfWork(preBlockHash,curBlockData);
    const blockHash = bitcoin.hashBlock(preBlockHash,curBlockData,nonce);
    const newBlock = bitcoin.createNewBlock(nonce,preBlockHash,blockHash);
    // 새로운 블록을 다른 노드들에게 통지
    res.json({note:"New Block minde Successfully",block:newBlock});
    // 새로운 블록을 채굴한 것에 대한 보상처리
    // 2018년 기준 보상은 12.5BTC,sender가"00"이면 보상의 의미
    bitcoin.createNewTransaction(12.5,"00",nodeAddress);
});
// app.get('/',function(req,res){
//     res.send('Hello World!');
// });
app.listen(3000,function() {console.log('listening on port 3000 ...')});
//웹 브라우저 주소창에서 입력 후 실행 >> localhost:3000