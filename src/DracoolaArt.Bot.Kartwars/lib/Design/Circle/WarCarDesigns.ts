namespace DracoolaArt.KartwarsBot.Design.Circle {
	// Default (!!To be kept for reference!!)
	let defaultCarCollisionDesign: number[][] = [
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
	];

	// Fast Rocket
	let fastRocketCarCollisionDesign: number[][] = [
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 2, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
	];

	// Tele Rocket
	let teleRocketCarCollisionDesign: number[][] = [
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 2, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
	];

	// Mine
	let mineCarCollisionDesign: number[][] = [
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 2, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
	];

	// Big Bang
	let bigBangCarCollisionDesign: number[][] = [
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 3, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
	];

	// Shield
	let shieldCarCollisionDesign: number[][] = [
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 2, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
	];

	// Flash
	let flashCarCollisionDesign: number[][] = [
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 2, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
	];

	// Huge Bash
	let hugeBashCarCollisionDesign: number[][] = [
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 2, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
	];

	let designsDictionary: IDictionary<number[][]> = {};

	designsDictionary[CarWeapon.None] = null;
	designsDictionary[CarWeapon.FastRocket] = fastRocketCarCollisionDesign;
	designsDictionary[CarWeapon.ThreeFastRockets] = fastRocketCarCollisionDesign;
	designsDictionary[CarWeapon.TeleRocket] = teleRocketCarCollisionDesign;
	designsDictionary[CarWeapon.Cloak] = null;
	designsDictionary[CarWeapon.Mine] = mineCarCollisionDesign;
	designsDictionary[CarWeapon.ThreeMines] = mineCarCollisionDesign;
	designsDictionary[CarWeapon.BigBang] = bigBangCarCollisionDesign;
	designsDictionary[CarWeapon.ThreeTeleRocket] = teleRocketCarCollisionDesign;
	designsDictionary[CarWeapon.Shield] = shieldCarCollisionDesign;
	designsDictionary[CarWeapon.Flashes] = flashCarCollisionDesign;
	designsDictionary[CarWeapon.Magnet] = null;
	designsDictionary[CarWeapon.HugeBash] = hugeBashCarCollisionDesign;

	//

	export class WarCarDesigns implements IDesignCircle {
		public static readonly Singleton: WarCarDesigns = new WarCarDesigns();

		public static readonly DesignDetails: IDesignDetails = {
			widthCenter: (defaultCarCollisionDesign[0].length - 1) / 2,
			heightCenter: (defaultCarCollisionDesign.length - 1) / 2
		};

		public static getDesign(weaponType: CarWeapon) {
			return designsDictionary[weaponType];
		}

		public get DesignDetails() {
			return WarCarDesigns.DesignDetails;
		}

		public getDesign(weaponType: CarWeapon): number[][] {
			return WarCarDesigns.getDesign(weaponType);
		}
	}
}
