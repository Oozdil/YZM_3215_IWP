var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sql = require("mssql/msnodesqlv8"); 



var urlencodedParser = bodyParser.urlencoded({ extended: false })
var dbConfig=require('./dbConfig');



module.exports = function(app){
myResult="";
app.get('/process_commentsList', urlencodedParser, function (req, res) { 
	res.header("Access-Control-Allow-Origin","*");
    console.log("Yorumları alma isteği geldi : ");
   sql.close();
   sql.connect(dbConfig).then(() => {
    return sql.query("SELECT CommentsTable.ID, CommentsTable.PlaceID, CommentsTable.AuthorID, CommentsTable.Comment, CommentsTable.DateOfCreate,CommentsTable.Active,{ fn CONCAT({ fn CONCAT(UsersTable.Name, ' ') }, UsersTable.Surname) } AS FullName FROM CommentsTable INNER JOIN UsersTable ON CommentsTable.AuthorID = UsersTable.UserID order by CommentsTable.DateOfCreate DESC")
	}).then(result => {
		
		myResult=(JSON.stringify(result.recordsets[0]));	
		console.log(result.recordsets[0].length+" adet yorum alındı");
		res.end(myResult);
	}).catch(err => {
		console.log("hata1"+err);
	})
	 
	sql.on('error', err => {
		console.log("hata2");
		
})
  
  

	  
})


   

}