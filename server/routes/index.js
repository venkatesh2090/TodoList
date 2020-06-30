import express from 'express';
const router = express.Router();

import { getTaskByGroupId, insertTask, getGroupsFromUserId, getDefaultTasks, getDefaultGroupId } from '../database/getTasks';
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
	const userId = req.session.user;

	if (!regEx.test(task)) {
		let firstGroup;
		if (req.body.gid == null || req.body.gid == undefined) {
			firstGroup = await getDefaultGroupId(userId);
			firstGroup = firstGroup.min;
		}
		await insertTask(task, userId, req.body.gid || firstGroup);
	}

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
		tasks: todos,
		logout: true,
		groupList: groups
	});
});

export default router;
