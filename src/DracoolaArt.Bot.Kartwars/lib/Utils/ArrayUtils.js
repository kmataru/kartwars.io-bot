/// <reference path="../_references.ts" />
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Utils;
        (function (Utils) {
            /**
             * Array utils.
             */
            var ArrayUtils = (function () {
                function ArrayUtils() {
                }
                /**
                 * Sorting by 'score' property descending.
                 * @param a
                 * @param b
                 */
                ArrayUtils.sortScore = function (a, b) {
                    return b.score - a.score;
                };
                /**
                 * Sorting by 'sz' property descending.
                 * @param a
                 * @param b
                 */
                ArrayUtils.sortSz = function (a, b) {
                    return b.sz - a.sz;
                };
                /**
                 * Sorting by 'distance' property ascending.
                 * @param a
                 * @param b
                 */
                ArrayUtils.sortDistance = function (a, b) {
                    return a.distance - b.distance;
                };
                /**
                 * Sorting by 'distance2' property ascending.
                 * @param a
                 * @param b
                 */
                ArrayUtils.sortDistance2 = function (a, b) {
                    return a.distance2 - b.distance2;
                };
                return ArrayUtils;
            }());
            Utils.ArrayUtils = ArrayUtils;
        })(Utils = KartwarsBot.Utils || (KartwarsBot.Utils = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
