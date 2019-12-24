var express =   require("express");
var multer  =   require('multer');
var app         =   express();
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './Uploaded');
	
  },
  filename: function (req, file, callback) {
	console.log(file);	
    callback(null, file.originalname );
	//console.log();
  }
});


var upload = multer({ storage : storage}).single("userPhoto");



module.exports = function(app){
app.post('/process_upload',function(req,res){	
    upload(req,res,function(err) {		
		var result="";
        if(err) {			
            return res.end(result);			
        }
		else{
		result="True";
        res.end(result);		
		console.log(result);
		}
    });
});
}


