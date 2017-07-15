namespace DracoolaArt.KartwarsBot {
	class GameWrapperInputMouse {
		// Constructor
		constructor(protected readonly gameWrapper: GameWrapper) {
		}

		// window.xm
		// window.ym
		// gameWrapper.input.mouse.setCoordinates(point)
		public setCoordinates(point: IPoint2D) {
			window.game.input.mousePointer.x = point.x + (window.game.canvas.width / 2);
			window.game.input.mousePointer.y = point.y + (window.game.canvas.height / 2);
		}

		/*
		getCoordinates(): Point2D {
			return window.game.input.mousePointer;
		}
		*/
	}

	class GameWrapperInputCanvas {
		private _canvasElement: HTMLCanvasElement;
		private _injectElement: Boolean = true;
		private _addEvents: Boolean = true;

		// Constructor
		constructor(protected readonly gameWrapper: GameWrapper) {
		}

		// gameWrapper.input.canvas.forceClear()
		public forceClear() {
			let c = this._canvasElement;
			if (c != null) {
				c.getContext('2d').clearRect(0, 0, c.width, c.height);
			}
		}

		private _registeredEvent: (canvas: HTMLCanvasElement) => void;
		// TODO : Review
		public registerEvent(fx: (canvas: HTMLCanvasElement) => void) {
			if (this._addEvents) {
				this._registeredEvent = fx;

				this._addEvents = false;
			}
		}

		// gameWrapper.input.canvas.getContext()
		public getContext(): CanvasRenderingContext2D {
			// return window.game.input.hitContext;

			/*
			let webGlContext = window.game.canvas.getContext('webgl');
			gameWrapper.input.canvas._canvasElement = webglToCanvas2d(webGlContext, gameWrapper.input.canvas._canvasElement);
			*/

			let c = this._canvasElement;
			if (c == null) {
				c = this._canvasElement = document.createElement('canvas');
				c.width = window.game.canvas.width;
				c.height = window.game.canvas.height;

				c.style.zIndex = '9999';
				c.style.position = 'absolute';
				c.style.top = '0';
				c.style.left = '0';
				c.style.display = 'block';
				c.style.touchAction = 'none';
				c.style.webkitUserSelect = c.style.msUserSelect = 'none';
				c.style.webkitTapHighlightColor = 'rgba(0, 0, 0, 0)';
				c.style.cursor = 'inherit';
				c.style.marginLeft = '0px';
				c.style.marginTop = '0px';

				c.oncontextmenu = function (e) {
					e.preventDefault();
				};

				// Copy events
				if (this._registeredEvent) {
					this._registeredEvent(c);
				}

				c.addEventListener('mousedown', window.game.input.mouse._onMouseDown, !0);
				c.addEventListener('mousemove', window.game.input.mouse._onMouseMove, !0);
				c.addEventListener('mouseup', window.game.input.mouse._onMouseUp, !0);
			}

			if (this._injectElement) {
				$('#game').append(this._canvasElement);

				this._injectElement = false;
			}

			return this._canvasElement.getContext('2d');
		}

		public dispatchEvent(event: MouseEvent) {
			this._canvasElement.dispatchEvent(event);
		}
	}

	class GameWrapperUtil {
		// Constructor
		constructor(protected readonly gameWrapper: GameWrapper) {
		}

		// gameWrapper.util.hasValidSprite(element)
		public hasValidSprite(el: Sprite) {
			let worldBounds = this.gameWrapper.world.getWorkingBounds(),
				img = el.img,
				position = img.position;

			// (!element.img.alive)

			return (position.x > worldBounds.x && position.y > worldBounds.y) && (position.x < worldBounds.width && position.y < worldBounds.height) &&
				(img.visible && (img.alpha > 0) && img.renderable);
		}

		// gameWrapper.util.hasShieldActivated(element)
		public hasShieldActivated(el: Sprite) {
			let img = el.img.escudo2;

			return (img.visible && (img.alpha > 0) && img.renderable);
		}

		public connect() {
			$('#play-btn').click();
		}

		@MethodDecoration.bound
		public delayedConnect() {
			if (!this.isPlaying) {
				this.connect();

				setTimeout(this.delayedConnect, 500);
			}
		}

		get isPlaying(): boolean {
			return (window.mainCar && window.mainCar.img && window.mainCar.img.alive);
		}
	}

	class GameWrapperPlayer {
		private readonly HALP_PI: number = Math.PI / 2;
		private readonly THREE_SQUARES_PI: number = Math.PI * 1.5;

		// Constructor
		constructor(protected readonly gameWrapper: GameWrapper) {
		}

		// window.snake.ehang
		// gameWrapper.player.getRotation([enemy])
		public getRotation(enemy?: Sprite): number {
			let rotation;

			if (undefined == enemy) {
				rotation = window.mainCar.rotation;
			}
			else /*if (enemy instanceof Sprite)*/ {
				rotation = enemy.img.rotation;
			} /*else {
				return;
			}*/

			if (rotation >= (-this.gameWrapper.player.HALP_PI) && rotation < Math.PI) {
				rotation -= this.gameWrapper.player.HALP_PI;
			} else {
				rotation += this.gameWrapper.player.THREE_SQUARES_PI;
			}

			return rotation;
		}

		// window.view_xx
		// window.view_yy
		// gameWrapper.player.getPosition()
		public getPosition(): IPoint2D {
			return window.mainCar.img.position;
		}
	}

	class GameWrapperItems {
		//listOfElements: Array<Array<Sprite>>;
		private listOfElements: IDictionary<Array<Sprite>>;

		private static isItemCacherActive: boolean = false;

		// Constructor
		constructor(protected readonly gameWrapper: GameWrapper) {
			this.reset();
		}

		// TODO : Review this as WebSocket.onMessage refreshes data for each element.
		public reset(): void {
			if (GameWrapperItems.isItemCacherActive) {
				//this.listOfElements = [];
				this.listOfElements = null; // ???
				this.listOfElements = {};
			}
		}

		private ignoreMissilesDictionary: IDictionary<IgnoreItemFlag> = {};
		public ignoreMissilesById(id: number) {
			this.ignoreMissilesDictionary[id] = IgnoreItemFlag.Yes;
		}

		// window.snakes
		// gameWrapper.items.getEnemies()
		public getEnemies(): Array<Car> {
			return this._baseGetItems<Car>('Car', window.sprites, window.Car, true, window.mainCar.id);
		}

		// gameWrapper.items.getMissiles()
		public getMissiles(): Array<Missile> {
			return this._baseGetItems<Missile>('Missile', window.misiles, window.Misil, true, undefined, this.ignoreMissilesDictionary);
		}

		// gameWrapper.items.getTeleMissiles()
		public getTeleMissiles(): Array<TeleMissile> {
			return this._baseGetItems<TeleMissile>('TeleMissile', window.misiles, window.MisilTele, true, undefined, this.ignoreMissilesDictionary);
		}

		// gameWrapper.items.getBombes()
		public getBombs(): Array<Bomb> {
			return this._baseGetItems<Bomb>('Bomb', window.bombas, window.Bomba, false);
		}

		// gameWrapper.items.getMines()
		public getMines(): Array<Mine> {
			return this._baseGetItems<Mine>('Mine', window.minas, window.Mina, false);
		}

		// gameWrapper.items.getWeapons()
		public getWeapons(): Array<Item> {
			return this._baseGetItems<Item>('Item', window.misItems, window.Item, false);
		}

		// window.foods
		// gameWrapper.items.getFood()
		public getFood(): Array<Food> {
			// Example: (ac = coins.filter(function(el){ return el.activa == true; })).length

			let $this = this;

			let worldBounds = this.gameWrapper.world.getWorkingBounds();

			let playerPosition = this.gameWrapper.player.getPosition();

			return window.coins.filter(function (element) {
				let img = element.img;
				let position = img.position;

				element.x = position.x;
				element.y = position.y;

				let isValid = $this.gameWrapper.util.hasValidSprite(element);

				if (isValid) {
					element.distance = Utils.MathUtils.getDistance(position, playerPosition);
				}

				return isValid;
			});
		}

		private _ensureVelocityIsDefined(object: Sprite) {
			let getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor(object, 'x');
			let variableWatched = (typeof getOwnPropertyDescriptor == 'function');

			if (!variableWatched) {
				object.img.position.watch('x', function (id, oldValue, newValue) {
					let element = object;
					let position = element.img.position;

					if (element.velocity == undefined) {
						element.lastPosition = new Structures.Point2D(position.x, position.y);
						element.velocity = new Structures.Point2D(0, 0);
					} else {
						element.velocity.x = (position.x - element.lastPosition.x);
						element.velocity.y = (position.y - element.lastPosition.y);

						element.lastPosition.x = position.x;
						element.lastPosition.y = position.y;

						element.magnitude = Math.sqrt(Math.pow(element.velocity.x, 2) + Math.pow(element.velocity.y, 2));

						//
						// Used for collecting weapon's Magnitude Data
						/*
						//img.texture.crop
						if (object instanceof window.MisilTele) {
							window.log((+new Date()), `ID = ${element.id}; Magnitude = ${element.magnitude}`);
						}
						//*/
						//
					}

					return newValue;
				});
			}
		}

		private _baseGetItems<T extends Sprite>(category: string, items: Object, type: Function, defineVelocityProperty: boolean, skipId?: number, ignoreList?: IDictionary<IgnoreItemFlag>): Array<T> {
			if (GameWrapperItems.isItemCacherActive) {
				if (this.listOfElements[category] != undefined) {
					return (this.listOfElements[category] as Array<T>);
				}
			}

			let results = [], count = 0;
			/*
			let localElements = $.map(items, function (value:T, index) {
				return [value];
			}) as Array<T>;
			*/
			let clonedElements = jQuery.extend(true, {}, items);

			let playerPosition = this.gameWrapper.player.getPosition();

			// READ : http://stackoverflow.com/questions/5072136/javascript-filter-for-objects
			// TODO : Add properties to existing classes.
			/*
			Object.defineProperty(Car.prototype, 'x', {
				get: function () {
					return this.img.position.x;
				},
				enumerable: true,
				configurable: true
			});
			*/
			for (let localSpriteIdx in clonedElements) {
				let element = (clonedElements[localSpriteIdx] as T);

				let doContinue = false;

				let hasValidSprite = this.gameWrapper.util.hasValidSprite(element);

				if (ignoreList) {
					let ignoreElement = ignoreList[localSpriteIdx];

					//if (ignoreElement) {
					if (ignoreElement == IgnoreItemFlag.Yes && hasValidSprite) {
						ignoreList[localSpriteIdx] = IgnoreItemFlag.Delete;

						doContinue = true;
					} else if (ignoreElement == IgnoreItemFlag.Delete) {
						if (hasValidSprite) {
							doContinue = true;
						} else {
							delete (ignoreList[localSpriteIdx]);
						}
					}
					//}
				}

				if (doContinue || !(element instanceof type) || (!hasValidSprite)) {
					delete (clonedElements[localSpriteIdx]);
					continue;
				}

				let x = element.img.position.x,
					y = element.img.position.y;

				element.x = x;
				element.y = y;

				element.distance = Utils.MathUtils.getDistance(element, playerPosition);

				this._ensureVelocityIsDefined(element);

				if (skipId && (element.id == skipId)) {
					delete (clonedElements[localSpriteIdx]);
					continue;
				}

				results[count++] = element;
			}

			if (count > 0) {
				results.sort(Utils.ArrayUtils.sortDistance);
			}

			return results;
		}
	}

	class GameWrapperWorld {
		// Constructor
		constructor(protected readonly gameWrapper: GameWrapper) {
		}

		static offset: number = 1500 + 250;

		public getWorkingBounds(): IRect {
			let worldBounds = window.game.world.bounds;
			let offset = GameWrapperWorld.offset;

			return new Structures.Rect(offset, offset, worldBounds.width - offset, worldBounds.height - offset);
		}

		// gameWrapper.world.getSectorSquaredWidth()
		public getSectorSquaredWidth(): number {
			return 1661;
		}
	}

	/**
	 * Game variables Wrapper.
	 */
	export class GameWrapper implements IGameWrapper {
		/*
			* || marcos
			e instanceof Misil || misiles
			e instanceof MisilTele || misiles
			e instanceof Car || sprites
			e instanceof Bomba || bombas
			e instanceof Mina || minas
			e instanceof Coin || coins
			e instanceof Item || misItems
		*/

		constructor() {
			this.input = {
				mouse: new GameWrapperInputMouse(this),
				canvas: new GameWrapperInputCanvas(this)
			};

			this.util = new GameWrapperUtil(this);
			this.player = new GameWrapperPlayer(this);
			this.items = new GameWrapperItems(this);
			this.world = new GameWrapperWorld(this);
		}

		public input: {
			mouse: GameWrapperInputMouse;
			canvas: GameWrapperInputCanvas;
		};

		public util: GameWrapperUtil;
		public player: GameWrapperPlayer;
		public items: GameWrapperItems;
		public world: GameWrapperWorld;
	}
}
