/// <reference path="../../_references.ts" />

namespace DracoolaArt.KartwarsBot.Utils.Interface {
	/**
	 * User Interface Helper.
	 */
	export class UserInterface implements IUserInterface, IBoot, IPlayerDeath {
		private originalEvents: {
			fadeIn: Function;
			onKeyUp: (ev: KeyboardEvent) => any;
			onMouseDown: (ev: MouseEvent) => any;
			onMouseUp: (ev: MouseEvent) => any;
			onMouseMove: (ev: MouseEvent) => any;
			onRequestAnimationFrameLoop: (time: number) => void;
		};

		private overlays: {
			botOverlay: HTMLDivElement;
			serverOverlay: HTMLDivElement;
			prefOverlay: HTMLDivElement;
			statsOverlay: HTMLDivElement;
			fizzyOverlay: HTMLDivElement;
			rageOverlay: HTMLDivElement;
		};

		private scoreHolster: Utils.ScoreHolster;

		public fizzyText: ReverseEngineering.FizzyText;

		// Constructor
		constructor(
			protected readonly gameWrapper: GameWrapper,
			protected readonly contextMenu: Utils.Interface.ContextMenu,
			protected readonly canvas: Utils.CanvasUtils,
			protected readonly bot: Bot
			/*, stats: Stats*/
		) {
			this.scoreHolster = new Utils.ScoreHolster();

			this.originalEvents = {
				fadeIn: null,
				onKeyUp: null,
				onMouseDown: null,
				onMouseUp: null,
				onMouseMove: null,
				onRequestAnimationFrameLoop: null,
			};

			this.overlays = {
				botOverlay: null,
				serverOverlay: null,
				prefOverlay: null,
				statsOverlay: null,
				fizzyOverlay: null,
				rageOverlay: null,
			};

			// Save the original jQuery functions so we can modify them, or reenable them later.
			this.originalEvents.fadeIn = $.fn.fadeIn;

			let $this = this;

			$.fn.fadeIn = function () {
				let self = this;
				$this.originalEvents.fadeIn.apply(self, arguments).promise().done(function () {
					self.trigger('fadeIn');
				});
			};

			//
			// Overlays
			this.initOverlays();

			let jModalDownloadApp = $('#modal-downloadapp'),
				playButton = document.getElementById('play-btn'),
				mouseButtonControlSelection = document.getElementById('mouseBtn');

			// Ensure mouse control is selected
			mouseButtonControlSelection.click();

			//playButton.addEventListener('click', this.playButtonClickListener);
			jModalDownloadApp.bind('fadeIn', this.bypassModalPopupBlocker);

			this.bindToPlayButton();

			//
			// Unlocks all skins without the need for FB sharing.
			this.unlockSkins();

			//
			// Remove social
			(document.getElementsByClassName('social')[0] as HTMLDivElement).style.display = 'none';

			//
			// Listener for mouse wheel scroll - used for setZoom function
			document.body.addEventListener('mousewheel', this.canvas.setZoom);
			document.body.addEventListener('DOMMouseScroll', this.canvas.setZoom);

			this.onPrefChange();
		}

		public boot() {
			//
			// Save the original kartwars.io functions so we can modify them, or reenable them later.
			this.originalEvents.onKeyUp = window.game.input.keyboard._onKeyUp;
			this.originalEvents.onMouseDown = window.game.input.mouse._onMouseDown;
			this.originalEvents.onMouseUp = window.game.input.mouse._onMouseUp;
			this.originalEvents.onMouseMove = window.game.input.mouse._onMouseMove;
			this.originalEvents.onRequestAnimationFrameLoop = window.game.raf._onLoop;

			//
			// Reset Keyboard and Mouse events
			window.game.input.keyboard._onKeyUp = this.onKeyUp;
			window.game.input.mouse._onMouseDown = this.onMouseDown;
			window.game.input.mouse._onMouseUp = this.onMouseUp;
			window.game.input.mouse._onMouseMove = this.onMouseMove;

			//
			// Reset Request Animation Frame Loop event
			window.game.raf._onLoop = this.updateRequestAnimationFrame;

			//window.addEventListener('mouseup', this.onmouseup);
			window.addEventListener('keydown', this.onKeyUp, !1);
			window.addEventListener('resize', this.onResize, !1);

			setInterval(this.get100SuperCoins, 10 * 60 * 1000);
			this.get100SuperCoins();

			this.injectShowFlowButton();
		}

