var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Tactics;
        (function (Tactics) {
            var Resource;
            (function (Resource) {
                var ResourcePriority;
                (function (ResourcePriority) {
                    ResourcePriority[ResourcePriority["Food"] = 0] = "Food";
                    ResourcePriority[ResourcePriority["Weapon"] = 1] = "Weapon";
                })(ResourcePriority = Resource.ResourcePriority || (Resource.ResourcePriority = {}));
            })(Resource = Tactics.Resource || (Tactics.Resource = {}));
        })(Tactics = KartwarsBot.Tactics || (KartwarsBot.Tactics = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
