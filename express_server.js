const crypto = require("crypto");

//This function will generate random string, and will be used as our new urlDatabase key.
function generateRandomString(length) {
  return crypto.randomUUID().split('-')[0].slice(0, length);
}

const express = require("express");
const app = express();// Define our app as an instance of express
const PORT = 8080;
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");//This tells the Express app to use EJS as its templating engine.

app.use(express.urlencoded({ extended: true }));//urlencoded will convert the request body from a Buffer into string that we can read.
app.use(cookieParser());

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

const getUser = (userId) => {
  return users[userId];
};

const getUserByEmail = (email) => {
  return users[email];
};

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

//Route that will update the value of stored longURL.
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


//GET login
app.get("/login", (req, res) => {
  //check if the user is logged in.
  const templateVars = { user: users };
  console.log("GET-LOGIN templateVars: ", templateVars);
  if (req.cookie.user_id) {
    return res.redirect("/urls", templateVars);
  }
  //If not then they can log-in.
  res.render("/urls");
});

//GET route that register new user.
app.get("/register", (req, res) => {
  const templateVars = { user: users };
  res.render("register", templateVars);
});

//POST route that will login.
app.post("/login", (req, res) => {
  //save the cookie information of the user
  const user = getUserByEmail(req.body.user_id);
  res.cookie("user_id", user.id);
  res.redirect("/urls");
});

//POST registration route.
app.post("/register", (req, res) => {
  const newUser = saveUser(req.body.email, req.body.password);
  console.log("POST-REGISTER users dbase: ", users);
  console.log("POST-REGSTER newUser.id: ", newUser.id);
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
  res.redirect('/urls');//Client will be redirected to this page once delete is done.
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