		/**
		 * Injects Show Flow Button.
		 */
		private injectShowFlowButton() {
			let xButton = `<div class="footer" style="z-index: 99999; bottom: 60px;">
	<div class="quality">
		<a href="#" id="popup-button" class="btn btn-fs">SHOW FLOW</a>
	</div>
</div>`;

			$('#init-screen').after(xButton);
			$('#popup-button').click(function (e) {
				e.preventDefault();

				window.botFactory.externalGraph.createPopup();
			});
		}

		/**
		 * Resize Event.
		 */
		@MethodDecoration.bound
		private onResize() {
			let canvas = this.gameWrapper.input.canvas.getContext().canvas;

			canvas.width = window.game.canvas.width;
			canvas.height = window.game.canvas.height;
		}

		/**
		 * Attach event to Play Button.
		 */
		@MethodDecoration.bound
		private bindToPlayButton() {
			$('#play-btn').click(this.playButtonClickListener);
			let events = (($ as any)._data as Function)($('#play-btn')[0], 'events');
			if (events) {
				let clickHandlers = events.click;
				if (clickHandlers) {
					clickHandlers.reverse();
				}
			}
		}

		/**
		 * On Player Death's event.
		 */
		@MethodDecoration.bound
		public onPlayerDeath() {
			this.bindToPlayButton();

			this.bot.isBotRunning = false;

			this.fizzyText.play = true;
			this.fizzyText.loop();

			// TODO
			/*
			if (window.lastscore && window.lastscore.childNodes[1]) {
				bot.scores.push(parseInt(window.lastscore.childNodes[1].innerHTML));
				bot.scores.sort(function (a, b) { return b - a; });
				this.updateStats();
			}
			*/

			if (this.bot.isBotEnabled) {
				let $this = this;

				let deathTriggeredCheckPlayedTimeIntervalId = window.setInterval(function () {
					let jTimePlayed = $('#top-time-played span');
					if (jTimePlayed.is(':visible')) {
						let formattedTimePlayed = jTimePlayed.text();
						let timePlayed = (parseInt(formattedTimePlayed.split('m')[0]) * 60) + parseInt(formattedTimePlayed.split('m')[1].split(' ')[1].split('s')[0]);

						if (window.botFactory.developerInterface.opt.individual.scoreTable) {
							let playTime: string = formattedTimePlayed;
							let top3Time: string = $('#top-result span').text();
							let hexagons: string = $('#coins-result span').text();
							let kills: string = $('#kills-result span').text();
							let score: string = $('#score-result span').text();
							let maxStreak: string = $('#streak-result span').text();

							$this.scoreHolster.addScore(playTime, top3Time, hexagons, kills, score, maxStreak);
							$this.scoreHolster.printResults();
						}

						kga('send', {
							hitType: 'event',
							eventCategory: 'InGame Bot',
							eventAction: 'Time alive',
							eventValue: timePlayed
						});

						window.clearInterval(deathTriggeredCheckPlayedTimeIntervalId);
					}
				}, 250);
			}
		}

		/**
		 * Unlocks ALL skins.
		 */
		private unlockSkins() {
			let allElements = Array.from(document.querySelectorAll('.blocked, .buy'));
			let shareFacebookElements = document.getElementsByClassName('share-facebook');

			for (let blockedElementIdx in allElements) {
				let element = allElements[blockedElementIdx] as HTMLElement;
				element.innerHTML = 'Unlocked';
				element.style.backgroundColor = '#2FC92F';
			}

			for (let shareFacebookElementIdx in shareFacebookElements) {
				delete (shareFacebookElements[shareFacebookElementIdx]);
			}

			for (let carIdx in window.carList) {
				window.carList[carIdx].b = 'BLOCK.none';
				window.carList[carIdx].section = 'free';
			}
		}

