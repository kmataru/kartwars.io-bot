namespace DracoolaArt.KartwarsBot.Tactics.Fight {
	/**
	 * Shoot When In Range Tactic.
	 */
	export class ShootWhenInRange implements ITactic, IFight {
		// Constructor
		constructor(protected readonly bot: Bot, protected readonly gameWrapper: GameWrapper, protected readonly canvas: Utils.CanvasUtils) {
		}

		public noop(): void {
			//
		}

		public action(radiusCheck?: number) {
			if (window.mainCar.weapon) {
				let enemies = this.gameWrapper.items.getEnemies();

				let triggerWeaponAnywhere = window.mainCar.weapon.triggerLocation == CarWeaponTrigger.Self;
				let triggerWeaponInFront = window.mainCar.weapon.triggerLocation == CarWeaponTrigger.Front;
				let triggerWeaponBehind = window.mainCar.weapon.triggerLocation == CarWeaponTrigger.Behind;

				for (let idx = 0, ll = enemies.length; idx < ll; idx++) {
					let thisEnemy = enemies[idx];
					
					// TODO : Check if enemy in range
					if (
						(triggerWeaponInFront && this.bot.inFrontDangerAngle(thisEnemy, radiusCheck)) ||
						(triggerWeaponBehind && this.bot.inTailDangerAngle(thisEnemy, radiusCheck)) ||
						triggerWeaponAnywhere
					) {
						//this.bot.stage = BotStageEnum.DeployWeapon;

						this.bot.fireWeaponTick();

						break;
					}
				}
			}
		}
	}
}
