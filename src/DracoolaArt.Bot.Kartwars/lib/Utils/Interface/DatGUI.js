var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Utils;
        (function (Utils) {
            var Interface;
            (function (Interface) {
                var DatGuiThemes;
                (function (DatGuiThemes) {
                    DatGuiThemes[DatGuiThemes["Default"] = 0] = "Default";
                    DatGuiThemes[DatGuiThemes["Lighter"] = 1] = "Lighter";
                })(DatGuiThemes = Interface.DatGuiThemes || (Interface.DatGuiThemes = {}));
                /**
                 * dat.GUI Wrapper.
                 */
                var DatGUI = (function () {
                    function DatGUI() {
                        this._selectedTheme = DatGuiThemes.Default;
                        //
                        // Change position of existing elements
                        $('.best-users').css('right', 'calc(300px - 10px)');
                        $('#hud').css('left', 'initial').css('right', 'calc(300px - 10px)');
                        //
                        var gui = this.gui = new dat.GUI();
                        var guiDomParentElement = this.guiDomParentElement = gui.domElement.parentElement;
                        $(guiDomParentElement)
                            .css('z-index', '1000')
                            .mouseenter(function () {
                            $(this).data('isInside', true);
                        })
                            .mouseleave(function () {
                            $(this).data('isInside', false);
                        });
                    }
                    Object.defineProperty(DatGUI.prototype, "selectedTheme", {
                        get: function () {
                            this.checkTheme();
                            return this._selectedTheme;
                        },
                        set: function (value) {
                            this._selectedTheme = value;
                            this.checkTheme();
                        },
                        enumerable: true,
                        configurable: true
                    });
                    DatGUI.prototype.checkTheme = function () {
                        var jDatGuiElement = $(this.guiDomParentElement);
                        if (this._selectedTheme == DatGuiThemes.Default) {
                            jDatGuiElement.removeClass('light-theme');
                        }
                        else {
                            jDatGuiElement.addClass('light-theme');
                        }
                    };
                    DatGUI.prototype.init = function (gameWrapper, canvas, userInterface, bot, developerInterface, webSocketInterface) {
                        var _this = this;
                        this.gameWrapper = gameWrapper;
                        this.canvas = canvas;
                        this.userInterface = userInterface;
                        this.bot = bot;
                        this.developerInterface = developerInterface;
                        this.webSocketInterface = webSocketInterface;
                        var gui = this.gui;
                        {
                            var baseControlsOptions = gui.addFolder('Actions');
                            baseControlsOptions.open();
                            gui.remember(this);
                            gui.remember(bot);
                            gui.remember(bot.opt);
                            /* tslint:disable:object-literal-sort-keys */
                            var datGuiThemesConstrains = {
                                'Darker': DatGuiThemes.Default,
                                'Lighter': DatGuiThemes.Lighter,
                            };
                            var strategiesConstrains = {
                                'Default': KartwarsBot.Strategy.Strategies.Default,
                                'Calculate Torque': KartwarsBot.Strategy.Strategies.CalculateTorque,
                                'Basic Pursuit': KartwarsBot.Strategy.Strategies.BasicPursuit,
                                'Pursuit & Shoot': KartwarsBot.Strategy.Strategies.PursuitAndShoot,
                                'Draw Enemies': KartwarsBot.Strategy.Strategies.DrawEnemies,
                                'Interconnect Food': KartwarsBot.Strategy.Strategies.InterconnectFood,
                            };
                            var collisionManagersConstrains = {
                                'Default': KartwarsBot.Manager.Collision.Managers.Default,
                                'Advanced': KartwarsBot.Manager.Collision.Managers.Advanced,
                            };
                            /* tslint:enable:object-literal-sort-keys */
                            baseControlsOptions.add(this, KartwarsBot.nameof(function () { return _this.selectedTheme; }), datGuiThemesConstrains).name('GUI Theme');
                            baseControlsOptions.add(bot, KartwarsBot.nameof(function () { return bot.isBotEnabled; })).name('Enable Bot');
                            baseControlsOptions.add(bot, KartwarsBot.nameof(function () { return bot.selectedStrategy; }), strategiesConstrains).name('Strategy');
                            baseControlsOptions.add(bot, KartwarsBot.nameof(function () { return bot.selectedCollisionManager; }), collisionManagersConstrains).name('Collision Manager');
                            baseControlsOptions.add(bot.opt, KartwarsBot.nameof(function () { return bot.opt.autoRespawn; })).name('Auto Respawn');
                            baseControlsOptions.add(userInterface, KartwarsBot.nameof(function () { return userInterface.toggleOverlays; })).name('Toggle Overlays');
                            baseControlsOptions.add(userInterface, KartwarsBot.nameof(function () { return userInterface.resetZoom; })).name('Reset Zoom');
                            baseControlsOptions.add(userInterface, KartwarsBot.nameof(function () { return userInterface.quit; })).name('Quit');
                        }
                        // Important !!
                        var forcedatGUIInitialization = bot.Strategy;
                        {
                            var debuggingOptions = gui.addFolder('Debugging');
                            debuggingOptions.open();
                            gui.remember(developerInterface.opt);
                            gui.remember(developerInterface.opt.individual);
                            debuggingOptions.add(developerInterface.opt, KartwarsBot.nameof(function () { return developerInterface.opt.logDebugging; }));
                            {
                                var debuggingIndividualOptions = debuggingOptions.addFolder('Individual');
                                debuggingIndividualOptions.open();
                                debuggingIndividualOptions.add(developerInterface.opt.individual, KartwarsBot.nameof(function () { return developerInterface.opt.individual.stageChange; })).name('State');
                                debuggingIndividualOptions.add(developerInterface.opt.individual, KartwarsBot.nameof(function () { return developerInterface.opt.individual.playerAliveChange; })).name('Player alive');
                                debuggingIndividualOptions.add(developerInterface.opt.individual, KartwarsBot.nameof(function () { return developerInterface.opt.individual.chaseNewEnemy; })).name('Chase new Enemy');
                                debuggingIndividualOptions.add(developerInterface.opt.individual, KartwarsBot.nameof(function () { return developerInterface.opt.individual.scoreTable; })).name('Score');
                                debuggingIndividualOptions.add(developerInterface.opt.individual, KartwarsBot.nameof(function () { return developerInterface.opt.individual.experimentalContextMenu; })).name('Context Menu');
                                debuggingIndividualOptions.add(developerInterface.opt.individual, KartwarsBot.nameof(function () { return developerInterface.opt.individual.acceleration; })).name('Acceleration');
                            }
                        }
                        {
                            var visualDebuggingOptions = gui.addFolder('Visual Debugging');
                            visualDebuggingOptions.open();
                            gui.remember(canvas.opt);
                            gui.remember(canvas.opt.draw);
                            gui.remember(canvas.opt.colors);
                            visualDebuggingOptions.add(canvas.opt, KartwarsBot.nameof(function () { return canvas.opt.visualDebugging; }));
                            visualDebuggingOptions.add(canvas.opt, KartwarsBot.nameof(function () { return canvas.opt.shadowBlur; })).name('Shadow Blur');
                            {
                                var visualDebuggingIndividualOptions = visualDebuggingOptions.addFolder('Individual');
                                visualDebuggingIndividualOptions.open();
                                visualDebuggingIndividualOptions.add(canvas.opt.draw, KartwarsBot.nameof(function () { return canvas.opt.draw.player; }));
                                visualDebuggingIndividualOptions.add(canvas.opt.draw, KartwarsBot.nameof(function () { return canvas.opt.draw.dangers; }));
                                visualDebuggingIndividualOptions.add(canvas.opt.draw, KartwarsBot.nameof(function () { return canvas.opt.draw.food; }));
                            }
                            {
                                var visualDebuggingColorsOptions = visualDebuggingOptions.addFolder('Colors');
                                //visualDebuggingIndividualOptions.open();
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.goalLine; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.goalDot; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.goalCross; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.collidedPoint; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.collidedElement; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.collisionAvoidancePointA; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.collisionAvoidancePointB; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.foodCluster; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.foodClusterText; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.foodClusterLine; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.foodClusterBoundary; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.inRangeResource; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.collectableResource; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.predictionLine; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.predictionCircle; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.encircledPlayerWarning; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.encircledPlayerDanger; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.collisionElement; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.collisionLine; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.playerRadius; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.closeToImminentDangerRadius; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.playerSideDetector; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.playerHeadDetector; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.playerTailDetector; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.frontResourceGatherArc; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.frontDangerArc; }));
                                visualDebuggingColorsOptions.add(canvas.opt.colors, KartwarsBot.nameof(function () { return canvas.opt.colors.tailDangerArc; }));
                            }
                        }
                    };
                    return DatGUI;
                }());
                Interface.DatGUI = DatGUI;
            })(Interface = Utils.Interface || (Utils.Interface = {}));
        })(Utils = KartwarsBot.Utils || (KartwarsBot.Utils = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
