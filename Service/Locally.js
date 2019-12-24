var express = require('express');
var app = express();


app.use('/Uploaded', express.static(__dirname + '/Uploaded'));

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Locally WebService listening at http://%s:%s", host, port);
   console.log("**********************************************\n");
})

var http = require('http');
var formidable = require('formidable');
var fs = require('fs');



require('events').EventEmitter.prototype._maxListeners = 1000;



//Login
require('./imports/login')(app);
//Login


//Register
require('./imports/register')(app);
//Register


//Send Contact 
require('./imports/sendContactMessage')(app);
//Send Contact 


//Get Contact 
require('./imports/getContactMessages')(app);
//Get Contact


//Get Ratings 
require('./imports/getRatings')(app);
//Get Ratings 


//Get Comments 
require('./imports/getComments')(app);
//Get Comments 


//Get Images 
require('./imports/getImages')(app);
//Get Images 


//Make Page Visit 
require('./imports/makePageVisit')(app);
//Make Page Visit


//Change Rating 
require('./imports/changeRating')(app);
//Change Rating 

//Delete Comment 
require('./imports/deleteComment')(app);
//Delete Comment


//Make Comment  
require('./imports/makeComment')(app);
//Make Comment  

//SaveUpload 
require('./imports/SaveUploadImage')(app);
//SaveUpload 


//Upload 
require('./imports/uploadImage')(app);
//Upload

//************************************

//GetPlaces 
require('./imports/getPlaces')(app);
//GetPlaces









//**********************************************************************







































