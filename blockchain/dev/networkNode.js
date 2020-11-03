const express = require('express');
const {v1: uuid} =require('uuid');
const reqp = require('request-promise');
const Blockchain = require('./blockchain');
const bodyparser = require('body-parser');
const regNodesPromises = [];       //promise 객체들을 저장하는 배열
var nodeAddress = uuid().split('-').join('');
var app = new express();
var bitcoin = new Blockchain();
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
// 자신의 서버에 등록하고 전체 네트워크에 브로드캐스팅
app.post('/register-and-broadcast-node',function(req,res){
    const newNodeUrl = req.body.newNodeUrl;   //등록 요청 URL
    //배열 networkNodes에서 없으면 추가
    if(bitcoin.networkNodes.indexOf(newNodeUrl)== -1)
    bitcoin.networkNodes.push(newNodeUrl);
    //다른 노드에게 브로드 캐스팅
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOption = {
            uri:networkNodeUrl + '/register-node',
            method:'POST',
            body:{newNodeUrl:newNodeUrl},
            json:true
        };
        regNodesPromises.push(reqp(requestOption))
    });
    promise.all(regNodesPromises)
    .then(data => {

        const bulkRegisterOptions = {
            uri: netNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: {allNetworkNodes : [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl] },
            json: true
        }
        //regNodesPromises.push(reqp(requestOption));
        return rp(bulkRegisterOptions);
    })
    .then(data => {
        res.json({note: 'New Node registered with network successfully'});
    });
});
//새로 등록 요청받은 노드를 자신의 서버에 등록
app.post('/register-node',function(req,res){
    const newNodeUrl = req.body.newNodeUrl;// 등록요청 URL
    //배열 networkNodes에 없으면 true, 있으면 false
    const nodeNotExist = bitcoin.networkNodes.indexOf(newNodeUrl)==-1;
    //currentNodeUrl과 newNodeUrl이 다르면 true,같다면 false
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
    //기존에 없고, 현재 노드의 url과 다르면 추가
    if(nodeNotExist && notCurrentNode)
    bitcoin.networkNodes.push(newNodeUrl);
    //등록요청에 대한 회신
    res.json({note: `New node registered successfully.`});
});
//여러 개의 노드를 자신의 서버에 한 번에 등록
app.post('/register-nodes-bulk',function(req,res){
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
        if(nodeNotAlreadyPresent && notCurrentNode)
            bitcoin.networkNodes.push(networkNodeUrl);
    });
    res.json({note: 'Bulk registration successful.'});
});

// app.get('/',function(req,res){
    //     res.send('Hello World!');
    // });
const port = process.argv[2];
//console.log(process.argv[0]+'\n'+process.argv[1]+'\n'+process.argv[2]+'\n'+process.argv[3]+'\n'+process.argv[4])
app.listen(port, function(){
    console.log(`listening on port ${port}...`)
});
    //웹 브라우저 주소창에서 입력 후 실행 >> localhost:3000