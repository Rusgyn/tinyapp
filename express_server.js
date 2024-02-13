const express = require("express");// Import the express library
const app = express();// Define our app as an instance of express
const PORT = 8080; //default port 8080

app.set("view engine", "ejs");//This tells the Express app to use EJS as its templating engine

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello");//Respond "Hello" when a GET request is made to the homepage
});

app.get("/urls", (req, res) => {//new route handler for /urls
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);//use res.render() to pass the URL data (urlDatabase) to urls_index.ejs template.
});

// Additional route with route parameter
app.get("/urls/:id", (req, res) => {//The : in front of id indicates that id is a route parameter.
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);//use res.render() to pass the URL data to urls_show template.
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