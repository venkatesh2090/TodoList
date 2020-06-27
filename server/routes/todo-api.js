import express from 'express';
const router = express.Router();

import { deleteTask, insertTask, taskDone, deleteDone, insertGroup } from '../database/getTasks';
import addRouter from './add/insert.js';

router.use('/add', addRouter);

router.get('/delete/:id', async function (req, res, next) {
	const id = req.params.id;

	await deleteTask(id);
	res.status(202).send();
});

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
