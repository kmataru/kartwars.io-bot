/// <reference path="_references.ts" />

namespace DracoolaArt.KartwarsBot {
	interface BotShapesHolster {
		playerResourceGatherCircle: ICircle;
		playerCircle: ICircle;
		headCircle: ICircle;
		tailCircle: ICircle;

		closeToImminentDangerCircle: ICircle;

		playerLeftSideCircle: ICircle;
		playerRightSideCircle: ICircle;

		tunnelLeftSideLine: ILine;
		tunnelRightSideLine: ILine;
	}

	class BotMathWrapper {
		// Constructor
		constructor(protected readonly gameWrapper: GameWrapper, protected readonly canvas: Utils.CanvasUtils) {
		}

		/**
		 * Checks if two circles intersects.
		 * @param circle1
		 * @param circle2
		 */
		public circleIntersect(circle1: ICircle, circle2: ICircle): Structures.ShapesIntersectionsResult {
			let intersections = Utils.GeometryIntersectionsUtils.circleCircleIntersect(circle1, circle2);

			if (intersections.status == ShapesIntersectionStatus.ShapeInside) {
				intersections.addPoint(new Structures.BotPoint2D(circle2.x, circle2.y));
			} else if (intersections.status != ShapesIntersectionStatus.HasIntersections) {
				return intersections;
			}

			let playerPosition = this.gameWrapper.player.getPosition();

			for (let intersectionIdx = 0, ls = (intersections as Structures.ShapesIntersectionsResult).length; intersectionIdx < ls; intersectionIdx++) {
				let point = (intersections as Structures.ShapesIntersectionsResult).points[intersectionIdx];

				point.ang = Utils.MathUtils.fastAtan2(
					point.y - playerPosition.y,
					point.x - playerPosition.x
				);

				// Draw collision point
				this.canvas.drawCollisionPoint(point);
			}

			// Draw collision circle
			this.canvas.drawCollisionCircle(circle2);

			return intersections;
		}

		/**
		 * Checks if the circle and the polygon intersects.
		 * @param circle
		 * @param polygon
		 */
		public circlePolygonIntersect(circle: ICircle, polygon: IPolygon): Structures.ShapesIntersectionsResult {
			let intersections: Structures.ShapesIntersectionsResult = Utils.GeometryIntersectionsUtils.intersectCirclePolygon(
				circle,
				circle.radius,
				polygon
			);

			if (intersections.status == ShapesIntersectionStatus.ShapeInside) {
				intersections.addPoint(new Structures.BotPoint2D(polygon.x, polygon.y));
			} else if (intersections.status != ShapesIntersectionStatus.HasIntersections) {
				return intersections;
			}

			let playerPosition = this.gameWrapper.player.getPosition();

			for (let intersectionIdx = 0, ls = (intersections as Structures.ShapesIntersectionsResult).length; intersectionIdx < ls; intersectionIdx++) {
				let point = (intersections as Structures.ShapesIntersectionsResult).points[intersectionIdx];

				point.ang = Utils.MathUtils.fastAtan2(
					point.y - playerPosition.y,
					point.x - playerPosition.x
				);

				// Draw collision point
				this.canvas.drawCollisionPoint(point);
			}

			// Draw collision circle
			this.canvas.drawCollisionPolygon(polygon);

			return intersections;
		}


		/*
		@MethodDecoration.bound
		public rectIntersect(circle1: Circle, rect: Rect): ShapesIntersection {
			// var intersections = GeometryUtils.circleRectIntersect(circle1, rect);
			var intersections = GeometryUtils.circleRectIntersect_new2(circle1, rect);
			if (intersections) {
				var data = new ShapesIntersection(ShapesIntersectionStatus.ShapeInside);
				data.addPoint(new BotPoint2D(rect.x, rect.y));

				if (window.visualDebugging) {
					this.canvas.drawRect(rect, rect.rotation, '#ff9900', false);
				}
			}

			return new ShapesIntersection(ShapesIntersectionStatus.NoIntersection);
		}
		*/
	}

	export abstract class BotBase implements IPlayerDeath {
		public isBotRunning: boolean = false;
		public isBotEnabled: boolean = true;
		public stage: BotStageEnum = BotStageEnum.NotStarted;
		public scores: Array<any> = [];
		public defaultAccel: number = 0;
		protected sectorBoxSide: number = 0;
		protected sectorBox: IRect;

		public shapesHolster: BotShapesHolster = {
			closeToImminentDangerCircle: null,
			headCircle: null,
			playerCircle: null,
			playerLeftSideCircle: null,
			playerResourceGatherCircle: null,
			playerRightSideCircle: null,
			tailCircle: null,
			tunnelLeftSideLine: null,
			tunnelRightSideLine: null,
		};

