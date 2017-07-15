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
        var Tactics;
        (function (Tactics) {
            var Resource;
            (function (Resource) {
                var Weapon;
                (function (Weapon) {
                    /**
                     * Find Closest weapon Tactic.
                     */
                    var FindClosest = (function (_super) {
                        __extends(FindClosest, _super);
                        function FindClosest() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        FindClosest.prototype.action = function (weapons) {
                            window.botFactory.clock.startFrame();
                            if (weapons == undefined) {
                                weapons = this.gameWrapper.items.getWeapons();
                            }
                            this.bot.stage = KartwarsBot.BotStageEnum.SeekWeapon;
                            var activityResult = _super.prototype.action.call(this, weapons);
                            this.drawResources(weapons, this.bot.opt.fixedRadius.weapon);
                            window.botFactory.clock.endFrame();
                            return activityResult;
                        };
                        return FindClosest;
                    }(Resource.FindClosestResourceBase));
                    Weapon.FindClosest = FindClosest;
                })(Weapon = Resource.Weapon || (Resource.Weapon = {}));
            })(Resource = Tactics.Resource || (Tactics.Resource = {}));
        })(Tactics = KartwarsBot.Tactics || (KartwarsBot.Tactics = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
