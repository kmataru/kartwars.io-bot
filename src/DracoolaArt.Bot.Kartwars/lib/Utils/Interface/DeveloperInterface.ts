namespace DracoolaArt.KartwarsBot.Utils.Interface {
	export class DeveloperInterfaceIndividualOptions {
		constructor(private readonly developerInterfaceOptions: DeveloperInterfaceOptions) {
		}

		//
		// stageChange property
		private _stageChange: boolean = false;
		public get stageChange(): boolean {
			return this.developerInterfaceOptions.logDebugging && this._stageChange;
		}

		public set stageChange(value: boolean) {
			this._stageChange = value;
		}
		// !stageChange property
		//

		//
		// playerAliveChange property
		private _playerAliveChange: boolean = false;
		public get playerAliveChange(): boolean {
			return this.developerInterfaceOptions.logDebugging && this._playerAliveChange;
		}

		public set playerAliveChange(value: boolean) {
			this._playerAliveChange = value;
		}
		// !playerAliveChange property
		//

		//
		// chaseNewEnemy property
		private _chaseNewEnemy: boolean = false;
		public get chaseNewEnemy(): boolean {
			return this.developerInterfaceOptions.logDebugging && this._chaseNewEnemy;
		}

		public set chaseNewEnemy(value: boolean) {
			this._chaseNewEnemy = value;
		}
		// !chaseNewEnemy property
		//

		//
		// scoreTable property
		private _scoreTable: boolean = true;
		public get scoreTable(): boolean {
			return this.developerInterfaceOptions.logDebugging && this._scoreTable;
		}

		public set scoreTable(value: boolean) {
			this._scoreTable = value;
		}
		// !scoreTable property
		//

		//
		// experimentalContextMenu property
		private _experimentalContextMenu: boolean = false;
		public get experimentalContextMenu(): boolean {
			return this.developerInterfaceOptions.logDebugging && this._experimentalContextMenu;
		}

		public set experimentalContextMenu(value: boolean) {
			this._experimentalContextMenu = value;
		}
		// !experimentalContextMenu property
		//

		//
		// acceleration property
		private _acceleration: boolean = false;
		public get acceleration(): boolean {
			return this.developerInterfaceOptions.logDebugging && this._acceleration;
		}

		public set acceleration(value: boolean) {
			this._acceleration = value;
		}
		// !acceleration property
		//
	}

	export class DeveloperInterfaceOptions {
		/**
		 * Log debugging.
		 */
		public logDebugging: boolean = true;

		/**
		 * Individual logging options.
		 */
		public individual: DeveloperInterfaceIndividualOptions = new DeveloperInterfaceIndividualOptions(this);
	}

	export class DeveloperInterface implements IDeveloperInterface, IBoot {
		readonly opt: DeveloperInterfaceOptions;

		// Constructor
		constructor(protected readonly gameWrapper: GameWrapper, protected readonly bot: Bot, protected readonly userInterface: UserInterface) {
			this.opt = new DeveloperInterfaceOptions();
		}

		public boot() {
			this.bot.watch('stage', (id, oldValue, newValue) => {
				if (this.opt.individual.stageChange) {
					if (oldValue != newValue) {
						window.log(`Bot Stage: ${BotStageEnum[+oldValue]} -> ${BotStageEnum[+newValue]}`);
					}
				}

				return newValue;
			});
		}

		@MethodDecoration.bound
		public onGameReadyDelegate() {
			window.mainCar.img.watch('alive', (id, oldValue, newValue) => {
				if (oldValue != newValue) {
					if (this.opt.individual.playerAliveChange) {
						window.log('Player Alive:', newValue);
					}

					this.bot.onPlayerDeath();
					this.bot.Strategy.onPlayerDeath();
					this.userInterface.onPlayerDeath();

					if (this.bot.opt.autoRespawn) {
						setTimeout(this.gameWrapper.util.delayedConnect, 5000);
					}
				}

				return newValue;
			});
		}
	}

	export class AdsInterface implements IAdsInterface {
		constructor() {
			(function (i, s, o, g, r, a?, m?) {
				i['GoogleAnalyticsObject'] = r;
				i[r] = i[r] || function () {
					(i[r].q = i[r].q || []).push(arguments);
				}, i[r].l = +(new Date());
				a = s.createElement(o),
					m = s.getElementsByTagName(o)[0];
				a.async = 1;
				a.src = g;
				m.parentNode.insertBefore(a, m);
			})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'kga');

			kga('create', 'UA-64079204-4', 'auto');
			kga('send', 'pageview');
		}
	}
}