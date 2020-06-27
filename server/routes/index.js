import express from 'express';
const router = express.Router();

import { getAllTasks, insertTask } from '../database/getTasks';
import createError from 'http-errors';

/**
 * Required for babel support for 
 * promses
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

router.post('/', async function (req, res, next) {
	const task = req.body.task;
	const regEx = /^ *$/;

	if (!regEx.test(task)) {
		await insertTask(task, req.session.user);
	}

	res.redirect('/');
});

/* GET home page. */
router.get('/', async function (req, res, next) {
	var result = await getAllTasks(req.session.user);
	res.render('index', {
		title: 'TODO List',
		tasks: result,
		logout: true
	});
});

export default router;
