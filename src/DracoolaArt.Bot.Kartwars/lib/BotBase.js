/// <reference path="_references.ts" />
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
        var BotMathWrapper = (function () {
            // Constructor
            function BotMathWrapper(gameWrapper, canvas) {
                this.gameWrapper = gameWrapper;
                this.canvas = canvas;
            }
            /**
             * Checks if two circles intersects.
             * @param circle1
             * @param circle2
             */
            BotMathWrapper.prototype.circleIntersect = function (circle1, circle2) {
                var intersections = KartwarsBot.Utils.GeometryIntersectionsUtils.circleCircleIntersect(circle1, circle2);
                if (intersections.status == KartwarsBot.ShapesIntersectionStatus.ShapeInside) {
                    intersections.addPoint(new KartwarsBot.Structures.BotPoint2D(circle2.x, circle2.y));
                }
                else if (intersections.status != KartwarsBot.ShapesIntersectionStatus.HasIntersections) {
                    return intersections;
                }
                var playerPosition = this.gameWrapper.player.getPosition();
                for (var intersectionIdx = 0, ls = intersections.length; intersectionIdx < ls; intersectionIdx++) {
                    var point = intersections.points[intersectionIdx];
                    point.ang = KartwarsBot.Utils.MathUtils.fastAtan2(point.y - playerPosition.y, point.x - playerPosition.x);
                    // Draw collision point
                    this.canvas.drawCollisionPoint(point);
                }
                // Draw collision circle
                this.canvas.drawCollisionCircle(circle2);
                return intersections;
            };
            /**
             * Checks if the circle and the polygon intersects.
             * @param circle
             * @param polygon
             */
            BotMathWrapper.prototype.circlePolygonIntersect = function (circle, polygon) {
                var intersections = KartwarsBot.Utils.GeometryIntersectionsUtils.intersectCirclePolygon(circle, circle.radius, polygon);
                if (intersections.status == KartwarsBot.ShapesIntersectionStatus.ShapeInside) {
                    intersections.addPoint(new KartwarsBot.Structures.BotPoint2D(polygon.x, polygon.y));
                }
                else if (intersections.status != KartwarsBot.ShapesIntersectionStatus.HasIntersections) {
                    return intersections;
                }
                var playerPosition = this.gameWrapper.player.getPosition();
                for (var intersectionIdx = 0, ls = intersections.length; intersectionIdx < ls; intersectionIdx++) {
                    var point = intersections.points[intersectionIdx];
                    point.ang = KartwarsBot.Utils.MathUtils.fastAtan2(point.y - playerPosition.y, point.x - playerPosition.x);
                    // Draw collision point
                    this.canvas.drawCollisionPoint(point);
                }
                // Draw collision circle
                this.canvas.drawCollisionPolygon(polygon);
                return intersections;
            };
            return BotMathWrapper;
        }());
        var BotBase = (function () {
            // Constructor
            function BotBase(gameWrapper, canvas) {
                this.gameWrapper = gameWrapper;
                this.canvas = canvas;
                this.isBotRunning = false;
                this.isBotEnabled = true;
                this.stage = KartwarsBot.BotStageEnum.NotStarted;
                this.scores = [];
                this.defaultAccel = 0;
                this.sectorBoxSide = 0;
                this.shapesHolster = {
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
                // TODO : Review
                this.speedMult = 25 / 5.78;
                var worldBounds = this.gameWrapper.world.getWorkingBounds();
                this.worldCenterX = (worldBounds.width / 2);
                this.worldCenterY = (worldBounds.height / 2);
                this.opt = new KartwarsBot.BotOptions();
                this.math = new BotMathWrapper(gameWrapper, canvas);
                this.goal = new KartwarsBot.Structures.GoalData();
            }
            Object.defineProperty(BotBase.prototype, "kartWidth", {
                get: function () { return this.opt.basePlayerWidth; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BotBase.prototype, "kartRadius", {
                get: function () { return this.kartWidth / 2; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BotBase.prototype, "MAXARC", {
                // affects enclosed detection
                get: function () { return (2 * Math.PI) / this.opt.arcSize; },
                enumerable: true,
                configurable: true
            });
            /**
             * Set Acceleration.
             * @param flag
             */
            BotBase.prototype.setAcceleration = function (flag) {
                if (flag == KartwarsBot.AccelerationFlag.Yes) {
                    if (!window.mainCar.isAccelerating) {
                        window.mainCar.isAccelerating = true;
                        if (window.botFactory.developerInterface.opt.individual.acceleration) {
                            window.log('Speed up!!');
                        }
                        var e = new MouseEvent('mousedown', {
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
                else {
                    if (window.mainCar.isAccelerating) {
                        window.mainCar.isAccelerating = false;
                        if (window.botFactory.developerInterface.opt.individual.acceleration) {
                            window.log('Stop speeding up!!');
                        }
                        var e = new MouseEvent('mouseup', {
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
            };
            /**
             * Fires weapon. (Obsolete)
             */
            BotBase.prototype.fireWeapon = function () {
                if (window.mainCar.weapon) {
                    var thisWeapon = window.mainCar.weapon;
                    if (thisWeapon.weaponType != KartwarsBot.CarWeapon.None) {
                        if (!thisWeapon.weaponFired) {
                            thisWeapon.weaponFired = true;
                            // window.log('Fire weapon!!');
                            var e = new MouseEvent('mousedown', {
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
                    else {
                        if (thisWeapon.weaponFired == true) {
                            thisWeapon.weaponFired = false;
                            // window.log('Stop firing weapon!!');
                            var e = new MouseEvent('mouseup', {
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
            };
            /**
             * Fires weapon once. (Experimental)
             */
            BotBase.prototype.fireWeaponTick = function () {
                if (window.mainCar.weapon) {
                    var thisWeapon = window.mainCar.weapon;
                    if (thisWeapon.weaponType != KartwarsBot.CarWeapon.None) {
                        // window.log('Fire weapon!!');
                        var mouseDownEvent = new MouseEvent('mousedown', {
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
                        var mouseUpEvent = new MouseEvent('mouseup', {
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
            };
            /**
             * On Player Death's event.
             */
            BotBase.prototype.onPlayerDeath = function () {
                this.stage = KartwarsBot.BotStageEnum.NotStarted;
            };
            /**
             * Change heading to angle.
             * @param angle
             */
            BotBase.prototype.changeHeadingAbs = function (angle) {
                var playerPosition = this.gameWrapper.player.getPosition();
                var goalCoordinates = new KartwarsBot.Structures.Point2D(
                /*Math.round(*/ playerPosition.x + (Math.cos(angle) * (this.shapesHolster.headCircle.radius)) /*)*/, 
                /*Math.round(*/ playerPosition.y + (Math.sin(angle) * (this.shapesHolster.headCircle.radius)) /*)*/);
                return KartwarsBot.Structures.ActivityResult.CreateValidResponse(goalCoordinates);
            };
            /**
             * Set distance2 from player.
             * @param collisionElement
             */
            BotBase.prototype.setDistance2FromPlayer = function (collisionElement) {
                var playerPosition = this.gameWrapper.player.getPosition();
                collisionElement.distance2 = KartwarsBot.Utils.MathUtils.getDistance2(playerPosition, collisionElement);
                return collisionElement;
            };
            /**
             * Checks if the given point is in the specified angle based on player's position and rotation.
             * @param point
             * @param radiusCheck
             */
            BotBase.prototype.inFrontAngle = function (point, angle, radiusCheck) {
                var playerPosition = this.gameWrapper.player.getPosition();
                var playerRotation = this.gameWrapper.player.getRotation();
                return KartwarsBot.Utils.GeometryIntersectionsUtils.isInsideArcSector(
                //new Point2D(point.x, point.y),
                point, 
                //new Point2D(playerPosition.x, playerPosition.y),
                playerPosition, radiusCheck, playerRotation - (angle / 2), playerRotation + (angle / 2));
            };
            BotBase.prototype.inBackAngle = function (point, angle, radiusCheck) {
                var playerPosition = this.gameWrapper.player.getPosition();
                var playerRotation = this.gameWrapper.player.getRotation();
                return KartwarsBot.Utils.GeometryIntersectionsUtils.isInsideArcSector(
                //new Point2D(point.x, point.y),
                point, 
                //new Point2D(playerPosition.x, playerPosition.y),
                playerPosition, radiusCheck, playerRotation + Math.PI - (angle / 2), playerRotation + Math.PI + (angle / 2));
            };
            /**
             * Checks if the given point is in frontResourceGatherAngle based on player's position and rotation.
             * @param point
             * @param radiusCheck
             */
            BotBase.prototype.inFrontResourceGatherAngle = function (point, radiusCheck) {
                if (radiusCheck == undefined) {
                    radiusCheck = this.shapesHolster.playerResourceGatherCircle.radius;
                }
                return this.inFrontAngle(point, this.opt.frontResourceGatherAngle, radiusCheck);
            };
            /**
             * Checks if the given point is in frontDangerAngle based on player's position and rotation.
             * @param point
             * @param radiusCheck
             */
            BotBase.prototype.inFrontDangerAngle = function (point, radiusCheck) {
                if (radiusCheck == undefined) {
                    radiusCheck = this.shapesHolster.playerCircle.radius;
                }
                return this.inFrontAngle(point, this.opt.frontDangerAngle, radiusCheck);
            };
            /**
             * Checks if the given point is in tailDangerAngle based on player's position and rotation.
             * @param point
             * @param radiusCheck
             */
            BotBase.prototype.inTailDangerAngle = function (point, radiusCheck) {
                if (radiusCheck == undefined) {
                    radiusCheck = this.shapesHolster.playerCircle.radius;
                }
                return this.inFrontAngle(point, this.opt.tailDangerAngle, radiusCheck);
            };
            BotBase.prototype.inFront = function (point) {
                return this.inFrontAngle(point, Math.PI, Infinity);
            };
            BotBase.prototype.inBack = function (point) {
                return this.inBackAngle(point, Math.PI, Infinity);
            };
            /**
             * Checks if player is alive and bot is enabled.
             */
            BotBase.prototype.isBotInGame = function () {
                return (this.gameWrapper.util.isPlaying) && (this.isBotEnabled);
            };
            return BotBase;
        }());
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "setAcceleration", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "fireWeapon", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "fireWeaponTick", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "changeHeadingAbs", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "setDistance2FromPlayer", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "inFrontAngle", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "inBackAngle", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "inFrontResourceGatherAngle", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "inFrontDangerAngle", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "inTailDangerAngle", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "inFront", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "inBack", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "isBotInGame", null);
        KartwarsBot.BotBase = BotBase;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
