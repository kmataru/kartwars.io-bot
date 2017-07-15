/// <reference path="../../_references.ts" />

namespace DracoolaArt.KartwarsBot.Manager.Collision {
	/**
	 * Enhanced Collision Manager with polygon detectors.
	 */
	export class AdvancedCollisionCourseManager extends CollisionCourseManager {
		/**
		 * Extract collision elements based on the design map.
		 * @param collisionElements
		 * @param designer
		 * @param thisEnemy
		 * @param weaponType
		 * @param dangerType
		 */
		protected pushCollisionElementsFromPolygonDesignMap(collisionElements: Array<Structures.CollisionElement>, designer: Design.IDesignPolygon, thisEnemy: Sprite, weaponType: CarWeapon, dangerType: CollisionElementDangerType) {
			let scPoint: Structures.CollisionElement;

			let thisDesign = designer.getDesign(weaponType);

			if (!thisDesign) {
				return;
			}

			let enemyXPosition = thisEnemy.x,
				enemyYPosition = thisEnemy.y;

			let enemyVector = new Victor(enemyXPosition, enemyYPosition);

			let enemyRotation = this.gameWrapper.player.getRotation(thisEnemy),
				sin = Math.sin(enemyRotation),
				cos = Math.cos(enemyRotation);

			let scaling = this.bot.kartRadius * this.bot.opt.radiusDangerMultiplier;

			let thisDesignCopy = Array(thisDesign.length);
			for (let idx = 0; idx < thisDesignCopy.length; idx++) {
				let thisPoint = (thisDesignCopy[idx] = thisDesign[idx].clone());

				thisPoint
					.rotate(enemyRotation)
					.multiplyScalar(scaling)
					.add(enemyVector);
			}

			scPoint = new Structures.CollisionElement(
				enemyXPosition,
				enemyYPosition,
				enemyRotation,
				CollisionElementType.Polygon,
				dangerType,
				scaling/*,
				true*/
			);

			scPoint.geometry = thisDesignCopy;

			//this.bot.setDistance2FromPlayer(scPoint);
			//this.addCollisionAngle(scPoint);
			collisionElements.push(scPoint);

			scPoint = undefined;
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

					let designer = Design.Polygon.WarCarDesigns.Singleton;

					if (thisEnemy.isShieldActivated) {
						this.pushCollisionElementsFromPolygonDesignMap(collisionElements, designer, thisEnemy, CarWeapon.Shield, CollisionElementDangerType.Enemy);
					}

					this.pushCollisionElementsFromPolygonDesignMap(collisionElements, designer, thisEnemy, thisEnemy.weapon.weaponType, CollisionElementDangerType.Enemy);
				}
			}
		}

		/**
		 * Get all collision elements.
		 */
		protected getCollisionData(): Structures.CollisionDataRespons {
			let collisionElements: Array<Structures.CollisionElement> = [];
			let collisionAngles: Array<Structures.CollisionAngle>;

			super.pushWeaponsCollisionElements(collisionElements);
			this.pushEnemiesCollisionElements(collisionElements);

			collisionAngles = this.getCollisionAngles(collisionElements);

			collisionElements.sort(Utils.ArrayUtils.sortDistance2);

			this.canvas.drawCollisionElements(collisionElements, collisionAngles);

			return new Structures.CollisionDataRespons(collisionElements, collisionAngles);
		}

		/**
		 * Get intersection points betwwen the supplied Collision Element and the head detector.
		 * @param thisCollisionElement
		 */
		protected getIntersectionPoints(thisCollisionElement: Structures.CollisionElement): Structures.ShapesIntersectionsResult {
			let pointsIntersection: Structures.ShapesIntersectionsResult;

			switch (thisCollisionElement.shapeType) {
				case CollisionElementType.Circle: {
					let collisionCircle = new Structures.Circle(
						thisCollisionElement.x,
						thisCollisionElement.y,
						thisCollisionElement.radius
					);
					
					pointsIntersection = this.bot.math.circleIntersect(this.bot.shapesHolster.headCircle, collisionCircle);
				} break;

				case CollisionElementType.Polygon: {
					let collisionPolygon = new Structures.Polygon(
						thisCollisionElement.x,
						thisCollisionElement.y,
						thisCollisionElement.geometry
					);

					pointsIntersection = this.bot.math.circlePolygonIntersect(this.bot.shapesHolster.headCircle, collisionPolygon);
				} break;

				default: {
					throw new Error(`Invalid CollisionElementType: '${thisCollisionElement.shapeType}'`);
				}
			}

			return pointsIntersection;
		}
	}
}
