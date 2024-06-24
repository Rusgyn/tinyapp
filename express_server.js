const express = require("express"); // use the express module
const app = express(); // Define app as instance of the express module.
const PORT = 8080; //Default port 80880

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com",
};

app.get("/", (req, res) => {
  res.send("Hello! Welcome to TinyApp");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`App listening on pport ${PORT}!`);
});
