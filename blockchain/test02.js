const Blockchain = require(`./dev/Blockchain`);
const bitcoin = new Blockchain();
//임의의 값을 파라미터로 입력
bitcoin.createNewBlock(1234,'ABCDEFGHIJK','1234567890');
//여러 개의 트랜잭션 생성
bitcoin.createNewTransaction(100,'JOHN','TOM');
bitcoin.createNewTransaction(50,'TOM','JANE');
bitcoin.createNewTransaction(10,'JANE','JOHN');
bitcoin.createNewBlock(5678,'ABABABABAB','A1A2A3A4A5');
console.log(bitcoin);
console.log(bitcoin.chain[1]); // 1번쨰 인덱스 체인 확인