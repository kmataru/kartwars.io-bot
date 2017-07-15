/* tslint:disable */

namespace DracoolaArt.KartwarsBot {
	/**
	 * Experimental Graph.
	 */
	export class ExternalGraph implements IExternalGraph {
		popup: Window;

		constructor() {
			//
		}

		createPopup() {
			this.popup = window.open("http://scripts.local.com/lib/html/test.htm", "_blank", "location=yes,width=800,height=600,scrollbars=yes,status=yes");
			this.popup.moveTo(50, 50);
			this.popup.resizeTo(window.screen.width - 100, window.screen.height - 100);
		}

		operation() {
			if (null != this.popup) {
				/*
				let scene = {
					"edges": [{
						"id": 1,
						"block1": 1,
						"connector1": ["out", "output"],
						"block2": 2,
						"connector2": ["in", "input"]
					}],
					"blocks": [{
						"id": 1,
						"x": -300,
						"y": 0,
						"type": "Function",
						"module": null,
						"values": {
							"in": 0,
							"out": 0
						}
					}, {
						"id": 2,
						"x": (-300 + 175),
						"y": 0,
						"type": "Function",
						"module": null,
						"values": {
							"in": 0,
							"out": 0
						}
					}]
				};
				*/

				let scene: Object = {
					"edges": [],
					"blocks": []
				};

				//blocks.clear();
				//blocks.load(scene);

				let stack = window.stack;
				stack.reverse();
				stack.pop();
				stack.pop();

				for (let stackIdx in stack) {
					let sf = stack[stackIdx];

					let stackIdxAsInt = parseInt(stackIdx);

					//oContent.push(`${stackIdx} => ${sf}`);
					if (stackIdxAsInt > 0) {
						scene['edges'].push({
							"id": stackIdx,
							"block1": (stackIdxAsInt - 1),
							"connector1": ["out", "output"],
							"block2": stackIdxAsInt,
							"connector2": ["in", "input"]
						});
					}

					scene['blocks'].push({
						"id": stackIdx,
						"x": (-900 + 175 * stackIdxAsInt),
						"y": 0,
						"type": "Function",
						"module": null,
						"values": {
							"in": sf.functionName,
							"out": '0'
						}
					});
				}

				let data = JSON.stringify(scene);

				this.popup.postMessage(data, "http://scripts.local.com");
			}
		}
	}
}
