var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sql = require("mssql/msnodesqlv8"); 



var urlencodedParser = bodyParser.urlencoded({ extended: false })
var dbConfig=require('./dbConfig');



module.exports = function(app){
app.get('/process_UserImagesList', urlencodedParser, function (req, res) { 
	res.header("Access-Control-Allow-Origin","*");
    console.log("Resimler alma isteği geldi : ");
   
   
   sql.close();
   sql.connect(dbConfig).then(() => {
    return sql.query("SELECT * FROM ImagesTable")
	}).then(result => {
		
		myResult=(JSON.stringify(result.recordsets[0]));	
		console.log(result.recordsets[0].length+" adet resim alındı");
		res.end(myResult);
	}).catch(err => {
		console.log("hata1"+err);
	})
	 
	sql.on('error', err => {
		console.log("hata2");
		
})
})


   

}