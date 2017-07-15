namespace DracoolaArt.KartwarsBot.Strategy {
	export abstract class StrategyBase implements IStrategy {
		public FindClosestClusterFoodTactics: Tactics.Resource.Food.IFoodCluster;
		public ChaseClosestFightTactics: Tactics.Fight.IFightChase;
		public WeaponTactics: Tactics.Resource.Weapon.IWeapon;

		// Constructor
		constructor(protected readonly bot: Bot, protected readonly gameWrapper: GameWrapper, protected readonly canvas: Utils.CanvasUtils) {
			this.FindClosestClusterFoodTactics = new Tactics.Resource.Food.FindClosestCluster(bot, this.gameWrapper, this.canvas);
			this.ChaseClosestFightTactics = new Tactics.Fight.ChaseClosest(bot, this.gameWrapper, this.canvas);

			this.WeaponTactics = new Tactics.Resource.Weapon.FindClosest(bot, this.gameWrapper, this.canvas);
		}

		abstract aggressivity: number;

		public abstract action(): IActivityResult;
		protected abstract foodAction(): void;

		public abstract onPlayerDeath(): void;

		protected _guiElements: Array<HTMLElement> = [];
		protected _guiIsInitialised: boolean = false;

		protected abstract initDatGui(datGUIWrapper: Utils.Interface.DatGUI): void;

		//
		// canUseChasingPrediction property
		public useChasingPrediction: boolean = true;

		protected _forceChasingPrediction: boolean = false;
		get canUseChasingPrediction(): boolean {
			return this._forceChasingPrediction || this.useChasingPrediction;
		}
		// !canUseChasingPrediction property
		//

		//
		// selectedFoodTactics property
		private _selectedFoodTactics: Tactics.Resource.Food.FoodTactics = Tactics.Resource.Food.FoodTactics.Default;
		get selectedFoodTactics(): Tactics.Resource.Food.FoodTactics {
			return this._selectedFoodTactics;
		}

		set selectedFoodTactics(value: Tactics.Resource.Food.FoodTactics) {
			this._selectedFoodTactics = Tactics.Resource.Food.FoodTactics[Tactics.Resource.Food.FoodTactics[value]];
		}
		// !selectedFoodTactics property
		//

		//
		// selectedFightTactics property
		private _selectedFightTactics: Tactics.Fight.FightTactics = Tactics.Fight.FightTactics.ShootWhenInRange;
		get selectedFightTactics(): Tactics.Fight.FightTactics {
			return this._selectedFightTactics;
		}

		set selectedFightTactics(value: Tactics.Fight.FightTactics) {
			this._selectedFightTactics = Tactics.Fight.FightTactics[Tactics.Fight.FightTactics[value]];
		}
		// !selectedFoodTactics property
		//

		//
		// FoodTactics property
		private _foodTactics: Tactics.Resource.Food.IFood[] = [];
		get FoodTactics(): Tactics.Resource.Food.IFood {
			let selectedFoodTacticsOption = this.selectedFoodTactics;
			let selectedFoodTactics = this._foodTactics[selectedFoodTacticsOption];

			if (selectedFoodTactics == undefined) {
				let instance: Tactics.Resource.Food.IFood;

				switch (selectedFoodTacticsOption) {
					case Tactics.Resource.Food.FoodTactics.Default: {
						instance = new Tactics.Resource.Food.FindClosest(this.bot, this.gameWrapper, this.canvas);
					} break;

					default: {
						throw Error(`Incompatible value or type '${selectedFoodTacticsOption}' in Strategy. Type: ${typeof selectedFoodTacticsOption}.`);
					}
				}

				selectedFoodTactics = this._foodTactics[selectedFoodTacticsOption] = instance;
			}

			return selectedFoodTactics;
		}
		// !FoodTactics property
		//

		//
		// FightTactics property
		private _fightTactics: Tactics.Fight.IFight[] = [];
		get FightTactics(): Tactics.Fight.IFight {
			let selectedFightTacticsOption = this.selectedFightTactics;
			let selectedFightTactics = this._fightTactics[selectedFightTacticsOption];

			if (selectedFightTactics == undefined) {
				let instance: Tactics.Fight.IFight;

				switch (selectedFightTacticsOption) {
					case Tactics.Fight.FightTactics.ShootWhenInRange: {
						instance = new Tactics.Fight.ShootWhenInRange(this.bot, this.gameWrapper, this.canvas);
					} break;

					default: {
						throw Error(`Incompatible value or type '${selectedFightTacticsOption}' in Strategy. Type: ${typeof selectedFightTacticsOption}.`);
					}
				}

				selectedFightTactics = this._fightTactics[selectedFightTacticsOption] = instance;
			}

			return selectedFightTactics;
		}
		// !FightTactics property
		//

		public showDatGui(datGUIWrapper: Utils.Interface.DatGUI): void {
			if (!this._guiIsInitialised) {
				this.initDatGui(datGUIWrapper);
			} else {
				this._guiElements.forEach(function (element) {
					$(element).show();
				});
			}
		}

		public hideDatGui(): void {
			if (this._guiIsInitialised) {
				this._guiElements.forEach(function (element) {
					$(element).hide();
				});
			}
		}
	}
}
