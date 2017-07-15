var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Strategy;
        (function (Strategy) {
            var Behaviour;
            (function (Behaviour) {
                var FoodBehaviour;
                (function (FoodBehaviour) {
                    FoodBehaviour[FoodBehaviour["DoNotSeekFood"] = 0] = "DoNotSeekFood";
                    FoodBehaviour[FoodBehaviour["SeekFood"] = 1] = "SeekFood";
                    // SeekFoodCluster,
                    FoodBehaviour[FoodBehaviour["SeekFoodInsideFoodCluster"] = 2] = "SeekFoodInsideFoodCluster";
                    // InterceptFood, // ??
                    // StayInsideFoodCluster
                })(FoodBehaviour = Behaviour.FoodBehaviour || (Behaviour.FoodBehaviour = {}));
                var WeaponBehaviour;
                (function (WeaponBehaviour) {
                    WeaponBehaviour[WeaponBehaviour["DoNotSeekWeapons"] = 0] = "DoNotSeekWeapons";
                    WeaponBehaviour[WeaponBehaviour["SeekWeaponsBasedOnAggressivity"] = 1] = "SeekWeaponsBasedOnAggressivity";
                })(WeaponBehaviour = Behaviour.WeaponBehaviour || (Behaviour.WeaponBehaviour = {}));
                var FightBehaviour;
                (function (FightBehaviour) {
                    FightBehaviour[FightBehaviour["DoNotFight"] = 0] = "DoNotFight";
                    FightBehaviour[FightBehaviour["ShootImmediately"] = 1] = "ShootImmediately";
                    FightBehaviour[FightBehaviour["ShootWhenEnemyInCloseRange"] = 2] = "ShootWhenEnemyInCloseRange";
                    FightBehaviour[FightBehaviour["ShootWhenEnemyInBigRange"] = 3] = "ShootWhenEnemyInBigRange";
                    FightBehaviour[FightBehaviour["InterceptAndShootWhenEnemyInTunnel"] = 4] = "InterceptAndShootWhenEnemyInTunnel";
                })(FightBehaviour = Behaviour.FightBehaviour || (Behaviour.FightBehaviour = {}));
                var AvoidanceBehaviour;
                (function (AvoidanceBehaviour) {
                    AvoidanceBehaviour[AvoidanceBehaviour["DoNotAvoid"] = 0] = "DoNotAvoid";
                    AvoidanceBehaviour[AvoidanceBehaviour["AvoidLethalEnemies"] = 1] = "AvoidLethalEnemies";
                })(AvoidanceBehaviour = Behaviour.AvoidanceBehaviour || (Behaviour.AvoidanceBehaviour = {}));
                var BehaviourBuilder = (function () {
                    function BehaviourBuilder() {
                    }
                    BehaviourBuilder.getDefaultBehaviour = function () {
                        var behaviourData = new BehaviourData();
                        behaviourData.Food = FoodBehaviour.SeekFoodInsideFoodCluster;
                        behaviourData.Weapon = WeaponBehaviour.SeekWeaponsBasedOnAggressivity;
                        behaviourData.Fight = FightBehaviour.ShootImmediately;
                        behaviourData.Avoidance = AvoidanceBehaviour.AvoidLethalEnemies;
                        return behaviourData;
                    };
                    return BehaviourBuilder;
                }());
                Behaviour.BehaviourBuilder = BehaviourBuilder;
                var BehaviourData = (function () {
                    function BehaviourData() {
                    }
                    Object.defineProperty(BehaviourData.prototype, "Food", {
                        get: function () {
                            return this._food;
                        },
                        set: function (value) {
                            this._food = FoodBehaviour[FoodBehaviour[value]];
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(BehaviourData.prototype, "Weapon", {
                        get: function () {
                            return this._weapon;
                        },
                        set: function (value) {
                            this._weapon = WeaponBehaviour[WeaponBehaviour[value]];
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(BehaviourData.prototype, "Fight", {
                        get: function () {
                            return this._fight;
                        },
                        set: function (value) {
                            this._fight = FightBehaviour[FightBehaviour[value]];
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(BehaviourData.prototype, "Avoidance", {
                        get: function () {
                            return this._avoidance;
                        },
                        set: function (value) {
                            this._avoidance = AvoidanceBehaviour[AvoidanceBehaviour[value]];
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return BehaviourData;
                }());
                BehaviourData.defaultBehaviour = BehaviourBuilder.getDefaultBehaviour();
                Behaviour.BehaviourData = BehaviourData;
            })(Behaviour = Strategy.Behaviour || (Strategy.Behaviour = {}));
        })(Strategy = KartwarsBot.Strategy || (KartwarsBot.Strategy = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
