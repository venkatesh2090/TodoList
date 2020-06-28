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

	let firstGroup;
	if (req.session.gid == null || req.session.gid == undefined) {
		firstGroup = await getDefaultGroupId(userId);
		firstGroup = firstGroup.min;
	}

	if (!regEx.test(task)) {
		await insertTask(task, userId, req.session.gid || firstGroup);
	}

	res.redirect('/');
});

/* GET home page. */
router.get('/', async function (req, res, next) {
	let todos;
	if (req.session.gid != null && req.session.gid != undefined)
		todos = await getTaskByGroupId(req.session.user, req.session.gid);
	else
		todos = await getDefaultTasks(req.session.user);

	let groups = await getGroupsFromUserId(req.session.user);

	res.render('index', {
		title: 'TODO List',
		tasks: todos,
		logout: true,
		groupList: groups
	});
});

export default router;
