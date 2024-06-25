const express = require("express"); // use the express module
const app = express(); // Define app as instance of the express module.
const PORT = 8080; //Default port 80880

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com",
};

//Home page
app.get("/", (req, res) => {
  res.send("Hello! Welcome to TinyApp");
});

//Route, representing the entire urlDatabase object in json string
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
