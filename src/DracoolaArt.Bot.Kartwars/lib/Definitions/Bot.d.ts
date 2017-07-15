/// <reference path="../_references.ts" />

declare namespace DracoolaArt.KartwarsBot {
	export enum CarWeapon { }
	export enum CarWeaponTrigger { }
	export enum CarWeaponSpeed { }

	export interface IGameWrapper {
	}

	export interface ICanvasUtils {
	}

	export interface IContextMenu {
	}

	export interface IUserInterface {
		setRageVisible(visible: boolean): void;
	}

	export interface IBot {
	}

	export interface IDeveloperInterface {
		opt: Utils.Interface.DeveloperInterfaceOptions;
	}

	export interface IAdsInterface {
	}

	export interface IWebSocketInterface {
	}

	export interface ITimer {
		ElepsedTime: number;

		reset(): void;
		stop(): number;
	}

	export interface ITimerFrame {
		getFrames(): Object;
		clearFrames(): void;

		startFrame(category?: string): ITimer;
		endFrame(category?: string): ITimer;
	}

	export interface IExternalGraph {
		createPopup(): void;
		operation(): void;
	}

	export interface IDatGUI {
		gui: dat.GUI;
	}

	export interface IBotSettings {
		baseURL?: string;

		LOAD_DEBUG_SCRIPTS: boolean;
		LOAD_GIT_SCRIPTS: boolean;
	}

	export interface IBotFactory {
		gameWrapper: IGameWrapper;
		canvas: ICanvasUtils;
		contextMenu: IContextMenu;
		userInterface: IUserInterface;
		bot: IBot;
		developerInterface: IDeveloperInterface;
		adsInterface: IAdsInterface;
		webSocketInterface: IWebSocketInterface;

		clock: ITimerFrame;
		externalGraph: IExternalGraph;

		datGUI: IDatGUI;
	}

	export interface IActivity {
		action(...args: any[]): IActivityResult;
	}

	export interface IActivityResult {
		isValid: boolean;
		goalCoordinates: IPoint2D;
		acceleration: AccelerationFlag;
		speed: number;
		customData: any;
	}

	export interface IShape /*extends Point2D*/ {
	}

	export interface IDictionary<T> {
		[key: string]: T;
	}

	export interface IBoot {
		boot: () => void;
	}

	export interface IPlayerDeath {
		onPlayerDeath: () => void;
	}

	export interface IScore {
		score: number;
	}

	export interface ILegacySize {
		sz: number;
	}

	// TODO : Review
	export interface IDistance {
		x: number;
		y: number;
		distance: number;
	}

	// TODO : Review
	export interface IDistance2 {
		x: number;
		y: number;
		distance2: number;
	}

	export interface IPoint2D {
		x: number;
		y: number;

		lerp(that: IPoint2D, t: number): IPoint2D;
		min(that: IPoint2D): IPoint2D;
		max(that: IPoint2D): IPoint2D;
	}

	export interface ICircle extends IPoint2D, IShape {
		radius: number;
	}

	export interface ICluster extends IPoint2D, IDistance, IScore {
		elements: Array<Food>;
		highRadius: number;
	}

	export interface ILine {
		point1: IPoint2D;
		point2: IPoint2D;
	}

	export interface IBounds {
		width: number;
		height: number;
	}

	export interface IRect extends IBounds, IShape {
		x: number;
		y: number;

		rotation: number;
	}

	export interface IPolygon extends IPoint2D, IShape {
		geometry: Victor[];
		geometryAsPoint2DArray: IPoint2D[];

		minX: number;
		minY: number;
		maxX: number;
		maxY: number;
	}

	export interface ICarWeaponData {
		weaponFired: boolean;

		previousWeaponType: CarWeapon;
		weaponType: CarWeapon;
		isLethalWeapon: boolean;
		triggerLocation: CarWeaponTrigger;
		speed: CarWeaponSpeed;
		magnitude: number;
	}
}

interface ArrayConstructor {
	from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): Array<U>;
	from<T>(arrayLike: ArrayLike<T>): Array<T>;
}

declare class DBSCAN {
	public run(data: Array<any>, radius: number, minimum: number): Array<Array<number>>;
}

declare class OPTICS {
	public run(data: Array<any>, radius: number, minimum: number): Array<Array<number>>;
}

declare class KMEANS {
	public run(data: Array<any>, radius: number, minimum: number): Array<Array<number>>;
}

declare class StackTraceFrame {
	public columnNumber: number;
	public fileName: string;
	public functionName: string;
	public lineNumber: number;
	public source: string;
}

declare let StackTrace: {
	getSync(): Array<StackTraceFrame>;
};

declare class GMInfo {
	public script: {
		version: string;
	};
}

declare namespace dat {
	export class GuiBase {
		public add: (o: Object, s: string, ...constrains: any[]) => GuiConstrain;
		public addFolder: (s: string) => GuiFolder;
	}

	export class GuiFolder extends GuiBase {
		public domElement: HTMLElement;
		public open: () => any;
	}

	export class GuiConstrain {
		public min: (value: number) => GuiConstrain;
		public step: (value: number) => GuiConstrain;
		public listen: () => GuiConstrain;
		public name: (s: string) => GuiConstrain;
	}

	export class GUI extends GuiBase {
		domElement: HTMLDivElement;

		constructor(o?: any);

		public remember: (o: Object) => void;
	}
}

/*
declare class Stats {
	public update: () => void;
}
*/

declare let GM_info: GMInfo;

interface Object {
	watch(property: string, fx: (id: any, oldValue: Object, newValue: Object) => Object): void;
	[key: string]: any;
}

interface String {
	format(arg1: string, ...args: string[]);
}

declare function kga(x: string, ...arguments: any[]);

interface Window {
	//
	// TODO : Review
	stack: any[];
	desired_gsc: number;
	//playing: boolean;
	topscore: HTMLDivElement;
	//tr: any;
	//tests: any[];
	kdTree: any;
	//

	//
	// Tampermonkey variables
	GM_info: GMInfo;
	// !Tampermonkey variables

	//
	// Bot Settings
	// TODO : Review
	nick: string;
	// !Bot Settings

	//
	// Bot variables
	botSettings: DracoolaArt.KartwarsBot.IBotSettings;
	botFactory: DracoolaArt.KartwarsBot.IBotFactory;
	// !Bot variables

	//
	// Bot functions
	log: Function;
	autobotSaidHello: boolean;
	autobotSayHello: Function;
	// !Bot functions
}
