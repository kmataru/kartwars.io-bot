namespace DracoolaArt.KartwarsBot.Strategy {
	/**
	 * Default working strategy.
	 */
	export class DefaultStrategy extends StrategyBase {
		// TODO : Comments
		private FOOD_VALUE: number = 1;
		private WEAPON_VALUE: number = 5;

		public aggressivity: number = 65;

		public _collectedWeapons: number = 0;
		public get collectedWeapons(): number {
			return this._collectedWeapons;
		}

		private lastWeaponStatus: CarWeapon = CarWeapon.None;

		/**
		 * On Player Death's event.
		 */
		public onPlayerDeath() {
			this._collectedWeapons = 0;
		}

		public action(): IActivityResult {
			let finalActivityResult: IActivityResult;

			window.botFactory.clock.startFrame();

			// Show Rage message when Shield is activated
			window.botFactory.userInterface.setRageVisible(window.mainCar.isShieldActivated);

			// Decides whether to run for food or weapons
			let resourcePriority: Tactics.Resource.ResourcePriority = this.resourcePriority();

			this.fightCheck();

			let collisionManagerActivityResult: IActivityResult;
			let computeCollisions = true;

			// Disable collision computations when shield is active
			if (window.mainCar.isShieldActivated) {
				let elepsedTime = +(new Date()) - (+window.mainCar.shieldActivationTime);

				// Shield lasts for 10 seconds, but this will give time to evade any danger before it expires
				if (elepsedTime < 7500) {
					computeCollisions = false;
				}
			}

			if (computeCollisions) {
				collisionManagerActivityResult = this.bot.CollisionManager.action();
			}

			if (collisionManagerActivityResult && collisionManagerActivityResult.isValid) {
				finalActivityResult = collisionManagerActivityResult;
			} else {
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
					finalActivityResult = this.resourceAction(resourcePriority);
				}
			}

			window.botFactory.clock.endFrame();

			return finalActivityResult;
		}

		/**
		 * Decides whether to run for food or weapons.
		 */
		protected resourcePriority(): Tactics.Resource.ResourcePriority {
			let currentWeaponType: CarWeapon;

			if (window.mainCar.weapon && (currentWeaponType = window.mainCar.weapon.weaponType) != CarWeapon.None) {
				if (currentWeaponType != this.lastWeaponStatus) {
					this._collectedWeapons++;

					this.lastWeaponStatus = currentWeaponType;
				}
			} else {
				this.lastWeaponStatus = CarWeapon.None;
			}

			//
			//

			let aggressivity = this.aggressivity;
			let weaponA = Math.ceil(aggressivity / this.WEAPON_VALUE);
			let foodA = 100 - aggressivity;

			let ratio = Math.ceil(foodA / weaponA);

			//
			//

			// We don't ever care for food loss.
			let collectedFood = window.myCoins;

			let weaponsGoal = Math.floor(collectedFood / ratio);

			if (weaponsGoal > this._collectedWeapons) {
				return Tactics.Resource.ResourcePriority.Weapon;
			}

			return Tactics.Resource.ResourcePriority.Food;
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
							let triggerWeaponInFront = window.mainCar.weapon.triggerLocation == CarWeaponTrigger.Front;
							let triggerWeaponBehind = window.mainCar.weapon.triggerLocation == CarWeaponTrigger.Behind;

							if (triggerWeaponInFront) {
								// window.log((+new Date()), `magnitude = ${window.mainCar.weapon.magnitude}`);

								if (window.mainCar.weapon.magnitude > 0) {
									this._forceChasingPrediction = true;

									if (this.bot.stage == BotStageEnum.InterceptEnemy) {
										if (this.bot.goal.state == GoalState.InFront) {
											if (!window.mainCar.weapon.weaponFired) {
												// window.log((+new Date()), `GoalIsInTunnel! WeaponType = ${CarWeapon[window.mainCar.weapon.weaponType]}`);

												doFightTactics = true;
											}
										}
									}
								} else {
									doFightTactics = true;
								}
							} else if (triggerWeaponBehind) {
								this._forceChasingPrediction = true;

								if (this.bot.stage == BotStageEnum.InterceptEnemy) {
									if (this.bot.goal.state == GoalState.InBack) {
										if (!window.mainCar.weapon.weaponFired) {
											// window.log((+new Date()), `GoalIsInTunnel! WeaponType = ${CarWeapon[window.mainCar.weapon.weaponType]}`);

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

						if (doFightTactics) {
							this.FightTactics.action();
						}
					}
				}
			}

			window.botFactory.clock.endFrame();
		}

		/**
		 * Based on Resource Priority seek food or weapons.
		 * @param resourcePriority
		 */
		protected resourceAction(resourcePriority: Tactics.Resource.ResourcePriority): IActivityResult {
			let resourceActivityResult: IActivityResult = null;

			let defaultBehaviour: Behaviour.BehaviourData = Behaviour.BehaviourData.defaultBehaviour;

			if (defaultBehaviour.Weapon == Behaviour.WeaponBehaviour.DoNotSeekWeapons) {
				return this.foodAction();
			}

			if (resourcePriority == Tactics.Resource.ResourcePriority.Food) {
				resourceActivityResult = this.foodAction();
			} else {
				resourceActivityResult = this.weaponAction();
			}

			return resourceActivityResult;
		}

		/**
		 * Weapon action.
		 */
		protected weaponAction(): IActivityResult {
			return this.WeaponTactics.action();
		}

		/**
		 * Food action.
		 */
		protected foodAction(): IActivityResult {
			let foodTacticsActivityResult: IActivityResult = null;

			window.botFactory.clock.startFrame();

			let defaultBehaviour: Behaviour.BehaviourData = Behaviour.BehaviourData.defaultBehaviour;

			if (this.gameWrapper.util.isPlaying) {
				switch (defaultBehaviour.Food) {
					case Behaviour.FoodBehaviour.DoNotSeekFood: {
						// NOOP
						this.FoodTactics.noop();
						foodTacticsActivityResult = Structures.ActivityResult.CreateInvalidResponse();
					} break;

					case Behaviour.FoodBehaviour.SeekFood: {
						foodTacticsActivityResult = this.FoodTactics.action();
					} break;

					/*
					case Behaviour.FoodBehaviour.SeekFoodCluster: {
						// TODO : Not Implemented
						this.FoodTactics.noop();
					} break;
					*/

					case Behaviour.FoodBehaviour.SeekFoodInsideFoodCluster: {
						//
						// Experimental
						let activityResult: IActivityResult = this.FindClosestClusterFoodTactics.action();
						let foodClusterWrapper = (activityResult.customData as Structures.ClusterWrapper);
						let cluster = foodClusterWrapper.getBestCluster();

						if ((cluster != undefined) && (cluster.distance < cluster.highRadius)) {
							this.canvas.drawCircle(cluster, 'white', true, 0.15);

							//TraceRegister.originalNames['FindClosestCluster'] = `${cluster.distance} with ${cluster.elements.length}`;

							foodTacticsActivityResult = this.FoodTactics.action(cluster.elements);
						} else {
							/*
							if (cluster != undefined) {
								TraceRegister.originalNames['FindClosestCluster'] = `${cluster.distance}`;
							} else {
								TraceRegister.originalNames['FindClosestCluster'] = 'none';
							}
							*/

							foodTacticsActivityResult = this.FoodTactics.action();
						}
						//
						//
					} break;

					default: {
						foodTacticsActivityResult = Structures.ActivityResult.CreateInvalidResponse();
					} break;
				}
			}

			window.botFactory.clock.endFrame();

			return foodTacticsActivityResult;
		}

		protected initDatGui(datGUIWrapper: Utils.Interface.DatGUI): void {
			if (this._guiIsInitialised) {
				return;
			}

			let gui = datGUIWrapper.gui;

			let smallestRadianDivisions = 32;

			let defaultBehaviour: Behaviour.BehaviourData = Behaviour.BehaviourData.defaultBehaviour;

			{
				let botOptions = gui.addFolder('Bot Options');
				this._guiElements.push(botOptions.domElement);
				//botOptions.open();

				gui.remember(this.bot);
				gui.remember(this.bot.opt);
				gui.remember(this.bot.opt.radiusEnchancer);
				gui.remember(this.bot.opt.wall);

				//botOptions.add(this.bot.opt, 'targetFps', 10, 60).step(5);
				botOptions.add(this.bot.opt, nameof(() => this.bot.opt.arcSize), Math.PI / smallestRadianDivisions, Math.PI * 2).step(Math.PI / smallestRadianDivisions).listen();

				{
					let radiusOptions = botOptions.addFolder('Radius');
					radiusOptions.open();

					radiusOptions.add(this.bot.opt, nameof(() => this.bot.opt.playerRadiusMultiplier), 1, 50).step(0.5).name('Player');
					radiusOptions.add(this.bot.opt, nameof(() => this.bot.opt.playerResourceGatherRadiusMultiplier), 1, 50).step(0.5).name('Resource Gather');

					radiusOptions.add(this.bot.opt, nameof(() => this.bot.opt.radiusFrontDetectorMultiplier), 0.1, 50).step(0.1).name('Front Detector');
					radiusOptions.add(this.bot.opt, nameof(() => this.bot.opt.radiusBehindDetectorMultiplier), 0.1, 50).step(0.1).name('Behind Detector');
					radiusOptions.add(this.bot.opt, nameof(() => this.bot.opt.radiusSideDetectorsMultiplier), 1, 10).step(0.1).name('Side Detectors');
					radiusOptions.add(this.bot.opt, nameof(() => this.bot.opt.radiusDangerMultiplier), 0.1, 50).step(0.1).name('Danger');

					radiusOptions.add(this.bot.opt, nameof(() => this.bot.opt.closeToImminentDangerRange), 5, 1500).step(5).name('Close To Imminent Danger');

					{
						// TODO : WIP
						let radiusIndividualOptions = radiusOptions.addFolder('Individual');
					}
				}

				{
					let anglesOptions = botOptions.addFolder('Angles');
					anglesOptions.open();

					anglesOptions.add(this.bot.opt, nameof(() => this.bot.opt.frontResourceGatherAngle), Math.PI / smallestRadianDivisions, Math.PI * 2).step(Math.PI / smallestRadianDivisions).name('Front Resource Gather');
					anglesOptions.add(this.bot.opt, nameof(() => this.bot.opt.frontDangerAngle), Math.PI / smallestRadianDivisions, Math.PI * 2).step(Math.PI / smallestRadianDivisions).name('Front Danger');
					anglesOptions.add(this.bot.opt, nameof(() => this.bot.opt.tailDangerAngle), Math.PI / smallestRadianDivisions, Math.PI * 2).step(Math.PI / smallestRadianDivisions).name('Tail Danger');
				}

				{
					let collisionManagerOptions = botOptions.addFolder('Collision Manager');
					collisionManagerOptions.open();

					collisionManagerOptions.add(this.bot.CollisionManager.opt, nameof(() => this.bot.CollisionManager.opt.avoidanceAngle), -Math.PI, Math.PI).step(Math.PI / smallestRadianDivisions).name('Avoidance Angle');
					collisionManagerOptions.add(this.bot.CollisionManager.opt, nameof(() => this.bot.CollisionManager.opt.tailedDetectorAdditionalAvoidanceAngle), 0, Math.PI).step(Math.PI / smallestRadianDivisions).name('Tailed Avoidance Angle+');
					collisionManagerOptions.add(this.bot.CollisionManager.opt, nameof(() => this.bot.CollisionManager.opt.tailedDetectorThresholdAngle), Math.PI / smallestRadianDivisions, Math.PI).step(Math.PI / smallestRadianDivisions).name('Tailed Threshold Detector Angle');
					collisionManagerOptions.add(this.bot.opt, nameof(() => this.bot.opt.enCircleThreshold), 0.05, 1).step(0.0005).name('Encircle Threshold');
					collisionManagerOptions.add(this.bot.opt, nameof(() => this.bot.opt.enCircleAllThreshold), 0.05, 1).step(0.0005).name('Encircle All Threshold');
					collisionManagerOptions.add(this.bot.opt, nameof(() => this.bot.opt.enCircleDistanceMult), 1, 50).step(0.5).name('Encircle Distance Multiplier');
				}

				{
					let wallOffsetOptions = botOptions.addFolder('Offsets');
					wallOffsetOptions.open();

					wallOffsetOptions.add(this.bot.opt.wall, nameof(() => this.bot.opt.wall.offsetLeftX), -1000, 1000).step(5).name('Left X');
					wallOffsetOptions.add(this.bot.opt.wall, nameof(() => this.bot.opt.wall.offsetRightX), -1000, 1000).step(5).name('Right X');
					wallOffsetOptions.add(this.bot.opt.wall, nameof(() => this.bot.opt.wall.offsetTopY), -1000, 1000).step(5).name('Top Y');
					wallOffsetOptions.add(this.bot.opt.wall, nameof(() => this.bot.opt.wall.offsetBottomY), -1000, 1000).step(5).name('Bottom Y');
				}

				botOptions.add(this.bot.opt, nameof(() => this.bot.opt.tunnelSideDistance), 10, 250).step(1).name('Tunnel Side Distance');

				botOptions.add(this.bot, nameof(() => this.bot.speedMult), 0.1, 10).step(0.1);

				botOptions.add(this.bot.opt.radiusEnchancer, nameof(() => this.bot.opt.radiusEnchancer.misiles), 50, 1500).step(25);
				botOptions.add(this.bot.opt.radiusEnchancer, nameof(() => this.bot.opt.radiusEnchancer.teleMisiles), 50, 1500).step(25);
				botOptions.add(this.bot.opt.radiusEnchancer, nameof(() => this.bot.opt.radiusEnchancer.bombs), 50, 1500).step(25);
				botOptions.add(this.bot.opt.radiusEnchancer, nameof(() => this.bot.opt.radiusEnchancer.mines), 50, 1500).step(25);
			}

			{
				let foodActionsOptions = gui.addFolder('Tactics');
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
				let behaviourOptions = gui.addFolder('Behaviour');
				this._guiElements.push(behaviourOptions.domElement);
				behaviourOptions.open();

				gui.remember(this);
				gui.remember(defaultBehaviour);

				/* tslint:disable:object-literal-sort-keys */
				let foodBehaviourConstrains = {
					'Do Not Seek Food': Behaviour.FoodBehaviour.DoNotSeekFood,
					'Seek Food': Behaviour.FoodBehaviour.SeekFood,
					//'Seek Food Cluster': Behaviour.FoodBehaviour.SeekFoodCluster,
					'Seek Food Inside Food Cluster': Behaviour.FoodBehaviour.SeekFoodInsideFoodCluster,
				};

				let weaponBehaviourConstrains = {
					'Do Not Seek Weapons': Behaviour.WeaponBehaviour.DoNotSeekWeapons,
					'Seek Weapons Based On Aggressivity': Behaviour.WeaponBehaviour.SeekWeaponsBasedOnAggressivity,
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
				/* tslint:enable:object-literal-sort-keys */

				behaviourOptions.add(defaultBehaviour, nameof(() => defaultBehaviour.Food), foodBehaviourConstrains);
				behaviourOptions.add(defaultBehaviour, nameof(() => defaultBehaviour.Weapon), weaponBehaviourConstrains);
				behaviourOptions.add(defaultBehaviour, nameof(() => defaultBehaviour.Fight), fightBehaviourConstrains);
				behaviourOptions.add(defaultBehaviour, nameof(() => defaultBehaviour.Avoidance), avoidanceBehaviourConstrains);

				behaviourOptions.add(this, nameof(() => this.useChasingPrediction)).name('Use Chasing Prediction');
			}

			{
				let findClosestClusterFoodTacticsOptions = gui.addFolder('Closest Cluster Food Tactics');
				this._guiElements.push(findClosestClusterFoodTacticsOptions.domElement);
				findClosestClusterFoodTacticsOptions.open();

				gui.remember(this.FindClosestClusterFoodTactics.opt);

				findClosestClusterFoodTacticsOptions.add(this.FindClosestClusterFoodTactics.opt, nameof(() => this.FindClosestClusterFoodTactics.opt.scanRadius), 100, 10000).step(50);
				findClosestClusterFoodTacticsOptions.add(this.FindClosestClusterFoodTactics.opt, nameof(() => this.FindClosestClusterFoodTactics.opt.sectorSize), 10, 1000).step(5);
				findClosestClusterFoodTacticsOptions.add(this.FindClosestClusterFoodTactics.opt, nameof(() => this.FindClosestClusterFoodTactics.opt.minimumElementsPerCluster), 1, 350).step(1);
			}

			{
				let fizzyTextOptions = gui.addFolder('Fizzy Text');
				this._guiElements.push(fizzyTextOptions.domElement);

				let fizzyText = datGUIWrapper.userInterface.fizzyText;

				gui.remember(fizzyText);

				fizzyTextOptions.add(fizzyText, nameof(() => fizzyText.theme)).name('Dark Theme');

				fizzyTextOptions.add(fizzyText, nameof(() => fizzyText.message)).name('Message');
				fizzyTextOptions.add(fizzyText, nameof(() => fizzyText.speed), -5, 5).name('Speed');
				fizzyTextOptions.add(fizzyText, nameof(() => fizzyText.displayOutline)).name('Display Outline');

				fizzyTextOptions.add(fizzyText, nameof(() => fizzyText.noiseStrength)).step(5).name('Noise Strength');
				fizzyTextOptions.add(fizzyText, nameof(() => fizzyText.growthSpeed), -5, 5).name('Growth Speed');
				fizzyTextOptions.add(fizzyText, nameof(() => fizzyText.maxSize)).min(0).step(0.25).name('maxSize');

				fizzyTextOptions.add(fizzyText, nameof(() => fizzyText.color0)).name('Color 1');
				fizzyTextOptions.add(fizzyText, nameof(() => fizzyText.color1)).name('Color 2');
				fizzyTextOptions.add(fizzyText, nameof(() => fizzyText.color2)).name('Color 3');
				fizzyTextOptions.add(fizzyText, nameof(() => fizzyText.color3)).name('Color 4');

				fizzyTextOptions.add(fizzyText, nameof(() => fizzyText.explode)).name('Explode');
			}

			this._guiIsInitialised = true;
		}
	}
}
