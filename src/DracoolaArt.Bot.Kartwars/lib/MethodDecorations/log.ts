/* tslint:disable */

namespace DracoolaArt.KartwarsBot.MethodDecoration {
	var env = 'DEV';

	function fancyLog(toLog, force: boolean = false) {
		if (env !== 'PRODUCTION' || force) {
			window.log.apply(this, toLog);
		}
	}

	// Wrap it!

	export function log(force?: boolean) {
		return function log(target: any, key: string, descriptor: any) {
			var originalMethod = descriptor.value;
			descriptor.value = function (...args: any[]) {
				var arguments = args.map((arg) => JSON.stringify(arg)).join();
				var result = originalMethod.apply(this, args);
				var resultString = JSON.stringify(result);
				fancyLog([`Calling fn “${key}” with args: (${arguments}) , result: ${resultString}`], force);
				return result;
			}
			return descriptor;
		}
	}
}
