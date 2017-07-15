/* tslint:disable */

namespace DracoolaArt.KartwarsBot.Strategy {
	/**
	 * Default working strategy.
	 */
	export class PursuitAndShootBotStrategy extends StrategyBase {
		FOOD_VALUE: number = 1;
		WEAPON_VALUE: number = 5;

		aggressivity: number = 100;

		collectedWeapons: number = 0;

		lastWeaponStatus: CarWeapon = CarWeapon.None;
		
		public onPlayerDeath() {
			this.collectedWeapons = 0;
		}

		public action(): IActivityResult {
			let finalActivityResult: IActivityResult;

			window.botFactory.clock.startFrame();

			this.fightCheck();

			//
			//

			let chaseClosestFightTacticsActivityResult: IActivityResult = null;

			if (window.mainCar.weapon) {
				let triggerWeaponInFront = window.mainCar.weapon.triggerLocation == CarWeaponTrigger.Front;

				if (triggerWeaponInFront) {
					if (this.canUseChasingPrediction) {
						let currentWeaponMagnitude: number;

						if (this._forceChasingPrediction) {
							currentWeaponMagnitude = window.mainCar.weapon.magnitude;
						}

						chaseClosestFightTacticsActivityResult = this.ChaseClosestFightTactics.action(currentWeaponMagnitude);
					}
				}
			}

			if (chaseClosestFightTacticsActivityResult && chaseClosestFightTacticsActivityResult.isValid) {
				finalActivityResult = chaseClosestFightTacticsActivityResult;
			} else {
				finalActivityResult = this.WeaponTactics.action();
			}

			window.botFactory.clock.endFrame();

			return finalActivityResult;
		}

		/**
		 * Fight check.
		 */
		protected fightCheck() {
			window.botFactory.clock.startFrame();

			if (this.aggressivity <= 0) {
				return;
			}

			let defaultBehaviour: Behaviour.BehaviourData = Behaviour.BehaviourData.defaultBehaviour;

			// Reset Force Chasing Prediction
			this._forceChasingPrediction = false;

			switch (defaultBehaviour.Fight) {
				case Behaviour.FightBehaviour.DoNotFight: {
					// NOOP
					this.FightTactics.noop();
				} break;

				case Behaviour.FightBehaviour.ShootImmediately: {
					this.bot.fireWeapon();
				} break;

				case Behaviour.FightBehaviour.ShootWhenEnemyInCloseRange: {
					this.FightTactics.action();
				} break;

				case Behaviour.FightBehaviour.ShootWhenEnemyInBigRange: {
					this.FightTactics.action(this.bot.shapesHolster.playerCircle.radius * 2);
				} break;

				case Behaviour.FightBehaviour.InterceptAndShootWhenEnemyInTunnel: {
					// TODO : Review
					if (window.mainCar.weapon) {
						let doFightTactics = false;

						if (window.mainCar.weapon.isLethalWeapon) {
							/*
								Note!
							
								In combination when this case the `Chase Closest` tactic will only work with front weapons.
							*/

							let triggerWeaponInFront = window.mainCar.weapon.triggerLocation == CarWeaponTrigger.Front;
							if (triggerWeaponInFront) {
								// window.log((+new Date()), `magnitude = ${window.mainCar.weapon.magnitude}`);

								if (window.mainCar.weapon.magnitude > 0) {
									this._forceChasingPrediction = true;

									if (this.bot.stage == BotStageEnum.InterceptEnemy) {
										if (this.bot.goal.isInTunnel) {
											//debugger;

											// window.log((+new Date()), `GoalIsInTunnel! WeaponType = ${CarWeapon[window.mainCar.weapon.weaponType]}; WeaponFired = ${window.mainCar.weapon.weaponFired}`);

											if (!window.mainCar.weapon.weaponFired) {
												window.log((+new Date()), `GoalIsInTunnel! WeaponType = ${CarWeapon[window.mainCar.weapon.weaponType]}; WeaponFired = ${window.mainCar.weapon.weaponFired}`);

												doFightTactics = true;
											}
										}
									}
								} else {
									doFightTactics = true;
								}
							} else {
								doFightTactics = true;
							}
						} else {
							doFightTactics = true;
						}

						if (doFightTactics) {
							this.FightTactics.action();
						}
					}
				}
			}

			window.botFactory.clock.endFrame();
		}

		/**
		 * Food action.
		 */
		protected foodAction(): IActivityResult {
			return Structures.ActivityResult.CreateInvalidResponse();
		}

