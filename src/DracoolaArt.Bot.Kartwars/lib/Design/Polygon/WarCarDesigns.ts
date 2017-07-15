namespace DracoolaArt.KartwarsBot.Design.Polygon {
	// Default (!!To be kept for reference!!)
	let defaultCarCollisionDesign: Victor[] = [
		new Victor(-0.5, 5.5),
		new Victor(-1, 3.5),
		new Victor(-1, 2),
		new Victor(-1.5, 1.5),
		new Victor(-3, 1),
		new Victor(-3, -1.25),
		new Victor(-1, -1),
		new Victor(-1.25, -2.25),

		new Victor(0, -1.75),

		new Victor(1.25, -2.25),
		new Victor(1, -1),
		new Victor(3, -1.25),
		new Victor(3, 1),
		new Victor(1.5, 1.5),
		new Victor(1, 2),
		new Victor(1, 3.5),
		new Victor(0.5, 5.5),
	];

	// Fast Rocket
	let fastRocketCarCollisionDesign: Victor[] = [
		new Victor(-0.25, 5.5),
		new Victor(-0.75, 3.75),
		new Victor(-0.75, 3),
		new Victor(-0.75, 2),
		new Victor(-1, 1.5),
		new Victor(-1.25, 0.75),
		new Victor(-1, 0),
		new Victor(-0.75, -0.75),

		new Victor(0, -1),

		new Victor(0.75, -0.75),
		new Victor(1, 0),
		new Victor(1.25, 0.75),
		new Victor(1, 1.5),
		new Victor(0.75, 2),
		new Victor(0.75, 3),
		new Victor(0.75, 3.75),
		new Victor(0.25, 5.5),
	];

	// Tele Rocket
	let teleRocketCarCollisionDesign: Victor[] = defaultCarCollisionDesign;

	// Mine
	let mineCarCollisionDesign: Victor[] = [
		new Victor(-0.25, 0.75),
		new Victor(-0.25, 0.5),
		new Victor(-0.5, 0.25),
		new Victor(-1, 0),
		new Victor(-1.25, -0.75),
		new Victor(-1, -1),
		new Victor(-1.25, -1.75),
		new Victor(-0.5, -2),

		new Victor(0, -2.25),

		new Victor(0.5, -2),
		new Victor(1.25, -1.75),
		new Victor(1, -1),
		new Victor(1.25, -0.75),
		new Victor(1, 0),
		new Victor(0.5, 0.25),
		new Victor(0.25, 0.5),
		new Victor(0.25, 0.75),
	];

	// Big Bang
	let bigBangCarCollisionDesign: Victor[] = defaultCarCollisionDesign;

	// Shield
	let shieldCarCollisionDesign: Victor[] = defaultCarCollisionDesign;

	// Flash
	let flashCarCollisionDesign: Victor[] = [
		new Victor(-0.25, 8),
		new Victor(-0.5, 5),
		new Victor(-0.75, 3),
		new Victor(-0.75, 2),
		new Victor(-1, 1.5),
		new Victor(-1.25, 0.75),
		new Victor(-1, 0),
		new Victor(-0.75, -0.75),

		new Victor(0, -1),

		new Victor(0.75, -0.75),
		new Victor(1, 0),
		new Victor(1.25, 0.75),
		new Victor(1, 1.5),
		new Victor(0.75, 2),
		new Victor(0.75, 3),
		new Victor(0.5, 5),
		new Victor(0.25, 8),
	];

	// Huge Bash
	let hugeBashCarCollisionDesign: Victor[] = [
		new Victor(-0.25, 4),
		new Victor(-0.5, 3.5),
		new Victor(-1.5, 3.25),
		new Victor(-2, 3),
		new Victor(-2, 2),
		new Victor(-1.25, 0.75),
		new Victor(-1, 0),
		new Victor(-0.75, -0.75),

		new Victor(0, -1),

		new Victor(0.75, -0.75),
		new Victor(1, 0),
		new Victor(1.25, 0.75),
		new Victor(2, 2),
		new Victor(2, 3),
		new Victor(1.5, 3.25),
		new Victor(0.5, 3.5),
		new Victor(0.25, 4),
	];

	//
	//
	rotateSelf(defaultCarCollisionDesign);
	rotateSelf(fastRocketCarCollisionDesign);
	rotateSelf(mineCarCollisionDesign);
	rotateSelf(flashCarCollisionDesign);
	rotateSelf(hugeBashCarCollisionDesign);
	//
	//

	let designsDictionary: IDictionary<Victor[]> = {};

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

	function rotateSelf(thisDesign: Victor[]) {
		let rotation = -Math.PI / 2;

		for (let idx = 0; idx < thisDesign.length; idx++) {
			thisDesign[idx].rotate(rotation);
		}
	}

	export class WarCarDesigns implements IDesignPolygon {
		public static readonly Singleton: WarCarDesigns = new WarCarDesigns();

		public static getDesign(weaponType: CarWeapon) {
			return designsDictionary[weaponType];
		}

		public getDesign(weaponType: CarWeapon): Victor[] {
			return WarCarDesigns.getDesign(weaponType);
		}
	}
}
