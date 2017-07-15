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
             * Interconnect Food Test Strategy.
             */
            var InterconnectFoodBotStrategy = InterconnectFoodBotStrategy_1 = (function (_super) {
                __extends(InterconnectFoodBotStrategy, _super);
                function InterconnectFoodBotStrategy() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.aggressivity = 0;
                    return _this;
                }
                InterconnectFoodBotStrategy.distance = function (a, b) {
                    return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
                };
                InterconnectFoodBotStrategy.prototype.drawI = function (tree, currentResource, deep) {
                    tree.remove(currentResource);
                    //let nearest = tree.nearest(currentResource, 1, [3500]);
                    var nearest = tree.nearest(currentResource, 1);
                    for (var j = 0; j < nearest.length; j++) {
                        var point = nearest[j][0];
                        this.canvas.drawLine(currentResource, point, 'black', 3, 0.5);
                        tree.remove(point);
                        if (--deep > 0) {
                            this.drawI(tree, point, deep);
                        }
                    }
                };
                InterconnectFoodBotStrategy.prototype.onPlayerDeath = function () {
                    //
                };
                InterconnectFoodBotStrategy.prototype.action = function () {
                    var foodTacticsActivityResult = null;
                    window.botFactory.clock.startFrame();
                    //let playerPosition = this.gameWrapper.player.getPosition();
                    var food = this.gameWrapper.items.getFood();
                    foodTacticsActivityResult = this.FoodTactics.action();
                    if (foodTacticsActivityResult.isValid) {
                        //let currentResource = (foodTacticsActivityResult.goalCoordinates as Bot2Point2D);
                        var currentResource = foodTacticsActivityResult.goalCoordinates;
                        var tree = new window.kdTree(food, InterconnectFoodBotStrategy_1.distance, ['x', 'y']);
                        this.drawI(tree, currentResource, 15);
                    }
                    window.botFactory.clock.endFrame();
                    return foodTacticsActivityResult;
                };
                InterconnectFoodBotStrategy.prototype.foodAction = function () {
                    // NOOP
                };
                InterconnectFoodBotStrategy.prototype.initDatGui = function (datGUIWrapper) {
                    if (this._guiIsInitialised) {
                        return;
                    }
                    var gui = datGUIWrapper.gui;
                    var defaultBehaviour = Strategy.Behaviour.BehaviourData.defaultBehaviour;
                    {
                        var baseControlsOptions = gui.addFolder('Interconnect Food Test Actions');
                        this._guiElements.push(baseControlsOptions.domElement);
                        baseControlsOptions.open();
                        //baseControlsOptions.add(this, 'property');
                    }
                    this._guiIsInitialised = true;
                };
                return InterconnectFoodBotStrategy;
            }(Strategy.StrategyBase));
            InterconnectFoodBotStrategy = InterconnectFoodBotStrategy_1 = __decorate([
                KartwarsBot.MethodDecoration.sealed
            ], InterconnectFoodBotStrategy);
            Strategy.InterconnectFoodBotStrategy = InterconnectFoodBotStrategy;
            var InterconnectFoodBotStrategy_1;
        })(Strategy = KartwarsBot.Strategy || (KartwarsBot.Strategy = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
