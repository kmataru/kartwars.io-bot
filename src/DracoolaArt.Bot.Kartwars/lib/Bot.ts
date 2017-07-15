/// <reference path="_references.ts" />
/// <reference path="BotBase.ts" />

namespace DracoolaArt.KartwarsBot {
	export enum BotStageEnum {
		NotStarted = 0,

		AvoidCollision,
		AvoidEncirclement,

		SeekFood,
		// TODO : Review
		// SeekFoodCluster,
		SeekWeapon,

		// TODO : Review
		// DeployWeapon,
		InterceptEnemy,
	}

	/**
	 * Kartwars.io Bot.
	 */
	export class Bot extends BotBase implements IBot {
		private _selectedStrategy: Strategy.Strategies = Strategy.Strategies.Default;
		private _selectedCollisionManager: Manager.Collision.Managers = Manager.Collision.Managers.Default;
		private _strategies: Strategy.IStrategy[] = [];
		private _collisionManagers: Manager.Collision.ICollision[] = [];

		// Constructor
		constructor(gameWrapper: GameWrapper, canvas: Utils.CanvasUtils, protected readonly datGUI: Utils.Interface.DatGUI) {
			super(gameWrapper, canvas);
		}

		//
		// selectedStrategy property
		public get selectedStrategy(): Strategy.Strategies {
			return this._selectedStrategy;
		}

		public set selectedStrategy(value: Strategy.Strategies) {
			let newValue = Strategy.Strategies[Strategy.Strategies[value]];

			if (this._selectedStrategy != newValue) {
				let oldSelectionStrategy = this._strategies[this._selectedStrategy];
				oldSelectionStrategy.hideDatGui();

				this._selectedStrategy = newValue;

				// Forces the creation of the strategy based on selection
				let selectedStrategy = this.Strategy;
			}
		}
		// !selectedStrategy property
		//

		//
		// selectedCollisionManager property
		public get selectedCollisionManager(): Manager.Collision.Managers {
			return this._selectedCollisionManager;
		}

		public set selectedCollisionManager(value: Manager.Collision.Managers) {
			this._selectedCollisionManager = Manager.Collision.Managers[Manager.Collision.Managers[value]];
		}
		// !selectedStrategy property
		//

		//
		// Strategy property
		public get Strategy(): Strategy.IStrategy {
			let selectedStrategyOption = this.selectedStrategy;
			let selectedStrategy = this._strategies[selectedStrategyOption];

			if (selectedStrategy == undefined) {
				let instance: Strategy.IStrategy;

				switch (selectedStrategyOption) {
					case Strategy.Strategies.Default: {
						instance = new Strategy.DefaultStrategy(this, this.gameWrapper, this.canvas);
					} break;

					case Strategy.Strategies.CalculateTorque: {
						instance = new Strategy.CalculateTorqueBotStrategy(this, this.gameWrapper, this.canvas);
					} break;

					case Strategy.Strategies.BasicPursuit: {
						instance = new Strategy.PursuitBotStrategy(this, this.gameWrapper, this.canvas);
					} break;

					case Strategy.Strategies.PursuitAndShoot: {
						instance = new Strategy.PursuitAndShootBotStrategy(this, this.gameWrapper, this.canvas);
					} break;

					case Strategy.Strategies.DrawEnemies: {
						instance = new Strategy.DrawEnemiesBotStrategy(this, this.gameWrapper, this.canvas);
					} break;

					case Strategy.Strategies.InterconnectFood: {
						instance = new Strategy.InterconnectFoodBotStrategy(this, this.gameWrapper, this.canvas);
					} break;

					default: {
						throw Error(`Incompatible value or type '${selectedStrategyOption}' in Strategy. Type: ${typeof selectedStrategyOption}.`);
					}
				}

				selectedStrategy = this._strategies[selectedStrategyOption] = instance;
			}

			// Ensure dat GUI is showed up
			selectedStrategy.showDatGui(this.datGUI);

			return selectedStrategy;
		}
		// !Strategy property
		//

