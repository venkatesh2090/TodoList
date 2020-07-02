import express from 'express';
const router = express.Router();
import { userExists, getUserFromUsername } from '../database/getTasks';
import bcrypt from 'bcrypt';

router.get('/', function (req, res, next) {
	res.render('login', {
		title: 'Login',
		failed: false,
		notExists: false
	});
});

router.post('/', async function (req, res, next) {
	const username = req.body.user;

	let queryRes = await userExists(username);

	if (queryRes.exists) {
		queryRes = await getUserFromUsername(username);
		const hash = queryRes.password;
		await bcrypt.compare(req.body.password, hash).then(isEqual => {
			if (isEqual) {
				req.session.user = queryRes.id;
				res.redirect('/');
			}
			else {
				res.render('login', {
					title: 'Login',
					failed: true,
					logout: false,
					notExists: false
				});
			}
		});
	} else {
		res.render('login', {
			title: 'Login',
			failed: false,
			notExists: true
		});
	}
});

export default router;
