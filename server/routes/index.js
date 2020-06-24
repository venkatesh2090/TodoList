import express from 'express';
const router = express.Router();

import { getAllTasks, insertTask } from '../database/getTasks';
import createError from 'http-errors';

/**
 * Required for babel support for 
 * promses
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';


router.post('/', async function(req, res, next) {
  const task = req.body.task;
	const spaceRe = /^ *$/;

	if (!spaceRe.test(task) && req.cookies)
		await insertTask(task, req.cookies.id);
	if (!spaceRe.test(task))
		await insertTask(task, 1);

	res.redirect('/');
});

/* GET home page. */
router.get('/', async function(req, res, next) {
  if (!req.cookies.user) {
	res.cookie('user', '1');
  }
  var result = await getAllTasks(req.cookies.user);
  res.render('index', { 
	title: 'TODO List',
	tasks: result
  });
});

export default router;
