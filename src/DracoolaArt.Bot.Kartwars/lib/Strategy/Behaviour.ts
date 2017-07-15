namespace DracoolaArt.KartwarsBot.Strategy.Behaviour {
	export enum FoodBehaviour {
		DoNotSeekFood = 0,

		SeekFood,
		// SeekFoodCluster,

		SeekFoodInsideFoodCluster,

		// InterceptFood, // ??
		// StayInsideFoodCluster
	}

	export enum WeaponBehaviour {
		DoNotSeekWeapons = 0,

		SeekWeaponsBasedOnAggressivity,
	}

	export enum FightBehaviour {
		DoNotFight = 0,

		ShootImmediately,
		ShootWhenEnemyInCloseRange,
		ShootWhenEnemyInBigRange,

		InterceptAndShootWhenEnemyInTunnel,
	}

	export enum AvoidanceBehaviour {
		DoNotAvoid = 0,

		AvoidLethalEnemies,
	}

	export class BehaviourBuilder {
		public static getDefaultBehaviour() {
			let behaviourData = new BehaviourData();
			behaviourData.Food = FoodBehaviour.SeekFoodInsideFoodCluster;
			behaviourData.Weapon = WeaponBehaviour.SeekWeaponsBasedOnAggressivity;
			behaviourData.Fight = FightBehaviour.ShootImmediately;
			behaviourData.Avoidance = AvoidanceBehaviour.AvoidLethalEnemies;

			return behaviourData;
		}
	}

	export class BehaviourData {
		public static defaultBehaviour: BehaviourData = BehaviourBuilder.getDefaultBehaviour();

		//
		// Food property
		private _food: FoodBehaviour;
		get Food(): FoodBehaviour {
			return this._food;
		}

		set Food(value: FoodBehaviour) {
			this._food = FoodBehaviour[FoodBehaviour[value]];
		}
		// !Food property
		//

		//
		// Weapon property
		private _weapon: WeaponBehaviour;
		get Weapon(): WeaponBehaviour {
			return this._weapon;
		}

		set Weapon(value: WeaponBehaviour) {
			this._weapon = WeaponBehaviour[WeaponBehaviour[value]];
		}
		// !Food property
		//

		//
		// Fight property
		private _fight: FightBehaviour;
		get Fight(): FightBehaviour {
			return this._fight;
		}

		set Fight(value: FightBehaviour) {
			this._fight = FightBehaviour[FightBehaviour[value]];
		}
		// !Fight property
		//

		//
		// Avoidance property
		private _avoidance: AvoidanceBehaviour;
		get Avoidance(): AvoidanceBehaviour {
			return this._avoidance;
		}

		set Avoidance(value: AvoidanceBehaviour) {
			this._avoidance = AvoidanceBehaviour[AvoidanceBehaviour[value]];
		}
		// !Avoidance property
		//
	}
}
