/// <reference path="../../_references.ts" />

namespace DracoolaArt.KartwarsBot.Manager.Collision {
	export class CollisionManagerOptions {
		public avoidanceAngle: number = (Math.PI / 16 * 15);
		public tailedDetectorThresholdAngle: number = (Math.PI / 16);
		public tailedDetectorAdditionalAvoidanceAngle: number = (Math.PI / 16 * 2);
	}

	export abstract class CollisionBaseManager implements ICollision {
		public opt: CollisionManagerOptions;

		constructor(protected readonly bot: Bot, protected readonly gameWrapper: GameWrapper, protected readonly canvas: Utils.CanvasUtils) {
			this.opt = new CollisionManagerOptions();
		}

		abstract action(): IActivityResult;

		protected abstract getCollisionData(): Structures.CollisionDataRespons;

		protected abstract checkCollision(collisionElements: Array<Structures.CollisionElement>): IActivityResult;

		protected abstract checkEncircle(collisionAngles: Array<Structures.CollisionAngle>): IActivityResult;

		// get collision angle index, expects angle +/i 0 to Math.PI
		protected getAngleIndex(angle: number): number {
			let index: number;

			if (angle < 0) {
				angle += 2 * Math.PI;
			}

			index = Math.round(angle * (1 / this.bot.opt.arcSize));

			if (index === this.bot.MAXARC) {
				return 0;
			}

			return index;
		}

		/**
		 * Change heading to the best angle for avoidance.
		 */
		protected headingBestAngle(collisionAngles: Array<Structures.CollisionAngle>): IActivityResult {
			let best;
			let distance;
			let openAngles: Array<Structures.OpenAngle> = [];
			let openStart;

			let sIndex = this.getAngleIndex(this.gameWrapper.player.getRotation()) + this.bot.MAXARC / 2;
			if (sIndex > this.bot.MAXARC) { sIndex -= this.bot.MAXARC; }

			for (let i = 0; i < this.bot.MAXARC; i++) {
				if (collisionAngles[i] === undefined) {
					distance = 0;
					if (openStart === undefined) openStart = i;
				} else {
					distance = collisionAngles[i].distance2;
					if (openStart) {
						openAngles.push({
							openStart: openStart,
							openEnd: i - 1,
							sz: (i - 1) - openStart
						});
						openStart = undefined;
					}
				}

				if (best === undefined ||
					(best.distance < distance && best.distance !== 0)) {
					best = {
						distance: distance,
						aIndex: i
					};
				}
			}

			if (openStart && openAngles[0]) {
				openAngles[0].openStart = openStart;
				openAngles[0].sz = openAngles[0].openEnd - openStart;
				if (openAngles[0].sz < 0) openAngles[0].sz += this.bot.MAXARC;

			} else if (openStart) {
				openAngles.push({ openStart: openStart, openEnd: openStart, sz: 0 });
			}

			if (openAngles.length > 0) {
				openAngles.sort(Utils.ArrayUtils.sortSz);

				return this.bot.changeHeadingAbs((openAngles[0].openEnd - openAngles[0].sz / 2) * this.bot.opt.arcSize);
			} else {
				return this.bot.changeHeadingAbs(best.aIndex * this.bot.opt.arcSize);
			}
		}

		/**
		 * Avoid collision point by ang.
		 * ang radians <= Math.PI (180deg)
		 * @param point
		 * @param ang
		 */
		// TODO : Increase ang value if too low.
		protected avoidCollisionPoint(point: Structures.BotPoint2D, ang?: number): IActivityResult {
			let playerPosition = this.gameWrapper.player.getPosition();

			if (ang === undefined || ang > Math.PI) {
				ang = Math.PI;
			}

			let end: IPoint2D = new Structures.Point2D(
				playerPosition.x + 2000 * this.bot.cos,
				playerPosition.y + 2000 * this.bot.sin
			);

			// Draw collision avoidance
			this.canvas.drawCollisionAvoidance(point, end);

			if (Utils.MathUtils.isLeft(playerPosition, end, point)) {
				return this.bot.changeHeadingAbs(point.ang - ang);
			} else {
				return this.bot.changeHeadingAbs(point.ang + ang);
			}
		}

		/**
		 * Extract Collision Angles.
		 * @param collisionElements
		 */
		protected getCollisionAngles(collisionElements: Array<Structures.CollisionElement>): Array<Structures.CollisionAngle> {
			let collisionAngles: Array<Structures.CollisionAngle> = [];

			let playerPosition = this.gameWrapper.player.getPosition();

			for (let idx = 0, ll = collisionElements.length; idx < ll; idx++) {
				let collisionElement = collisionElements[idx];

				// Ensures the distance is set
				this.bot.setDistance2FromPlayer(collisionElement);

				let ang = Utils.MathUtils.fastAtan2(
					Math.round(collisionElement.y - playerPosition.y),
					Math.round(collisionElement.x - playerPosition.x)
				);

				let aIndex = this.getAngleIndex(ang);

				let actualDistance = Math.round(
					Math.pow(
						Math.sqrt(collisionElement.distance2) - collisionElement.radius, 2
					)
				);
				
				// Add to collisionAngles if distance is closer
				if (collisionAngles[aIndex] === undefined || collisionAngles[aIndex].distance2 > collisionElement.distance2) {
					collisionAngles[aIndex] = new Structures.CollisionAngle(
						Math.round(collisionElement.x),
						Math.round(collisionElement.y),
						ang,
						collisionElement.dangerType,
						actualDistance,
						collisionElement.radius,
						aIndex
					);
				}
			}

			return collisionAngles;
		}
	}
}
