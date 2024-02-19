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

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello");//Respond "Hello" when a GET request is made to the homepage
});

app.get("/urls", (req, res) => {//new route handler for /urls
  const templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  };

  res.render("urls_index", templateVars);//use res.render() to pass the URL data (urlDatabase) to urls_index.ejs template.
});

//GET route to create new URL
app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);//render the urls_new template to present the form to the user.
});

// Route with route parameter
app.get("/urls/:id", (req, res) => {//The : in front of id indicates that id is a route parameter.
  const templateVars = { username: req.cookies["username"], id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);//use res.render() to pass the URL data to urls_show template.
});

//Shorter version of redirect link
app.get("/u/:id", (req, res) => {
  const templateVars  = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  const longURL = templateVars.longURL;

  if (longURL === "" || longURL === undefined) {
    res.sendStatus(404);//404, The requested resource could not be found
  }

  res.redirect(longURL);

});

//POST route to receive the form submission.
app.post("/urls", (req, res) => {
  let newKey = generateRandomString(6);
  //function that will check HTTP or HTTPS protocol
  const withHttp = url => !/^https?:\/\//i.test(url) ? `http://${url}` : url;

  if (req.body.longURL === "" || req.body.longURL === undefined) {
    urlDatabase[newKey] = req.body.longURL;
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
    urlDatabase[req.params.id] = req.body.longURL;
  } else {
    urlDatabase[req.params.id] = withHttp(req.body.longURL);
  }

  res.redirect(`/urls`);
});

//GET login
app.get("/login", (req, res) => {
  //check if the user is logged in.
  if (req.cookie.username) {
    return res.redirect("/urls");
  }
  //If not then they can log-in.
  res.render("/urls");
});

//POST route that will login.
app.post("/login", (req, res) => {
  //save the cookie information of the user
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

//POST that logouts user
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
})

//Route that removed a URL resource. Delete.
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');//Client will be redirected to this page once delete is done.
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></html>\n");
});

app.listen(PORT, () => {//Make the server listen to PORT, which is 8080.
  console.log(`Example app listening on port ${PORT}!`);
});