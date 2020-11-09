//chainisvalid 메소드 구현
//체인이 유효한지 확인하는 메소드









const sha256 = require('sha256');
const { v1: uuid } = require('uuid')
const currentNodeUrl = process.argv[3];

function Blockchain(){
    //채굴한 모든 블록을 저장하는 배열 선언
    this.chain = [];
    //블록에 아직 저장되지 않은 모든 트랜잭션을 저장하는 배열 선언
    this.newTransactions = [];
    // Genesis 블록을 만들기 위해 임의의 값으로 생성
    this.createNewBlock(100, '0', '0');

    this.currentNodeUrl =currentNodeUrl;
    this.networkNodes=[];

}
//nonce : 자격증명(PoW)을 통해 찾아진 숫자 값
//prevBlockHash : 이전 블록에서 직전 블록까지 트랜잭션들의 해시값
//hash : 트랜잭션들의 해시값
Blockchain.prototype.createNewBlock=function(nonce,prevBlockHash,hash){
    // Blockchain 안의 새로운 블록으로 관련 데이터들은 모두 이 안에 저장
    const newBlock ={
        index: this.chain.length +1, // 새로운 블록이 몇 번째 블록인지
        timestamp: Date.now(), //블록이 생성된 시점
            
        //새로운 트랜잭션들과 미결 트랜책션들이 추가됨.
        transactions : this.newTransactions,
        //자격 증명(PoW)을 통해 찾아진 숫자 값
        nonce : nonce,
        //트랜잭션들의 해시값
        hash : hash,
        //이전 블록에서 직전 블록까지 트랜잭션들의 해시값
        prevBlockHash : prevBlockHash,
    }
    //새로운 블록을 만들 때 새로운 트랜잭션들을 저장할 배열을 초기화
    this.newTransactions=[];
    //새로운 블록을 체인에 추가
    this.chain.push(newBlock);
    //새로운 블록을 반환
    return newBlock;
}
Blockchain.prototype.getLastBlock = function() {
    //체인 배열에서 제일 마지막 블록을 반환
    return this.chain[this.chain.length-1];
}
// amount : 송금액 sender : 발송인 주소  recipient : 수신자 주소
Blockchain.prototype.createNewTransaction = function(amount,sender,recipient){
    const newTransaction = {
        amount : amount,
        sender : sender,
        recipient : recipient,
        transactionId: uuid().split('-').join('')
    };
    // this.newTransactions.push(newTransaction);
    // return this.getLastBlock()[`index`]+1;
    return newTransaction;
}
Blockchain.prototype.hashBlock = function(preBlockHash,curBlockData,nonce)
{
    const dataString = preBlockHash 
    +nonce.toString()
    +JSON.stringify(curBlockData);
    //문자열로 만든 블록 데이터를 해싱
    const hash =sha256(dataString);
    return hash;
}
Blockchain.prototype.proofOfWork = function(preBlockHash,curBlockData){
    let nonce = 0;
    let hash = this.hashBlock(preBlockHash,curBlockData,nonce);
    while(hash.substring(0,4) !== "0000"){
        nonce++;
        hash = this.hashBlock(preBlockHash,curBlockData,nonce);
    }
    return nonce;
}
//new 트랜잭션을 배열에 추가
Blockchain.prototype.addTransactionTonewTransactions= 
function(transactionObj){
    this.newTransactions.push(transactionObj);
    return this.getLastBlock()[`index`] + 1;
}
Blockchain.prototype.chainIsValid = function(blockchain){
    let validChain =true;
    //모든 블록을 순회하며 직전 블록의 해쉬 함수값과 현재 블록의 해쉬값을 비교 확인
    for(var i= 1; i <blockchain.length; i++) {
        const currentBlock = blockchain[i];
        const prevBlock = blockchain[i-1];
        const blockHash = this.hashBlock(
            prevBlock['hash'], {
                transactions: currentBlock['transactions'],
                index: currentBlock['index']
            },
            currentBlock['nonce']
        );
        if(blockHash.substring(0,4)!=='0000')
            validChain = false;
        if(currentBlock['prevBlockHash']!== prevBlock['hash'])
            validChain = false;
    };
    //최초 생성한 genesis 블록 검증
    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock['nonce'] === 100;
    const correctPreviousBlockhash = genesisBlock['prevBlockHash'] === '0';
    const correctHash = genesisBlock['hash'] ==='0';
    const correctTransactions = genesisBlock['transactions'].length ===0;

    //유효한 genesis 블록을 가지고 있지 않으면
    if(!correctNonce || !correctPreviousBlockhash || !correctHash || !correctTransactions)
        validChain = false;

    return validChain;
};
Blockchain.prototype.getBlock = function(blockHash){
    let correctBlock = null;
    this.chain.forEach(block => {
        if(block.hash === blockHash)
            correctBlock = block;
    });
    return correctBlock;
};
Blockchain.prototype.getTransaction = function(transactionId){
    let correctTransaction =null;
    let correctBlock = null;
    this.chain.forEach(block => {
        block.transactions.forEach(transaction => {
            if(transaction.transactionId === transactionId){
            correctTransaction = transaction;
            correctBlock = block;
            };
        });
    });
    return{
        transaction: correctTransaction,
        block: correctBlock
    };
};
Blockchain.prototype.getAddressData = function(address) {
    const addressTransactions=[];
    this.chain.forEach(block=> {
        block.transactions.forEach(transaction => {
            if(transaction.sender === address || transaction.recipient ===address){
                addressTransactions.push(transaction);
            };
        });
    });
    let balance = 0;
    addressTransactions.forEach(transaction => {
        if(transaction.recipient === address) balance+=transaction.amount;
        else if(transaction.sender === address) balance -= transaction.amount;
    });
    return {
        addressTransactions: addressTransactions,
        addressBalance: balance
    };
};


module.exports =Blockchain;