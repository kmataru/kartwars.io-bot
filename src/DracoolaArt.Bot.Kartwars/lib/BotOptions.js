var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        /**
         * Bot Options.
         */
        var BotOptions = (function () {
            // Constructor
            function BotOptions() {
                /**
                 * Auto respawn
                 */
                this.autoRespawn = false;
                /**
                 * Size of arc for collisionAngles
                 */
                this.arcSize = Math.PI / 8;
                /**
                 * Radius multiple for side detector circle intersects
                 */
                this.radiusSideDetectorsMultiplier = 1;
                /**
                 * Radius multiple for front detector circle intersects
                 */
                this.radiusFrontDetectorMultiplier = 10;
                /**
                 * Radius multiple for behind detector circle intersects
                 */
                this.radiusBehindDetectorMultiplier = 10;
                /**
                 * Radius multiple for danger circle intersects
                 */
                this.radiusDangerMultiplier = 10;
                /**
                 * Front resource gather angle size
                 */
                this.frontResourceGatherAngle = Math.PI * 2 / 3;
                /**
                 * Front danger angle size
                 */
                this.frontDangerAngle = Math.PI / 2;
                /**
                 * Tail danger angle size
                 */
                this.tailDangerAngle = Math.PI / 2;
                /**
                 * Percent of angles covered by same danger type to be considered an encircle attempt
                 */
                this.enCircleThreshold = 0.5625;
                /**
                 * Percent of angles covered by all dangers to move to safety
                 */
                this.enCircleAllThreshold = 0.5625;
                /**
                 * Distance multiplier for enCircleAllThreshold
                 */
                this.enCircleDistanceMult = 20;
                // TODO : Description
                this.basePlayerWidth = 50;
                this.playerRadiusMultiplier = 20;
                this.playerResourceGatherRadiusMultiplier = 35;
                this.closeToImminentDangerRange = 350;
                this.tunnelSideDistance = 87.5;
                this.wall = {
                    offsetBottomY: 0,
                    offsetLeftX: 0,
                    offsetRightX: 0,
                    offsetTopY: 0,
                };
                this.fixedRadius = {
                    food: 15,
                    weapon: 45,
                };
                this.radiusEnchancer = {
                    bombs: 125 * 7.25,
                    mines: 125 * 1.75,
                    misiles: 125 * 3.5,
                    teleMisiles: 125 * 5,
                };
            }
            return BotOptions;
        }());
        KartwarsBot.BotOptions = BotOptions;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
