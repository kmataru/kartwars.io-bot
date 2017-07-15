namespace DracoolaArt.KartwarsBot.Utils {
	export class CanvasUtilsDrawOptions {
		public player: boolean = true;
		public dangers: boolean = true;
		public food: boolean = true;
	}

	export class CanvasUtilsColorsOptions {
		public goalLine: string = '#00ff00';
		public goalDot: string = '#ff0000';
		public goalCross: string = '#000000';

		public collidedPoint: string = '#66ff66';
		public collidedElement: string = '#ff9900';

		public collisionAvoidancePointA: string = '#ffa500';
		public collisionAvoidancePointB: string = '#ff0000';

		public foodCluster: string = '#ffffff';
		public foodClusterText: string = '#ffffff';
		public foodClusterLine: string = '#ffffff';

		public foodClusterBoundary: string = '#000000';

		public inRangeResource: string = '#00ff00';
		public collectableResource: string = '#ff0000';

		public predictionLine: string = '#000000';
		public predictionCircle: string = '#000000';

		public encircledPlayerWarning: string = '#ffff00';
		public encircledPlayerDanger: string = '#ff0000';

		public collisionElement: string = '#ff0000';
		public collisionLine: string = '#ff0000';

		public playerRadius: string = '#ffff00';
		public closeToImminentDangerRadius: string = '#ff0000';

		public playerSideDetector: string = '#ffff00';
		public playerHeadDetector: string = '#0000ff';
		public playerTailDetector: string = '#ffc0cb';

		public frontResourceGatherArc: string = '#00ff00';
		public frontDangerArc: string = '#0000ff';
		public tailDangerArc: string = '#0000ff';
	}

	export class CanvasUtilsOptions {
		/**
		 * Visual debugging.
		 */
		public visualDebugging: boolean = false;

		/**
		 * Shadow Blur.
		 */
		public shadowBlur: number = 3;

		public draw: CanvasUtilsDrawOptions = new CanvasUtilsDrawOptions();
		public colors: CanvasUtilsColorsOptions = new CanvasUtilsColorsOptions();
	}

	/**
	 * Canvas draw for Base objects.
	 */
	export abstract class CanvasUtilsBase {
		public opt: CanvasUtilsOptions;

		// Constructor
		constructor(protected readonly gameWrapper: GameWrapper) {
			this.opt = new CanvasUtilsOptions();
		}

		/**
		 * Spoofs moving the mouse to the provided coordinates.
		 * @param point
		 */
		@MethodDecoration.bound
		public setMouseCoordinates(point: IPoint2D): void {
			this.gameWrapper.input.mouse.setCoordinates(point);
		}

		/**
		 * Convert map coordinates to mouse coordinates.
		 * @param point
		 */
		@MethodDecoration.bound
		public mapToMouse(point: IPoint2D): IPoint2D {
			let playerPosition = this.gameWrapper.player.getPosition();

			let mousePoint: IPoint2D = new Structures.Point2D(
				(point.x - playerPosition.x) * window.game.world.scale.x,
				(point.y - playerPosition.y) * window.game.world.scale.y
			);

			return mousePoint;
		}

		/**
		 * Map cordinates to Canvas cordinate shortcut
		 * @param point
		 */
		@MethodDecoration.bound
		protected mapToCanvas(point: IPoint2D): IPoint2D {
			let playerPosition = this.gameWrapper.player.getPosition();

			let canvasPoint: IPoint2D = new Structures.Point2D(
				(window.game.canvas.width / 2) + (point.x - playerPosition.x) * window.game.world.scale.x,
				(window.game.canvas.height / 2) + (point.y - playerPosition.y) * window.game.world.scale.y
			);

			return canvasPoint;
		}

		/**
		 * Map to Canvas coordinate conversion for drawing circles.
		 * Radius also needs to scale by .gsc
		 * @param circle
		 */
		protected circleMapToCanvas(circle: ICircle) {
			let newCircle = this.mapToCanvas(circle);

			return new Structures.Circle(
				newCircle.x,
				newCircle.y,
				circle.radius * window.game.world.scale.x
			);
		}

		/**
		 * Adjusts zoom in response to the mouse wheel.
		 * @param e
		 */
		public setZoom(e: WheelEvent) {
			// TODO : Review
			// let isInside = $('.dg.ac').data('isInside');
			let isInside = $(window.botFactory.datGUI.gui.domElement.parentElement).data('isInside');
			if (isInside) {
				return;
			}
			//

			// Scaling ratio
			if (window.game.world.scale.x) {
				let scaleValue = window.game.world.scale.x;
				scaleValue *= Math.pow(0.9, e.wheelDelta / -120 || e.detail / 2 || 0);
				if (scaleValue < 0.25) {
					scaleValue = 0.25;
				} else if (scaleValue > 1.5) {
					scaleValue = 1.5;
				}

				window.game.world.scale.x = window.game.world.scale.y = scaleValue;
				window.desired_gsc = window.game.world.scale.x;
			}
		}

		/**
		 * Restores zoom to the default value.
		 */
		public resetZoom() {
			window.game.world.scale.x = window.game.world.scale.y = 0.8116666666666666;
			window.desired_gsc = 0.8116666666666666;
		}

		/**
		 * Maintains Zoom
		 */
		public maintainZoom() {
			if (window.desired_gsc !== undefined) {
				window.game.world.scale.x = window.game.world.scale.y = window.desired_gsc;
			}
		}

		// Sets background to the given image URL.
		// Defaults to kartwars.io's own background.
		public setBackground(url: string) {
			throw new Error('Not implemented');
		}

		/**
		 * Draw a rectangle on the canvas.
		 * @param rect
		 * @param rotation
		 * @param color
		 * @param fill
		 * @param alpha
		 */
		@MethodDecoration.bound
		public drawRect(rect: IRect, rotation?: number, color?: string, fill?: boolean, alpha?: number) {
			if (alpha === undefined) alpha = 1;

			let context = this.gameWrapper.input.canvas.getContext();
			//let lc = this.mapToCanvas({ x: rect.x, y: rect.y });
			//let lc = this.mapToCanvas({ x: rect.x - rect.width / 2, y: rect.y - rect.height / 2 });
			let lc = this.mapToCanvas(new Structures.Point2D(rect.x, rect.y));

			let width = rect.width * window.game.world.scale.x,
				height = rect.height * window.game.world.scale.y;

			// first save the untranslated/unrotated context
			context.save();

			context.beginPath();

			context.globalAlpha = alpha;
			context.shadowBlur = this.opt.shadowBlur;
			context.shadowColor = color;
			context.strokeStyle = color;

			// move the rotation point to the center of the rect
			context.translate(lc.x + width / 2, lc.y + height / 2);
			// rotate the rect
			//ctx.rotate(degrees * Math.PI / 180);
			context.rotate(rotation);

			// draw the rect on the transformed context
			// Note: after transforming [0,0] is visually [x,y]
			//       so the rect needs to be offset accordingly when drawn
			//ctx.rect(-width / 2, -height / 2, width, height);
			context.rect(-width / 2, -height / 2, width, height);

			context.stroke();

			if (fill) {
				context.fillStyle = color;
				context.fill();
			}

			// restore the context to its untranslated/unrotated state
			context.restore();
		}

		/**
		 * Draw a circle on the canvas.
		 * @param circle
		 * @param color
		 * @param fill
		 * @param alpha
		 */
		@MethodDecoration.bound
		public drawCircle(circle: IPoint2D, color?: string, fill?: boolean, alpha?: number) {
			let thisCircle = (circle as ICircle);

			if (alpha === undefined) alpha = 1;
			if (thisCircle.radius === undefined) thisCircle.radius = 5;

			let context = this.gameWrapper.input.canvas.getContext();
			let drawCircle = this.circleMapToCanvas(thisCircle);

			context.save();
			context.globalAlpha = alpha;
			context.beginPath();
			context.shadowBlur = this.opt.shadowBlur;
			context.shadowColor = color;
			context.strokeStyle = color;
			context.arc(drawCircle.x, drawCircle.y, drawCircle.radius, 0, Math.PI * 2);
			context.stroke();
			if (fill) {
				context.fillStyle = color;
				context.fill();
			}
			context.restore();
		}

		/**
		 * Draw a circle on the canvas.
		 * @param circle
		 * @param directionInRadian
		 * @param emptyRadian
		 * @param color
		 * @param fill
		 * @param alpha
		 * @param clockwise
		 */
		@MethodDecoration.bound
		public drawArc(circle: ICircle, directionInRadian: number, emptyRadian: number, color?: string, fill?: boolean, alpha?: number, clockwise?: boolean) {
			if (clockwise === undefined) clockwise = true;
			if (alpha === undefined) alpha = 1;
			if (circle.radius === undefined) circle.radius = 5;

			let context = this.gameWrapper.input.canvas.getContext();
			let drawCircle = this.circleMapToCanvas(circle);

			let halfEmptyRadian = emptyRadian / 2;

			context.save();
			context.globalAlpha = alpha;
			context.beginPath();
			context.shadowBlur = this.opt.shadowBlur;
			context.shadowColor = color;
			context.strokeStyle = color;
			context.arc(drawCircle.x, drawCircle.y, drawCircle.radius, directionInRadian - halfEmptyRadian, directionInRadian + halfEmptyRadian, clockwise);
			context.stroke();
			if (fill) {
				context.fillStyle = color;
				context.fill();
			}
			context.restore();
		}

		/*
		// TODO : Unused
		// Draw an angle.
		// @param {number} start -- where to start the angle
		// @param {number} angle -- width of the angle
		// @param {bool} danger -- green if false, red if true
		@MethodDecoration.bound
		public drawAngle(start, angle, color, fill, alpha) {
			if (alpha === undefined) alpha = 0.6;
	
			let context = this.gameWrapper.input.canvas.getContext();
	
			context.save();
			context.globalAlpha = alpha;
			context.shadowBlur = this.opt.shadowBlur;
			context.shadowColor = color;
			context.beginPath();
			context.moveTo(window.game.canvas.width / 2, window.game.canvas.height / 2);
			context.arc(window.game.canvas.width / 2, window.game.canvas.height / 2, window.game.world.scale.x * 100, start, angle);
			context.lineTo(window.game.canvas.width / 2, window.game.canvas.height / 2);
			context.closePath();
			context.stroke();
			if (fill) {
				context.fillStyle = color;
				context.fill();
			}
			context.restore();
		}
		*/

		/**
		 * Draw a cross on the canvas.
		 * @param point
		 * @param color
		 * @param width
		 * @param alpha
		 */
		@MethodDecoration.bound
		public drawCross(point: IPoint2D, color: string, width?: number, alpha?: number) {
			let context = this.gameWrapper.input.canvas.getContext();
			let canvas = context.canvas;

			point = this.mapToCanvas(point);

			this.drawLine(
				new Structures.Point2D(0, point.y),
				new Structures.Point2D(canvas.width, point.y),
				color, width, 0.15, false
			);

			this.drawLine(
				new Structures.Point2D(point.x, 0),
				new Structures.Point2D(point.x, canvas.height),
				color, width, alpha, false
			);
		}

		/**
		 * Draw a line on the canvas.
		 * @param p1
		 * @param p2
		 * @param color
		 * @param width
		 * @param alpha
		 * @param mapToCanvas
		 */
		@MethodDecoration.bound
		public drawLine(p1: IPoint2D, p2: IPoint2D, color: string, width?: number, alpha?: number, mapToCanvas?: boolean) {
			if (width === undefined) width = 5;
			if (alpha === undefined) alpha = 1.0;
			if (mapToCanvas === undefined) mapToCanvas = true;

			let context = this.gameWrapper.input.canvas.getContext();

			if (mapToCanvas) {
				p1 = this.mapToCanvas(p1);
				p2 = this.mapToCanvas(p2);
			}

			context.save();
			context.globalAlpha = alpha;
			context.beginPath();
			context.lineWidth = width * window.game.world.scale.x;
			context.shadowBlur = this.opt.shadowBlur;
			context.shadowColor = color;
			context.strokeStyle = color;
			context.moveTo(p1.x, p1.y);
			context.lineTo(p2.x, p2.y);
			context.stroke();
			context.restore();
		}

		@MethodDecoration.bound
		public drawTriangle(p1: IPoint2D, p2: IPoint2D, p3: IPoint2D, color: string, width?: number, fill?: boolean, alpha?: number, mapToCanvas?: boolean) {
			if (width === undefined) width = 5;
			if (alpha === undefined) alpha = 1.0;
			if (mapToCanvas === undefined) mapToCanvas = true;

			let context = this.gameWrapper.input.canvas.getContext();

			if (mapToCanvas) {
				p1 = this.mapToCanvas(p1);
				p2 = this.mapToCanvas(p2);
				p3 = this.mapToCanvas(p3);
			}

			context.save();
			context.globalAlpha = alpha;
			context.beginPath();
			context.lineWidth = width * window.game.world.scale.x;
			context.shadowBlur = this.opt.shadowBlur;
			context.shadowColor = color;
			context.strokeStyle = color;
			context.moveTo(p1.x, p1.y);
			context.lineTo(p2.x, p2.y);
			context.lineTo(p3.x, p3.y);
			context.stroke();
			if (fill) {
				context.fillStyle = color;
				context.fill();
			}
			context.restore();
		}

		@MethodDecoration.bound
		public drawPolygon(points: IPoint2D[], color: string, width?: number, fill?: boolean, alpha?: number, mapToCanvas?: boolean) {
			if (points.length < 3) {
				throw new Error(`Polygon must have more than 2 vertices. Supplied number of vertices: ${points.length}`);
			}

			if (width === undefined) width = 5;
			if (alpha === undefined) alpha = 1.0;
			if (mapToCanvas === undefined) mapToCanvas = true;

			let context = this.gameWrapper.input.canvas.getContext();

			if (mapToCanvas) {
				for (let idx = 0, length = points.length; idx < length; idx++) {
					points[idx] = this.mapToCanvas(points[idx]);
				}
			}

			context.save();
			context.globalAlpha = alpha;
			context.beginPath();
			context.lineWidth = width * window.game.world.scale.x;
			context.shadowBlur = this.opt.shadowBlur;
			context.shadowColor = color;
			context.strokeStyle = color;
			context.moveTo(points[0].x, points[0].y);

			for (let idx = 1, length = points.length, point = undefined; point = points[idx], idx < length; idx++) {
				context.lineTo(point.x, point.y);
			}

			context.closePath();

			context.stroke();
			if (fill) {
				context.fillStyle = color;
				context.fill();
			}
			context.restore();
		}

		/**
		 * Draw text on the canvas.
		 * @param point
		 * @param text
		 * @param color
		 * @param alpha
		 * @param mapToCanvas
		 */
		@MethodDecoration.bound
		public drawText(point: IPoint2D, text: string, color: string, alpha?: number, mapToCanvas?: boolean) {
			if (alpha === undefined) alpha = 1.0;
			if (mapToCanvas === undefined) mapToCanvas = true;

			let context = this.gameWrapper.input.canvas.getContext();

			if (mapToCanvas) {
				point = this.mapToCanvas(point);
			}

			context.save();
			context.globalAlpha = alpha;
			context.shadowBlur = this.opt.shadowBlur;
			context.shadowColor = color;
			context.fillStyle = color;
			context.font = 'bold 20px Arial';
			context.fillText(text, point.x, point.y);
			//context.stroke();
			context.restore();
		}
	}
}
