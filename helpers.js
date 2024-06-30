// This file contains all the helper functions for TinyApp server.

//Imported the database
const { users, urlDatabase } = require('./database/dBaseHelpers');

//Function that generates random alphanumeric characters.
const generateRandomString = (length) => {
  return Math.random().toString(36).substring(2, length);
};

//To get the user object by email
const getUserByEmail = (email, database) => {
  let usersEmail = "";

  //Iterate the key properties of users object
  for (let key in database) {
    usersEmail = (database[key].email);
    if (email === usersEmail) {
      return database[key]; //return the user's object
    }
  }
  return null;
};

//To get the user by id
const getUser = (userId) => {
  return users[userId];
};

// To check if user is logged in, return Boolean.
const isUserLoggedIn = (reqSession) => {
  return (reqSession.user_id);
  // return (reqSession.user_id ? true : false);
};

// To get the urls associated with the user
const urlsForUser = (userId) => {
  let urls = {};
  for (const [urlId, url] of Object.entries(urlDatabase)) {
    //urlId = is the key; url = is the value {longURL:.., userID:..}
    if (userId === url.userID) {
      urls[urlId] = url;
    }
  }
  return urls;
};

module.exports = { generateRandomString, getUserByEmail, getUser, isUserLoggedIn, urlsForUser };