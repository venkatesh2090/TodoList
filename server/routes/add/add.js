import express from 'express';
const router = express.Router();

import { insertTodoGroup, insertTask } from '../../database/getTasks';

router.post('/task', async function (req, res, next) {
	const userId = req.session.user;
	if (userId != null || userId != undefined) {
		await insertTask(req.body.task, userId)
			.catch(err => console.log(err));
		res.status(202).send();
	} else {
		res.status(511).send();
	}
});

router.post('/group', async function (req, res, next) {
	const userId = req.session.user;
	const groupName = req.body.group;

	if ((userId != null || userId != undefined) && (groupName != null || groupName != undefined)) {
		if (await insertTodoGroup(userId, groupName)) {
			res.status(202).send();
		} else {
			res.status(511).send();
		}
	} else {
		res.status(511).send();
	}
});

export default router;
