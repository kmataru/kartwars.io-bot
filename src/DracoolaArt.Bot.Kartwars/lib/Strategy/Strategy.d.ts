declare namespace DracoolaArt.KartwarsBot.Strategy {
	export interface IStrategy extends IActivity, IPlayerDeath {
		aggressivity: number;
		useChasingPrediction: boolean;

		FoodTactics: Tactics.Resource.Food.IFood;
		FindClosestClusterFoodTactics: Tactics.Resource.Food.IFoodCluster;
		WeaponTactics: Tactics.Resource.Weapon.IWeapon;

		FightTactics: Tactics.Fight.IFight;

		showDatGui(datGUIWrapper: IDatGUI): void;
		hideDatGui(): void;
	}
}
