let utils = module.exports;

utils.matchSubject = (subject, pattern) => {

	if (subject === pattern || pattern === ">") {
		return true;
	}

	let subjectSplit = subject.split(".");
	let patternSplit = pattern.split(".");
	
	let match = true;
	let i = 0;
	let mostDetailedSplit = subjectSplit.length >= patternSplit.length ? subjectSplit : patternSplit;

	while(match && i < mostDetailedSplit.length) {
		if (subjectSplit[i] && patternSplit[i] === ">") {
			match = true;
			break;
		}

		match = subjectSplit[i] === patternSplit[i] || (patternSplit[i] === "*" && subjectSplit[i]);
		i++;
	}

	return match;
};

