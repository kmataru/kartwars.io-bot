namespace DracoolaArt.KartwarsBot.Tactics.Resource.Food {
	export class FindClosestClusterOptions implements IFindClosestClusterOptions {
		public scanRadius: number = 3500 / 2;

		public sectorSize: number = 350;

		public minimumElementsPerCluster: number = 15;
	}
}