		//
		// CollisionManager property
		public get CollisionManager(): Manager.Collision.ICollision {
			let selectedCollisionManagerOption = this.selectedCollisionManager;
			let selectedCollisionManager = this._collisionManagers[selectedCollisionManagerOption];

			if (selectedCollisionManager == undefined) {
				let instance: Manager.Collision.ICollision;

				switch (selectedCollisionManagerOption) {
					case Manager.Collision.Managers.Default: {
						instance = new Manager.Collision.CollisionCourseManager(this, this.gameWrapper, this.canvas);
					} break;

					case Manager.Collision.Managers.Advanced: {
						instance = new Manager.Collision.AdvancedCollisionCourseManager(this, this.gameWrapper, this.canvas);
					} break;

					/*
					case Manager.Collision.Managers.Uber: {
						instance = new Manager.Collision.UberCollisionCourseManager(this, this.gameWrapper, this.canvas);
					} break;
					*/

					default: {
						throw Error(`Incompatible value or type '${selectedCollisionManagerOption}' in CollisionManager. Type: ${typeof selectedCollisionManagerOption}.`);
					}
				}

				selectedCollisionManager = this._collisionManagers[selectedCollisionManagerOption] = instance;
			}

			return selectedCollisionManager;
		}
		// !CollisionManager property
		//

		/**
		 * Main entry for bot.
		 */
		@MethodDecoration.bound
		public go() {
			this.updateGeometry();

			this.gameWrapper.input.canvas.forceClear();

			let thisStrategyActivityResult: IActivityResult = this.Strategy.action();

			if (!thisStrategyActivityResult) {
				throw new Error('Invalid Strategy Activity Result.');
			}

			this.processActivity(thisStrategyActivityResult);
		}

