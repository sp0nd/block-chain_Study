const Blockchain =require(`./dev/Blockchain`);
const bitcoin = new Blockchain();
const preBlockHash = '6B86B2AA22F1D49C01E52DDB7875B4B';
const curBlockData = [
    {amount: 100, sender:'JOHN',recipient:'TOM'},
    {amount:50, sender:'TOM',recipient:'JANE'},
    {amount:10, sender:'JANE',recipient:'JOHN'}
];
bitcoin.proofOfWork = function(preBlockHash,curBlockData){
    let nonce = 0;
    let hash = this.hashBlock(preBlockHash,curBlockData,nonce);
    while(hash.substring(0,4) !== "0000"){
        nonce++;
        hash = this.hashBlock(preBlockHash,curBlockData,nonce);
        process.stdout.write('\r'+hash)
        // process.stdout.write(hash)
    }
    console.log('')
    return nonce;
}
console.log(bitcoin.proofOfWork(preBlockHash, curBlockData));