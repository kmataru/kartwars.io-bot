/* tslint:disable */

namespace DracoolaArt.KartwarsBot.Strategy {
	/**
	 * Interconnect Food Test Strategy.
	 */
	@MethodDecoration.sealed
	export class InterconnectFoodBotStrategy extends StrategyBase {
		aggressivity: number = 0;

		private static distance(a, b) {
			return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
		}

		private drawI(tree, currentResource, deep) {
			tree.remove(currentResource);

			//let nearest = tree.nearest(currentResource, 1, [3500]);
			let nearest = tree.nearest(currentResource, 1);

			for (let j = 0; j < nearest.length; j++) {
				let point = nearest[j][0];

				this.canvas.drawLine(currentResource, point, 'black', 3, 0.5);

				tree.remove(point);

				if (--deep > 0) {
					this.drawI(tree, point, deep);
				}
			}
		}

		public onPlayerDeath() {
			//
		}

		public action(): IActivityResult {
			let foodTacticsActivityResult: IActivityResult = null;

			window.botFactory.clock.startFrame();

			//let playerPosition = this.gameWrapper.player.getPosition();
			let food = this.gameWrapper.items.getFood();

			foodTacticsActivityResult = this.FoodTactics.action();

			if (foodTacticsActivityResult.isValid) {
				//let currentResource = (foodTacticsActivityResult.goalCoordinates as Bot2Point2D);
				let currentResource = foodTacticsActivityResult.goalCoordinates;

				let tree = new window.kdTree(food, InterconnectFoodBotStrategy.distance, ['x', 'y']);
				this.drawI(tree, currentResource, 15);
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
				let baseControlsOptions = gui.addFolder('Interconnect Food Test Actions');
				this._guiElements.push(baseControlsOptions.domElement);
				baseControlsOptions.open();

				//baseControlsOptions.add(this, 'property');
			}

			this._guiIsInitialised = true;
		}
	}
}
