import express from 'express';
const router = express.Router();

import { insertTodoGroup, insertTask } from '../../database/getTasks';

const blank = /^ *$/;

router.post('/task', async function (req, res, next) {
	const userId = req.session.user;
	const task = req.body.task;

	if ((userId != null || userId != undefined) || (task != null || task != undefined || !blank.test(task))) {
		await insertTask(task, userId)
			.catch(err => console.log(err));
		res.status(202).send();
	} else {
		res.status(511).send();
	}
});

router.post('/group', async function (req, res, next) {
	const userId = req.session.user;
	const groupName = req.body.group;

	if ((userId != null || userId != undefined) && (groupName != null || groupName != undefined || !blank.test(groupName))) {
		const id = await insertTodoGroup(userId, groupName);
		if (id != -1) {
			const data = {
				groupId: id
			};
			console.log(JSON.stringify(data));
			res.json(data).send();
		} else {
			res.status(511).send();
		}
	} else {
		res.status(511).send();
	}
});

export default router;
