import express from 'express';
const router = express.Router();

import { getTaskByGroupId, getGroupsFromUserId } from '../../database/getTasks.js';

router.get('/tasks/:gid', async function(req, res, next) {
	const groupId = req.params.gid;
	const userId = req.session.user;

	try {
		const tasks = await getTaskByGroupId(userId, groupId);
		res.json(tasks);
	} catch (err) {
		console.error(err);
		res.sendStatus(511);
	}
});

router.get('/taskall', function(req, res, next) {
});

router.get('/groups', async function(req, res, next) {
	const userId = req.session.user;

	try {
		const groups = await getGroupsFromUserId(userId);
		res.json(groups);
	} catch (err) {
		console.error(err);
		res.sendStatus(511);
	}
});

export default router;
