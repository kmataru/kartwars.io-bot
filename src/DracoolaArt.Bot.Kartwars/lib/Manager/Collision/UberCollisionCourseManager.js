/// <reference path="../../_references.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Manager;
        (function (Manager) {
            var Collision;
            (function (Collision) {
                var UberCollisionCourseManager = (function (_super) {
                    __extends(UberCollisionCourseManager, _super);
                    function UberCollisionCourseManager() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return UberCollisionCourseManager;
                }(Collision.AdvancedCollisionCourseManager));
                Collision.UberCollisionCourseManager = UberCollisionCourseManager;
            })(Collision = Manager.Collision || (Manager.Collision = {}));
        })(Manager = KartwarsBot.Manager || (KartwarsBot.Manager = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
