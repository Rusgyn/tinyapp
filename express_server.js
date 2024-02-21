const crypto = require("crypto");
const express = require("express");
const app = express();// Define our app as an instance of express
const PORT = 8080;
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");//Tells the Express app to use EJS as its templating engine.

app.use(express.urlencoded({ extended: true }));//urlencoded will convert the request body from a Buffer into string that we can read.
app.use(cookieParser());

//This function will generate random string
function generateRandomString(length) {
  return crypto.randomUUID().split('-')[0].slice(0, length);
}

//========== Database ========
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//====== Helper functions =====
//This helper function will get the user from our users dbase.
const getUser = (userId) => {
  return users[userId];
};
//Helper function will obtain the email from our users property objects
const getUserByEmail = (email) => {
  //return users[email];
  const usersDbKeys = Object.keys(users);
  for (let key = 0; key < usersDbKeys.length; key++) {
      return users[usersDbKeys[key]].email;
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
//=========================

app.get("/", (req, res) => {
  res.send("Hello");//Respond "Hello" when a GET request is made to the homepage
});

app.get("/urls", (req, res) => {//new route handler for /urls
  const templateVars = {
    user: getUser(req.cookies["user_id"]),
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);//use res.render() to pass the URL data (urlDatabase) to urls_index.ejs template.
});

//GET route to create new URL
app.get("/urls/new", (req, res) => {
  const templateVars = { user: getUser(req.cookies["user_id"]) };
  res.render("urls_new", templateVars);//render the urls_new template to present the form to the user.
});

// Route with route parameter
app.get("/urls/:id", (req, res) => {//The : in front of id indicates that id is a route parameter.
  const templateVars = { user: getUser(req.cookies["user_id"]), id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);//use res.render() to pass the URL data to urls_show template.
});

//Shorter version of redirect link
app.get("/u/:id", (req, res) => {
  const templateVars  = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  const longURL = templateVars.longURL;
  //To check urlDatabase properties has the route parameter,(req.params.id).
  const urlDBKeys = Object.keys(urlDatabase);
  for (let key = 0; key < urlDBKeys.length; key++) {
    if (req.params.id === urlDBKeys[key]) {
      return res.redirect(longURL);
    }
  }
  res.sendStatus(404);//404, The requested resource could not be found
});


//POST route to receive the form submission.
app.post("/urls", (req, res) => {
  let newKey = generateRandomString(6);
  //function that will check HTTP or HTTPS protocol
  const withHttp = url => !/^https?:\/\//i.test(url) ? `http://${url}` : url;
  if (req.body.longURL === "" || req.body.longURL === undefined) {
    return res.redirect("/error");
  } else {
    urlDatabase[newKey] = withHttp(req.body.longURL);//Add new key:value pair to urlDatabase after clicking submit.
  }
  
  res.redirect(`/urls/${newKey}`); //redirect to new route, using the random generated id as the route parameter.
});

//POST route that will update the value of stored longURL.
app.post("/urls/:id", (req, res) => {
  //function that will check HTTP or HTTPS protocol
  const withHttp = url => !/^https?:\/\//i.test(url) ? `http://${url}` : url;
  
  if (req.body.longURL === "" || req.body.longURL === undefined) {
    return res.redirect("/error");
  } else {
    urlDatabase[req.params.id] = withHttp(req.body.longURL);
  }
  res.redirect(`/urls`);
});

//GET route to login
app.get("/login", (req, res) => {
  res.render("login")
});

//GET route that register new user.
app.get("/register", (req, res) => {
  const templateVars = { user: users };
  res.render("register", templateVars);
});

//POST route that will login.
app.post("/login", (req, res) => {
  //save the cookie information of the user
  const user = getUserByEmail(req.body.email);
  //const existingUser = saveUser(req.body.email, req.body.password);
  res.cookie("user_id", user);
  res.redirect("/urls");
});

//POST registration route.
app.post("/register", (req, res) => {
  //Error Handler: Empty Email or/and password
  if (!req.body.email || !req.body.password) {
    return res.status(400).send('We cannot process your request, you have provided an empty email or/and password. Try registering again.');
  }
  //Error Handler: Email already exist in users database.
  //loop the users database object properties for comparison.
  if (req.body.email === getUserByEmail(req.body.email)) {
    return res.status(400).send('A user with that email already exists, try to login instead');
  };

  const newUser = saveUser(req.body.email, req.body.password);
  res.cookie("user_id", newUser.id);
  res.redirect("/urls");
});

//POST that logouts user
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

//Route that removed a URL resource. Delete.
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

//============Additional: Error handling ====
//GET route, if provided and empty URL string.
app.get("/error", (req, res) => {
  const templateVars = { user: getUser(req.cookies["user_id"]), id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_error", templateVars);
});

//POST route, if first attempt was an empty URL string.
app.post("/error", (req, res) => {
  let newKey = generateRandomString(6);
  //function that will check HTTP or HTTPS protocol
  const withHttp = url => !/^https?:\/\//i.test(url) ? `http://${url}` : url;
  urlDatabase[newKey] = withHttp(req.body.longURL);//Add new key:value pair to urlDatabase after clicking submit.

  res.redirect(`/urls/${newKey}`);
});

//==================

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></html>\n");
});

app.listen(PORT, () => {//Make the server listen to PORT, which is 8080.
  console.log(`Example app listening on port ${PORT}!`);
});