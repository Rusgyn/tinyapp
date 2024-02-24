# TinyApp

TinyApp is a full stack Web Application built with Node and Express that allows user to shorten long URLs (à la bit.ly).

## Product Images

* Index
![Login](Images/Index-Logged_In.png)

* Register
![Register Page](Images/Register.png)

* Login
![Login](Images/Login.png)

* Create TinyURL
![Create](<Images/Create Tiny URL.png>)

* Edit
![Edit](Images/Edit.png)

* Error - Main page, when not logged in
![Error_main](Images/Error-Main_when_not_login.png)

* Error - Login
![Login_Invalid_User](Images/Error-Login_invalid_creds.png)

* Error - Registration
![Error_Regs](Images/Error-Registration_existing_account.png)

* Error - short url, non existence
![Error_short](Images/Error-Short_nonExisting_tinyURL.png)

* Error - URL unauthorized
![Error_Unauthorized_URL](Images/Error-Unauthorized_URL_access.png)



## Getting Started
* Install all dependencies, `npm install` command
* Run the development server, `npm start` command - Thanks to Nodemon.
* Go to http://localhost:8080/Register to create a new account. You will be logged in automatically with your newly registered account
* Go to http://localhost:8080/login to login
* You may start creating new shorten or tiny URL with your given long URL.

### Dependencies
* "bcryptjs": "^2.4.3",
* "chai-http": "^4.4.0",
* "cookie-session": "^2.1.0",
* "ejs": "^3.1.9",
* "express": "^4.18.2"
* "chai": "^4.3.1",
* "mocha": "^10.3.0",
* "nodemon": "^3.0.3"