		/**
		 * Init overlays.
		 */
		private initOverlays() {
			let botOverlay = this.overlays.botOverlay = document.createElement('div');
			botOverlay.className = 'nsi bot';
			document.body.appendChild(botOverlay);

			let serverOverlay = this.overlays.serverOverlay = document.createElement('div');
			serverOverlay.className = 'nsi server';
			document.body.appendChild(serverOverlay);

			let prefOverlay = this.overlays.prefOverlay = document.createElement('div');
			prefOverlay.className = 'nsi pref';
			document.body.appendChild(prefOverlay);

			let statsOverlay = this.overlays.statsOverlay = document.createElement('div');
			statsOverlay.className = 'nsi stats';
			document.body.appendChild(statsOverlay);

			let rageOverlay = this.overlays.rageOverlay = document.createElement('div');
			rageOverlay.className = 'nsi rage';
			let rageImage = document.createElement('img');
			rageImage.src = `${window.botSettings.baseURL}images/rage-logo-red-com.png`;
			rageOverlay.appendChild(rageImage);
			document.body.appendChild(rageOverlay);

			let fizzyOverlay = this.overlays.fizzyOverlay = document.createElement('div');
			fizzyOverlay.className = 'nsi fizzy';
			fizzyOverlay.id = 'fizzytext';
			document.getElementById('login-modal').appendChild(fizzyOverlay);

			//

			let fizzyText = this.fizzyText = new ReverseEngineering.FizzyText('MegaBot.js', 800, 350, false, 100);
			fizzyText.insertInTo(fizzyOverlay);
			fizzyText.loop();

			//
			//

			let fizzyTextMessagesIdx = 0;
			let fizzyTextMessages = [
				'you are',
				'not',
				'what you think'
			];

			window.setInterval(function () {
				if (fizzyTextMessagesIdx == fizzyTextMessages.length) {
					fizzyTextMessagesIdx = 0;
				}

				fizzyText.message = fizzyTextMessages[fizzyTextMessagesIdx++];
			}, 2500);
		}

		public setRageVisible(visible: boolean) {
			//let rageOverlaystyle = this.overlays.rageOverlay.style;

			this.overlays.rageOverlay.style.visibility = (visible ? 'visible' : 'hidden');
		}

		/**
		 * Toggles overlays visibility.
		 */
		public toggleOverlays() {
			let overlays = this.overlays;

			Object.keys(overlays).forEach(function (okey) {
				if (okey == 'rageOverlay' || okey == 'fizzyOverlay') {
					return;
				}

				let thisOverlay = overlays[okey];

				if (thisOverlay.style) {
					let oVis = thisOverlay.style.visibility !== 'hidden' ? 'hidden' : 'visible';
					thisOverlay.style.visibility = oVis;
				}
			});
		}

		/**
		 * Bypass modal pop-up advert.
		 */
		public bypassModalPopupBlocker() {
			window.setTimeout(function () {
				let modalDownloadAppIsVisible = $('#modal-downloadapp').is(':visible');
				if (modalDownloadAppIsVisible) {
					$('#modal-downloadapp .close-modal').click();
				}
			}, 350);
		}

		/**
		 * Collects 100 Super coins.
		 * Triggered at boot time and at 10 minutes interval.
		 */
		private get100SuperCoins() {
			$('.btn.btn-getcoin').click();
		}

		/**
		 * Game Ready Delegate.
		 */
		@MethodDecoration.bound
		public onGameReadyDelegate() {
			// Fixes the case when the game goes low with the fps. Maybe a game bug.
			window.esto.updateItems();

			// Set view distance
			// Initial : 1661 x 950
			window.distanciaMaximaX = window.game.world.bounds.width;
			window.distanciaMaximaY = window.game.world.bounds.height;

			window.game.time.watch('fps', (id, oldValue, newValue) => {
				this.onFrameUpdate();

				return newValue;
			});
		}

		/**
		 * Play button event.
		 * @param event
		 */
		@MethodDecoration.bound
		private playButtonClickListener(event: BaseJQueryEventObject) {
			let target = event.target;

			// Detach this event from the play button.
			$('#play-btn').off('click', this.playButtonClickListener);
			$(target).addClass('disabled');

			event.preventDefault();
			event.stopImmediatePropagation();

			this.fizzyText.explode();

			//this.get100Coins();

			this.saveNick();
			this.onPrefChange();

			kga('send', {
				hitType: 'event',
				eventCategory: 'InGame',
				eventAction: 'Play',
				eventLabel: 'Play'
			});

			// Retrigger button click after timeout.
			// This makes the explosion more visible before starting the game.
			setTimeout(function () {
				target.dispatchEvent(event.originalEvent);
			}, 750);
		}

