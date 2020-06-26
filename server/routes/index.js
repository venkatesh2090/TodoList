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


/* GET home page. */
router.get('/', async function(req, res, next) {
  if (req.session.isNew) 
	res.redirect('/login');
  else {
	var result = await getAllTasks(req.cookies.user);
	res.render('index', {
	  title: 'TODO List',
	  tasks: result
	});
  }
});

export default router;
