namespace DracoolaArt.KartwarsBot.Tactics.Resource.Food {
	/**
	 * Find Closest Cluster Tactic.
	 */
	export class FindClosestCluster implements ITactic, IFoodCluster {
		public opt: FindClosestClusterOptions = new FindClosestClusterOptions();
		private foodClusterWrapper: Structures.ClusterWrapper = new Structures.ClusterWrapper();

		// Constructor
		constructor(protected readonly bot: Bot, protected readonly gameWrapper: GameWrapper, protected readonly canvas: Utils.CanvasUtils) {
		}

		public noop(): void {
		}

		// TODO : Add Weapons to list too
		@MethodDecoration.trace
		public action(food?: Array<Food>): IActivityResult {
			window.botFactory.clock.startFrame();

			if (food == undefined) {
				food = this.gameWrapper.items.getFood();
			}

			//this.bot.stage = BotStageEnum.SeekFoodCluster;

			let localFoodClusters: Array<ICluster> = [];

			let playerPosition = this.gameWrapper.player.getPosition();
			let playerRadius = this.opt.scanRadius;

			food = food.filter(function (el) {
				return el.distance <= playerRadius;
			});

			window.botFactory.clock.startFrame('ElementsDensity');
			let clusters = Utils.MathUtils.get2DElementsDensity(food, this.opt.sectorSize, this.opt.minimumElementsPerCluster);
			window.botFactory.clock.endFrame('ElementsDensity');

			// Compute radius for each cluster.
			for (let clusterIdx = 0, clusterLength = clusters.length; clusterIdx < clusterLength; clusterIdx++) {
				let indexesInThisCluster = clusters[clusterIdx];

				let clusterMinX = Infinity,
					clusterMinY = Infinity,
					clusterMaxX = -Infinity,
					clusterMaxY = -Infinity;

				let localSprites: Array<Food> = [];

				for (let clusterIdy = 0, spritesLength = indexesInThisCluster.length; clusterIdy < spritesLength; clusterIdy++) {
					let element = indexesInThisCluster[clusterIdy];
					let sprite: Food = food[element];

					clusterMinX = Math.min(clusterMinX, sprite.x);
					clusterMinY = Math.min(clusterMinY, sprite.y);

					clusterMaxX = Math.max(clusterMaxX, sprite.x);
					clusterMaxY = Math.max(clusterMaxY, sprite.y);

					localSprites.push(sprite);
				}

				let clusterMedianX = (clusterMinX + clusterMaxX) / 2,
					clusterMedianY = (clusterMinY + clusterMaxY) / 2,
					clusterRadius = Math.max(clusterMaxX - clusterMinX, clusterMaxY - clusterMinY) / 2;

				let circle: ICircle = new Structures.Circle(
					clusterMedianX,
					clusterMedianY,
					clusterRadius
				);

				let thisCluster = new Structures.Cluster(circle, localSprites);
				thisCluster.distance = Utils.MathUtils.getDistance(thisCluster, playerPosition);
				localFoodClusters.push(thisCluster);

				// Draw food cluster
				this.canvas.drawFoodCluster(circle, indexesInThisCluster.length);
			}

			// Draw food cluster scan boundary
			this.canvas.drawFoodClusterBoundary(playerRadius);

			this.foodClusterWrapper.foodClusters = localFoodClusters;

			window.botFactory.clock.endFrame();

			return Structures.ActivityResult.CreateCustomResponse(this.foodClusterWrapper);
		}
	}
}