		/**
		 * Does recalculations based on world environment changes and player changes.
		 */
		// TODO : Add a watcher on dependent variables. (???)
		@MethodDecoration.bound
		private updateGeometry() {
			window.botFactory.clock.startFrame();

			let playerPosition = this.gameWrapper.player.getPosition();
			let playerRotation = this.gameWrapper.player.getRotation();
			let worldBounds = this.gameWrapper.world.getWorkingBounds();

			//
			//

			this.sectorBoxSide = this.gameWrapper.world.getSectorSquaredWidth();
			this.sectorBox = new Structures.Rect(
				playerPosition.x - (this.sectorBoxSide / 2),
				playerPosition.y - (this.sectorBoxSide / 2),
				this.sectorBoxSide,
				this.sectorBoxSide
			);
			// if (window.visualDebugging) this.canvas.drawRect(this.sectorBox, '#c0c0c0', true, 0.1);
			this.canvas.drawRect(this.sectorBox, 0, '#c0c0c0', true, 0.1);

			let thisCos = this.cos = Math.cos(playerRotation);
			let thisSin = this.sin = Math.sin(playerRotation);

			//
			// Base player
			{
				this.shapesHolster.playerCircle = new Structures.Circle(
					playerPosition.x,
					playerPosition.y,
					this.kartRadius * this.opt.playerRadiusMultiplier
				);

				this.shapesHolster.playerResourceGatherCircle = new Structures.Circle(
					playerPosition.x,
					playerPosition.y,
					this.kartRadius * this.opt.playerResourceGatherRadiusMultiplier
				);
			}
			//
			//

			//
			// Close To Imminent Danger detector
			{
				this.shapesHolster.closeToImminentDangerCircle = new Structures.Circle(
					playerPosition.x,
					playerPosition.y,
					this.opt.closeToImminentDangerRange
				);
			}
			//
			//

			//
			// Head & tail collision "detectors"
			{
				let unknown = Math.min(1, this.speedMult - 1);
				let headCircleRadius = this.opt.radiusFrontDetectorMultiplier / 2 * this.kartRadius;
				let tailCircleRadius = this.opt.radiusBehindDetectorMultiplier / 2 * this.kartRadius;

				this.shapesHolster.headCircle = new Structures.Circle(
					playerPosition.x + thisCos * unknown * headCircleRadius,
					playerPosition.y + thisSin * unknown * headCircleRadius,
					headCircleRadius
				);

				this.shapesHolster.tailCircle = new Structures.Circle(
					playerPosition.x - thisCos * unknown * tailCircleRadius,
					playerPosition.y - thisSin * unknown * tailCircleRadius,
					tailCircleRadius
				);
			}
			//
			//

			//
			// Food collector enhancers
			{
				let playerLeftSideCircleRadius = Data.playerTurnRadius * this.opt.radiusSideDetectorsMultiplier;
				let playerLeftSideCircleSin = thisSin * playerLeftSideCircleRadius;
				let playerLeftSideCircleCos = thisCos * playerLeftSideCircleRadius;

				this.shapesHolster.playerLeftSideCircle = new Structures.Circle(
					playerPosition.x + playerLeftSideCircleSin,
					playerPosition.y - playerLeftSideCircleCos,
					playerLeftSideCircleRadius
				);

				this.shapesHolster.playerRightSideCircle = new Structures.Circle(
					playerPosition.x - playerLeftSideCircleSin,
					playerPosition.y + playerLeftSideCircleCos,
					playerLeftSideCircleRadius
				);
			}
			//
			//

			//
			// Tunnel
			{
				let goalCoordinates = this.goal.coordinates;
				let distance2goalCoordinates = Utils.MathUtils.getDistance(playerPosition, goalCoordinates);

				let tunnelSideDistance = this.opt.tunnelSideDistance;

				let tunnelSideStartSin = thisSin * tunnelSideDistance;
				let tunnelSideStartCos = thisCos * tunnelSideDistance;

				let tunnelSideEndSin = thisSin * distance2goalCoordinates;
				let tunnelSideEndCos = thisCos * distance2goalCoordinates;

				//

				let tunnelLeftSideStartPoint = new Structures.Point2D(playerPosition.x + tunnelSideStartSin, playerPosition.y - tunnelSideStartCos);
				let tunnelLeftSideLine = this.shapesHolster.tunnelLeftSideLine = new Structures.Line(
					tunnelLeftSideStartPoint,
					new Structures.Point2D(tunnelLeftSideStartPoint.x + tunnelSideEndCos, tunnelLeftSideStartPoint.y + tunnelSideEndSin),
				);

				let tunnelRightSideStartPoint = new Structures.Point2D(playerPosition.x - tunnelSideStartSin, playerPosition.y + tunnelSideStartCos);
				let tunnelRightSideLine = this.shapesHolster.tunnelRightSideLine = new Structures.Line(
					tunnelRightSideStartPoint,
					new Structures.Point2D(tunnelRightSideStartPoint.x + tunnelSideEndCos, tunnelRightSideStartPoint.y + tunnelSideEndSin),
				);

				//

				let alpha: number = undefined;

				let isGoalInTunnel = this.goal.isInTunnel =
					Utils.MathUtils.isLeft(tunnelLeftSideLine.point1, tunnelLeftSideLine.point2, goalCoordinates) &&
					Utils.MathUtils.isRight(tunnelRightSideLine.point1, tunnelRightSideLine.point2, goalCoordinates);

				if (isGoalInTunnel) {
					alpha = 0.85;

					this.goal.state = this.inFront(goalCoordinates) ? GoalState.InFront : GoalState.InBack;
				}

				this.canvas.drawTunnel(tunnelLeftSideLine, tunnelRightSideLine, alpha);
			}
			//
			//

			window.botFactory.clock.endFrame();
		}

		/**
		 * Processes activity response.
		 * @param thisActivityResult
		 */
		@MethodDecoration.bound
		private processActivity(thisActivityResult: IActivityResult) {
			if (thisActivityResult.isValid) {
				//
				// Process Goal Coordinates.
				let goalCoordinates = thisActivityResult.goalCoordinates;

				let worldBounds = this.gameWrapper.world.getWorkingBounds();

				if (goalCoordinates.x < worldBounds.x) { goalCoordinates.x = worldBounds.x + this.opt.wall.offsetLeftX; }
				if (goalCoordinates.y < worldBounds.y) { goalCoordinates.y = worldBounds.y + this.opt.wall.offsetTopY; }
				if (goalCoordinates.x > worldBounds.width) { goalCoordinates.x = worldBounds.width + this.opt.wall.offsetRightX; }
				if (goalCoordinates.y > worldBounds.height) { goalCoordinates.y = worldBounds.height + this.opt.wall.offsetBottomY; }

				this.goal.coordinates = goalCoordinates;

				this.canvas.setMouseCoordinates(this.canvas.mapToMouse(goalCoordinates));
				//

				//
				// Process Acceleration
				this.setAcceleration(thisActivityResult.acceleration);
				//

				// Draw goal
				this.canvas.drawGoal(goalCoordinates);
			}
		}
	}
}
