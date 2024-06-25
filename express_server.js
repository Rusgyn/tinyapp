const express = require("express"); // use the express module
const app = express(); // Define app as instance of the express module.
const PORT = 8080;

app.set('view engine', 'ejs'); //Tells the express app to use ejs as its templating engine.

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com",
};

//Home page
app.get("/", (req, res) => {
  res.redirect("/urls");
});

//Route, representing the entire urlDatabase object in json string
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//Route, sending HTML
app.get("/hello", (req, res) => {
  res.send("<html> <body> Hello <b>World!</b> </body> </html>")
});

//Route handler for "/urls"
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase
  };

  res.render("urls_index", templateVars);
});

//Route that present the create new URL form to the end-user
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//Route handler, use id from route parameter to lookup it's associated longURL from the urlDatabase
app.get("/urls/:id", (req, res) => {
    const templateVars = {
    id: req.params.id, 
    longURL: urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});


//Make the server listen on our define port, 8080
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
