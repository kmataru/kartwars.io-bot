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
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Strategy;
        (function (Strategy) {
            /**
             * Default working strategy.
             */
            var PursuitAndShootBotStrategy = (function (_super) {
                __extends(PursuitAndShootBotStrategy, _super);
                function PursuitAndShootBotStrategy() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.FOOD_VALUE = 1;
                    _this.WEAPON_VALUE = 5;
                    _this.aggressivity = 100;
                    _this.collectedWeapons = 0;
                    _this.lastWeaponStatus = KartwarsBot.CarWeapon.None;
                    return _this;
                }
                PursuitAndShootBotStrategy.prototype.onPlayerDeath = function () {
                    this.collectedWeapons = 0;
                };
                PursuitAndShootBotStrategy.prototype.action = function () {
                    var finalActivityResult;
                    window.botFactory.clock.startFrame();
                    this.fightCheck();
                    //
                    //
                    var chaseClosestFightTacticsActivityResult = null;
                    if (window.mainCar.weapon) {
                        var triggerWeaponInFront = window.mainCar.weapon.triggerLocation == KartwarsBot.CarWeaponTrigger.Front;
                        if (triggerWeaponInFront) {
                            if (this.canUseChasingPrediction) {
                                var currentWeaponMagnitude = void 0;
                                if (this._forceChasingPrediction) {
                                    currentWeaponMagnitude = window.mainCar.weapon.magnitude;
                                }
                                chaseClosestFightTacticsActivityResult = this.ChaseClosestFightTactics.action(currentWeaponMagnitude);
                            }
                        }
                    }
                    if (chaseClosestFightTacticsActivityResult && chaseClosestFightTacticsActivityResult.isValid) {
                        finalActivityResult = chaseClosestFightTacticsActivityResult;
                    }
                    else {
                        finalActivityResult = this.WeaponTactics.action();
                    }
                    window.botFactory.clock.endFrame();
                    return finalActivityResult;
                };
                /**
                 * Fight check.
                 */
                PursuitAndShootBotStrategy.prototype.fightCheck = function () {
                    window.botFactory.clock.startFrame();
                    if (this.aggressivity <= 0) {
                        return;
                    }
                    var defaultBehaviour = Strategy.Behaviour.BehaviourData.defaultBehaviour;
                    // Reset Force Chasing Prediction
                    this._forceChasingPrediction = false;
                    switch (defaultBehaviour.Fight) {
                        case Strategy.Behaviour.FightBehaviour.DoNotFight:
                            {
                                // NOOP
                                this.FightTactics.noop();
                            }
                            break;
                        case Strategy.Behaviour.FightBehaviour.ShootImmediately:
                            {
                                this.bot.fireWeapon();
                            }
                            break;
                        case Strategy.Behaviour.FightBehaviour.ShootWhenEnemyInCloseRange:
                            {
                                this.FightTactics.action();
                            }
                            break;
                        case Strategy.Behaviour.FightBehaviour.ShootWhenEnemyInBigRange:
                            {
                                this.FightTactics.action(this.bot.shapesHolster.playerCircle.radius * 2);
                            }
                            break;
                        case Strategy.Behaviour.FightBehaviour.InterceptAndShootWhenEnemyInTunnel: {
                            // TODO : Review
                            if (window.mainCar.weapon) {
                                var doFightTactics = false;
                                if (window.mainCar.weapon.isLethalWeapon) {
                                    /*
                                        Note!
                                    
                                        In combination when this case the `Chase Closest` tactic will only work with front weapons.
                                    */
                                    var triggerWeaponInFront = window.mainCar.weapon.triggerLocation == KartwarsBot.CarWeaponTrigger.Front;
                                    if (triggerWeaponInFront) {
                                        // window.log((+new Date()), `magnitude = ${window.mainCar.weapon.magnitude}`);
                                        if (window.mainCar.weapon.magnitude > 0) {
                                            this._forceChasingPrediction = true;
                                            if (this.bot.stage == KartwarsBot.BotStageEnum.InterceptEnemy) {
                                                if (this.bot.goal.isInTunnel) {
                                                    //debugger;
                                                    // window.log((+new Date()), `GoalIsInTunnel! WeaponType = ${CarWeapon[window.mainCar.weapon.weaponType]}; WeaponFired = ${window.mainCar.weapon.weaponFired}`);
                                                    if (!window.mainCar.weapon.weaponFired) {
                                                        window.log((+new Date()), "GoalIsInTunnel! WeaponType = " + KartwarsBot.CarWeapon[window.mainCar.weapon.weaponType] + "; WeaponFired = " + window.mainCar.weapon.weaponFired);
                                                        doFightTactics = true;
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            doFightTactics = true;
                                        }
                                    }
                                    else {
                                        doFightTactics = true;
                                    }
                                }
                                else {
                                    doFightTactics = true;
                                }
                                if (doFightTactics) {
                                    this.FightTactics.action();
                                }
                            }
                        }
                    }
                    window.botFactory.clock.endFrame();
                };
                /**
                 * Food action.
                 */
                PursuitAndShootBotStrategy.prototype.foodAction = function () {
                    return KartwarsBot.Structures.ActivityResult.CreateInvalidResponse();
                };
                PursuitAndShootBotStrategy.prototype.initDatGui = function (datGUIWrapper) {
                    var _this = this;
                    if (this._guiIsInitialised) {
                        return;
                    }
                    var gui = datGUIWrapper.gui;
                    var smallestRadianDivisions = 32;
                    var defaultBehaviour = Strategy.Behaviour.BehaviourData.defaultBehaviour;
                    {
                        var foodActionsOptions = gui.addFolder('Tactics (Pursuit & Shoot)');
                        this._guiElements.push(foodActionsOptions.domElement);
                        foodActionsOptions.open();
                        gui.remember(this);
                        var foodFindClosestTacticsConstrains = {
                            'FindClosest': KartwarsBot.Tactics.Resource.Food.FoodTactics.Default,
                        };
                        foodActionsOptions.add(this, KartwarsBot.nameof(function () { return _this.aggressivity; }), 0, 100).listen();
                        foodActionsOptions.add(this, KartwarsBot.nameof(function () { return _this.selectedFoodTactics; }), foodFindClosestTacticsConstrains).listen();
                    }
                    {
                        var behaviourOptions = gui.addFolder('Behaviour (Pursuit & Shoot)');
                        this._guiElements.push(behaviourOptions.domElement);
                        behaviourOptions.open();
                        gui.remember(this);
                        gui.remember(defaultBehaviour);
                        var foodBehaviourConstrains = {
                            'Do Not Seek Food': Strategy.Behaviour.FoodBehaviour.DoNotSeekFood,
                            'Seek Food': Strategy.Behaviour.FoodBehaviour.SeekFood,
                            //'Seek Food Cluster': Behaviour.FoodBehaviour.SeekFoodCluster,
                            'Seek Food Inside Food Cluster': Strategy.Behaviour.FoodBehaviour.SeekFoodInsideFoodCluster,
                        };
                        var weaponBehaviourConstrains = {
                            'Do Not Seek Weapons': Strategy.Behaviour.WeaponBehaviour.DoNotSeekWeapons,
                            'Seek Weapons Based On Agresivity': Strategy.Behaviour.WeaponBehaviour.SeekWeaponsBasedOnAggressivity,
                        };
                        var fightBehaviourConstrains = {
                            'Do Not Fight': Strategy.Behaviour.FightBehaviour.DoNotFight,
                            'Shoot Immediately': Strategy.Behaviour.FightBehaviour.ShootImmediately,
                            'Shoot When Enemy In Close Range': Strategy.Behaviour.FightBehaviour.ShootWhenEnemyInCloseRange,
                            'Shoot When Enemy In Big Range': Strategy.Behaviour.FightBehaviour.ShootWhenEnemyInBigRange,
                            //'Chase Closest & Shoot When Enemy In Close Range': Behaviour.FightBehaviour.ChaseClosest,
                            'Intercept And Shoot When Enemy In Tunnel': Strategy.Behaviour.FightBehaviour.InterceptAndShootWhenEnemyInTunnel,
                        };
                        var avoidanceBehaviourConstrains = {
                            'Do Not Avoid': Strategy.Behaviour.AvoidanceBehaviour.DoNotAvoid,
                            'Avoid Lethal Enemies': Strategy.Behaviour.AvoidanceBehaviour.AvoidLethalEnemies,
                        };
                        behaviourOptions.add(defaultBehaviour, KartwarsBot.nameof(function () { return defaultBehaviour.Food; }), foodBehaviourConstrains);
                        behaviourOptions.add(defaultBehaviour, KartwarsBot.nameof(function () { return defaultBehaviour.Weapon; }), weaponBehaviourConstrains);
                        behaviourOptions.add(defaultBehaviour, KartwarsBot.nameof(function () { return defaultBehaviour.Fight; }), fightBehaviourConstrains);
                        behaviourOptions.add(defaultBehaviour, KartwarsBot.nameof(function () { return defaultBehaviour.Avoidance; }), avoidanceBehaviourConstrains);
                        behaviourOptions.add(this, KartwarsBot.nameof(function () { return _this.useChasingPrediction; })).name('Use Chasing Prediction');
                    }
                    {
                        var visualDebuggingOptions = gui.addFolder('Visual Debugging (Pursuit & Shoot)');
                        this._guiElements.push(visualDebuggingOptions.domElement);
                        visualDebuggingOptions.open();
                        gui.remember(window);
                        gui.remember(this.canvas.opt);
                        gui.remember(this.canvas.opt.draw);
                        gui.remember(this.canvas.opt.colors);
                        visualDebuggingOptions.add(window, 'visualDebugging');
                        visualDebuggingOptions.add(this.canvas.opt, 'shadowBlur').name('Shadow Blur');
                        {
                            var visualDebuggingIndividualOptions = visualDebuggingOptions.addFolder('Individual');
                            visualDebuggingIndividualOptions.open();
                            visualDebuggingIndividualOptions.add(this.canvas.opt.draw, KartwarsBot.nameof(function () { return _this.canvas.opt.draw.player; }));
                            visualDebuggingIndividualOptions.add(this.canvas.opt.draw, KartwarsBot.nameof(function () { return _this.canvas.opt.draw.dangers; }));
                            visualDebuggingIndividualOptions.add(this.canvas.opt.draw, KartwarsBot.nameof(function () { return _this.canvas.opt.draw.food; }));
                        }
                    }
                    this._guiIsInitialised = true;
                };
                return PursuitAndShootBotStrategy;
            }(Strategy.StrategyBase));
            Strategy.PursuitAndShootBotStrategy = PursuitAndShootBotStrategy;
        })(Strategy = KartwarsBot.Strategy || (KartwarsBot.Strategy = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
