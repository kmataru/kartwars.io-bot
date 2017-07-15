function improvedNoise() {
    function f(d, b) {
        var c = d || 362436069, f = b || 521288629, e = function () {
            c = 36969 * (c & 65535) + (c >>> 16) & 4294967295;
            f = 18E3 * (f & 65535) + (f >>> 16) & 4294967295;
            return ((c & 65535) << 16 | f & 65535) & 4294967295;
        };
        this.nextDouble = function () {
            var b = e() / 4294967296;
            return 0 > b ? 1 + b : b;
        };
        this.nextInt = e;
    }
    ;
    f.createRandomized = function () {
        var d = new Date;
        return new f(d / 6E4 & 4294967295, d & 4294967295);
    };
    return (new function (d) {
        function b(a, b, c, d) {
            a &= 15;
            var e = 8 > a ? b : c;
            b = 4 > a ? c : 12 === a || 14 === a ? b : d;
            return (0 === (a & 1) ? e : -e) + (0 === (a & 2) ? b : -b);
        }
        function c(a, b, c) {
            n = 0 == (a & 1) ? b : c;
            return 0 == (a & 2) ? -n : n;
        }
        function k(a, b, c) {
            return b + a * (c - b);
        }
        d = void 0 !== d ? new f(d) : f.createRandomized();
        var e, m, a = Array(512);
        for (e = 0; 256 > e; ++e)
            a[e] = e;
        for (e = 0; 256 > e; ++e) {
            var g = a[m = d.nextInt() & 255];
            a[m] = a[e];
            a[e] = g;
        }
        for (e = 0; 256 > e; ++e)
            a[e + 256] = a[e];
        var n;
        this.noise3d = function (c, d, e) {
            var f = Math.floor(c) & 255, g = Math.floor(d) & 255, l = Math.floor(e) & 255;
            c -= Math.floor(c);
            d -= Math.floor(d);
            e -= Math.floor(e);
            var m = (3 - 2 * c) * c * c, n = (3 - 2 * d) * d * d, p = a[f] + g, u = a[p] + l, p = a[p + 1] + l, g = a[f + 1] + g, f = a[g] + l, l = a[g + 1] + l;
            return k((3 - 2 * e) * e * e, k(n, k(m, b(a[u], c, d, e), b(a[f], c - 1, d, e)), k(m, b(a[p], c, d - 1, e), b(a[l], c - 1, d - 1, e))), k(n, k(m, b(a[u + 1], c, d, e - 1), b(a[f + 1], c - 1, d, e - 1)), k(m, b(a[p + 1], c, d - 1, e - 1), b(a[l + 1], c - 1, d - 1, e - 1))));
        };
        var t, B, w, y, E, q, p, K;
        this.noise2d = function (b, d) {
            p = Math.floor(b);
            K = Math.floor(d);
            t = p & 255;
            B = K & 255;
            b -= p;
            d -= K;
            w = (3 - 2 * b) * b * b;
            q = (3 - 2 * d) * d * d;
            y = a[t] + B;
            E = a[t + 1] + B;
            return k(q, k(w, c(a[y], b, d), c(a[E], b - 1, d)), k(w, c(a[y + 1], b, d - 1), c(a[E + 1], b - 1, d - 1)));
        };
        this.noise1d = function (b) {
            var c = Math.floor(b) & 255;
            b -= Math.floor(b);
            var d = b - 1;
            return k((3 - 2 * b) * b * b, 0 === (a[c] & 1) ? -b : b, 0 === (a[c + 1] & 1) ? -d : d);
        };
    }(void 0)).noise2d;
}
function ExtendableFloatArray() {
    var f;
    f = "undefined" != typeof Float32Array ? Float32Array : Array;
    var d, b;
    return function (c) {
        c = c || {};
        b = {};
        for (d in c)
            (function (c) {
                b[d] = {
                    get: function () {
                        return this[c];
                    },
                    set: function (b) {
                        this[c] = b;
                    }
                };
            })(c[d]);
        Object.defineProperties(f.prototype, b);
        return f;
    };
}
function FizzyText(f, d) {
    function b() {
        var b = new e(5);
        b[0] = 0;
        b[1] = 0;
        b[2] = 0;
        b[3] = 0;
        b[4] = 0;
        return b;
    }
    var c = 2 * Math.PI, k, e = d({
        x: 0,
        y: 1,
        r: 2,
        vx: 3,
        vy: 4
    });
    e.prototype.render = function (b) {
        b.beginPath();
        b.arc(this[0], this[1], this[2], 0, c, !1);
        b.fill();
    };
    e.prototype.update = function (b) {
        k = f(this[0] / b.noiseScale, this[1] / b.noiseScale) * b.noiseStrength;
        0 < b.getColor(this[0], this[1]) ? this[2] += b.growthSpeed : this[2] -= b.growthSpeed;
        this[3] *= .8;
        this[4] *= .8;
        this[0] += Math.cos(k) * b.speed + this[3];
        this[1] -= Math.sin(k) * b.speed + this[4];
        if (this[2] > b.maxSize)
            this[2] = b.maxSize;
        else if (0 > this[2])
            return this[2] = 0,
                this[0] = Math.random() * b.width,
                this[1] = b.height2 + (2 * Math.random() - 1) * b.fontSize2,
                !1;
        return !0;
    };
    return function (d, a, e, f, k) {
        this.growthSpeed = .37;
        this.maxSize = 8;
        this.noiseStrength = 10;
        this.speed = .4;
        this.displayOutline = !1;
        this.framesRendered = 0;
        Object.defineProperty(this, "message", {
            get: function () {
                return d;
            },
            set: function (a) {
                a = d = a;
                t.clearRect(0, 0, n, m);
                t.fillStyle = "#f00";
                t.textAlign = q.textAlign = "center";
                t.textBaseline = q.textBaseline = "middle";
                t.fillText(a, n / 2, m / 2);
                p = t.getImageData(0, 0, n, m).data;
            }
        });
        this.explode = function () {
            for (var a in K) {
                var b = Math.random() * c;
                K[a][3] = 30 * Math.cos(b);
                K[a][4] = 30 * Math.sin(b);
            }
        };
        var g = this, n = a, m = e;
        k = k || 140;
        this.noiseScale = 300;
        this.color0 = "#00aeff";
        this.color1 = "#0fa954";
        this.color2 = "#54396e";
        this.color3 = "#e61d5f";
        a = document.createElement("canvas");
        var t = a.getContext("2d"), q = (this.domElement = document.createElement("canvas")).getContext("2d");
        this.domElement.width = this.width = a.width = n;
        this.domElement.height = this.height = a.height = m;
        var p = [], K = [], H = f ? "darker" : "lighter";
        t.font = q.font = "bold " + k + "px Helvetica, Arial, sans-serif";
        q.globalCompositeOperation = H;
        for (a = 0; 1200 > a; a++)
            K.push(b());
        var C, l, A, L = K.length / 4;
        this.height2 = m / 2;
        this.fontSize2 = k / 2;
        this.render = function () {
            g.framesRendered++;
            q.clearRect(0, 0, n, m);
            g.displayOutline && (q.globalCompositeOperation = "source-over",
                q.strokeStyle = f ? "#000" : "#fff",
                q.lineWidth = 2,
                q.strokeText(d, n / 2, m / 2),
                q.globalCompositeOperation = H);
            for (var a = 0; 4 > a; a++)
                for (q.fillStyle = this["color" + a],
                    A = L * a,
                    l = 0; l < L; l++)
                    C = K[l + A],
                        C.update(this) && C.render(q);
        };
        // TODO : WIP
        this.play = true;
        var $this = this;
        this.loop = function () {
            if ($this.play) {
                window.requestAnimationFrame($this.loop);
                $this.render();
            }
        };
        this.getColor = function (a, b) {
            return p[4 * (~~b * n + ~~a)];
        };
        this.message = d;
    };
}
function FizzyTextWrapper(text, w, h, a, b) {
    var f = improvedNoise();
    var d = ExtendableFloatArray();
    var k = FizzyText(f, d);
    //var a = new k("dat.gui", 600, 150, !0, 100);
    var a = new k(text, w, h, a, b);
    return a;
}
/*
a = test();
document.getElementById('full').appendChild(a.domElement);
a.loop();
*/
