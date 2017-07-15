/// <reference path="../../_references.ts" />
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Manager;
        (function (Manager) {
            var Collision;
            (function (Collision) {
                var CollisionManagerOptions = (function () {
                    function CollisionManagerOptions() {
                        this.avoidanceAngle = (Math.PI / 16 * 15);
                        this.tailedDetectorThresholdAngle = (Math.PI / 16);
                        this.tailedDetectorAdditionalAvoidanceAngle = (Math.PI / 16 * 2);
                    }
                    return CollisionManagerOptions;
                }());
                Collision.CollisionManagerOptions = CollisionManagerOptions;
                var CollisionBaseManager = (function () {
                    function CollisionBaseManager(bot, gameWrapper, canvas) {
                        this.bot = bot;
                        this.gameWrapper = gameWrapper;
                        this.canvas = canvas;
                        this.opt = new CollisionManagerOptions();
                    }
                    // get collision angle index, expects angle +/i 0 to Math.PI
                    CollisionBaseManager.prototype.getAngleIndex = function (angle) {
                        var index;
                        if (angle < 0) {
                            angle += 2 * Math.PI;
                        }
                        index = Math.round(angle * (1 / this.bot.opt.arcSize));
                        if (index === this.bot.MAXARC) {
                            return 0;
                        }
                        return index;
                    };
                    /**
                     * Change heading to the best angle for avoidance.
                     */
                    CollisionBaseManager.prototype.headingBestAngle = function (collisionAngles) {
                        var best;
                        var distance;
                        var openAngles = [];
                        var openStart;
                        var sIndex = this.getAngleIndex(this.gameWrapper.player.getRotation()) + this.bot.MAXARC / 2;
                        if (sIndex > this.bot.MAXARC) {
                            sIndex -= this.bot.MAXARC;
                        }
                        for (var i = 0; i < this.bot.MAXARC; i++) {
                            if (collisionAngles[i] === undefined) {
                                distance = 0;
                                if (openStart === undefined)
                                    openStart = i;
                            }
                            else {
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
                            if (openAngles[0].sz < 0)
                                openAngles[0].sz += this.bot.MAXARC;
                        }
                        else if (openStart) {
                            openAngles.push({ openStart: openStart, openEnd: openStart, sz: 0 });
                        }
                        if (openAngles.length > 0) {
                            openAngles.sort(KartwarsBot.Utils.ArrayUtils.sortSz);
                            return this.bot.changeHeadingAbs((openAngles[0].openEnd - openAngles[0].sz / 2) * this.bot.opt.arcSize);
                        }
                        else {
                            return this.bot.changeHeadingAbs(best.aIndex * this.bot.opt.arcSize);
                        }
                    };
                    /**
                     * Avoid collision point by ang.
                     * ang radians <= Math.PI (180deg)
                     * @param point
                     * @param ang
                     */
                    // TODO : Increase ang value if too low.
                    CollisionBaseManager.prototype.avoidCollisionPoint = function (point, ang) {
                        var playerPosition = this.gameWrapper.player.getPosition();
                        if (ang === undefined || ang > Math.PI) {
                            ang = Math.PI;
                        }
                        var end = new KartwarsBot.Structures.Point2D(playerPosition.x + 2000 * this.bot.cos, playerPosition.y + 2000 * this.bot.sin);
                        // Draw collision avoidance
                        this.canvas.drawCollisionAvoidance(point, end);
                        if (KartwarsBot.Utils.MathUtils.isLeft(playerPosition, end, point)) {
                            return this.bot.changeHeadingAbs(point.ang - ang);
                        }
                        else {
                            return this.bot.changeHeadingAbs(point.ang + ang);
                        }
                    };
                    /**
                     * Extract Collision Angles.
                     * @param collisionElements
                     */
                    CollisionBaseManager.prototype.getCollisionAngles = function (collisionElements) {
                        var collisionAngles = [];
                        var playerPosition = this.gameWrapper.player.getPosition();
                        for (var idx = 0, ll = collisionElements.length; idx < ll; idx++) {
                            var collisionElement = collisionElements[idx];
                            // Ensures the distance is set
                            this.bot.setDistance2FromPlayer(collisionElement);
                            var ang = KartwarsBot.Utils.MathUtils.fastAtan2(Math.round(collisionElement.y - playerPosition.y), Math.round(collisionElement.x - playerPosition.x));
                            var aIndex = this.getAngleIndex(ang);
                            var actualDistance = Math.round(Math.pow(Math.sqrt(collisionElement.distance2) - collisionElement.radius, 2));
                            // Add to collisionAngles if distance is closer
                            if (collisionAngles[aIndex] === undefined || collisionAngles[aIndex].distance2 > collisionElement.distance2) {
                                collisionAngles[aIndex] = new KartwarsBot.Structures.CollisionAngle(Math.round(collisionElement.x), Math.round(collisionElement.y), ang, collisionElement.dangerType, actualDistance, collisionElement.radius, aIndex);
                            }
                        }
                        return collisionAngles;
                    };
                    return CollisionBaseManager;
                }());
                Collision.CollisionBaseManager = CollisionBaseManager;
            })(Collision = Manager.Collision || (Manager.Collision = {}));
        })(Manager = KartwarsBot.Manager || (KartwarsBot.Manager = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
