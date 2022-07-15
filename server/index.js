//import express
const express = require('express');
//Require the dotenv package and run config(). It will set for us all the environment variables we defined in the .env file.
require("dotenv").config();
//to import the config file use :
const connection = require("../db-config.js");
//set up a variable that has all the methods of express in one place.
const app = express();

//import bcrypt 
const bcrypt = require("bcrypt");

//import json web token
const jwt = require("jsonwebtoken");

//import cors
const cors = require("cors");

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

//Now to relax cross-origin resource sharing. use cors it is a middleware that can be used to enable CORS with various options
app.use(cors());

app.get("/", (req, res) => {
    res.send("Welcome to Trowit backend, check your console to see if your connected to the database");
});

app.get('/users', (req, res) => {
    connection.query('SELECT * FROM users', (err, result) => {
        //! look into the return the connection pool below
        //connection.release();
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
    console.log(req.body);
    let Card = {
        image: req.body.image,
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
        link: req.body.link,
        pdf: req.body.pdf,
        twitter: req.body.twitter,
        instagram: req.body.instagram,
        linkedin: req.body.linkedin,
        facebook: req.body.facebook,
        youtube: req.body.youtube,
        whatsapp: req.body.whatsapp,
        documents: req.body.documents,
        files: req.body.files,
        colour: req.body.colour,
        users_id: req.body.users_id,
    };
    //To avoid SQL injection use the placeholder (?)
    connection.query('INSERT INTO cards SET ?', Card, (err) => {
        if(err) {
            res.status(500).send('Server error, could not add new card into DB')
        } else {
            res.status(201).send("Success adding the card!");
        }
    });
});

//Add the route to receive a new user from the sign-up page
app.post("/registration", (req, res) => {
    bcrypt
     .hash(req.body.hash_password, 10)
     .then((hashedPassword) => {
        let newUser = {
            // image_url: req.body.image_url,
            // first_name: req.body.first_name,
            // last_name: req.body.last_name,
            email: req.body.email,
            hash_password: hashedPassword,
            // birthday: req.body.email,
            // subscription: req.body.subscription,
            // date: req.body.date,
        };
        connection.query('INSERT INTO users SET ?', newUser, (err) => {
            if(err) {
                res
                .status(500)
                .send('Server error, could not register the new user into the DB');
            } else {
                res.status(201).send("Success registering the user!")
            }
        });
     })
    .catch((hashError) => 
    console.error(`There was an error encrypting the password. Error: ${hashError}`));
});

//Route for Login into the app
app.post("/log", (req, res) => {
    const user = {
      email: req.body.email,
      hash_password: req.body.hash_password,
    }
  
    // query the DB to check email and pass
    connection.query(
      "SELECT * FROM users WHERE email=?", user.email,
      (err, results) => {
        if (err) {
          res.status(500).send("Email not found");
        } else {
          bcrypt
            .compare(user.hash_password, results[0].hash_password)
            .then((isAMatch) => {
              if (isAMatch) {
    //Put in the JWT 
            const generatedToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET
            );
                res.status(200).json({
                  message: "Successfully logged in!",
                  token: generatedToken,
                  loggedIn: true,
                  id: results[0].id,
                  first_name: results[0].first_name,
                });
              } else {
                res.status(500).send("Wrong password");
              }
            })
            .catch((passwordError) => 
            console.error("Error trying to decrypt the password")
            );
          }
        }
    );
});

//The middle ware used to authenticate the user
const authenticateUser = (req, res, next) => {
    // console.log(req.headers.authorization);
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    //check if the user has a token
    if (token === undefined) return res.sendStatus(401);
    //check that it is a valid token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        //finally if there's no errors we go to the next middleware
        req.foundUser = user;
        next();
    });
};

app.get('/avatar', authenticateUser, (req, res) => {
    //here we have access to what we did on the req object in the middleware
    //! need to check the req.foundUser
    // console.log("Hello from the server");
    // console.log(req);
    connection.query(
        'SELECT id, first_name, last_name FROM users WHERE email = ?', req.foundUser.email, (err, result) => {
            if (err) {
                res.sendStatus(500);
            } else {
                res.json(result[0]);
            }
        }
    );
});

app.get('/cards/:id', (req, res) => {
    // console.log(req.params.id);
    connection.query(
        'SELECT * FROM cards WHERE users_id = ?', req.params.id, (err, result)  => {
            if (err) {
                res.sendStatus(500);
            } else {
                res.json(result);
            }
        }
    )
});

app.get('/api/individual/card/:id', (req, res) => {
    console.log(req.params.id);
    connection.query(
        'SELECT * FROM cards WHERE id = ?', req.params.id, (err, result) => {
            if (err) {
                res.sendStatus(500);
            } else {
                res.json(result);
            }
        }
    )
});

app.post('/create-contact', (req, res) => {
    let contactCard = {
        image: req.body.image,
        full_name: req.body.full_name,
        title: req.body.title,
        company: req.body.company,
        email: req.body.email,
        phone: req.body.phone,
        website: req.body.website,
        linkdin: req.body.linkdin,
        documents: req.body.documents,
        files: req.body.files,
        add_date: req.body.add_date,
        add_time: req.body.add_time,
        contact_type: req.body.contact_type,
        tag1: req.body.tag1,
        tag2: req.body.tag2,
        tag3: req.body.tag3,
        tag4: req.body.tag4,
        notes: req.body.notes,
        users_id: req.body.users_id
    }
    console.log(contactCard);
        connection.query('INSERT INTO contacts SET ?', contactCard, (err) => {
            if(err) {
                res.status(500).send('Server error, could not add new card into DB')
            } else {
                res.status(201).send("Success adding the card!");
            }
        });
    });

app.get('/contacts/:id', (req, res) => {
    console.log(req.params.id);
    connection.query(
        'SELECT * FROM contacts WHERE users_id = ?', req.params.id, (err, result)  => {
            if (err) {
                res.sendStatus(500);
            } else {
                res.json(result)
            }
        }
    )
});

app.patch('/update-user/:id', (req, res) => {
    console.log(req.params.id);
    let uId = req.params.id;
    let user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name
    }
    connection.query(
        'UPDATE users SET ? WHERE id = ?', [user, uId], (err) => {
            if (err) {
                console.log(res);
                res.status(500).send("There is a problem");
                console.log("There's a problem")
            } else {
                res.status(200).send("Done!!");
                console.log("Good")
            }
        }
    )
})

// app.post('/order-physical-card/:id', (req, res) => {
//     connection.query(
//         'INSERT INTO order_physical_card '
//     )
// })

//Listening to incoming connections
app.listen(port, (err) => {
    if (err) {
        console.error('Something bad happened');
    } else {
        console.log(`Server is running on ${port}`);
    }
}); 