		public get kartWidth(): number { return this.opt.basePlayerWidth; }
		public get kartRadius(): number { return this.kartWidth / 2; }
		// TODO : Review
		public speedMult: number = 25 / 5.78;

		//
		// TODO : Review
		public isTopHidden: boolean;
		//

		public cos: number;
		public sin: number;

		public readonly worldCenterX: number;
		public readonly worldCenterY: number;
		// affects enclosed detection
		public get MAXARC(): number { return (2 * Math.PI) / this.opt.arcSize; }

		public opt: BotOptions;
		public math: BotMathWrapper;
		public goal: Structures.GoalData;

		// Constructor
		constructor(protected readonly gameWrapper: GameWrapper, protected readonly canvas: Utils.CanvasUtils) {
			let worldBounds = this.gameWrapper.world.getWorkingBounds();

			this.worldCenterX = (worldBounds.width / 2);
			this.worldCenterY = (worldBounds.height / 2);

			this.opt = new BotOptions();
			this.math = new BotMathWrapper(gameWrapper, canvas);
			this.goal = new Structures.GoalData();
		}

		/**
		 * Set Acceleration.
		 * @param flag
		 */
		@MethodDecoration.bound
		public setAcceleration(flag: AccelerationFlag) {
			if (flag == AccelerationFlag.Yes) {
				if (!window.mainCar.isAccelerating) {
					window.mainCar.isAccelerating = true;

					if (window.botFactory.developerInterface.opt.individual.acceleration) {
						window.log('Speed up!!');
					}

					let e = new MouseEvent('mousedown', {
						altKey: false,
						bubbles: true,
						button: 2,
						buttons: 2,
						cancelable: true,
						ctrlKey: false,
						shiftKey: false,
					});

					this.gameWrapper.input.canvas.dispatchEvent(e);
				}
			} else {
				if (window.mainCar.isAccelerating) {
					window.mainCar.isAccelerating = false;

					if (window.botFactory.developerInterface.opt.individual.acceleration) {
						window.log('Stop speeding up!!');
					}

					let e = new MouseEvent('mouseup', {
						altKey: false,
						bubbles: true,
						button: 2,
						buttons: 2,
						cancelable: true,
						ctrlKey: false,
						shiftKey: false,
					});

					this.gameWrapper.input.canvas.dispatchEvent(e);
				}
			}
		}

		/**
		 * Fires weapon. (Obsolete)
		 */
		@MethodDecoration.bound
		public fireWeapon() {
			if (window.mainCar.weapon) {
				let thisWeapon = window.mainCar.weapon;

				if (thisWeapon.weaponType != CarWeapon.None) {
					if (!thisWeapon.weaponFired) {
						thisWeapon.weaponFired = true;

						// window.log('Fire weapon!!');

						let e = new MouseEvent('mousedown', {
							altKey: false,
							bubbles: true,
							button: 1,
							buttons: 1,
							cancelable: true,
							ctrlKey: false,
							shiftKey: false,
						});

						this.gameWrapper.input.canvas.dispatchEvent(e);
					}
				} else {
					if (thisWeapon.weaponFired == true) {
						thisWeapon.weaponFired = false;

						// window.log('Stop firing weapon!!');

						let e = new MouseEvent('mouseup', {
							altKey: false,
							bubbles: true,
							button: 1,
							buttons: 1,
							cancelable: true,
							ctrlKey: false,
							shiftKey: false,
						});

						this.gameWrapper.input.canvas.dispatchEvent(e);
					}
				}
			}
		}

		/**
		 * Fires weapon once. (Experimental)
		 */
		@MethodDecoration.bound
		public fireWeaponTick() {
			if (window.mainCar.weapon) {
				let thisWeapon = window.mainCar.weapon;

				if (thisWeapon.weaponType != CarWeapon.None) {
					// window.log('Fire weapon!!');

					let mouseDownEvent = new MouseEvent('mousedown', {
						altKey: false,
						bubbles: true,
						button: 1,
						buttons: 1,
						cancelable: true,
						ctrlKey: false,
						shiftKey: false,
					});

					this.gameWrapper.input.canvas.dispatchEvent(mouseDownEvent);

					// window.log('Stop firing weapon!!');

					let mouseUpEvent = new MouseEvent('mouseup', {
						altKey: false,
						bubbles: true,
						button: 1,
						buttons: 1,
						cancelable: true,
						ctrlKey: false,
						shiftKey: false,
					});

					this.gameWrapper.input.canvas.dispatchEvent(mouseUpEvent);

					thisWeapon.weaponFired = true;
				}
			}
		}

