import express from 'express';
const router = express.Router();

import { deleteTask, insertTask, taskDone, deleteDone, insertGroup } from '../database/getTasks';
import addRouter from './add/add';
import getRouter from './add/get';
import deleteRouter from './add/delete';

router.use('/add', addRouter);
router.use('/get', getRouter);
router.use('/delete', deleteRouter);

router.get('/done/:id', async function (req, res, next) {
	await taskDone(req.params.id);
	res.status(202).send();
});

router.get('/deleteDone', async function (req, res, next) {
	const userId = req.session.user;
	if (userId != null || userId != undefined)
		await deleteDone(userId);
	res.status(202).send();
});

export default router;
