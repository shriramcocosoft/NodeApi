// Created By Shriram Tekale


// Importing or uses two core modules for managing module dependencies
var http = require('http');
var request = require('request'); 
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); // Body parser use JSON data

// Some sample arry to store the error message and data to return responce in json format
var data = { 
    "error" :"",
    "Data":"",
    "body":""   
};
 
 // Web API to accept for user registration 
   // Accepting User detail and calling login app.
    //Change uri of loginc aap and pass the paramenter to trigger the logic app

    
  app.post("/registeruser", function(req, res) {
    
    // Checking the valid request 
            if(Object.keys(req.body).length === 0)
            {
                data["error"] = "request body is null";  // if request is null then returing back as null request
                res.json(data); 
            }

            // there is configuration of api  
            // We need to replace uri to logic aap 
            var options = {
                uri : 'http://localhost:7071/api/Function1',
                method: 'POST',
                data : req.body
                // 'Content-Type' : 'application/json'
            };   
            request.post(options, function (error, response, body) {
                if(error){
                data["error"] = error; 
                }
                if (!error && response.statusCode == 200) { 
                data["Data"] = body;        
                } 
            })    
          res.json(data); 
 }); 


 // Server is listening the port 3000 you can call using http://host:3000/
var server = app.listen(3000, function () {
    console.log("Example app listening at http://127.0.1.1:"+server.address().port+"/")
})