var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Utils;
        (function (Utils) {
            /**
             * Canvas draw for Composed objects.
             */
            var CanvasUtils = (function (_super) {
                __extends(CanvasUtils, _super);
                function CanvasUtils() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                CanvasUtils.wrappedDrawInterceptor = function (fx) {
                    CanvasUtils.interceptedWrappedDrawCalls.push(fx);
                };
                /**
                 * Calls all below intercepted drawing methods.
                 */
                CanvasUtils.prototype.drawAllInterceptedWrappedCalls = function () {
                    window.botFactory.clock.startFrame();
                    if (this.opt.visualDebugging) {
                        CanvasUtils.interceptedWrappedDrawCalls.forEach(function (fx) {
                            fx();
                        });
                    }
                    CanvasUtils.interceptedWrappedDrawCalls = [];
                    window.botFactory.clock.endFrame();
                };
                /**
                 * Draw global goal on canvas on the canvas.
                 * @param goalCoordinates
                 */
                CanvasUtils.prototype.drawGoal = function (goalCoordinates) {
                    var playerPosition = this.gameWrapper.player.getPosition();
                    this.drawLine(playerPosition, goalCoordinates, this.opt.colors.goalLine, 2);
                    this.drawCircle(goalCoordinates, this.opt.colors.goalDot, true);
                    this.drawCross(goalCoordinates, this.opt.colors.goalCross, undefined, 0.05);
                };
                /**
                 * Draw collision point on the canvas.
                 * @param collisionPoint
                 */
                CanvasUtils.prototype.drawCollisionPoint = function (collisionPoint) {
                    this.drawCircle(collisionPoint, this.opt.colors.collidedPoint, true);
                };
                /**
                 * Draw collision circle on the canvas.
                 * @param collisionCircle
                 */
                CanvasUtils.prototype.drawCollisionCircle = function (collisionCircle) {
                    this.drawCircle(collisionCircle, this.opt.colors.collidedElement, false);
                };
                CanvasUtils.prototype.drawCollisionPolygon = function (polygon) {
                    this.drawPolygon(polygon.geometryAsPoint2DArray, this.opt.colors.collidedElement, undefined, false);
                };
                /**
                 * Draw collision avoidance lines on the canvas.
                 * @param collisionPoint
                 * @param avoidancePoint
                 */
                CanvasUtils.prototype.drawCollisionAvoidance = function (collisionPoint, avoidancePoint) {
                    var playerPosition = this.gameWrapper.player.getPosition();
                    this.drawLine(playerPosition, avoidancePoint, this.opt.colors.collisionAvoidancePointA, 5);
                    this.drawLine(playerPosition, collisionPoint, this.opt.colors.collisionAvoidancePointB, 5);
                };
                /**
                 * Draw food cluster on the canvas.
                 * @param circle
                 * @param quantity
                 */
                CanvasUtils.prototype.drawFoodCluster = function (circle, quantity) {
                    var playerPosition = this.gameWrapper.player.getPosition();
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
                };
                /**
                 * Draw food cluster boundary on the canvas.
                 * @param radius
                 */
                CanvasUtils.prototype.drawFoodClusterBoundary = function (radius) {
                    var playerPosition = this.gameWrapper.player.getPosition();
                    var foodClusterBoundaryCircle = new KartwarsBot.Structures.Circle(playerPosition.x, playerPosition.y, radius);
                    this.drawCircle(foodClusterBoundaryCircle, this.opt.colors.foodClusterBoundary, false);
                };
                /**
                 * Draw resource on the canvas.
                 * @param resourceCircle
                 * @param canBeCollected
                 */
                CanvasUtils.prototype.drawResource = function (resourceCircle, canBeCollected) {
                    if (!this.opt.draw.food) {
                        return;
                    }
                    this.drawCircle(resourceCircle, this.opt.colors.inRangeResource);
                    if (canBeCollected) {
                        var canBeCollectedResourceCircle = new KartwarsBot.Structures.Circle(resourceCircle.x, resourceCircle.y, resourceCircle.radius + 15);
                        this.drawCircle(canBeCollectedResourceCircle, this.opt.colors.collectableResource);
                    }
                };
                // TODO : Review
                CanvasUtils.prototype.drawTunnel = function (left, right, alpha) {
                    if (alpha == undefined) {
                        alpha = 0.15;
                    }
                    this.drawLine(left.point1, left.point2, 'black', 3, alpha);
                    this.drawLine(right.point1, right.point2, 'black', 3, alpha);
                };
                /**
                 * Draw intersection prediction on the canvas.
                 * @param goalCoordinates
                 */
                CanvasUtils.prototype.drawIntersectionPrediction = function (goalCoordinates) {
                    var playerPosition = this.gameWrapper.player.getPosition();
                    this.drawLine(playerPosition, goalCoordinates, this.opt.colors.predictionLine, 12, 0.75);
                    this.drawCircle(goalCoordinates, this.opt.colors.predictionCircle, false, 0.75);
                };
                /**
                 * Draw encircled player on the canvas.
                 * @param playerCircle
                 * @param danger
                 */
                CanvasUtils.prototype.drawEncircledPlayer = function (playerCircle, danger) {
                    var color = (danger ? this.opt.colors.encircledPlayerDanger : this.opt.colors.encircledPlayerWarning);
                    this.drawCircle(playerCircle, color, true, 0.2);
                };
                /**
                 * Draw collision elements and draw lines to collision angles on the canvas.
                 * @param collisionElements
                 * @param collisionAngles
                 */
                CanvasUtils.prototype.drawCollisionElements = function (collisionElements, collisionAngles) {
                    if (!this.opt.draw.dangers) {
                        return;
                    }
                    //if (this.bot.opt.draw.enemies) {
                    var playerPosition = this.gameWrapper.player.getPosition();
                    for (var idx = 0, ll = collisionElements.length; idx < ll; idx++) {
                        var thisCollisionPoint = collisionElements[idx];
                        if (thisCollisionPoint !== undefined) {
                            switch (thisCollisionPoint.shapeType) {
                                case KartwarsBot.CollisionElementType.Circle:
                                    {
                                        this.drawCircle(thisCollisionPoint, this.opt.colors.collisionElement, false, 0.25);
                                    }
                                    break;
                                case KartwarsBot.CollisionElementType.Polygon:
                                    {
                                        var points = thisCollisionPoint.geometry.map(function (element) {
                                            return new KartwarsBot.Structures.Point2D(element.x, element.y);
                                        });
                                        this.drawPolygon(points, this.opt.colors.collisionElement, undefined, true, 0.1);
                                    }
                                    break;
                            }
                        }
                    }
                    for (var idx = 0, ll = collisionAngles.length; idx < ll; idx++) {
                        var thisCollisionAngles = collisionAngles[idx];
                        if (thisCollisionAngles !== undefined) {
                            this.drawLine(playerPosition, new KartwarsBot.Structures.Point2D(thisCollisionAngles.x, thisCollisionAngles.y), this.opt.colors.collisionLine, 2, 0.25);
                        }
                    }
                    //}
                };
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
                CanvasUtils.prototype.drawPlayer = function (playerCircle, playerResourceGatherCircle, headCircle, tailCircle, closeToImminentDangerCircle, leftSideCircle, rightSideCircle, emptyDangerRadian, emptyTailDangerRadian, emptyResourceGatherRadian) {
                    if (!this.opt.draw.player) {
                        return;
                    }
                    var playerRotation = this.gameWrapper.player.getRotation();
                    //
                    // Draw Close To Imminent Danger Circle
                    {
                        this.drawCircle(closeToImminentDangerCircle, this.opt.colors.closeToImminentDangerRadius, false, 0.35);
                    }
                    //
                    // Draw Resource Gather Arc
                    {
                        this.drawArc(playerResourceGatherCircle, playerRotation, emptyResourceGatherRadian, this.opt.colors.frontResourceGatherArc, undefined, undefined, false);
                    }
                    //
                    // Draw front Resource Gather lines
                    {
                        var pointA = Utils.MathUtils.arcPoint(playerResourceGatherCircle.x, playerResourceGatherCircle.y, playerResourceGatherCircle.radius, playerRotation - (emptyResourceGatherRadian / 2));
                        var pointB = Utils.MathUtils.arcPoint(playerResourceGatherCircle.x, playerResourceGatherCircle.y, playerResourceGatherCircle.radius, playerRotation + (emptyResourceGatherRadian / 2));
                        this.drawLine(new KartwarsBot.Structures.Point2D(playerResourceGatherCircle.x, playerResourceGatherCircle.y), pointA, this.opt.colors.frontResourceGatherArc);
                        this.drawLine(new KartwarsBot.Structures.Point2D(playerResourceGatherCircle.x, playerResourceGatherCircle.y), pointB, this.opt.colors.frontResourceGatherArc);
                    }
                    {
                        this.drawCircle(headCircle, this.opt.colors.playerHeadDetector, false);
                        this.drawCircle(tailCircle, this.opt.colors.playerTailDetector, false);
                        this.drawCircle(leftSideCircle, this.opt.colors.playerSideDetector, false);
                        this.drawCircle(rightSideCircle, this.opt.colors.playerSideDetector, false);
                    }
                    {
                        this.drawArc(playerCircle, playerRotation, emptyDangerRadian, this.opt.colors.playerRadius);
                        this.drawArc(playerCircle, playerRotation, emptyDangerRadian, this.opt.colors.frontDangerArc, true, 0.1, false);
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
                        var pointA = Utils.MathUtils.arcPoint(playerCircle.x, playerCircle.y, playerCircle.radius, playerRotation - (emptyDangerRadian / 2));
                        var pointB = Utils.MathUtils.arcPoint(playerCircle.x, playerCircle.y, playerCircle.radius, playerRotation + (emptyDangerRadian / 2));
                        this.drawTriangle(pointA, playerCircle, pointB, this.opt.colors.frontDangerArc, undefined, true, 0.1);
                        this.drawLine(new KartwarsBot.Structures.Point2D(playerCircle.x, playerCircle.y), pointA, this.opt.colors.playerRadius);
                        this.drawLine(new KartwarsBot.Structures.Point2D(playerCircle.x, playerCircle.y), pointB, this.opt.colors.playerRadius);
                    }
                    //
                    // Draw tail lines
                    {
                        var pointA = Utils.MathUtils.arcPoint(playerCircle.x, playerCircle.y, playerCircle.radius, playerRotation + Math.PI - (emptyTailDangerRadian / 2));
                        var pointB = Utils.MathUtils.arcPoint(playerCircle.x, playerCircle.y, playerCircle.radius, playerRotation + Math.PI + (emptyTailDangerRadian / 2));
                        this.drawLine(new KartwarsBot.Structures.Point2D(playerCircle.x, playerCircle.y), pointA, this.opt.colors.tailDangerArc);
                        this.drawLine(new KartwarsBot.Structures.Point2D(playerCircle.x, playerCircle.y), pointB, this.opt.colors.tailDangerArc);
                    }
                };
                return CanvasUtils;
            }(Utils.CanvasUtilsBase));
            CanvasUtils.interceptedWrappedDrawCalls = [];
            __decorate([
                KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
            ], CanvasUtils.prototype, "drawGoal", null);
            __decorate([
                KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
            ], CanvasUtils.prototype, "drawCollisionPoint", null);
            __decorate([
                KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
            ], CanvasUtils.prototype, "drawCollisionCircle", null);
            __decorate([
                KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
            ], CanvasUtils.prototype, "drawCollisionPolygon", null);
            __decorate([
                KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
            ], CanvasUtils.prototype, "drawCollisionAvoidance", null);
            __decorate([
                KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
            ], CanvasUtils.prototype, "drawFoodCluster", null);
            __decorate([
                KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
            ], CanvasUtils.prototype, "drawFoodClusterBoundary", null);
            __decorate([
                KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
            ], CanvasUtils.prototype, "drawResource", null);
            __decorate([
                KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
            ], CanvasUtils.prototype, "drawTunnel", null);
            __decorate([
                KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
            ], CanvasUtils.prototype, "drawIntersectionPrediction", null);
            __decorate([
                KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
            ], CanvasUtils.prototype, "drawEncircledPlayer", null);
            __decorate([
                KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
            ], CanvasUtils.prototype, "drawCollisionElements", null);
            __decorate([
                KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
            ], CanvasUtils.prototype, "drawPlayer", null);
            Utils.CanvasUtils = CanvasUtils;
        })(Utils = KartwarsBot.Utils || (KartwarsBot.Utils = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
