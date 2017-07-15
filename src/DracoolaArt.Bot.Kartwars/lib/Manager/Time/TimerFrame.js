var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Manager;
        (function (Manager) {
            var Time;
            (function (Time) {
                var TimerFrame = (function () {
                    function TimerFrame() {
                        this.clocks = {};
                        this.elepsedTimes = {};
                    }
                    TimerFrame.getFunctionName = function () {
                        var frames = StackTrace.getSync();
                        //return frames[frames.length - 1].toString();
                        //return frames[frames.length - 1].functionName;
                        return frames[4].functionName;
                    };
                    TimerFrame.prototype.startFrame = function (groupName) {
                        var name = TimerFrame.getFunctionName();
                        if (groupName != undefined) {
                            name += " [" + groupName + "]";
                        }
                        if (this.clocks[name] == undefined) {
                            this.clocks[name] = Time.Timer.start();
                        }
                        else {
                            this.clocks[name].reset();
                        }
                        return this.clocks[name];
                    };
                    TimerFrame.prototype.endFrame = function (groupName) {
                        var name = TimerFrame.getFunctionName();
                        if (groupName != undefined) {
                            name += " [" + groupName + "]";
                        }
                        if (this.clocks[name] != undefined) {
                            this.elepsedTimes[name] = this.clocks[name].stop();
                        }
                        return this.clocks[name];
                    };
                    TimerFrame.prototype.clearFrames = function () {
                        this.elepsedTimes = [];
                    };
                    TimerFrame.prototype.getFrames = function () {
                        return this.elepsedTimes;
                    };
                    return TimerFrame;
                }());
                Time.TimerFrame = TimerFrame;
            })(Time = Manager.Time || (Manager.Time = {}));
        })(Manager = KartwarsBot.Manager || (KartwarsBot.Manager = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
