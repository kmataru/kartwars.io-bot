/// <reference path="CollisionBaseManager.ts" />

namespace DracoolaArt.KartwarsBot.Manager.Collision {
	/**
	 * Default Collision Manager.
	 */
	export class CollisionCourseManager extends CollisionBaseManager {
		public action(): IActivityResult {
			let collisionData: Structures.CollisionDataRespons = this.getCollisionData();

			let checkCollisionActivityResult: IActivityResult = this.checkCollision(collisionData.collisionElements);
			if (checkCollisionActivityResult.isValid) {
				this.bot.stage = BotStageEnum.AvoidCollision;

				return checkCollisionActivityResult;
			}

			let checkEncircleActivityResult: IActivityResult = this.checkEncircle(collisionData.collisionAngles);
			if (checkEncircleActivityResult.isValid) {
				this.bot.stage = BotStageEnum.AvoidEncirclement;

				return checkEncircleActivityResult;
			}

			return Structures.ActivityResult.CreateInvalidResponse();
		}

		/**
		 * Extract collision elements based on the design map.
		 * @param collisionElements
		 * @param designer
		 * @param thisEnemy
		 * @param weaponType
		 * @param dangerType
		 */
		protected pushCollisionElementsFromCircleDesignMap(collisionElements: Array<Structures.CollisionElement>, designer: Design.IDesignCircle, thisEnemy: Sprite, weaponType: CarWeapon, dangerType: CollisionElementDangerType) {
			let scPoint: Structures.CollisionElement;

			let designDetails = designer.DesignDetails,
				thisDesign = designer.getDesign(weaponType);

			if (!thisDesign) {
				return;
			}

			let sRadius = this.bot.opt.basePlayerWidth / 2;

			let enemyXPosition = thisEnemy.x,
				enemyYPosition = thisEnemy.y;

			let enemyRotation = this.gameWrapper.player.getRotation(thisEnemy),
				sin = Math.sin(enemyRotation),
				cos = Math.cos(enemyRotation);

			let baseRadius = sRadius * this.bot.opt.radiusDangerMultiplier;

			for (let idRow = 0; idRow < thisDesign.length; idRow++) {
				let thisRow = thisDesign[idRow];

				let h = idRow - designDetails.heightCenter;

				for (let idColumn = 0; idColumn < thisRow.length; idColumn++) {
					let thisElement = thisRow[idColumn];

					if (thisElement == 0) {
						continue;
					}

					let w = idColumn - designDetails.widthCenter;

					let newRadius = thisElement * baseRadius;
					let wNewRadius = newRadius * Math.abs(w);
					let hNewRadius = newRadius * Math.abs(h);

					/*
						Guidance:
							Left:
								x+ sin
								y- cos
							Right:
								x- sin
								y+ cos
							Front:
								x+ cos
								y+ sin
							Behind:
								x- cos
								y- sin
					*/

					let newX = enemyXPosition;
					let newY = enemyYPosition;

					if (w < 0) {
						// Left
						newX += sin * wNewRadius;
						newY -= cos * wNewRadius;
					} else if (w > 0) {
						// Right
						newX -= sin * wNewRadius;
						newY += cos * wNewRadius;
					}

					if (h < 0) {
						// Front
						newX += cos * hNewRadius;
						newY += sin * hNewRadius;
					} else if (h > 0) {
						// Behind
						newX -= cos * hNewRadius;
						newY -= sin * hNewRadius;
					}

					scPoint = new Structures.CollisionElement(
						newX,
						newY,
						enemyRotation,
						CollisionElementType.Circle,
						dangerType,
						newRadius/*,
						true*/
					);

					//this.bot.setDistance2FromPlayer(scPoint);
					//this.addCollisionAngle(scPoint);
					collisionElements.push(scPoint);

					//if (window.visualDebugging) {
					//	if (this.bot.opt.draw.enemies) {
					//		this.canvas.drawCircle(scPoint, 'red', false, 0.25);
					//	}
					//}

					scPoint = undefined;
				}
			}
		}

		/**
		 * Extract collision elements based on the design map from each enemy.
		 * @param collisionElements
		 */
		protected pushEnemiesCollisionElements(collisionElements: Array<Structures.CollisionElement>) {
			let enemies = this.gameWrapper.items.getEnemies();

			for (let enemyIdx = 0, ls = enemies.length; enemyIdx < ls; enemyIdx++) {
				if (enemies[enemyIdx].id !== window.mainCar.id) {

					let thisEnemy = enemies[enemyIdx];

					// Skip if enemy has no weapon or has a non-lethal one
					if (!thisEnemy.isShieldActivated && (!thisEnemy.weapon || !thisEnemy.weapon.isLethalWeapon)) {
						continue;
					}

					let designer = Design.Circle.WarCarDesigns.Singleton;

					if (thisEnemy.isShieldActivated) {
						this.pushCollisionElementsFromCircleDesignMap(collisionElements, designer, thisEnemy, CarWeapon.Shield, CollisionElementDangerType.Enemy);
					}

					this.pushCollisionElementsFromCircleDesignMap(collisionElements, designer, thisEnemy, thisEnemy.weapon.weaponType, CollisionElementDangerType.Enemy);
				}
			}
		}

