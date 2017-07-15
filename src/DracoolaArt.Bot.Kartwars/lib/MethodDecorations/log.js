/* tslint:disable */
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var MethodDecoration;
        (function (MethodDecoration) {
            var env = 'DEV';
            function fancyLog(toLog, force) {
                if (force === void 0) { force = false; }
                if (env !== 'PRODUCTION' || force) {
                    window.log.apply(this, toLog);
                }
            }
            // Wrap it!
            function log(force) {
                return function log(target, key, descriptor) {
                    var originalMethod = descriptor.value;
                    descriptor.value = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        var arguments = args.map(function (arg) { return JSON.stringify(arg); }).join();
                        var result = originalMethod.apply(this, args);
                        var resultString = JSON.stringify(result);
                        fancyLog(["Calling fn \u201C" + key + "\u201D with args: (" + arguments + ") , result: " + resultString], force);
                        return result;
                    };
                    return descriptor;
                };
            }
            MethodDecoration.log = log;
        })(MethodDecoration = KartwarsBot.MethodDecoration || (KartwarsBot.MethodDecoration = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
