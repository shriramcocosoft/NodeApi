var express = require('express');
var app = express();
var fs = require("fs");

var mssql = require('mssql'); // sql include
var bodyParser = require("body-parser"); // Body parser for fetch posted data

var connection = mssql.connect({ // sql Connection
    user: 'sa',
    password: 'Airtel*123#',
    server: 'DESKTOP-89GK2ML', 
    database: 'RippleWallet',
    });

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); // Body parser use JSON data
 
 
app.post('/registeruser',function(req,res){
    var email = req.params.email; 
    var data = {
        "Data":""
    };    
    
    var quer="SELECT * from UserLogin WHERE Email='"+email+"' ";
    var request = new mssql.Request();
    request.query(quer,function(err, record){
      var count= record.recordset ;
            if(count.length<=0)
            {
                
                data["Data"] = "Registration Sucessfull Completed" ; 
                res.json(data); 
            }
            else{
                data["Data"] = "Email Id Alrady Exit !" +email;res.statusCode=400;
                res.json(data); 
            }
        });
});
 

var server = app.listen(3000, function () {
    console.log("Example app listening at http://127.0.1.1:"+server.address().port+"/")
  })