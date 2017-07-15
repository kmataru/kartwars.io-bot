/* tslint:disable */
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var MethodDecoration;
        (function (MethodDecoration) {
            var TraceRegister = (function () {
                function TraceRegister() {
                }
                TraceRegister.registerMethodName = function (key, value) {
                    TraceRegister.originalNames[key] = value;
                };
                return TraceRegister;
            }());
            //static originalNames: { [key: string]: string };
            //static originalNames: { [key: string]: string }[] = [];
            //static originalNames: { [key: string]: any }[] = [];
            TraceRegister.originalNames = {};
            /**
             * Binds an instance method to the containing class to persist the lexical scope of 'this'.
             * @param target The target class or prototype; used by the TypeScript compiler (omit function call brackets to use as a decorator).
             * @param propKey The property key of the target method; used by the TypeScript compiler (omit function call brackets to use as a decorator).
             */
            function trace(target, propKey) {
                var originalMethod = target[propKey];
                // Ensure the above type-assertion is valid at runtime.
                if (typeof originalMethod !== "function")
                    throw new TypeError("@trace can only be used on methods.");
                if (typeof target === "function") {
                    // Static method, bind to class (if target is of type "function", the method decorator was used on a static method).
                    return {
                        value: function () {
                            return originalMethod.apply(target, arguments);
                        }
                    };
                }
                else if (typeof target === "object") {
                    return {
                        get: function () {
                            //TraceRegister.registerMethodName((arguments.callee as any).name, (propKey as string));
                            var stack = StackTrace.getSync();
                            /*
                            let targetKeys = Object.keys(target);
                            targetKeys.indexOf((propKey as string));
                            */
                            var targetName = target.constructor.toString().match(/\w+/g)[1];
                            TraceRegister.registerMethodName(targetName + "." + propKey, stack[2].functionName);
                            //window.stack = TraceRegister.originalNames;
                            window.stack = StackTrace.getSync();
                            if (window.botFactory && window.botFactory.externalGraph) {
                                window.botFactory.externalGraph.operation();
                            }
                            // window.log('Call 1 ' + (propKey as string), StackTrace.getSync());
                            return originalMethod;
                        }
                    };
                }
            }
            MethodDecoration.trace = trace;
        })(MethodDecoration = KartwarsBot.MethodDecoration || (KartwarsBot.MethodDecoration = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
