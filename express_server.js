const express = require("express"); // use the express module
const app = express(); // Define app as instance of the express module.
const PORT = 8080;
const cookieParser = require('cookie-parser');

//express built-in function that convert the request body from a Buffer into a string.
app.use(express.urlencoded({ extended: true }));
//Express middleware that facilitates working with cookies.
app.use(cookieParser());
//Tells the express app to use ejs as its templating engine.
app.set('view engine', 'ejs');

//Function that generates random alphanumeric characters.
const generateRandomString = (length) => {
  return Math.random().toString(36).substring(2, length);
};

//PreDefine users database
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "[email protected]",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "[email protected]",
    password: "dishwasher-funk",
  },
};

//PreDefine URL database.
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com",
};

//Helper Function
//To get the user by id
const getUser = (userId) => { return users[userId] };
//To get the user by email
const getUserByEmail = (email) => { return users[email] };

//Home page
app.get("/", (req, res) => {
  res.redirect("/urls");
});

//READ - Route handler for "/urls"
app.get("/urls", (req, res) => {
  const templateVars = {
    user: getUser(req.cookies["user_id"]),
    urls: urlDatabase
  };

  res.render("urls_index", templateVars);
});

//CREATE - Route that present the Form Submission to create new URL to the end-user
app.get("/urls/new", (req, res) => {
  const templateVars = { user: getUser(req.cookies["user_id"]) };
  
  res.render("urls_new", templateVars);
});

//CREATE - POST route to receive the Form Submission.
app.post("/urls", (req, res) => {
  //Error Handling. Shows error message if longURL is not define or empty.
  if (req.body.longURL === "" || req.body.longURL === undefined) {
    return res.status(403).send("<html><body><t><b>Request Declined</b></t>.<br><br>You did not enter the expected URL. Try again.</html>");
  };

  const id = generateRandomString(8); //Obtain random id as new key
  const newLongURL = req.body.longURL;
  urlDatabase[id] = newLongURL; //Add the new key-value to our database

  res.redirect(`/urls/${id}`); //redirect to new route, using the random generated id as the route parameter.
});

//READ - Route that redirect short URLs
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]; //Access the value of given key or call as the shorter version of the URL.
  
  res.redirect(longURL);
});

//READ - Route handler, use id from route parameter to lookup it's associated longURL from the urlDatabase
app.get("/urls/:id", (req, res) => {
  const templateVars = {
    user: getUser(req.cookies["user_id"]),
    id: req.params.id, 
    longURL: urlDatabase[req.params.id]
  };

  res.render("urls_show", templateVars); //use res.render() to pass the data to urls_show template.
});

//EDIT - POST route that updates/edits a URL resource
app.post("/urls/:id", (req, res) => {
  //Error Handling. Shows error message if longURL is not define or empty.
  if (req.body.longURL === "" || req.body.longURL === undefined) {
    return res.status(403).send("<html><body><t><b>Request Declined</b></t>.<br><br>You did not enter the expected URL. Try again.</html>");
  };

  urlDatabase[req.params.id] = req.body.longURL; //Update the value as per the key (id)

  res.redirect("/urls"); //redirect the client back to its homepage.
})

//DELETE - POST route that removes or deletes a URL resource.
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];

  res.redirect("/urls"); //After the resource has been deleted, redirect the client back to the urls_index page
});

//Route that loads the registration page
app.get("/register", (req, res) => {
  res.render("register");
});

//POST Route to /register
app.post("/register", (req, res) => {

 const id = generateRandomString(8);//This will generate a random id for new user.

 //an instance of new user info
 const newUser = {
  id: id,
  email: req.body.email,
  password: req.body.password
 };

 users[id] = newUser;//Add the new user to the users database.
 res.cookie("user_id", newUser.id);//set cookie with the new user id.
 
 res.redirect("/urls");
});

//READ - Route that shows the index page where user can login.
app.get("/login", (req, res) => {
  res.render("/urls");
})

//CREATE - POST route that handles login.
app.post("/login", (req, res) => {
  //Setting a cookie named username
  res.cookie('username', req.body.username);
  
  res.redirect("/urls"); //After successful login, redirect the client back to the urls page
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id"); //clears the value of key username in cookie.

  res.redirect("/urls");
});

//=====================

//READ - Route, representing the entire urlDatabase object in json string
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//Route, sending HTML
app.get("/hello", (req, res) => {
  res.send("<html> <body> Hello <b>World!</b> </body> </html>")
});

//Make the server listen on our define port, 8080
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
