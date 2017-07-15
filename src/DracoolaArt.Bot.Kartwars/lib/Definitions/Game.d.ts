/// <reference path="../_references.ts" />

declare class MousePointer {
	public x: number;
	public y: number;
}

declare class Mouse {
	public _onMouseDown: (ev: MouseEvent) => any;
	public _onMouseMove: (ev: MouseEvent) => any;
	public _onMouseUp: (ev: MouseEvent) => any;
}

declare class Keyboard {
	// public _onKeyDown: (ev: KeyboardEvent) => any;
	public _onKeyUp: (ev: KeyboardEvent) => any;
}

declare class Input {
	public mouse: Mouse;
	public mousePointer: MousePointer;
	public keyboard: Keyboard;
}

declare class World {
	public bounds: DracoolaArt.KartwarsBot.IBounds;
	public scale: DracoolaArt.KartwarsBot.IPoint2D;
}

declare class Time {
	public fps: number;
}

// BasicGame.Game
declare class BasicGameGame {
	public game: Game;

	public reiniciar: () => void;
	// window.game.state.states.Game.updateItems()
	// window.esto.updateItems()
	public updateItems: () => void;
}

declare class Game {
	public canvas: HTMLCanvasElement;
	public input: Input;
	public world: World;
	public raf: RequestAnimationFrame;
	public time: Time;
	public update: (time: number) => any;
	public updateRender: (time: number) => any;
}

declare class GameImageBase {
	public rotation: number;
	public position: DracoolaArt.KartwarsBot.IPoint2D;
	// TODO : Review
	public antigAng: number;
	public exists: boolean;
	public alive: boolean;
	public alpha: number;
	public visible: boolean;
	public renderable: boolean;
}

declare class GameImage extends GameImageBase {
	public escudo2: GameImageShield;
}

declare class GameImageShield extends GameImageBase {
	//
}

declare class Sprite implements DracoolaArt.KartwarsBot.IPoint2D, DracoolaArt.KartwarsBot.IDistance {
	public x: number;
	public y: number;

	public id: number;
	public img: GameImage;

	public lerp(that: DracoolaArt.KartwarsBot.IPoint2D, t: number): DracoolaArt.KartwarsBot.IPoint2D;
	public min(that: DracoolaArt.KartwarsBot.IPoint2D): DracoolaArt.KartwarsBot.IPoint2D;
	public max(that: DracoolaArt.KartwarsBot.IPoint2D): DracoolaArt.KartwarsBot.IPoint2D;

	//
	// Extended
	public distance: number;
	public lastPosition: DracoolaArt.KartwarsBot.IPoint2D;
	public velocity: DracoolaArt.KartwarsBot.IPoint2D;
	public magnitude: number;
}

declare class Car extends Sprite {
	rotation: number; // ??
	//sp: number; // ??

	//
	// Extenders
	public weapon: DracoolaArt.KartwarsBot.ICarWeaponData;
	public isAccelerating: boolean;
	public isShieldActivated: boolean;
	public shieldActivationTime: Date;
}

declare class Food extends Sprite implements DracoolaArt.KartwarsBot.ILegacySize {
	public rotation: number; // ??
	public sz: number;
	public distanceToCenterOfCluster: number;
}

declare class Item extends Sprite implements DracoolaArt.KartwarsBot.ILegacySize {
	public rotation: number; // ??
	public sz: number;
}

declare class Bomb extends Sprite {
	public rotation: number; // ??
}

declare class Mine extends Sprite {
	public rotation: number; // ??
}

declare class Missile extends Sprite {
	public rotation: number; // ??
}

declare class TeleMissile extends Sprite {
	public rotation: number; // ??
}

declare class RequestAnimationFrame {
	public _onLoop: (time: number) => void;
	public _timeOutID: number;

	public isRunning: boolean;
}

interface Window {
	//
	// Game variables
	version: number;

	esto: BasicGameGame;
	game: Game;
	mainCar: Car;
	ws: WebSocket;
	ping: number;

	myCoins: number;

	distanciaMaximaX: number;
	distanciaMaximaY: number;

	sprites: Object;
	misiles: Object;
	bombas: Object;
	minas: Object;
	misItems: Object;
	coins: Array<Food>;
	carList: Array<any>;
	// !Game variables

	//
	// Game classes
	Car: Function;
	Misil: Function;
	MisilTele: Function;
	Bomba: Function;
	Mina: Function;
	Item: Function;
	// !Game classes
}
