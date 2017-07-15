namespace DracoolaArt.KartwarsBot {
	let varExtractor1 = new RegExp(`(.*)`);
	let varExtractor2 = new RegExp(`([^\.]*)[;]?}`);

	// READ @ http://stackoverflow.com/questions/29191451/get-name-of-variable-in-typescript/29205712
	// TODO : Review
	export function nameof<TResult>(getVar: () => TResult) {
		let varFunctionAsString = getVar + '';
		if (varFunctionAsString.indexOf('function') == 0) {
			let m: RegExpExecArray = varExtractor2.exec(varFunctionAsString);

			if (m == null) {
				throw new Error(`The function does not contain a statement matching 'return variableName;'`);
			}

			let memberPart = m[1].split(';')[0];

			return memberPart;
		} else {
			let m: RegExpExecArray = varExtractor1.exec(varFunctionAsString);

			if (m == null) {
				throw new Error(`The function does not contain a statement matching 'return variableName;'`);
			}

			let fullMemberName = m[1];
			let memberParts = fullMemberName.split('.');

			return memberParts[memberParts.length - 1];
		}
	}
}
