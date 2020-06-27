import express from 'express';
const router = express.Router();

router.get('/', function (req, res, next) {
	res.render('signup', {
		title: 'Sign Up'
	});
});

export default router;