		/**
		 * Preserve nickname.
		 */
		// TODO : Review
		private saveNick() {
			let nick = (document.getElementById('nick-input') as HTMLInputElement).value;
			//this.savePreference('savedNick', nick);
		}

		/**
		 * Hide top score.
		 */
		@MethodDecoration.bound
		private hideTop() {
			let nsidivs = (document.querySelectorAll('div.nsi') as NodeListOf<HTMLDivElement>);
			for (let i = 0; i < nsidivs.length; i++) {
				if (nsidivs[i].style.top === '4px' && nsidivs[i].style.width === '300px') {
					nsidivs[i].style.visibility = 'hidden';
					this.bot.isTopHidden = true;
					window.topscore = nsidivs[i];
				}
			}
		}

		/**
		 * Reset Zoom.
		 */
		public resetZoom() {
			this.canvas.resetZoom();
		}

		/**
		 * Calls original kartwars.io onkeyup function + whatever is under it.
		 * Useful stuff: http://keycode.info/
		 * @param e
		 */
		@MethodDecoration.bound
		private onKeyUp(e: KeyboardEvent) {
			this.originalEvents.onKeyUp(e);

			if (this.gameWrapper.util.isPlaying) {
				// `Ctrl + B` to toggle bot
				if (e.ctrlKey && e.keyCode === 66 && (!e.shiftKey && !e.altKey)) {
					this.bot.isBotEnabled = !this.bot.isBotEnabled;

					this.gameWrapper.input.canvas.forceClear();
				}
			}
		}

		/**
		 * Mouse Move event overrider.
		 * @param e
		 */
		@MethodDecoration.bound
		private onMouseMove(e: MouseEvent) {
			if (this.bot.isBotInGame()) {
				//
			} else {
				this.originalEvents.onMouseMove(e);
			}
		}

		/**
		 * Mouse Down event overrider.
		 * @param e
		 */
		@MethodDecoration.bound
		private onMouseDown(e: MouseEvent) {
			let triggerChainedEvent = false;

			if (this.contextMenu.isActive) {
				return;
			}

			if (this.bot.isBotInGame()) {
				switch (e.buttons) {
					// "Left click" to manually trigger weapon
					case 1: {
						triggerChainedEvent = true;
					} break;

					// "Right click" to manually speed up the kart
					case 2: {
						//window.mainCar.isAccelerating = true;
						this.bot.defaultAccel = 1; // TODO : Review
						triggerChainedEvent = true;
					} break;
				}
			}

			if (triggerChainedEvent) {
				this.originalEvents.onMouseDown(e);
			}

			this.onPrefChange();
		}

		/**
		 * Mouse Up event overrider.
		 * @param e
		 */
		@MethodDecoration.bound
		private onMouseUp(e: MouseEvent) {
			// window.log('Mouse release triggered !');

			// window.log((+new Date()), '----------> uuu');

			if (this.contextMenu.isActive) {
				// window.log((+new Date()), '----------> VVV');

				return;
			}

			if (this.bot.isBotInGame()) {
				//switch (e.which) {
				switch (e.buttons) {
					// "Right click"
					//case 3: {
					case 2: {
						//window.mainCar.isAccelerating = false;
						this.bot.defaultAccel = 0;

						break;
					}
				}
			}

			this.originalEvents.onMouseUp(e);
		}

		/**
		 * Update stats overlay.
		 */
		@MethodDecoration.bound
		private updateStats() {
			let oContent = [];
			let median;

			if (this.bot.scores.length === 0) return;

			median = Math.round((this.bot.scores[Math.floor((this.bot.scores.length - 1) / 2)] +
				this.bot.scores[Math.ceil((this.bot.scores.length - 1) / 2)]) / 2);

			oContent.push('games played: ' + this.bot.scores.length);
			oContent.push('a: ' + Math.round(
				this.bot.scores.reduce(function (a, b) { return a + b; }) / (this.bot.scores.length)) + ' m: ' + median);

			for (let i = 0; i < this.bot.scores.length && i < 10; i++) {
				oContent.push(i + 1 + '. ' + this.bot.scores[i]);
			}

			this.overlays.statsOverlay.innerHTML = oContent.join('<br/>');
		}

