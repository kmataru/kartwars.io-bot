/* tslint:disable */

namespace DracoolaArt.KartwarsBot.Strategy {
	/**
	 * Pursuit Enemy Test Strategy.
	 */
	@MethodDecoration.sealed
	export class PursuitBotStrategy extends StrategyBase {
		aggressivity: number = 0;

		currentEnemy: {
			enemyId: number,
			thisEnemy: Car,
			x: number,
			y: number,
		};

		usePrediction: boolean = false;

		public onPlayerDeath() {
			//
		}

		public action(): IActivityResult {
			let foodTacticsActivityResult: IActivityResult = null;

			window.botFactory.clock.startFrame();

			let resetEnemy = true;

			this.gameWrapper.items.reset();
			let enemies = this.gameWrapper.items.getEnemies();

			if (this.currentEnemy != undefined) {
				let enemyId = this.currentEnemy.enemyId;

				if (enemyId != undefined) {
					for (let i = 0, ls = enemies.length; i < ls && enemies[i] !== null; i++) {
						let thisEnemy = enemies[i];

						if (thisEnemy.id == enemyId) {
							this.currentEnemy.x = thisEnemy.x;
							this.currentEnemy.y = thisEnemy.y;

							resetEnemy = false;

							break;
						}
					}
				}
			}

			if (resetEnemy) {
				if (enemies.length > 0) {
					let thisEnemy = enemies[0];

					this.currentEnemy = {
						thisEnemy: thisEnemy,
						x: thisEnemy.x,
						y: thisEnemy.y,
						enemyId: thisEnemy.id
					};
				} else {
					this.currentEnemy = {
						x: this.bot.worldCenterX,
						y: this.bot.worldCenterY,
						thisEnemy: undefined,
						enemyId: undefined
					};
				}
			}

			let preprocessedGoalCoordinates = new Structures.Point2D(
				this.currentEnemy.x,
				this.currentEnemy.y
			);

			let selectedEnemy = this.currentEnemy.thisEnemy;
			if (this.usePrediction && selectedEnemy) {
				if (selectedEnemy.velocity) {
					preprocessedGoalCoordinates = Utils.MathUtils.predictIntersection(window.mainCar, selectedEnemy);

					let goalCoordinatesEx = Utils.MathUtils.predictIntersectionEx(window.mainCar, selectedEnemy, 20.25);
					if (goalCoordinatesEx) {
						let playerPosition = this.gameWrapper.player.getPosition();

						this.canvas.drawLine(playerPosition, goalCoordinatesEx, 'black', 10, 0.75);
						this.canvas.drawCircle(goalCoordinatesEx, this.canvas.opt.colors.predictionCircle, false, 0.75);
					}
				}
			}

			foodTacticsActivityResult = Structures.ActivityResult.CreateValidResponse(preprocessedGoalCoordinates);

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

			var defaultBehaviour: Behaviour.BehaviourData = Behaviour.BehaviourData.defaultBehaviour;

			{
				let baseControlsOptions = gui.addFolder('Pursuit Test Actions');
				this._guiElements.push(baseControlsOptions.domElement);
				baseControlsOptions.open();

				baseControlsOptions.add(this, nameof(() => this.usePrediction));
			}

			this._guiIsInitialised = true;
		}
	}
}
