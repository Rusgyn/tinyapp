const crypto = require("crypto");

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
    password: password
  };

  users[newUser.id] = newUser;

  return newUser;
};

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

module.exports = {
  generateRandomString,
  getUser,
  getUserByEmail,
  saveUser,
  urlsForUser,
  isUserLoggedIn
}