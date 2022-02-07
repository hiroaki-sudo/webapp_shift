const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//ルーティング
const homeRouter = require('./routes/home');
const newRouter = require('./routes/new');
const loginRouter = require('./routes/login');
const my_pageRouter = require('./routes/my_page');
const logoutRouter = require('./routes/logout');
const post_shiftRouter = require('./routes/post_shift');
const delete_shiftRouter = require('./routes/delete_shift');
const show_shiftRouter = require('./routes/show_shift');
const registerRouter = require('./routes/register');

const app = express();

//テンプレートファイルが保管されている場所の設定
app.set('views', path.join(__dirname, 'views'));
//テンプレートエンジンの種類(今回はejs)の設定
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended:true }));
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//遷移先
app.use('/', homeRouter);
app.use('/home', homeRouter);
app.use('/new', newRouter);
app.use('/login', loginRouter);
app.use('/my_page', my_pageRouter);
app.use('/logout', logoutRouter);
app.use('/post_shift', post_shiftRouter);
app.use('/delete_shift', delete_shiftRouter);
app.use('/show_shift', show_shiftRouter);
app.use('/register', registerRouter);

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

//mysqlを各フォルダからつなげるようにする
//module.exports = connection;

app.listen(3000,()=>console.log('running port:3000'));
