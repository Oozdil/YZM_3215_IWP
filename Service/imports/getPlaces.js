var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sql = require("mssql/msnodesqlv8"); 


// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//Initiallising connection string
var dbConfig=require('./dbConfig');

const request = require('request');
var headers = {
    'Authorization': ' Bearer MaLnLk2eJfyAZRyO5mAndbn9aLjvdGuQ8uyryugOi6SjBn1PfX6xFYfpq2Rrws4q-O3jSsAjC-X4lSSWM3AI52qjozXGsSjEbYHR9bWV7VzeW-KuMjIMw2tBEwK3XXYx'
};

module.exports = function(app){


    //process_getPlacesByCoords
   app.post('/process_getPlacesByCoords', urlencodedParser, function (req, res) {      
	res.header("Access-Control-Allow-Origin","*");
	
	var latitude=req.body.latitude;
	var longitude=req.body.longitude;
	var term=req.body.term;
	console.log(latitude+" , "+longitude+" , "+term+" için yer arama isteği");
	request({'url':'http://api.yelp.com/v3/businesses/search?latitude='+latitude+'&longitude='+longitude+'&term='+term+'&limit=50','headers':headers}, function (error, response, body) {
	
		
		  if (!error && response.statusCode == 200) 
		  {
			res.end(JSON.stringify(body), "utf8");
			console.log("Sonuçlar alındı :"+longitude+" "+latitude) // 
		  }
		  else{
			  res.end("Bir hata oluştu");
		  }
		   console.log("********************************************\n");
			});
		});
		
		
	//process_getPlacesByLocation
	app.post('/process_getPlacesByLocation', urlencodedParser, function (req, res) {      
	res.header("Access-Control-Allow-Origin","*");	
	var location=req.body.location;
	console.log(location+" için yer arama isteği");
	
	request({'url':'http://api.yelp.com/v3/businesses/search?location='+location+'&limit=50','headers':headers}, function (error, response, body) {
	
		
		  if (!error && response.statusCode == 200) 
		  {
			res.end(JSON.stringify(body), "utf8");
			console.log("Sonuçlar alındı : "+location) // 
		  }
		  else{
			  res.end("Bir hata oluştu");
			  console.log("hata : "+error);
		  }
		  console.log("********************************************\n");
	});
	});	
		
		
		
	//process_getPlacesByLocationAndTerm
	app.post('/process_getPlacesByLocationAndTerm', urlencodedParser, function (req, res) {      
	res.header("Access-Control-Allow-Origin","*");	
	var location=req.body.location;
	var term=req.body.term;
	console.log(location+" ve "+term+" için yer arama isteği");
	
	request({'url':'http://api.yelp.com/v3/businesses/search?location='+location+'&term='+term+'&limit=50','headers':headers}, function (error, response, body) {
	
		
		  if (!error && response.statusCode == 200) 
		  {
			res.end(JSON.stringify(body), "utf8");
			console.log("Sonuçlar alındı : "+location) // 
		  }
		  else{
			  res.end("Bir hata oluştu");
			  console.log("hata : "+error);
		  }
		  console.log("********************************************\n");
	});
	});	
	
	
	
	//process_getPlaceDetails
	
	
	app.post('/process_getPlaceDetails', urlencodedParser, function (req, res) {      
	res.header("Access-Control-Allow-Origin","*");	
	var id=req.body.id;

	console.log("ID : "+id+" için yelp detay arama isteği");
	

	
	
	
	request({'url':'http://api.yelp.com/v3/businesses/'+id,'headers':headers}, function (error, response, body) {
	
		
		  if (!error && response.statusCode == 200) 
		  {
			res.end(JSON.stringify(body), "utf8");
			console.log("Detaylar alındı : "+id) // 
		  }
		  else{
			  res.end("Bir hata oluştu");
			  console.log("hata : "+error);
		  }
		  console.log("********************************************\n");
	});
	});
	
	
	
	
	
	
	
	
	
	
}