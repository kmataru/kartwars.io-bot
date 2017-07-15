var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Design;
        (function (Design) {
            var Circle;
            (function (Circle) {
                // Default (!!To be kept for reference!!)
                var defaultCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                // Fast Rocket
                var fastRocketCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 2, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                // Tele Rocket
                var teleRocketCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 2, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                // Mine
                var mineCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 2, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                // Big Bang
                var bigBangCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 3, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                // Shield
                var shieldCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 2, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                // Flash
                var flashCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 2, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                // Huge Bash
                var hugeBashCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 2, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                var designsDictionary = {};
                designsDictionary[KartwarsBot.CarWeapon.None] = null;
                designsDictionary[KartwarsBot.CarWeapon.FastRocket] = fastRocketCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.ThreeFastRockets] = fastRocketCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.TeleRocket] = teleRocketCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.Cloak] = null;
                designsDictionary[KartwarsBot.CarWeapon.Mine] = mineCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.ThreeMines] = mineCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.BigBang] = bigBangCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.ThreeTeleRocket] = teleRocketCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.Shield] = shieldCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.Flashes] = flashCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.Magnet] = null;
                designsDictionary[KartwarsBot.CarWeapon.HugeBash] = hugeBashCarCollisionDesign;
                //
                var WarCarDesigns = (function () {
                    function WarCarDesigns() {
                    }
                    WarCarDesigns.getDesign = function (weaponType) {
                        return designsDictionary[weaponType];
                    };
                    Object.defineProperty(WarCarDesigns.prototype, "DesignDetails", {
                        get: function () {
                            return WarCarDesigns.DesignDetails;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    WarCarDesigns.prototype.getDesign = function (weaponType) {
                        return WarCarDesigns.getDesign(weaponType);
                    };
                    return WarCarDesigns;
                }());
                WarCarDesigns.Singleton = new WarCarDesigns();
                WarCarDesigns.DesignDetails = {
                    widthCenter: (defaultCarCollisionDesign[0].length - 1) / 2,
                    heightCenter: (defaultCarCollisionDesign.length - 1) / 2
                };
                Circle.WarCarDesigns = WarCarDesigns;
            })(Circle = Design.Circle || (Design.Circle = {}));
        })(Design = KartwarsBot.Design || (KartwarsBot.Design = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
