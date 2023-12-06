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

// Setting up body parser
app.use(body.json());

// Setting up logger for development
app.use(logger('dev'));

// Parsing incoming requests with JSON payloads
app.use(express.json());

// Parsing incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: false }));

// Parsing cookies
app.use(cookieParser());

// Serving static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Creating a Sequelize instance for database operations
var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

// Initializing Sequelize with session store
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var myStore = new SequelizeStore({
    db: sequelize
});

// Enabling sessions
app.use(session({
    secret: "supercalifragilisticexpialidocious",
    store: myStore,
    resave: false, // Force save of session for each request
    saveUninitialized: false, // Save a session that is new, but has not been modified
    cookie: { maxAge: 10 * 60 * 60 * 1000 }, // milliseconds!
    proxy: true
}));

// Syncing the session store with the database
myStore.sync();

// Using routes for different paths
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);
app.use('/nasaAPI', nasaAPIRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Exporting the express app for use in other files
module.exports = app;