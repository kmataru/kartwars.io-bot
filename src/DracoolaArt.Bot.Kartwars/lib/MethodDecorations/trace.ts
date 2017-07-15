/* tslint:disable */

namespace DracoolaArt.KartwarsBot.MethodDecoration {
	class TraceRegister {
		//static originalNames: { [key: string]: string };
		//static originalNames: { [key: string]: string }[] = [];
		//static originalNames: { [key: string]: any }[] = [];
		static originalNames: DracoolaArt.KartwarsBot.IDictionary<string> = {};

		static registerMethodName(key: string, value: string) {
			TraceRegister.originalNames[key] = value;
		}
	}

	/**
	 * Binds an instance method to the containing class to persist the lexical scope of 'this'.
	 * @param target The target class or prototype; used by the TypeScript compiler (omit function call brackets to use as a decorator).
	 * @param propKey The property key of the target method; used by the TypeScript compiler (omit function call brackets to use as a decorator).
	 */
	export function trace(target: Object, propKey: string | symbol) {
		var originalMethod = target[propKey] as Function;

		// Ensure the above type-assertion is valid at runtime.
		if (typeof originalMethod !== "function") throw new TypeError("@trace can only be used on methods.");

		if (typeof target === "function") {
			// Static method, bind to class (if target is of type "function", the method decorator was used on a static method).
			return {
				value: function () {
					return originalMethod.apply(target, arguments);
				}
			};
		} else if (typeof target === "object") {
			return {
				get: function () {
					//TraceRegister.registerMethodName((arguments.callee as any).name, (propKey as string));

					let stack = StackTrace.getSync();
					/*
					let targetKeys = Object.keys(target);
					targetKeys.indexOf((propKey as string));
					*/
					let targetName = target.constructor.toString().match(/\w+/g)[1];
					TraceRegister.registerMethodName(`${targetName}.${(propKey as string)}`, stack[2].functionName);
					//window.stack = TraceRegister.originalNames;

					window.stack = StackTrace.getSync();
					if (window.botFactory && window.botFactory.externalGraph) {
						window.botFactory.externalGraph.operation();
					}
					// window.log('Call 1 ' + (propKey as string), StackTrace.getSync());

					return originalMethod;
				}
			} as PropertyDescriptor;
		}
	}
}