		/**
		 * On Player Death's event.
		 */
		public onPlayerDeath() {
			this.stage = BotStageEnum.NotStarted;
		}

		/**
		 * Change heading to angle.
		 * @param angle
		 */
		@MethodDecoration.bound
		public changeHeadingAbs(angle: number): IActivityResult {
			let playerPosition = this.gameWrapper.player.getPosition();

			let goalCoordinates = new Structures.Point2D(
				/*Math.round(*/playerPosition.x + (Math.cos(angle) * (this.shapesHolster.headCircle.radius))/*)*/,
				/*Math.round(*/playerPosition.y + (Math.sin(angle) * (this.shapesHolster.headCircle.radius))/*)*/
			);

			return Structures.ActivityResult.CreateValidResponse(goalCoordinates);
		}

		/**
		 * Set distance2 from player.
		 * @param collisionElement
		 */
		@MethodDecoration.bound
		public setDistance2FromPlayer(collisionElement: Structures.CollisionElement) {
			let playerPosition = this.gameWrapper.player.getPosition();

			collisionElement.distance2 = Utils.MathUtils.getDistance2(
				playerPosition, collisionElement,
			);

			return collisionElement;
		}

		/**
		 * Checks if the given point is in the specified angle based on player's position and rotation.
		 * @param point
		 * @param radiusCheck
		 */
		@MethodDecoration.bound
		public inFrontAngle(point: IPoint2D, angle: number, radiusCheck: number) {
			let playerPosition = this.gameWrapper.player.getPosition();
			let playerRotation = this.gameWrapper.player.getRotation();

			return Utils.GeometryIntersectionsUtils.isInsideArcSector(
				//new Point2D(point.x, point.y),
				point,
				//new Point2D(playerPosition.x, playerPosition.y),
				playerPosition,
				radiusCheck,
				playerRotation - (angle / 2),
				playerRotation + (angle / 2)
			);
		}

		@MethodDecoration.bound
		public inBackAngle(point: IPoint2D, angle: number, radiusCheck: number) {
			let playerPosition = this.gameWrapper.player.getPosition();
			let playerRotation = this.gameWrapper.player.getRotation();

			return Utils.GeometryIntersectionsUtils.isInsideArcSector(
				//new Point2D(point.x, point.y),
				point,
				//new Point2D(playerPosition.x, playerPosition.y),
				playerPosition,
				radiusCheck,
				playerRotation + Math.PI - (angle / 2),
				playerRotation + Math.PI + (angle / 2)
			);
		}

		/**
		 * Checks if the given point is in frontResourceGatherAngle based on player's position and rotation.
		 * @param point
		 * @param radiusCheck
		 */
		@MethodDecoration.bound
		public inFrontResourceGatherAngle(point: IPoint2D, radiusCheck?: number) {
			if (radiusCheck == undefined) {
				radiusCheck = this.shapesHolster.playerResourceGatherCircle.radius;
			}

			return this.inFrontAngle(point, this.opt.frontResourceGatherAngle, radiusCheck);
		}

		/**
		 * Checks if the given point is in frontDangerAngle based on player's position and rotation.
		 * @param point
		 * @param radiusCheck
		 */
		@MethodDecoration.bound
		public inFrontDangerAngle(point: IPoint2D, radiusCheck?: number) {
			if (radiusCheck == undefined) {
				radiusCheck = this.shapesHolster.playerCircle.radius;
			}

			return this.inFrontAngle(point, this.opt.frontDangerAngle, radiusCheck);
		}

		/**
		 * Checks if the given point is in tailDangerAngle based on player's position and rotation.
		 * @param point
		 * @param radiusCheck
		 */
		@MethodDecoration.bound
		public inTailDangerAngle(point: IPoint2D, radiusCheck?: number) {
			if (radiusCheck == undefined) {
				radiusCheck = this.shapesHolster.playerCircle.radius;
			}

			return this.inFrontAngle(point, this.opt.tailDangerAngle, radiusCheck);
		}

		@MethodDecoration.bound
		public inFront(point: IPoint2D) {
			return this.inFrontAngle(point, Math.PI, Infinity);
		}

		@MethodDecoration.bound
		public inBack(point: IPoint2D) {
			return this.inBackAngle(point, Math.PI, Infinity);
		}

		/**
		 * Checks if player is alive and bot is enabled.
		 */
		@MethodDecoration.bound
		public isBotInGame(): boolean {
			return (this.gameWrapper.util.isPlaying) && (this.isBotEnabled);
		}
	}
}
