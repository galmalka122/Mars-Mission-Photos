var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const indexRouter = require('./routes/index');
var expressLayout = require('express-ejs-layouts');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
const body = require('body-parser');
const logoutRouter = require('./routes/logout');
const nasaAPIRouter = require('./routes/nasaAPI');
const session = require('express-session');
const Sequelize = require('sequelize');
const config = require(__dirname + '/config/config.json')["development"];
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');
app.use(expressLayout);

app.use(body.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);
// initalize sequelize with session store
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var myStore = new SequelizeStore({
  db: sequelize
});
// enable sessions
app.use(session({
  secret: "supercalifragilisticexpialidocious",
  store: myStore,
  resave: false, // Force save of session for each request
  saveUninitialized: false, // Save a session that is new, but has not been modified
  cookie: {maxAge: 10 * 60 * 60 * 1000}, // milliseconds!
  proxy: true
}));
myStore.sync(); // this creates the session tables in your database

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);
app.use('/nasaAPI', nasaAPIRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;