var emulatedConsole;
!function (window, document) {
	jQuery(document).ready(function () {
		emulatedConsole = jQuery('<iframe>').hide().appendTo('body')[0].contentWindow.console;
	});
}(window, document);
window.lastLogId = (-Infinity).toString();
window.log = function () {
	if (window.logDebugging) {
		var stackFramesProcessor = function (stackframes) {
			var stringifiedStack = stackframes.map(function (sf) {
				return sf.toString();
			}).join('\n');
			return stringifiedStack.hashCode();
		};
		var thisId = stackFramesProcessor(StackTrace.getSync()).toString() + arguments[0].toString().hashCode();
		if (window.lastLogId != thisId) {
			window.lastLogId = thisId;
			emulatedConsole.log.apply(emulatedConsole, arguments);
		}
	}
};
// Inspired by PIXI
// TODO : Review
window.autobotSaidHello = false;
window.autobotSayHello = function (type) {
	if (window.autobotSaidHello) {
		return;
	}
	var me = "\n ____  __.               __                      \n|    |/ _| _____ _____ _/  |______ _______ __ __ \n|      <  /     \\\\__  \\\\   __\\__  \\\\_  __ \\  |  \\\n|    |  \\|  Y Y  \\/ __ \\|  |  / __ \\|  | \\/  |  /\n|____|__ \\__|_|  (____  /__| (____  /__|  |____/ \n        \\/     \\/     \\/          \\/             \n";
	if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
		var args = [
			me + "\n %c %c %c kartwars.io-bot " + window.GM_info.script.version + " - \u2730 " + type + " \u2730  %c  %c  https://github.com/kmataru/kartwars.io-bot/  %c %c \uD83D\uDE97%c\uD83D\uDE97%c\uD83D\uDE97 \n\n",
			'background: #ff66a5; padding:5px 0;',
			'background: #ff66a5; padding:5px 0;',
			'color: #ff66a5; background: #030307; padding:5px 0;',
			'background: #ff66a5; padding:5px 0;',
			'background: #ffc3dc; padding:5px 0;',
			'background: #ff66a5; padding:5px 0;',
			'color: #ff2424; background: #fff; padding:5px 0;',
			'color: #ff2424; background: #fff; padding:5px 0;',
			'color: #ff2424; background: #fff; padding:5px 0;',
		];
		window.log.apply(emulatedConsole, args);
	}
	else if (window.log) {
		// window.log("kartwars.io-bot ${window.GM_info.script.version} - ${type} - https://github.com/kmataru/kartwars.io-bot/");
		window.log(me + "\nkartwars.io-bot " + window.GM_info.script.version + " - " + type + " - https://github.com/kmataru/kartwars.io-bot/");
	}
	window.autobotSaidHello = true;
};
