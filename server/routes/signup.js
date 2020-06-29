import express from 'express';
const router = express.Router();
import { userExists, emailExists, insertUser, getUserFromUsername, insertTodoGroup } from '../database/getTasks';

router.get('/', function (req, res, next) {
	res.render('signup', {
		title: 'Sign Up'
	});
});

router.post('/', async function (req, res, next) {
	const isUser = await userExists(req.body.username).then(res => res.exists);
	const isEmail = await emailExists(req.body.email).then(res => res.exists);

	if (!isUser && !isEmail) {
		await insertUser(req.body.username, req.body.password, req.body.email);
		console.log(`${req.body.username} ${req.body.password} ${req.body.email}`);
		const userId = await getUserFromUsername(req.body.username).then(res => res.id);
		req.session.user = userId;

		await insertTodoGroup(userId, 'default');
		res.redirect('/');
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
