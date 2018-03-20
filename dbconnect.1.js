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

var url = "mongodb://coinxfer:0vqUVl1XHefipOQjGJMw37XyevCr72VvKlmMOPlwCWfoTG84nOAMsPOTi8r2y4KEIj3SbiMP6XuIkcESJgN4gA==@coinxfer.documents.azure.com:10255/?ssl=true";
var dbusername="coinxfer";
var dbpassword="0vqUVl1XHefipOQjGJMw37XyevCr72VvKlmMOPlwCWfoTG84nOAMsPOTi8r2y4KEIj3SbiMP6XuIkcESJgN4gA==";

var data = { 
    "error" :"",
    "Data":"",
    "body":""   
}; 
  app.post("/connect", function(req, res) { 
    var email=req.body.email;
    //console.log("email :"+req.body);
    MongoClient.connect("mongodb://coinxfer.documents.azure.com:10255/?ssl=true",
     {auth:{user: dbusername,password:dbpassword}}, function (err, db) {
        assert.equal(null, err);
        
         findEmail(db,email, function(err, doc) {
             console.log("its me" , doc, err)
             if (err) { 
                data.Data = "Error.";
                res.json(data); 
                 };
            if(doc!=null)
            {
                console.log(doc);
                data.Data = "Email is exit";
                res.json(data); 
            }
            else
            {    
                data.body = "Procesing ur request...."; 
                var options = {
                    uri : 'http://localhost:7071/api/RegisterUser',
                    method: 'POST',
                    data: JSON.stringify(req.body),
                     contentType: 'application/json'};   
                request.post(options, function (error, response, body) {
                    if(error){
                        data.error = error; 
                    }
                    if (!error && response.statusCode == 200) { 
                    data.message = "registration Suecessful";        
                    } 
                })    

                res.json(data); 
            }
        });
        }); 
 });  
 
    var findEmail = function(db, email ,callback) {
    var cursor =db.db('registration').collection('User').find({'email':email}).limit(1);
    console.log(email);
    console.log("cursor ************************");
    console.log(cursor.doc);
    //var result =false;
    var i =0;
    var docs=null;
    var error=null;
   
    cursor.forEach(function(doc, err) {
        if (err) { callback(doc, err);}
        console.log("counter" + (i++) , err , doc);
        docs=doc;
        error=err;
        callback(err, doc); 
        // callback(err,doc); 
    //    // assert.equal(err, null); 
    //     if (doc != null) {
    //         //console.dir(doc);
    //         //callback(err, doc) ;
    //         //result = true;
    //         //return false;
    //     } else {
           
    //        //return false;
    //     }
    });
    return ;
    //   callback(error,docs);
    //return result;
    }; 

 // Server is listening the port 3000 you can call using http://host:3000/
var server = app.listen(3000, function () {
    console.log("Example app listening at http://127.0.1.1:"+server.address().port+"/")
})
