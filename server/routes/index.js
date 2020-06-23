import express from 'express';
const router = express.Router();

import {getAllTasks, insertTask} from './database/getTasks';
import createError from 'http-errors';

// import for babel promises
import "core-js";
import "regenerator-runtime/runtime";


router.post('/', async function(req, res, next) {
  const task = req.body.task;
	const spaceRe = /^ *$/;

	if (!spaceRe.test(task))
		await insertTask(task, 2);

	res.redirect('/');
});

/* GET home page. */
router.get('/', async function(req, res, next) {
  if (!req.cookies.user) {
	res.cookie('user', '2');
  }
  var result = await getAllTasks(2);
  res.render('index', { 
	title: 'TODO List',
	tasks: result
  });
});

export default router;
