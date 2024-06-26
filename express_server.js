const express = require("express"); // use the express module
const app = express(); // Define app as instance of the express module.
const PORT = 8080;

//express built-in function that convert the request body from a Buffer into a string.
app.use(express.urlencoded({ extended: true }));
//Tells the express app to use ejs as its templating engine.
app.set('view engine', 'ejs');

//Function that generates random alphanumeric characters.
const generateRandomString = (length) => {
  return Math.random().toString(36).substring(2, length);
};

//PreDefine database.
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

//Route that present the Form Submission to create new URL to the end-user
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//POST route to receive the Form Submission.
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

//Route that redirect short URLs
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]; //Access the value of given key or call as the shorter version of the URL.
  
  res.redirect(longURL);
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
