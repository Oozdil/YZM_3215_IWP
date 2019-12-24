var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sql = require("mssql/msnodesqlv8"); 



var urlencodedParser = bodyParser.urlencoded({ extended: false })
var dbConfig=require('./dbConfig');



module.exports = function(app){
app.post('/process_changeRating', urlencodedParser, function (req, res) {  

    var PlaceID = req.body.PlaceID;
	var AuthorID = req.body.AuthorID;
	var Rating = req.body.Rating;
	
	 
     if(PlaceID=="")
        PlaceID=0;
	 
	 AuthorID = parseInt(AuthorID) ;  
     if(isNaN(AuthorID))
        AuthorID=0;
	
	Rating = parseInt(Rating) ;  
     if(isNaN(Rating))
        Rating=0;
	
	if(PlaceID==0|| AuthorID==0)
	{	     
         
		 errorMessage="Kullanıcı ID veya Mekan ID kontrol ediniz.parametre eksik veya hatalı";
	     console.log(errorMessage);		
		 res.end(errorMessage);  
	}
	
	else
	{
   res.header("Access-Control-Allow-Origin","*");
   console.log("Rating işlemi -->"+PlaceID+"  "+AuthorID+" "+Rating);   
   
   
    sql.close(); 
     sql.connect(dbConfig, function(err){
	 
        if(err){
            console.log(err);
        }
        else {                       
            var request = new sql.Request();          
            request.query("INSERT INTO LikesTable (PlaceID,AuthorID,PlaceLike) VALUES ('"+PlaceID+"',"+AuthorID+","+Rating+") ",
			function(err, data){
			  var result="";
				if(err)
				{
                    result='{ "success":false}';						
					console.log("Bir hata oluştu -->",JSON.stringify(err));										
                }
                else
				{
					result='{ "success":true}';	
					console.log("Like eklendi -->",Rating);	
					res.end("Like changed");					
                }
                sql.close();    		
				
				console.log("**********************************************\n");
            });        		
        }		
    });
}

})


   

}