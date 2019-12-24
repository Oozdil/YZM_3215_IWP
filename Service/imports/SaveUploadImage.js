var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sql = require("mssql/msnodesqlv8"); 



var urlencodedParser = bodyParser.urlencoded({ extended: false })
var dbConfig=require('./dbConfig');



module.exports = function(app){
myResult="";
app.post('/process_saveImageUrl', urlencodedParser, function (req, res) { 
	res.header("Access-Control-Allow-Origin","*");
    
	var ImageUrl=req.body.NewName;
	var AuthorID=req.body.AuthorID;
	var PlaceID=req.body.PlaceID;
	console.log("Url kayıt isteği geldi : "+ImageUrl);
	
	 try{	
    ImageUrl=ImageUrl.trim();
	AuthorID=AuthorID.trim();
	PlaceID=PlaceID.trim();
	}
	catch
	{
	ImageUrl="";
	AuthorID="";
	PlaceID="";
	errorMessage="Hata!, Lütfen 'NewName', 'PlaceID' ve 'AuthorID' parametrelerini gönderiniz! ";
	console.log(errorMessage);
	res.end('{ "success":false,"Message":"'+errorMessage+'"}'); 
    return false;   	
	}
	
	if(ImageUrl=="" || AuthorID=="" ||PlaceID=="")
	{		
		errorMessage="Lütfen tüm alanları doldurunuz!";
	    console.log(errorMessage);		
		res.end('{ "success":false,"Message":"'+errorMessage+'"}'); 	
		return false;
	}
	
    
     if(PlaceID=="")
        PlaceID=0;
	 
	 AuthorID = parseInt(AuthorID) ;  
     if(isNaN(AuthorID))
        AuthorID=0;
	
	
    if(PlaceID==0 || AuthorID==0)
	{		
		errorMessage="MekanID veya KullanıcıID eksik veya hatalı!";
	    console.log(errorMessage);		
		res.end('{ "success":false,"Message":"'+errorMessage+'"}'); 	
	}
	
	else
		
		{
			try{
			   sql.close();
			   sql.connect(dbConfig).then(() => {
				return sql.query("INSERT INTO ImagesTable (ImageUrl,AuthorID,PlaceID) VALUES ('"+ImageUrl+"',"+AuthorID+",'"+PlaceID+"')")
				}).then(result => {
					
					myResult=(JSON.stringify(result.recordsets[0]));	
					console.log("Resim yolu eklendi "+ImageUrl);
					res.end("Resim yolu eklendi "+ImageUrl);
				}).catch(err => {	
					console.log("hata1"+err);	
				})
				 
				sql.on('error', err => {
					console.log("hata2");		
					})
			}
			catch
			{
				res.end("Hata ile Sonuçlandı");
			}
			
		
}
  
  

	  
})


   

}