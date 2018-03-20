// Created By Shriram Tekale


// Importing or uses two core modules for managing module dependencies

var MongoClient = require('mongodb').MongoClient; 
var assert = require('assert'); 
var express = require("express"); 
var app = express();
var http = require('http');
var request = require('request');  
var bodyParser = require("body-parser"); 

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); // Body parser use JSON data

//Sample Confuguration String as url, Dbusername and password.
var url = "mongodb://coinxfer:LlGEyRV8yNIwsLvboiMBmuxpt9JTtwkZP1qXzGt1TWEYnXFDOeyDQtWiantcnLVZ61LCSqA6v1GPE7YdG3zkUw==@coinxfer.documents.azure.com:10255/?ssl=true";
var dbusername="coinxfer";
var dbpassword="LlGEyRV8yNIwsLvboiMBmuxpt9JTtwkZP1qXzGt1TWEYnXFDOeyDQtWiantcnLVZ61LCSqA6v1GPE7YdG3zkUw==";

// Some sample arry to store the error message and data to return responce in json format
var data = { 
    "error" :"",
    "message":""   
}; 



 // Web API to accept for user registration 
   // Accepting User detail and calling login app.
    //Change uri of loginc aap and pass the paramenter to trigger the logic app
 
  app.post("/registeruser", function(req, res) { 
    var email=req.body.email; 
    console.log(JSON.stringify(req.body));
    // Checking the valid request 
    if(JSON.stringify(req.body) === '{}')
    { 
        data.error = "Input Parameter null."; 
        console.log("Input Parameter null..");
        res.json(data); 
    }

    //Conneting Mongodb using mongoclient

    MongoClient.connect("mongodb://coinxfer.documents.azure.com:10255/?ssl=true",
     {auth:{user: dbusername,password:dbpassword}}, function (err, db) {
        assert.equal(null, err);
        if (err) throw err; 

        //Return only the documents with the email":
        var query = { "email": req.body.email };
        db.db('registration').collection("User").find(query).toArray(function(err, result) {
         console.log("Calling..................");       
         console.log(result);
         //Checking if is ther any error
          if (err){
            console.log(err);
            data.message="";
            data.error = "Error Occurred while searching result."; 
            console.log(err);
             res.json(data); 
          }; 
          //If email is exit.
          if(result[0]){
            data.message="";
            data.error = "Email Already Exit"; 
            console.log("Email Already Exit..");
             res.json(data); 
          } 
          //if email is not exit.
          if(result==''){
            console.log("Result :"+result);
            console.log("Triggering logic app..........."); 
            // Calling register app method.
            var options = {
                // uri : 'http://localhost:7071/api/RegisterUser',
                uri : 'https://functionappregistration.azurewebsites.net/api/RegisterUser?code=iKT3sHe84sA3zjcizh0dCSEBPQ1DaAZ8l19e8SlcC3SazWZMuLbhXA==',                
                method: 'POST',
                // data: JSON.stringify(req.body),
                body: JSON.stringify(req.body),
                // 'Access-Control-Allow-Credentials': 'true',
                 contentType: 'application/json'};   
                request.post(options, function (error, response, body) {
                if(error){
                    data.error = "Calling Logic app calling issue "+ error; 
                    console.log("Login app Error Message.........:"+error); 
                    res.json(data);
                }
                if (!error && response.statusCode == 200) { 
                    console.log(response.body);
                    data.error ="";
                    data.message = response.body; 
                    res.json(data);    
                } 
            })   
            // res.json(data); 
          }
          db.close();
        });
        }); 
 });  
 
    
 
 // Server is listening the port 3000 you can call using http://host:3000/
 var server = app.listen(3000, function () {
    console.log("Example app listening at http://127.0.1.1:"+server.address().port+"/")
})