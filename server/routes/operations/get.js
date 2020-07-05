import express from 'express';
const router = express.Router();

import { getTaskByGroupId } from '../../database/getTasks.js';

router.get('/tasks/:gid', async function(req, res, next) {
	const groupId = req.params.gid;
	const userId = req.session.user;

	const tasks = await getTaskByGroupId(userId, groupId);

	res.json(tasks);
});

router.get('/taskall', function(req, res, next) {
});

export default router;