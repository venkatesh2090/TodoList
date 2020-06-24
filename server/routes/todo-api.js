import express from 'express';
const router = express.Router();

import {deleteTask, insertTask, taskDone, deleteDone} from '../database/getTasks';

router.get('/delete/:id', async function(req, res, next){
  const id = req.params.id;

  await deleteTask(id);
  res.status(202).send();
});

router.post('/add', async function(req, res, next) {
  await insertTask(req.body.task, req.cookies.user)
	.catch(err => console.log(err));
  res.status(202).send();
});

router.get('/done/:id', async function(req, res, next) {
  console.log(req.cookies.user);
  await taskDone(req.params.id);
  res.status(202).send();
});

router.get('/deleteDone', async function(req, res, next) {
	await deleteDone(req.cookies.user);
	res.status(202).send();
});

export default router;
