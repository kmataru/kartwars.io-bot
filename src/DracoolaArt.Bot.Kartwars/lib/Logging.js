var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var emulatedConsole;
        var lastLogId = (-Infinity).toString();
        //
        // Restore console.
        !function (window, document) {
            jQuery(document).ready(function () {
                emulatedConsole = jQuery('<iframe>').hide().appendTo('body')[0].contentWindow.console;
            });
        }(window, document);
        window.log = function () {
            if (window.logDebugging) {
                var stackFramesProcessor = function (stackframes) {
                    var stringifiedStack = stackframes.map(function (sf) {
                        return sf.toString();
                    }).join('\n');
                    return stringifiedStack.hashCode();
                };
                var thisId = stackFramesProcessor(StackTrace.getSync()).toString() + arguments[0].toString().hashCode();
                if (lastLogId != thisId) {
                    lastLogId = thisId;
                    emulatedConsole.log.apply(emulatedConsole, arguments);
                }
            }
        };
        // Inspired by PIXI
        // TODO : Review
        window.autobotSaidHello = false;
        window.autobotSayHello = function () {
            if (window.autobotSaidHello) {
                return;
            }
            var url = 'https://github.com/kmataru/kartwars.io-bot/';
            var me = "\n ____  __.               __                      \n|    |/ _| _____ _____ _/  |______ _______ __ __ \n|      <  /     \\\\__  \\\\   __\\__  \\\\_  __ \\  |  \\\n|    |  \\|  Y Y  \\/ __ \\|  |  / __ \\|  | \\/  |  /\n|____|__ \\__|_|  (____  /__| (____  /__|  |____/ \n        \\/     \\/     \\/          \\/             \n";
            if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
                var args = [
                    me + "\n %c %c %c kartwars.io-bot " + window.GM_info.script.version + "  %c  %c  " + url + "  %c %c \uD83D\uDE97%c\uD83D\uDE97%c\uD83D\uDE97 \n\n",
                    'background: #087E8B; padding:5px 0;',
                    'background: #087E8B; padding:5px 0;',
                    'color: #087E8B; background: #030307; padding:5px 0;',
                    'background: #087E8B; padding:5px 0;',
                    'color: #0B3954; background: #BFD7EA; padding:5px 0;',
                    'background: #087E8B; padding:5px 0;',
                    'color: #C81D25; background: #fff; padding:5px 0;',
                    'color: #C81D25; background: #fff; padding:5px 0;',
                    'color: #C81D25; background: #fff; padding:5px 0;',
                ];
                window.log.apply(emulatedConsole, args);
            }
            else if (window.log) {
                // window.log(`kartwars.io-bot ${window.GM_info.script.version} - ${url}`);
                window.log(me + "\nkartwars.io-bot " + window.GM_info.script.version + " - " + url);
            }
            window.autobotSaidHello = true;
        };
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
