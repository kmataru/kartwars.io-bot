/* tslint:disable */

namespace ReverseEngineering {
	/**
	 * Pseudorandom number generator.
	 * READ @ http://www.math.uni-bielefeld.de/~sillke/ALGORITHMS/random/marsaglia-c
	 */
	class Marsaglia {
		private c: number;
		private f: number;

		constructor(i1: number, i2?: number) {
			this.c = i1 || 362436069;
			this.f = i2 || 521288629;
		}

		public static createRandomized() {
			var d = new Date;
			return new Marsaglia(+d / 6E4 & 4294967295, +d & 4294967295);
		};

		public nextInt() {
			let c = this.c;
			let f = this.f;

			this.c = c = 36969 * (c & 65535) + (c >>> 16) & 4294967295;
			this.f = f = 18E3 * (f & 65535) + (f >>> 16) & 4294967295;

			return ((c & 65535) << 16 | f & 65535) & 4294967295;
		}

		public nextDouble() {
			let b = this.nextInt() / 4294967296;
			return 0 > b ? 1 + b : b;
		}
	}

	/**
	 * Noise functions and helpers.
	 * READ @ http://www.noisemachine.com/talk1/17b.html
	 * READ @ http://mrl.nyu.edu/~perlin/noise/
	 */
	class PerlinNoise {
		n: number;

		// static ??
		private grad3d(a, b, c, d) {
			// Convert into 12 gradient directions
			a &= 15;
			var e = 8 > a ? b : c;
			b = 4 > a ? c : 12 === a || 14 === a ? b : d;
			return (0 === (a & 1) ? e : -e) + (0 === (a & 2) ? b : -b);
		}

		private grad2d(a, b, c) {
			this.n = 0 == (a & 1) ? b : c;
			return 0 == (a & 2) ? -this.n : this.n;
		}

		private grad1d(a, b, c) {
			return b + a * (c - b);
		}

		a: Array<number> = Array(512);

		constructor(seed) {
			seed = void 0 !== seed ? new Marsaglia(seed) : Marsaglia.createRandomized();

			var m,
				a = this.a;

			for (let e = 0; 256 > e; ++e)
				a[e] = e;

			for (let e = 0; 256 > e; ++e) {
				var g = a[m = seed.nextInt() & 255];
				a[m] = a[e];
				a[e] = g
			}

			for (let e = 0; 256 > e; ++e)
				a[e + 256] = a[e];
		}

		@DracoolaArt.KartwarsBot.MethodDecoration.bound
		noise3d(c, d, e) {
			var f = Math.floor(c) & 255
				, g = Math.floor(d) & 255
				, l = Math.floor(e) & 255;
			c -= Math.floor(c);
			d -= Math.floor(d);
			e -= Math.floor(e);

			let a = this.a;

			var m = (3 - 2 * c) * c * c
				, n = (3 - 2 * d) * d * d
				, p = a[f] + g
				, u = a[p] + l
				, p = a[p + 1] + l
				, g = a[f + 1] + g
				, f = a[g] + l
				, l = a[g + 1] + l;

			var grad1d = this.grad1d;
			var grad3d = this.grad3d;

			return grad1d((3 - 2 * e) * e * e, grad1d(n, grad1d(m, grad3d(a[u], c, d, e), grad3d(a[f], c - 1, d, e)), grad1d(m, grad3d(a[p], c, d - 1, e), grad3d(a[l], c - 1, d - 1, e))), grad1d(n, grad1d(m, grad3d(a[u + 1], c, d, e - 1), grad3d(a[f + 1], c - 1, d, e - 1)), grad1d(m, grad3d(a[p + 1], c, d - 1, e - 1), grad3d(a[l + 1], c - 1, d - 1, e - 1))));
		};

		t: number;
		B: number;
		w: number;
		y: number;
		E: number;
		q: number;
		p: number;
		K: number;

		@DracoolaArt.KartwarsBot.MethodDecoration.bound
		noise2d(b, d) {
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

		@DracoolaArt.KartwarsBot.MethodDecoration.bound
		noise1d(b) {
			var c = Math.floor(b) & 255;
			b -= Math.floor(b);
			var d = b - 1;

			var grad1d = this.grad1d;

			return grad1d((3 - 2 * b) * b * b, 0 === (this.a[c] & 1) ? -b : b, 0 === (this.a[c + 1] & 1) ? -d : d);
		}
	}

	class ExtendableFloatArrayClass {
		static f = "undefined" != typeof Float32Array ? Float32Array : Array;
		static b: Object;

		@DracoolaArt.KartwarsBot.MethodDecoration.bound
		response(c) {
			c = c || {};
			ExtendableFloatArrayClass.b = {};

			for (let d in c) {
				(function (c) {
					ExtendableFloatArrayClass.b[d] = {
						get: function () {
							return this[c];
						},
						set: function (b) {
							this[c] = b;
						}
					}
				})(c[d]);
			}

			Object.defineProperties(ExtendableFloatArrayClass.f.prototype, ExtendableFloatArrayClass.b);

			return ExtendableFloatArrayClass.f;
		}
	}

	var perlinNoise = (new PerlinNoise(void 0).noise2d);
	var extendableFloatArray = (new ExtendableFloatArrayClass().response);

	class FizzyTextPrecursor {
		TWO_PI = 2 * Math.PI;

