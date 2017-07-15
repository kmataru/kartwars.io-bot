var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        /**
         * Default Bot Factory.
         */
        var BotFactory = (function () {
            function BotFactory() {
                this.isInitialized = false;
                var datGUI = this.datGUI = new KartwarsBot.Utils.Interface.DatGUI();
                var gameWrapper = this.gameWrapper = new KartwarsBot.GameWrapper();
                var canvas = this.canvas = new KartwarsBot.Utils.CanvasUtils(gameWrapper);
                var bot = this.bot = new KartwarsBot.Bot(gameWrapper, canvas, datGUI);
                var contextMenu = this.contextMenu = new KartwarsBot.Utils.Interface.ContextMenu();
                var userInterface = this.userInterface = new KartwarsBot.Utils.Interface.UserInterface(gameWrapper, contextMenu, canvas, bot);
                var developerInterface = this.developerInterface = new KartwarsBot.Utils.Interface.DeveloperInterface(gameWrapper, bot, userInterface);
                var adsInterface = this.adsInterface = new KartwarsBot.Utils.Interface.AdsInterface();
                var webSocketInterface = this.webSocketInterface = new KartwarsBot.WebSocketInterface();
                var clock = this.clock = new KartwarsBot.Manager.Time.TimerFrame();
                var externalGraph = this.externalGraph = new KartwarsBot.ExternalGraph();
                datGUI.init(gameWrapper, canvas, userInterface, bot, developerInterface, webSocketInterface);
                contextMenu.init(gameWrapper, canvas, userInterface, bot, developerInterface, webSocketInterface);
            }
            BotFactory.prototype.boot = function () {
                var gameWrapper = this.gameWrapper;
                var canvas = this.canvas;
                var bot = this.bot;
                var contextMenu = this.contextMenu;
                var userInterface = this.userInterface;
                var developerInterface = this.developerInterface;
                var webSocketInterface = this.webSocketInterface;
                var externalGraph = this.externalGraph;
                var datGUI = this.datGUI;
                //
                window.autobotSayHello();
                var gameReadyDelegate = function () {
                    userInterface.onGameReadyDelegate();
                    developerInterface.onGameReadyDelegate();
                    webSocketInterface.onGameReadyDelegate();
                    if (this.isInitialized) {
                        return;
                    }
                    userInterface.boot();
                    developerInterface.boot();
                    // Very important as we don't need to boot up multiple times the same controller as it messes up with the events
                    this.isInitialized = true;
                };
                document.addEventListener('gameReady', gameReadyDelegate);
                $('#play-btn').removeClass('btn-none').addClass('btn-show');
            };
            return BotFactory;
        }());
        KartwarsBot.BotFactory = BotFactory;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
