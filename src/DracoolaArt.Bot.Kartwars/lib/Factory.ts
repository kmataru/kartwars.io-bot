namespace DracoolaArt.KartwarsBot {
	/**
	 * Default Bot Factory.
	 */
	export class BotFactory implements IBotFactory, IBoot {
		public readonly gameWrapper: GameWrapper;
		public readonly canvas: Utils.CanvasUtils;
		public readonly contextMenu: Utils.Interface.ContextMenu;
		public readonly userInterface: Utils.Interface.UserInterface;
		public readonly bot: Bot;
		public readonly developerInterface: Utils.Interface.DeveloperInterface;
		public readonly adsInterface: Utils.Interface.AdsInterface;
		public readonly webSocketInterface: WebSocketInterface;

		public readonly clock: Manager.Time.TimerFrame;
		public readonly externalGraph: ExternalGraph;

		public readonly datGUI: Utils.Interface.DatGUI;

		constructor() {
			let datGUI = this.datGUI = new Utils.Interface.DatGUI();

			let gameWrapper = this.gameWrapper = new GameWrapper();
			let canvas = this.canvas = new Utils.CanvasUtils(gameWrapper);
			let bot = this.bot = new Bot(gameWrapper, canvas, datGUI);
			let contextMenu = this.contextMenu = new Utils.Interface.ContextMenu();
			let userInterface = this.userInterface = new Utils.Interface.UserInterface(gameWrapper, contextMenu, canvas, bot);
			let developerInterface = this.developerInterface = new Utils.Interface.DeveloperInterface(gameWrapper, bot, userInterface);
			let adsInterface = this.adsInterface = new Utils.Interface.AdsInterface();
			let webSocketInterface = this.webSocketInterface = new WebSocketInterface();

			let clock = this.clock = new Manager.Time.TimerFrame();
			let externalGraph = this.externalGraph = new ExternalGraph();

			datGUI.init(
				gameWrapper,
				canvas,
				userInterface,
				bot,
				developerInterface,
				webSocketInterface
			);

			contextMenu.init(
				gameWrapper,
				canvas,
				userInterface,
				bot,
				developerInterface,
				webSocketInterface
			);
		}

		private isInitialized = false;

		public boot() {
			let gameWrapper = this.gameWrapper;
			let canvas = this.canvas;
			let bot = this.bot;
			let contextMenu = this.contextMenu;
			let userInterface = this.userInterface;
			let developerInterface = this.developerInterface;
			let webSocketInterface = this.webSocketInterface;

			let externalGraph = this.externalGraph;
			let datGUI = this.datGUI;

			//

			window.autobotSayHello();

			let gameReadyDelegate = function () {
				userInterface.onGameReadyDelegate();
				developerInterface.onGameReadyDelegate();
				webSocketInterface.onGameReadyDelegate();

				if (this.isInitialized) {
					return;
				}

				userInterface.boot();
				developerInterface.boot();

				// Very important as we don't need to boot up multiple times the same controller as it messes up with the events
				this.isInitialized = true;
			};

			document.addEventListener('gameReady', gameReadyDelegate);

			$('#play-btn').removeClass('btn-none').addClass('btn-show');
		}
	}
}
