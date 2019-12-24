var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sql = require("mssql/msnodesqlv8"); 



var urlencodedParser = bodyParser.urlencoded({ extended: false })
var dbConfig=require('./dbConfig');









module.exports = function(app){
myResult="";
app.post('/process_pageVisit', urlencodedParser, function (req, res) { 
	
	
	var placeid=req.body.PlaceID;
	var authorid=req.body.AuthorID;
	var errorMessage="";
	console.log(JSON.stringify(req.body));
	 
      
     if(placeid=="")
        placeid=0;
	 
	 authorid = parseInt(authorid) ;  
     if(isNaN(authorid))
        authorid=0;

	if(placeid==0|| authorid==0)
	{	     
         
		 errorMessage="Kullanıcı ID veya Mekan ID kontrol ediniz.parametre eksik veya hatalı";
	     console.log(errorMessage);		
		 res.end(errorMessage);  
	}
	
	else
	{
		

	  
	res.header("Access-Control-Allow-Origin","*");
    console.log("Sayfa ziyareti isteği geldi : "+placeid.toString());
	
	
	
   sql.close();
   sql.connect(dbConfig).then(() => {
    return sql.query("PageVisit "+authorid+","+placeid+" ")
	}).then(result => {
		
		myResult=(JSON.stringify(result.recordsets[0]));	
		console.log(authorid +" için sayfa ziyareti işlendi, toplam ziyaret :"+myResult);
		res.end(myResult);
	}).catch(err => {
		console.log("hata1"+err);
	})
	 
	sql.on('error', err => {
		console.log("hata2"+err);
		
})
  
}

	  
})


   

}