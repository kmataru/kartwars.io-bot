var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Tactics;
        (function (Tactics) {
            var Fight;
            (function (Fight) {
                /**
                 * Shoot When In Range Tactic.
                 */
                var ShootWhenInRange = (function () {
                    // Constructor
                    function ShootWhenInRange(bot, gameWrapper, canvas) {
                        this.bot = bot;
                        this.gameWrapper = gameWrapper;
                        this.canvas = canvas;
                    }
                    ShootWhenInRange.prototype.noop = function () {
                        //
                    };
                    ShootWhenInRange.prototype.action = function (radiusCheck) {
                        if (window.mainCar.weapon) {
                            var enemies = this.gameWrapper.items.getEnemies();
                            var triggerWeaponAnywhere = window.mainCar.weapon.triggerLocation == KartwarsBot.CarWeaponTrigger.Self;
                            var triggerWeaponInFront = window.mainCar.weapon.triggerLocation == KartwarsBot.CarWeaponTrigger.Front;
                            var triggerWeaponBehind = window.mainCar.weapon.triggerLocation == KartwarsBot.CarWeaponTrigger.Behind;
                            for (var idx = 0, ll = enemies.length; idx < ll; idx++) {
                                var thisEnemy = enemies[idx];
                                // TODO : Check if enemy in range
                                if ((triggerWeaponInFront && this.bot.inFrontDangerAngle(thisEnemy, radiusCheck)) ||
                                    (triggerWeaponBehind && this.bot.inTailDangerAngle(thisEnemy, radiusCheck)) ||
                                    triggerWeaponAnywhere) {
                                    //this.bot.stage = BotStageEnum.DeployWeapon;
                                    this.bot.fireWeaponTick();
                                    break;
                                }
                            }
                        }
                    };
                    return ShootWhenInRange;
                }());
                Fight.ShootWhenInRange = ShootWhenInRange;
            })(Fight = Tactics.Fight || (Tactics.Fight = {}));
        })(Tactics = KartwarsBot.Tactics || (KartwarsBot.Tactics = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
