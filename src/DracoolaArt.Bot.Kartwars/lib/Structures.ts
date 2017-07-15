namespace DracoolaArt.KartwarsBot.Structures {
	export class CarWeaponData implements ICarWeaponData {
		public weaponFired: boolean = false;

		constructor(weaponType: CarWeapon) {
			this.weaponType = weaponType;
		}

		private _previousWeaponType: CarWeapon;
		get previousWeaponType(): CarWeapon {
			return this._previousWeaponType;
		}

		private _weaponType: CarWeapon;
		get weaponType(): CarWeapon {
			return this._weaponType;
		}

		set weaponType(value: CarWeapon) {
			if (this._weaponType == value) {
				return;
			}

			if (value == CarWeapon.None) {
				this.weaponFired = false;
			}

			this._previousWeaponType = this._weaponType;
			let thisWeaponType = this._weaponType = value;

			this._magnitude = Data.weaponsMagnitudes[thisWeaponType];

			//
			// isLethalWeapon
			switch (thisWeaponType) {
				case CarWeapon.None:
				case CarWeapon.Cloak:
				case CarWeapon.Magnet: {
					this._isLethalWeapon = false;
				} break;

				default: {
					this._isLethalWeapon = true;
				} break;
			}

			//
			// triggerLocation
			switch (thisWeaponType) {
				case CarWeapon.Cloak:
				case CarWeapon.Magnet:
				case CarWeapon.Shield:
				case CarWeapon.BigBang: {
					this._triggerLocation = CarWeaponTrigger.Self;
				} break;

				case CarWeapon.FastRocket:
				case CarWeapon.ThreeFastRockets:
				case CarWeapon.TeleRocket:
				case CarWeapon.ThreeTeleRocket:
				case CarWeapon.Flashes:
				case CarWeapon.HugeBash: {
					this._triggerLocation = CarWeaponTrigger.Front;
				} break;

				case CarWeapon.Mine:
				case CarWeapon.ThreeMines: {
					this._triggerLocation = CarWeaponTrigger.Behind;
				} break;

				default: {
					this._triggerLocation = CarWeaponTrigger.NotSet;
				} break;
			}

			//
			// speed
			switch (thisWeaponType) {
				case CarWeapon.Cloak:
				case CarWeapon.Mine:
				case CarWeapon.ThreeMines:
				case CarWeapon.BigBang:
				case CarWeapon.Shield:
				case CarWeapon.Magnet: {
					this._speed = CarWeaponSpeed.NoSpeed;
				} break;

				case CarWeapon.TeleRocket:
				case CarWeapon.ThreeTeleRocket:
				case CarWeapon.HugeBash: {
					this._speed = CarWeaponSpeed.MediumSpeed;
				} break;

				case CarWeapon.FastRocket:
				case CarWeapon.ThreeFastRockets:
				case CarWeapon.Flashes: {
					this._speed = CarWeaponSpeed.HighSpeed;
				} break;

				default: {
					this._speed = CarWeaponSpeed.NotSet;
				} break;
			}
		}

		private _isLethalWeapon: boolean;
		get isLethalWeapon(): boolean {
			return this._isLethalWeapon;
		}

		private _triggerLocation: CarWeaponTrigger;
		get triggerLocation(): CarWeaponTrigger {
			return this._triggerLocation;
		}

		private _speed: CarWeaponSpeed;
		get speed(): CarWeaponSpeed {
			return this._speed;
		}

		private _magnitude: number;
		get magnitude(): number {
			return this._magnitude;
		}
	}

	export class Point2D implements IPoint2D {
		public x: number;
		public y: number;

		constructor(x?: number, y?: number) {
			if (x) {
				this.x = x;
			} else {
				this.x = 0;
			}

			if (y) {
				this.y = y;
			} else {
				this.y = 0;
			}
		}

		public lerp(that: Point2D, t: number) {
			return new Point2D(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t);
		}

		public min(that: Point2D) {
			return new Point2D(Math.min(this.x, that.x), Math.min(this.y, that.y));
		}

		public max(that: Point2D) {
			return new Point2D(Math.max(this.x, that.x), Math.max(this.y, that.y));
		}
	}

	//type Point2D = Victor;
	//const Point2D = <{ new (x: number, y: number): Point2D; }>Victor;

	// TODO : Review
	export class BotPoint2D extends Point2D {
		public ang: number = 0.0;

		constructor(x?: number, y?: number, ang?: number) {
			super(x, y);

			this.ang = ang;
		}

		public static fromPoint2D(point: Point2D): BotPoint2D {
			return new BotPoint2D(point.x, point.y);
		}
	}

	// TODO : Review
	export class Bot2Point2D extends Point2D implements IDistance, ILegacySize {
		public sz: number;
		public da: number;
		public ang: number;
		public distance: number;
		public resourceId: number;

		constructor(x: number, y: number, sz: number, da: number, ang: number, distance: number, resourceId: number) {
			super(x, y);

			this.sz = sz;
			this.da = da;
			this.ang = ang;
			this.distance = distance;
			this.resourceId = resourceId;
		}
	}

	export class CollisionElement extends Point2D implements IDistance2 {
		public ang: number;
		public dangerType: CollisionElementDangerType;
		public radius: number;
		//isHead: boolean;
		public distance2: number;

		public shapeType: CollisionElementType;
		public geometry: Victor[];

		constructor(x: number, y: number, ang: number, shapeType: CollisionElementType, dangerType: CollisionElementDangerType, radius: number, /*isHead: boolean,*/ distance?: number) {
			super(x, y);

			this.ang = ang;

			this.shapeType = shapeType;

			this.dangerType = dangerType;
			this.radius = radius;
			//this.isHead = isHead;

			if (distance) {
				this.distance2 = distance;
			} else {
				this.distance2 = Infinity;
			}
		}
	}

	export class CollisionAngle extends Point2D implements IDistance2 {
		public ang: number;
		public dangerType: CollisionElementDangerType;
		public distance2: number;
		public radius: number;
		public aIndex: number;

		constructor(x: number, y: number, ang: number, dangerType: CollisionElementDangerType, distance: number, radius: number, aIndex: number) {
			super(x, y);

			this.ang = ang;
			this.dangerType = dangerType;
			this.distance2 = distance;
			this.radius = radius;
			this.aIndex = aIndex;
		}
	}

	export class CollisionDataRespons {
		constructor(public readonly collisionElements: Array<CollisionElement>, public readonly collisionAngles: Array<CollisionAngle>) {
		}
	}

	export class FoodAngle extends Point2D implements IDistance, IScore, ILegacySize {
		public ang: number;
		public distance: number;
		public sz: number;
		public da: number;
		public score: number;
	}

	export class OpenAngle implements ILegacySize {
		public openStart: number;
		public openEnd: number;
		public sz: number;
	}

	export class Bounds implements IBounds {
		public width: number;
		public height: number;

		constructor(width: number, height: number) {
			this.width = width;
			this.height = height;
		}
	}

	export class Line implements ILine {
		public point1: Point2D;
		public point2: Point2D;

		// Constructor for vector type
		constructor(point1: Point2D, point2: Point2D) {
			this.point1 = point1;
			this.point2 = point2;
		}
	}

	export class Rect extends Bounds implements IRect {
		public x: number;
		public y: number;

		public rotation: number;

		// Constructor for rect type
		constructor(x: number, y: number, width: number, height: number, rotation?: number) {
			super(width, height);

			this.x = x;
			this.y = y;

			if (undefined != rotation) {
				this.rotation = rotation;
			} else {
				rotation = 0.0;
			}
		}
	}

	export class Polygon extends Point2D implements IPolygon {
		public geometry: Victor[];

		private _minX: number = Infinity;
		private _minY: number = Infinity;
		private _maxX: number = -Infinity;
		private _maxY: number = -Infinity;

		private _geometryAsPoint2DArray: Array<Point2D>;

		constructor(x: number, y: number, geometry: Victor[]) {
			super(x, y);

			this.geometry = geometry;

			this.processGeometry();
		}

		private processGeometry() {
			let geometry = this.geometry;

			for (let p = 1, l = geometry.length; p < l; p++) {
				if (geometry[p].x < this._minX) {
					this._minX = geometry[p].x;
				}

				if (geometry[p].x > this._maxX) {
					this._maxX = geometry[p].x;
				}

				if (geometry[p].y < this._minY) {
					this._minY = geometry[p].y;
				}

				if (geometry[p].y > this._maxY) {
					this._maxY = geometry[p].y;
				}
			}
		}

		get geometryAsPoint2DArray(): Point2D[] {
			if (!this._geometryAsPoint2DArray) {
				this._geometryAsPoint2DArray = this.geometry.map(function (element) {
					return new Point2D(element.x, element.y);
				});
			}

			return this._geometryAsPoint2DArray;
		}

		get minX() {
			return this._minX;
		}

		get minY() {
			return this._minY;
		}

		get maxX() {
			return this._maxX;
		}

		get maxY() {
			return this._maxY;
		}
	}

	export class Circle extends Point2D implements ICircle {
		public radius: number;

		// Constructor for circle type
		constructor(x: number, y: number, radius: number) {
			super(x, y);

			this.radius = radius;
		}
	}

	export class Cluster extends Circle implements ICluster {
		public distance: number;
		public elements: Array<Food> = [];

		// Constructor for circle type
		constructor(circle: Circle, data: Array<Food>) {
			super(circle.x, circle.y, circle.radius);

			if (undefined != data) {
				let $this = this;

				data.forEach(function (element) {
					element.distanceToCenterOfCluster = Utils.MathUtils.getDistance($this, element);
				});

				this.elements = data;
			}
		}

		// TODO : Review
		private static readonly radiusMultiplier: number = 1.4;

		get score(): number {
			return (Math.pow(this.distance, 2) / this.elements.length);
		}

		get highRadius(): number {
			return (this.radius * Cluster.radiusMultiplier);
		}
	}

	export class ClusterWrapper {
		private _foodClusters: Array<ICluster> = [];

		get foodClusters(): Array<ICluster> {
			return this._foodClusters;
		}

		set foodClusters(value: Array<ICluster>) {
			/*
			value.sort(function (a, b) {
				return b.score - a.score;
			});
			*/

			value.sort(function (a, b) {
				return a.distance - b.distance;
			});

			this._foodClusters = value;
		}

		public getBestCluster(): ICluster {
			return this._foodClusters[0];
		}
	}

	export class ShapesIntersectionsResult {
		public status: ShapesIntersectionStatus = ShapesIntersectionStatus.NoIntersection;
		public points: Array<BotPoint2D> = [];

		constructor(status: ShapesIntersectionStatus) {
			if (status != undefined) {
				this.status = status;
			}
		}

		get length() {
			return this.points.length;
		}

		public addPoint(point: BotPoint2D): void {
			this.points.push(point);
		}

		public addPoints(points: BotPoint2D[]): void {
			this.points = this.points.concat(points);
		}
	}

	export class ActivityResult implements IActivityResult {
		private _isValid: boolean;

		private _goalCoordinates: Point2D;
		private _acceleration: AccelerationFlag;
		private _speed: number;

		private _customData: any;

		protected constructor(isValid: boolean, goalCoordinates?: Point2D, customData: any = null, accelerate: AccelerationFlag = AccelerationFlag.NotDefined, speed?: number) {
			this._isValid = isValid;
			this._goalCoordinates = goalCoordinates;
			this._acceleration = accelerate;
			this._speed = speed;

			this._customData = customData;
		}

		public static CreateValidResponse(goalCoordinates: Point2D, accelerate: AccelerationFlag = AccelerationFlag.NotDefined, speed?: number): IActivityResult {
			return new ActivityResult(true, goalCoordinates, undefined, accelerate, speed);
		}

		public static CreateInvalidResponse(): IActivityResult {
			return new ActivityResult(false);
		}

		public static CreateCustomResponse(customData: any): IActivityResult {
			return new ActivityResult(true, undefined, customData);
		}

		public static Transfer(
			activityResult: IActivityResult,
			goalCoordinates?: Point2D, customData?: any, accelerate?: AccelerationFlag, speed?: number
		): IActivityResult {
			let newActivityResult = new ActivityResult(
				(activityResult as ActivityResult)._isValid,
				(activityResult as ActivityResult)._goalCoordinates,
				(activityResult as ActivityResult)._customData,
				(activityResult as ActivityResult)._acceleration,
				(activityResult as ActivityResult)._speed
			);

			//newActivityResult._isValid = isValid;
			if (goalCoordinates != null) {
				newActivityResult._goalCoordinates = goalCoordinates;
			}

			if (accelerate != null) {
				newActivityResult._acceleration = accelerate;
			}

			if (speed != null) {
				newActivityResult._speed = speed;
			}

			if (customData != null) {
				newActivityResult._customData = customData;
			}

			return newActivityResult;
		}

		get isValid(): boolean {
			return this._isValid;
		}

		get goalCoordinates(): Point2D {
			return this._goalCoordinates;
		}

		get acceleration(): AccelerationFlag {
			return this._acceleration;
		}

		// TODO : Maybe calculate speed here inside, based on player's position and goalCoordinates.
		get speed(): number {
			return this._speed;
		}

		get customData(): any {
			return this._customData;
		}
	}

	export class GoalData {
		private _isValid: boolean = false;
		private _isInTunnel: boolean = false;
		private _state: GoalState = GoalState.Invalid;

		public coordinates: Point2D = new Point2D();

		//
		// `isInTunnel` property
		public get isInTunnel(): boolean {
			return this._isInTunnel;
		}

		public set isInTunnel(value: boolean) {
			this._isValid = false;
			this._isInTunnel = value;
		}
		// !`isInTunnel` property
		//

		//
		// `state` property
		public get state(): GoalState {
			if (this._isValid) {
				return this._state;
			}

			return GoalState.Invalid;
		}

		public set state(value: GoalState) {
			this._state = value;
			this._isValid = true;
		}
		// !`state` property
		//
	}

	export class Score {
		constructor(public readonly playTime: string,
			public readonly top3Time: string,
			public readonly hexagons: number,
			public readonly kills: number,
			public readonly score: number,
			public readonly maxStreak: number) {
		}
	}
}