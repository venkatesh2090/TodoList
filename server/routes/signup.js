import express from 'express';
const router = express.Router();
import { userExists, emailExists, insertUser } from '../database/getTasks';

router.get('/', function (req, res, next) {
  res.render('signup', {
    title: 'Sign Up'
  });
});

router.post('/', async function (req, res, next) {
  const isUser = await userExists(req.body.username).then(res => res.exists);
  const isEmail = await emailExists(req.body.email).then(res => res.exists);

  console.log(`${isUser} ${isEmail}`);

  if (!isUser && !isEmail) {
	console.log(`${req.body.username} ${req.body.password} ${req.body.email}`);
	await insertUser(req.body.username, req.body.password, req.body.email);
    res.redirect('/login');
  } else {
    res.render('signup', {
	  title: 'Signup',
	  logout: false
    });
  }
});

router.post('/', async function (req, res, next) {
	const isUser = await userExists(req.body.username).then(res => res.exists);
	const isEmail = await emailExists(req.body.email).then(res => res.exists);

	console.log(`${isUser} ${isEmail}`);

	if (!isUser && !isEmail) {
		console.log(`${req.body.username} ${req.body.password} ${req.body.email}`);
		await insertUser(req.body.username, req.body.password, req.body.email);
		res.redirect('/login');
	} else {
		res.render('signup', {
			title: 'Signup',
			logout: false
		});
	}
});

export default router;