		floatArray = extendableFloatArray({
			x: 0,
			y: 1,
			r: 2,
			vx: 3,
			vy: 4
		});

		b() {
			var b = new this.floatArray(5);
			b[0] = 0;
			b[1] = 0;
			b[2] = 0;
			b[3] = 0;
			b[4] = 0;

			return b;
		}

		constructor() {
			let $this = this;

			this.floatArray.prototype["render"] = function (b) {
				b.beginPath();
				b.arc(this[0], this[1], this[2], 0, $this.TWO_PI, !1);
				b.fill()
			};

			this.floatArray.prototype["update"] = function (b: FizzyText) {
				let k: number = perlinNoise(this[0] / b.noiseScale, this[1] / b.noiseScale) * b.noiseStrength;

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
	}

	var fizzyTextPrecursor = (new FizzyTextPrecursor());

	export class FizzyText {
		domElement: HTMLCanvasElement;

		growthSpeed: number = .37;
		maxSize: number = 8;
		noiseStrength: number = 10;
		speed: number = .4;
		displayOutline: boolean = !1;
		framesRendered: number = 0;

		noiseScale = 300;
		color0 = "#00aeff";
		color1 = "#0fa954";
		color2 = "#54396e";
		color3 = "#e61d5f";

		width: number;
		height: number;

		heightHalf: number;
		fontSizeHalf: number;

		constructor(messageText: string, width: number, height: number, darken: boolean, textSize: number) {
			this._messageText = messageText;
			this.width = width;
			this.height = height;

			{
				textSize = textSize || 140;

				let a = document.createElement("canvas");
				this.textCanvasRenderingContext2D = a.getContext("2d");
				this.particlesCanvasRenderingContext2D = (this.domElement = document.createElement("canvas")).getContext("2d");

				this.domElement.width = this.width = a.width = this.width;
				this.domElement.height = this.height = a.height = this.height;

				this.Particles = [];

				this.theme = darken;

				this.textCanvasRenderingContext2D.font = this.particlesCanvasRenderingContext2D.font = "bold " + textSize + "px Helvetica, Arial, sans-serif";

				for (let a = 0; 1200 > a; a++) {
					(this.Particles as Array<any>).push(fizzyTextPrecursor.b());
				}

				this.L = this.Particles.length / 4;

				this.heightHalf = this.height / 2;
				this.fontSizeHalf = textSize / 2;
			}

			this.message = messageText;
		}

		private textCanvasRenderingContext2D: CanvasRenderingContext2D;
		private particlesCanvasRenderingContext2D: CanvasRenderingContext2D;

		private p: Uint8ClampedArray;
		private Particles: Float32Array[] | any[][];
		private L: number;

		private _theme: string;
		get theme(): boolean {
			return this._theme == "darken" ? true : false;
		}

		set theme(value: boolean) {
			this._theme = value ? "darken" : "lighter";
			this.particlesCanvasRenderingContext2D.globalCompositeOperation = this._theme;
		}

		//
		// `message` Property
		private _messageText: string;
		get message(): any {
			return this._messageText;
		}

		set message(a) {
			let tCRC2D = this.textCanvasRenderingContext2D;
			let pCRC2D = this.particlesCanvasRenderingContext2D;
			let width = this.width;
			let height = this.height;

			a = this._messageText = a;
			tCRC2D.clearRect(0, 0, width, height);
			tCRC2D.fillStyle = "#f00";
			tCRC2D.textAlign = pCRC2D.textAlign = "center";
			tCRC2D.textBaseline = pCRC2D.textBaseline = "middle";
			tCRC2D.fillText(a, width / 2, height / 2);
			this.p = tCRC2D.getImageData(0, 0, width, height).data;
		}
		// !`message` Property

		/**
		 * Called once per frame, updates the animation.
		 */
		render() {
			let pCRC2D = this.particlesCanvasRenderingContext2D;
			let width = this.width;
			let height = this.height;
			let particles = this.Particles;
			let L = this.L;

			this.framesRendered++;
			pCRC2D.clearRect(0, 0, width, height);
			this.displayOutline && (pCRC2D.globalCompositeOperation = "source-over",
				pCRC2D.strokeStyle = Marsaglia ? "#000" : "#fff",
				pCRC2D.lineWidth = 2,
				pCRC2D.strokeText(this._messageText, width / 2, height / 2),
				pCRC2D.globalCompositeOperation = this._theme);

			for (var a = 0; 4 > a; a++) {
				let C, l, A;

				for (pCRC2D.fillStyle = this["color" + a], A = L * a, l = 0; l < L; l++) {
					C = particles[l + A], C.update(this) && C.render(pCRC2D);
				}
			}
		}

		explode() {
			let particles = this.Particles;

			for (var a in particles) {
				var b = Math.random() * fizzyTextPrecursor.TWO_PI;
				particles[a][3] = 30 * Math.cos(b);
				particles[a][4] = 30 * Math.sin(b)
			}
		}

		// TODO : WIP
		play = true;

		@DracoolaArt.KartwarsBot.MethodDecoration.bound
		loop() {
			if (this.play) {
				window.requestAnimationFrame(this.loop);
				this.render();
			}
		}

		getColor(a, b) {
			return this.p[4 * (~~b * this.width + ~~a)];
		}

		insertInTo(fizzyContainer: HTMLElement) {
			fizzyContainer.appendChild(this.domElement);
		}
	}
}
