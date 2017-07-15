var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Tactics;
        (function (Tactics) {
            var Fight;
            (function (Fight) {
                /**
                 * Chase Closest enemy Tactic.
                 */
                var ChaseClosest = (function () {
                    // Constructor
                    function ChaseClosest(bot, gameWrapper, canvas) {
                        this.bot = bot;
                        this.gameWrapper = gameWrapper;
                        this.canvas = canvas;
                    }
                    /**
                     * Chase an enemy if player has a weapon that shoots in front.
                     */
                    ChaseClosest.prototype.action = function (projectileMagnitude) {
                        var enemies = this.gameWrapper.items.getEnemies();
                        var resetEnemy = true;
                        if (this.currentTarget != undefined) {
                            var enemyId = this.currentTarget.enemyId;
                            if (enemyId != undefined) {
                                for (var i = 0, ls = enemies.length; i < ls && enemies[i] !== null; i++) {
                                    var thisEnemy = enemies[i];
                                    if (thisEnemy.id == enemyId) {
                                        this.currentTarget.x = thisEnemy.x;
                                        this.currentTarget.y = thisEnemy.y;
                                        resetEnemy = false;
                                        break;
                                    }
                                }
                            }
                        }
                        if (resetEnemy) {
                            if (enemies.length > 0) {
                                for (var i = 0, ls = enemies.length; i < ls && enemies[i] !== null; i++) {
                                    var thisEnemy = enemies[i];
                                    if (thisEnemy.velocity) {
                                        if (window.botFactory.developerInterface.opt.individual.chaseNewEnemy) {
                                            window.log("Chasing new enemy with id " + thisEnemy.id);
                                        }
                                        this.currentTarget = {
                                            reference: thisEnemy,
                                            x: thisEnemy.x,
                                            y: thisEnemy.y,
                                            enemyId: thisEnemy.id
                                        };
                                        break;
                                    }
                                }
                            }
                        }
                        if (this.currentTarget) {
                            var selectedEnemy = this.currentTarget.reference;
                            if (selectedEnemy) {
                                var goalCoordinates = void 0;
                                this.bot.stage = KartwarsBot.BotStageEnum.InterceptEnemy;
                                // This might fail if there's no quadratic solution
                                if (projectileMagnitude > 0) {
                                    goalCoordinates = KartwarsBot.Utils.MathUtils.predictIntersectionEx(window.mainCar, selectedEnemy, projectileMagnitude);
                                }
                                if (!goalCoordinates) {
                                    goalCoordinates = KartwarsBot.Utils.MathUtils.predictIntersection(window.mainCar, selectedEnemy);
                                }
                                // Draw intersection prediction
                                this.canvas.drawIntersectionPrediction(goalCoordinates);
                                return KartwarsBot.Structures.ActivityResult.CreateValidResponse(goalCoordinates);
                            }
                        }
                        return KartwarsBot.Structures.ActivityResult.CreateInvalidResponse();
                    };
                    return ChaseClosest;
                }());
                Fight.ChaseClosest = ChaseClosest;
            })(Fight = Tactics.Fight || (Tactics.Fight = {}));
        })(Tactics = KartwarsBot.Tactics || (KartwarsBot.Tactics = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
