/// <reference path="CollisionBaseManager.ts" />
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
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Manager;
        (function (Manager) {
            var Collision;
            (function (Collision) {
                /**
                 * Default Collision Manager.
                 */
                var CollisionCourseManager = (function (_super) {
                    __extends(CollisionCourseManager, _super);
                    function CollisionCourseManager() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    CollisionCourseManager.prototype.action = function () {
                        var collisionData = this.getCollisionData();
                        var checkCollisionActivityResult = this.checkCollision(collisionData.collisionElements);
                        if (checkCollisionActivityResult.isValid) {
                            this.bot.stage = KartwarsBot.BotStageEnum.AvoidCollision;
                            return checkCollisionActivityResult;
                        }
                        var checkEncircleActivityResult = this.checkEncircle(collisionData.collisionAngles);
                        if (checkEncircleActivityResult.isValid) {
                            this.bot.stage = KartwarsBot.BotStageEnum.AvoidEncirclement;
                            return checkEncircleActivityResult;
                        }
                        return KartwarsBot.Structures.ActivityResult.CreateInvalidResponse();
                    };
                    /**
                     * Extract collision elements based on the design map.
                     * @param collisionElements
                     * @param designer
                     * @param thisEnemy
                     * @param weaponType
                     * @param dangerType
                     */
                    CollisionCourseManager.prototype.pushCollisionElementsFromCircleDesignMap = function (collisionElements, designer, thisEnemy, weaponType, dangerType) {
                        var scPoint;
                        var designDetails = designer.DesignDetails, thisDesign = designer.getDesign(weaponType);
                        if (!thisDesign) {
                            return;
                        }
                        var sRadius = this.bot.opt.basePlayerWidth / 2;
                        var enemyXPosition = thisEnemy.x, enemyYPosition = thisEnemy.y;
                        var enemyRotation = this.gameWrapper.player.getRotation(thisEnemy), sin = Math.sin(enemyRotation), cos = Math.cos(enemyRotation);
                        var baseRadius = sRadius * this.bot.opt.radiusDangerMultiplier;
                        for (var idRow = 0; idRow < thisDesign.length; idRow++) {
                            var thisRow = thisDesign[idRow];
                            var h = idRow - designDetails.heightCenter;
                            for (var idColumn = 0; idColumn < thisRow.length; idColumn++) {
                                var thisElement = thisRow[idColumn];
                                if (thisElement == 0) {
                                    continue;
                                }
                                var w = idColumn - designDetails.widthCenter;
                                var newRadius = thisElement * baseRadius;
                                var wNewRadius = newRadius * Math.abs(w);
                                var hNewRadius = newRadius * Math.abs(h);
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
                                var newX = enemyXPosition;
                                var newY = enemyYPosition;
                                if (w < 0) {
                                    // Left
                                    newX += sin * wNewRadius;
                                    newY -= cos * wNewRadius;
                                }
                                else if (w > 0) {
                                    // Right
                                    newX -= sin * wNewRadius;
                                    newY += cos * wNewRadius;
                                }
                                if (h < 0) {
                                    // Front
                                    newX += cos * hNewRadius;
                                    newY += sin * hNewRadius;
                                }
                                else if (h > 0) {
                                    // Behind
                                    newX -= cos * hNewRadius;
                                    newY -= sin * hNewRadius;
                                }
                                scPoint = new KartwarsBot.Structures.CollisionElement(newX, newY, enemyRotation, KartwarsBot.CollisionElementType.Circle, dangerType, newRadius /*,
                                true*/);
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
                    };
                    /**
                     * Extract collision elements based on the design map from each enemy.
                     * @param collisionElements
                     */
                    CollisionCourseManager.prototype.pushEnemiesCollisionElements = function (collisionElements) {
                        var enemies = this.gameWrapper.items.getEnemies();
                        for (var enemyIdx = 0, ls = enemies.length; enemyIdx < ls; enemyIdx++) {
                            if (enemies[enemyIdx].id !== window.mainCar.id) {
                                var thisEnemy = enemies[enemyIdx];
                                // Skip if enemy has no weapon or has a non-lethal one
                                if (!thisEnemy.isShieldActivated && (!thisEnemy.weapon || !thisEnemy.weapon.isLethalWeapon)) {
                                    continue;
                                }
                                var designer = KartwarsBot.Design.Circle.WarCarDesigns.Singleton;
                                if (thisEnemy.isShieldActivated) {
                                    this.pushCollisionElementsFromCircleDesignMap(collisionElements, designer, thisEnemy, KartwarsBot.CarWeapon.Shield, KartwarsBot.CollisionElementDangerType.Enemy);
                                }
                                this.pushCollisionElementsFromCircleDesignMap(collisionElements, designer, thisEnemy, thisEnemy.weapon.weaponType, KartwarsBot.CollisionElementDangerType.Enemy);
                            }
                        }
                    };
                    /**
                     * Extract collision elements based on the design map from each element in the collection.
                     * @param collisionElements
                     * @param activatedWeaponsCollection
                     * @param weaponType
                     * @param dangerType
                     */
                    CollisionCourseManager.prototype.pushCustomWeaponsCollisionElements = function (collisionElements, activatedWeaponsCollection, weaponType, dangerType) {
                        for (var enemyIdx = 0, ls = activatedWeaponsCollection.length; enemyIdx < ls; enemyIdx++) {
                            var thisActivatedWeapon = activatedWeaponsCollection[enemyIdx];
                            var designer = KartwarsBot.Design.Circle.WeaponDesigns.Singleton;
                            this.pushCollisionElementsFromCircleDesignMap(collisionElements, designer, thisActivatedWeapon, weaponType, dangerType);
                        }
                    };
                    /**
                     * Extract collision elements based on the design map from each other danger (bombs, mines, rockets).
                     * @param collisionElements
                     */
                    CollisionCourseManager.prototype.pushWeaponsCollisionElements = function (collisionElements) {
                        var misiles = this.gameWrapper.items.getMissiles(), teleMisiles = this.gameWrapper.items.getTeleMissiles(), bombs = this.gameWrapper.items.getBombs(), mines = this.gameWrapper.items.getMines();
                        this.pushCustomWeaponsCollisionElements(collisionElements, misiles, KartwarsBot.CarWeapon.FastRocket, KartwarsBot.CollisionElementDangerType.Misile);
                        this.pushCustomWeaponsCollisionElements(collisionElements, teleMisiles, KartwarsBot.CarWeapon.TeleRocket, KartwarsBot.CollisionElementDangerType.TeleMisile);
                        this.pushCustomWeaponsCollisionElements(collisionElements, bombs, KartwarsBot.CarWeapon.BigBang, KartwarsBot.CollisionElementDangerType.Bomb);
                        this.pushCustomWeaponsCollisionElements(collisionElements, mines, KartwarsBot.CarWeapon.Mine, KartwarsBot.CollisionElementDangerType.Mine);
                    };
                    /**
                     * Get all collision elements.
                     */
                    CollisionCourseManager.prototype.getCollisionData = function () {
                        var collisionElements = [];
                        var collisionAngles;
                        this.pushWeaponsCollisionElements(collisionElements);
                        this.pushEnemiesCollisionElements(collisionElements);
                        collisionAngles = this.getCollisionAngles(collisionElements);
                        collisionElements.sort(KartwarsBot.Utils.ArrayUtils.sortDistance2);
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
                        return new KartwarsBot.Structures.CollisionDataRespons(collisionElements, collisionAngles);
                    };
                    /**
                     * Get intersection points between the supplied Collision Element and the head detector.
                     * @param thisCollisionElement
                     */
                    CollisionCourseManager.prototype.getIntersectionPoints = function (thisCollisionElement) {
                        var pointsIntersection;
                        var collisionCircle = new KartwarsBot.Structures.Circle(thisCollisionElement.x, thisCollisionElement.y, thisCollisionElement.radius);
                        // -1 snake is special case for non kart object.
                        pointsIntersection = this.bot.math.circleIntersect(this.bot.shapesHolster.headCircle, collisionCircle);
                        return pointsIntersection;
                    };
                    /**
                     * Checks to see if you are going to collide with anything in the collision detection radius.
                     */
                    CollisionCourseManager.prototype.checkCollision = function (collisionElements) {
                        window.botFactory.clock.startFrame();
                        var intersectionResult;
                        if (collisionElements.length === 0) {
                            window.botFactory.clock.endFrame();
                            return KartwarsBot.Structures.ActivityResult.CreateInvalidResponse();
                        }
                        var accelerate = KartwarsBot.AccelerationFlag.NotDefined;
                        var playerRotation = this.gameWrapper.player.getRotation();
                        for (var i = 0; i < collisionElements.length; i++) {
                            var thisCollisionElement = collisionElements[i];
                            intersectionResult = this.getIntersectionPoints(thisCollisionElement);
                            if (intersectionResult.status >= KartwarsBot.ShapesIntersectionStatus.ShapeInside) {
                                var intersectionPoint = intersectionResult.points[0];
                                if (intersectionPoint) {
                                    // TODO : Test/Review
                                    if (thisCollisionElement.dangerType == KartwarsBot.CollisionElementDangerType.Misile || thisCollisionElement.dangerType == KartwarsBot.CollisionElementDangerType.TeleMisile) {
                                        if (Math.sqrt(thisCollisionElement.distance2) <= this.bot.opt.closeToImminentDangerRange) {
                                            accelerate = KartwarsBot.AccelerationFlag.Yes;
                                        }
                                    }
                                    if (((intersectionResult.status == KartwarsBot.ShapesIntersectionStatus.HasIntersections) && this.bot.inFrontDangerAngle(intersectionPoint)) ||
                                        (intersectionResult.status == KartwarsBot.ShapesIntersectionStatus.ShapeInside)) {
                                        //
                                        // Case when player is tailed.
                                        var additionalAvoidanceAngle = 0;
                                        var angleOffset = Math.abs(playerRotation - thisCollisionElement.ang);
                                        if (angleOffset < this.opt.tailedDetectorThresholdAngle) {
                                            additionalAvoidanceAngle = this.opt.tailedDetectorAdditionalAvoidanceAngle;
                                            accelerate = KartwarsBot.AccelerationFlag.Yes;
                                        }
                                        //
                                        var activityResult = this.avoidCollisionPoint(intersectionPoint, this.opt.avoidanceAngle - additionalAvoidanceAngle);
                                        window.botFactory.clock.endFrame();
                                        return KartwarsBot.Structures.ActivityResult.CreateValidResponse(activityResult.goalCoordinates, accelerate);
                                    }
                                }
                            }
                        }
                        window.botFactory.clock.endFrame();
                        return KartwarsBot.Structures.ActivityResult.CreateInvalidResponse();
                    };
                    /**
                     * Checks to see if you are surrounded by multiple dangerous point.
                     */
                    CollisionCourseManager.prototype.checkEncircle = function (collisionAngles) {
                        window.botFactory.clock.startFrame();
                        var encircledKart = [];
                        var high = 0;
                        //let highSnake;
                        var enAll = 0;
                        for (var i = 0; i < collisionAngles.length; i++) {
                            if (collisionAngles[i] !== undefined) {
                                // TODO : Review
                                if (KartwarsBot.CollisionElementDangerType.NotDefined != collisionAngles[i].dangerType) {
                                    var dangerType = collisionAngles[i].dangerType;
                                    if (encircledKart[dangerType]) {
                                        encircledKart[dangerType]++;
                                    }
                                    else {
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
                        var playerPosition = this.gameWrapper.player.getPosition();
                        if (high > this.bot.MAXARC * this.bot.opt.enCircleThreshold) {
                            var activityResult = this.headingBestAngle(collisionAngles);
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
                            return KartwarsBot.Structures.ActivityResult.Transfer(activityResult, null, null, KartwarsBot.AccelerationFlag.Yes);
                        }
                        if (enAll > this.bot.MAXARC * this.bot.opt.enCircleAllThreshold) {
                            var activityResult = this.headingBestAngle(collisionAngles);
                            //this.bot.setAcceleration(this.bot.defaultAccel);
                            // Draw encircled player
                            this.canvas.drawEncircledPlayer(this.bot.shapesHolster.playerCircle, false);
                            window.botFactory.clock.endFrame();
                            return KartwarsBot.Structures.ActivityResult.Transfer(activityResult, null, null, KartwarsBot.AccelerationFlag.Default);
                        }
                        else {
                            this.canvas.drawPlayer(this.bot.shapesHolster.playerCircle, this.bot.shapesHolster.playerResourceGatherCircle, this.bot.shapesHolster.headCircle, this.bot.shapesHolster.tailCircle, this.bot.shapesHolster.closeToImminentDangerCircle, this.bot.shapesHolster.playerLeftSideCircle, this.bot.shapesHolster.playerRightSideCircle, this.bot.opt.frontDangerAngle, this.bot.opt.tailDangerAngle, this.bot.opt.frontResourceGatherAngle);
                        }
                        // TODO : Review
                        //this.bot.setAcceleration(this.bot.defaultAccel);
                        window.botFactory.clock.endFrame();
                        return KartwarsBot.Structures.ActivityResult.CreateInvalidResponse();
                    };
                    return CollisionCourseManager;
                }(Collision.CollisionBaseManager));
                Collision.CollisionCourseManager = CollisionCourseManager;
            })(Collision = Manager.Collision || (Manager.Collision = {}));
        })(Manager = KartwarsBot.Manager || (KartwarsBot.Manager = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
