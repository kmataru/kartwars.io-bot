namespace DracoolaArt.KartwarsBot {
	export enum WebSocketDataTypeEnum {
		WeaponStatus = 31,
		SelfItemStatus = 7,
		AddItem = 11,
	}

	export enum WebSocketSelfItemActivatedDataTypeEnum {
		Shield = 28
	}

	export enum WebSocketAddItemActivatedDataTypeEnum {
		Missile = 13,
		TeleMissile = 14
	}

	export class WebSocketInterfaceOptions {
		public maxDistanceForDetectingSelfDeployedWeapons: number = 200;
	}

	/**
	 * Web Socket `Man-In-The-Middle` Attacker.
	 */
	export class WebSocketInterface implements IWebSocketInterface {
		private original_WebSocketOnMessage: Function;

		public opt: WebSocketInterfaceOptions;

		constructor() {
			this.opt = new WebSocketInterfaceOptions();
		}

		public onGameReadyDelegate() {
			this.original_WebSocketOnMessage = window.ws.onmessage;
			window.ws.onmessage = this.onMessage;
		}

		@MethodDecoration.bound
		private onMessage(e: MessageEvent) {
			window.botFactory.clock.startFrame('async');

			let myID = window.mainCar.id;

			function processCarWeapon(carId: number, weaponIndex: number) {
				let thisCar = (window.sprites[carId] as Car);

				if (void 0 != thisCar) {
					if (thisCar.weapon == undefined) {
						thisCar.weapon = new Structures.CarWeaponData(weaponIndex);
					}

					//thisCar.weapon = weaponIndex;
					thisCar.weapon.weaponType = weaponIndex;
				}

				/*
				if (void 0 != window.sprites[myID]) {
					if (carId == myID) {
						if (0 == weaponIndex) {
							window.log('WS: No item');
						}
						else {
							switch (weaponIndex) {
								case CarWeapon.FastRocket:
									window.log('WS: Fast Rocket');
									break;
								case CarWeapon.ThreeFastRockets:
									window.log('WS: 3 x Fast Rockets');
									break;
								case CarWeapon.TeleRocket:
									window.log('WS: Tele Rocket');
									break;
								case CarWeapon.Cloak:
									window.log('WS: Cloak');
									break;
								case CarWeapon.Mine:
									window.log('WS: Mine');
									break;
								case CarWeapon.ThreeMines:
									window.log('WS: 3 x Mines');
									break;
								case CarWeapon.BigBang:
									window.log('WS: Big Bang');
									break;
								case CarWeapon.ThreeTeleRocket:
									window.log('WS: 3 x Tele Rocket');
									break;
								case CarWeapon.Shield:
									window.log('WS: Shield');
									break;
								case CarWeapon.Flashes:
									window.log('WS: Flashes');
									break;
								case CarWeapon.Magnet:
									window.log('WS: Magnet');
									break;
								case CarWeapon.HugeShield:
									window.log('WS: Huge Shield');
									break;
							}
						}
					}
					else {
					}
				}
				*/
			}

			function processCarShield(carId: number, specialCase: number, activationKey: number) {
				let thisCar = (window.sprites[carId] as Car);

				if (0 != activationKey && 'undefined' != typeof thisCar) {
					switch (specialCase) {
						case WebSocketSelfItemActivatedDataTypeEnum.Shield: {
							let active = (1 == activationKey);
							thisCar.isShieldActivated = active;
							thisCar.shieldActivationTime = active ? new Date() : null;
						} break;
					}
				}
			}

			function wsUnknownProcess1(carId: number, i: any, t: any, a: any, weaponIndex: number) {
				window.sprites[carId] instanceof Car && null != weaponIndex && processCarWeapon(carId, weaponIndex);
			}

			let data = new Int16Array(e.data);
			switch (data[0]) {
				case WebSocketDataTypeEnum.WeaponStatus: {
					// window.log('Got [31] data', data);

					for (let f = data[1], b = 2, u = 0; f > u; u++) {
						wsUnknownProcess1(data[b], data[b + 1], data[b + 2], data[b + 3], data[b + 4]),
							b += 5;
					}
				} break;

				case WebSocketDataTypeEnum.SelfItemStatus: {
					for (let b = 1; b + 4 < data.length;) {
						let p = data[b++];
						b++;
						processCarShield(p, WebSocketSelfItemActivatedDataTypeEnum.Shield, data[b++]);
						b++;
						b++;
					}
				} break;

				case WebSocketDataTypeEnum.AddItem: {
					for (let b = 1; b + 3 < data.length;) {
						let itemId = data[b++]
							, addItemSpecialCase = data[b++]
							, itemPositionX = data[b++]
							, itemPositionY = data[b++]
							, K = data[b++]
							, D = data[b++];

						// 11 == S ? esto.addItem(P, M, K, p, D, 0)
						// 13 == S ? esto.addMisil(P, M, K, p, D)
						// 14 == S ? esto.addMisilTele(P, M, K, p)
						// 15 == S ? esto.addMina(P, M, K, p)
						// 16 == S ? esto.addBomba(P, M, K, p, 0)

						// TODO : Review
						let bot = (window.botFactory.bot as Bot);
						let gameWrapper = (window.botFactory.gameWrapper as GameWrapper);

						if (!bot.shapesHolster || !bot.shapesHolster.tunnelLeftSideLine || !bot.shapesHolster.tunnelRightSideLine) {
							return;
						}

						let deployedWeaponCoordinates = new Structures.Point2D(itemPositionX, itemPositionY);
						let kartPosition = new Structures.Point2D(window.mainCar.img.position.x, window.mainCar.img.position.y);
						let distance = Utils.MathUtils.getDistance(kartPosition, deployedWeaponCoordinates);

						if (distance <= this.opt.maxDistanceForDetectingSelfDeployedWeapons /*&& window.mainCar.weapon.weaponType != CarWeapon.None*/) {
							let isDeployedWeaponInTunnel =
								Utils.MathUtils.isLeft(bot.shapesHolster.tunnelLeftSideLine.point1, bot.shapesHolster.tunnelLeftSideLine.point2, deployedWeaponCoordinates) &&
								Utils.MathUtils.isRight(bot.shapesHolster.tunnelRightSideLine.point1, bot.shapesHolster.tunnelRightSideLine.point2, deployedWeaponCoordinates);

							if (isDeployedWeaponInTunnel) {
								switch (addItemSpecialCase) {
									case WebSocketAddItemActivatedDataTypeEnum.Missile: {
										gameWrapper.items.ignoreMissilesById(itemId);
										// window.log('Add Misil: ', itemId, itemPositionX, itemPositionY, K, D, distance, `previousWeaponType = ${CarWeapon[window.mainCar.weapon.previousWeaponType]}`, `weaponType = ${CarWeapon[window.mainCar.weapon.weaponType]}`);
									} break;

									case WebSocketAddItemActivatedDataTypeEnum.TeleMissile: {
										gameWrapper.items.ignoreMissilesById(itemId);
										// window.log('Add MisilTele: ', p, P, M, K, D, distance, `previousWeaponType = ${CarWeapon[window.mainCar.weapon.previousWeaponType]}`, `weaponType = ${CarWeapon[window.mainCar.weapon.weaponType]}`); //, `x=${window.mainCar.img.position.x}; y=${window.mainCar.img.position.y}`);
									} break;
								}
							}
						}
					}
				} break;
			}

			window.botFactory.clock.endFrame('async');

			this.original_WebSocketOnMessage(e);
		}
	}
}
