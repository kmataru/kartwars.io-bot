namespace DracoolaArt.KartwarsBot.Tactics.Fight {
	/**
	 * Chase Closest enemy Tactic.
	 */
	export class ChaseClosest implements ITactic, IFightChase {
		// Constructor
		constructor(protected readonly bot: Bot, protected readonly gameWrapper: GameWrapper, protected readonly canvas: Utils.CanvasUtils) {
		}

		private currentTarget: {
			enemyId: number,
			reference: Car,
			x: number,
			y: number,
		};

		/**
		 * Chase an enemy if player has a weapon that shoots in front.
		 */
		public action(projectileMagnitude?: number): IActivityResult {
			let enemies = this.gameWrapper.items.getEnemies();

			let resetEnemy = true;

			if (this.currentTarget != undefined) {
				let enemyId = this.currentTarget.enemyId;

				if (enemyId != undefined) {
					for (let i = 0, ls = enemies.length; i < ls && enemies[i] !== null; i++) {
						let thisEnemy = enemies[i];

						if (thisEnemy.id == enemyId) {
							this.currentTarget.x = thisEnemy.x;
							this.currentTarget.y = thisEnemy.y;

							resetEnemy = false;

							break;
						}
					}
				}
			}

			if (resetEnemy) {
				if (enemies.length > 0) {
					for (let i = 0, ls = enemies.length; i < ls && enemies[i] !== null; i++) {
						let thisEnemy = enemies[i];

						if (thisEnemy.velocity) {
							if (window.botFactory.developerInterface.opt.individual.chaseNewEnemy) {
								window.log(`Chasing new enemy with id ${thisEnemy.id}`);
							}

							this.currentTarget = {
								reference: thisEnemy,
								x: thisEnemy.x,
								y: thisEnemy.y,
								enemyId: thisEnemy.id
							};

							break;
						}
					}
				}
			}

			if (this.currentTarget) {
				let selectedEnemy = this.currentTarget.reference;
				if (selectedEnemy) {
					let goalCoordinates: IPoint2D;

					this.bot.stage = BotStageEnum.InterceptEnemy;

					// This might fail if there's no quadratic solution
					if (projectileMagnitude > 0) {
						goalCoordinates = Utils.MathUtils.predictIntersectionEx(window.mainCar, selectedEnemy, projectileMagnitude);
					}

					if (!goalCoordinates) {
						goalCoordinates = Utils.MathUtils.predictIntersection(window.mainCar, selectedEnemy);
					}

					// Draw intersection prediction
					this.canvas.drawIntersectionPrediction(goalCoordinates);

					return Structures.ActivityResult.CreateValidResponse(goalCoordinates);
				}
			}

			return Structures.ActivityResult.CreateInvalidResponse();
		}
	}
}
