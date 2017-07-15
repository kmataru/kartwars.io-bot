namespace DracoolaArt.KartwarsBot {
	export enum CarWeapon {
		None = 0,

		FastRocket = 1,
		ThreeFastRockets = 2,
		TeleRocket = 3,
		Cloak = 4,
		Mine = 5,
		ThreeMines = 6,
		BigBang = 7,
		ThreeTeleRocket = 8,
		Shield = 9,
		Flashes = 10,
		Magnet = 11,
		HugeBash = 12
	}

	export enum CarWeaponTrigger {
		NotSet,

		Self,
		Front,
		Behind,
	}

	export enum CarWeaponSpeed {
		NotSet,

		NoSpeed,
		MediumSpeed,
		HighSpeed,
	}

	export enum CollisionElementType {
		Circle,
		Polygon
	}

	export enum CollisionElementDangerType {
		NotDefined,

		Enemy,
		Misile,
		TeleMisile,
		Bomb,
		Mine,
	}

	export enum ShapesIntersectionStatus {
		NoIntersection = 1, // Outside
		Tangent = 2,
		ShapeInside = 3,

		HasIntersections = 4,
	}

	export enum AccelerationFlag {
		NotDefined,
		Yes,
		// TODO : Review
		Default
	}

	export enum IgnoreItemFlag {
		Yes = 1,
		Delete
	}

	export enum GoalState {
		Invalid = 0,
		InFront,
		InBack
	}
}
