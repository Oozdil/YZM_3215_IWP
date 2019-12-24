var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sql = require("mssql/msnodesqlv8"); 


// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//Initiallising connection string
var dbConfig=require('./dbConfig');



module.exports = function(app){
app.get('/process_contactMessageList', urlencodedParser, function (req, res) { 
	res.header("Access-Control-Allow-Origin","*");
    console.log("Mesajlar alındı : ");
   
   sql.close();   
   sql.connect(dbConfig, function(err){
	 
        if(err){
            console.log(err);
        }
        else {                       
            var request = new sql.Request();
            var result="";			
            request.query("SELECT * FROM ContactMessagesTable ORDER BY DateOfCreate DESC",   
			function(err, data){			 
				if(err)
				{                     				
					console.log(JSON.stringify(err));						
                }
                else
				{								
					var result="";
					if(data.recordsets[0].length>0)
					{
						result=(JSON.stringify(data.recordsets[0]));	
						//console.log("Sonuç : "+result);
						console.log("Sonuç : "+data.recordsets[0].length+" adet mesaj alındı");
					}
					else
					{
						result='{"ID":"","FromEmail":"","Subject":"","Message":"","IsRead":0,"DateOfCreate":""}';
						console.log("Mesaj bulunamadı",result);
					}  						
                }				
				res.end(result);
				console.log("**********************************************\n");
                sql.close();      
            });        		
        }
		
    });
})


   

}