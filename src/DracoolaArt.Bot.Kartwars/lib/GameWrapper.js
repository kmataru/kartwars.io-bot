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
        var GameWrapperInputMouse = (function () {
            // Constructor
            function GameWrapperInputMouse(gameWrapper) {
                this.gameWrapper = gameWrapper;
            }
            // window.xm
            // window.ym
            // gameWrapper.input.mouse.setCoordinates(point)
            GameWrapperInputMouse.prototype.setCoordinates = function (point) {
                window.game.input.mousePointer.x = point.x + (window.game.canvas.width / 2);
                window.game.input.mousePointer.y = point.y + (window.game.canvas.height / 2);
            };
            return GameWrapperInputMouse;
        }());
        var GameWrapperInputCanvas = (function () {
            // Constructor
            function GameWrapperInputCanvas(gameWrapper) {
                this.gameWrapper = gameWrapper;
                this._injectElement = true;
                this._addEvents = true;
            }
            // gameWrapper.input.canvas.forceClear()
            GameWrapperInputCanvas.prototype.forceClear = function () {
                var c = this._canvasElement;
                if (c != null) {
                    c.getContext('2d').clearRect(0, 0, c.width, c.height);
                }
            };
            // TODO : Review
            GameWrapperInputCanvas.prototype.registerEvent = function (fx) {
                if (this._addEvents) {
                    this._registeredEvent = fx;
                    this._addEvents = false;
                }
            };
            // gameWrapper.input.canvas.getContext()
            GameWrapperInputCanvas.prototype.getContext = function () {
                // return window.game.input.hitContext;
                /*
                let webGlContext = window.game.canvas.getContext('webgl');
                gameWrapper.input.canvas._canvasElement = webglToCanvas2d(webGlContext, gameWrapper.input.canvas._canvasElement);
                */
                var c = this._canvasElement;
                if (c == null) {
                    c = this._canvasElement = document.createElement('canvas');
                    c.width = window.game.canvas.width;
                    c.height = window.game.canvas.height;
                    c.style.zIndex = '9999';
                    c.style.position = 'absolute';
                    c.style.top = '0';
                    c.style.left = '0';
                    c.style.display = 'block';
                    c.style.touchAction = 'none';
                    c.style.webkitUserSelect = c.style.msUserSelect = 'none';
                    c.style.webkitTapHighlightColor = 'rgba(0, 0, 0, 0)';
                    c.style.cursor = 'inherit';
                    c.style.marginLeft = '0px';
                    c.style.marginTop = '0px';
                    c.oncontextmenu = function (e) {
                        e.preventDefault();
                    };
                    // Copy events
                    if (this._registeredEvent) {
                        this._registeredEvent(c);
                    }
                    c.addEventListener('mousedown', window.game.input.mouse._onMouseDown, !0);
                    c.addEventListener('mousemove', window.game.input.mouse._onMouseMove, !0);
                    c.addEventListener('mouseup', window.game.input.mouse._onMouseUp, !0);
                }
                if (this._injectElement) {
                    $('#game').append(this._canvasElement);
                    this._injectElement = false;
                }
                return this._canvasElement.getContext('2d');
            };
            GameWrapperInputCanvas.prototype.dispatchEvent = function (event) {
                this._canvasElement.dispatchEvent(event);
            };
            return GameWrapperInputCanvas;
        }());
        var GameWrapperUtil = (function () {
            // Constructor
            function GameWrapperUtil(gameWrapper) {
                this.gameWrapper = gameWrapper;
            }
            // gameWrapper.util.hasValidSprite(element)
            GameWrapperUtil.prototype.hasValidSprite = function (el) {
                var worldBounds = this.gameWrapper.world.getWorkingBounds(), img = el.img, position = img.position;
                // (!element.img.alive)
                return (position.x > worldBounds.x && position.y > worldBounds.y) && (position.x < worldBounds.width && position.y < worldBounds.height) &&
                    (img.visible && (img.alpha > 0) && img.renderable);
            };
            // gameWrapper.util.hasShieldActivated(element)
            GameWrapperUtil.prototype.hasShieldActivated = function (el) {
                var img = el.img.escudo2;
                return (img.visible && (img.alpha > 0) && img.renderable);
            };
            GameWrapperUtil.prototype.connect = function () {
                $('#play-btn').click();
            };
            GameWrapperUtil.prototype.delayedConnect = function () {
                if (!this.isPlaying) {
                    this.connect();
                    setTimeout(this.delayedConnect, 500);
                }
            };
            Object.defineProperty(GameWrapperUtil.prototype, "isPlaying", {
                get: function () {
                    return (window.mainCar && window.mainCar.img && window.mainCar.img.alive);
                },
                enumerable: true,
                configurable: true
            });
            return GameWrapperUtil;
        }());
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], GameWrapperUtil.prototype, "delayedConnect", null);
        var GameWrapperPlayer = (function () {
            // Constructor
            function GameWrapperPlayer(gameWrapper) {
                this.gameWrapper = gameWrapper;
                this.HALP_PI = Math.PI / 2;
                this.THREE_SQUARES_PI = Math.PI * 1.5;
            }
            // window.snake.ehang
            // gameWrapper.player.getRotation([enemy])
            GameWrapperPlayer.prototype.getRotation = function (enemy) {
                var rotation;
                if (undefined == enemy) {
                    rotation = window.mainCar.rotation;
                }
                else {
                    rotation = enemy.img.rotation;
                } /*else {
                    return;
                }*/
                if (rotation >= (-this.gameWrapper.player.HALP_PI) && rotation < Math.PI) {
                    rotation -= this.gameWrapper.player.HALP_PI;
                }
                else {
                    rotation += this.gameWrapper.player.THREE_SQUARES_PI;
                }
                return rotation;
            };
            // window.view_xx
            // window.view_yy
            // gameWrapper.player.getPosition()
            GameWrapperPlayer.prototype.getPosition = function () {
                return window.mainCar.img.position;
            };
            return GameWrapperPlayer;
        }());
        var GameWrapperItems = (function () {
            // Constructor
            function GameWrapperItems(gameWrapper) {
                this.gameWrapper = gameWrapper;
                this.ignoreMissilesDictionary = {};
                this.reset();
            }
            // TODO : Review this as WebSocket.onMessage refreshes data for each element.
            GameWrapperItems.prototype.reset = function () {
                if (GameWrapperItems.isItemCacherActive) {
                    //this.listOfElements = [];
                    this.listOfElements = null; // ???
                    this.listOfElements = {};
                }
            };
            GameWrapperItems.prototype.ignoreMissilesById = function (id) {
                this.ignoreMissilesDictionary[id] = KartwarsBot.IgnoreItemFlag.Yes;
            };
            // window.snakes
            // gameWrapper.items.getEnemies()
            GameWrapperItems.prototype.getEnemies = function () {
                return this._baseGetItems('Car', window.sprites, window.Car, true, window.mainCar.id);
            };
            // gameWrapper.items.getMissiles()
            GameWrapperItems.prototype.getMissiles = function () {
                return this._baseGetItems('Missile', window.misiles, window.Misil, true, undefined, this.ignoreMissilesDictionary);
            };
            // gameWrapper.items.getTeleMissiles()
            GameWrapperItems.prototype.getTeleMissiles = function () {
                return this._baseGetItems('TeleMissile', window.misiles, window.MisilTele, true, undefined, this.ignoreMissilesDictionary);
            };
            // gameWrapper.items.getBombes()
            GameWrapperItems.prototype.getBombs = function () {
                return this._baseGetItems('Bomb', window.bombas, window.Bomba, false);
            };
            // gameWrapper.items.getMines()
            GameWrapperItems.prototype.getMines = function () {
                return this._baseGetItems('Mine', window.minas, window.Mina, false);
            };
            // gameWrapper.items.getWeapons()
            GameWrapperItems.prototype.getWeapons = function () {
                return this._baseGetItems('Item', window.misItems, window.Item, false);
            };
            // window.foods
            // gameWrapper.items.getFood()
            GameWrapperItems.prototype.getFood = function () {
                // Example: (ac = coins.filter(function(el){ return el.activa == true; })).length
                var $this = this;
                var worldBounds = this.gameWrapper.world.getWorkingBounds();
                var playerPosition = this.gameWrapper.player.getPosition();
                return window.coins.filter(function (element) {
                    var img = element.img;
                    var position = img.position;
                    element.x = position.x;
                    element.y = position.y;
                    var isValid = $this.gameWrapper.util.hasValidSprite(element);
                    if (isValid) {
                        element.distance = KartwarsBot.Utils.MathUtils.getDistance(position, playerPosition);
                    }
                    return isValid;
                });
            };
            GameWrapperItems.prototype._ensureVelocityIsDefined = function (object) {
                var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor(object, 'x');
                var variableWatched = (typeof getOwnPropertyDescriptor == 'function');
                if (!variableWatched) {
                    object.img.position.watch('x', function (id, oldValue, newValue) {
                        var element = object;
                        var position = element.img.position;
                        if (element.velocity == undefined) {
                            element.lastPosition = new KartwarsBot.Structures.Point2D(position.x, position.y);
                            element.velocity = new KartwarsBot.Structures.Point2D(0, 0);
                        }
                        else {
                            element.velocity.x = (position.x - element.lastPosition.x);
                            element.velocity.y = (position.y - element.lastPosition.y);
                            element.lastPosition.x = position.x;
                            element.lastPosition.y = position.y;
                            element.magnitude = Math.sqrt(Math.pow(element.velocity.x, 2) + Math.pow(element.velocity.y, 2));
                            //
                            // Used for collecting weapon's Magnitude Data
                            /*
                            //img.texture.crop
                            if (object instanceof window.MisilTele) {
                                window.log((+new Date()), `ID = ${element.id}; Magnitude = ${element.magnitude}`);
                            }
                            //*/
                            //
                        }
                        return newValue;
                    });
                }
            };
            GameWrapperItems.prototype._baseGetItems = function (category, items, type, defineVelocityProperty, skipId, ignoreList) {
                if (GameWrapperItems.isItemCacherActive) {
                    if (this.listOfElements[category] != undefined) {
                        return this.listOfElements[category];
                    }
                }
                var results = [], count = 0;
                /*
                let localElements = $.map(items, function (value:T, index) {
                    return [value];
                }) as Array<T>;
                */
                var clonedElements = jQuery.extend(true, {}, items);
                var playerPosition = this.gameWrapper.player.getPosition();
                // READ : http://stackoverflow.com/questions/5072136/javascript-filter-for-objects
                // TODO : Add properties to existing classes.
                /*
                Object.defineProperty(Car.prototype, 'x', {
                    get: function () {
                        return this.img.position.x;
                    },
                    enumerable: true,
                    configurable: true
                });
                */
                for (var localSpriteIdx in clonedElements) {
                    var element = clonedElements[localSpriteIdx];
                    var doContinue = false;
                    var hasValidSprite = this.gameWrapper.util.hasValidSprite(element);
                    if (ignoreList) {
                        var ignoreElement = ignoreList[localSpriteIdx];
                        //if (ignoreElement) {
                        if (ignoreElement == KartwarsBot.IgnoreItemFlag.Yes && hasValidSprite) {
                            ignoreList[localSpriteIdx] = KartwarsBot.IgnoreItemFlag.Delete;
                            doContinue = true;
                        }
                        else if (ignoreElement == KartwarsBot.IgnoreItemFlag.Delete) {
                            if (hasValidSprite) {
                                doContinue = true;
                            }
                            else {
                                delete (ignoreList[localSpriteIdx]);
                            }
                        }
                        //}
                    }
                    if (doContinue || !(element instanceof type) || (!hasValidSprite)) {
                        delete (clonedElements[localSpriteIdx]);
                        continue;
                    }
                    var x = element.img.position.x, y = element.img.position.y;
                    element.x = x;
                    element.y = y;
                    element.distance = KartwarsBot.Utils.MathUtils.getDistance(element, playerPosition);
                    this._ensureVelocityIsDefined(element);
                    if (skipId && (element.id == skipId)) {
                        delete (clonedElements[localSpriteIdx]);
                        continue;
                    }
                    results[count++] = element;
                }
                if (count > 0) {
                    results.sort(KartwarsBot.Utils.ArrayUtils.sortDistance);
                }
                return results;
            };
            return GameWrapperItems;
        }());
        GameWrapperItems.isItemCacherActive = false;
        var GameWrapperWorld = (function () {
            // Constructor
            function GameWrapperWorld(gameWrapper) {
                this.gameWrapper = gameWrapper;
            }
            GameWrapperWorld.prototype.getWorkingBounds = function () {
                var worldBounds = window.game.world.bounds;
                var offset = GameWrapperWorld.offset;
                return new KartwarsBot.Structures.Rect(offset, offset, worldBounds.width - offset, worldBounds.height - offset);
            };
            // gameWrapper.world.getSectorSquaredWidth()
            GameWrapperWorld.prototype.getSectorSquaredWidth = function () {
                return 1661;
            };
            return GameWrapperWorld;
        }());
        GameWrapperWorld.offset = 1500 + 250;
        /**
         * Game variables Wrapper.
         */
        var GameWrapper = (function () {
            /*
                * || marcos
                e instanceof Misil || misiles
                e instanceof MisilTele || misiles
                e instanceof Car || sprites
                e instanceof Bomba || bombas
                e instanceof Mina || minas
                e instanceof Coin || coins
                e instanceof Item || misItems
            */
            function GameWrapper() {
                this.input = {
                    mouse: new GameWrapperInputMouse(this),
                    canvas: new GameWrapperInputCanvas(this)
                };
                this.util = new GameWrapperUtil(this);
                this.player = new GameWrapperPlayer(this);
                this.items = new GameWrapperItems(this);
                this.world = new GameWrapperWorld(this);
            }
            return GameWrapper;
        }());
        KartwarsBot.GameWrapper = GameWrapper;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
