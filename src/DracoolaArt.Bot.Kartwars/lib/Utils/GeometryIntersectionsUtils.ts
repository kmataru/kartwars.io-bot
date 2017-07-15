namespace DracoolaArt.KartwarsBot.Utils {
	/**
	 * Some methods are based on Kevin Lindsey's work
	 *
	 * copyright 2002, Kevin Lindsey
	 */
	export class GeometryIntersectionsUtils {
		/**
		 * Check if circle and line intersects.
		 * @param c Circle.
		 * @param r Circle radius.
		 * @param a1 Line start point.
		 * @param a2 Line end point.
		 */
		public static intersectCircleLine(c: IPoint2D, r: number, a1: IPoint2D, a2: IPoint2D) {
			let result: Structures.ShapesIntersectionsResult;
			let a = (a2.x - a1.x) * (a2.x - a1.x) +
				(a2.y - a1.y) * (a2.y - a1.y);
			let b = 2 * ((a2.x - a1.x) * (a1.x - c.x) +
				(a2.y - a1.y) * (a1.y - c.y));
			let cc = c.x * c.x + c.y * c.y + a1.x * a1.x + a1.y * a1.y -
				2 * (c.x * a1.x + c.y * a1.y) - r * r;
			let deter = b * b - 4 * a * cc;
			if (deter < 0) {
				result = new Structures.ShapesIntersectionsResult(ShapesIntersectionStatus.NoIntersection);
			} else if (deter == 0) {
				result = new Structures.ShapesIntersectionsResult(ShapesIntersectionStatus.Tangent);
			} else {
				let e = Math.sqrt(deter);
				let u1 = (-b + e) / (2 * a);
				let u2 = (-b - e) / (2 * a);
				if ((u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1)) {
					if ((u1 < 0 && u2 < 0) || (u1 > 1 && u2 > 1)) {
						result = new Structures.ShapesIntersectionsResult(ShapesIntersectionStatus.NoIntersection);
					}
					else {
						result = new Structures.ShapesIntersectionsResult(ShapesIntersectionStatus.ShapeInside);
					}
				}
				else {
					result = new Structures.ShapesIntersectionsResult(ShapesIntersectionStatus.HasIntersections);
					if (0 <= u1 && u1 <= 1)
						result.points.push(Structures.BotPoint2D.fromPoint2D(a1.lerp(a2, u1)));
					if (0 <= u2 && u2 <= 1)
						result.points.push(Structures.BotPoint2D.fromPoint2D(a1.lerp(a2, u2)));
				}
			}
			return result;
		}

		/**
		 * Check if circle and polygon intersects.
		 * @param c Circle.
		 * @param r Circle radius.
		 * @param polygon Polygon.
		 */
		public static intersectCirclePolygon(c: IPoint2D, r: number, polygon: IPolygon) {
			let result = new Structures.ShapesIntersectionsResult(ShapesIntersectionStatus.NoIntersection);
			let points = polygon.geometryAsPoint2DArray;
			let length = points.length;
			let inter;

			for (let i = 0; i < length; i++) {
				let a1 = points[i];
				let a2 = points[(i + 1) % length];
				inter = GeometryIntersectionsUtils.intersectCircleLine(c, r, a1, a2);
				result.addPoints(inter.points);
			}

			if (result.points.length > 0) {
				result.status = ShapesIntersectionStatus.HasIntersections;
			}
			else {
				let status = inter.status;

				if (status == ShapesIntersectionStatus.NoIntersection) {
					if (GeometryIntersectionsUtils.pointInPoly(c, polygon)) {
						status = ShapesIntersectionStatus.ShapeInside;
					}
				}

				result.status = status;
			}

			return result;
		}

		/**
		 * Check if point is in Rectangle.
		 * @param point
		 * @param rect
		 */
		public static pointInRect(point: IPoint2D, rect: IRect) {
			if (rect.x <= point.x && rect.y <= point.y &&
				rect.x + rect.width >= point.x && rect.y + rect.height >= point.y) {
				return true;
			}

			return false;
		}

		/**
		 * Check if point is in polygon.
		 * @param point
		 * @param poly
		 */
		public static pointInPoly(point: IPoint2D, polygon: IPolygon) {
			if (point.x < polygon.minX || point.x > polygon.maxX ||
				point.y < polygon.minY || point.y > polygon.maxY) {
				return false;
			}

			let isInside = false;

			let geometry = polygon.geometry;
			const ll = geometry.length;

			for (let i = 0, j = ll - 1; i < ll; j = i++) {
				if (
					((geometry[i].y > point.y) != (geometry[j].y > point.y)) &&
					(point.x < (geometry[j].x - geometry[i].x) * (point.y - geometry[i].y) / (geometry[j].y - geometry[i].y) + geometry[i].x)
				) {
					isInside = !isInside;
				}
			}

			return isInside;
		}

		/**
		 * Checks if a certain point is inside an arc.
		 * @param point
		 * @param center
		 * @param radius
		 * @param angle1
		 * @param angle2
		 */
		public static isInsideArcSector(point: IPoint2D, center: IPoint2D, radius: number, angle1: number, angle2: number): boolean {
			function areClockwise(center: IPoint2D, radius: number, angle: number, point2: IPoint2D) {
				let point1: IPoint2D = new Structures.Point2D(
					(center.x + radius) * Math.cos(angle),
					(center.y + radius) * Math.sin(angle)
				);

				return -point1.x * point2.y + point1.y * point2.x > 0;
			}

			let relPoint: IPoint2D = new Structures.Point2D(
				point.x - center.x,
				point.y - center.y
			);

			return !areClockwise(center, radius, angle1, relPoint) &&
				areClockwise(center, radius, angle2, relPoint) &&
				(relPoint.x * relPoint.x + relPoint.y * relPoint.y <= radius * radius);
		}

		/**
		 * Check if circle and rect intersects.
		 * @param circle
		 * @param rect
		 */
		public static circleRectIntersect(circle: ICircle, rect: IRect): boolean {
			let deltaX = Math.abs(circle.x - rect.x - rect.width / 2);
			let deltaY = Math.abs(circle.y - rect.y - rect.height / 2);

			if (deltaX > (rect.width / 2 + circle.radius)) { return false; }
			if (deltaY > (rect.height / 2 + circle.radius)) { return false; }

			if (deltaX <= (rect.width / 2)) { return true; }
			if (deltaY <= (rect.height / 2)) { return true; }

			let dx = deltaX - rect.width / 2;
			let dy = deltaY - rect.height / 2;

			let returnStatus = (dx * dx + dy * dy <= (circle.radius * circle.radius));

			return returnStatus;
		}

		/*
		// Ported to JavaScript from 
		// http://www.migapro.com/circle-and-rotated-rectangle-collision-detection/
		//
		// An example:
		// let circle: { x: 20, y: 10, radius: 20 };
		// let rect: { x: 30, y: 30, width: 100, height: 100, rotation: Math.PI / 2 };
		// collideCircleWithRotatedRectangle( circle, rect );
		// // returns true.
		// 
		//
		// Please note:
		// This code assumes that rect.x and rect.y are the CENTER coordinates
		// of the rectangle. You may want to to change this.
		// Also rotation values need to be in RADIANS.
		public static circleRectIntersect(circle: Circle, rect: Rect) {
			let rectCenterX = rect.x;
			let rectCenterY = rect.y;

			let rectX = rectCenterX - rect.width / 2;
			let rectY = rectCenterY - rect.height / 2;

			let rectReferenceX = rectX;
			let rectReferenceY = rectY;

			// Rotate circle's center point back
			let unrotatedCircleX = Math.cos(rect.rotation) * (circle.x - rectCenterX) - Math.sin(rect.rotation) * (circle.y - rectCenterY) + rectCenterX;
			let unrotatedCircleY = Math.sin(rect.rotation) * (circle.x - rectCenterX) + Math.cos(rect.rotation) * (circle.y - rectCenterY) + rectCenterY;

			// Closest point in the rectangle to the center of circle rotated backwards(unrotated)
			let closestX, closestY;

			// Find the unrotated closest x point from center of unrotated circle
			if (unrotatedCircleX < rectReferenceX) {
				closestX = rectReferenceX;
			} else if (unrotatedCircleX > rectReferenceX + rect.width) {
				closestX = rectReferenceX + rect.width;
			} else {
				closestX = unrotatedCircleX;
			}

			// Find the unrotated closest y point from center of unrotated circle
			if (unrotatedCircleY < rectReferenceY) {
				closestY = rectReferenceY;
			} else if (unrotatedCircleY > rectReferenceY + rect.height) {
				closestY = rectReferenceY + rect.height;
			} else {
				closestY = unrotatedCircleY;
			}

			// Determine collision
			let collision = false;
			let distance = MathUtils.getDistance(new Point2D(unrotatedCircleX, unrotatedCircleY), new Point2D(closestX, closestY));

			if (distance < circle.radius) {
				collision = true;
			}
			else {
				collision = false;
			}

			return collision;
		}
		*/

		/**
		 * Check if two circles intersect.
		 * @param circle1
		 * @param circle2
		 */
		public static circleCircleIntersect(circle1: ICircle, circle2: ICircle): Structures.ShapesIntersectionsResult {
			let a, deltaX, deltaY, d, h, rx, ry;
			let x2, y2;

			let point: Structures.BotPoint2D;

			// deltaX and deltaY are the vertical and horizontal distances between the circle centers.
			deltaX = circle2.x - circle1.x;
			deltaY = circle2.y - circle1.y;

			// Determine the straight-line distance between the centers.
			d = Math.sqrt((deltaY * deltaY) + (deltaX * deltaX));

			// Check for solvability.
			if (d > (circle1.radius + circle2.radius)) {
				// No solution. circles do not intersect.
				return new Structures.ShapesIntersectionsResult(ShapesIntersectionStatus.NoIntersection);
			}

			if (d < Math.abs(circle1.radius - circle2.radius)) {
				// No solution. one circle is contained in the other
				return new Structures.ShapesIntersectionsResult(ShapesIntersectionStatus.ShapeInside);
			}

			let returnData = new Structures.ShapesIntersectionsResult(ShapesIntersectionStatus.HasIntersections);

			/* 'point 2' is the point where the line through the circle
			 * intersection points crosses the line between the circle
			 * centers.  
			 */

			// Determine the distance from point 0 to point 2.
			a = ((circle1.radius * circle1.radius) - (circle2.radius * circle2.radius) + (d * d)) / (2.0 * d);

			// Determine the coordinates of point 2.
			x2 = circle1.x + (deltaX * a / d);
			y2 = circle1.y + (deltaY * a / d);

			// Determine the distance from point 2 to either of the intersection points.
			h = Math.sqrt((circle1.radius * circle1.radius) - (a * a));

			// Now determine the offsets of the intersection points from point 2.
			rx = -deltaY * (h / d);
			ry = deltaX * (h / d);

			// Determine the absolute intersection points and add them to stack.
			returnData.addPoint(new Structures.BotPoint2D(x2 + rx, y2 + ry));
			returnData.addPoint(new Structures.BotPoint2D(x2 - rx, y2 - ry));

			return returnData;
		}
	}
}
