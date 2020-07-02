import express from 'express';
const router = express.Router();
import { userExists, emailExists, insertUser, getUserFromUsername, insertTodoGroup } from '../database/getTasks';
import createError from 'http-errors';

import bcrypt from 'bcrypt';
const saltRounds = 10;

router.get('/', function (req, res, next) {
	res.render('signup', {
		title: 'Sign Up'
	});
});

router.post('/', async function (req, res, next) {
	const isUser = await userExists(req.body.username).then(res => res.exists);
	const isEmail = await emailExists(req.body.email).then(res => res.exists);

	if (!isUser && !isEmail) {
		await bcrypt.hash(req.body.password, saltRounds).then(async hash => {
			const userId = await insertUser(req.body.username, hash, req.body.email);
			if (userId != -1) {
				req.session.user = userId;

				await insertTodoGroup(userId, 'default');
				res.redirect('/');
			} else {
				next(createError(500));
			}
		});
	} else {
		res.render('signup', {
			title: 'Signup',
			logout: false,
			userExists: isUser,
			emailExists: isEmail
		});
	}
});

export default router;
