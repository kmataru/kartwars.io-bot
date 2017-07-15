var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Strategy;
        (function (Strategy) {
            var StrategyBase = (function () {
                // Constructor
                function StrategyBase(bot, gameWrapper, canvas) {
                    this.bot = bot;
                    this.gameWrapper = gameWrapper;
                    this.canvas = canvas;
                    this._guiElements = [];
                    this._guiIsInitialised = false;
                    //
                    // canUseChasingPrediction property
                    this.useChasingPrediction = true;
                    this._forceChasingPrediction = false;
                    // !canUseChasingPrediction property
                    //
                    //
                    // selectedFoodTactics property
                    this._selectedFoodTactics = KartwarsBot.Tactics.Resource.Food.FoodTactics.Default;
                    // !selectedFoodTactics property
                    //
                    //
                    // selectedFightTactics property
                    this._selectedFightTactics = KartwarsBot.Tactics.Fight.FightTactics.ShootWhenInRange;
                    // !selectedFoodTactics property
                    //
                    //
                    // FoodTactics property
                    this._foodTactics = [];
                    // !FoodTactics property
                    //
                    //
                    // FightTactics property
                    this._fightTactics = [];
                    this.FindClosestClusterFoodTactics = new KartwarsBot.Tactics.Resource.Food.FindClosestCluster(bot, this.gameWrapper, this.canvas);
                    this.ChaseClosestFightTactics = new KartwarsBot.Tactics.Fight.ChaseClosest(bot, this.gameWrapper, this.canvas);
                    this.WeaponTactics = new KartwarsBot.Tactics.Resource.Weapon.FindClosest(bot, this.gameWrapper, this.canvas);
                }
                Object.defineProperty(StrategyBase.prototype, "canUseChasingPrediction", {
                    get: function () {
                        return this._forceChasingPrediction || this.useChasingPrediction;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(StrategyBase.prototype, "selectedFoodTactics", {
                    get: function () {
                        return this._selectedFoodTactics;
                    },
                    set: function (value) {
                        this._selectedFoodTactics = KartwarsBot.Tactics.Resource.Food.FoodTactics[KartwarsBot.Tactics.Resource.Food.FoodTactics[value]];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(StrategyBase.prototype, "selectedFightTactics", {
                    get: function () {
                        return this._selectedFightTactics;
                    },
                    set: function (value) {
                        this._selectedFightTactics = KartwarsBot.Tactics.Fight.FightTactics[KartwarsBot.Tactics.Fight.FightTactics[value]];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(StrategyBase.prototype, "FoodTactics", {
                    get: function () {
                        var selectedFoodTacticsOption = this.selectedFoodTactics;
                        var selectedFoodTactics = this._foodTactics[selectedFoodTacticsOption];
                        if (selectedFoodTactics == undefined) {
                            var instance = void 0;
                            switch (selectedFoodTacticsOption) {
                                case KartwarsBot.Tactics.Resource.Food.FoodTactics.Default:
                                    {
                                        instance = new KartwarsBot.Tactics.Resource.Food.FindClosest(this.bot, this.gameWrapper, this.canvas);
                                    }
                                    break;
                                default: {
                                    throw Error("Incompatible value or type '" + selectedFoodTacticsOption + "' in Strategy. Type: " + typeof selectedFoodTacticsOption + ".");
                                }
                            }
                            selectedFoodTactics = this._foodTactics[selectedFoodTacticsOption] = instance;
                        }
                        return selectedFoodTactics;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(StrategyBase.prototype, "FightTactics", {
                    get: function () {
                        var selectedFightTacticsOption = this.selectedFightTactics;
                        var selectedFightTactics = this._fightTactics[selectedFightTacticsOption];
                        if (selectedFightTactics == undefined) {
                            var instance = void 0;
                            switch (selectedFightTacticsOption) {
                                case KartwarsBot.Tactics.Fight.FightTactics.ShootWhenInRange:
                                    {
                                        instance = new KartwarsBot.Tactics.Fight.ShootWhenInRange(this.bot, this.gameWrapper, this.canvas);
                                    }
                                    break;
                                default: {
                                    throw Error("Incompatible value or type '" + selectedFightTacticsOption + "' in Strategy. Type: " + typeof selectedFightTacticsOption + ".");
                                }
                            }
                            selectedFightTactics = this._fightTactics[selectedFightTacticsOption] = instance;
                        }
                        return selectedFightTactics;
                    },
                    enumerable: true,
                    configurable: true
                });
                // !FightTactics property
                //
                StrategyBase.prototype.showDatGui = function (datGUIWrapper) {
                    if (!this._guiIsInitialised) {
                        this.initDatGui(datGUIWrapper);
                    }
                    else {
                        this._guiElements.forEach(function (element) {
                            $(element).show();
                        });
                    }
                };
                StrategyBase.prototype.hideDatGui = function () {
                    if (this._guiIsInitialised) {
                        this._guiElements.forEach(function (element) {
                            $(element).hide();
                        });
                    }
                };
                return StrategyBase;
            }());
            Strategy.StrategyBase = StrategyBase;
        })(Strategy = KartwarsBot.Strategy || (KartwarsBot.Strategy = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
