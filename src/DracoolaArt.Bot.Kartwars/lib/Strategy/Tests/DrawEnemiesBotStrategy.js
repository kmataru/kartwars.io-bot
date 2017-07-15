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
             * Draw Enemies Test Strategy.
             */
            var DrawEnemiesBotStrategy = (function (_super) {
                __extends(DrawEnemiesBotStrategy, _super);
                function DrawEnemiesBotStrategy() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.aggressivity = 0;
                    return _this;
                }
                DrawEnemiesBotStrategy.prototype.hasValidSprite = function (el) {
                    var worldBounds = this.gameWrapper.world.getWorkingBounds(), img = el.img, position = img.position;
                    //return (position.x > worldBounds.x && position.y > worldBounds.y) &&
                    //	(position.x < worldBounds.width && position.y < worldBounds.height) &&
                    //	(img.visible && (img.alpha > 0) && img.renderable);
                    return (position.x > worldBounds.x && position.y > worldBounds.y) &&
                        (position.x < worldBounds.width && position.y < worldBounds.height);
                };
                DrawEnemiesBotStrategy.prototype._baseGetItems = function (items, type, skipId) {
                    var results = [], count = 0;
                    var localElements = jQuery.extend(true, {}, items);
                    var playerPosition = this.gameWrapper.player.getPosition();
                    for (var localSprite in localElements) {
                        var element = localElements[localSprite];
                        element.img.visible = true;
                        element.img.alpha = 1;
                        element.img.renderable = true;
                        if (!(element instanceof type) || (!this.hasValidSprite(element))) {
                            delete (localElements[localSprite]);
                            continue;
                        }
                        var x = element.img.position.x, y = element.img.position.y;
                        element.x = x;
                        element.y = y;
                        element.distance = KartwarsBot.Utils.MathUtils.getDistance(element, playerPosition);
                        if (skipId && (element.id == skipId)) {
                            delete (localElements[localSprite]);
                            continue;
                        }
                        results[count++] = element;
                    }
                    return results;
                };
                DrawEnemiesBotStrategy.prototype.onPlayerDeath = function () {
                    //
                };
                DrawEnemiesBotStrategy.prototype.action = function () {
                    var foodTacticsActivityResult = null;
                    window.botFactory.clock.startFrame();
                    var enemies = this._baseGetItems(window.sprites, window.Car, window.mainCar.id);
                    var $this = this;
                    enemies.forEach(function (element) {
                        $this.canvas.drawCircle(new KartwarsBot.Structures.Circle(element.x, element.y, 75), 'red', true, 0.25);
                    });
                    //
                    //
                    foodTacticsActivityResult = KartwarsBot.Structures.ActivityResult.CreateValidResponse(new KartwarsBot.Structures.Point2D(this.bot.worldCenterX, this.bot.worldCenterY));
                    window.botFactory.clock.endFrame();
                    return foodTacticsActivityResult;
                };
                DrawEnemiesBotStrategy.prototype.foodAction = function () {
                    // NOOP
                };
                DrawEnemiesBotStrategy.prototype.initDatGui = function (datGUIWrapper) {
                    if (this._guiIsInitialised) {
                        return;
                    }
                    var gui = datGUIWrapper.gui;
                    var defaultBehaviour = Strategy.Behaviour.BehaviourData.defaultBehaviour;
                    {
                        var baseControlsOptions = gui.addFolder('Draw Enemies Test Actions');
                        this._guiElements.push(baseControlsOptions.domElement);
                        baseControlsOptions.open();
                        //baseControlsOptions.add(this, 'property');
                    }
                    this._guiIsInitialised = true;
                };
                return DrawEnemiesBotStrategy;
            }(Strategy.StrategyBase));
            DrawEnemiesBotStrategy = __decorate([
                KartwarsBot.MethodDecoration.sealed
            ], DrawEnemiesBotStrategy);
            Strategy.DrawEnemiesBotStrategy = DrawEnemiesBotStrategy;
        })(Strategy = KartwarsBot.Strategy || (KartwarsBot.Strategy = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
