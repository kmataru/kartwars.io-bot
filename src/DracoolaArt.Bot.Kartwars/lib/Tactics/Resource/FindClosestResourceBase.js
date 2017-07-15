var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Tactics;
        (function (Tactics) {
            var Resource;
            (function (Resource) {
                /**
                 * Base Find Closest Resource Tactic.
                 */
                var FindClosestResourceBase = (function () {
                    // Constructor
                    function FindClosestResourceBase(bot, gameWrapper, canvas) {
                        this.bot = bot;
                        this.gameWrapper = gameWrapper;
                        this.canvas = canvas;
                        this.currentTarget = undefined;
                    }
                    FindClosestResourceBase.prototype.noop = function () {
                        this.currentTarget = undefined;
                    };
                    FindClosestResourceBase.prototype.action = function (resources) {
                        if (!this.stabilizeResource(resources)) {
                            for (var i = 0, ll = resources.length, thisResource = null; i < ll && (thisResource = resources[i]) !== null; i++) {
                                if (!this.canBeCollected(thisResource)) {
                                    thisResource.distance = Infinity;
                                }
                            }
                            // Sort by distance
                            resources.sort(KartwarsBot.Utils.ArrayUtils.sortDistance);
                            //
                            // Select first available resource
                            var firstResource = null;
                            if (typeof (firstResource = resources[0]) !== 'undefined') {
                                this.currentTarget = new KartwarsBot.Structures.Bot2Point2D(firstResource.x, firstResource.y, 50, 0.1, // ??
                                0, 0, firstResource.id);
                            }
                            else {
                                this.currentTarget = new KartwarsBot.Structures.Bot2Point2D(this.bot.worldCenterX, this.bot.worldCenterY, 0, 0, 0, 0, undefined);
                            }
                        }
                        return KartwarsBot.Structures.ActivityResult.CreateValidResponse(this.currentTarget);
                    };
                    /**
                     * Determines if the resource is easy accessible and does require too many turns and misses.
                     * @param thisResource
                     */
                    FindClosestResourceBase.prototype.canBeCollected = function (thisResource) {
                        var thisResourceCircle = new KartwarsBot.Structures.Circle(thisResource.x, thisResource.y, 2);
                        if (!this.bot.inFrontResourceGatherAngle(thisResourceCircle)) {
                            return false;
                        }
                        var leftSideCircleIntersection = this.bot.math.circleIntersect(thisResourceCircle, this.bot.shapesHolster.playerLeftSideCircle);
                        if (leftSideCircleIntersection.status >= KartwarsBot.ShapesIntersectionStatus.ShapeInside) {
                            return false;
                        }
                        var rightSideCircleIntersection = this.bot.math.circleIntersect(thisResourceCircle, this.bot.shapesHolster.playerRightSideCircle);
                        if (rightSideCircleIntersection.status >= KartwarsBot.ShapesIntersectionStatus.ShapeInside) {
                            return false;
                        }
                        return true;
                    };
                    /**
                     * Decides if last chosen resource still exists and is collectable so there won't created a chaotic decision every time.
                     * @param resources
                     * @return true if resource is still valid, false otherwise.
                     */
                    FindClosestResourceBase.prototype.stabilizeResource = function (resources) {
                        //if (this.currentResource != undefined && this.bot.inFrontAngle(this.currentResource)) {
                        if (this.currentTarget != undefined) {
                            var resourceId = this.currentTarget.resourceId;
                            if (resourceId != undefined) {
                                for (var idx = 0, ll = resources.length, thisResource = null; idx < ll && (thisResource = resources[idx]) !== null; idx++) {
                                    if (thisResource.id == resourceId) {
                                        return this.canBeCollected(thisResource);
                                    }
                                }
                            }
                        }
                        return false;
                    };
                    /**
                     * Draw close resources based on the `canBeCollected` method.
                     * @param resources
                     * @param baseRadius
                     */
                    FindClosestResourceBase.prototype.drawResources = function (resources, baseRadius) {
                        if (this.canvas.opt.visualDebugging && this.canvas.opt.draw.player) {
                            var playerResourceGatherRadius = this.bot.shapesHolster.playerResourceGatherCircle.radius;
                            for (var i = 0, ll = resources.length, thisResource = null; i < ll && (thisResource = resources[i]) !== null; i++) {
                                if (thisResource.distance <= playerResourceGatherRadius) {
                                    var canBeCollected = this.canBeCollected(thisResource);
                                    this.canvas.drawResource(new KartwarsBot.Structures.Circle(thisResource.x, thisResource.y, baseRadius), canBeCollected);
                                }
                                else {
                                    break;
                                }
                            }
                        }
                    };
                    return FindClosestResourceBase;
                }());
                Resource.FindClosestResourceBase = FindClosestResourceBase;
            })(Resource = Tactics.Resource || (Tactics.Resource = {}));
        })(Tactics = KartwarsBot.Tactics || (KartwarsBot.Tactics = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
