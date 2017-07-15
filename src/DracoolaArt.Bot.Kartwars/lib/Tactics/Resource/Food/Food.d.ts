declare namespace DracoolaArt.KartwarsBot.Tactics.Resource.Food {
	export interface IFindClosestClusterOptions {
		scanRadius: number;
		sectorSize: number;
		minimumElementsPerCluster: number;
	}

	export interface IFoodBase extends Resource.IResourceBase<Food> {
		//
	}

	export interface IFood extends IFoodBase {
		noop(): void;

		//currentResource: Bot2Point2D;
	}

	export interface IFoodCluster extends IFoodBase {
		opt: IFindClosestClusterOptions;
	}
}
