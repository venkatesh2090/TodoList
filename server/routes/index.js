import express from 'express';
const router = express.Router();

import { getTaskByGroupId, insertTask, getGroupsFromUserId, getDefaultTasks, getDefaultGroupId } from '../database/getTasks';
import createError from 'http-errors';

router.post('/', async function (req, res, next) {
	const task = req.body.task;
	const regEx = /^ *$/;
	const userId = req.session.user;

	let isError;
	if (!regEx.test(task)) {
		if (!await insertTask(task, userId, req.body.gid))
			isError = true;
	}

	if (isError)
		next(createError(500));
	else
		res.redirect('/');
});

/* GET home page. */
router.get('/', async function (req, res, next) {
	let todos = await getDefaultTasks(req.session.user);
	if (todos.length == 0)
		todos = await getDefaultGroupId(req.session.user).then(res => res.min);

	let groups = await getGroupsFromUserId(req.session.user);

	res.render('index', {
		title: 'TODO List',
		logout: true,
		groupList: groups
	});
});

export default router;
