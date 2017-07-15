/* tslint:disable */

namespace DracoolaArt.KartwarsBot.MethodDecoration {
	export function sealed(constructor: Function) {
		Object.seal(constructor);
		Object.seal(constructor.prototype);
	}
}
