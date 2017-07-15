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
        var Tactics;
        (function (Tactics) {
            var Resource;
            (function (Resource) {
                var Food;
                (function (Food) {
                    /**
                     * Find Closest Cluster Tactic.
                     */
                    var FindClosestCluster = (function () {
                        // Constructor
                        function FindClosestCluster(bot, gameWrapper, canvas) {
                            this.bot = bot;
                            this.gameWrapper = gameWrapper;
                            this.canvas = canvas;
                            this.opt = new Food.FindClosestClusterOptions();
                            this.foodClusterWrapper = new KartwarsBot.Structures.ClusterWrapper();
                        }
                        FindClosestCluster.prototype.noop = function () {
                        };
                        // TODO : Add Weapons to list too
                        FindClosestCluster.prototype.action = function (food) {
                            window.botFactory.clock.startFrame();
                            if (food == undefined) {
                                food = this.gameWrapper.items.getFood();
                            }
                            //this.bot.stage = BotStageEnum.SeekFoodCluster;
                            var localFoodClusters = [];
                            var playerPosition = this.gameWrapper.player.getPosition();
                            var playerRadius = this.opt.scanRadius;
                            food = food.filter(function (el) {
                                return el.distance <= playerRadius;
                            });
                            window.botFactory.clock.startFrame('ElementsDensity');
                            var clusters = KartwarsBot.Utils.MathUtils.get2DElementsDensity(food, this.opt.sectorSize, this.opt.minimumElementsPerCluster);
                            window.botFactory.clock.endFrame('ElementsDensity');
                            // Compute radius for each cluster.
                            for (var clusterIdx = 0, clusterLength = clusters.length; clusterIdx < clusterLength; clusterIdx++) {
                                var indexesInThisCluster = clusters[clusterIdx];
                                var clusterMinX = Infinity, clusterMinY = Infinity, clusterMaxX = -Infinity, clusterMaxY = -Infinity;
                                var localSprites = [];
                                for (var clusterIdy = 0, spritesLength = indexesInThisCluster.length; clusterIdy < spritesLength; clusterIdy++) {
                                    var element = indexesInThisCluster[clusterIdy];
                                    var sprite = food[element];
                                    clusterMinX = Math.min(clusterMinX, sprite.x);
                                    clusterMinY = Math.min(clusterMinY, sprite.y);
                                    clusterMaxX = Math.max(clusterMaxX, sprite.x);
                                    clusterMaxY = Math.max(clusterMaxY, sprite.y);
                                    localSprites.push(sprite);
                                }
                                var clusterMedianX = (clusterMinX + clusterMaxX) / 2, clusterMedianY = (clusterMinY + clusterMaxY) / 2, clusterRadius = Math.max(clusterMaxX - clusterMinX, clusterMaxY - clusterMinY) / 2;
                                var circle = new KartwarsBot.Structures.Circle(clusterMedianX, clusterMedianY, clusterRadius);
                                var thisCluster = new KartwarsBot.Structures.Cluster(circle, localSprites);
                                thisCluster.distance = KartwarsBot.Utils.MathUtils.getDistance(thisCluster, playerPosition);
                                localFoodClusters.push(thisCluster);
                                // Draw food cluster
                                this.canvas.drawFoodCluster(circle, indexesInThisCluster.length);
                            }
                            // Draw food cluster scan boundary
                            this.canvas.drawFoodClusterBoundary(playerRadius);
                            this.foodClusterWrapper.foodClusters = localFoodClusters;
                            window.botFactory.clock.endFrame();
                            return KartwarsBot.Structures.ActivityResult.CreateCustomResponse(this.foodClusterWrapper);
                        };
                        return FindClosestCluster;
                    }());
                    __decorate([
                        KartwarsBot.MethodDecoration.trace
                    ], FindClosestCluster.prototype, "action", null);
                    Food.FindClosestCluster = FindClosestCluster;
                })(Food = Resource.Food || (Resource.Food = {}));
            })(Resource = Tactics.Resource || (Tactics.Resource = {}));
        })(Tactics = KartwarsBot.Tactics || (KartwarsBot.Tactics = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