		/**
		 * Update stats overlay.
		 */
		private updateStatsEx() {
			let oContent = [];

			oContent.push('Frames:');
			oContent.push('');

			let frames = window.botFactory.clock.getFrames();
			window.botFactory.clock.clearFrames();

			for (let frameIdx in frames) {
				oContent.push(`${frameIdx}: ${frames[frameIdx]}ms`);
			}

			//
			//
			/*
			if (window.stack != undefined) {
				oContent.push('');
				oContent.push('Frames X:');
	
				for (let stackIdx in window.stack) {
					let sf = window.stack[stackIdx];
	
					//oContent.push(`${stackIdx} => ${sf}`);
					oContent.push(`${stackIdx} => ${sf.functionName}`);
				}
	
				//window.stack.forEach(function (sf) {
				//	//return sf.toString();
				//	oContent.push(sf.functionName);
				//});
			}
			*/
			//
			//

			this.overlays.statsOverlay.innerHTML = oContent.join('<br/>');
		}

		/**
		 * Set static display options.
		 */
		@MethodDecoration.bound
		private onPrefChange() {
			let oContent = [];
			let ht = this.handleTextColor;

			oContent.push('Game version: ' + window.version);
			oContent.push('Bot version: ' + window.GM_info.script.version);
			oContent.push('[Ctrl + B]    : Toggle bot');
			oContent.push('[Mouse Wheel] : Zoom');

			this.overlays.prefOverlay.innerHTML = oContent.join('<br/>');
		}

		/**
		 * Game status overlay.
		 */
		@MethodDecoration.bound
		private onFrameUpdate() {
			if (this.gameWrapper.util.isPlaying) {
				let oContent = [];

				oContent.push('Latency: ' + window.ping + 'ms');
				oContent.push('FPS: ' + window.game.time.fps);

				this.overlays.botOverlay.innerHTML = oContent.join('<br/>');

				// TODO
				/*
				if (window.bso !== undefined && this.overlays.serverOverlay.innerHTML !==
					window.bso.ip + ':' + window.bso.po) {
					this.overlays.serverOverlay.innerHTML =
						window.bso.ip + ':' + window.bso.po;
				}
				*/
			}

			this.updateStatsEx();
		}

		/**
		 * Original Game Update.
		 * @param time
		 */
		@MethodDecoration.bound
		private originalGameUpdate(time) {
			window.botFactory.clock.startFrame();
			//this.stats.update();

			window.game.update(time);
			window.botFactory.clock.endFrame();
		}

		/**
		 * Bot Game Update Overrider.
		 * @param time
		 */
		@MethodDecoration.bound
		private gameUpdate(time: number) {
			window.botFactory.clock.startFrame();

			this.canvas.maintainZoom();

			if (!this.bot.isBotInGame()) {
				this.gameWrapper.input.canvas.forceClear();

				this.originalGameUpdate(time);

				return;
			}

			let start = Date.now();

			//
			// Clean up residual data.
			this.gameWrapper.items.reset();

			//
			// !!
			this.originalGameUpdate(time);
			// !!
			//

			if (this.bot.isBotInGame()) {
				this.bot.isBotRunning = true;

				this.fizzyText.play = false;

				this.bot.go();
			}

			if (!this.bot.isBotEnabled || !this.bot.isBotRunning) {
				window.game.input.mouse._onMouseDown = this.onMouseDown;
			}

			this.canvas.drawAllInterceptedWrappedCalls();

			window.botFactory.clock.endFrame();
		}

		/**
		 * Looper.
		 * @param time
		 */
		@MethodDecoration.bound
		private updateRequestAnimationFrame(time: number) {
			window.game.raf.isRunning && (
				this.gameUpdate(Math.floor(time)),
				window.game.raf._timeOutID = window.requestAnimationFrame(window.game.raf._onLoop)
			);
		}

		/**
		 * Quit to menu.
		 */
		public quit() {
			// TODO : Close socket before calling `reiniciar`.
			if (this.bot.isBotInGame()) {
				window.esto.reiniciar();
			}
		}

		private handleTextColor(enabled: boolean) {
			return '<span style=\"color:' + (enabled ? 'green;\">enabled' : 'red;\">disabled') + '</span>';
		}
	}
}
