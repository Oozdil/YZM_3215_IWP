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



   app.post('/process_login', urlencodedParser, function (req, res) { 
 
    var email =  req.body.email;
	var password = req.body.pwd;
	var errorMessage="";
	

	try{	
    email=email.trim();
	password=password.trim();
	}
	catch
	{
	email="";
	password="";
	errorMessage="Hata!, Lütfen 'email' ve 'pwd' parametrelerini gönderiniz! ";
	console.log(errorMessage);
	res.end('{ "UserID":"", "Name":"", "Surname":"","Email":"","Message":"'+errorMessage+'"}'); 
    return false;   	
	}
	
	if(!validateEmail(email))
	{
		email="";
		errorMessage="Mail adresi geçersiz";
	    console.log(errorMessage);		
		res.end('{ "UserID":"", "Name":"", "Surname":"","Email":"","Message":"'+errorMessage+'"}'); 
		return false;
	}
	
	if(email=="" || password=="")
	{		
		errorMessage="Kullanıcı adı veya şifre boş olamaz";
	    console.log(errorMessage);		
		res.end('{ "UserID":"", "Name":"", "Surname":"","Email":"","Message":"'+errorMessage+'"}'); 
	}
	else
	{
	res.header("Access-Control-Allow-Origin","*");
	console.log(email+" "+password+" için login isteği geldi");

	sql.close();
	sql.connect(dbConfig, function(err){
        if(err){
            console.log(err);
			return;
        }
        else {                       
            var request = new sql.Request();          
            request.query("select UserID,Name,Surname,Email,IsAdmin from UsersTable WHERE Email='"+email+"' and Password='"+password+"' and IsActive=1",
			function(err, data){
                if(err){
                       console.log(err);                   
                }
                else
				{
					
					var result="";
					if(data.recordsets[0][0])
					{
						result=(JSON.stringify(data.recordsets[0][0]));	
						console.log("Sonuç : "+result);
					}
					else
					{
						result='{ "UserID":"", "Name":"", "Surname":"","Email":"","Message":"Kullanıcı bulunamadı"}';
						console.log("Kullanıcı bulunamadı");
					}  
								
					res.end(result);
					console.log("**********************************************\n");
                }
                sql.close();    
            });        		
        }
    });
   }
})
}