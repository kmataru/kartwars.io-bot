namespace DracoolaArt.KartwarsBot.Manager.Time {
	export class TimerFrame implements ITimerFrame {
		private clocks: Object = {};
		private elepsedTimes: Object = {};

		private static getFunctionName() {
			let frames = StackTrace.getSync();
			//return frames[frames.length - 1].toString();
			//return frames[frames.length - 1].functionName;
			return frames[4].functionName;
		}

		public startFrame(groupName?: string): Timer {
			let name = TimerFrame.getFunctionName();
			if (groupName != undefined) {
				name += ` [${groupName}]`;
			}

			if (this.clocks[name] == undefined) {
				this.clocks[name] = Timer.start();
			} else {
				this.clocks[name].reset();
			}

			return this.clocks[name];
		}

		public endFrame(groupName?: string): Timer {
			let name = TimerFrame.getFunctionName();
			if (groupName != undefined) {
				name += ` [${groupName}]`;
			}

			if (this.clocks[name] != undefined) {
				this.elepsedTimes[name] = this.clocks[name].stop();
			}

			return this.clocks[name];
		}

		public clearFrames(): void {
			this.elepsedTimes = [];
		}

		public getFrames(): Object {
			return this.elepsedTimes;
		}
	}
}
