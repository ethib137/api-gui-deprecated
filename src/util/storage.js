const storageAvailable = (type) => {
	var storage;
	try {
		storage = window[type];
		var x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e) {
		return e instanceof DOMException && (
			// everything except Firefox
			e.code === 22 ||
			// Firefox
			e.code === 1014 ||
			// test name field too, because code might not be present
			// everything except Firefox
			e.name === 'QuotaExceededError' ||
			// Firefox
			e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
			// acknowledge QuotaExceededError only if there's something already stored
			(storage && storage.length !== 0);
	}
}

export const generateKey = (key) => {
	return `API_GUI_FORM_VALUES_${key}`;
}

export const setLocalStorage = (key, values) => {
	if (storageAvailable('localStorage')) {
		localStorage.setItem(key, JSON.stringify(values));
	}
}

export const getLocalStorage = (key) => {
	if (storageAvailable('localStorage')) {
		const item = localStorage.getItem(key);

		if (!item) {
			return {};
		}

		return JSON.parse(item);
	}
}