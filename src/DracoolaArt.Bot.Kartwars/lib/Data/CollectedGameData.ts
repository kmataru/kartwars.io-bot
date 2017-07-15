namespace DracoolaArt.KartwarsBot.Data {
	export const playerTurnRadius = 350 / 2;

	export const weaponsMagnitudes: IDictionary<CarWeapon> = {};

	weaponsMagnitudes[CarWeapon.None] =
		weaponsMagnitudes[CarWeapon.Cloak] =
		weaponsMagnitudes[CarWeapon.Mine] =
		weaponsMagnitudes[CarWeapon.ThreeMines] =
		weaponsMagnitudes[CarWeapon.BigBang] =
		weaponsMagnitudes[CarWeapon.Shield] =
		weaponsMagnitudes[CarWeapon.Magnet] = 0;

	weaponsMagnitudes[CarWeapon.FastRocket] = weaponsMagnitudes[CarWeapon.ThreeFastRockets] = 20; // TODO : Verify data
	weaponsMagnitudes[CarWeapon.TeleRocket] = weaponsMagnitudes[CarWeapon.ThreeTeleRocket] = 15; // TODO : Verify data
	weaponsMagnitudes[CarWeapon.Flashes] = 40; // TODO : Verify data
	weaponsMagnitudes[CarWeapon.HugeBash] = 12; // TODO : Verify data
}
