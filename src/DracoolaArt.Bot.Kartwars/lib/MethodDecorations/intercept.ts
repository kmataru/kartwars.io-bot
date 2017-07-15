namespace DracoolaArt.KartwarsBot.MethodDecoration {
	// TODO : Add comments
	// TODO : Add inspired by
	export function intercept(fxInterceptor: (fx: () => void) => void) {
		return function (target: Object, propKey: string | symbol) {
			let originalMethod = target[propKey] as Function;

			if (typeof originalMethod !== 'function') { throw new TypeError('@intercept can only be used on methods.'); }

			if (typeof target === 'function') {
				return {
					value: function () {
						let originalArguments = arguments;

						return fxInterceptor(function () {
							return originalMethod.apply(target, originalArguments);
						});
					}
				};
			} else if (typeof target === 'object') {
				return {
					get: function () {
						let instance = this;

						Object.defineProperty(instance, propKey.toString(), {
							value: function () {
								let originalArguments = arguments;

								return fxInterceptor(function () {
									return originalMethod.apply(instance, originalArguments);
								});
							}
						});

						return instance[propKey];
					}
				} as PropertyDescriptor;
			}
		};
	}
}
