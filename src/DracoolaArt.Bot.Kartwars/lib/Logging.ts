namespace DracoolaArt.KartwarsBot {
	!function (window, document) {
		let emulatedConsole: Console;
		let lastLogId = (-Infinity).toString();

		// Restore console.
		jQuery(document).ready(function () {
			emulatedConsole = (jQuery('<iframe>').hide().appendTo('body')[0] as HTMLIFrameElement).contentWindow.console;
		});

		// Anti polution console logger.
		window.log = function () {
			// if (window.logDebugging) {
			let stackFramesProcessor = function (stackframes) {
				let stringifiedStack = stackframes.map(function (sf) {
					return sf.toString();
				}).join('\n');

				return stringifiedStack.hashCode();
			};

			let thisId = stackFramesProcessor(StackTrace.getSync()).toString() + arguments[0].toString().hashCode();
			if (lastLogId != thisId) {
				lastLogId = thisId;
				emulatedConsole.log.apply(emulatedConsole, arguments);
			}
			// }
		};

		// Inspired by PIXI
		window.autobotSaidHello = false;
		window.autobotSayHello = function () {
			if (window.autobotSaidHello) {
				return;
			}

			let url = 'https://github.com/kmataru/kartwars.io-bot/';
			let me = `
 ____  __.               __                      
|    |/ _| _____ _____ _/  |______ _______ __ __ 
|      <  /     \\\\__  \\\\   __\\__  \\\\_  __ \\  |  \\
|    |  \\|  Y Y  \\/ __ \\|  |  / __ \\|  | \\/  |  /
|____|__ \\__|_|  (____  /__| (____  /__|  |____/ 
        \\/     \\/     \\/          \\/             
`;

			if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
				let args = [
					`${me}\n %c %c %c kartwars.io-bot ${window.GM_info.script.version}  %c  %c  ${url}  %c %c \uD83D\uDE97%c\uD83D\uDE97%c\uD83D\uDE97 \n\n`,
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

				emulatedConsole.log.apply(emulatedConsole, args);
			}
			else if (emulatedConsole.log) {
				emulatedConsole.log(`${me}\nkartwars.io-bot ${window.GM_info.script.version} - ${url}`);
			}

			window.autobotSaidHello = true;
		};
	}(window, document);
}
