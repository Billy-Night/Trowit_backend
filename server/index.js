//Require the dotenv package and run config(). It will set for us all the environment variables we defined in the .env file.
require("dotenv").config();

//to import the config file use :
const connection = require("../db-config.js");

//set up a variable that has all the methods of express in one place.
const express = require('express');

const app = express();

//Set up the port to run off the .env or 5000
const port = process.env.PORT ?? 5000;

// connecting to the database, using the connect method
connection.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
    } else {
        console.log('connected to the database with threadId : ' + connection.threadId);
    }
});

//express.json() and express.urlencoded() is needed for POST and PUT requests, because in both these requests you are sending data (in the form of some data object) to the server and you are asking the server to accept or store that data (object), which is enclosed in the body (req.body) of that POST Request

//Insure that all our routes are able to read a JSON formatted request body.
app.use(express.json());

//This is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application using the code: 
app.use(express.urlencoded({ extended: false }));
//You have to explicitly set extended for express.urlendcoded() since the default value is going to change in the next major version.


app.get("/", (req, res) => {
    res.send("Welcome to Trowit backend, check your console to see if your connected to the database");
});

app.get('/users', (req, res) => {
    connection.query('SELECT * FROM users', (err, result) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error retrieving users from database');
        } else if (result.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.json(result);
        }
    }
    );
});

// This is getting ready to receive the frontend information that will create a new card.
app.post("/createcard", (req, res) => {
    let newCard = {
        type: req.body.type,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        title: req.body.title,
        department: req.body.department,
        company: req.body.company,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        website: req.body.website,
        link: req.body.link  
    };
    connection.query('INSERT INTO cards SET ?', newCard, (err) => {
        if(err) {
            res.status(500).send('Server error, could not add new card into DB')
        } else {
            res.status(201).send("Success adding the card!");
        }
    });
});

//Listening to incoming connections
app.listen(port, (err) => {
    if (err) {
        console.error('Something bad happened');
    } else {
        console.log(`Server is running on ${port}`);
    }
}); 

