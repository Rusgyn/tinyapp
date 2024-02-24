const express = require("express");
const app = express();// Define our app as an instance of express
const PORT = 8080;
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");

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
  urlsForUser,
  checkLoggedInUser,
  isUserLoggedIn
} = require("./helpers");

app.set("view engine", "ejs");//Tells the Express app to use EJS as its templating engine.
app.use(express.urlencoded({ extended: false }));//urlencoded will convert the request body from a Buffer into string that we can read.
app.use(express.json());
app.use(cookieSession({
  name: 'session',
  keys: ['secret!'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));


//==================================================
//GET route to homepage
app.get("/", (req, res) => {
  res.send("Hello!");//Respond "Hello" when a GET request is made to the homepage
});

//GET route for URLS, define URLS data will.
app.get("/urls", (req, res) => {
  checkLoggedInUser(req, res);

  let user = getUser(req.session.user_id);

  const templateVars = {
    user: user,
    urls: urlsForUser(user.id)
  };

  res.render("urls_index", templateVars);//use res.render() to pass the URL data (urlDatabase) to urls_index.ejs template.
});

//GET route to create new URL
app.get("/urls/new", (req, res) => {
  const templateVars = { user: req.session.user_id }; //getUser(req.session.user_id)

  if (isUserLoggedIn(req.session)) {
    return res.render("urls_new", templateVars);//render the urls_new template to present the form to the user.
  }
  
  res.redirect("/login");
});

// Route with route parameter
app.get("/urls/:id", (req, res) => {//The : in front of id indicates that id is a route parameter.
  checkLoggedInUser(req, res);

  const user = getUser(req.session.user_id);
  const url  = urlsForUser(user.id)[req.params.id];

  if (url) {
    const templateVars = {
      user: user,
      id: req.params.id,
      longURL: url.longURL
    };

    return res.render("urls_show", templateVars);//use res.render() to pass the URL data to urls_show template.
  } else {
    return res.send("<html><body>Unauthorized. You do not own this url.</html>\n");
  }
});

//Link redirection in shorter version
app.get("/u/:id", (req, res) => {
  for (let key in urlDatabase) {
    if (req.params.id === key) {
      const templateVars  = { id: req.params.id, longURL: urlDatabase[req.params.id].longURL};
      const longURL = templateVars.longURL;

      return res.redirect(longURL);
    } 
  }
  return res.send("<html><body>The requested <b>resource</b> could not be found.</html>");
});


//POST route - receives submitted form.
app.post("/urls", (req, res) => {
  checkLoggedInUser(req, res);

  if (req.body.longURL === "" || req.body.longURL === undefined) {
    return res.redirect("/error");
  } else {
    //function that will check HTTP or HTTPS protocol
    const withHttp = url => !/^https?:\/\//i.test(url) ? `http://${url}` : url;
    
    const newKey = generateRandomString(6);
    const newUrl = {
      longURL: withHttp(req.body.longURL),
      userID: req.session.user_id
    };

    urlDatabase[newKey] = newUrl;//Add new key:value pair to urlDatabase after clicking submit.

    res.redirect(`/urls/${newKey}`); //redirect to new route, using the random generated id as the route parameter.
  }
});

//POST route - update/edit the stored longURL
app.post("/urls/:id", (req, res) => {
  checkLoggedInUser(req, res);

  if (req.body.longURL === "" || req.body.longURL === undefined) {
    return res.status(403).send("<html><body><t><b>Request Declined</b></t>.<br><br>You did not enter the expected URL. Try again.</html>");
  }

  const url = urlsForUser(req.session.user_id)[req.params.id];

  if (url) {
    //function that will check HTTP or HTTPS protocol
    const withHttp = url => !/^https?:\/\//i.test(url) ? `http://${url}` : url;
    
    url.longURL = withHttp(req.body.longURL);
    urlDatabase[req.params.id] = url;

    return res.redirect(`/urls`);
  } else {
    return res.send("<html><body><b>Unauthorized</b>. You do not own this url.</html>");
  }
});

//GET route to login
app.get("/login", (req, res) => {
  if (isUserLoggedIn(req.session)) {
    return res.redirect("/urls");
  }

  const templateVars = { user: users };
  res.render("login", templateVars);
});

//GET route to register new user.
app.get("/register", (req, res) => {
  if (isUserLoggedIn(req.session)) {
    return res.redirect("/urls");
  }

  const templateVars = { user: users };
  res.render("register", templateVars);
});

//POST route that logins user.
app.post("/login", (req, res) => {
  const existUser = getUserByEmail(req.body.email, users);

  if (existUser) {
    if (bcrypt.compareSync(req.body.password, existUser.password)) {
      req.session.user_id = existUser.id;
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
  const existUser = getUserByEmail(req.body.email, users);
  if (existUser) {
    return res.status(400).send('A user with that email already exists, try to login instead');
  }
  //save new user info to the dbase.
  const password = bcrypt.hashSync(req.body.password, 10);
  const newUser = saveUser(req.body.email, password);

  req.session.user_id = newUser.id;
  res.redirect("/urls");
});

//POST that logouts user
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

//Route that removed a URL resource. Delete.
app.post("/urls/:id/delete", (req, res) => {
  checkLoggedInUser(req, res);

  const url = urlsForUser(req.session.user_id)[req.params.id];

  if (url) {
    delete urlDatabase[req.params.id];
    return res.redirect('/urls');
  } else {
    return res.send("<html><body>Unauthorized. You do not own this url.</html>\n");
  }
});

//======== ADDITIONAL: Error handling ========
//GET route, if provided and empty URL string.
app.get("/error", (req, res) => {
  const templateVars = { user: req.session.user_id }; //getUser(req.session.user_id)

  if (isUserLoggedIn(req.session)) {
    return res.render("urls_error", templateVars);//render the urls_new template to present the form to the user.
  }
  
  res.redirect("/login");
});

//POST route, if first attempt was an empty URL string.
app.post("/error", (req, res) => {
  checkLoggedInUser(req, res);

  //function that will check HTTP or HTTPS protocol
  const withHttp = url => !/^https?:\/\//i.test(url) ? `http://${url}` : url;
  
  const newKey = generateRandomString(6);
  const newUrl = {
    longURL: withHttp(req.body.longURL),
    userID: req.session.user_id
  };

  urlDatabase[newKey] = newUrl;//Add new key:value pair to urlDatabase after clicking submit.

  res.redirect(`/urls/${newKey}`); //redirect to new route, using the random generated id as the route parameter.
  
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