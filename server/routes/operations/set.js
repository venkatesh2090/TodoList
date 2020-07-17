import express from 'express';
const router = express.Router();

import { updateTimestamp } from '../../database/getTasks';

router.post('/timestamp', async function (req, res, next) {
	const userId = req.session.user;
	const expiry = req.body.expiry;
	const id = req.body.id;

	if (await updateTimestamp(userId, expiry, id)) {
		res.status(202).send();
	} else {
		res.status(511).send();
	}
});

export default router;
