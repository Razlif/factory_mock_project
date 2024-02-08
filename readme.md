
# Student Project - Factory Manager

Simple mock up factory manager for educational purposes.

## Getting Started
  
To run this project you should already have mongoDB set up locally.
1. Create a database for the project  
2. create a collection named 'users'

Next clone the project:

```
git  clone  https://github.com/Razlif/factory_mock_project.git

cd  factory_mock_project
```

Configure the app settings in the app.js and configDB.js files.
```
// app.js
const PORT = 8000 // Client side code is expecting port 8000

// configDB.js
const DBname = 'factoryDB' // Your MongoDB database name
const DBservicePort = 27017 // Your MongoDB connection port

```
Then copy the users file from data/users.json and add the documents into the users collection on mongoDB. (the file is added for your convenience and can be deleted after running the project for the first time.)

Finally install the dependencies and run the app.
```
npm install
node app.js
```
## How to use

Open the login.html file in your browser.

To login use credentials from https://jsonplaceholder.typicode.com/users

You can then create departments, employees, shifts and edit them.
By default each user is limited to 25 actions per day.

## Features
-   **Login**: Authenticate users.
-   **Department Management**: Create and edit departments.
-   **Employee Management**: Add and manage employees.
-   **Shift Scheduling**: Assign and edit shifts.