		/**
		 * Extract collision elements based on the design map from each element in the collection.
		 * @param collisionElements
		 * @param activatedWeaponsCollection
		 * @param weaponType
		 * @param dangerType
		 */
		protected pushCustomWeaponsCollisionElements(collisionElements: Array<Structures.CollisionElement>, activatedWeaponsCollection: Array<Sprite>, weaponType: CarWeapon, dangerType: CollisionElementDangerType) {
			for (let enemyIdx = 0, ls = activatedWeaponsCollection.length; enemyIdx < ls; enemyIdx++) {
				let thisActivatedWeapon = activatedWeaponsCollection[enemyIdx];

				let designer = Design.Circle.WeaponDesigns.Singleton;

				this.pushCollisionElementsFromCircleDesignMap(collisionElements, designer, thisActivatedWeapon, weaponType, dangerType);
			}
		}

		/**
		 * Extract collision elements based on the design map from each other danger (bombs, mines, rockets).
		 * @param collisionElements
		 */
		protected pushWeaponsCollisionElements(collisionElements: Array<Structures.CollisionElement>) {
			let misiles = this.gameWrapper.items.getMissiles(),
				teleMisiles = this.gameWrapper.items.getTeleMissiles(),
				bombs = this.gameWrapper.items.getBombs(),
				mines = this.gameWrapper.items.getMines();

			this.pushCustomWeaponsCollisionElements(collisionElements, misiles, CarWeapon.FastRocket, CollisionElementDangerType.Misile);
			this.pushCustomWeaponsCollisionElements(collisionElements, teleMisiles, CarWeapon.TeleRocket, CollisionElementDangerType.TeleMisile);
			this.pushCustomWeaponsCollisionElements(collisionElements, bombs, CarWeapon.BigBang, CollisionElementDangerType.Bomb);
			this.pushCustomWeaponsCollisionElements(collisionElements, mines, CarWeapon.Mine, CollisionElementDangerType.Mine);
		}

		/**
		 * Get all collision elements.
		 */
		protected getCollisionData(): Structures.CollisionDataRespons {
			let collisionElements: Array<Structures.CollisionElement> = [];
			let collisionAngles: Array<Structures.CollisionAngle>;

			this.pushWeaponsCollisionElements(collisionElements);
			this.pushEnemiesCollisionElements(collisionElements);

			collisionAngles = this.getCollisionAngles(collisionElements);

			collisionElements.sort(Utils.ArrayUtils.sortDistance2);

			/*
			// WALL
			// TODO : Review
			if (MathUtils.getDistance2(this.MID_X, this.MID_Y, playerPosition.x, playerPosition.y) > Math.pow(this.MAP_R - 1000, 2)) {
				//debugger;
				let midAng = MathUtils.fastAtan2(playerPosition.y - this.MID_X, playerPosition.x - this.MID_Y);
		
				scPoint = {
					x: this.MID_X + this.MAP_R * Math.cos(midAng),
					y: this.MID_Y + this.MAP_R * Math.sin(midAng),
					//snake: -1,
					snake: null,
					radius: this.snakeWidth,
		
					enemies: enemies,
					head: true,
					distance: -Infinity
				};
		
				this.getDistance2FromPlayer(scPoint);
				collisionPoints.push(scPoint);
				this.addCollisionAngle(scPoint);
		
				if (window.visualDebugging) {
					this.canvas.drawCircle(
						new Structures.Circle(
							scPoint.x,
							scPoint.y,
							scPoint.radius
						), 
						'yellow', false
					);
				}
			}
			//*/

			this.canvas.drawCollisionElements(collisionElements, collisionAngles);

			return new Structures.CollisionDataRespons(collisionElements, collisionAngles);
		}

		/**
		 * Get intersection points between the supplied Collision Element and the head detector.
		 * @param thisCollisionElement
		 */
		protected getIntersectionPoints(thisCollisionElement: Structures.CollisionElement): Structures.ShapesIntersectionsResult {
			let pointsIntersection: Structures.ShapesIntersectionsResult;

			let collisionCircle = new Structures.Circle(
				thisCollisionElement.x,
				thisCollisionElement.y,
				thisCollisionElement.radius
			);

			// -1 snake is special case for non kart object.
			pointsIntersection = this.bot.math.circleIntersect(this.bot.shapesHolster.headCircle, collisionCircle);

			return pointsIntersection;
		}

