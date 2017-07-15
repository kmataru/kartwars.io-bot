/* tslint:disable */

namespace DracoolaArt.KartwarsBot.Strategy {
	/**
	 * Draw Enemies Test Strategy.
	 */
	@MethodDecoration.sealed
	export class DrawEnemiesBotStrategy extends StrategyBase {
		aggressivity: number = 0;

		private hasValidSprite(el: Sprite) {
			let worldBounds = this.gameWrapper.world.getWorkingBounds(),
				img = el.img,
				position = img.position;

			//return (position.x > worldBounds.x && position.y > worldBounds.y) &&
			//	(position.x < worldBounds.width && position.y < worldBounds.height) &&
			//	(img.visible && (img.alpha > 0) && img.renderable);

			return (position.x > worldBounds.x && position.y > worldBounds.y) &&
				(position.x < worldBounds.width && position.y < worldBounds.height);
		}

		private _baseGetItems<T extends Sprite>(items: Object, type: Function, skipId?: number): Array<T> {
			let results = [], count = 0;

			let localElements = jQuery.extend(true, {}, items);

			let playerPosition = this.gameWrapper.player.getPosition();

			for (let localSprite in localElements) {
				let element = (localElements[localSprite] as T);

				element.img.visible = true;
				element.img.alpha = 1;
				element.img.renderable = true;

				if (!(element instanceof type) || (!this.hasValidSprite(element))) {
					delete (localElements[localSprite]);
					continue;
				}

				let x = element.img.position.x,
					y = element.img.position.y;

				element.x = x;
				element.y = y;

				element.distance = Utils.MathUtils.getDistance(element, playerPosition);

				if (skipId && (element.id == skipId)) {
					delete (localElements[localSprite]);
					continue;
				}

				results[count++] = element;
			}

			return results;
		}

		public onPlayerDeath() {
			//
		}

		public action(): IActivityResult {
			let foodTacticsActivityResult: IActivityResult = null;

			window.botFactory.clock.startFrame();

			let enemies = this._baseGetItems<Car>(window.sprites, window.Car, window.mainCar.id);

			let $this = this;
			enemies.forEach(function (element) {
				$this.canvas.drawCircle(
					new Structures.Circle(element.x, element.y, 75),
					'red',
					true,
					0.25
				);
			});

			//
			//

			foodTacticsActivityResult = Structures.ActivityResult.CreateValidResponse(new Structures.Point2D(
				this.bot.worldCenterX,
				this.bot.worldCenterY
			));

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
				let baseControlsOptions = gui.addFolder('Draw Enemies Test Actions');
				this._guiElements.push(baseControlsOptions.domElement);
				baseControlsOptions.open();

				//baseControlsOptions.add(this, 'property');
			}

			this._guiIsInitialised = true;
		}
	}
}
