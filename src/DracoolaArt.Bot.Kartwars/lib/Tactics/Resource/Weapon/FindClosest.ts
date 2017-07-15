namespace DracoolaArt.KartwarsBot.Tactics.Resource.Weapon {
	/**
	 * Find Closest weapon Tactic.
	 */
	export class FindClosest extends Resource.FindClosestResourceBase<Item> implements ITactic, IWeapon {
		public action(weapons?: Array<Item>): IActivityResult {
			window.botFactory.clock.startFrame();

			if (weapons == undefined) {
				weapons = this.gameWrapper.items.getWeapons();
			}

			this.bot.stage = BotStageEnum.SeekWeapon;

			let activityResult: IActivityResult = super.action(weapons);

			this.drawResources(weapons, this.bot.opt.fixedRadius.weapon);

			window.botFactory.clock.endFrame();

			return activityResult;
		}
	}
}
