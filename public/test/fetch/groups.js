export async function getGroupsList() {
	const url = `/api/get/groups`;
	const req = new Request(url, {
		method: 'GET'
	});

	const res = await fetch(req);

	if (res.ok) {
		return res.json();
	} else {
		return false;
	}
}

// TODO: impl indexedDB
