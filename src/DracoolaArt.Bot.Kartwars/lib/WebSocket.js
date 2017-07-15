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
        var WebSocketDataTypeEnum;
        (function (WebSocketDataTypeEnum) {
            WebSocketDataTypeEnum[WebSocketDataTypeEnum["WeaponStatus"] = 31] = "WeaponStatus";
            WebSocketDataTypeEnum[WebSocketDataTypeEnum["SelfItemStatus"] = 7] = "SelfItemStatus";
            WebSocketDataTypeEnum[WebSocketDataTypeEnum["AddItem"] = 11] = "AddItem";
        })(WebSocketDataTypeEnum = KartwarsBot.WebSocketDataTypeEnum || (KartwarsBot.WebSocketDataTypeEnum = {}));
        var WebSocketSelfItemActivatedDataTypeEnum;
        (function (WebSocketSelfItemActivatedDataTypeEnum) {
            WebSocketSelfItemActivatedDataTypeEnum[WebSocketSelfItemActivatedDataTypeEnum["Shield"] = 28] = "Shield";
        })(WebSocketSelfItemActivatedDataTypeEnum = KartwarsBot.WebSocketSelfItemActivatedDataTypeEnum || (KartwarsBot.WebSocketSelfItemActivatedDataTypeEnum = {}));
        var WebSocketAddItemActivatedDataTypeEnum;
        (function (WebSocketAddItemActivatedDataTypeEnum) {
            WebSocketAddItemActivatedDataTypeEnum[WebSocketAddItemActivatedDataTypeEnum["Missile"] = 13] = "Missile";
            WebSocketAddItemActivatedDataTypeEnum[WebSocketAddItemActivatedDataTypeEnum["TeleMissile"] = 14] = "TeleMissile";
        })(WebSocketAddItemActivatedDataTypeEnum = KartwarsBot.WebSocketAddItemActivatedDataTypeEnum || (KartwarsBot.WebSocketAddItemActivatedDataTypeEnum = {}));
        var WebSocketInterfaceOptions = (function () {
            function WebSocketInterfaceOptions() {
                this.maxDistanceForDetectingSelfDeployedWeapons = 200;
            }
            return WebSocketInterfaceOptions;
        }());
        KartwarsBot.WebSocketInterfaceOptions = WebSocketInterfaceOptions;
        /**
         * Web Socket `Man-In-The-Middle` Attacker.
         */
        var WebSocketInterface = (function () {
            function WebSocketInterface() {
                this.opt = new WebSocketInterfaceOptions();
            }
            WebSocketInterface.prototype.onGameReadyDelegate = function () {
                this.original_WebSocketOnMessage = window.ws.onmessage;
                window.ws.onmessage = this.onMessage;
            };
            WebSocketInterface.prototype.onMessage = function (e) {
                window.botFactory.clock.startFrame('async');
                var myID = window.mainCar.id;
                function processCarWeapon(carId, weaponIndex) {
                    var thisCar = window.sprites[carId];
                    if (void 0 != thisCar) {
                        if (thisCar.weapon == undefined) {
                            thisCar.weapon = new KartwarsBot.Structures.CarWeaponData(weaponIndex);
                        }
                        //thisCar.weapon = weaponIndex;
                        thisCar.weapon.weaponType = weaponIndex;
                    }
                    /*
                    if (void 0 != window.sprites[myID]) {
                        if (carId == myID) {
                            if (0 == weaponIndex) {
                                window.log('WS: No item');
                            }
                            else {
                                switch (weaponIndex) {
                                    case CarWeapon.FastRocket:
                                        window.log('WS: Fast Rocket');
                                        break;
                                    case CarWeapon.ThreeFastRockets:
                                        window.log('WS: 3 x Fast Rockets');
                                        break;
                                    case CarWeapon.TeleRocket:
                                        window.log('WS: Tele Rocket');
                                        break;
                                    case CarWeapon.Cloak:
                                        window.log('WS: Cloak');
                                        break;
                                    case CarWeapon.Mine:
                                        window.log('WS: Mine');
                                        break;
                                    case CarWeapon.ThreeMines:
                                        window.log('WS: 3 x Mines');
                                        break;
                                    case CarWeapon.BigBang:
                                        window.log('WS: Big Bang');
                                        break;
                                    case CarWeapon.ThreeTeleRocket:
                                        window.log('WS: 3 x Tele Rocket');
                                        break;
                                    case CarWeapon.Shield:
                                        window.log('WS: Shield');
                                        break;
                                    case CarWeapon.Flashes:
                                        window.log('WS: Flashes');
                                        break;
                                    case CarWeapon.Magnet:
                                        window.log('WS: Magnet');
                                        break;
                                    case CarWeapon.HugeShield:
                                        window.log('WS: Huge Shield');
                                        break;
                                }
                            }
                        }
                        else {
                        }
                    }
                    */
                }
                function processCarShield(carId, specialCase, activationKey) {
                    var thisCar = window.sprites[carId];
                    if (0 != activationKey && 'undefined' != typeof thisCar) {
                        switch (specialCase) {
                            case WebSocketSelfItemActivatedDataTypeEnum.Shield:
                                {
                                    var active = (1 == activationKey);
                                    thisCar.isShieldActivated = active;
                                    thisCar.shieldActivationTime = active ? new Date() : null;
                                }
                                break;
                        }
                    }
                }
                function wsUnknownProcess1(carId, i, t, a, weaponIndex) {
                    window.sprites[carId] instanceof Car && null != weaponIndex && processCarWeapon(carId, weaponIndex);
                }
                var data = new Int16Array(e.data);
                switch (data[0]) {
                    case WebSocketDataTypeEnum.WeaponStatus:
                        {
                            // window.log('Got [31] data', data);
                            for (var f = data[1], b = 2, u = 0; f > u; u++) {
                                wsUnknownProcess1(data[b], data[b + 1], data[b + 2], data[b + 3], data[b + 4]),
                                    b += 5;
                            }
                        }
                        break;
                    case WebSocketDataTypeEnum.SelfItemStatus:
                        {
                            for (var b = 1; b + 4 < data.length;) {
                                var p = data[b++];
                                b++;
                                processCarShield(p, WebSocketSelfItemActivatedDataTypeEnum.Shield, data[b++]);
                                b++;
                                b++;
                            }
                        }
                        break;
                    case WebSocketDataTypeEnum.AddItem:
                        {
                            for (var b = 1; b + 3 < data.length;) {
                                var itemId = data[b++], addItemSpecialCase = data[b++], itemPositionX = data[b++], itemPositionY = data[b++], K = data[b++], D = data[b++];
                                // 11 == S ? esto.addItem(P, M, K, p, D, 0)
                                // 13 == S ? esto.addMisil(P, M, K, p, D)
                                // 14 == S ? esto.addMisilTele(P, M, K, p)
                                // 15 == S ? esto.addMina(P, M, K, p)
                                // 16 == S ? esto.addBomba(P, M, K, p, 0)
                                // TODO : Review
                                var bot = window.botFactory.bot;
                                var gameWrapper = window.botFactory.gameWrapper;
                                if (!bot.shapesHolster || !bot.shapesHolster.tunnelLeftSideLine || !bot.shapesHolster.tunnelRightSideLine) {
                                    return;
                                }
                                var deployedWeaponCoordinates = new KartwarsBot.Structures.Point2D(itemPositionX, itemPositionY);
                                var kartPosition = new KartwarsBot.Structures.Point2D(window.mainCar.img.position.x, window.mainCar.img.position.y);
                                var distance = KartwarsBot.Utils.MathUtils.getDistance(kartPosition, deployedWeaponCoordinates);
                                if (distance <= this.opt.maxDistanceForDetectingSelfDeployedWeapons /*&& window.mainCar.weapon.weaponType != CarWeapon.None*/) {
                                    var isDeployedWeaponInTunnel = KartwarsBot.Utils.MathUtils.isLeft(bot.shapesHolster.tunnelLeftSideLine.point1, bot.shapesHolster.tunnelLeftSideLine.point2, deployedWeaponCoordinates) &&
                                        KartwarsBot.Utils.MathUtils.isRight(bot.shapesHolster.tunnelRightSideLine.point1, bot.shapesHolster.tunnelRightSideLine.point2, deployedWeaponCoordinates);
                                    if (isDeployedWeaponInTunnel) {
                                        switch (addItemSpecialCase) {
                                            case WebSocketAddItemActivatedDataTypeEnum.Missile:
                                                {
                                                    gameWrapper.items.ignoreMissilesById(itemId);
                                                    // window.log('Add Misil: ', itemId, itemPositionX, itemPositionY, K, D, distance, `previousWeaponType = ${CarWeapon[window.mainCar.weapon.previousWeaponType]}`, `weaponType = ${CarWeapon[window.mainCar.weapon.weaponType]}`);
                                                }
                                                break;
                                            case WebSocketAddItemActivatedDataTypeEnum.TeleMissile:
                                                {
                                                    gameWrapper.items.ignoreMissilesById(itemId);
                                                    // window.log('Add MisilTele: ', p, P, M, K, D, distance, `previousWeaponType = ${CarWeapon[window.mainCar.weapon.previousWeaponType]}`, `weaponType = ${CarWeapon[window.mainCar.weapon.weaponType]}`); //, `x=${window.mainCar.img.position.x}; y=${window.mainCar.img.position.y}`);
                                                }
                                                break;
                                        }
                                    }
                                }
                            }
                        }
                        break;
                }
                window.botFactory.clock.endFrame('async');
                this.original_WebSocketOnMessage(e);
            };
            return WebSocketInterface;
        }());
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], WebSocketInterface.prototype, "onMessage", null);
        KartwarsBot.WebSocketInterface = WebSocketInterface;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
