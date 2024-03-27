//import the modules we need to set the server
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// import the "mongoose" module to connect to the database
const mongoose = require("mongoose");
// import the "body-parser" module to read the content send by the user
const bodyParser = require('body-parser');
require('dotenv').config();

console.log("MONGO_URL: ", process.env.MONGO_URL);

//import the routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// creating the express.js application
const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// middlewares ware use automatically when creating an Express.js project by the WebStorm wizard
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// setting the "body-parser"
app.use(bodyParser.urlencoded({extended: false}));

// set the path of the routes in the url
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//connecting to the mongoDB server to connect to the database using the mongoose modal
mongoose.connect(process.env.MONGO_URL)
    .then(result => {
      // if the connection succeeded set a port to the app
      app.listen(3000);
    })
    .catch(err => {
      // if the connection didn't succeed print the error to the console
      console.error(err)
    });

// ensures mongoose uses the Promise implementation provided by the JavaScript environment
mongoose.Promise = global.Promise;

// export the app
module.exports = app;
