# TinyApp Project

The TinyApp will allow you to shorten your long URLs much like TinyURL.com and bit.ly do.

In essence, a URL Shortener is a service that takes a regular URL and transforms it into an encoded version, which redirects back to the original URL.

## Goal

You will build an HTTP Server that handles requests from the browser (client). Along the way you'll get introduced to some more advanced JavaScript and Node concepts, and you'll also learn more about Express, a web framework which is very popular in the Node community.

## Dependencies
### devDependencies
  1. "chai": "^4.3.7",
  2. "mocha": "^9.2.2",
  3. "nodemon": "^3.1.4"
### Dependencies
  1. "bcryptjs": "^2.4.3",
  2. "cookie-parser": "^1.4.6",
  3. "cookie-session": "^2.1.0",
  4. "ejs": "^3.1.10",
  5. "express": "^4.19.2"

## Getting Started
### Executing the Program

1. Clone the repository [TinyApp](https://github.com/Rusgyn/tinyapp) to your local device/machine.
    For reference, see [github cloning a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) steps.
2. Install the dependencies
  - Initialize NPM
    ```
    npm init -y
    ```
  - Install express - Express is a lightweight and flexible routing framework with minimal core features meant to be augmented through the use of Express middleware modules.
    ```
    npm install express
    ```
  - Install ejs - Embedded Javascript is a templating engine used by Node.js
    ```
    npm install ejs
    ```
  - Install nodemon - a tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.
    ```
    npm install --save-dev -nodemon
    ```
  - Install cookie parser - express middleware that sets browser cookies
    ```
    npm install cookie-parser
    ```
  - Install bcryptjs - Converts the password to long unique characters. To make is more secure.
     ```
    npm install bcryptjs
    ```
  - Install cookie session
    ```
    npm install cookie-session
    ```
  - Install mocha and chai - Testing environment
    ```
    npm install mocha chai@4.3.1 --save-dev
    ```
3. Open the code
4. On the [command line](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Command_line), navigate to the root directory of your TinyApp
  ```
  cd /path/to/where/you/save/TinyApp
  ```
5. Execute the program
  ```
  npm start
  ```
6. Open your browser (e.g. Google Chrome), and type the below to your browser address bar.
  localhost:8080
7. Unit testing
  i. On the command line, navigate to the subfolder test.
    ```
    cd /path/to/where/you/save/TinyApp/test
    ```
  ii. Run the command
    ```
    npm test
    ```

## TinyApp Project Images
1. TinyApp Main Page - "/"
  ![Welcome Page](<images/TinyApp Main Page.png>)

2. Registration Page = "/register"
![alt text](<images/Registration Page.png>)

3. Login Page = "/login"
![Login Page](<images/Login Page.png>)

4. Create New URL
![Creating new URL](<images/Create new tiny URL.png>)

5. Users Main Page
![Registered Users main page](<images/Registered User main page.png>)

6. Update or Edit Page
![Edit](<images/Update or Edit URLs page.png>)

7. Error Msg - Registration - Missing username or password
![Reg-No Uname or Pword](<images/Error Message - Registration - Missing Uname or Pword .png>)

8. Error Msg - Email exist
![Email Exist](<images/Error Message - Registration - Email exist.png>)

9. Error Msg - Login - Username and/or Password is incorrect
![Credentials](<images/Error Message - Login - Uname or Pword is incorrect.png>)

10. Error Msg - Accessing URLs but not logged in
![URLs not loggedin](<images/Error Message - Accessing urls not logged in.png>)

11. Error Msg - Access URLS you don't own
![Not yours](<images/Error Message - Accesing urls you dont own.png>)

12. Error - Accessing not existed id in short URL
![ID not existing](<images/Error Message - accesing not existing short url.png>)

## Note
Thank you and have fun
  
  