		protected initDatGui(datGUIWrapper: Utils.Interface.DatGUI): void {
			if (this._guiIsInitialised) {
				return;
			}

			let gui = datGUIWrapper.gui;

			let smallestRadianDivisions = 32;

			let defaultBehaviour: Behaviour.BehaviourData = Behaviour.BehaviourData.defaultBehaviour;

			{
				let foodActionsOptions = gui.addFolder('Tactics (Pursuit & Shoot)');
				this._guiElements.push(foodActionsOptions.domElement);
				foodActionsOptions.open();

				gui.remember(this);

				let foodFindClosestTacticsConstrains = {
					'FindClosest': Tactics.Resource.Food.FoodTactics.Default,
				};

				foodActionsOptions.add(this, nameof(() => this.aggressivity), 0, 100).listen();
				foodActionsOptions.add(this, nameof(() => this.selectedFoodTactics), foodFindClosestTacticsConstrains).listen();
			}

			{
				let behaviourOptions = gui.addFolder('Behaviour (Pursuit & Shoot)');
				this._guiElements.push(behaviourOptions.domElement);
				behaviourOptions.open();

				gui.remember(this);
				gui.remember(defaultBehaviour);

				let foodBehaviourConstrains = {
					'Do Not Seek Food': Behaviour.FoodBehaviour.DoNotSeekFood,
					'Seek Food': Behaviour.FoodBehaviour.SeekFood,
					//'Seek Food Cluster': Behaviour.FoodBehaviour.SeekFoodCluster,
					'Seek Food Inside Food Cluster': Behaviour.FoodBehaviour.SeekFoodInsideFoodCluster,
				};

				let weaponBehaviourConstrains = {
					'Do Not Seek Weapons': Behaviour.WeaponBehaviour.DoNotSeekWeapons,
					'Seek Weapons Based On Agresivity': Behaviour.WeaponBehaviour.SeekWeaponsBasedOnAggressivity,
				};

				let fightBehaviourConstrains = {
					'Do Not Fight': Behaviour.FightBehaviour.DoNotFight,
					'Shoot Immediately': Behaviour.FightBehaviour.ShootImmediately,
					'Shoot When Enemy In Close Range': Behaviour.FightBehaviour.ShootWhenEnemyInCloseRange,
					'Shoot When Enemy In Big Range': Behaviour.FightBehaviour.ShootWhenEnemyInBigRange,
					//'Chase Closest & Shoot When Enemy In Close Range': Behaviour.FightBehaviour.ChaseClosest,
					'Intercept And Shoot When Enemy In Tunnel': Behaviour.FightBehaviour.InterceptAndShootWhenEnemyInTunnel,
				};

				let avoidanceBehaviourConstrains = {
					'Do Not Avoid': Behaviour.AvoidanceBehaviour.DoNotAvoid,
					'Avoid Lethal Enemies': Behaviour.AvoidanceBehaviour.AvoidLethalEnemies,
				};

				behaviourOptions.add(defaultBehaviour, nameof(() => defaultBehaviour.Food), foodBehaviourConstrains);
				behaviourOptions.add(defaultBehaviour, nameof(() => defaultBehaviour.Weapon), weaponBehaviourConstrains);
				behaviourOptions.add(defaultBehaviour, nameof(() => defaultBehaviour.Fight), fightBehaviourConstrains);
				behaviourOptions.add(defaultBehaviour, nameof(() => defaultBehaviour.Avoidance), avoidanceBehaviourConstrains);

				behaviourOptions.add(this, nameof(() => this.useChasingPrediction)).name('Use Chasing Prediction');
			}

			{
				let visualDebuggingOptions = gui.addFolder('Visual Debugging (Pursuit & Shoot)');
				this._guiElements.push(visualDebuggingOptions.domElement);
				visualDebuggingOptions.open();

				gui.remember(window);
				gui.remember(this.canvas.opt);
				gui.remember(this.canvas.opt.draw);
				gui.remember(this.canvas.opt.colors);

				visualDebuggingOptions.add(window, 'visualDebugging');

				visualDebuggingOptions.add(this.canvas.opt, 'shadowBlur').name('Shadow Blur');

				{
					let visualDebuggingIndividualOptions = visualDebuggingOptions.addFolder('Individual');
					visualDebuggingIndividualOptions.open();

					visualDebuggingIndividualOptions.add(this.canvas.opt.draw, nameof(() => this.canvas.opt.draw.player));
					visualDebuggingIndividualOptions.add(this.canvas.opt.draw, nameof(() => this.canvas.opt.draw.dangers));
					visualDebuggingIndividualOptions.add(this.canvas.opt.draw, nameof(() => this.canvas.opt.draw.food));
				}
			}

			this._guiIsInitialised = true;
		}
	}
}
