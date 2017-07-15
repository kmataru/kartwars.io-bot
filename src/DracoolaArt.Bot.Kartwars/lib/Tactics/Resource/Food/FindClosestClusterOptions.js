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
                    var FindClosestClusterOptions = (function () {
                        function FindClosestClusterOptions() {
                            this.scanRadius = 3500 / 2;
                            this.sectorSize = 350;
                            this.minimumElementsPerCluster = 15;
                        }
                        return FindClosestClusterOptions;
                    }());
                    Food.FindClosestClusterOptions = FindClosestClusterOptions;
                })(Food = Resource.Food || (Resource.Food = {}));
            })(Resource = Tactics.Resource || (Tactics.Resource = {}));
        })(Tactics = KartwarsBot.Tactics || (KartwarsBot.Tactics = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
