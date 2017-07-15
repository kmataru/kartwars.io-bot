declare namespace DracoolaArt.KartwarsBot.Tactics.Fight {
	export interface IFightBase {
		action(radiusCheck?: number): void;
	}

	export interface IFight extends IFightBase {
		noop(): void;
	}

	export interface IFightChase extends IFightBase, IActivity {
		// noop(): void;
		// action(): boolean;
		action(projectileMagnitude?: number): IActivityResult;
	}
}
