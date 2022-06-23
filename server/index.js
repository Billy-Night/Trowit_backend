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

//Insure that all our routes are able to read a JSON formatted request body.
app.use(express.json());

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

//Listening to incoming connections
app.listen(port, (err) => {
    if (err) {
        console.error('Somthing bad happended');
    } else {
        console.log(`Server is runnning on ${port}`);
    }
}); 

