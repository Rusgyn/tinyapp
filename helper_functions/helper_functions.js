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
const getUser = (userId) => {
  return users[userId];
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
  const userKey = generateRandomString(6);
  const newUser = {
    id: userKey,
    email: email,
    password: password
  };
  users[userKey] = newUser;

  return newUser;
};

//Helper function that check the cookies if there's an active user.
const isUserLoggedIn = (requestCookies) => {
  return (requestCookies.user_id ? true : false)
}


module.exports = {
  generateRandomString,
  getUser,
  getUserByEmail,
  saveUser,
  isUserLoggedIn
}