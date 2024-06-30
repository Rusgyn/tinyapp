// This file contains the const databases use for TinyApp server.

//PREDEFINE DATABASE
//users database
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "a@a.com",
    password: "a123",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "1@1.com",
    password: "123",
  },
};

//URL database
const urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  "9sm5xk": {
    longURL: "http://www.google.com",
    userID: "user2RandomID"
  },
  test: {
    longURL: "http://www.well.ca",
    userID: "userRandomID"
  },
};

module.exports = {
  users,
  urlDatabase
};