/// <reference path="_references.ts" />
/// <reference path="BotBase.ts" />
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
        var BotStageEnum;
        (function (BotStageEnum) {
            BotStageEnum[BotStageEnum["NotStarted"] = 0] = "NotStarted";
            BotStageEnum[BotStageEnum["AvoidCollision"] = 1] = "AvoidCollision";
            BotStageEnum[BotStageEnum["AvoidEncirclement"] = 2] = "AvoidEncirclement";
            BotStageEnum[BotStageEnum["SeekFood"] = 3] = "SeekFood";
            // TODO : Review
            // SeekFoodCluster,
            BotStageEnum[BotStageEnum["SeekWeapon"] = 4] = "SeekWeapon";
            // TODO : Review
            // DeployWeapon,
            BotStageEnum[BotStageEnum["InterceptEnemy"] = 5] = "InterceptEnemy";
        })(BotStageEnum = KartwarsBot.BotStageEnum || (KartwarsBot.BotStageEnum = {}));
        /**
         * Kartwars.io Bot.
         */
        var Bot = (function (_super) {
            __extends(Bot, _super);
            // Constructor
            function Bot(gameWrapper, canvas, datGUI) {
                var _this = _super.call(this, gameWrapper, canvas) || this;
                _this.datGUI = datGUI;
                _this._selectedStrategy = KartwarsBot.Strategy.Strategies.Default;
                _this._selectedCollisionManager = KartwarsBot.Manager.Collision.Managers.Default;
                _this._strategies = [];
                _this._collisionManagers = [];
                return _this;
            }
            Object.defineProperty(Bot.prototype, "selectedStrategy", {
                //
                // selectedStrategy property
                get: function () {
                    return this._selectedStrategy;
                },
                set: function (value) {
                    var newValue = KartwarsBot.Strategy.Strategies[KartwarsBot.Strategy.Strategies[value]];
                    if (this._selectedStrategy != newValue) {
                        var oldSelectionStrategy = this._strategies[this._selectedStrategy];
                        oldSelectionStrategy.hideDatGui();
                        this._selectedStrategy = newValue;
                        // Forces the creation of the strategy based on selection
                        var selectedStrategy = this.Strategy;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Bot.prototype, "selectedCollisionManager", {
                // !selectedStrategy property
                //
                //
                // selectedCollisionManager property
                get: function () {
                    return this._selectedCollisionManager;
                },
                set: function (value) {
                    this._selectedCollisionManager = KartwarsBot.Manager.Collision.Managers[KartwarsBot.Manager.Collision.Managers[value]];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Bot.prototype, "Strategy", {
                // !selectedStrategy property
                //
                //
                // Strategy property
                get: function () {
                    var selectedStrategyOption = this.selectedStrategy;
                    var selectedStrategy = this._strategies[selectedStrategyOption];
                    if (selectedStrategy == undefined) {
                        var instance = void 0;
                        switch (selectedStrategyOption) {
                            case KartwarsBot.Strategy.Strategies.Default:
                                {
                                    instance = new KartwarsBot.Strategy.DefaultStrategy(this, this.gameWrapper, this.canvas);
                                }
                                break;
                            case KartwarsBot.Strategy.Strategies.CalculateTorque:
                                {
                                    instance = new KartwarsBot.Strategy.CalculateTorqueBotStrategy(this, this.gameWrapper, this.canvas);
                                }
                                break;
                            case KartwarsBot.Strategy.Strategies.BasicPursuit:
                                {
                                    instance = new KartwarsBot.Strategy.PursuitBotStrategy(this, this.gameWrapper, this.canvas);
                                }
                                break;
                            case KartwarsBot.Strategy.Strategies.PursuitAndShoot:
                                {
                                    instance = new KartwarsBot.Strategy.PursuitAndShootBotStrategy(this, this.gameWrapper, this.canvas);
                                }
                                break;
                            case KartwarsBot.Strategy.Strategies.DrawEnemies:
                                {
                                    instance = new KartwarsBot.Strategy.DrawEnemiesBotStrategy(this, this.gameWrapper, this.canvas);
                                }
                                break;
                            case KartwarsBot.Strategy.Strategies.InterconnectFood:
                                {
                                    instance = new KartwarsBot.Strategy.InterconnectFoodBotStrategy(this, this.gameWrapper, this.canvas);
                                }
                                break;
                            default: {
                                throw Error("Incompatible value or type '" + selectedStrategyOption + "' in Strategy. Type: " + typeof selectedStrategyOption + ".");
                            }
                        }
                        selectedStrategy = this._strategies[selectedStrategyOption] = instance;
                    }
                    // Ensure dat GUI is showed up
                    selectedStrategy.showDatGui(this.datGUI);
                    return selectedStrategy;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Bot.prototype, "CollisionManager", {
                // !Strategy property
                //
                //
                // CollisionManager property
                get: function () {
                    var selectedCollisionManagerOption = this.selectedCollisionManager;
                    var selectedCollisionManager = this._collisionManagers[selectedCollisionManagerOption];
                    if (selectedCollisionManager == undefined) {
                        var instance = void 0;
                        switch (selectedCollisionManagerOption) {
                            case KartwarsBot.Manager.Collision.Managers.Default:
                                {
                                    instance = new KartwarsBot.Manager.Collision.CollisionCourseManager(this, this.gameWrapper, this.canvas);
                                }
                                break;
                            case KartwarsBot.Manager.Collision.Managers.Advanced:
                                {
                                    instance = new KartwarsBot.Manager.Collision.AdvancedCollisionCourseManager(this, this.gameWrapper, this.canvas);
                                }
                                break;
                            /*
                            case Manager.Collision.Managers.Uber: {
                                instance = new Manager.Collision.UberCollisionCourseManager(this, this.gameWrapper, this.canvas);
                            } break;
                            */
                            default: {
                                throw Error("Incompatible value or type '" + selectedCollisionManagerOption + "' in CollisionManager. Type: " + typeof selectedCollisionManagerOption + ".");
                            }
                        }
                        selectedCollisionManager = this._collisionManagers[selectedCollisionManagerOption] = instance;
                    }
                    return selectedCollisionManager;
                },
                enumerable: true,
                configurable: true
            });
            // !CollisionManager property
            //
            /**
             * Main entry for bot.
             */
            Bot.prototype.go = function () {
                this.updateGeometry();
                this.gameWrapper.input.canvas.forceClear();
                var thisStrategyActivityResult = this.Strategy.action();
                if (!thisStrategyActivityResult) {
                    throw new Error('Invalid Strategy Activity Result.');
                }
                this.processActivity(thisStrategyActivityResult);
            };
            /**
             * Does recalculations based on world environment changes and player changes.
             */
            // TODO : Add a watcher on dependent variables. (???)
            Bot.prototype.updateGeometry = function () {
                window.botFactory.clock.startFrame();
                var playerPosition = this.gameWrapper.player.getPosition();
                var playerRotation = this.gameWrapper.player.getRotation();
                var worldBounds = this.gameWrapper.world.getWorkingBounds();
                //
                //
                this.sectorBoxSide = this.gameWrapper.world.getSectorSquaredWidth();
                this.sectorBox = new KartwarsBot.Structures.Rect(playerPosition.x - (this.sectorBoxSide / 2), playerPosition.y - (this.sectorBoxSide / 2), this.sectorBoxSide, this.sectorBoxSide);
                // if (window.visualDebugging) this.canvas.drawRect(this.sectorBox, '#c0c0c0', true, 0.1);
                this.canvas.drawRect(this.sectorBox, 0, '#c0c0c0', true, 0.1);
                var thisCos = this.cos = Math.cos(playerRotation);
                var thisSin = this.sin = Math.sin(playerRotation);
                //
                // Base player
                {
                    this.shapesHolster.playerCircle = new KartwarsBot.Structures.Circle(playerPosition.x, playerPosition.y, this.kartRadius * this.opt.playerRadiusMultiplier);
                    this.shapesHolster.playerResourceGatherCircle = new KartwarsBot.Structures.Circle(playerPosition.x, playerPosition.y, this.kartRadius * this.opt.playerResourceGatherRadiusMultiplier);
                }
                //
                //
                //
                // Close To Imminent Danger detector
                {
                    this.shapesHolster.closeToImminentDangerCircle = new KartwarsBot.Structures.Circle(playerPosition.x, playerPosition.y, this.opt.closeToImminentDangerRange);
                }
                //
                //
                //
                // Head & tail collision "detectors"
                {
                    var unknown = Math.min(1, this.speedMult - 1);
                    var headCircleRadius = this.opt.radiusFrontDetectorMultiplier / 2 * this.kartRadius;
                    var tailCircleRadius = this.opt.radiusBehindDetectorMultiplier / 2 * this.kartRadius;
                    this.shapesHolster.headCircle = new KartwarsBot.Structures.Circle(playerPosition.x + thisCos * unknown * headCircleRadius, playerPosition.y + thisSin * unknown * headCircleRadius, headCircleRadius);
                    this.shapesHolster.tailCircle = new KartwarsBot.Structures.Circle(playerPosition.x - thisCos * unknown * tailCircleRadius, playerPosition.y - thisSin * unknown * tailCircleRadius, tailCircleRadius);
                }
                //
                //
                //
                // Food collector enhancers
                {
                    var playerLeftSideCircleRadius = KartwarsBot.Data.playerTurnRadius * this.opt.radiusSideDetectorsMultiplier;
                    var playerLeftSideCircleSin = thisSin * playerLeftSideCircleRadius;
                    var playerLeftSideCircleCos = thisCos * playerLeftSideCircleRadius;
                    this.shapesHolster.playerLeftSideCircle = new KartwarsBot.Structures.Circle(playerPosition.x + playerLeftSideCircleSin, playerPosition.y - playerLeftSideCircleCos, playerLeftSideCircleRadius);
                    this.shapesHolster.playerRightSideCircle = new KartwarsBot.Structures.Circle(playerPosition.x - playerLeftSideCircleSin, playerPosition.y + playerLeftSideCircleCos, playerLeftSideCircleRadius);
                }
                //
                //
                //
                // Tunnel
                {
                    var goalCoordinates = this.goal.coordinates;
                    var distance2goalCoordinates = KartwarsBot.Utils.MathUtils.getDistance(playerPosition, goalCoordinates);
                    var tunnelSideDistance = this.opt.tunnelSideDistance;
                    var tunnelSideStartSin = thisSin * tunnelSideDistance;
                    var tunnelSideStartCos = thisCos * tunnelSideDistance;
                    var tunnelSideEndSin = thisSin * distance2goalCoordinates;
                    var tunnelSideEndCos = thisCos * distance2goalCoordinates;
                    //
                    var tunnelLeftSideStartPoint = new KartwarsBot.Structures.Point2D(playerPosition.x + tunnelSideStartSin, playerPosition.y - tunnelSideStartCos);
                    var tunnelLeftSideLine = this.shapesHolster.tunnelLeftSideLine = new KartwarsBot.Structures.Line(tunnelLeftSideStartPoint, new KartwarsBot.Structures.Point2D(tunnelLeftSideStartPoint.x + tunnelSideEndCos, tunnelLeftSideStartPoint.y + tunnelSideEndSin));
                    var tunnelRightSideStartPoint = new KartwarsBot.Structures.Point2D(playerPosition.x - tunnelSideStartSin, playerPosition.y + tunnelSideStartCos);
                    var tunnelRightSideLine = this.shapesHolster.tunnelRightSideLine = new KartwarsBot.Structures.Line(tunnelRightSideStartPoint, new KartwarsBot.Structures.Point2D(tunnelRightSideStartPoint.x + tunnelSideEndCos, tunnelRightSideStartPoint.y + tunnelSideEndSin));
                    //
                    var alpha = undefined;
                    var isGoalInTunnel = this.goal.isInTunnel =
                        KartwarsBot.Utils.MathUtils.isLeft(tunnelLeftSideLine.point1, tunnelLeftSideLine.point2, goalCoordinates) &&
                            KartwarsBot.Utils.MathUtils.isRight(tunnelRightSideLine.point1, tunnelRightSideLine.point2, goalCoordinates);
                    if (isGoalInTunnel) {
                        alpha = 0.85;
                        this.goal.state = this.inFront(goalCoordinates) ? KartwarsBot.GoalState.InFront : KartwarsBot.GoalState.InBack;
                    }
                    this.canvas.drawTunnel(tunnelLeftSideLine, tunnelRightSideLine, alpha);
                }
                //
                //
                window.botFactory.clock.endFrame();
            };
            /**
             * Processes activity response.
             * @param thisActivityResult
             */
            Bot.prototype.processActivity = function (thisActivityResult) {
                if (thisActivityResult.isValid) {
                    //
                    // Process Goal Coordinates.
                    var goalCoordinates = thisActivityResult.goalCoordinates;
                    var worldBounds = this.gameWrapper.world.getWorkingBounds();
                    if (goalCoordinates.x < worldBounds.x) {
                        goalCoordinates.x = worldBounds.x + this.opt.wall.offsetLeftX;
                    }
                    if (goalCoordinates.y < worldBounds.y) {
                        goalCoordinates.y = worldBounds.y + this.opt.wall.offsetTopY;
                    }
                    if (goalCoordinates.x > worldBounds.width) {
                        goalCoordinates.x = worldBounds.width + this.opt.wall.offsetRightX;
                    }
                    if (goalCoordinates.y > worldBounds.height) {
                        goalCoordinates.y = worldBounds.height + this.opt.wall.offsetBottomY;
                    }
                    this.goal.coordinates = goalCoordinates;
                    this.canvas.setMouseCoordinates(this.canvas.mapToMouse(goalCoordinates));
                    //
                    //
                    // Process Acceleration
                    this.setAcceleration(thisActivityResult.acceleration);
                    //
                    // Draw goal
                    this.canvas.drawGoal(goalCoordinates);
                }
            };
            return Bot;
        }(KartwarsBot.BotBase));
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], Bot.prototype, "go", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], Bot.prototype, "updateGeometry", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], Bot.prototype, "processActivity", null);
        KartwarsBot.Bot = Bot;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
