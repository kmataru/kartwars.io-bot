namespace DracoolaArt.KartwarsBot.Manager.Time {
	export class Timer implements ITimer {
		private lastTime: number;
		private isStopped: boolean;
		private elepsedTime: number;

		constructor() {
			this.reset();
		}

		get ElepsedTime(): number {
			return this.isStopped ? this.elepsedTime : ((+new Date()) - this.lastTime);
		}

		public static start(): Timer {
			return new Timer();
		}

		public reset(): void {
			this.isStopped = false;
			this.lastTime = (+new Date());
		}

		public stop(): number {
			this.elepsedTime = this.ElepsedTime;
			this.isStopped = true;

			return this.elepsedTime;
		}
	}
}
