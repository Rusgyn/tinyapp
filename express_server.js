const express = require("express"); //use the express module
const app = express(); // Define app as instance of the express module.
const PORT = 8080;
const cookieSession = require("cookie-session"); //https://github.com/expressjs/cookie-session
const bcrypt = require('bcryptjs'); //convert the passwords to more secure
const { generateRandomString, getUserByEmail, getUser, isUserLoggedIn, urlsForUser } = require('./helpers');//import the helper functions using modules
const { users, urlDatabase } = require('./database/dBaseHelpers'); //import the databases.

//express built-in function that convert the request body from a Buffer into a string.
app.use(express.urlencoded({ extended: true }));
//Tells the express app to use ejs as its templating engine.
app.set('view engine', 'ejs');
//Express middleware that facilitates working with cookies.
app.use(cookieSession({
  name: 'session',
  keys: ['secret!'],
  // Cookie Options
  // 24 hours. Number representing the milliseconds from Date.now() for expiry
  maxAge: 24 * 60 * 60 * 1000
}));


//GET ROUTE: Load the Index Page
app.get("/", (req, res) => {
  isUserLoggedIn(req.session) ? res.redirect("/urls") : res.render("welcome");
  return;
});

//GET ROUTE: Shows the "/urls"
app.get("/urls", (req, res) => {

  if (isUserLoggedIn(req.session)) { //Case: User is logged in.
    const user = getUser(req.session.user_id);
    const templateVars = {
      user: user,
      urls: urlsForUser(req.session.user_id)
    };
    return res.render("urls_index", templateVars);
  } else { //Case: User not loggedIn, no permission to access the URLs
    return res.render("reqDeclined"); //code error: 401. Authentication required.
  }

});

//GET ROUTE: Present the Form Submission to create new URL to the end-user
app.get("/urls/new", (req, res) => {

  if (isUserLoggedIn(req.session)) { //Case: User is logged in.
    const templateVars = { user: getUser(req.session.user_id) };
    
    return res.render("urls_new", templateVars);
  } else { //Case: User not logged in.
    return res.redirect("/login");
  }
});

//POST ROUTE: to receive the Create Form Submission.
app.post("/urls", (req, res) => {

  if (isUserLoggedIn(req.session)) { //Case: User is logged in.
    //Error Handling. Shows error message if longURL is not define or empty.
    if (req.body.longURL === "" || req.body.longURL === undefined) {
      return res.status(403).send("<html><body><t><b>Request Declined</b></t>.<br><br>You did not enter the expected URL. Try again.</html>");
    }

    const id = generateRandomString(8); //Obtain random id as new key
    //A function that will check the HTTP or HTTPS protocol. Https or http is required.
    const withHttp = url => !/^https?:\/\//i.test(url) ? `http://${url}` : url;
    //an instance of new url
    const newURL = {
      longURL: withHttp(req.body.longURL),
      userID: req.session.user_id
    };

    urlDatabase[id] = newURL; //Add the new key-value to our url database
    
    return res.redirect(`/urls/${id}`); //redirect to new route, using the random generated id as the route parameter.
  } else { //Case: User is not logged in.
    return res.status(403).send("<html><body><t><b>Request Declined</b></t>.<br><br>This requires authentication, you must login and start a new request.</html>");
  }

});

//GET ROUTE: Handles directing short URLs
app.get("/u/:id", (req, res) => {
  for (let key in urlDatabase) {
    if (key === req.params.id) {
      const templateVars  = {
        id: req.params.id,
        longURL: urlDatabase[req.params.id].longURL
      };
      const longURL = templateVars.longURL; //Access the value of given key or call as the shorter version of the URL.
      return res.redirect(longURL);
    }
  }

  return res.render("reqDeclined"); //send("<html><body>The requested <b>resource</b> could not be found.</html>");
});

//GET ROUTE: Handle to lookup it's associated longURL from the urlDatabase use id from route parameter (:id)
app.get("/urls/:id", (req, res) => {

  const id = req.params.id;

  let urlKeys = Object.keys(urlDatabase); //returns a new array of keys
  //Checks if short URL id exist of not
  if (!urlKeys.includes(id)) {
    return res.render("reqDeclined"); //code error: 400, Bad Request. ShortURL does not exist.
  }

  if (isUserLoggedIn(req.session)) { //Case: User is loggedIn

    const user = getUser(req.session.user_id); //Get the loggedIn user
    const urlOwner = urlsForUser(req.session.user_id)[id]; //Checks if the url belong to the current loggedIn user.

    if (urlOwner) { //Case: User is logged and owns the URL
      const templateVars = {
        user: user,
        id: id,
        longURL: urlOwner.longURL
      };
      return res.render("urls_show", templateVars);
    } else { //Case: User is logged but does not own the URL
      return res.render("reqDeclined"); //code error: 403, Forbidden. Don't have permission to access this resource.
    }
  } else { //Case: User not loggedIn
    return res.render("reqDeclined"); //code error: 401. Unauthorized
  }

});

