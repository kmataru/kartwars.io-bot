namespace DracoolaArt.KartwarsBot.Utils {
	/**
	 * Canvas draw for Composed objects.
	 */
	export class CanvasUtils extends CanvasUtilsBase implements ICanvasUtils {
		private static interceptedWrappedDrawCalls: Array<Function> = [];

		private static wrappedDrawInterceptor(fx: () => void) {
			CanvasUtils.interceptedWrappedDrawCalls.push(fx);
		}

		/**
		 * Calls all below intercepted drawing methods.
		 */
		public drawAllInterceptedWrappedCalls() {
			window.botFactory.clock.startFrame();
			
			if (this.opt.visualDebugging) {
				CanvasUtils.interceptedWrappedDrawCalls.forEach(function (fx) {
					fx();
				});
			}

			CanvasUtils.interceptedWrappedDrawCalls = [];

			window.botFactory.clock.endFrame();
		}

		/**
		 * Draw global goal on canvas on the canvas.
		 * @param goalCoordinates
		 */
		@MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
		public drawGoal(goalCoordinates: IPoint2D) {
			let playerPosition = this.gameWrapper.player.getPosition();

			this.drawLine(
				playerPosition,
				goalCoordinates,
				this.opt.colors.goalLine,
				2
			);

			this.drawCircle(goalCoordinates, this.opt.colors.goalDot, true);

			this.drawCross(goalCoordinates, this.opt.colors.goalCross, undefined, 0.05);
		}

		/**
		 * Draw collision point on the canvas.
		 * @param collisionPoint
		 */
		@MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
		public drawCollisionPoint(collisionPoint: IPoint2D) {
			this.drawCircle(collisionPoint, this.opt.colors.collidedPoint, true);
		}

		/**
		 * Draw collision circle on the canvas.
		 * @param collisionCircle
		 */
		@MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
		public drawCollisionCircle(collisionCircle: ICircle) {
			this.drawCircle(collisionCircle, this.opt.colors.collidedElement, false);
		}

		@MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
		public drawCollisionPolygon(polygon: IPolygon) {
			this.drawPolygon(polygon.geometryAsPoint2DArray, this.opt.colors.collidedElement, undefined, false);
		}

		/**
		 * Draw collision avoidance lines on the canvas.
		 * @param collisionPoint
		 * @param avoidancePoint
		 */
		@MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
		public drawCollisionAvoidance(collisionPoint: IPoint2D, avoidancePoint: IPoint2D) {
			let playerPosition = this.gameWrapper.player.getPosition();

			this.drawLine(playerPosition, avoidancePoint, this.opt.colors.collisionAvoidancePointA, 5);
			this.drawLine(playerPosition, collisionPoint, this.opt.colors.collisionAvoidancePointB, 5);
		}

		/**
		 * Draw food cluster on the canvas.
		 * @param circle
		 * @param quantity
		 */
		@MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
		public drawFoodCluster(circle: ICircle, quantity: number) {
			let playerPosition = this.gameWrapper.player.getPosition();

			this.drawCircle(circle, this.opt.colors.foodCluster, false, 0.5);
			this.drawText(circle, quantity.toString(), this.opt.colors.foodClusterText);
			this.drawLine(playerPosition, circle, this.opt.colors.foodClusterLine, 2, 0.25);

			/*
			let bigCircle: Circle = {
				x: clusterMedianX,
				y: clusterMedianY,
				radius: clusterRadius * Cluster.radiusMultiplier
			};

			this.drawCircle(bigCircle, 'white', false, 0.25);
			*/
		}

		/**
		 * Draw food cluster boundary on the canvas.
		 * @param radius
		 */
		@MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
		public drawFoodClusterBoundary(radius: number) {
			let playerPosition = this.gameWrapper.player.getPosition();

			let foodClusterBoundaryCircle: ICircle = new Structures.Circle(
				playerPosition.x,
				playerPosition.y,
				radius
			);

			this.drawCircle(foodClusterBoundaryCircle, this.opt.colors.foodClusterBoundary, false);
		}

		/**
		 * Draw resource on the canvas.
		 * @param resourceCircle
		 * @param canBeCollected
		 */
		@MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
		public drawResource(resourceCircle: ICircle, canBeCollected: boolean) {
			if (!this.opt.draw.food) {
				return;
			}

			this.drawCircle(resourceCircle, this.opt.colors.inRangeResource);

			if (canBeCollected) {
				let canBeCollectedResourceCircle = new Structures.Circle(
					resourceCircle.x,
					resourceCircle.y,
					resourceCircle.radius + 15
				);

				this.drawCircle(canBeCollectedResourceCircle, this.opt.colors.collectableResource);
			}
		}

		// TODO : Review
		@MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
		public drawTunnel(left: ILine, right: ILine, alpha?: number) {
			if (alpha == undefined) {
				alpha = 0.15;
			}

			this.drawLine(left.point1, left.point2, 'black', 3, alpha);
			this.drawLine(right.point1, right.point2, 'black', 3, alpha);
		}

		/**
		 * Draw intersection prediction on the canvas.
		 * @param goalCoordinates
		 */
		@MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
		public drawIntersectionPrediction(goalCoordinates: IPoint2D) {
			let playerPosition = this.gameWrapper.player.getPosition();

			this.drawLine(playerPosition, goalCoordinates, this.opt.colors.predictionLine, 12, 0.75);
			this.drawCircle(goalCoordinates, this.opt.colors.predictionCircle, false, 0.75);
		}

		/**
		 * Draw encircled player on the canvas.
		 * @param playerCircle
		 * @param danger
		 */
		@MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
		public drawEncircledPlayer(playerCircle: ICircle, danger: boolean) {
			let color: string = (danger ? this.opt.colors.encircledPlayerDanger : this.opt.colors.encircledPlayerWarning);

			this.drawCircle(playerCircle, color, true, 0.2);
		}

		/**
		 * Draw collision elements and draw lines to collision angles on the canvas.
		 * @param collisionElements
		 * @param collisionAngles
		 */
		@MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
		public drawCollisionElements(collisionElements: Array<Structures.CollisionElement>, collisionAngles: Array<Structures.CollisionAngle>) {
			if (!this.opt.draw.dangers) {
				return;
			}

			//if (this.bot.opt.draw.enemies) {
			let playerPosition = this.gameWrapper.player.getPosition();

			for (let idx = 0, ll = collisionElements.length; idx < ll; idx++) {
				let thisCollisionPoint = collisionElements[idx];

				if (thisCollisionPoint !== undefined) {
					switch (thisCollisionPoint.shapeType) {
						case CollisionElementType.Circle: {
							this.drawCircle(thisCollisionPoint, this.opt.colors.collisionElement, false, 0.25);
						} break;

						case CollisionElementType.Polygon: {
							let points = thisCollisionPoint.geometry.map(function (element) {
								return new Structures.Point2D(element.x, element.y);
							});

							this.drawPolygon(points, this.opt.colors.collisionElement, undefined, true, 0.1);
						} break;
					}
				}
			}

			for (let idx = 0, ll = collisionAngles.length; idx < ll; idx++) {
				let thisCollisionAngles = collisionAngles[idx];

				if (thisCollisionAngles !== undefined) {
					this.drawLine(
						playerPosition,
						new Structures.Point2D(thisCollisionAngles.x, thisCollisionAngles.y),
						this.opt.colors.collisionLine, 2, 0.25
					);
				}
			}
			//}
		}

		/**
		 * Draw player on the canvas.
		 * @param playerCircle
		 * @param playerResourceGatherCircle
		 * @param headCircle
		 * @param tailCircle
		 * @param leftSideCircle
		 * @param rightSideCircle
		 * @param emptyDangerRadian
		 */
		@MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
		public drawPlayer(
			playerCircle: ICircle, playerResourceGatherCircle: ICircle, headCircle: ICircle, tailCircle: ICircle,
			closeToImminentDangerCircle: ICircle,
			leftSideCircle: ICircle, rightSideCircle: ICircle,
			emptyDangerRadian: number, emptyTailDangerRadian: number, emptyResourceGatherRadian: number
			) {
			if (!this.opt.draw.player) {
				return;
			}

			let playerRotation = this.gameWrapper.player.getRotation();

			//
			// Draw Close To Imminent Danger Circle
			{
				this.drawCircle(closeToImminentDangerCircle, this.opt.colors.closeToImminentDangerRadius, false, 0.35);
			}

			//
			// Draw Resource Gather Arc
			{
				this.drawArc(
					playerResourceGatherCircle,
					playerRotation,
					emptyResourceGatherRadian,
					this.opt.colors.frontResourceGatherArc,
					undefined,
					undefined,
					false
				);
			}

			//
			// Draw front Resource Gather lines
			{
				let pointA = MathUtils.arcPoint(
					playerResourceGatherCircle.x,
					playerResourceGatherCircle.y,
					playerResourceGatherCircle.radius,
					playerRotation - (emptyResourceGatherRadian / 2)
				);

				let pointB = MathUtils.arcPoint(
					playerResourceGatherCircle.x,
					playerResourceGatherCircle.y,
					playerResourceGatherCircle.radius,
					playerRotation + (emptyResourceGatherRadian / 2)
				);

				this.drawLine(new Structures.Point2D(
					playerResourceGatherCircle.x,
					playerResourceGatherCircle.y
				), pointA, this.opt.colors.frontResourceGatherArc);

				this.drawLine(new Structures.Point2D(
					playerResourceGatherCircle.x,
					playerResourceGatherCircle.y
				), pointB, this.opt.colors.frontResourceGatherArc);
			}

			{
				this.drawCircle(headCircle, this.opt.colors.playerHeadDetector, false);
				this.drawCircle(tailCircle, this.opt.colors.playerTailDetector, false);

				this.drawCircle(leftSideCircle, this.opt.colors.playerSideDetector, false);
				this.drawCircle(rightSideCircle, this.opt.colors.playerSideDetector, false);
			}

			{
				this.drawArc(
					playerCircle,
					playerRotation,
					emptyDangerRadian,
					this.opt.colors.playerRadius
				);

				this.drawArc(
					playerCircle,
					playerRotation,
					emptyDangerRadian,
					this.opt.colors.frontDangerArc,
					true,
					0.1,
					false
				);
			}

			//
			// Experimental
			/*
			this.drawRect(new Structures.Rect(
				playerCircle.x, // - (circle.radius / 2),
				playerCircle.y, // - (circle.radius / 2),
				playerCircle.radius,
				playerCircle.radius),
				playerRotation,
				'pink', false, 0.25
			);
			*/

			//
			// Draw front lines
			{
				let pointA = MathUtils.arcPoint(
					playerCircle.x,
					playerCircle.y,
					playerCircle.radius,
					playerRotation - (emptyDangerRadian / 2)
				);

				let pointB = MathUtils.arcPoint(
					playerCircle.x,
					playerCircle.y,
					playerCircle.radius,
					playerRotation + (emptyDangerRadian / 2)
				);

				this.drawTriangle(
					pointA, playerCircle, pointB,
					this.opt.colors.frontDangerArc, undefined, true, 0.1
				);

				this.drawLine(new Structures.Point2D(
					playerCircle.x,
					playerCircle.y
				), pointA, this.opt.colors.playerRadius);

				this.drawLine(new Structures.Point2D(
					playerCircle.x,
					playerCircle.y
				), pointB, this.opt.colors.playerRadius);
			}

			//
			// Draw tail lines
			{
				let pointA = MathUtils.arcPoint(
					playerCircle.x,
					playerCircle.y,
					playerCircle.radius,
					playerRotation + Math.PI - (emptyTailDangerRadian / 2)
				);

				let pointB = MathUtils.arcPoint(
					playerCircle.x,
					playerCircle.y,
					playerCircle.radius,
					playerRotation + Math.PI + (emptyTailDangerRadian / 2)
				);

				this.drawLine(new Structures.Point2D(
					playerCircle.x,
					playerCircle.y
				), pointA, this.opt.colors.tailDangerArc);

				this.drawLine(new Structures.Point2D(
					playerCircle.x,
					playerCircle.y
				), pointB, this.opt.colors.tailDangerArc);
			}
		}
	}
}
