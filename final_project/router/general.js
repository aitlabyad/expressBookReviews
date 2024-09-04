const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    // Return the hardcoded books data
    return res.status(200).json(books);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    // Return the book details based on the ISBN
    return res.status(200).json(books[req.params.isbn]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching book details" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  //Write your code here
  try {
    if (!req.params.author) {
      throw new Error("Author name is required");
    }
    // Return the book details based on the author
    const authorName = req.params.author;
    // Check if author name exist in the books author list
    const authorExists = Object.values(books).some(
      (book) => book.author === authorName
    );
    if (!authorExists) {
      return res.status(404).json({ message: "Author not found" });
    }
    // Filter books by author name
    const booksByAuthor = Object.values(books).filter(
      (book) => book.author === authorName
    );
    return res.status(200).send(JSON.stringify(booksByAuthor));
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  try {
    if (!req.params.title) {
      throw new Error("Title is required");
    }
    // Return the book details based on the title
    const titleName = req.params.title;
    // Check if title name exist in the books title list
    const titleExists = Object.values(books).some(
      (book) => book.title === titleName
    );
    if (!titleExists) {
      return res.status(404).json({ message: "Title not found" });
    }
    // Filter books by title name
    const booksByTitle = Object.values(books).filter(
      (book) => book.title === titleName
    );
    return res.status(200).send(JSON.stringify(booksByTitle));
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required" });
  }
  const bookReviews = Object.values(books).filter((book) => book.isbn === isbn);
  console.log(bookReviews.review);
  return res.status(200).send(JSON.stringify(bookReviews.review));
});

module.exports.general = public_users;
