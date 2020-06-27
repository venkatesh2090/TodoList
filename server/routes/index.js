import express from 'express';
const router = express.Router();

import { getAllTasks, insertTask, getGroupsFromUserId } from '../database/getTasks';
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
	var todos = await getAllTasks(req.session.user);
	var groups = await getGroupsFromUserId(req.session.user);
	res.render('index', {
		title: 'TODO List',
		tasks: todos,
		logout: true,
		groupList: groups
	});
});

export default router;
