namespace DracoolaArt.KartwarsBot.Tactics.Resource.Food {
	/**
	 * Find Closest food Tactic.
	 */
	export class FindClosest extends Resource.FindClosestResourceBase<Food> implements ITactic, IFood {
		public action(food?: Array<Food>): IActivityResult {
			window.botFactory.clock.startFrame();

			if (food == undefined) {
				food = this.gameWrapper.items.getFood();
			}

			this.bot.stage = BotStageEnum.SeekFood;

			let activityResult: IActivityResult = super.action(food);

			this.drawResources(food, this.bot.opt.fixedRadius.food);

			window.botFactory.clock.endFrame();

			return activityResult;
		}
	}
}
