var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sql = require("mssql/msnodesqlv8"); 



var urlencodedParser = bodyParser.urlencoded({ extended: false })
var dbConfig=require('./dbConfig');




module.exports = function(app){
				app.get('/process_getRatings', urlencodedParser, function (req, res) { 
					res.header("Access-Control-Allow-Origin","*");
					console.log("Likeları alma isteği geldi : ");
				
					
				   sql.close();
				   sql.connect(dbConfig).then(() => {
					return sql.query("select AuthorID, PlaceID, PlaceLike ,DateOfCreate from LikesTable where DateOfCreate = (select max(DateOfCreate) from LikesTable as f where f.PlaceID = LikesTable.PlaceID AND f.AuthorID = LikesTable.AuthorID)")
					}).then(result => {
						
						myResult=(JSON.stringify(result.recordsets[0]));	
						console.log(result.recordsets[0].length+" adet like alındı");
						res.end(myResult);
					}).catch(err => {
						console.log("hata1"+err);
					})
					 
					sql.on('error', err => {
						console.log("hata2");
						sql.close();
				})
					  
				})


   

}