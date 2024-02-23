const express = require("express");
const app = express();// Define our app as an instance of express
const PORT = 8080;
const cookieParser = require("cookie-parser");

//Import Database using module
const {
  users,
  urlDatabase
} = require("./helper_functions/database");

//Import functions using module
const {
  generateRandomString,
  getUser,
  getUserByEmail,
  saveUser,
  isUserLoggedIn
} = require("./helper_functions/helper_functions");

app.set("view engine", "ejs");//Tells the Express app to use EJS as its templating engine.
app.use(express.urlencoded({ extended: true }));//urlencoded will convert the request body from a Buffer into string that we can read.
app.use(cookieParser());


//==================================================
//GET route to homepage
app.get("/", (req, res) => {
  res.send("Hello!");//Respond "Hello" when a GET request is made to the homepage
});

//GET route for URLS, define URLS data will.
app.get("/urls", (req, res) => {
  const templateVars = {
    user: getUser(req.cookies["user_id"]),
    urls: urlDatabase
  };

  res.render("urls_index", templateVars);//use res.render() to pass the URL data (urlDatabase) to urls_index.ejs template.
});

//GET route to create new URL
app.get("/urls/new", (req, res) => {
  const templateVars = { user: req.cookies["user_id"] }; //getUser(req.cookies["user_id"])

  if (isUserLoggedIn(req.cookies)) {
    return res.render("urls_new", templateVars);//render the urls_new template to present the form to the user.
  }
  
  res.redirect("/login");
});

// Route with route parameter
app.get("/urls/:id", (req, res) => {//The : in front of id indicates that id is a route parameter.
  const templateVars = {
    user: getUser(req.cookies["user_id"]),
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL
  };

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
  res.send("<html><body>The requested resource could not be found.</html>\n");
});

//POST route to receive the form submission.
app.post("/urls", (req, res) => {
  if (!isUserLoggedIn(req.cookies)) {
    return res.send("<html><body>You are require to <b>Login</b> first to access this feature.</html>\n");
  }

  if (req.body.longURL === "" || req.body.longURL === undefined) {
    return res.redirect("/error");
  } else {
    //function that will check HTTP or HTTPS protocol
    const withHttp = url => !/^https?:\/\//i.test(url) ? `http://${url}` : url;
    
    const newKey = generateRandomString(6);
    const newUrl = {
      longURL: withHttp(req.body.longURL),
      userID: req.cookies.user_id
    }

    urlDatabase[newKey] = newUrl;//Add new key:value pair to urlDatabase after clicking submit.

    res.redirect(`/urls/${newKey}`); //redirect to new route, using the random generated id as the route parameter.
  }
});

//POST route that will update the value of stored longURL.
app.post("/urls/:id", (req, res) => {
  if (!isUserLoggedIn(req.cookies)) {
    return res.send("<html><body>You are require to <b>Login</b> first to access this feature.</html>\n");
  }

  if (req.body.longURL === "" || req.body.longURL === undefined) {
    return res.redirect("/error");
  } else {
    //function that will check HTTP or HTTPS protocol
    const withHttp = url => !/^https?:\/\//i.test(url) ? `http://${url}` : url;
    const url = urlDatabase[req.params.id];
    url.longURL = withHttp(req.body.longURL);
    urlDatabase[req.params.id] = url;

    return res.redirect(`/urls`);
  }
});

//GET route to login
app.get("/login", (req, res) => {
  const templateVars = { user: users };
  if (isUserLoggedIn(req.cookies)) {
    return res.redirect("/urls");
  }
  res.render("login", templateVars);
});

//GET route that register new user.
app.get("/register", (req, res) => {
  const templateVars = { user: users };
  if (isUserLoggedIn(req.cookies)) {
    return res.redirect("/urls");
  }
  res.render("register", templateVars);
});

//POST route that will login.
app.post("/login", (req, res) => {
  const existUser = getUserByEmail(req.body.email);

  if (existUser) {
    if (existUser.password === req.body.password) {
      res.cookie("user_id", existUser.id);
      return res.redirect("/urls");
    } else {
      return res.status(403).send('You have entered an invalid username or password');
    }
  } else {
    return res.status(403).send('You have entered an invalid username or password');
  }

});

//POST registration route.
app.post("/register", (req, res) => {

  //Error Handler: Empty Email or/and password
  if (!req.body.email || !req.body.password) {
    return res.status(400).send('We cannot process your request, you have provided an empty email or/and password. Try registering again.');
  }
  //To check if user email already exist.
  const existUser = getUserByEmail(req.body.email);
  if (existUser) {
    return res.status(400).send('A user with that email already exists, try to login instead');
  }
  //save new user info to the dbase.
  const newUser = saveUser(req.body.email, req.body.password);

  res.cookie("user_id", newUser.id);
  res.redirect("/urls");
});

//POST that logouts user
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

//Route that removed a URL resource. Delete.
app.post("/urls/:id/delete", (req, res) => {

  if (!isUserLoggedIn(req.cookies)) {
    return res.send("<html><body>You are require to <b>Login</b> first to access this feature.</html>\n");
  }

  delete urlDatabase[req.params.id];
  return res.redirect('/urls');
});

//======== ADDITIONAL: Error handling ========
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
//================================

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></html>\n");
});

app.listen(PORT, () => {//Make the server listen to PORT, which is 8080.
  console.log(`Example app listening on port ${PORT}!`);
});