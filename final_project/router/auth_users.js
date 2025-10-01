const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

  // check if username exists
const isValid = (username)=>{ 

  return users.some(user => user.username === username);
};
  // check if username and password match
const authenticatedUser = (username, password)=>{ 
  return users.some(user => user.username === username && user.password === password);
};

//Task 7: Login route , only registered users can login
regd_users.post("/login", (req,res) => {
 const username = req.body.username;
 const password = req.body.password;

  if (!username || !password) {

  return res.status(400).json({message: "Username and Password required"});
  }

  if (authenticatedUser(username, password)) {
    // create JWT token
    const token = jwt.sign({username: username}, "secretkey", {expiresIn: "1h"});
    req.session.authorization = {token, username};
    return res.status(200).json({message: "Login successfull", token});
  } else {
    return res.status(401).json({message: "Invalid credentials"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
