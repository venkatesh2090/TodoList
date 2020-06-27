import createError from 'http-errors';
import express from 'express';
import path from 'path';

import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import Keygrip from 'keygrip';

import logger from 'morgan';

import indexRouter from './routes/index';
import apiRouter from './routes/todo-api';
import loginRouter from './routes/login';
import logoutRouter from './routes/logout';
import signupRouter from './routes/signup';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(cookieSession({
	sameSite: true,
	name: 'SID',
	keys: Keygrip(['mySecret'], 'sha256'),
}));

app.use('/static', express.static(path.join(__dirname, '../public')));

app.use(function (req, res, next) {
	const regEx = /^(\/(login|static|signup))/

	if (req.session.isNew && !regEx.test(req.path)) {
		res.redirect('/login');
	} else {
		next();
	}
});
app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/signup', signupRouter);

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

export default app;
