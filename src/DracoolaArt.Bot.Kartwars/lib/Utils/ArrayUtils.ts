/// <reference path="../_references.ts" />

namespace DracoolaArt.KartwarsBot.Utils {
	/**
	 * Array utils.
	 */
	export class ArrayUtils {
		/**
		 * Sorting by 'score' property descending.
		 * @param a
		 * @param b
		 */
		public static sortScore(a: IScore, b: IScore) {
			return b.score - a.score;
		}

		/**
		 * Sorting by 'sz' property descending.
		 * @param a
		 * @param b
		 */
		public static sortSz(a: ILegacySize, b: ILegacySize) {
			return b.sz - a.sz;
		}

		/**
		 * Sorting by 'distance' property ascending.
		 * @param a
		 * @param b
		 */
		public static sortDistance(a: IDistance, b: IDistance) {
			return a.distance - b.distance;
		}

		/**
		 * Sorting by 'distance2' property ascending.
		 * @param a
		 * @param b
		 */
		public static sortDistance2(a: IDistance2, b: IDistance2) {
			return a.distance2 - b.distance2;
		}
	}
}
