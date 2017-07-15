var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var MethodDecoration;
        (function (MethodDecoration) {
            // TODO : Add comments
            // TODO : Add inspired by
            function intercept(fxInterceptor) {
                return function (target, propKey) {
                    var originalMethod = target[propKey];
                    if (typeof originalMethod !== 'function') {
                        throw new TypeError('@intercept can only be used on methods.');
                    }
                    if (typeof target === 'function') {
                        return {
                            value: function () {
                                var originalArguments = arguments;
                                return fxInterceptor(function () {
                                    return originalMethod.apply(target, originalArguments);
                                });
                            }
                        };
                    }
                    else if (typeof target === 'object') {
                        return {
                            get: function () {
                                var instance = this;
                                Object.defineProperty(instance, propKey.toString(), {
                                    value: function () {
                                        var originalArguments = arguments;
                                        return fxInterceptor(function () {
                                            return originalMethod.apply(instance, originalArguments);
                                        });
                                    }
                                });
                                return instance[propKey];
                            }
                        };
                    }
                };
            }
            MethodDecoration.intercept = intercept;
        })(MethodDecoration = KartwarsBot.MethodDecoration || (KartwarsBot.MethodDecoration = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
