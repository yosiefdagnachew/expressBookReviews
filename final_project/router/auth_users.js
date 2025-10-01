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
    const token = jwt.sign({username: username}, "access", {expiresIn: "1h"});
    req.session.authorization = {accessToken: token, username};
    return res.status(200).json({message: "Login successfull", token});
  } else {
    return res.status(401).json({message: "Invalid credentials"});
  }
});

// Task 8: Add/Modify a book review 
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization?.username;
  
  if (!username) {
  return res.status(403).json({message: "Login required"});
  }

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({message: "Review added or modified successfully"});
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});
// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
const isbn = req.params.isbn;
const username =req.session.authorization?.username;

if (!username) {
  return res.status(403).json({message: "Login required"});
}

if (books[isbn ]) {
  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({message: "Review deleted successfully"});
  } else {
    return res.status(404).json({message: "No review found for this user"});
  }
} else {
  return res.status(404).json({message: "Book not found"});
}

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
