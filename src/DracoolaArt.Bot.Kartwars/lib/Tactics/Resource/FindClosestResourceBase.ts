namespace DracoolaArt.KartwarsBot.Tactics.Resource {
	/**
	 * Base Find Closest Resource Tactic.
	 */
	export abstract class FindClosestResourceBase<T extends Sprite> implements ITactic, IResourceBase<T> {
		private currentTarget: Structures.Bot2Point2D = undefined;
		
		// Constructor
		constructor(protected readonly bot: Bot, protected readonly gameWrapper: GameWrapper, protected readonly canvas: Utils.CanvasUtils) {
		}

		public noop(): void {
			this.currentTarget = undefined;
		}

		public action(resources?: Array<T>): IActivityResult {
			if (!this.stabilizeResource(resources)) {
				for (let i = 0, ll = resources.length, thisResource = null; i < ll && (thisResource = resources[i]) !== null; i++) {
					if (!this.canBeCollected(thisResource)) {
						thisResource.distance = Infinity;
					}
				}

				// Sort by distance
				resources.sort(Utils.ArrayUtils.sortDistance);

				//
				// Select first available resource
				let firstResource: T = null;
				if (typeof (firstResource = resources[0]) !== 'undefined') {
					this.currentTarget = new Structures.Bot2Point2D(
						firstResource.x,
						firstResource.y,
						50,
						0.1, // ??
						0,
						0,

						firstResource.id
					);
				} else {
					this.currentTarget = new Structures.Bot2Point2D(
						this.bot.worldCenterX, this.bot.worldCenterY, 0, 0, 0, 0, undefined
					);
				}
			}

			return Structures.ActivityResult.CreateValidResponse(this.currentTarget);
		}

		/**
		 * Determines if the resource is easy accessible and does require too many turns and misses.
		 * @param thisResource
		 */
		protected canBeCollected(thisResource: T): boolean {
			let thisResourceCircle = new Structures.Circle(thisResource.x, thisResource.y, 2);

			if (!this.bot.inFrontResourceGatherAngle(thisResourceCircle)) {
				return false;
			}

			let leftSideCircleIntersection = this.bot.math.circleIntersect(thisResourceCircle, this.bot.shapesHolster.playerLeftSideCircle);
			if (leftSideCircleIntersection.status >= ShapesIntersectionStatus.ShapeInside) {
				return false;
			}

			let rightSideCircleIntersection = this.bot.math.circleIntersect(thisResourceCircle, this.bot.shapesHolster.playerRightSideCircle);
			if (rightSideCircleIntersection.status >= ShapesIntersectionStatus.ShapeInside) {
				return false;
			}

			return true;
		}

		/**
		 * Decides if last chosen resource still exists and is collectable so there won't created a chaotic decision every time.
		 * @param resources
		 * @return true if resource is still valid, false otherwise.
		 */
		protected stabilizeResource(resources: Array<T>): boolean {
			//if (this.currentResource != undefined && this.bot.inFrontAngle(this.currentResource)) {
			if (this.currentTarget != undefined) {
				let resourceId = this.currentTarget.resourceId;

				if (resourceId != undefined) {
					for (let idx = 0, ll = resources.length, thisResource = null; idx < ll && (thisResource = resources[idx]) !== null; idx++) {
						if (thisResource.id == resourceId) {
							return this.canBeCollected(thisResource);
						}
					}
				}
			}

			return false;
		}

		/**
		 * Draw close resources based on the `canBeCollected` method.
		 * @param resources
		 * @param baseRadius
		 */
		protected drawResources(resources: Array<T>, baseRadius: number) {
			if (this.canvas.opt.visualDebugging && this.canvas.opt.draw.player) {
				let playerResourceGatherRadius = this.bot.shapesHolster.playerResourceGatherCircle.radius;

				for (let i = 0, ll = resources.length, thisResource = null; i < ll && (thisResource = resources[i]) !== null; i++) {
					if (thisResource.distance <= playerResourceGatherRadius) {
						let canBeCollected = this.canBeCollected(thisResource);

						this.canvas.drawResource(
							new Structures.Circle(
								thisResource.x,
								thisResource.y,
								baseRadius
							),
							canBeCollected
						);
					} else {
						break;
					}
				}
			}
		}
	}
}
