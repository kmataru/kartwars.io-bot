/* tslint:disable */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ReverseEngineering;
(function (ReverseEngineering) {
    /**
     * Pseudorandom number generator.
     * READ @ http://www.math.uni-bielefeld.de/~sillke/ALGORITHMS/random/marsaglia-c
     */
    var Marsaglia = (function () {
        function Marsaglia(i1, i2) {
            this.c = i1 || 362436069;
            this.f = i2 || 521288629;
        }
        Marsaglia.createRandomized = function () {
            var d = new Date;
            return new Marsaglia(+d / 6E4 & 4294967295, +d & 4294967295);
        };
        ;
        Marsaglia.prototype.nextInt = function () {
            var c = this.c;
            var f = this.f;
            this.c = c = 36969 * (c & 65535) + (c >>> 16) & 4294967295;
            this.f = f = 18E3 * (f & 65535) + (f >>> 16) & 4294967295;
            return ((c & 65535) << 16 | f & 65535) & 4294967295;
        };
        Marsaglia.prototype.nextDouble = function () {
            var b = this.nextInt() / 4294967296;
            return 0 > b ? 1 + b : b;
        };
        return Marsaglia;
    }());
    /**
     * Noise functions and helpers.
     * READ @ http://www.noisemachine.com/talk1/17b.html
     * READ @ http://mrl.nyu.edu/~perlin/noise/
     */
    var PerlinNoise = (function () {
        function PerlinNoise(seed) {
            this.a = Array(512);
            seed = void 0 !== seed ? new Marsaglia(seed) : Marsaglia.createRandomized();
            var m, a = this.a;
            for (var e = 0; 256 > e; ++e)
                a[e] = e;
            for (var e = 0; 256 > e; ++e) {
                var g = a[m = seed.nextInt() & 255];
                a[m] = a[e];
                a[e] = g;
            }
            for (var e = 0; 256 > e; ++e)
                a[e + 256] = a[e];
        }
        // static ??
        PerlinNoise.prototype.grad3d = function (a, b, c, d) {
            // Convert into 12 gradient directions
            a &= 15;
            var e = 8 > a ? b : c;
            b = 4 > a ? c : 12 === a || 14 === a ? b : d;
            return (0 === (a & 1) ? e : -e) + (0 === (a & 2) ? b : -b);
        };
        PerlinNoise.prototype.grad2d = function (a, b, c) {
            this.n = 0 == (a & 1) ? b : c;
            return 0 == (a & 2) ? -this.n : this.n;
        };
        PerlinNoise.prototype.grad1d = function (a, b, c) {
            return b + a * (c - b);
        };
        PerlinNoise.prototype.noise3d = function (c, d, e) {
            var f = Math.floor(c) & 255, g = Math.floor(d) & 255, l = Math.floor(e) & 255;
            c -= Math.floor(c);
            d -= Math.floor(d);
            e -= Math.floor(e);
            var a = this.a;
            var m = (3 - 2 * c) * c * c, n = (3 - 2 * d) * d * d, p = a[f] + g, u = a[p] + l, p = a[p + 1] + l, g = a[f + 1] + g, f = a[g] + l, l = a[g + 1] + l;
            var grad1d = this.grad1d;
            var grad3d = this.grad3d;
            return grad1d((3 - 2 * e) * e * e, grad1d(n, grad1d(m, grad3d(a[u], c, d, e), grad3d(a[f], c - 1, d, e)), grad1d(m, grad3d(a[p], c, d - 1, e), grad3d(a[l], c - 1, d - 1, e))), grad1d(n, grad1d(m, grad3d(a[u + 1], c, d, e - 1), grad3d(a[f + 1], c - 1, d, e - 1)), grad1d(m, grad3d(a[p + 1], c, d - 1, e - 1), grad3d(a[l + 1], c - 1, d - 1, e - 1))));
        };
        ;
        PerlinNoise.prototype.noise2d = function (b, d) {
            this.p = Math.floor(b);
            this.K = Math.floor(d);
            this.t = this.p & 255;
            this.B = this.K & 255;
            b -= this.p;
            d -= this.K;
            this.w = (3 - 2 * b) * b * b;
            this.q = (3 - 2 * d) * d * d;
            this.y = this.a[this.t] + this.B;
            this.E = this.a[this.t + 1] + this.B;
            var grad1d = this.grad1d;
            var grad2d = this.grad2d;
            return grad1d(this.q, grad1d(this.w, grad2d(this.a[this.y], b, d), grad2d(this.a[this.E], b - 1, d)), grad1d(this.w, grad2d(this.a[this.y + 1], b, d - 1), grad2d(this.a[this.E + 1], b - 1, d - 1)));
        };
        ;
        PerlinNoise.prototype.noise1d = function (b) {
            var c = Math.floor(b) & 255;
            b -= Math.floor(b);
            var d = b - 1;
            var grad1d = this.grad1d;
            return grad1d((3 - 2 * b) * b * b, 0 === (this.a[c] & 1) ? -b : b, 0 === (this.a[c + 1] & 1) ? -d : d);
        };
        return PerlinNoise;
    }());
    __decorate([
        DracoolaArt.KartwarsBot.MethodDecoration.bound
    ], PerlinNoise.prototype, "noise3d", null);
    __decorate([
        DracoolaArt.KartwarsBot.MethodDecoration.bound
    ], PerlinNoise.prototype, "noise2d", null);
    __decorate([
        DracoolaArt.KartwarsBot.MethodDecoration.bound
    ], PerlinNoise.prototype, "noise1d", null);
    var ExtendableFloatArrayClass = (function () {
        function ExtendableFloatArrayClass() {
        }
        ExtendableFloatArrayClass.prototype.response = function (c) {
            c = c || {};
            ExtendableFloatArrayClass.b = {};
            var _loop_1 = function (d) {
                (function (c) {
                    ExtendableFloatArrayClass.b[d] = {
                        get: function () {
                            return this[c];
                        },
                        set: function (b) {
                            this[c] = b;
                        }
                    };
                })(c[d]);
            };
            for (var d in c) {
                _loop_1(d);
            }
            Object.defineProperties(ExtendableFloatArrayClass.f.prototype, ExtendableFloatArrayClass.b);
            return ExtendableFloatArrayClass.f;
        };
        return ExtendableFloatArrayClass;
    }());
    ExtendableFloatArrayClass.f = "undefined" != typeof Float32Array ? Float32Array : Array;
    __decorate([
        DracoolaArt.KartwarsBot.MethodDecoration.bound
    ], ExtendableFloatArrayClass.prototype, "response", null);
    var perlinNoise = (new PerlinNoise(void 0).noise2d);
    var extendableFloatArray = (new ExtendableFloatArrayClass().response);
    var FizzyTextPrecursor = (function () {
        function FizzyTextPrecursor() {
            this.TWO_PI = 2 * Math.PI;
            this.floatArray = extendableFloatArray({
                x: 0,
                y: 1,
                r: 2,
                vx: 3,
                vy: 4
            });
            var $this = this;
            this.floatArray.prototype["render"] = function (b) {
                b.beginPath();
                b.arc(this[0], this[1], this[2], 0, $this.TWO_PI, !1);
                b.fill();
            };
            this.floatArray.prototype["update"] = function (b) {
                var k = perlinNoise(this[0] / b.noiseScale, this[1] / b.noiseScale) * b.noiseStrength;
                0 < b.getColor(this[0], this[1]) ? this[2] += b.growthSpeed : this[2] -= b.growthSpeed;
                this[3] *= .8;
                this[4] *= .8;
                this[0] += Math.cos(k) * b.speed + this[3];
                this[1] -= Math.sin(k) * b.speed + this[4];
                if (this[2] > b.maxSize) {
                    this[2] = b.maxSize;
                }
                else if (0 > this[2]) {
                    return this[2] = 0,
                        this[0] = Math.random() * b.width,
                        this[1] = b.heightHalf + (2 * Math.random() - 1) * b.fontSizeHalf,
                        !1;
                }
                return !0;
            };
        }
        FizzyTextPrecursor.prototype.b = function () {
            var b = new this.floatArray(5);
            b[0] = 0;
            b[1] = 0;
            b[2] = 0;
            b[3] = 0;
            b[4] = 0;
            return b;
        };
        return FizzyTextPrecursor;
    }());
    var fizzyTextPrecursor = (new FizzyTextPrecursor());
    var FizzyText = (function () {
        function FizzyText(messageText, width, height, darken, textSize) {
            this.growthSpeed = .37;
            this.maxSize = 8;
            this.noiseStrength = 10;
            this.speed = .4;
            this.displayOutline = !1;
            this.framesRendered = 0;
            this.noiseScale = 300;
            this.color0 = "#00aeff";
            this.color1 = "#0fa954";
            this.color2 = "#54396e";
            this.color3 = "#e61d5f";
            // TODO : WIP
            this.play = true;
            this._messageText = messageText;
            this.width = width;
            this.height = height;
            {
                textSize = textSize || 140;
                var a = document.createElement("canvas");
                this.textCanvasRenderingContext2D = a.getContext("2d");
                this.particlesCanvasRenderingContext2D = (this.domElement = document.createElement("canvas")).getContext("2d");
                this.domElement.width = this.width = a.width = this.width;
                this.domElement.height = this.height = a.height = this.height;
                this.Particles = [];
                this.theme = darken;
                this.textCanvasRenderingContext2D.font = this.particlesCanvasRenderingContext2D.font = "bold " + textSize + "px Helvetica, Arial, sans-serif";
                for (var a_1 = 0; 1200 > a_1; a_1++) {
                    this.Particles.push(fizzyTextPrecursor.b());
                }
                this.L = this.Particles.length / 4;
                this.heightHalf = this.height / 2;
                this.fontSizeHalf = textSize / 2;
            }
            this.message = messageText;
        }
        Object.defineProperty(FizzyText.prototype, "theme", {
            get: function () {
                return this._theme == "darken" ? true : false;
            },
            set: function (value) {
                this._theme = value ? "darken" : "lighter";
                this.particlesCanvasRenderingContext2D.globalCompositeOperation = this._theme;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FizzyText.prototype, "message", {
            get: function () {
                return this._messageText;
            },
            set: function (a) {
                var tCRC2D = this.textCanvasRenderingContext2D;
                var pCRC2D = this.particlesCanvasRenderingContext2D;
                var width = this.width;
                var height = this.height;
                a = this._messageText = a;
                tCRC2D.clearRect(0, 0, width, height);
                tCRC2D.fillStyle = "#f00";
                tCRC2D.textAlign = pCRC2D.textAlign = "center";
                tCRC2D.textBaseline = pCRC2D.textBaseline = "middle";
                tCRC2D.fillText(a, width / 2, height / 2);
                this.p = tCRC2D.getImageData(0, 0, width, height).data;
            },
            enumerable: true,
            configurable: true
        });
        // !`message` Property
        /**
         * Called once per frame, updates the animation.
         */
        FizzyText.prototype.render = function () {
            var pCRC2D = this.particlesCanvasRenderingContext2D;
            var width = this.width;
            var height = this.height;
            var particles = this.Particles;
            var L = this.L;
            this.framesRendered++;
            pCRC2D.clearRect(0, 0, width, height);
            this.displayOutline && (pCRC2D.globalCompositeOperation = "source-over",
                pCRC2D.strokeStyle = Marsaglia ? "#000" : "#fff",
                pCRC2D.lineWidth = 2,
                pCRC2D.strokeText(this._messageText, width / 2, height / 2),
                pCRC2D.globalCompositeOperation = this._theme);
            for (var a = 0; 4 > a; a++) {
                var C = void 0, l = void 0, A = void 0;
                for (pCRC2D.fillStyle = this["color" + a], A = L * a, l = 0; l < L; l++) {
                    C = particles[l + A], C.update(this) && C.render(pCRC2D);
                }
            }
        };
        FizzyText.prototype.explode = function () {
            var particles = this.Particles;
            for (var a in particles) {
                var b = Math.random() * fizzyTextPrecursor.TWO_PI;
                particles[a][3] = 30 * Math.cos(b);
                particles[a][4] = 30 * Math.sin(b);
            }
        };
        FizzyText.prototype.loop = function () {
            if (this.play) {
                window.requestAnimationFrame(this.loop);
                this.render();
            }
        };
        FizzyText.prototype.getColor = function (a, b) {
            return this.p[4 * (~~b * this.width + ~~a)];
        };
        FizzyText.prototype.insertInTo = function (fizzyContainer) {
            fizzyContainer.appendChild(this.domElement);
        };
        return FizzyText;
    }());
    __decorate([
        DracoolaArt.KartwarsBot.MethodDecoration.bound
    ], FizzyText.prototype, "loop", null);
    ReverseEngineering.FizzyText = FizzyText;
})(ReverseEngineering || (ReverseEngineering = {}));
