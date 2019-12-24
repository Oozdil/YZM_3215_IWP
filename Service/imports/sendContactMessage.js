var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sql = require("mssql/msnodesqlv8"); 



var urlencodedParser = bodyParser.urlencoded({ extended: false })
var dbConfig=require('./dbConfig');
 function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}



module.exports = function(app){
app.post('/process_contact', urlencodedParser, function (req, res) {  

    var email_contact = req.body.email_contact;
	var subject = req.body.subject;
	var message = req.body.message;
	var errorMessage="";
	res.header("Access-Control-Allow-Origin","*");

   try{	
    email_contact=email_contact.trim();
	subject=subject.trim();
	message=message.trim();
	}
	catch
	{
	email_contact="";
	subject="";
	message="";
	errorMessage="Hata!, Lütfen 'email_contact', 'message' ve 'subject' parametrelerini gönderiniz! ";
	console.log(errorMessage);
	res.end('{ "success":false,"Message":"'+errorMessage+'"}'); 
    return false;   	
	}
	
   	if(!validateEmail(email_contact))
	{
		email_contact="";
		errorMessage="Mail adresi geçersiz";
	    console.log(errorMessage);		
		res.end('{ "success":false,"Message":"'+errorMessage+'"}');  
		return false;
	}
    if(email_contact=="" || subject=="" ||message=="")
	{		
		errorMessage="Lütfen tüm alanları doldurunuz!";
	    console.log(errorMessage);		
		res.end('{ "UserID":"", "Name":"", "Surname":"","Email":"","Message":"'+errorMessage+'"}'); 
	}
   
   
   else
   {
   
   console.log("Web servis contact mesajı gönderme işlemi -->",email_contact);
   
    sql.close(); 
   sql.connect(dbConfig, function(err){
	 
        if(err){
            console.log(err);
        }
        else {                       
            var request = new sql.Request();          
             request.query("INSERT INTO ContactMessagesTable (FromEmail,Subject,Message,IsRead) VALUES ('"+email_contact+"','"+subject+"','"+message+"',0)",
			function(err, data){
			  var result="";
				if(err)
				{
                     result='{ "success":false}';						
					console.log("Mesaj gönderilemedi -->",JSON.stringify(err));	
					res.end(result);					
                }
                else
				{
					 result='{ "success":true}';				
					console.log("Mesaj gönderildi -->",email_contact+" : "+subject);	
					res.end(result);
                }
				//res.end(result);
				console.log("**********************************************\n");
                sql.close();      
            });        		
        }
		
    });
	
}
})


   

}