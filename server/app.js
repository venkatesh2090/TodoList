import createError from 'http-errors';
import express from 'express';
import path from 'path';
import { promises as fsPromises } from 'fs';

import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import Keygrip from 'keygrip';
import compression from 'compression';

import logger from 'morgan';

import { userIdExists } from './database/getTasks';
import indexRouter from './routes/index';
import apiRouter from './routes/todo-api';
import loginRouter from './routes/login';
import logoutRouter from './routes/logout';
import signupRouter from './routes/signup';

import { serveHTML } from './utils/serve';
var app = express();

export async function validateRequest(userId) {
	return await userIdExists(userId);
}

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
app.use('/static', express.static(path.join(__dirname, '../dist')));

app.use(function(req, res, next) {
	const mobile = /(Mobile)/;
	if (mobile.test(req.get('user-agent'))){
		req.mobile = true;
	} else {
		req.mobile = false;
	}
	next();
});

app.use(async function (req, res, next) {
	const regEx = /^(\/(login|welcome|logout|static|signup))/

	if (!regEx.test(req.path) && !req.session.user) {
		res.redirect('/welcome');
	} else {
		const welcomRegEx = /^\/(welcome)/;
		if (welcomRegEx.test(req.path) && req.session.user)
			res.redirect('/');
		else if (regEx.test(req.path) || await validateRequest(req.session.user))
			next();
		else
			res.redirect('/logout');
	}
});
app.use(compression());

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/signup', signupRouter);
app.use('/welcome', async function(req, res, next) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

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
