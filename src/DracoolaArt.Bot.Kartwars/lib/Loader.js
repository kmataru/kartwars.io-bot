/// <reference path="_references.ts" />
/// <reference path="Factory.ts" />
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        //window.BOT_DEBUG_SCRIPTS = false;
        /**
         * Smart Loader.
         */
        var Loader = (function () {
            function Loader(baseURL, baseScriptPath) {
                this.baseURL = baseURL;
                this.baseScriptPath = baseScriptPath;
                if (!Loader.scripts2Load) {
                    if (window.BOT_DEBUG_SCRIPTS) {
                        Loader.scripts2Load = [];
                    }
                    else {
                        // TODO : Review
                        Loader.scripts2Load = [
							baseURL + "../../build/kartwars.io-bot.min.js",
                        ];
                    }
                }
            }
            Loader.prototype.boot = function () {
                var scripts2Load = Loader.scripts2Load;
                var self = this;
                var loadRequireJs = false;
                var time = (+new Date());
                // READ @ https://www.npmjs.com/package/definitely-typed-requirejs
                function loadScriptEx() {
                    var remoteScript = document.createElement('script');
                    remoteScript.setAttribute('data-main', self.baseScriptPath + "RequireConfig.js");
                    remoteScript.src = self.baseURL + "Scripts/require.js" + '?time=' + (window.GM_info.script.version);
                    document.body.appendChild(remoteScript);
                }
                function loadScript(scriptIdx) {
                    var remoteScript = document.createElement('script');
                    remoteScript.src = scripts2Load[scriptIdx] + '?time=' + time;
                    remoteScript.onload = function () {
                        if (scriptIdx < (scripts2Load.length - 1)) {
                            setTimeout(function () {
                                loadScript(++scriptIdx);
                            }, 0);
                        }
                        else {
                            setTimeout(function () {
                                if (loadRequireJs) {
                                    loadScriptEx();
                                }
                                else {
                                    (window.botFactory = new DracoolaArt.KartwarsBot.BotFactory(self.baseURL)).boot();
                                }
                            }, 0);
                        }
                    };
                    document.body.appendChild(remoteScript);
                }
                loadScript(0);
            };
            return Loader;
        }());
        KartwarsBot.Loader = Loader;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
