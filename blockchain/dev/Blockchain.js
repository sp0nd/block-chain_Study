const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
function Blockchain(){
    this.currentNodeUrl =currentNodeUrl;
    this.networkNodes=[];
}
function Blockchain(){
    //채굴한 모든 블록을 저장하는 배열 선언
    this.chain = [];
    //블록에 아직 저장되지 않은 모든 트랜잭션을 저장하는 배열 선언
    this.newTransactions = [];
    // Genesis 블록을 만들기 위해 임의의 값으로 생성
	this.createNewBlock(100, '0', '0');

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
    };
    this.newTransactions.push(newTransaction);
    return this.getLastBlock()[`index`]+1;
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

module.exports =Blockchain;