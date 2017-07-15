var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Strategy;
        (function (Strategy) {
            var Strategies;
            (function (Strategies) {
                Strategies[Strategies["Default"] = 0] = "Default";
                // Tests
                Strategies[Strategies["CalculateTorque"] = 1] = "CalculateTorque";
                Strategies[Strategies["BasicPursuit"] = 2] = "BasicPursuit";
                Strategies[Strategies["PursuitAndShoot"] = 3] = "PursuitAndShoot";
                Strategies[Strategies["DrawEnemies"] = 4] = "DrawEnemies";
                Strategies[Strategies["InterconnectFood"] = 5] = "InterconnectFood";
            })(Strategies = Strategy.Strategies || (Strategy.Strategies = {}));
        })(Strategy = KartwarsBot.Strategy || (KartwarsBot.Strategy = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
