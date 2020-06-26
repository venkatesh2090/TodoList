import express from 'express';
const router = express.Router();
import { userExists, insertUser, getUserId } from '../database/getTasks';

router.get('/', function (req, res, next) {
  res.render('login');
});

router.post('/', async function (req, res, next) {
  const username = req.body.user;

  let queryRes = await userExists(username);
	console.log(JSON.stringify(queryRes));
	

  if (queryRes.exists) {
		queryRes = await getUserId(username);
    req.session.user = queryRes[0].id;
    res.redirect('/');
  } else {
		res.render('login', {
			notExists: true
		});
	}
});

export default router;
