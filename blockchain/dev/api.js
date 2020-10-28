const express = require('express');
var app = new express();
app.get('/',function(req,res){
    res.send('Hello World!');
});
//웹 브라우저 주소창에서 입력 후 실행 >> localhost:3000