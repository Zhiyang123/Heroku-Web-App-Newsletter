const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

// since we are using static files such as images and css, we need to use express.static to incorporate into the js file
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    console.log(firstName + lastName + email);

    //JSON object
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    //Need to flat-pack the JSON object 
    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/08647252b4"

    const options = {
        method: "POST",
        auth: "zhiyang00:e13d5cc9e9c622a69c050c9655df64eb-us21"
    }
    
    const request = https.request(url, options, function(response){
        var statusCode = response.statusCode;
        if (statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{ 
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req, res){
    res.redirect("/")
})

//process.env.PORT allows Heroku to pick the port they want to host
app.listen(process.env.PORT || 3000, function(req, res){
    console.log("server is running on port 3000");
})

// API Key 
// e13d5cc9e9c622a69c050c9655df64eb-us21
// Audience ID
// 08647252b4
// Endpoint 
// "https://us21.api.mailchimp.com/3.0"
