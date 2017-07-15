var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Design;
        (function (Design) {
            var Polygon;
            (function (Polygon) {
                // Default (!!To be kept for reference!!)
                var defaultCarCollisionDesign = [
                    new Victor(-0.5, 5.5),
                    new Victor(-1, 3.5),
                    new Victor(-1, 2),
                    new Victor(-1.5, 1.5),
                    new Victor(-3, 1),
                    new Victor(-3, -1.25),
                    new Victor(-1, -1),
                    new Victor(-1.25, -2.25),
                    new Victor(0, -1.75),
                    new Victor(1.25, -2.25),
                    new Victor(1, -1),
                    new Victor(3, -1.25),
                    new Victor(3, 1),
                    new Victor(1.5, 1.5),
                    new Victor(1, 2),
                    new Victor(1, 3.5),
                    new Victor(0.5, 5.5),
                ];
                // Fast Rocket
                var fastRocketCarCollisionDesign = [
                    new Victor(-0.25, 5.5),
                    new Victor(-0.75, 3.75),
                    new Victor(-0.75, 3),
                    new Victor(-0.75, 2),
                    new Victor(-1, 1.5),
                    new Victor(-1.25, 0.75),
                    new Victor(-1, 0),
                    new Victor(-0.75, -0.75),
                    new Victor(0, -1),
                    new Victor(0.75, -0.75),
                    new Victor(1, 0),
                    new Victor(1.25, 0.75),
                    new Victor(1, 1.5),
                    new Victor(0.75, 2),
                    new Victor(0.75, 3),
                    new Victor(0.75, 3.75),
                    new Victor(0.25, 5.5),
                ];
                // Tele Rocket
                var teleRocketCarCollisionDesign = defaultCarCollisionDesign;
                // Mine
                var mineCarCollisionDesign = [
                    new Victor(-0.25, 0.75),
                    new Victor(-0.25, 0.5),
                    new Victor(-0.5, 0.25),
                    new Victor(-1, 0),
                    new Victor(-1.25, -0.75),
                    new Victor(-1, -1),
                    new Victor(-1.25, -1.75),
                    new Victor(-0.5, -2),
                    new Victor(0, -2.25),
                    new Victor(0.5, -2),
                    new Victor(1.25, -1.75),
                    new Victor(1, -1),
                    new Victor(1.25, -0.75),
                    new Victor(1, 0),
                    new Victor(0.5, 0.25),
                    new Victor(0.25, 0.5),
                    new Victor(0.25, 0.75),
                ];
                // Big Bang
                var bigBangCarCollisionDesign = defaultCarCollisionDesign;
                // Shield
                var shieldCarCollisionDesign = defaultCarCollisionDesign;
                // Flash
                var flashCarCollisionDesign = [
                    new Victor(-0.25, 8),
                    new Victor(-0.5, 5),
                    new Victor(-0.75, 3),
                    new Victor(-0.75, 2),
                    new Victor(-1, 1.5),
                    new Victor(-1.25, 0.75),
                    new Victor(-1, 0),
                    new Victor(-0.75, -0.75),
                    new Victor(0, -1),
                    new Victor(0.75, -0.75),
                    new Victor(1, 0),
                    new Victor(1.25, 0.75),
                    new Victor(1, 1.5),
                    new Victor(0.75, 2),
                    new Victor(0.75, 3),
                    new Victor(0.5, 5),
                    new Victor(0.25, 8),
                ];
                // Huge Bash
                var hugeBashCarCollisionDesign = [
                    new Victor(-0.25, 4),
                    new Victor(-0.5, 3.5),
                    new Victor(-1.5, 3.25),
                    new Victor(-2, 3),
                    new Victor(-2, 2),
                    new Victor(-1.25, 0.75),
                    new Victor(-1, 0),
                    new Victor(-0.75, -0.75),
                    new Victor(0, -1),
                    new Victor(0.75, -0.75),
                    new Victor(1, 0),
                    new Victor(1.25, 0.75),
                    new Victor(2, 2),
                    new Victor(2, 3),
                    new Victor(1.5, 3.25),
                    new Victor(0.5, 3.5),
                    new Victor(0.25, 4),
                ];
                //
                //
                rotateSelf(defaultCarCollisionDesign);
                rotateSelf(fastRocketCarCollisionDesign);
                rotateSelf(mineCarCollisionDesign);
                rotateSelf(flashCarCollisionDesign);
                rotateSelf(hugeBashCarCollisionDesign);
                //
                //
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
                function rotateSelf(thisDesign) {
                    var rotation = -Math.PI / 2;
                    for (var idx = 0; idx < thisDesign.length; idx++) {
                        thisDesign[idx].rotate(rotation);
                    }
                }
                var WarCarDesigns = (function () {
                    function WarCarDesigns() {
                    }
                    WarCarDesigns.getDesign = function (weaponType) {
                        return designsDictionary[weaponType];
                    };
                    WarCarDesigns.prototype.getDesign = function (weaponType) {
                        return WarCarDesigns.getDesign(weaponType);
                    };
                    return WarCarDesigns;
                }());
                WarCarDesigns.Singleton = new WarCarDesigns();
                Polygon.WarCarDesigns = WarCarDesigns;
            })(Polygon = Design.Polygon || (Design.Polygon = {}));
        })(Design = KartwarsBot.Design || (KartwarsBot.Design = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
