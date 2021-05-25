let express = require('express');
let app = express();
app.get('/user',function(req,res){
	res.json({
		id:1,
		name: 1234
	})
})
app.get('/aaa',function(req,res){
	res.json({
		id: 112,
		name: 22
	})
})
app.listen(3000,function(res){
	console.log(res)
})