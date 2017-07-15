var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Data;
        (function (Data) {
            Data.playerTurnRadius = 350 / 2;
            Data.weaponsMagnitudes = {};
            Data.weaponsMagnitudes[KartwarsBot.CarWeapon.None] =
                Data.weaponsMagnitudes[KartwarsBot.CarWeapon.Cloak] =
                    Data.weaponsMagnitudes[KartwarsBot.CarWeapon.Mine] =
                        Data.weaponsMagnitudes[KartwarsBot.CarWeapon.ThreeMines] =
                            Data.weaponsMagnitudes[KartwarsBot.CarWeapon.BigBang] =
                                Data.weaponsMagnitudes[KartwarsBot.CarWeapon.Shield] =
                                    Data.weaponsMagnitudes[KartwarsBot.CarWeapon.Magnet] = 0;
            Data.weaponsMagnitudes[KartwarsBot.CarWeapon.FastRocket] = Data.weaponsMagnitudes[KartwarsBot.CarWeapon.ThreeFastRockets] = 20; // TODO : Verify data
            Data.weaponsMagnitudes[KartwarsBot.CarWeapon.TeleRocket] = Data.weaponsMagnitudes[KartwarsBot.CarWeapon.ThreeTeleRocket] = 15; // TODO : Verify data
            Data.weaponsMagnitudes[KartwarsBot.CarWeapon.Flashes] = 40; // TODO : Verify data
            Data.weaponsMagnitudes[KartwarsBot.CarWeapon.HugeBash] = 12; // TODO : Verify data
        })(Data = KartwarsBot.Data || (KartwarsBot.Data = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
