import express from 'express';
const router = express.Router();

import { deleteGroup } from '../../database/getTasks';

router.get('/group/:id', async function (req, res, next) {
	const userId = req.session.user;
	const groupId = req.params.id;

	if (await deleteGroup(userId, groupId)) {
		res.status(202).send();
	} else {
		res.status(511).send();
	}
});

export default router;
