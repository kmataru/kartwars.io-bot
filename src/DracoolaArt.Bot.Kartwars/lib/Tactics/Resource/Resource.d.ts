declare namespace DracoolaArt.KartwarsBot.Tactics.Resource {
	export interface IResourceBase<T extends Sprite> extends IActivity {
		action(resource?: Array<T>): IActivityResult;
	}
}