		/**
		 * Checks to see if you are going to collide with anything in the collision detection radius.
		 */
		protected checkCollision(collisionElements: Array<Structures.CollisionElement>): IActivityResult {
			window.botFactory.clock.startFrame();

			let intersectionResult: Structures.ShapesIntersectionsResult;

			if (collisionElements.length === 0) {
				window.botFactory.clock.endFrame();

				return Structures.ActivityResult.CreateInvalidResponse();
			}

			let accelerate: AccelerationFlag = AccelerationFlag.NotDefined;

			let playerRotation = this.gameWrapper.player.getRotation();

			for (let i = 0; i < collisionElements.length; i++) {
				let thisCollisionElement = collisionElements[i];

				intersectionResult = this.getIntersectionPoints(thisCollisionElement);

				if (intersectionResult.status >= ShapesIntersectionStatus.ShapeInside) {
					let intersectionPoint = intersectionResult.points[0];

					if (intersectionPoint) {
						// TODO : Test/Review
						if (thisCollisionElement.dangerType == CollisionElementDangerType.Misile || thisCollisionElement.dangerType == CollisionElementDangerType.TeleMisile) {
							if (Math.sqrt(thisCollisionElement.distance2) <= this.bot.opt.closeToImminentDangerRange) {
								accelerate = AccelerationFlag.Yes;
							}
						}

						if (
							((intersectionResult.status == ShapesIntersectionStatus.HasIntersections) && this.bot.inFrontDangerAngle(intersectionPoint)) ||
							(intersectionResult.status == ShapesIntersectionStatus.ShapeInside)
						) {
							//
							// Case when player is tailed.
							let additionalAvoidanceAngle = 0;

							let angleOffset = Math.abs(playerRotation - thisCollisionElement.ang);
							if (angleOffset < this.opt.tailedDetectorThresholdAngle) {
								additionalAvoidanceAngle = this.opt.tailedDetectorAdditionalAvoidanceAngle;

								accelerate = AccelerationFlag.Yes;
							}
							//

							let activityResult: IActivityResult = this.avoidCollisionPoint(intersectionPoint, this.opt.avoidanceAngle - additionalAvoidanceAngle);

							window.botFactory.clock.endFrame();

							return Structures.ActivityResult.CreateValidResponse(activityResult.goalCoordinates, accelerate);
						}
					}
				}
			}

			window.botFactory.clock.endFrame();

			return Structures.ActivityResult.CreateInvalidResponse();
		}

		/**
		 * Checks to see if you are surrounded by multiple dangerous point.
		 */
		protected checkEncircle(collisionAngles: Array<Structures.CollisionAngle>): IActivityResult {
			window.botFactory.clock.startFrame();

			let encircledKart = [];
			let high = 0;
			//let highSnake;
			let enAll = 0;

			for (let i = 0; i < collisionAngles.length; i++) {
				if (collisionAngles[i] !== undefined) {
					// TODO : Review
					if (CollisionElementDangerType.NotDefined != collisionAngles[i].dangerType) {
						let dangerType = collisionAngles[i].dangerType;

						if (encircledKart[dangerType]) {
							encircledKart[dangerType]++;
						} else {
							encircledKart[dangerType] = 1;
						}
						if (encircledKart[dangerType] > high) {
							high = encircledKart[dangerType];
							//highSnake = dangerType;
						}
					}

					if (collisionAngles[i].distance2 < Math.pow(this.bot.kartRadius * this.bot.opt.enCircleDistanceMult, 2)) {
						enAll++;
					}
				}
			}

			let playerPosition = this.gameWrapper.player.getPosition();

			if (high > this.bot.MAXARC * this.bot.opt.enCircleThreshold) {
				let activityResult: IActivityResult = this.headingBestAngle(collisionAngles);

				//let enemies = this.gameWrapper.items.getEnemies();

				//if (high !== this.MAXARC && enemies[highSnake].sp > 10) {
				//if (high !== this.MAXARC && highSnake.sp > 10) {
				/*
				if (high !== this.bot.MAXARC) {
					this.bot.setAcceleration(1);
				} else {
					this.bot.setAcceleration(this.bot.defaultAccel);
				}
				*/

				// Draw encircled player
				this.canvas.drawEncircledPlayer(this.bot.shapesHolster.playerCircle, true);

				window.botFactory.clock.endFrame();

				return Structures.ActivityResult.Transfer(activityResult, null, null, AccelerationFlag.Yes);
			}

			if (enAll > this.bot.MAXARC * this.bot.opt.enCircleAllThreshold) {
				let activityResult: IActivityResult = this.headingBestAngle(collisionAngles);
				//this.bot.setAcceleration(this.bot.defaultAccel);

				// Draw encircled player
				this.canvas.drawEncircledPlayer(this.bot.shapesHolster.playerCircle, false);

				window.botFactory.clock.endFrame();

				return Structures.ActivityResult.Transfer(activityResult, null, null, AccelerationFlag.Default);
			} else {
				this.canvas.drawPlayer(
					this.bot.shapesHolster.playerCircle,
					this.bot.shapesHolster.playerResourceGatherCircle,
					this.bot.shapesHolster.headCircle,
					this.bot.shapesHolster.tailCircle,

					this.bot.shapesHolster.closeToImminentDangerCircle,

					this.bot.shapesHolster.playerLeftSideCircle,
					this.bot.shapesHolster.playerRightSideCircle,

					this.bot.opt.frontDangerAngle,
					this.bot.opt.tailDangerAngle,
					this.bot.opt.frontResourceGatherAngle
				);
			}

			// TODO : Review
			//this.bot.setAcceleration(this.bot.defaultAccel);

			window.botFactory.clock.endFrame();

			return Structures.ActivityResult.CreateInvalidResponse();
		}
	}
}
