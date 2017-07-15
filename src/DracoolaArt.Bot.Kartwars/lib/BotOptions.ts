namespace DracoolaArt.KartwarsBot {
	/**
	 * Bot Options.
	 */
    export class BotOptions {
		/**
		 * Auto respawn
		 */
        public autoRespawn: boolean = false;

		/**
		 * Size of arc for collisionAngles
		 */
        public arcSize: number = Math.PI / 8;
		/**
		 * Radius multiple for side detector circle intersects
		 */
        public radiusSideDetectorsMultiplier: number = 1;

		/**
		 * Radius multiple for front detector circle intersects
		 */
        public radiusFrontDetectorMultiplier: number = 10;

		/**
		 * Radius multiple for behind detector circle intersects
		 */
        public radiusBehindDetectorMultiplier: number = 10;

		/**
		 * Radius multiple for danger circle intersects
		 */
        public radiusDangerMultiplier: number = 10;

		/**
		 * Front resource gather angle size
		 */
        public frontResourceGatherAngle: number = Math.PI * 2 / 3;

		/**
		 * Front danger angle size
		 */
        public frontDangerAngle: number = Math.PI / 2;

		/**
		 * Tail danger angle size
		 */
        public tailDangerAngle: number = Math.PI / 2;

		/**
		 * Percent of angles covered by same danger type to be considered an encircle attempt
		 */
        public enCircleThreshold: number = 0.5625;

		/**
		 * Percent of angles covered by all dangers to move to safety
		 */
        public enCircleAllThreshold: number = 0.5625;

		/**
		 * Distance multiplier for enCircleAllThreshold
		 */
        public enCircleDistanceMult: number = 20;

        // TODO : Description
        public basePlayerWidth: number = 50;
        public playerRadiusMultiplier: number = 20;
        public playerResourceGatherRadiusMultiplier: number = 35;

        public closeToImminentDangerRange: number = 350;
        public tunnelSideDistance: number = 87.5;

        public wall: {
            offsetBottomY: number,
            offsetLeftX: number,
            offsetRightX: number,
            offsetTopY: number,
        };

        public fixedRadius: {
            food: number,
            weapon: number,
        };

        public radiusEnchancer: {
            bombs: number,
            mines: number,
            misiles: number,
            teleMisiles: number,
        };

        // Constructor
        constructor() {
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
                bombs: 125 * 7.25, // 906.25
                mines: 125 * 1.75, // 218.75
                misiles: 125 * 3.5, // 437.5
                teleMisiles: 125 * 5, // 625
            };
        }
    }
}
