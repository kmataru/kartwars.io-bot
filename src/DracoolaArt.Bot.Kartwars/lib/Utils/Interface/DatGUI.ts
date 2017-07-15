namespace DracoolaArt.KartwarsBot.Utils.Interface {
	export enum DatGuiThemes {
		Default,
		Lighter,
	}

	/**
	 * dat.GUI Wrapper.
	 */
	export class DatGUI implements IDatGUI {
		public gui: dat.GUI;
		public guiDomParentElement: HTMLElement;

		private _selectedTheme: DatGuiThemes = DatGuiThemes.Default;
		get selectedTheme(): DatGuiThemes {
			this.checkTheme();
			return this._selectedTheme;
		}

		set selectedTheme(value: DatGuiThemes) {
			this._selectedTheme = value;
			this.checkTheme();
		}

		constructor() {
			//
			// Change position of existing elements
			$('.best-users').css('right', 'calc(300px - 10px)');
			$('#hud').css('left', 'initial').css('right', 'calc(300px - 10px)');
			//

			let gui = this.gui = new dat.GUI();
			let guiDomParentElement = this.guiDomParentElement = gui.domElement.parentElement;

			$(guiDomParentElement)
				.css('z-index', '1000')
				.mouseenter(function () {
					$(this).data('isInside', true);
				})
				.mouseleave(function () {
					$(this).data('isInside', false);
				});
		}

		private checkTheme() {
			let jDatGuiElement = $(this.guiDomParentElement);

			if (this._selectedTheme == DatGuiThemes.Default) {
				jDatGuiElement.removeClass('light-theme');
			} else {
				jDatGuiElement.addClass('light-theme');
			}
		}

		gameWrapper: GameWrapper;
		canvas: Utils.CanvasUtils;
		userInterface: UserInterface;
		bot: Bot;
		developerInterface: DeveloperInterface;
		webSocketInterface: WebSocketInterface;

		public init(
			gameWrapper: GameWrapper,
			canvas: Utils.CanvasUtils,
			userInterface: UserInterface,
			bot: Bot,
			developerInterface: DeveloperInterface,
			webSocketInterface: WebSocketInterface
		): void {
			this.gameWrapper = gameWrapper;
			this.canvas = canvas;
			this.userInterface = userInterface;
			this.bot = bot;
			this.developerInterface = developerInterface;
			this.webSocketInterface = webSocketInterface;

			let gui = this.gui;

			{
				let baseControlsOptions = gui.addFolder('Actions');
				baseControlsOptions.open();

				gui.remember(this);
				gui.remember(bot);
				gui.remember(bot.opt);

				/* tslint:disable:object-literal-sort-keys */
				let datGuiThemesConstrains = {
					'Darker': DatGuiThemes.Default,
					'Lighter': DatGuiThemes.Lighter,
				};

				let strategiesConstrains = {
					'Default': Strategy.Strategies.Default,
					'Calculate Torque': Strategy.Strategies.CalculateTorque,
					'Basic Pursuit': Strategy.Strategies.BasicPursuit,
					'Pursuit & Shoot': Strategy.Strategies.PursuitAndShoot,
					'Draw Enemies': Strategy.Strategies.DrawEnemies,
					'Interconnect Food': Strategy.Strategies.InterconnectFood,
				};

				let collisionManagersConstrains = {
					'Default': Manager.Collision.Managers.Default,
					'Advanced': Manager.Collision.Managers.Advanced,
					// 'Über': Manager.Collision.Managers.Uber,
				};
				/* tslint:enable:object-literal-sort-keys */

				baseControlsOptions.add(this, nameof(() => this.selectedTheme), datGuiThemesConstrains).name('GUI Theme');
				baseControlsOptions.add(bot, nameof(() => bot.isBotEnabled)).name('Enable Bot');
				baseControlsOptions.add(bot, nameof(() => bot.selectedStrategy), strategiesConstrains).name('Strategy');
				baseControlsOptions.add(bot, nameof(() => bot.selectedCollisionManager), collisionManagersConstrains).name('Collision Manager');
				baseControlsOptions.add(bot.opt, nameof(() => bot.opt.autoRespawn)).name('Auto Respawn');
				baseControlsOptions.add(userInterface, nameof(() => userInterface.toggleOverlays)).name('Toggle Overlays');
				baseControlsOptions.add(userInterface, nameof(() => userInterface.resetZoom)).name('Reset Zoom');
				baseControlsOptions.add(userInterface, nameof(() => userInterface.quit)).name('Quit');
			}

			// Important !!
			let forcedatGUIInitialization = bot.Strategy;

			{
				let debuggingOptions = gui.addFolder('Debugging');
				debuggingOptions.open();

				gui.remember(developerInterface.opt);
				gui.remember(developerInterface.opt.individual);

				debuggingOptions.add(developerInterface.opt, nameof(() => developerInterface.opt.logDebugging));

				{
					let debuggingIndividualOptions = debuggingOptions.addFolder('Individual');
					debuggingIndividualOptions.open();

					debuggingIndividualOptions.add(developerInterface.opt.individual, nameof(() => developerInterface.opt.individual.stageChange)).name('State');
					debuggingIndividualOptions.add(developerInterface.opt.individual, nameof(() => developerInterface.opt.individual.playerAliveChange)).name('Player alive');
					debuggingIndividualOptions.add(developerInterface.opt.individual, nameof(() => developerInterface.opt.individual.chaseNewEnemy)).name('Chase new Enemy');
					debuggingIndividualOptions.add(developerInterface.opt.individual, nameof(() => developerInterface.opt.individual.scoreTable)).name('Score');
					debuggingIndividualOptions.add(developerInterface.opt.individual, nameof(() => developerInterface.opt.individual.experimentalContextMenu)).name('Context Menu');
					debuggingIndividualOptions.add(developerInterface.opt.individual, nameof(() => developerInterface.opt.individual.acceleration)).name('Acceleration');
				}
			}

			{
				let visualDebuggingOptions = gui.addFolder('Visual Debugging');
				visualDebuggingOptions.open();

				gui.remember(canvas.opt);
				gui.remember(canvas.opt.draw);
				gui.remember(canvas.opt.colors);

				visualDebuggingOptions.add(canvas.opt, nameof(() => canvas.opt.visualDebugging));

				visualDebuggingOptions.add(canvas.opt, nameof(() => canvas.opt.shadowBlur)).name('Shadow Blur');

				{
					let visualDebuggingIndividualOptions = visualDebuggingOptions.addFolder('Individual');
					visualDebuggingIndividualOptions.open();

					visualDebuggingIndividualOptions.add(canvas.opt.draw, nameof(() => canvas.opt.draw.player));
					visualDebuggingIndividualOptions.add(canvas.opt.draw, nameof(() => canvas.opt.draw.dangers));
					visualDebuggingIndividualOptions.add(canvas.opt.draw, nameof(() => canvas.opt.draw.food));
				}

				{
					let visualDebuggingColorsOptions = visualDebuggingOptions.addFolder('Colors');
					//visualDebuggingIndividualOptions.open();

					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.goalLine));
					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.goalDot));
					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.goalCross));

					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.collidedPoint));
					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.collidedElement));

					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.collisionAvoidancePointA));
					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.collisionAvoidancePointB));

					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.foodCluster));
					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.foodClusterText));
					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.foodClusterLine));

					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.foodClusterBoundary));

					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.inRangeResource));
					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.collectableResource));

					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.predictionLine));
					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.predictionCircle));

					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.encircledPlayerWarning));
					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.encircledPlayerDanger));

					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.collisionElement));
					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.collisionLine));

					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.playerRadius));
					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.closeToImminentDangerRadius));

					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.playerSideDetector));
					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.playerHeadDetector));
					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.playerTailDetector));

					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.frontResourceGatherArc));
					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.frontDangerArc));
					visualDebuggingColorsOptions.add(canvas.opt.colors, nameof(() => canvas.opt.colors.tailDangerArc));
				}
			}
		}
	}
}
