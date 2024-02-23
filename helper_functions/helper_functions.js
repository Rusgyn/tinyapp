const crypto = require("crypto");
const bcrypt = require("bcryptjs");

//This function will generate random string
function generateRandomString(length) {
  return crypto.randomUUID().split('-')[0].slice(0, length);
}

const {
  users,
  urlDatabase
} = require("./database");


//This helper function will get the user from our users dbase.
const getUser = (id) => {
  return users[id];
};

//Helper function will obtain the user from our users property objects
const getUserByEmail = (email) => {
  let usersEmail = "";
  for(let i in users) {
   usersEmail = (users[i].email);
   if (email === usersEmail) {
    return users[i];
   }
  }
};

//Helper function that will save our newly registered user.
const saveUser = (email, password) => {
  const newUser = {
    id: generateRandomString(6),
    email: email,
    password: bcrypt.hashSync(password, 10)
  };

  users[newUser.id] = newUser;

  return newUser;
};

const isPasswordMatch = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword); // returns true
}

//Helper function that check the cookies if there's an active user.
const isUserLoggedIn = (requestCookies) => {
  return (requestCookies.user_id ? true : false)
}

const urlsForUser = (userId) => {
  let urls = {}

  for (const [urlId, url] of Object.entries(urlDatabase)) {    
    if (userId === url.userID) {
      urls[urlId] = url
    }
  }

  return urls;
}

const checkLoggedInUser = (request, response) => {
  if (!isUserLoggedIn(request.cookies)) {
    return response.send("<html><body>You are require to <b>Login</b> first to access this feature.</html>\n");
  }
}

module.exports = {
  generateRandomString,
  getUser,
  getUserByEmail,
  saveUser,
  urlsForUser,
  checkLoggedInUser,
  isPasswordMatch,
  isUserLoggedIn
}