var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Tactics;
        (function (Tactics) {
            var Fight;
            (function (Fight) {
                var FightTactics;
                (function (FightTactics) {
                    FightTactics[FightTactics["ShootWhenInRange"] = 0] = "ShootWhenInRange";
                })(FightTactics = Fight.FightTactics || (Fight.FightTactics = {}));
            })(Fight = Tactics.Fight || (Tactics.Fight = {}));
        })(Tactics = KartwarsBot.Tactics || (KartwarsBot.Tactics = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
