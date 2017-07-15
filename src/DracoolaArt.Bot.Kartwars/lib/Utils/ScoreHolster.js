/// <reference path="../_references.ts" />
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Utils;
        (function (Utils) {
            var ScoreHolster = (function () {
                function ScoreHolster() {
                    this.scores = [];
                }
                ScoreHolster.prototype.addScore = function (playTime, top3Time, hexagons, kills, score, maxStreak) {
                    var thisScore = new KartwarsBot.Structures.Score(playTime, top3Time, parseInt(hexagons), parseInt(kills), parseInt(score), parseInt(maxStreak));
                    this.scores.push(thisScore);
                    return this.scores;
                };
                ScoreHolster.prototype.printResults = function () {
                    var scoreMapper = function (thisScore) {
                        return {
                            'Play Time': thisScore.playTime,
                            'Top 3 Time': thisScore.top3Time,
                            'Hexagons': thisScore.hexagons,
                            'Kills': thisScore.kills,
                            'Score': thisScore.score,
                            'Max Streak': thisScore.maxStreak
                        };
                    };
                    var bestScore = this.scores.reduce(function (prev, current) {
                        return (prev.score > current.score) ? prev : current;
                    });
                    var bestScoreTable = [bestScore];
                    var table = this.scores.map(function (thisScore) {
                        return {
                            'Play Time': thisScore.playTime,
                            'Top 3 Time': thisScore.top3Time,
                            'Hexagons': thisScore.hexagons,
                            'Kills': thisScore.kills,
                            'Score': thisScore.score,
                            'Max Streak': thisScore.maxStreak
                        };
                    }); //.filter(function (h) { return h.Value !== undefined; });
                    console.group("Scores");
                    console.table(bestScoreTable);
                    console.table(table);
                    console.groupEnd();
                };
                return ScoreHolster;
            }());
            Utils.ScoreHolster = ScoreHolster;
        })(Utils = KartwarsBot.Utils || (KartwarsBot.Utils = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
