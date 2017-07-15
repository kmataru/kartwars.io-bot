/* tslint:disable */

namespace DracoolaArt.KartwarsBot.Strategy {
	/**
	 * Calculate Torque Test Strategy.
	 */
	@MethodDecoration.sealed
	export class CalculateTorqueBotStrategy extends StrategyBase {
		aggressivity: number = 0;

		startPosition: IPoint2D;
		stepx: number = 0;
		startTime: number = 0;

		xPoints: { p1: number, p2: number } = { p1: Infinity, p2: -Infinity };
		yPoints: { p1: number, p2: number } = { p1: Infinity, p2: -Infinity };

		public onPlayerDeath() {
			//
		}

		private reset() {
			this.startPosition = null;
		}

		private startTracking() {
			this.xPoints = { p1: Infinity, p2: -Infinity };
			this.yPoints = { p1: Infinity, p2: -Infinity };

			this.startTime = 0;
			this.stepx = 0;
		}

		/*
		window['xPoints'].p2 - window['xPoints'].p1
		window['yPoints'].p2 - window['yPoints'].p1
		== 350
	
		window['trackedTime']
		== 2500
	
		==>
		
		r = 350 / 2
		p = 2 * Math.PI * r
		s = p * 1000 / 2500
		s == 439.822971502571 u/s
		*/
		public action(): IActivityResult {
			let foodTacticsActivityResult: IActivityResult = null;
			let goalCoordinates: IPoint2D;

			window.botFactory.clock.startFrame();

			this.gameWrapper.items.reset();
			this.gameWrapper.items.getEnemies();

			let playerPosition = this.gameWrapper.player.getPosition();

			if (!this.startPosition) {
				this.startPosition = playerPosition;

				goalCoordinates = new Structures.Point2D(
					playerPosition.x,
					playerPosition.y
				);
			}

			this.xPoints.p1 = Math.min(this.xPoints.p1, playerPosition.x);
			this.xPoints.p2 = Math.max(this.xPoints.p2, playerPosition.x);

			this.yPoints.p1 = Math.min(this.yPoints.p1, playerPosition.y);
			this.yPoints.p2 = Math.max(this.yPoints.p2, playerPosition.y);

			if (this.stepx == 0) {
				if (playerPosition.y < this.bot.goal.coordinates.y) {
					this.stepx = 1;
				}
			}

			if (this.stepx == 1) {
				if (playerPosition.y >= this.bot.goal.coordinates.y) {
					this.startTime = (+new Date());

					this.stepx = 2;
				}
			}

			if (this.stepx == 2) {
				if (playerPosition.y < this.bot.goal.coordinates.y) {
					this.stepx = 3;
				}
			}

			if (this.stepx == 3) {
				if (playerPosition.y >= this.bot.goal.coordinates.y) {
					window['trackedTime'] = (+new Date()) - this.startTime;

					this.stepx = 4;
				}
			}

			window['xPoints'] = this.xPoints;
			window['yPoints'] = this.yPoints;

			if (goalCoordinates) {
				foodTacticsActivityResult = Structures.ActivityResult.CreateValidResponse(goalCoordinates);
			} else {
				foodTacticsActivityResult = Structures.ActivityResult.CreateValidResponse(this.bot.goal.coordinates);
			}

			window.botFactory.clock.endFrame();

			return foodTacticsActivityResult;
		}

		protected foodAction() {
			// NOOP
		}

		protected initDatGui(datGUIWrapper: Utils.Interface.DatGUI): void {
			if (this._guiIsInitialised) {
				return;
			}

			let gui = datGUIWrapper.gui;

			let defaultBehaviour: Behaviour.BehaviourData = Behaviour.BehaviourData.defaultBehaviour;

			{
				let baseControlsOptions = gui.addFolder('Torque Test Actions');
				this._guiElements.push(baseControlsOptions.domElement);
				baseControlsOptions.open();

				//baseControlsOptions.add(this, 'xStaticRecalibration', -100, 100).listen();
				baseControlsOptions.add(this, nameof(() => this.reset));
				baseControlsOptions.add(this, nameof(() => this.startTracking));
			}

			this._guiIsInitialised = true;
		}
	}
}
