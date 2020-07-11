import { promises as fsPromises } from 'fs';
import path from 'path';

export async function serveHTML(fileName) {
	const filePath = path.join(__dirname, fileName);
	let fh;
	let html;
	try {
		fh = await fsPromises.open(`${filePath}.html`, 'r');
	} catch(err) {
		console.log(err);
	} finally {
		html = await fh.readFile({ encoding: 'utf8' });

		await fh.close();
	}

	return html;
}
