import express from 'express';
const router = express.Router();

import { deleteTask, insertTask, taskDone, deleteDone, insertGroup } from '../database/getTasks';
import addRouter from './operations/add';
import getRouter from './operations/get';
import deleteRouter from './operations/delete';
import setRouter from './operations/set';

router.use('/add', addRouter);
router.use('/get', getRouter);
router.use('/delete', deleteRouter);
router.use('/set', setRouter);

router.get('/done/:id', async function (req, res, next) {
	const userId = req.session.user;
	if (await taskDone(userId, req.params.id)) {
		res.status(202).send();
	} else {
		res.status(511).send();
	}
});

router.get('/deleteDone', async function (req, res, next) {
	const userId = req.session.user;
	if (userId != null || userId != undefined) {
		await deleteDone(userId);
		res.status(202).send();
	} else {
		res.status(511).send();
	}
});

export default router;
