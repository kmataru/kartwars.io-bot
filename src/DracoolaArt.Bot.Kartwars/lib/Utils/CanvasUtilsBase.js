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
            var CanvasUtilsDrawOptions = (function () {
                function CanvasUtilsDrawOptions() {
                    this.player = true;
                    this.dangers = true;
                    this.food = true;
                }
                return CanvasUtilsDrawOptions;
            }());
            Utils.CanvasUtilsDrawOptions = CanvasUtilsDrawOptions;
            var CanvasUtilsColorsOptions = (function () {
                function CanvasUtilsColorsOptions() {
                    this.goalLine = '#00ff00';
                    this.goalDot = '#ff0000';
                    this.goalCross = '#000000';
                    this.collidedPoint = '#66ff66';
                    this.collidedElement = '#ff9900';
                    this.collisionAvoidancePointA = '#ffa500';
                    this.collisionAvoidancePointB = '#ff0000';
                    this.foodCluster = '#ffffff';
                    this.foodClusterText = '#ffffff';
                    this.foodClusterLine = '#ffffff';
                    this.foodClusterBoundary = '#000000';
                    this.inRangeResource = '#00ff00';
                    this.collectableResource = '#ff0000';
                    this.predictionLine = '#000000';
                    this.predictionCircle = '#000000';
                    this.encircledPlayerWarning = '#ffff00';
                    this.encircledPlayerDanger = '#ff0000';
                    this.collisionElement = '#ff0000';
                    this.collisionLine = '#ff0000';
                    this.playerRadius = '#ffff00';
                    this.closeToImminentDangerRadius = '#ff0000';
                    this.playerSideDetector = '#ffff00';
                    this.playerHeadDetector = '#0000ff';
                    this.playerTailDetector = '#ffc0cb';
                    this.frontResourceGatherArc = '#00ff00';
                    this.frontDangerArc = '#0000ff';
                    this.tailDangerArc = '#0000ff';
                }
                return CanvasUtilsColorsOptions;
            }());
            Utils.CanvasUtilsColorsOptions = CanvasUtilsColorsOptions;
            var CanvasUtilsOptions = (function () {
                function CanvasUtilsOptions() {
                    /**
                     * Visual debugging.
                     */
                    this.visualDebugging = false;
                    /**
                     * Shadow Blur.
                     */
                    this.shadowBlur = 3;
                    this.draw = new CanvasUtilsDrawOptions();
                    this.colors = new CanvasUtilsColorsOptions();
                }
                return CanvasUtilsOptions;
            }());
            Utils.CanvasUtilsOptions = CanvasUtilsOptions;
            /**
             * Canvas draw for Base objects.
             */
            var CanvasUtilsBase = (function () {
                // Constructor
                function CanvasUtilsBase(gameWrapper) {
                    this.gameWrapper = gameWrapper;
                    this.opt = new CanvasUtilsOptions();
                }
                /**
                 * Spoofs moving the mouse to the provided coordinates.
                 * @param point
                 */
                CanvasUtilsBase.prototype.setMouseCoordinates = function (point) {
                    this.gameWrapper.input.mouse.setCoordinates(point);
                };
                /**
                 * Convert map coordinates to mouse coordinates.
                 * @param point
                 */
                CanvasUtilsBase.prototype.mapToMouse = function (point) {
                    var playerPosition = this.gameWrapper.player.getPosition();
                    var mousePoint = new KartwarsBot.Structures.Point2D((point.x - playerPosition.x) * window.game.world.scale.x, (point.y - playerPosition.y) * window.game.world.scale.y);
                    return mousePoint;
                };
                /**
                 * Map cordinates to Canvas cordinate shortcut
                 * @param point
                 */
                CanvasUtilsBase.prototype.mapToCanvas = function (point) {
                    var playerPosition = this.gameWrapper.player.getPosition();
                    var canvasPoint = new KartwarsBot.Structures.Point2D((window.game.canvas.width / 2) + (point.x - playerPosition.x) * window.game.world.scale.x, (window.game.canvas.height / 2) + (point.y - playerPosition.y) * window.game.world.scale.y);
                    return canvasPoint;
                };
                /**
                 * Map to Canvas coordinate conversion for drawing circles.
                 * Radius also needs to scale by .gsc
                 * @param circle
                 */
                CanvasUtilsBase.prototype.circleMapToCanvas = function (circle) {
                    var newCircle = this.mapToCanvas(circle);
                    return new KartwarsBot.Structures.Circle(newCircle.x, newCircle.y, circle.radius * window.game.world.scale.x);
                };
                /**
                 * Adjusts zoom in response to the mouse wheel.
                 * @param e
                 */
                CanvasUtilsBase.prototype.setZoom = function (e) {
                    // TODO : Review
                    // let isInside = $('.dg.ac').data('isInside');
                    var isInside = $(window.botFactory.datGUI.gui.domElement.parentElement).data('isInside');
                    if (isInside) {
                        return;
                    }
                    //
                    // Scaling ratio
                    if (window.game.world.scale.x) {
                        var scaleValue = window.game.world.scale.x;
                        scaleValue *= Math.pow(0.9, e.wheelDelta / -120 || e.detail / 2 || 0);
                        if (scaleValue < 0.25) {
                            scaleValue = 0.25;
                        }
                        else if (scaleValue > 1.5) {
                            scaleValue = 1.5;
                        }
                        window.game.world.scale.x = window.game.world.scale.y = scaleValue;
                        window.desired_gsc = window.game.world.scale.x;
                    }
                };
                /**
                 * Restores zoom to the default value.
                 */
                CanvasUtilsBase.prototype.resetZoom = function () {
                    window.game.world.scale.x = window.game.world.scale.y = 0.8116666666666666;
                    window.desired_gsc = 0.8116666666666666;
                };
                /**
                 * Maintains Zoom
                 */
                CanvasUtilsBase.prototype.maintainZoom = function () {
                    if (window.desired_gsc !== undefined) {
                        window.game.world.scale.x = window.game.world.scale.y = window.desired_gsc;
                    }
                };
                // Sets background to the given image URL.
                // Defaults to kartwars.io's own background.
                CanvasUtilsBase.prototype.setBackground = function (url) {
                    throw new Error('Not implemented');
                };
                /**
                 * Draw a rectangle on the canvas.
                 * @param rect
                 * @param rotation
                 * @param color
                 * @param fill
                 * @param alpha
                 */
                CanvasUtilsBase.prototype.drawRect = function (rect, rotation, color, fill, alpha) {
                    if (alpha === undefined)
                        alpha = 1;
                    var context = this.gameWrapper.input.canvas.getContext();
                    //let lc = this.mapToCanvas({ x: rect.x, y: rect.y });
                    //let lc = this.mapToCanvas({ x: rect.x - rect.width / 2, y: rect.y - rect.height / 2 });
                    var lc = this.mapToCanvas(new KartwarsBot.Structures.Point2D(rect.x, rect.y));
                    var width = rect.width * window.game.world.scale.x, height = rect.height * window.game.world.scale.y;
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
                };
                /**
                 * Draw a circle on the canvas.
                 * @param circle
                 * @param color
                 * @param fill
                 * @param alpha
                 */
                CanvasUtilsBase.prototype.drawCircle = function (circle, color, fill, alpha) {
                    var thisCircle = circle;
                    if (alpha === undefined)
                        alpha = 1;
                    if (thisCircle.radius === undefined)
                        thisCircle.radius = 5;
                    var context = this.gameWrapper.input.canvas.getContext();
                    var drawCircle = this.circleMapToCanvas(thisCircle);
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
                };
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
                CanvasUtilsBase.prototype.drawArc = function (circle, directionInRadian, emptyRadian, color, fill, alpha, clockwise) {
                    if (clockwise === undefined)
                        clockwise = true;
                    if (alpha === undefined)
                        alpha = 1;
                    if (circle.radius === undefined)
                        circle.radius = 5;
                    var context = this.gameWrapper.input.canvas.getContext();
                    var drawCircle = this.circleMapToCanvas(circle);
                    var halfEmptyRadian = emptyRadian / 2;
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
                };
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
                CanvasUtilsBase.prototype.drawCross = function (point, color, width, alpha) {
                    var context = this.gameWrapper.input.canvas.getContext();
                    var canvas = context.canvas;
                    point = this.mapToCanvas(point);
                    this.drawLine(new KartwarsBot.Structures.Point2D(0, point.y), new KartwarsBot.Structures.Point2D(canvas.width, point.y), color, width, 0.15, false);
                    this.drawLine(new KartwarsBot.Structures.Point2D(point.x, 0), new KartwarsBot.Structures.Point2D(point.x, canvas.height), color, width, alpha, false);
                };
                /**
                 * Draw a line on the canvas.
                 * @param p1
                 * @param p2
                 * @param color
                 * @param width
                 * @param alpha
                 * @param mapToCanvas
                 */
                CanvasUtilsBase.prototype.drawLine = function (p1, p2, color, width, alpha, mapToCanvas) {
                    if (width === undefined)
                        width = 5;
                    if (alpha === undefined)
                        alpha = 1.0;
                    if (mapToCanvas === undefined)
                        mapToCanvas = true;
                    var context = this.gameWrapper.input.canvas.getContext();
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
                };
                CanvasUtilsBase.prototype.drawTriangle = function (p1, p2, p3, color, width, fill, alpha, mapToCanvas) {
                    if (width === undefined)
                        width = 5;
                    if (alpha === undefined)
                        alpha = 1.0;
                    if (mapToCanvas === undefined)
                        mapToCanvas = true;
                    var context = this.gameWrapper.input.canvas.getContext();
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
                };
                CanvasUtilsBase.prototype.drawPolygon = function (points, color, width, fill, alpha, mapToCanvas) {
                    if (points.length < 3) {
                        throw new Error("Polygon must have more than 2 vertices. Supplied number of vertices: " + points.length);
                    }
                    if (width === undefined)
                        width = 5;
                    if (alpha === undefined)
                        alpha = 1.0;
                    if (mapToCanvas === undefined)
                        mapToCanvas = true;
                    var context = this.gameWrapper.input.canvas.getContext();
                    if (mapToCanvas) {
                        for (var idx = 0, length_1 = points.length; idx < length_1; idx++) {
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
                    for (var idx = 1, length_2 = points.length, point = undefined; point = points[idx], idx < length_2; idx++) {
                        context.lineTo(point.x, point.y);
                    }
                    context.closePath();
                    context.stroke();
                    if (fill) {
                        context.fillStyle = color;
                        context.fill();
                    }
                    context.restore();
                };
                /**
                 * Draw text on the canvas.
                 * @param point
                 * @param text
                 * @param color
                 * @param alpha
                 * @param mapToCanvas
                 */
                CanvasUtilsBase.prototype.drawText = function (point, text, color, alpha, mapToCanvas) {
                    if (alpha === undefined)
                        alpha = 1.0;
                    if (mapToCanvas === undefined)
                        mapToCanvas = true;
                    var context = this.gameWrapper.input.canvas.getContext();
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
                };
                return CanvasUtilsBase;
            }());
            __decorate([
                KartwarsBot.MethodDecoration.bound
            ], CanvasUtilsBase.prototype, "setMouseCoordinates", null);
            __decorate([
                KartwarsBot.MethodDecoration.bound
            ], CanvasUtilsBase.prototype, "mapToMouse", null);
            __decorate([
                KartwarsBot.MethodDecoration.bound
            ], CanvasUtilsBase.prototype, "mapToCanvas", null);
            __decorate([
                KartwarsBot.MethodDecoration.bound
            ], CanvasUtilsBase.prototype, "drawRect", null);
            __decorate([
                KartwarsBot.MethodDecoration.bound
            ], CanvasUtilsBase.prototype, "drawCircle", null);
            __decorate([
                KartwarsBot.MethodDecoration.bound
            ], CanvasUtilsBase.prototype, "drawArc", null);
            __decorate([
                KartwarsBot.MethodDecoration.bound
            ], CanvasUtilsBase.prototype, "drawCross", null);
            __decorate([
                KartwarsBot.MethodDecoration.bound
            ], CanvasUtilsBase.prototype, "drawLine", null);
            __decorate([
                KartwarsBot.MethodDecoration.bound
            ], CanvasUtilsBase.prototype, "drawTriangle", null);
            __decorate([
                KartwarsBot.MethodDecoration.bound
            ], CanvasUtilsBase.prototype, "drawPolygon", null);
            __decorate([
                KartwarsBot.MethodDecoration.bound
            ], CanvasUtilsBase.prototype, "drawText", null);
            Utils.CanvasUtilsBase = CanvasUtilsBase;
        })(Utils = KartwarsBot.Utils || (KartwarsBot.Utils = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
