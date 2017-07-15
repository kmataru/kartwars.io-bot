/* tslint:disable */
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
        var Strategy;
        (function (Strategy) {
            /**
             * Pursuit Enemy Test Strategy.
             */
            var PursuitBotStrategy = (function (_super) {
                __extends(PursuitBotStrategy, _super);
                function PursuitBotStrategy() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.aggressivity = 0;
                    _this.usePrediction = false;
                    return _this;
                }
                PursuitBotStrategy.prototype.onPlayerDeath = function () {
                    //
                };
                PursuitBotStrategy.prototype.action = function () {
                    var foodTacticsActivityResult = null;
                    window.botFactory.clock.startFrame();
                    var resetEnemy = true;
                    this.gameWrapper.items.reset();
                    var enemies = this.gameWrapper.items.getEnemies();
                    if (this.currentEnemy != undefined) {
                        var enemyId = this.currentEnemy.enemyId;
                        if (enemyId != undefined) {
                            for (var i = 0, ls = enemies.length; i < ls && enemies[i] !== null; i++) {
                                var thisEnemy = enemies[i];
                                if (thisEnemy.id == enemyId) {
                                    this.currentEnemy.x = thisEnemy.x;
                                    this.currentEnemy.y = thisEnemy.y;
                                    resetEnemy = false;
                                    break;
                                }
                            }
                        }
                    }
                    if (resetEnemy) {
                        if (enemies.length > 0) {
                            var thisEnemy = enemies[0];
                            this.currentEnemy = {
                                thisEnemy: thisEnemy,
                                x: thisEnemy.x,
                                y: thisEnemy.y,
                                enemyId: thisEnemy.id
                            };
                        }
                        else {
                            this.currentEnemy = {
                                x: this.bot.worldCenterX,
                                y: this.bot.worldCenterY,
                                thisEnemy: undefined,
                                enemyId: undefined
                            };
                        }
                    }
                    var preprocessedGoalCoordinates = new KartwarsBot.Structures.Point2D(this.currentEnemy.x, this.currentEnemy.y);
                    var selectedEnemy = this.currentEnemy.thisEnemy;
                    if (this.usePrediction && selectedEnemy) {
                        if (selectedEnemy.velocity) {
                            preprocessedGoalCoordinates = KartwarsBot.Utils.MathUtils.predictIntersection(window.mainCar, selectedEnemy);
                            var goalCoordinatesEx = KartwarsBot.Utils.MathUtils.predictIntersectionEx(window.mainCar, selectedEnemy, 20.25);
                            if (goalCoordinatesEx) {
                                var playerPosition = this.gameWrapper.player.getPosition();
                                this.canvas.drawLine(playerPosition, goalCoordinatesEx, 'black', 10, 0.75);
                                this.canvas.drawCircle(goalCoordinatesEx, this.canvas.opt.colors.predictionCircle, false, 0.75);
                            }
                        }
                    }
                    foodTacticsActivityResult = KartwarsBot.Structures.ActivityResult.CreateValidResponse(preprocessedGoalCoordinates);
                    window.botFactory.clock.endFrame();
                    return foodTacticsActivityResult;
                };
                PursuitBotStrategy.prototype.foodAction = function () {
                    // NOOP
                };
                PursuitBotStrategy.prototype.initDatGui = function (datGUIWrapper) {
                    var _this = this;
                    if (this._guiIsInitialised) {
                        return;
                    }
                    var gui = datGUIWrapper.gui;
                    var defaultBehaviour = Strategy.Behaviour.BehaviourData.defaultBehaviour;
                    {
                        var baseControlsOptions = gui.addFolder('Pursuit Test Actions');
                        this._guiElements.push(baseControlsOptions.domElement);
                        baseControlsOptions.open();
                        baseControlsOptions.add(this, KartwarsBot.nameof(function () { return _this.usePrediction; }));
                    }
                    this._guiIsInitialised = true;
                };
                return PursuitBotStrategy;
            }(Strategy.StrategyBase));
            PursuitBotStrategy = __decorate([
                KartwarsBot.MethodDecoration.sealed
            ], PursuitBotStrategy);
            Strategy.PursuitBotStrategy = PursuitBotStrategy;
        })(Strategy = KartwarsBot.Strategy || (KartwarsBot.Strategy = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
