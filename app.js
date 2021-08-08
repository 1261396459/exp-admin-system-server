var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var studentsRouter = require('./routes/student');
var labadminerRouter = require('./routes/lab_adminer');
var teachersRouter = require('./routes/teacher');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const corsConfig = {
  origin: ['http://127.0.0.1:40000','http://localhost:40000'], //允许访问来源
  optionsSuccessStatus: 200 
}
app.use(cors(corsConfig));//跨域
app.use(express.urlencoded({ extended: false }))//获取post body

app.use('/', indexRouter);
app.use('/student', studentsRouter);
app.use('/teacher', teachersRouter);
app.use('/lab', labadminerRouter);

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
