var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Manager;
        (function (Manager) {
            var Time;
            (function (Time) {
                var Timer = (function () {
                    function Timer() {
                        this.reset();
                    }
                    Object.defineProperty(Timer.prototype, "ElepsedTime", {
                        get: function () {
                            return this.isStopped ? this.elepsedTime : ((+new Date()) - this.lastTime);
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Timer.start = function () {
                        return new Timer();
                    };
                    Timer.prototype.reset = function () {
                        this.isStopped = false;
                        this.lastTime = (+new Date());
                    };
                    Timer.prototype.stop = function () {
                        this.elepsedTime = this.ElepsedTime;
                        this.isStopped = true;
                        return this.elepsedTime;
                    };
                    return Timer;
                }());
                Time.Timer = Timer;
            })(Time = Manager.Time || (Manager.Time = {}));
        })(Manager = KartwarsBot.Manager || (KartwarsBot.Manager = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
