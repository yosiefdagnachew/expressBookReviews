const express = require('express');
const axios =require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Task 6: Register a new User
public_users.post("/register", (req,res) => {
  const username =req.body.username;
  const password =req.body.password;

   if (!username || !password){
    return res.status(404).json({message: "Username and Password are required "});
   }

   if (users.find(user =>user.username === username)){
    return res.status(409).json({message: "User already exists"});
   }
   users.push({username, password});
  return res.status(200).json({message: "User registered successfully"});
});

// Task 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
 const isbn =req.params.isbn;
 const book = books[isbn];

 if (book){
  return res.status(200).json(book);
 } else {
  return res.status(404).json({message: "Book not found"});
 }
 });
  
// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
const author = req.params.author;
let results = [];

 Object.keys(books).forEach(function(key){
  if (books[key].author ===author) {
    results.push(books[key]);
  }
});

if (results.length>0){
  return res.status(200).json(results);
} else {
  return res.status(404).json({message: "No books found for this author"});
}
});

// Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let results = [];

  Object.keys(books).forEach(function (key) {
    if (books[key].title === title){
      results.push(books[key]);
    }
});

if (results.length >0){
  return res.status(200).json(results);
} else {
  return res.status(404).json({message: "No books found for this tilte"});
}
});

//  Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews){
    return res.status(200).json(book.reviews);
  } else {
  return res.status(404).json({message: "No reviews found for this book"});
  }
});


// ============================
// Tasks 10 -13 (Using Axios)
// ============================

// Task 10: Get book list using async/await + Axios

public_users.get('/async/books', async (req, res) => {
 try {
  const response = await axios.get("http://localhost:5000/");
  return res.status(200).json(response.data);
 } catch (err) {
  return res.status(500).json({ message: "Error fetching books", error: err.message});
  }
});

/// Task 11: Get book details by ISBN using Promises + Axios
public_users.get('/async/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => res.status(200).json(response.data))
    .catch(err => res.status(500).json({ message: "Error fetching book using ISBN", error: err.message }));
});

// Task 12: Get book details by Author using async/await + Axios
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books by author", error: err.message });
  }
});

// Task 13: Get book details by Title using Promise + Axios
public_users.get('/async/title/:title', (req, res) => {
  const title = req.params.title;
  axios.get(`http://localhost:5000/title/${title}`)
    .then(response => res.status(200).json(response.data))
    .catch(err => res.status(500).json({ message: "Error fetching book by title", error: err.message }));
});

 

module.exports.general = public_users;
