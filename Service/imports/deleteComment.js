var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sql = require("mssql/msnodesqlv8"); 



var urlencodedParser = bodyParser.urlencoded({ extended: false })
var dbConfig=require('./dbConfig');



module.exports = function(app){
app.post('/process_deleteComment', urlencodedParser, function (req, res) {  

   var CommentID = req.body.CommentID;	
   CommentID = parseInt(CommentID) ;  
     if(isNaN(CommentID))
        CommentID=0;
   
   if(CommentID==0)
   {
	   console.log("Mekan ID kontrol ediniz!");
	   res.end('{ "success":false,"Message":'+'"Mekan ID kontrol ediniz!"}');
   }   
   else
   {
   res.header("Access-Control-Allow-Origin","*");
   console.log("Yorum silme işlemi -->"+CommentID);   
   sql.close(); 
   sql.connect(dbConfig, function(err){
	 
        if(err){
            console.log(err);
        }
        else {                       
            var request = new sql.Request();          
             request.query("UPDATE CommentsTable SET Active=0 WHERE ID="+CommentID,
			function(err, data){
			  var result="";
				if(err)
				{
                    result='{ "success":false}';						
					console.log("Yorum silinemedi -->",JSON.stringify(err));	
					res.end(result);					
                }
                else
				{
					result='{ "success":true}';				
					console.log("Yorum silindi -->",CommentID);	
					res.end(result);
                }
			
				console.log("**********************************************\n");
                sql.close();      
            });        		
        }		
    });
	
}
})


   

}