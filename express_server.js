const crypto = require("crypto");

//This function will generate random string, and will be used as our new urlDatabase key.
function generateRandomString(length) {
  return crypto.randomUUID().split('-')[0].slice(0, length)
}

const express = require("express");// Import the express library
const app = express();// Define our app as an instance of express
const PORT = 8080; //default port 8080

app.set("view engine", "ejs");//This tells the Express app to use EJS as its templating engine.

app.use(express.urlencoded({ extended: true }));//Express's built-in middleware function urlencoded will convert the request body from a Buffer into string that we can read. It will then add the data to the req(request) object under the key body

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

//GET route to show the form
app.get("/urls/new", (req, res) => {
  res.render("urls_new");//render the urls_new template to present the form to the user.
});

//POST route to receive the form submission.
app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  let newKey = generateRandomString(6);
  urlDatabase[newKey] = req.body.longURL;//Add new key:value pair to urlDatabase after clicking submit.
  console.log(urlDatabase);
  // res.redirect(req.body.longURL);
  res.redirect(`/urls/${newKey}`); //redirect to new route, using the random generated id as the route parameter.
});

// Route with route parameter
app.get("/urls/:id", (req, res) => {//The : in front of id indicates that id is a route parameter.
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);//use res.render() to pass the URL data to urls_show template.
});

//Shorter version of redirect link
app.get("/u/:id", (req, res) => {
  const newProp = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  const longURL = newProp.longURL;

  if (longURL === "" || longURL === undefined || longURL === "") {
    res.sendStatus(404);//status code, The requested resource could not be found but may be available in the future.
  } else {
    console.log("\nThe new longURL is: ", longURL);//log the value of longURL
    res.redirect(longURL);
  }
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