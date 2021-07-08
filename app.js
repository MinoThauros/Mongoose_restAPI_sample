const mongoose=require('mongoose');
const models=require('./models/dishes');
require('mongoose-currency').loadType(mongoose);//loads the library to mongoose
const Currency=mongoose.Types.Currency;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); 


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter= require('./routes/dishRouter');
var promoRouter= require('./routes/promoRouter');
var leadeRouter=require('./routes/leadeRouter');

var app = express();

//database init
const url='mongodb://localhost:27017/conFusion';
const connect=mongoose.connect(url);

connect.then(()=>{
  console.log('We outcheaaaa in the database');
}, (err)=>{console.log(err)});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-67890-09876-54321'));
//passing secret key to cookie parser in order to create sessions with signed cookies

function auth (req, res, next) {
  console.log(req.headers);
  var authHeader = req.headers.authorization;
  if (!authHeader) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
      return;
  }

  var auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  var user = auth[0];
  var pass = auth[1];
  if (user == 'admin' && pass == 'password') {
      next(); // authorized
  } else {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');      
      err.status = 401;
      next(err);
  }
}



app.use(auth);//before serving static ressources
app.use(express.static(path.join(__dirname, 'public')));//setting up static server


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promos', promoRouter);
app.use('/leader', leadeRouter);

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

module.exports = app;