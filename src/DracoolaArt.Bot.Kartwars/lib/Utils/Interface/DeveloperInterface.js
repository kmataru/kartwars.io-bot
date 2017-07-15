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
        var Utils;
        (function (Utils) {
            var Interface;
            (function (Interface) {
                var DeveloperInterfaceIndividualOptions = (function () {
                    function DeveloperInterfaceIndividualOptions(developerInterfaceOptions) {
                        this.developerInterfaceOptions = developerInterfaceOptions;
                        //
                        // stageChange property
                        this._stageChange = false;
                        // !stageChange property
                        //
                        //
                        // playerAliveChange property
                        this._playerAliveChange = false;
                        // !playerAliveChange property
                        //
                        //
                        // chaseNewEnemy property
                        this._chaseNewEnemy = false;
                        // !chaseNewEnemy property
                        //
                        //
                        // scoreTable property
                        this._scoreTable = true;
                        // !scoreTable property
                        //
                        //
                        // experimentalContextMenu property
                        this._experimentalContextMenu = false;
                        // !experimentalContextMenu property
                        //
                        //
                        // acceleration property
                        this._acceleration = false;
                    }
                    Object.defineProperty(DeveloperInterfaceIndividualOptions.prototype, "stageChange", {
                        get: function () {
                            return this.developerInterfaceOptions.logDebugging && this._stageChange;
                        },
                        set: function (value) {
                            this._stageChange = value;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(DeveloperInterfaceIndividualOptions.prototype, "playerAliveChange", {
                        get: function () {
                            return this.developerInterfaceOptions.logDebugging && this._playerAliveChange;
                        },
                        set: function (value) {
                            this._playerAliveChange = value;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(DeveloperInterfaceIndividualOptions.prototype, "chaseNewEnemy", {
                        get: function () {
                            return this.developerInterfaceOptions.logDebugging && this._chaseNewEnemy;
                        },
                        set: function (value) {
                            this._chaseNewEnemy = value;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(DeveloperInterfaceIndividualOptions.prototype, "scoreTable", {
                        get: function () {
                            return this.developerInterfaceOptions.logDebugging && this._scoreTable;
                        },
                        set: function (value) {
                            this._scoreTable = value;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(DeveloperInterfaceIndividualOptions.prototype, "experimentalContextMenu", {
                        get: function () {
                            return this.developerInterfaceOptions.logDebugging && this._experimentalContextMenu;
                        },
                        set: function (value) {
                            this._experimentalContextMenu = value;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(DeveloperInterfaceIndividualOptions.prototype, "acceleration", {
                        get: function () {
                            return this.developerInterfaceOptions.logDebugging && this._acceleration;
                        },
                        set: function (value) {
                            this._acceleration = value;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return DeveloperInterfaceIndividualOptions;
                }());
                Interface.DeveloperInterfaceIndividualOptions = DeveloperInterfaceIndividualOptions;
                var DeveloperInterfaceOptions = (function () {
                    function DeveloperInterfaceOptions() {
                        /**
                         * Log debugging.
                         */
                        this.logDebugging = true;
                        /**
                         * Individual logging options.
                         */
                        this.individual = new DeveloperInterfaceIndividualOptions(this);
                    }
                    return DeveloperInterfaceOptions;
                }());
                Interface.DeveloperInterfaceOptions = DeveloperInterfaceOptions;
                var DeveloperInterface = (function () {
                    // Constructor
                    function DeveloperInterface(gameWrapper, bot, userInterface) {
                        this.gameWrapper = gameWrapper;
                        this.bot = bot;
                        this.userInterface = userInterface;
                        this.opt = new DeveloperInterfaceOptions();
                    }
                    DeveloperInterface.prototype.boot = function () {
                        var _this = this;
                        this.bot.watch('stage', function (id, oldValue, newValue) {
                            if (_this.opt.individual.stageChange) {
                                if (oldValue != newValue) {
                                    window.log("Bot Stage: " + KartwarsBot.BotStageEnum[+oldValue] + " -> " + KartwarsBot.BotStageEnum[+newValue]);
                                }
                            }
                            return newValue;
                        });
                    };
                    DeveloperInterface.prototype.onGameReadyDelegate = function () {
                        var _this = this;
                        window.mainCar.img.watch('alive', function (id, oldValue, newValue) {
                            if (oldValue != newValue) {
                                if (_this.opt.individual.playerAliveChange) {
                                    window.log('Player Alive:', newValue);
                                }
                                _this.bot.onPlayerDeath();
                                _this.bot.Strategy.onPlayerDeath();
                                _this.userInterface.onPlayerDeath();
                                if (_this.bot.opt.autoRespawn) {
                                    setTimeout(_this.gameWrapper.util.delayedConnect, 5000);
                                }
                            }
                            return newValue;
                        });
                    };
                    return DeveloperInterface;
                }());
                __decorate([
                    KartwarsBot.MethodDecoration.bound
                ], DeveloperInterface.prototype, "onGameReadyDelegate", null);
                Interface.DeveloperInterface = DeveloperInterface;
                var AdsInterface = (function () {
                    function AdsInterface() {
                        (function (i, s, o, g, r, a, m) {
                            i['GoogleAnalyticsObject'] = r;
                            i[r] = i[r] || function () {
                                (i[r].q = i[r].q || []).push(arguments);
                            }, i[r].l = +(new Date());
                            a = s.createElement(o),
                                m = s.getElementsByTagName(o)[0];
                            a.async = 1;
                            a.src = g;
                            m.parentNode.insertBefore(a, m);
                        })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'kga');
                        kga('create', 'UA-64079204-4', 'auto');
                        kga('send', 'pageview');
                    }
                    return AdsInterface;
                }());
                Interface.AdsInterface = AdsInterface;
            })(Interface = Utils.Interface || (Utils.Interface = {}));
        })(Utils = KartwarsBot.Utils || (KartwarsBot.Utils = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
