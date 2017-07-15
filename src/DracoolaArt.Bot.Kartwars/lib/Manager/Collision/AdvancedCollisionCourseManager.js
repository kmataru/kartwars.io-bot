/// <reference path="../../_references.ts" />
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
                 * Enhanced Collision Manager with polygon detectors.
                 */
                var AdvancedCollisionCourseManager = (function (_super) {
                    __extends(AdvancedCollisionCourseManager, _super);
                    function AdvancedCollisionCourseManager() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    /**
                     * Extract collision elements based on the design map.
                     * @param collisionElements
                     * @param designer
                     * @param thisEnemy
                     * @param weaponType
                     * @param dangerType
                     */
                    AdvancedCollisionCourseManager.prototype.pushCollisionElementsFromPolygonDesignMap = function (collisionElements, designer, thisEnemy, weaponType, dangerType) {
                        var scPoint;
                        var thisDesign = designer.getDesign(weaponType);
                        if (!thisDesign) {
                            return;
                        }
                        var enemyXPosition = thisEnemy.x, enemyYPosition = thisEnemy.y;
                        var enemyVector = new Victor(enemyXPosition, enemyYPosition);
                        var enemyRotation = this.gameWrapper.player.getRotation(thisEnemy), sin = Math.sin(enemyRotation), cos = Math.cos(enemyRotation);
                        var scaling = this.bot.kartRadius * this.bot.opt.radiusDangerMultiplier;
                        var thisDesignCopy = Array(thisDesign.length);
                        for (var idx = 0; idx < thisDesignCopy.length; idx++) {
                            var thisPoint = (thisDesignCopy[idx] = thisDesign[idx].clone());
                            thisPoint
                                .rotate(enemyRotation)
                                .multiplyScalar(scaling)
                                .add(enemyVector);
                        }
                        scPoint = new KartwarsBot.Structures.CollisionElement(enemyXPosition, enemyYPosition, enemyRotation, KartwarsBot.CollisionElementType.Polygon, dangerType, scaling /*,
                        true*/);
                        scPoint.geometry = thisDesignCopy;
                        //this.bot.setDistance2FromPlayer(scPoint);
                        //this.addCollisionAngle(scPoint);
                        collisionElements.push(scPoint);
                        scPoint = undefined;
                    };
                    /**
                     * Extract collision elements based on the design map from each enemy.
                     * @param collisionElements
                     */
                    AdvancedCollisionCourseManager.prototype.pushEnemiesCollisionElements = function (collisionElements) {
                        var enemies = this.gameWrapper.items.getEnemies();
                        for (var enemyIdx = 0, ls = enemies.length; enemyIdx < ls; enemyIdx++) {
                            if (enemies[enemyIdx].id !== window.mainCar.id) {
                                var thisEnemy = enemies[enemyIdx];
                                // Skip if enemy has no weapon or has a non-lethal one
                                if (!thisEnemy.isShieldActivated && (!thisEnemy.weapon || !thisEnemy.weapon.isLethalWeapon)) {
                                    continue;
                                }
                                var designer = KartwarsBot.Design.Polygon.WarCarDesigns.Singleton;
                                if (thisEnemy.isShieldActivated) {
                                    this.pushCollisionElementsFromPolygonDesignMap(collisionElements, designer, thisEnemy, KartwarsBot.CarWeapon.Shield, KartwarsBot.CollisionElementDangerType.Enemy);
                                }
                                this.pushCollisionElementsFromPolygonDesignMap(collisionElements, designer, thisEnemy, thisEnemy.weapon.weaponType, KartwarsBot.CollisionElementDangerType.Enemy);
                            }
                        }
                    };
                    /**
                     * Get all collision elements.
                     */
                    AdvancedCollisionCourseManager.prototype.getCollisionData = function () {
                        var collisionElements = [];
                        var collisionAngles;
                        _super.prototype.pushWeaponsCollisionElements.call(this, collisionElements);
                        this.pushEnemiesCollisionElements(collisionElements);
                        collisionAngles = this.getCollisionAngles(collisionElements);
                        collisionElements.sort(KartwarsBot.Utils.ArrayUtils.sortDistance2);
                        this.canvas.drawCollisionElements(collisionElements, collisionAngles);
                        return new KartwarsBot.Structures.CollisionDataRespons(collisionElements, collisionAngles);
                    };
                    /**
                     * Get intersection points betwwen the supplied Collision Element and the head detector.
                     * @param thisCollisionElement
                     */
                    AdvancedCollisionCourseManager.prototype.getIntersectionPoints = function (thisCollisionElement) {
                        var pointsIntersection;
                        switch (thisCollisionElement.shapeType) {
                            case KartwarsBot.CollisionElementType.Circle:
                                {
                                    var collisionCircle = new KartwarsBot.Structures.Circle(thisCollisionElement.x, thisCollisionElement.y, thisCollisionElement.radius);
                                    pointsIntersection = this.bot.math.circleIntersect(this.bot.shapesHolster.headCircle, collisionCircle);
                                }
                                break;
                            case KartwarsBot.CollisionElementType.Polygon:
                                {
                                    var collisionPolygon = new KartwarsBot.Structures.Polygon(thisCollisionElement.x, thisCollisionElement.y, thisCollisionElement.geometry);
                                    pointsIntersection = this.bot.math.circlePolygonIntersect(this.bot.shapesHolster.headCircle, collisionPolygon);
                                }
                                break;
                            default: {
                                throw new Error("Invalid CollisionElementType: '" + thisCollisionElement.shapeType + "'");
                            }
                        }
                        return pointsIntersection;
                    };
                    return AdvancedCollisionCourseManager;
                }(Collision.CollisionCourseManager));
                Collision.AdvancedCollisionCourseManager = AdvancedCollisionCourseManager;
            })(Collision = Manager.Collision || (Manager.Collision = {}));
        })(Manager = KartwarsBot.Manager || (KartwarsBot.Manager = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