//POST ROUTE: Handles the updating/editing a URL resource
app.post("/urls/:id", (req, res) => {

  if (isUserLoggedIn(req.session)) { //Case: User is loggedIN
    //Error Handling. Shows error message if longURL is not define or empty.
    if (req.body.longURL === "" || req.body.longURL === undefined) {
      return res.status(403).send("<html><body><t><b>Request Declined</b></t>.<br><br>You did not enter the expected URL. Try again.</html>");
    }

    const url = urlsForUser(req.session.user_id)[req.params.id]; //Checks if the url belongs to the current loggedIn user.
  
    if (url) { //Case: user is loggedIn and owns the URL for the given ID
      //function that will check HTTP or HTTPS protocol
      const withHttp = url => !/^https?:\/\//i.test(url) ? `http://${url}` : url;
      
      url.longURL = withHttp(req.body.longURL);
      urlDatabase[req.params.id] = url;

      return res.redirect(`/urls`);
    } else { //Case: user is loggedIn but does not own the URL for the given ID
      return res.render("reqDeclined"); //send("<html><body><t><b>Request Declined</b></t>.<br><br>You don't have permission to this resource</html>");
    }
  } else { //Case: User not loggedIN
    return res.render("reqDeclined"); //Restricted: User not allowed to update/edit.
  }

});
 
//POST ROUTE: Handles deleting a URL resource.
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  
  if (isUserLoggedIn(req.session)) { //Case: User is loggedIn
    const url = urlsForUser(req.session.user_id)[req.params.id]; //Checks if the url belong to the current loggedIn user.
    //The URL belongs to the current user
    if (url) { //Case: user is logged in and owns the URL for the given ID:
      delete urlDatabase[id];
      return res.redirect('/urls');
    } else { //Case: User is loggedIn but doesn't owns the URL for the given ID:
      return res.status(403).send("<html><body>You do not have permission to access this resource.</html>\n");
    }
  } else { //Case: User is not loggedIN
    return res.status(401).send("<html><body>Authentication is required. Login to your TinyApp account</html>\n");
  }
});

//GET ROUTE: Shows the registration page
app.get("/register", (req, res) => {
  const templateVars = {
    user: users,
  };
  //To check if any user is currently logged in.
  //Case: User is loggedIn
  if (isUserLoggedIn(req.session)) return res.redirect("/urls");
  //Case: User is not loggedIn
  return res.render("register", templateVars);
});

//POST ROUTE: Handles registering new account
app.post("/register", (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync();
  const hashedPassword = bcrypt.hashSync(password, salt);
 
  //Error Handler to send status if email or password is falsy.
  if (!email || !password) {
    return res.status(400).send('<html><body><t><b>Bad Request</b></t>.<br><br>Email or password is missing.</html>');
  }

  //Error Handler: user's email already exist
  const existingUser = getUserByEmail(email, users);
  if (existingUser && email === existingUser.email) {
    return res.status(401).send('<html><body><t><b>Bad Request</b></t>.<br><br>Email exist.</html>');
  }

  const id = generateRandomString(8);//This will generate a random id for new user.

  //an instance of new user info
  const newUser = {
    id: id,
    email: email,
    password: hashedPassword
  };

  users[id] = newUser; //Add the new user to the users database.
  req.session.user_id = newUser.id; //set session with the new user id.
  
  return res.redirect("/urls");
});

//GET ROUTE: Shows the index page where user can login.
app.get("/login", (req, res) => {
  const templateVars = {
    user: users,
  };
  //To check if any user is currently logged in.
  //Case: User is loggedIN
  if (isUserLoggedIn(req.session)) return res.redirect("/urls");
  //Case: User is not loggedIN
  return res.render("login", templateVars);
});

//POST ROUTE: handles login.
app.post("/login", (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  const existingUser = getUserByEmail(email, users);

  //Error Handler to send status if email or password is empty.
  if (!email || !password) return res.status(400).send('Email or password is missing');
  
  if (existingUser) { //Case: Registered User
    //checking the password
    if (bcrypt.compareSync(password, existingUser.password)) {
      //Setting a session name user_id
      req.session.user_id = existingUser.id;
      //After successful login, redirect the client back to the urls page
      return res.redirect("/urls");
    } else { //Case: User is existing but entered password and saved in database password do not match.
      return res.status(401).send("Authentication Failed.\nIncorrect username and/or password!");
    }
  } else {
    return res.status(401).send("Authentication Failed.\nIncorrect username and/or password!");
  }
  
});

//POST ROUTE: handles logout
app.post("/logout", (req, res) => {
  req.session = null; //clears the value of key username in cookie.

  res.redirect("/login"); //Login page will load, after a successful logout.
});

//======
//Below are predefine lines of code for TinyApp exercises.
//GET Route, representing the entire urlDatabase object in json string
app.get("/urls.json", (req, res) => {
  return res.json(urlDatabase);
});

//GET Route, sending HTML
app.get("/hello", (req, res) => {
  return res.send("<html> <body> Hello <b>World!</b> </body> </html>");
});

//Make the server listen on our define port, 8080
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});