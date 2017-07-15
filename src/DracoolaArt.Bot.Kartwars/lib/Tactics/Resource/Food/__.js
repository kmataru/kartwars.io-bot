var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Tactics;
        (function (Tactics) {
            var Resource;
            (function (Resource) {
                var Food;
                (function (Food) {
                    var FoodTactics;
                    (function (FoodTactics) {
                        FoodTactics[FoodTactics["Default"] = 0] = "Default";
                    })(FoodTactics = Food.FoodTactics || (Food.FoodTactics = {}));
                })(Food = Resource.Food || (Resource.Food = {}));
            })(Resource = Tactics.Resource || (Tactics.Resource = {}));
        })(Tactics = KartwarsBot.Tactics || (KartwarsBot.Tactics = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
