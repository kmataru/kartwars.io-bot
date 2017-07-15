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
            var DefaultStrategy = (function (_super) {
                __extends(DefaultStrategy, _super);
                function DefaultStrategy() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    // TODO : Comments
                    _this.FOOD_VALUE = 1;
                    _this.WEAPON_VALUE = 5;
                    _this.aggressivity = 65;
                    _this._collectedWeapons = 0;
                    _this.lastWeaponStatus = KartwarsBot.CarWeapon.None;
                    return _this;
                }
                Object.defineProperty(DefaultStrategy.prototype, "collectedWeapons", {
                    get: function () {
                        return this._collectedWeapons;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * On Player Death's event.
                 */
                DefaultStrategy.prototype.onPlayerDeath = function () {
                    this._collectedWeapons = 0;
                };
                DefaultStrategy.prototype.action = function () {
                    var finalActivityResult;
                    window.botFactory.clock.startFrame();
                    // Show Rage message when Shield is activated
                    window.botFactory.userInterface.setRageVisible(window.mainCar.isShieldActivated);
                    // Decides whether to run for food or weapons
                    var resourcePriority = this.resourcePriority();
                    this.fightCheck();
                    var collisionManagerActivityResult;
                    var computeCollisions = true;
                    // Disable collision computations when shield is active
                    if (window.mainCar.isShieldActivated) {
                        var elepsedTime = +(new Date()) - (+window.mainCar.shieldActivationTime);
                        // Shield lasts for 10 seconds, but this will give time to evade any danger before it expires
                        if (elepsedTime < 7500) {
                            computeCollisions = false;
                        }
                    }
                    if (computeCollisions) {
                        collisionManagerActivityResult = this.bot.CollisionManager.action();
                    }
                    if (collisionManagerActivityResult && collisionManagerActivityResult.isValid) {
                        finalActivityResult = collisionManagerActivityResult;
                    }
                    else {
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
                            finalActivityResult = this.resourceAction(resourcePriority);
                        }
                    }
                    window.botFactory.clock.endFrame();
                    return finalActivityResult;
                };
                /**
                 * Decides whether to run for food or weapons.
                 */
                DefaultStrategy.prototype.resourcePriority = function () {
                    var currentWeaponType;
                    if (window.mainCar.weapon && (currentWeaponType = window.mainCar.weapon.weaponType) != KartwarsBot.CarWeapon.None) {
                        if (currentWeaponType != this.lastWeaponStatus) {
                            this._collectedWeapons++;
                            this.lastWeaponStatus = currentWeaponType;
                        }
                    }
                    else {
                        this.lastWeaponStatus = KartwarsBot.CarWeapon.None;
                    }
                    //
                    //
                    var aggressivity = this.aggressivity;
                    var weaponA = Math.ceil(aggressivity / this.WEAPON_VALUE);
                    var foodA = 100 - aggressivity;
                    var ratio = Math.ceil(foodA / weaponA);
                    //
                    //
                    // We don't ever care for food loss.
                    var collectedFood = window.myCoins;
                    var weaponsGoal = Math.floor(collectedFood / ratio);
                    if (weaponsGoal > this._collectedWeapons) {
                        return KartwarsBot.Tactics.Resource.ResourcePriority.Weapon;
                    }
                    return KartwarsBot.Tactics.Resource.ResourcePriority.Food;
                };
                /**
                 * Fight check.
                 */
                DefaultStrategy.prototype.fightCheck = function () {
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
                                    var triggerWeaponInFront = window.mainCar.weapon.triggerLocation == KartwarsBot.CarWeaponTrigger.Front;
                                    var triggerWeaponBehind = window.mainCar.weapon.triggerLocation == KartwarsBot.CarWeaponTrigger.Behind;
                                    if (triggerWeaponInFront) {
                                        // window.log((+new Date()), `magnitude = ${window.mainCar.weapon.magnitude}`);
                                        if (window.mainCar.weapon.magnitude > 0) {
                                            this._forceChasingPrediction = true;
                                            if (this.bot.stage == KartwarsBot.BotStageEnum.InterceptEnemy) {
                                                if (this.bot.goal.state == KartwarsBot.GoalState.InFront) {
                                                    if (!window.mainCar.weapon.weaponFired) {
                                                        // window.log((+new Date()), `GoalIsInTunnel! WeaponType = ${CarWeapon[window.mainCar.weapon.weaponType]}`);
                                                        doFightTactics = true;
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            doFightTactics = true;
                                        }
                                    }
                                    else if (triggerWeaponBehind) {
                                        this._forceChasingPrediction = true;
                                        if (this.bot.stage == KartwarsBot.BotStageEnum.InterceptEnemy) {
                                            if (this.bot.goal.state == KartwarsBot.GoalState.InBack) {
                                                if (!window.mainCar.weapon.weaponFired) {
                                                    // window.log((+new Date()), `GoalIsInTunnel! WeaponType = ${CarWeapon[window.mainCar.weapon.weaponType]}`);
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
                                if (doFightTactics) {
                                    this.FightTactics.action();
                                }
                            }
                        }
                    }
                    window.botFactory.clock.endFrame();
                };
                /**
                 * Based on Resource Priority seek food or weapons.
                 * @param resourcePriority
                 */
                DefaultStrategy.prototype.resourceAction = function (resourcePriority) {
                    var resourceActivityResult = null;
                    var defaultBehaviour = Strategy.Behaviour.BehaviourData.defaultBehaviour;
                    if (defaultBehaviour.Weapon == Strategy.Behaviour.WeaponBehaviour.DoNotSeekWeapons) {
                        return this.foodAction();
                    }
                    if (resourcePriority == KartwarsBot.Tactics.Resource.ResourcePriority.Food) {
                        resourceActivityResult = this.foodAction();
                    }
                    else {
                        resourceActivityResult = this.weaponAction();
                    }
                    return resourceActivityResult;
                };
                /**
                 * Weapon action.
                 */
                DefaultStrategy.prototype.weaponAction = function () {
                    return this.WeaponTactics.action();
                };
                /**
                 * Food action.
                 */
                DefaultStrategy.prototype.foodAction = function () {
                    var foodTacticsActivityResult = null;
                    window.botFactory.clock.startFrame();
                    var defaultBehaviour = Strategy.Behaviour.BehaviourData.defaultBehaviour;
                    if (this.gameWrapper.util.isPlaying) {
                        switch (defaultBehaviour.Food) {
                            case Strategy.Behaviour.FoodBehaviour.DoNotSeekFood:
                                {
                                    // NOOP
                                    this.FoodTactics.noop();
                                    foodTacticsActivityResult = KartwarsBot.Structures.ActivityResult.CreateInvalidResponse();
                                }
                                break;
                            case Strategy.Behaviour.FoodBehaviour.SeekFood:
                                {
                                    foodTacticsActivityResult = this.FoodTactics.action();
                                }
                                break;
                            /*
                            case Behaviour.FoodBehaviour.SeekFoodCluster: {
                                // TODO : Not Implemented
                                this.FoodTactics.noop();
                            } break;
                            */
                            case Strategy.Behaviour.FoodBehaviour.SeekFoodInsideFoodCluster:
                                {
                                    //
                                    // Experimental
                                    var activityResult = this.FindClosestClusterFoodTactics.action();
                                    var foodClusterWrapper = activityResult.customData;
                                    var cluster = foodClusterWrapper.getBestCluster();
                                    if ((cluster != undefined) && (cluster.distance < cluster.highRadius)) {
                                        this.canvas.drawCircle(cluster, 'white', true, 0.15);
                                        //TraceRegister.originalNames['FindClosestCluster'] = `${cluster.distance} with ${cluster.elements.length}`;
                                        foodTacticsActivityResult = this.FoodTactics.action(cluster.elements);
                                    }
                                    else {
                                        /*
                                        if (cluster != undefined) {
                                            TraceRegister.originalNames['FindClosestCluster'] = `${cluster.distance}`;
                                        } else {
                                            TraceRegister.originalNames['FindClosestCluster'] = 'none';
                                        }
                                        */
                                        foodTacticsActivityResult = this.FoodTactics.action();
                                    }
                                    //
                                    //
                                }
                                break;
                            default:
                                {
                                    foodTacticsActivityResult = KartwarsBot.Structures.ActivityResult.CreateInvalidResponse();
                                }
                                break;
                        }
                    }
                    window.botFactory.clock.endFrame();
                    return foodTacticsActivityResult;
                };
                DefaultStrategy.prototype.initDatGui = function (datGUIWrapper) {
                    var _this = this;
                    if (this._guiIsInitialised) {
                        return;
                    }
                    var gui = datGUIWrapper.gui;
                    var smallestRadianDivisions = 32;
                    var defaultBehaviour = Strategy.Behaviour.BehaviourData.defaultBehaviour;
                    {
                        var botOptions = gui.addFolder('Bot Options');
                        this._guiElements.push(botOptions.domElement);
                        //botOptions.open();
                        gui.remember(this.bot);
                        gui.remember(this.bot.opt);
                        gui.remember(this.bot.opt.radiusEnchancer);
                        gui.remember(this.bot.opt.wall);
                        //botOptions.add(this.bot.opt, 'targetFps', 10, 60).step(5);
                        botOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.arcSize; }), Math.PI / smallestRadianDivisions, Math.PI * 2).step(Math.PI / smallestRadianDivisions).listen();
                        {
                            var radiusOptions = botOptions.addFolder('Radius');
                            radiusOptions.open();
                            radiusOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.playerRadiusMultiplier; }), 1, 50).step(0.5).name('Player');
                            radiusOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.playerResourceGatherRadiusMultiplier; }), 1, 50).step(0.5).name('Resource Gather');
                            radiusOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.radiusFrontDetectorMultiplier; }), 0.1, 50).step(0.1).name('Front Detector');
                            radiusOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.radiusBehindDetectorMultiplier; }), 0.1, 50).step(0.1).name('Behind Detector');
                            radiusOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.radiusSideDetectorsMultiplier; }), 1, 10).step(0.1).name('Side Detectors');
                            radiusOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.radiusDangerMultiplier; }), 0.1, 50).step(0.1).name('Danger');
                            radiusOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.closeToImminentDangerRange; }), 5, 1500).step(5).name('Close To Imminent Danger');
                            {
                                // TODO : WIP
                                var radiusIndividualOptions = radiusOptions.addFolder('Individual');
                            }
                        }
                        {
                            var anglesOptions = botOptions.addFolder('Angles');
                            anglesOptions.open();
                            anglesOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.frontResourceGatherAngle; }), Math.PI / smallestRadianDivisions, Math.PI * 2).step(Math.PI / smallestRadianDivisions).name('Front Resource Gather');
                            anglesOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.frontDangerAngle; }), Math.PI / smallestRadianDivisions, Math.PI * 2).step(Math.PI / smallestRadianDivisions).name('Front Danger');
                            anglesOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.tailDangerAngle; }), Math.PI / smallestRadianDivisions, Math.PI * 2).step(Math.PI / smallestRadianDivisions).name('Tail Danger');
                        }
                        {
                            var collisionManagerOptions = botOptions.addFolder('Collision Manager');
                            collisionManagerOptions.open();
                            collisionManagerOptions.add(this.bot.CollisionManager.opt, KartwarsBot.nameof(function () { return _this.bot.CollisionManager.opt.avoidanceAngle; }), -Math.PI, Math.PI).step(Math.PI / smallestRadianDivisions).name('Avoidance Angle');
                            collisionManagerOptions.add(this.bot.CollisionManager.opt, KartwarsBot.nameof(function () { return _this.bot.CollisionManager.opt.tailedDetectorAdditionalAvoidanceAngle; }), 0, Math.PI).step(Math.PI / smallestRadianDivisions).name('Tailed Avoidance Angle+');
                            collisionManagerOptions.add(this.bot.CollisionManager.opt, KartwarsBot.nameof(function () { return _this.bot.CollisionManager.opt.tailedDetectorThresholdAngle; }), Math.PI / smallestRadianDivisions, Math.PI).step(Math.PI / smallestRadianDivisions).name('Tailed Threshold Detector Angle');
                            collisionManagerOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.enCircleThreshold; }), 0.05, 1).step(0.0005).name('Encircle Threshold');
                            collisionManagerOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.enCircleAllThreshold; }), 0.05, 1).step(0.0005).name('Encircle All Threshold');
                            collisionManagerOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.enCircleDistanceMult; }), 1, 50).step(0.5).name('Encircle Distance Multiplier');
                        }
                        {
                            var wallOffsetOptions = botOptions.addFolder('Offsets');
                            wallOffsetOptions.open();
                            wallOffsetOptions.add(this.bot.opt.wall, KartwarsBot.nameof(function () { return _this.bot.opt.wall.offsetLeftX; }), -1000, 1000).step(5).name('Left X');
                            wallOffsetOptions.add(this.bot.opt.wall, KartwarsBot.nameof(function () { return _this.bot.opt.wall.offsetRightX; }), -1000, 1000).step(5).name('Right X');
                            wallOffsetOptions.add(this.bot.opt.wall, KartwarsBot.nameof(function () { return _this.bot.opt.wall.offsetTopY; }), -1000, 1000).step(5).name('Top Y');
                            wallOffsetOptions.add(this.bot.opt.wall, KartwarsBot.nameof(function () { return _this.bot.opt.wall.offsetBottomY; }), -1000, 1000).step(5).name('Bottom Y');
                        }
                        botOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.tunnelSideDistance; }), 10, 250).step(1).name('Tunnel Side Distance');
                        botOptions.add(this.bot, KartwarsBot.nameof(function () { return _this.bot.speedMult; }), 0.1, 10).step(0.1);
                        botOptions.add(this.bot.opt.radiusEnchancer, KartwarsBot.nameof(function () { return _this.bot.opt.radiusEnchancer.misiles; }), 50, 1500).step(25);
                        botOptions.add(this.bot.opt.radiusEnchancer, KartwarsBot.nameof(function () { return _this.bot.opt.radiusEnchancer.teleMisiles; }), 50, 1500).step(25);
                        botOptions.add(this.bot.opt.radiusEnchancer, KartwarsBot.nameof(function () { return _this.bot.opt.radiusEnchancer.bombs; }), 50, 1500).step(25);
                        botOptions.add(this.bot.opt.radiusEnchancer, KartwarsBot.nameof(function () { return _this.bot.opt.radiusEnchancer.mines; }), 50, 1500).step(25);
                    }
                    {
                        var foodActionsOptions = gui.addFolder('Tactics');
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
                        var behaviourOptions = gui.addFolder('Behaviour');
                        this._guiElements.push(behaviourOptions.domElement);
                        behaviourOptions.open();
                        gui.remember(this);
                        gui.remember(defaultBehaviour);
                        /* tslint:disable:object-literal-sort-keys */
                        var foodBehaviourConstrains = {
                            'Do Not Seek Food': Strategy.Behaviour.FoodBehaviour.DoNotSeekFood,
                            'Seek Food': Strategy.Behaviour.FoodBehaviour.SeekFood,
                            //'Seek Food Cluster': Behaviour.FoodBehaviour.SeekFoodCluster,
                            'Seek Food Inside Food Cluster': Strategy.Behaviour.FoodBehaviour.SeekFoodInsideFoodCluster,
                        };
                        var weaponBehaviourConstrains = {
                            'Do Not Seek Weapons': Strategy.Behaviour.WeaponBehaviour.DoNotSeekWeapons,
                            'Seek Weapons Based On Aggressivity': Strategy.Behaviour.WeaponBehaviour.SeekWeaponsBasedOnAggressivity,
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
                        /* tslint:enable:object-literal-sort-keys */
                        behaviourOptions.add(defaultBehaviour, KartwarsBot.nameof(function () { return defaultBehaviour.Food; }), foodBehaviourConstrains);
                        behaviourOptions.add(defaultBehaviour, KartwarsBot.nameof(function () { return defaultBehaviour.Weapon; }), weaponBehaviourConstrains);
                        behaviourOptions.add(defaultBehaviour, KartwarsBot.nameof(function () { return defaultBehaviour.Fight; }), fightBehaviourConstrains);
                        behaviourOptions.add(defaultBehaviour, KartwarsBot.nameof(function () { return defaultBehaviour.Avoidance; }), avoidanceBehaviourConstrains);
                        behaviourOptions.add(this, KartwarsBot.nameof(function () { return _this.useChasingPrediction; })).name('Use Chasing Prediction');
                    }
                    {
                        var findClosestClusterFoodTacticsOptions = gui.addFolder('Closest Cluster Food Tactics');
                        this._guiElements.push(findClosestClusterFoodTacticsOptions.domElement);
                        findClosestClusterFoodTacticsOptions.open();
                        gui.remember(this.FindClosestClusterFoodTactics.opt);
                        findClosestClusterFoodTacticsOptions.add(this.FindClosestClusterFoodTactics.opt, KartwarsBot.nameof(function () { return _this.FindClosestClusterFoodTactics.opt.scanRadius; }), 100, 10000).step(50);
                        findClosestClusterFoodTacticsOptions.add(this.FindClosestClusterFoodTactics.opt, KartwarsBot.nameof(function () { return _this.FindClosestClusterFoodTactics.opt.sectorSize; }), 10, 1000).step(5);
                        findClosestClusterFoodTacticsOptions.add(this.FindClosestClusterFoodTactics.opt, KartwarsBot.nameof(function () { return _this.FindClosestClusterFoodTactics.opt.minimumElementsPerCluster; }), 1, 350).step(1);
                    }
                    {
                        var fizzyTextOptions = gui.addFolder('Fizzy Text');
                        this._guiElements.push(fizzyTextOptions.domElement);
                        var fizzyText_1 = datGUIWrapper.userInterface.fizzyText;
                        gui.remember(fizzyText_1);
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.theme; })).name('Dark Theme');
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.message; })).name('Message');
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.speed; }), -5, 5).name('Speed');
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.displayOutline; })).name('Display Outline');
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.noiseStrength; })).step(5).name('Noise Strength');
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.growthSpeed; }), -5, 5).name('Growth Speed');
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.maxSize; })).min(0).step(0.25).name('maxSize');
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.color0; })).name('Color 1');
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.color1; })).name('Color 2');
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.color2; })).name('Color 3');
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.color3; })).name('Color 4');
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.explode; })).name('Explode');
                    }
                    this._guiIsInitialised = true;
                };
                return DefaultStrategy;
            }(Strategy.StrategyBase));
            Strategy.DefaultStrategy = DefaultStrategy;
        })(Strategy = KartwarsBot.Strategy || (KartwarsBot.Strategy = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
