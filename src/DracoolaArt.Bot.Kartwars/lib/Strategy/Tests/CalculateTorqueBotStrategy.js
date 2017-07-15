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
             * Calculate Torque Test Strategy.
             */
            var CalculateTorqueBotStrategy = (function (_super) {
                __extends(CalculateTorqueBotStrategy, _super);
                function CalculateTorqueBotStrategy() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.aggressivity = 0;
                    _this.stepx = 0;
                    _this.startTime = 0;
                    _this.xPoints = { p1: Infinity, p2: -Infinity };
                    _this.yPoints = { p1: Infinity, p2: -Infinity };
                    return _this;
                }
                CalculateTorqueBotStrategy.prototype.onPlayerDeath = function () {
                    //
                };
                CalculateTorqueBotStrategy.prototype.reset = function () {
                    this.startPosition = null;
                };
                CalculateTorqueBotStrategy.prototype.startTracking = function () {
                    this.xPoints = { p1: Infinity, p2: -Infinity };
                    this.yPoints = { p1: Infinity, p2: -Infinity };
                    this.startTime = 0;
                    this.stepx = 0;
                };
                /*
                window['xPoints'].p2 - window['xPoints'].p1
                window['yPoints'].p2 - window['yPoints'].p1
                == 350
            
                window['trackedTime']
                == 2500
            
                ==>
                
                r = 350 / 2
                p = 2 * Math.PI * r
                s = p * 1000 / 2500
                s == 439.822971502571 u/s
                */
                CalculateTorqueBotStrategy.prototype.action = function () {
                    var foodTacticsActivityResult = null;
                    var goalCoordinates;
                    window.botFactory.clock.startFrame();
                    this.gameWrapper.items.reset();
                    this.gameWrapper.items.getEnemies();
                    var playerPosition = this.gameWrapper.player.getPosition();
                    if (!this.startPosition) {
                        this.startPosition = playerPosition;
                        goalCoordinates = new KartwarsBot.Structures.Point2D(playerPosition.x, playerPosition.y);
                    }
                    this.xPoints.p1 = Math.min(this.xPoints.p1, playerPosition.x);
                    this.xPoints.p2 = Math.max(this.xPoints.p2, playerPosition.x);
                    this.yPoints.p1 = Math.min(this.yPoints.p1, playerPosition.y);
                    this.yPoints.p2 = Math.max(this.yPoints.p2, playerPosition.y);
                    if (this.stepx == 0) {
                        if (playerPosition.y < this.bot.goal.coordinates.y) {
                            this.stepx = 1;
                        }
                    }
                    if (this.stepx == 1) {
                        if (playerPosition.y >= this.bot.goal.coordinates.y) {
                            this.startTime = (+new Date());
                            this.stepx = 2;
                        }
                    }
                    if (this.stepx == 2) {
                        if (playerPosition.y < this.bot.goal.coordinates.y) {
                            this.stepx = 3;
                        }
                    }
                    if (this.stepx == 3) {
                        if (playerPosition.y >= this.bot.goal.coordinates.y) {
                            window['trackedTime'] = (+new Date()) - this.startTime;
                            this.stepx = 4;
                        }
                    }
                    window['xPoints'] = this.xPoints;
                    window['yPoints'] = this.yPoints;
                    if (goalCoordinates) {
                        foodTacticsActivityResult = KartwarsBot.Structures.ActivityResult.CreateValidResponse(goalCoordinates);
                    }
                    else {
                        foodTacticsActivityResult = KartwarsBot.Structures.ActivityResult.CreateValidResponse(this.bot.goal.coordinates);
                    }
                    window.botFactory.clock.endFrame();
                    return foodTacticsActivityResult;
                };
                CalculateTorqueBotStrategy.prototype.foodAction = function () {
                    // NOOP
                };
                CalculateTorqueBotStrategy.prototype.initDatGui = function (datGUIWrapper) {
                    var _this = this;
                    if (this._guiIsInitialised) {
                        return;
                    }
                    var gui = datGUIWrapper.gui;
                    var defaultBehaviour = Strategy.Behaviour.BehaviourData.defaultBehaviour;
                    {
                        var baseControlsOptions = gui.addFolder('Torque Test Actions');
                        this._guiElements.push(baseControlsOptions.domElement);
                        baseControlsOptions.open();
                        //baseControlsOptions.add(this, 'xStaticRecalibration', -100, 100).listen();
                        baseControlsOptions.add(this, KartwarsBot.nameof(function () { return _this.reset; }));
                        baseControlsOptions.add(this, KartwarsBot.nameof(function () { return _this.startTracking; }));
                    }
                    this._guiIsInitialised = true;
                };
                return CalculateTorqueBotStrategy;
            }(Strategy.StrategyBase));
            CalculateTorqueBotStrategy = __decorate([
                KartwarsBot.MethodDecoration.sealed
            ], CalculateTorqueBotStrategy);
            Strategy.CalculateTorqueBotStrategy = CalculateTorqueBotStrategy;
        })(Strategy = KartwarsBot.Strategy || (KartwarsBot.Strategy = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
