/// <reference path="../../_references.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Utils;
        (function (Utils) {
            var Interface;
            (function (Interface) {
                /**
                 * User Interface Helper.
                 */
                var UserInterface = (function () {
                    // Constructor
                    function UserInterface(gameWrapper, contextMenu, canvas, bot
                        /*, stats: Stats*/
                    ) {
                        this.gameWrapper = gameWrapper;
                        this.contextMenu = contextMenu;
                        this.canvas = canvas;
                        this.bot = bot;
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
                        var $this = this;
                        $.fn.fadeIn = function () {
                            var self = this;
                            $this.originalEvents.fadeIn.apply(self, arguments).promise().done(function () {
                                self.trigger('fadeIn');
                            });
                        };
                        //
                        // Overlays
                        this.initOverlays();
                        var jModalDownloadApp = $('#modal-downloadapp'), playButton = document.getElementById('play-btn'), mouseButtonControlSelection = document.getElementById('mouseBtn');
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
                        document.getElementsByClassName('social')[0].style.display = 'none';
                        //
                        // Listener for mouse wheel scroll - used for setZoom function
                        document.body.addEventListener('mousewheel', this.canvas.setZoom);
                        document.body.addEventListener('DOMMouseScroll', this.canvas.setZoom);
                        this.onPrefChange();
                    }
                    UserInterface.prototype.boot = function () {
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
                    };
                    /**
                     * Injects Show Flow Button.
                     */
                    UserInterface.prototype.injectShowFlowButton = function () {
                        var xButton = "<div class=\"footer\" style=\"z-index: 99999; bottom: 60px;\">\n\t<div class=\"quality\">\n\t\t<a href=\"#\" id=\"popup-button\" class=\"btn btn-fs\">SHOW FLOW</a>\n\t</div>\n</div>";
                        $('#init-screen').after(xButton);
                        $('#popup-button').click(function (e) {
                            e.preventDefault();
                            window.botFactory.externalGraph.createPopup();
                        });
                    };
                    /**
                     * Resize Event.
                     */
                    UserInterface.prototype.onResize = function () {
                        var canvas = this.gameWrapper.input.canvas.getContext().canvas;
                        canvas.width = window.game.canvas.width;
                        canvas.height = window.game.canvas.height;
                    };
                    /**
                     * Attach event to Play Button.
                     */
                    UserInterface.prototype.bindToPlayButton = function () {
                        $('#play-btn').click(this.playButtonClickListener);
                        var events = $._data($('#play-btn')[0], 'events');
                        if (events) {
                            var clickHandlers = events.click;
                            if (clickHandlers) {
                                clickHandlers.reverse();
                            }
                        }
                    };
                    /**
                     * On Player Death's event.
                     */
                    UserInterface.prototype.onPlayerDeath = function () {
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
                            var $this_1 = this;
                            var deathTriggeredCheckPlayedTimeIntervalId_1 = window.setInterval(function () {
                                var jTimePlayed = $('#top-time-played span');
                                if (jTimePlayed.is(':visible')) {
                                    var formattedTimePlayed = jTimePlayed.text();
                                    var timePlayed = (parseInt(formattedTimePlayed.split('m')[0]) * 60) + parseInt(formattedTimePlayed.split('m')[1].split(' ')[1].split('s')[0]);
                                    if (window.botFactory.developerInterface.opt.individual.scoreTable) {
                                        var playTime = formattedTimePlayed;
                                        var top3Time = $('#top-result span').text();
                                        var hexagons = $('#coins-result span').text();
                                        var kills = $('#kills-result span').text();
                                        var score = $('#score-result span').text();
                                        var maxStreak = $('#streak-result span').text();
                                        $this_1.scoreHolster.addScore(playTime, top3Time, hexagons, kills, score, maxStreak);
                                        $this_1.scoreHolster.printResults();
                                    }
                                    kga('send', {
                                        hitType: 'event',
                                        eventCategory: 'InGame Bot',
                                        eventAction: 'Time alive',
                                        eventValue: timePlayed
                                    });
                                    window.clearInterval(deathTriggeredCheckPlayedTimeIntervalId_1);
                                }
                            }, 250);
                        }
                    };
                    /**
                     * Unlocks ALL skins.
                     */
                    UserInterface.prototype.unlockSkins = function () {
                        var allElements = Array.from(document.querySelectorAll('.blocked, .buy'));
                        var shareFacebookElements = document.getElementsByClassName('share-facebook');
                        for (var blockedElementIdx in allElements) {
                            var element = allElements[blockedElementIdx];
                            element.innerHTML = 'Unlocked';
                            element.style.backgroundColor = '#2FC92F';
                        }
                        for (var shareFacebookElementIdx in shareFacebookElements) {
                            delete (shareFacebookElements[shareFacebookElementIdx]);
                        }
                        for (var carIdx in window.carList) {
                            window.carList[carIdx].b = 'BLOCK.none';
                            window.carList[carIdx].section = 'free';
                        }
                    };
                    /**
                     * Init overlays.
                     */
                    UserInterface.prototype.initOverlays = function () {
                        var botOverlay = this.overlays.botOverlay = document.createElement('div');
                        botOverlay.className = 'nsi bot';
                        document.body.appendChild(botOverlay);
                        var serverOverlay = this.overlays.serverOverlay = document.createElement('div');
                        serverOverlay.className = 'nsi server';
                        document.body.appendChild(serverOverlay);
                        var prefOverlay = this.overlays.prefOverlay = document.createElement('div');
                        prefOverlay.className = 'nsi pref';
                        document.body.appendChild(prefOverlay);
                        var statsOverlay = this.overlays.statsOverlay = document.createElement('div');
                        statsOverlay.className = 'nsi stats';
                        document.body.appendChild(statsOverlay);
                        var rageOverlay = this.overlays.rageOverlay = document.createElement('div');
                        rageOverlay.className = 'nsi rage';
                        var rageImage = document.createElement('img');
                        rageImage.src = window.botSettings.baseURL + "images/rage-logo-red-com.png";
                        rageOverlay.appendChild(rageImage);
                        document.body.appendChild(rageOverlay);
                        var fizzyOverlay = this.overlays.fizzyOverlay = document.createElement('div');
                        fizzyOverlay.className = 'nsi fizzy';
                        fizzyOverlay.id = 'fizzytext';
                        document.getElementById('login-modal').appendChild(fizzyOverlay);
                        //
                        var fizzyText = this.fizzyText = new ReverseEngineering.FizzyText('MegaBot.js', 800, 350, false, 100);
                        fizzyText.insertInTo(fizzyOverlay);
                        fizzyText.loop();
                        //
                        //
                        var fizzyTextMessagesIdx = 0;
                        var fizzyTextMessages = [
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
                    };
                    UserInterface.prototype.setRageVisible = function (visible) {
                        //let rageOverlaystyle = this.overlays.rageOverlay.style;
                        this.overlays.rageOverlay.style.visibility = (visible ? 'visible' : 'hidden');
                    };
                    /**
                     * Toggles overlays visibility.
                     */
                    UserInterface.prototype.toggleOverlays = function () {
                        var overlays = this.overlays;
                        Object.keys(overlays).forEach(function (okey) {
                            if (okey == 'rageOverlay' || okey == 'fizzyOverlay') {
                                return;
                            }
                            var thisOverlay = overlays[okey];
                            if (thisOverlay.style) {
                                var oVis = thisOverlay.style.visibility !== 'hidden' ? 'hidden' : 'visible';
                                thisOverlay.style.visibility = oVis;
                            }
                        });
                    };
                    /**
                     * Bypass modal pop-up advert.
                     */
                    UserInterface.prototype.bypassModalPopupBlocker = function () {
                        window.setTimeout(function () {
                            var modalDownloadAppIsVisible = $('#modal-downloadapp').is(':visible');
                            if (modalDownloadAppIsVisible) {
                                $('#modal-downloadapp .close-modal').click();
                            }
                        }, 350);
                    };
                    /**
                     * Collects 100 Super coins.
                     * Triggered at boot time and at 10 minutes interval.
                     */
                    UserInterface.prototype.get100SuperCoins = function () {
                        $('.btn.btn-getcoin').click();
                    };
                    /**
                     * Game Ready Delegate.
                     */
                    UserInterface.prototype.onGameReadyDelegate = function () {
                        var _this = this;
                        // Fixes the case when the game goes low with the fps. Maybe a game bug.
                        window.esto.updateItems();
                        // Set view distance
                        // Initial : 1661 x 950
                        window.distanciaMaximaX = window.game.world.bounds.width;
                        window.distanciaMaximaY = window.game.world.bounds.height;
                        window.game.time.watch('fps', function (id, oldValue, newValue) {
                            _this.onFrameUpdate();
                            return newValue;
                        });
                    };
                    /**
                     * Play button event.
                     * @param event
                     */
                    UserInterface.prototype.playButtonClickListener = function (event) {
                        var target = event.target;
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
                    };
                    /**
                     * Preserve nickname.
                     */
                    // TODO : Review
                    UserInterface.prototype.saveNick = function () {
                        var nick = document.getElementById('nick-input').value;
                        //this.savePreference('savedNick', nick);
                    };
                    /**
                     * Hide top score.
                     */
                    UserInterface.prototype.hideTop = function () {
                        var nsidivs = document.querySelectorAll('div.nsi');
                        for (var i = 0; i < nsidivs.length; i++) {
                            if (nsidivs[i].style.top === '4px' && nsidivs[i].style.width === '300px') {
                                nsidivs[i].style.visibility = 'hidden';
                                this.bot.isTopHidden = true;
                                window.topscore = nsidivs[i];
                            }
                        }
                    };
                    /**
                     * Reset Zoom.
                     */
                    UserInterface.prototype.resetZoom = function () {
                        this.canvas.resetZoom();
                    };
                    /**
                     * Calls original kartwars.io onkeyup function + whatever is under it.
                     * Useful stuff: http://keycode.info/
                     * @param e
                     */
                    UserInterface.prototype.onKeyUp = function (e) {
                        this.originalEvents.onKeyUp(e);
                        if (this.gameWrapper.util.isPlaying) {
                            // `Ctrl + B` to toggle bot
                            if (e.ctrlKey && e.keyCode === 66 && (!e.shiftKey && !e.altKey)) {
                                this.bot.isBotEnabled = !this.bot.isBotEnabled;
                                this.gameWrapper.input.canvas.forceClear();
                            }
                        }
                    };
                    /**
                     * Mouse Move event overrider.
                     * @param e
                     */
                    UserInterface.prototype.onMouseMove = function (e) {
                        if (this.bot.isBotInGame()) {
                            //
                        }
                        else {
                            this.originalEvents.onMouseMove(e);
                        }
                    };
                    /**
                     * Mouse Down event overrider.
                     * @param e
                     */
                    UserInterface.prototype.onMouseDown = function (e) {
                        var triggerChainedEvent = false;
                        if (this.contextMenu.isActive) {
                            return;
                        }
                        if (this.bot.isBotInGame()) {
                            switch (e.buttons) {
                                // "Left click" to manually trigger weapon
                                case 1:
                                    {
                                        triggerChainedEvent = true;
                                    }
                                    break;
                                // "Right click" to manually speed up the kart
                                case 2:
                                    {
                                        //window.mainCar.isAccelerating = true;
                                        this.bot.defaultAccel = 1; // TODO : Review
                                        triggerChainedEvent = true;
                                    }
                                    break;
                            }
                        }
                        if (triggerChainedEvent) {
                            this.originalEvents.onMouseDown(e);
                        }
                        this.onPrefChange();
                    };
                    /**
                     * Mouse Up event overrider.
                     * @param e
                     */
                    UserInterface.prototype.onMouseUp = function (e) {
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
                    };
                    /**
                     * Update stats overlay.
                     */
                    UserInterface.prototype.updateStats = function () {
                        var oContent = [];
                        var median;
                        if (this.bot.scores.length === 0)
                            return;
                        median = Math.round((this.bot.scores[Math.floor((this.bot.scores.length - 1) / 2)] +
                            this.bot.scores[Math.ceil((this.bot.scores.length - 1) / 2)]) / 2);
                        oContent.push('games played: ' + this.bot.scores.length);
                        oContent.push('a: ' + Math.round(this.bot.scores.reduce(function (a, b) { return a + b; }) / (this.bot.scores.length)) + ' m: ' + median);
                        for (var i = 0; i < this.bot.scores.length && i < 10; i++) {
                            oContent.push(i + 1 + '. ' + this.bot.scores[i]);
                        }
                        this.overlays.statsOverlay.innerHTML = oContent.join('<br/>');
                    };
                    /**
                     * Update stats overlay.
                     */
                    UserInterface.prototype.updateStatsEx = function () {
                        var oContent = [];
                        oContent.push('Frames:');
                        oContent.push('');
                        var frames = window.botFactory.clock.getFrames();
                        window.botFactory.clock.clearFrames();
                        for (var frameIdx in frames) {
                            oContent.push(frameIdx + ": " + frames[frameIdx] + "ms");
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
                    };
                    /**
                     * Set static display options.
                     */
                    UserInterface.prototype.onPrefChange = function () {
                        var oContent = [];
                        var ht = this.handleTextColor;
                        oContent.push('Game version: ' + window.version);
                        oContent.push('Bot version: ' + window.GM_info.script.version);
                        oContent.push('[Ctrl + B]    : Toggle bot');
                        oContent.push('[Mouse Wheel] : Zoom');
                        this.overlays.prefOverlay.innerHTML = oContent.join('<br/>');
                    };
                    /**
                     * Game status overlay.
                     */
                    UserInterface.prototype.onFrameUpdate = function () {
                        if (this.gameWrapper.util.isPlaying) {
                            var oContent = [];
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
                    };
                    /**
                     * Original Game Update.
                     * @param time
                     */
                    UserInterface.prototype.originalGameUpdate = function (time) {
                        window.botFactory.clock.startFrame();
                        //this.stats.update();
                        window.game.update(time);
                        window.botFactory.clock.endFrame();
                    };
                    /**
                     * Bot Game Update Overrider.
                     * @param time
                     */
                    UserInterface.prototype.gameUpdate = function (time) {
                        window.botFactory.clock.startFrame();
                        this.canvas.maintainZoom();
                        if (!this.bot.isBotInGame()) {
                            this.gameWrapper.input.canvas.forceClear();
                            this.originalGameUpdate(time);
                            return;
                        }
                        var start = Date.now();
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
                    };
                    /**
                     * Looper.
                     * @param time
                     */
                    UserInterface.prototype.updateRequestAnimationFrame = function (time) {
                        window.game.raf.isRunning && (this.gameUpdate(Math.floor(time)),
                            window.game.raf._timeOutID = window.requestAnimationFrame(window.game.raf._onLoop));
                    };
                    /**
                     * Quit to menu.
                     */
                    UserInterface.prototype.quit = function () {
                        // TODO : Close socket before calling `reiniciar`.
                        if (this.bot.isBotInGame()) {
                            window.esto.reiniciar();
                        }
                    };
                    UserInterface.prototype.handleTextColor = function (enabled) {
                        return '<span style=\"color:' + (enabled ? 'green;\">enabled' : 'red;\">disabled') + '</span>';
                    };
                    return UserInterface;
                }());
                __decorate([
                    KartwarsBot.MethodDecoration.bound
                ], UserInterface.prototype, "onResize", null);
                __decorate([
                    KartwarsBot.MethodDecoration.bound
                ], UserInterface.prototype, "bindToPlayButton", null);
                __decorate([
                    KartwarsBot.MethodDecoration.bound
                ], UserInterface.prototype, "onPlayerDeath", null);
                __decorate([
                    KartwarsBot.MethodDecoration.bound
                ], UserInterface.prototype, "onGameReadyDelegate", null);
                __decorate([
                    KartwarsBot.MethodDecoration.bound
                ], UserInterface.prototype, "playButtonClickListener", null);
                __decorate([
                    KartwarsBot.MethodDecoration.bound
                ], UserInterface.prototype, "hideTop", null);
                __decorate([
                    KartwarsBot.MethodDecoration.bound
                ], UserInterface.prototype, "onKeyUp", null);
                __decorate([
                    KartwarsBot.MethodDecoration.bound
                ], UserInterface.prototype, "onMouseMove", null);
                __decorate([
                    KartwarsBot.MethodDecoration.bound
                ], UserInterface.prototype, "onMouseDown", null);
                __decorate([
                    KartwarsBot.MethodDecoration.bound
                ], UserInterface.prototype, "onMouseUp", null);
                __decorate([
                    KartwarsBot.MethodDecoration.bound
                ], UserInterface.prototype, "updateStats", null);
                __decorate([
                    KartwarsBot.MethodDecoration.bound
                ], UserInterface.prototype, "onPrefChange", null);
                __decorate([
                    KartwarsBot.MethodDecoration.bound
                ], UserInterface.prototype, "onFrameUpdate", null);
                __decorate([
                    KartwarsBot.MethodDecoration.bound
                ], UserInterface.prototype, "originalGameUpdate", null);
                __decorate([
                    KartwarsBot.MethodDecoration.bound
                ], UserInterface.prototype, "gameUpdate", null);
                __decorate([
                    KartwarsBot.MethodDecoration.bound
                ], UserInterface.prototype, "updateRequestAnimationFrame", null);
                Interface.UserInterface = UserInterface;
            })(Interface = Utils.Interface || (Utils.Interface = {}));
        })(Utils = KartwarsBot.Utils || (KartwarsBot.Utils = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
