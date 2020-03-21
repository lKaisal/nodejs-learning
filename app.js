const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');

const entries = require('./routes/entries');
const register = require('./routes/register');
const login = require('./routes/login');
const users = require('./routes/users');
const api = require('./routes/api');
const user = require('./middleware/user');
const validate = require('./middleware/validate');
const messages = require('./middleware/messages');
const Entry = require('./models/entry');
const page = require('./middleware/page');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));
app.use(messages);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', api.auth);
app.use(user);

app.use('/users', users);

app.get('/', entries.list);
app.get('/post', entries.form);
app.post('/post',
          validate.required('entry[title]'),
          validate.lengthAbove('entry[title]', 4),
          entries.submit);

app.get('/register', register.form);
app.post('/register', register.submit);

app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);

app.get('/user/:id', api.user);
app.post('/api/entry', entries.submit);
app.get('/api/entries/:page?', page(Entry.count), api.entries);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.error = msg => this.message(msg, 'error');

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
