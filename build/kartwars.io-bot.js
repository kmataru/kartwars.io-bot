/* tslint:disable:max-line-length quotemark */
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var MethodDecoration;
        (function (MethodDecoration) {
            /**
             * Binds an instance method to the containing class to persist the lexical scope of 'this'.
             * @param target The target class or prototype; used by the TypeScript compiler (omit function call brackets to use as a decorator).
             * @param propKey The property key of the target method; used by the TypeScript compiler (omit function call brackets to use as a decorator).
             */
            function bound(target, propKey) {
                var originalMethod = target[propKey];
                // Ensure the above type-assertion is valid at runtime.
                if (typeof originalMethod !== "function") {
                    throw new TypeError("@bound can only be used on methods.");
                }
                if (typeof target === "function") {
                    // Static method, bind to class (if target is of type "function", the method decorator was used on a static method).
                    return {
                        value: function () {
                            return originalMethod.apply(target, arguments);
                        }
                    };
                }
                else if (typeof target === "object") {
                    // Instance method, bind to instance on first invocation (as that is the only way to access an instance from a decorator).
                    return {
                        get: function () {
                            // Create bound override on object instance. This will hide the original method on the prototype, and instead yield a bound version from the
                            // instance itself. The original method will no longer be accessible. Inside a getter, 'this' will refer to the instance.
                            var instance = this;
                            Object.defineProperty(instance, propKey.toString(), {
                                value: function () {
                                    // This is effectively a lightweight bind() that skips many (here unnecessary) checks found in native implementations.
                                    return originalMethod.apply(instance, arguments);
                                } /*,
                            configurable: true*/
                            });
                            // The first invocation (per instance) will return the bound method from here. Subsequent calls will never reach this point, due to the way
                            // JavaScript runtimes look up properties on objects; the bound method, defined on the instance, will effectively hide it.
                            return instance[propKey];
                        }
                    };
                }
            }
            MethodDecoration.bound = bound;
        })(MethodDecoration = KartwarsBot.MethodDecoration || (KartwarsBot.MethodDecoration = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

function DBSCAN(t,e,i,s){this.dataset=[],this.epsilon=1,this.minPts=2,this.distance=this._euclideanDistance,this.clusters=[],this.noise=[],this._visited=[],this._assigned=[],this._datasetLength=0,this._init(t,e,i,s)}function KMEANS(t,e,i){this.k=3,this.dataset=[],this.assignments=[],this.centroids=[],this.init(t,e,i)}function PriorityQueue(t,e,i){this._queue=[],this._priorities=[],this._sorting="desc",this._init(t,e,i)}function OPTICS(t,e,i,s){this.epsilon=1,this.minPts=1,this.distance=this._euclideanDistance,this._reachability=[],this._processed=[],this._coreDistance=0,this._orderedList=[],this._init(t,e,i,s)}function Utils(){}if(DBSCAN.prototype.run=function(t,e,i,s){this._init(t,e,i,s);for(var r=0;r<this._datasetLength;r++)if(1!==this._visited[r]){this._visited[r]=1;var n=this._regionQuery(r);if(n.length<this.minPts)this.noise.push(r);else{var o=this.clusters.length;this.clusters.push([]),this._addToCluster(r,o),this._expandCluster(o,n)}}return this.clusters},DBSCAN.prototype._init=function(t,e,i,s){if(t){if(!(t instanceof Array))throw Error("Dataset must be of type array, "+typeof t+" given");this.dataset=t,this.clusters=[],this.noise=[],this._datasetLength=t.length,this._visited=new Array(this._datasetLength),this._assigned=new Array(this._datasetLength)}e&&(this.epsilon=e),i&&(this.minPts=i),s&&(this.distance=s)},DBSCAN.prototype._expandCluster=function(t,e){for(var i=0;i<e.length;i++){var s=e[i];if(1!==this._visited[s]){this._visited[s]=1;var r=this._regionQuery(s);r.length>=this.minPts&&(e=this._mergeArrays(e,r))}1!==this._assigned[s]&&this._addToCluster(s,t)}},DBSCAN.prototype._addToCluster=function(t,e){this.clusters[e].push(t),this._assigned[t]=1},DBSCAN.prototype._regionQuery=function(t){for(var e=[],i=0;i<this._datasetLength;i++){var s=this.distance(this.dataset[t],this.dataset[i]);s<this.epsilon&&e.push(i)}return e},DBSCAN.prototype._mergeArrays=function(t,e){for(var i=e.length,s=0;i>s;s++){var r=e[s];t.indexOf(r)<0&&t.push(r)}return t},DBSCAN.prototype._euclideanDistance=function(t,e){for(var i=0,s=Math.min(t.length,e.length);s--;)i+=(t[s]-e[s])*(t[s]-e[s]);return Math.sqrt(i)},"undefined"!=typeof module&&module.exports&&(module.exports=DBSCAN),KMEANS.prototype.init=function(t,e,i){this.assignments=[],this.centroids=[],"undefined"!=typeof t&&(this.dataset=t),"undefined"!=typeof e&&(this.k=e),"undefined"!=typeof i&&(this.distance=i)},KMEANS.prototype.run=function(t,e){this.init(t,e);for(var i=this.dataset.length,s=0;s<this.k;s++)this.centroids[s]=this.randomCentroid();for(var r=!0;r;){r=this.assign();for(var n=0;n<this.k;n++){for(var o=new Array(d),h=0,a=0;d>a;a++)o[a]=0;for(var u=0;i>u;u++){var d=this.dataset[u].length;if(n===this.assignments[u]){for(var a=0;d>a;a++)o[a]+=this.dataset[u][a];h++}}if(h>0){for(var a=0;d>a;a++)o[a]/=h;this.centroids[n]=o}else this.centroids[n]=this.randomCentroid(),r=!0}}return this.getClusters()},KMEANS.prototype.randomCentroid=function(){var t,e,i=this.dataset.length-1;do e=Math.round(Math.random()*i),t=this.dataset[e];while(this.centroids.indexOf(t)>=0);return t},KMEANS.prototype.assign=function(){for(var t,e=!1,i=this.dataset.length,s=0;i>s;s++)t=this.argmin(this.dataset[s],this.centroids,this.distance),t!=this.assignments[s]&&(this.assignments[s]=t,e=!0);return e},KMEANS.prototype.getClusters=function(){for(var t,e=new Array(this.k),i=0;i<this.assignments.length;i++)t=this.assignments[i],"undefined"==typeof e[t]&&(e[t]=[]),e[t].push(i);return e},KMEANS.prototype.argmin=function(t,e,i){for(var s,r=Number.MAX_VALUE,n=0,o=e.length,h=0;o>h;h++)s=i(t,e[h]),r>s&&(r=s,n=h);return n},KMEANS.prototype.distance=function(t,e){for(var i=0,s=Math.min(t.length,e.length);s--;){var r=t[s]-e[s];i+=r*r}return Math.sqrt(i)},"undefined"!=typeof module&&module.exports&&(module.exports=KMEANS),PriorityQueue.prototype.insert=function(t,e){for(var i=this._queue.length,s=i;s--;){var r=this._priorities[s];"desc"===this._sorting?e>r&&(i=s):r>e&&(i=s)}this._insertAt(t,e,i)},PriorityQueue.prototype.remove=function(t){for(var e=this._queue.length;e--;){var i=this._queue[e];if(t===i){this._queue.splice(e,1),this._priorities.splice(e,1);break}}},PriorityQueue.prototype.forEach=function(t){this._queue.forEach(t)},PriorityQueue.prototype.getElements=function(){return this._queue},PriorityQueue.prototype.getElementPriority=function(t){return this._priorities[t]},PriorityQueue.prototype.getPriorities=function(){return this._priorities},PriorityQueue.prototype.getElementsWithPriorities=function(){for(var t=[],e=0,i=this._queue.length;i>e;e++)t.push([this._queue[e],this._priorities[e]]);return t},PriorityQueue.prototype._init=function(t,e,i){if(t&&e){if(this._queue=[],this._priorities=[],t.length!==e.length)throw new Error("Arrays must have the same length");for(var s=0;s<t.length;s++)this.insert(t[s],e[s])}i&&(this._sorting=i)},PriorityQueue.prototype._insertAt=function(t,e,i){this._queue.length===i?(this._queue.push(t),this._priorities.push(e)):(this._queue.splice(i,0,t),this._priorities.splice(i,0,e))},"undefined"!=typeof module&&module.exports&&(module.exports=PriorityQueue),"undefined"!=typeof module&&module.exports)var PriorityQueue=require("./PriorityQueue.js");OPTICS.prototype.run=function(t,e,i,s){this._init(t,e,i,s);for(var r=0,n=this.dataset.length;n>r;r++)if(1!==this._processed[r]){this._processed[r]=1,this.clusters.push([r]);var o=this.clusters.length-1;this._orderedList.push(r);var h=new PriorityQueue(null,null,"asc"),a=this._regionQuery(r);void 0!==this._distanceToCore(r)&&(this._updateQueue(r,a,h),this._expandCluster(o,h))}return this.clusters},OPTICS.prototype.getReachabilityPlot=function(){for(var t=[],e=0,i=this._orderedList.length;i>e;e++){var s=this._orderedList[e],r=this._reachability[s];t.push([s,r])}return t},OPTICS.prototype._init=function(t,e,i,s){if(t){if(!(t instanceof Array))throw Error("Dataset must be of type array, "+typeof t+" given");this.dataset=t,this.clusters=[],this._reachability=new Array(this.dataset.length),this._processed=new Array(this.dataset.length),this._coreDistance=0,this._orderedList=[]}e&&(this.epsilon=e),i&&(this.minPts=i),s&&(this.distance=s)},OPTICS.prototype._updateQueue=function(t,e,i){var s=this;this._coreDistance=this._distanceToCore(t),e.forEach(function(e){if(void 0===s._processed[e]){var r=s.distance(s.dataset[t],s.dataset[e]),n=Math.max(s._coreDistance,r);void 0===s._reachability[e]?(s._reachability[e]=n,i.insert(e,n)):n<s._reachability[e]&&(s._reachability[e]=n,i.remove(e),i.insert(e,n))}})},OPTICS.prototype._expandCluster=function(t,e){for(var i=e.getElements(),s=0,r=i.length;r>s;s++){var n=i[s];if(void 0===this._processed[n]){var o=this._regionQuery(n);this._processed[n]=1,this.clusters[t].push(n),this._orderedList.push(n),void 0!==this._distanceToCore(n)&&(this._updateQueue(n,o,e),this._expandCluster(t,e))}}},OPTICS.prototype._distanceToCore=function(t){for(var e=this.epsilon,i=0;e>i;i++){var s=this._regionQuery(t,i);if(s.length>=this.minPts)return i}},OPTICS.prototype._regionQuery=function(t,e){e=e||this.epsilon;for(var i=[],s=0,r=this.dataset.length;r>s;s++)this.distance(this.dataset[t],this.dataset[s])<e&&i.push(s);return i},OPTICS.prototype._euclideanDistance=function(t,e){for(var i=0,s=Math.min(t.length,e.length);s--;)i+=(t[s]-e[s])*(t[s]-e[s]);return Math.sqrt(i)},"undefined"!=typeof module&&module.exports&&(module.exports=OPTICS),KMEANS.prototype.getRandomVector=function(t){for(var e=t.length,i=[],s=0,r=0,n=0;e>n;n++){var o=t[n],h=Math.max(o.center-o.min,o.center-o.max);h>r&&(r=h)}for(var n=0;e>n;n++){var a=2*Math.random()-1;i.push(a),s+=a*a}s=Math.sqrt(s);for(var n=0;e>n;n++)i[n]/=s,i[n]*=r,i[n]+=t[n].center;return i},"undefined"!=typeof module&&module.exports&&(module.exports={DBSCAN:require("./DBSCAN.js"),KMEANS:require("./KMEANS.js"),OPTICS:require("./OPTICS.js"),PriorityQueue:require("./PriorityQueue.js")});
/*!
MIT License

Copyright (c) 2011 Max Kueng, George Crabtree
 
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:
 
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
!function(t){if("object"==typeof exports)module.exports=t();else if("function"==typeof define&&define.amd)define(t);else{var i;"undefined"!=typeof window?i=window:"undefined"!=typeof global?i=global:"undefined"!=typeof self&&(i=self),i.Victor=t()}}(function(){return function t(i,r,n){function o(s,h){if(!r[s]){if(!i[s]){var u="function"==typeof require&&require;if(!h&&u)return u(s,!0);if(e)return e(s,!0);throw new Error("Cannot find module '"+s+"'")}var p=r[s]={exports:{}};i[s][0].call(p.exports,function(t){var r=i[s][1][t];return o(r?r:t)},p,p.exports,t,i,r,n)}return r[s].exports}for(var e="function"==typeof require&&require,s=0;s<n.length;s++)o(n[s]);return o}({1:[function(t,i,r){function n(t,i){return this instanceof n?(this.x=t||0,void(this.y=i||0)):new n(t,i)}function o(t,i){return Math.floor(Math.random()*(i-t+1)+t)}function e(t){return t*h}function s(t){return t/h}r=i.exports=n,n.fromArray=function(t){return new n(t[0]||0,t[1]||0)},n.fromObject=function(t){return new n(t.x||0,t.y||0)},n.prototype.addX=function(t){return this.x+=t.x,this},n.prototype.addY=function(t){return this.y+=t.y,this},n.prototype.add=function(t){return this.x+=t.x,this.y+=t.y,this},n.prototype.addScalar=function(t){return this.x+=t,this.y+=t,this},n.prototype.addScalarX=function(t){return this.x+=t,this},n.prototype.addScalarY=function(t){return this.y+=t,this},n.prototype.subtractX=function(t){return this.x-=t.x,this},n.prototype.subtractY=function(t){return this.y-=t.y,this},n.prototype.subtract=function(t){return this.x-=t.x,this.y-=t.y,this},n.prototype.subtractScalar=function(t){return this.x-=t,this.y-=t,this},n.prototype.subtractScalarX=function(t){return this.x-=t,this},n.prototype.subtractScalarY=function(t){return this.y-=t,this},n.prototype.divideX=function(t){return this.x/=t.x,this},n.prototype.divideY=function(t){return this.y/=t.y,this},n.prototype.divide=function(t){return this.x/=t.x,this.y/=t.y,this},n.prototype.divideScalar=function(t){return 0!==t?(this.x/=t,this.y/=t):(this.x=0,this.y=0),this},n.prototype.divideScalarX=function(t){return 0!==t?this.x/=t:this.x=0,this},n.prototype.divideScalarY=function(t){return 0!==t?this.y/=t:this.y=0,this},n.prototype.invertX=function(){return this.x*=-1,this},n.prototype.invertY=function(){return this.y*=-1,this},n.prototype.invert=function(){return this.invertX(),this.invertY(),this},n.prototype.multiplyX=function(t){return this.x*=t.x,this},n.prototype.multiplyY=function(t){return this.y*=t.y,this},n.prototype.multiply=function(t){return this.x*=t.x,this.y*=t.y,this},n.prototype.multiplyScalar=function(t){return this.x*=t,this.y*=t,this},n.prototype.multiplyScalarX=function(t){return this.x*=t,this},n.prototype.multiplyScalarY=function(t){return this.y*=t,this},n.prototype.normalize=function(){var t=this.length();return 0===t?(this.x=1,this.y=0):this.divide(n(t,t)),this},n.prototype.norm=n.prototype.normalize,n.prototype.limit=function(t,i){return Math.abs(this.x)>t&&(this.x*=i),Math.abs(this.y)>t&&(this.y*=i),this},n.prototype.randomize=function(t,i){return this.randomizeX(t,i),this.randomizeY(t,i),this},n.prototype.randomizeX=function(t,i){var r=Math.min(t.x,i.x),n=Math.max(t.x,i.x);return this.x=o(r,n),this},n.prototype.randomizeY=function(t,i){var r=Math.min(t.y,i.y),n=Math.max(t.y,i.y);return this.y=o(r,n),this},n.prototype.randomizeAny=function(t,i){return Math.round(Math.random())?this.randomizeX(t,i):this.randomizeY(t,i),this},n.prototype.unfloat=function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},n.prototype.toFixed=function(t){return"undefined"==typeof t&&(t=8),this.x=this.x.toFixed(t),this.y=this.y.toFixed(t),this},n.prototype.mixX=function(t,i){return"undefined"==typeof i&&(i=.5),this.x=(1-i)*this.x+i*t.x,this},n.prototype.mixY=function(t,i){return"undefined"==typeof i&&(i=.5),this.y=(1-i)*this.y+i*t.y,this},n.prototype.mix=function(t,i){return this.mixX(t,i),this.mixY(t,i),this},n.prototype.clone=function(){return new n(this.x,this.y)},n.prototype.copyX=function(t){return this.x=t.x,this},n.prototype.copyY=function(t){return this.y=t.y,this},n.prototype.copy=function(t){return this.copyX(t),this.copyY(t),this},n.prototype.zero=function(){return this.x=this.y=0,this},n.prototype.dot=function(t){return this.x*t.x+this.y*t.y},n.prototype.cross=function(t){return this.x*t.y-this.y*t.x},n.prototype.projectOnto=function(t){var i=(this.x*t.x+this.y*t.y)/(t.x*t.x+t.y*t.y);return this.x=i*t.x,this.y=i*t.y,this},n.prototype.horizontalAngle=function(){return Math.atan2(this.y,this.x)},n.prototype.horizontalAngleDeg=function(){return e(this.horizontalAngle())},n.prototype.verticalAngle=function(){return Math.atan2(this.x,this.y)},n.prototype.verticalAngleDeg=function(){return e(this.verticalAngle())},n.prototype.angle=n.prototype.horizontalAngle,n.prototype.angleDeg=n.prototype.horizontalAngleDeg,n.prototype.direction=n.prototype.horizontalAngle,n.prototype.rotate=function(t){var i=this.x*Math.cos(t)-this.y*Math.sin(t),r=this.x*Math.sin(t)+this.y*Math.cos(t);return this.x=i,this.y=r,this},n.prototype.rotateDeg=function(t){return t=s(t),this.rotate(t)},n.prototype.rotateTo=function(t){return this.rotate(t-this.angle())},n.prototype.rotateToDeg=function(t){return t=s(t),this.rotateTo(t)},n.prototype.rotateBy=function(t){var i=this.angle()+t;return this.rotate(i)},n.prototype.rotateByDeg=function(t){return t=s(t),this.rotateBy(t)},n.prototype.distanceX=function(t){return this.x-t.x},n.prototype.absDistanceX=function(t){return Math.abs(this.distanceX(t))},n.prototype.distanceY=function(t){return this.y-t.y},n.prototype.absDistanceY=function(t){return Math.abs(this.distanceY(t))},n.prototype.distance=function(t){return Math.sqrt(this.distanceSq(t))},n.prototype.distanceSq=function(t){var i=this.distanceX(t),r=this.distanceY(t);return i*i+r*r},n.prototype.length=function(){return Math.sqrt(this.lengthSq())},n.prototype.lengthSq=function(){return this.x*this.x+this.y*this.y},n.prototype.magnitude=n.prototype.length,n.prototype.isZero=function(){return 0===this.x&&0===this.y},n.prototype.isEqualTo=function(t){return this.x===t.x&&this.y===t.y},n.prototype.toString=function(){return"x:"+this.x+", y:"+this.y},n.prototype.toArray=function(){return[this.x,this.y]},n.prototype.toObject=function(){return{x:this.x,y:this.y}};var h=180/Math.PI},{}]},{},[1])(1)});
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["dat"] = factory();
	else
		root["dat"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = {
	  color: {
	    Color: __webpack_require__(2),
	    math: __webpack_require__(6),
	    interpret: __webpack_require__(3)
	  },
	
	  controllers: {
	    Controller: __webpack_require__(7),
	    BooleanController: __webpack_require__(8),
	    OptionController: __webpack_require__(10),
	    StringController: __webpack_require__(11),
	    NumberController: __webpack_require__(12),
	    NumberControllerBox: __webpack_require__(13),
	    NumberControllerSlider: __webpack_require__(14),
	    FunctionController: __webpack_require__(20),
	    ColorController: __webpack_require__(21)
	  },
	
	  dom: {
	    dom: __webpack_require__(9)
	  },
	
	  gui: {
	    GUI: __webpack_require__(22)
	  },
	
	  GUI: __webpack_require__(22)
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _interpret = __webpack_require__(3);
	
	var _interpret2 = _interopRequireDefault(_interpret);
	
	var _math = __webpack_require__(6);
	
	var _math2 = _interopRequireDefault(_math);
	
	var _toString = __webpack_require__(4);
	
	var _toString2 = _interopRequireDefault(_toString);
	
	var _utilsCommon = __webpack_require__(5);
	
	var _utilsCommon2 = _interopRequireDefault(_utilsCommon);
	
	var Color = (function () {
	  function Color() {
	    _classCallCheck(this, Color);
	
	    this.__state = _interpret2['default'].apply(this, arguments);
	
	    if (this.__state === false) {
	      throw new Error('Failed to interpret color arguments');
	    }
	
	    this.__state.a = this.__state.a || 1;
	  }
	
	  Color.prototype.toString = function toString() {
	    return _toString2['default'](this);
	  };
	
	  Color.prototype.toOriginal = function toOriginal() {
	    return this.__state.conversion.write(this);
	  };
	
	  return Color;
	})();
	
	Color.recalculateRGB = function (color, component, componentHexIndex) {
	  if (color.__state.space === 'HEX') {
	    color.__state[component] = _math2['default'].component_from_hex(color.__state.hex, componentHexIndex);
	  } else if (color.__state.space === 'HSV') {
	    _utilsCommon2['default'].extend(color.__state, _math2['default'].hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
	  } else {
	    throw new Error('Corrupted color state');
	  }
	};
	
	Color.recalculateHSV = function (color) {
	  var result = _math2['default'].rgb_to_hsv(color.r, color.g, color.b);
	
	  _utilsCommon2['default'].extend(color.__state, {
	    s: result.s,
	    v: result.v
	  });
	
	  if (!_utilsCommon2['default'].isNaN(result.h)) {
	    color.__state.h = result.h;
	  } else if (_utilsCommon2['default'].isUndefined(color.__state.h)) {
	    color.__state.h = 0;
	  }
	};
	
	Color.COMPONENTS = ['r', 'g', 'b', 'h', 's', 'v', 'hex', 'a'];
	
	defineRGBComponent(Color.prototype, 'r', 2);
	defineRGBComponent(Color.prototype, 'g', 1);
	defineRGBComponent(Color.prototype, 'b', 0);
	
	defineHSVComponent(Color.prototype, 'h');
	defineHSVComponent(Color.prototype, 's');
	defineHSVComponent(Color.prototype, 'v');
	
	Object.defineProperty(Color.prototype, 'a', {
	  get: function get() {
	    return this.__state.a;
	  },
	
	  set: function set(v) {
	    this.__state.a = v;
	  }
	});
	
	Object.defineProperty(Color.prototype, 'hex', {
	  get: function get() {
	    if (!this.__state.space !== 'HEX') {
	      this.__state.hex = _math2['default'].rgb_to_hex(this.r, this.g, this.b);
	    }
	
	    return this.__state.hex;
	  },
	
	  set: function set(v) {
	    this.__state.space = 'HEX';
	    this.__state.hex = v;
	  }
	});
	
	function defineRGBComponent(target, component, componentHexIndex) {
	  Object.defineProperty(target, component, {
	    get: function get() {
	      if (this.__state.space === 'RGB') {
	        return this.__state[component];
	      }
	
	      Color.recalculateRGB(this, component, componentHexIndex);
	
	      return this.__state[component];
	    },
	
	    set: function set(v) {
	      if (this.__state.space !== 'RGB') {
	        Color.recalculateRGB(this, component, componentHexIndex);
	        this.__state.space = 'RGB';
	      }
	
	      this.__state[component] = v;
	    }
	  });
	}
	
	function defineHSVComponent(target, component) {
	  Object.defineProperty(target, component, {
	    get: function get() {
	      if (this.__state.space === 'HSV') {
	        return this.__state[component];
	      }
	
	      Color.recalculateHSV(this);
	
	      return this.__state[component];
	    },
	
	    set: function set(v) {
	      if (this.__state.space !== 'HSV') {
	        Color.recalculateHSV(this);
	        this.__state.space = 'HSV';
	      }
	
	      this.__state[component] = v;
	    }
	  });
	}
	
	exports['default'] = Color;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _toString = __webpack_require__(4);
	
	var _toString2 = _interopRequireDefault(_toString);
	
	var _utilsCommon = __webpack_require__(5);
	
	var _utilsCommon2 = _interopRequireDefault(_utilsCommon);
	
	var INTERPRETATIONS = [
	// Strings
	{
	  litmus: _utilsCommon2['default'].isString,
	  conversions: {
	    THREE_CHAR_HEX: {
	      read: function read(original) {
	        var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
	        if (test === null) {
	          return false;
	        }
	
	        return {
	          space: 'HEX',
	          hex: parseInt('0x' + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString(), 0)
	        };
	      },
	
	      write: _toString2['default']
	    },
	
	    SIX_CHAR_HEX: {
	      read: function read(original) {
	        var test = original.match(/^#([A-F0-9]{6})$/i);
	        if (test === null) {
	          return false;
	        }
	
	        return {
	          space: 'HEX',
	          hex: parseInt('0x' + test[1].toString(), 0)
	        };
	      },
	
	      write: _toString2['default']
	    },
	
	    CSS_RGB: {
	      read: function read(original) {
	        var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
	        if (test === null) {
	          return false;
	        }
	
	        return {
	          space: 'RGB',
	          r: parseFloat(test[1]),
	          g: parseFloat(test[2]),
	          b: parseFloat(test[3])
	        };
	      },
	
	      write: _toString2['default']
	    },
	
	    CSS_RGBA: {
	      read: function read(original) {
	        var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
	        if (test === null) {
	          return false;
	        }
	
	        return {
	          space: 'RGB',
	          r: parseFloat(test[1]),
	          g: parseFloat(test[2]),
	          b: parseFloat(test[3]),
	          a: parseFloat(test[4])
	        };
	      },
	
	      write: _toString2['default']
	    }
	  }
	},
	
	// Numbers
	{
	  litmus: _utilsCommon2['default'].isNumber,
	
	  conversions: {
	
	    HEX: {
	      read: function read(original) {
	        return {
	          space: 'HEX',
	          hex: original,
	          conversionName: 'HEX'
	        };
	      },
	
	      write: function write(color) {
	        return color.hex;
	      }
	    }
	
	  }
	
	},
	
	// Arrays
	{
	  litmus: _utilsCommon2['default'].isArray,
	  conversions: {
	    RGB_ARRAY: {
	      read: function read(original) {
	        if (original.length !== 3) {
	          return false;
	        }
	
	        return {
	          space: 'RGB',
	          r: original[0],
	          g: original[1],
	          b: original[2]
	        };
	      },
	
	      write: function write(color) {
	        return [color.r, color.g, color.b];
	      }
	    },
	
	    RGBA_ARRAY: {
	      read: function read(original) {
	        if (original.length !== 4) return false;
	        return {
	          space: 'RGB',
	          r: original[0],
	          g: original[1],
	          b: original[2],
	          a: original[3]
	        };
	      },
	
	      write: function write(color) {
	        return [color.r, color.g, color.b, color.a];
	      }
	    }
	  }
	},
	
	// Objects
	{
	  litmus: _utilsCommon2['default'].isObject,
	  conversions: {
	
	    RGBA_OBJ: {
	      read: function read(original) {
	        if (_utilsCommon2['default'].isNumber(original.r) && _utilsCommon2['default'].isNumber(original.g) && _utilsCommon2['default'].isNumber(original.b) && _utilsCommon2['default'].isNumber(original.a)) {
	          return {
	            space: 'RGB',
	            r: original.r,
	            g: original.g,
	            b: original.b,
	            a: original.a
	          };
	        }
	        return false;
	      },
	
	      write: function write(color) {
	        return {
	          r: color.r,
	          g: color.g,
	          b: color.b,
	          a: color.a
	        };
	      }
	    },
	
	    RGB_OBJ: {
	      read: function read(original) {
	        if (_utilsCommon2['default'].isNumber(original.r) && _utilsCommon2['default'].isNumber(original.g) && _utilsCommon2['default'].isNumber(original.b)) {
	          return {
	            space: 'RGB',
	            r: original.r,
	            g: original.g,
	            b: original.b
	          };
	        }
	        return false;
	      },
	
	      write: function write(color) {
	        return {
	          r: color.r,
	          g: color.g,
	          b: color.b
	        };
	      }
	    },
	
	    HSVA_OBJ: {
	      read: function read(original) {
	        if (_utilsCommon2['default'].isNumber(original.h) && _utilsCommon2['default'].isNumber(original.s) && _utilsCommon2['default'].isNumber(original.v) && _utilsCommon2['default'].isNumber(original.a)) {
	          return {
	            space: 'HSV',
	            h: original.h,
	            s: original.s,
	            v: original.v,
	            a: original.a
	          };
	        }
	        return false;
	      },
	
	      write: function write(color) {
	        return {
	          h: color.h,
	          s: color.s,
	          v: color.v,
	          a: color.a
	        };
	      }
	    },
	
	    HSV_OBJ: {
	      read: function read(original) {
	        if (_utilsCommon2['default'].isNumber(original.h) && _utilsCommon2['default'].isNumber(original.s) && _utilsCommon2['default'].isNumber(original.v)) {
	          return {
	            space: 'HSV',
	            h: original.h,
	            s: original.s,
	            v: original.v
	          };
	        }
	        return false;
	      },
	
	      write: function write(color) {
	        return {
	          h: color.h,
	          s: color.s,
	          v: color.v
	        };
	      }
	    }
	  }
	}];
	
	var result = undefined;
	var toReturn = undefined;
	
	var interpret = function interpret() {
	  toReturn = false;
	
	  var original = arguments.length > 1 ? _utilsCommon2['default'].toArray(arguments) : arguments[0];
	  _utilsCommon2['default'].each(INTERPRETATIONS, function (family) {
	    if (family.litmus(original)) {
	      _utilsCommon2['default'].each(family.conversions, function (conversion, conversionName) {
	        result = conversion.read(original);
	
	        if (toReturn === false && result !== false) {
	          toReturn = result;
	          result.conversionName = conversionName;
	          result.conversion = conversion;
	          return _utilsCommon2['default'].BREAK;
	        }
	      });
	
	      return _utilsCommon2['default'].BREAK;
	    }
	  });
	
	  return toReturn;
	};
	
	exports['default'] = interpret;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _utilsCommon = __webpack_require__(5);
	
	var _utilsCommon2 = _interopRequireDefault(_utilsCommon);
	
	exports['default'] = function (color) {
	  if (color.a === 1 || _utilsCommon2['default'].isUndefined(color.a)) {
	    var s = color.hex.toString(16);
	    while (s.length < 6) {
	      s = '0' + s;
	    }
	    return '#' + s;
	  }
	
	  return 'rgba(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ',' + color.a + ')';
	};
	
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	
	'use strict';
	
	exports.__esModule = true;
	var ARR_EACH = Array.prototype.forEach;
	var ARR_SLICE = Array.prototype.slice;
	
	/**
	 * Band-aid methods for things that should be a lot easier in JavaScript.
	 * Implementation and structure inspired by underscore.js
	 * http://documentcloud.github.com/underscore/
	 */
	
	var Common = {
	  BREAK: {},
	
	  extend: function extend(target) {
	    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
	      for (var key in obj) {
	        if (!this.isUndefined(obj[key])) {
	          target[key] = obj[key];
	        }
	      }
	    }, this);
	
	    return target;
	  },
	
	  defaults: function defaults(target) {
	    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
	      for (var key in obj) {
	        if (this.isUndefined(target[key])) {
	          target[key] = obj[key];
	        }
	      }
	    }, this);
	
	    return target;
	  },
	
	  compose: function compose() {
	    var toCall = ARR_SLICE.call(arguments);
	    return function () {
	      var args = ARR_SLICE.call(arguments);
	      for (var i = toCall.length - 1; i >= 0; i--) {
	        args = [toCall[i].apply(this, args)];
	      }
	      return args[0];
	    };
	  },
	
	  each: function each(obj, itr, scope) {
	    if (!obj) {
	      return;
	    }
	
	    if (ARR_EACH && obj.forEach && obj.forEach === ARR_EACH) {
	      obj.forEach(itr, scope);
	    } else if (obj.length === obj.length + 0) {
	      // Is number but not NaN
	      var key = undefined;
	      var l = undefined;
	      for (key = 0, l = obj.length; key < l; key++) {
	        if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) {
	          return;
	        }
	      }
	    } else {
	      for (var key in obj) {
	        if (itr.call(scope, obj[key], key) === this.BREAK) {
	          return;
	        }
	      }
	    }
	  },
	
	  defer: function defer(fnc) {
	    setTimeout(fnc, 0);
	  },
	
	  toArray: function toArray(obj) {
	    if (obj.toArray) return obj.toArray();
	    return ARR_SLICE.call(obj);
	  },
	
	  isUndefined: function isUndefined(obj) {
	    return obj === undefined;
	  },
	
	  isNull: function isNull(obj) {
	    return obj === null;
	  },
	
	  isNaN: (function (_isNaN) {
	    function isNaN(_x) {
	      return _isNaN.apply(this, arguments);
	    }
	
	    isNaN.toString = function () {
	      return _isNaN.toString();
	    };
	
	    return isNaN;
	  })(function (obj) {
	    return isNaN(obj);
	  }),
	
	  isArray: Array.isArray || function (obj) {
	    return obj.constructor === Array;
	  },
	
	  isObject: function isObject(obj) {
	    return obj === Object(obj);
	  },
	
	  isNumber: function isNumber(obj) {
	    return obj === obj + 0;
	  },
	
	  isString: function isString(obj) {
	    return obj === obj + '';
	  },
	
	  isBoolean: function isBoolean(obj) {
	    return obj === false || obj === true;
	  },
	
	  isFunction: function isFunction(obj) {
	    return Object.prototype.toString.call(obj) === '[object Function]';
	  }
	
	};
	
	exports['default'] = Common;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	
	"use strict";
	
	exports.__esModule = true;
	var tmpComponent = undefined;
	
	var ColorMath = {
	  hsv_to_rgb: function hsv_to_rgb(h, s, v) {
	    var hi = Math.floor(h / 60) % 6;
	
	    var f = h / 60 - Math.floor(h / 60);
	    var p = v * (1.0 - s);
	    var q = v * (1.0 - f * s);
	    var t = v * (1.0 - (1.0 - f) * s);
	
	    var c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][hi];
	
	    return {
	      r: c[0] * 255,
	      g: c[1] * 255,
	      b: c[2] * 255
	    };
	  },
	
	  rgb_to_hsv: function rgb_to_hsv(r, g, b) {
	    var min = Math.min(r, g, b);
	    var max = Math.max(r, g, b);
	    var delta = max - min;
	    var h = undefined;
	    var s = undefined;
	
	    if (max !== 0) {
	      s = delta / max;
	    } else {
	      return {
	        h: NaN,
	        s: 0,
	        v: 0
	      };
	    }
	
	    if (r === max) {
	      h = (g - b) / delta;
	    } else if (g === max) {
	      h = 2 + (b - r) / delta;
	    } else {
	      h = 4 + (r - g) / delta;
	    }
	    h /= 6;
	    if (h < 0) {
	      h += 1;
	    }
	
	    return {
	      h: h * 360,
	      s: s,
	      v: max / 255
	    };
	  },
	
	  rgb_to_hex: function rgb_to_hex(r, g, b) {
	    var hex = this.hex_with_component(0, 2, r);
	    hex = this.hex_with_component(hex, 1, g);
	    hex = this.hex_with_component(hex, 0, b);
	    return hex;
	  },
	
	  component_from_hex: function component_from_hex(hex, componentIndex) {
	    return hex >> componentIndex * 8 & 0xFF;
	  },
	
	  hex_with_component: function hex_with_component(hex, componentIndex, value) {
	    return value << (tmpComponent = componentIndex * 8) | hex & ~(0xFF << tmpComponent);
	  }
	};
	
	exports["default"] = ColorMath;
	module.exports = exports["default"];

/***/ },
/* 7 */
/***/ function(module, exports) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	
	/**
	 * @class An "abstract" class that represents a given property of an object.
	 *
	 * @param {Object} object The object to be manipulated
	 * @param {string} property The name of the property to be manipulated
	 *
	 * @member dat.controllers
	 */
	'use strict';
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var Controller = (function () {
	  function Controller(object, property) {
	    _classCallCheck(this, Controller);
	
	    this.initialValue = object[property];
	
	    /**
	     * Those who extend this class will put their DOM elements in here.
	     * @type {DOMElement}
	     */
	    this.domElement = document.createElement('div');
	
	    /**
	     * The object to manipulate
	     * @type {Object}
	     */
	    this.object = object;
	
	    /**
	     * The name of the property to manipulate
	     * @type {String}
	     */
	    this.property = property;
	
	    /**
	     * The function to be called on change.
	     * @type {Function}
	     * @ignore
	     */
	    this.__onChange = undefined;
	
	    /**
	     * The function to be called on finishing change.
	     * @type {Function}
	     * @ignore
	     */
	    this.__onFinishChange = undefined;
	  }
	
	  /**
	   * Specify that a function fire every time someone changes the value with
	   * this Controller.
	   *
	   * @param {Function} fnc This function will be called whenever the value
	   * is modified via this Controller.
	   * @returns {Controller} this
	   */
	
	  Controller.prototype.onChange = function onChange(fnc) {
	    this.__onChange = fnc;
	    return this;
	  };
	
	  /**
	   * Specify that a function fire every time someone "finishes" changing
	   * the value wih this Controller. Useful for values that change
	   * incrementally like numbers or strings.
	   *
	   * @param {Function} fnc This function will be called whenever
	   * someone "finishes" changing the value via this Controller.
	   * @returns {Controller} this
	   */
	
	  Controller.prototype.onFinishChange = function onFinishChange(fnc) {
	    this.__onFinishChange = fnc;
	    return this;
	  };
	
	  /**
	   * Change the value of <code>object[property]</code>
	   *
	   * @param {Object} newValue The new value of <code>object[property]</code>
	   */
	
	  Controller.prototype.setValue = function setValue(newValue) {
	    this.object[this.property] = newValue;
	    if (this.__onChange) {
	      this.__onChange.call(this, newValue);
	    }
	
	    this.updateDisplay();
	    return this;
	  };
	
	  /**
	   * Gets the value of <code>object[property]</code>
	   *
	   * @returns {Object} The current value of <code>object[property]</code>
	   */
	
	  Controller.prototype.getValue = function getValue() {
	    return this.object[this.property];
	  };
	
	  /**
	   * Refreshes the visual display of a Controller in order to keep sync
	   * with the object's current value.
	   * @returns {Controller} this
	   */
	
	  Controller.prototype.updateDisplay = function updateDisplay() {
	    return this;
	  };
	
	  /**
	   * @returns {Boolean} true if the value has deviated from initialValue
	   */
	
	  Controller.prototype.isModified = function isModified() {
	    return this.initialValue !== this.getValue();
	  };
	
	  return Controller;
	})();
	
	exports['default'] = Controller;
	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _Controller2 = __webpack_require__(7);
	
	var _Controller3 = _interopRequireDefault(_Controller2);
	
	var _domDom = __webpack_require__(9);
	
	var _domDom2 = _interopRequireDefault(_domDom);
	
	/**
	 * @class Provides a checkbox input to alter the boolean property of an object.
	 * @extends dat.controllers.Controller
	 *
	 * @param {Object} object The object to be manipulated
	 * @param {string} property The name of the property to be manipulated
	 *
	 * @member dat.controllers
	 */
	
	var BooleanController = (function (_Controller) {
	  _inherits(BooleanController, _Controller);
	
	  function BooleanController(object, property) {
	    _classCallCheck(this, BooleanController);
	
	    _Controller.call(this, object, property);
	
	    var _this = this;
	    this.__prev = this.getValue();
	
	    this.__checkbox = document.createElement('input');
	    this.__checkbox.setAttribute('type', 'checkbox');
	
	    function onChange() {
	      _this.setValue(!_this.__prev);
	    }
	
	    _domDom2['default'].bind(this.__checkbox, 'change', onChange, false);
	
	    this.domElement.appendChild(this.__checkbox);
	
	    // Match original value
	    this.updateDisplay();
	  }
	
	  BooleanController.prototype.setValue = function setValue(v) {
	    var toReturn = _Controller.prototype.setValue.call(this, v);
	    if (this.__onFinishChange) {
	      this.__onFinishChange.call(this, this.getValue());
	    }
	    this.__prev = this.getValue();
	    return toReturn;
	  };
	
	  BooleanController.prototype.updateDisplay = function updateDisplay() {
	    if (this.getValue() === true) {
	      this.__checkbox.setAttribute('checked', 'checked');
	      this.__checkbox.checked = true;
	    } else {
	      this.__checkbox.checked = false;
	    }
	
	    return _Controller.prototype.updateDisplay.call(this);
	  };
	
	  return BooleanController;
	})(_Controller3['default']);
	
	exports['default'] = BooleanController;
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _utilsCommon = __webpack_require__(5);
	
	var _utilsCommon2 = _interopRequireDefault(_utilsCommon);
	
	var EVENT_MAP = {
	  'HTMLEvents': ['change'],
	  'MouseEvents': ['click', 'mousemove', 'mousedown', 'mouseup', 'mouseover'],
	  'KeyboardEvents': ['keydown']
	};
	
	var EVENT_MAP_INV = {};
	_utilsCommon2['default'].each(EVENT_MAP, function (v, k) {
	  _utilsCommon2['default'].each(v, function (e) {
	    EVENT_MAP_INV[e] = k;
	  });
	});
	
	var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;
	
	function cssValueToPixels(val) {
	  if (val === '0' || _utilsCommon2['default'].isUndefined(val)) {
	    return 0;
	  }
	
	  var match = val.match(CSS_VALUE_PIXELS);
	
	  if (!_utilsCommon2['default'].isNull(match)) {
	    return parseFloat(match[1]);
	  }
	
	  // TODO ...ems? %?
	
	  return 0;
	}
	
	/**
	 * @namespace
	 * @member dat.dom
	 */
	var dom = {
	
	  /**
	   *
	   * @param elem
	   * @param selectable
	   */
	  makeSelectable: function makeSelectable(elem, selectable) {
	    if (elem === undefined || elem.style === undefined) return;
	
	    elem.onselectstart = selectable ? function () {
	      return false;
	    } : function () {};
	
	    elem.style.MozUserSelect = selectable ? 'auto' : 'none';
	    elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
	    elem.unselectable = selectable ? 'on' : 'off';
	  },
	
	  /**
	   *
	   * @param elem
	   * @param horizontal
	   * @param vert
	   */
	  makeFullscreen: function makeFullscreen(elem, hor, vert) {
	    var vertical = vert;
	    var horizontal = hor;
	
	    if (_utilsCommon2['default'].isUndefined(horizontal)) {
	      horizontal = true;
	    }
	
	    if (_utilsCommon2['default'].isUndefined(vertical)) {
	      vertical = true;
	    }
	
	    elem.style.position = 'absolute';
	
	    if (horizontal) {
	      elem.style.left = 0;
	      elem.style.right = 0;
	    }
	    if (vertical) {
	      elem.style.top = 0;
	      elem.style.bottom = 0;
	    }
	  },
	
	  /**
	   *
	   * @param elem
	   * @param eventType
	   * @param params
	   */
	  fakeEvent: function fakeEvent(elem, eventType, pars, aux) {
	    var params = pars || {};
	    var className = EVENT_MAP_INV[eventType];
	    if (!className) {
	      throw new Error('Event type ' + eventType + ' not supported.');
	    }
	    var evt = document.createEvent(className);
	    switch (className) {
	      case 'MouseEvents':
	        {
	          var clientX = params.x || params.clientX || 0;
	          var clientY = params.y || params.clientY || 0;
	          evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0, // screen X
	          0, // screen Y
	          clientX, // client X
	          clientY, // client Y
	          false, false, false, false, 0, null);
	          break;
	        }
	      case 'KeyboardEvents':
	        {
	          var init = evt.initKeyboardEvent || evt.initKeyEvent; // webkit || moz
	          _utilsCommon2['default'].defaults(params, {
	            cancelable: true,
	            ctrlKey: false,
	            altKey: false,
	            shiftKey: false,
	            metaKey: false,
	            keyCode: undefined,
	            charCode: undefined
	          });
	          init(eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode);
	          break;
	        }
	      default:
	        {
	          evt.initEvent(eventType, params.bubbles || false, params.cancelable || true);
	          break;
	        }
	    }
	    _utilsCommon2['default'].defaults(evt, aux);
	    elem.dispatchEvent(evt);
	  },
	
	  /**
	   *
	   * @param elem
	   * @param event
	   * @param func
	   * @param bool
	   */
	  bind: function bind(elem, event, func, newBool) {
	    var bool = newBool || false;
	    if (elem.addEventListener) {
	      elem.addEventListener(event, func, bool);
	    } else if (elem.attachEvent) {
	      elem.attachEvent('on' + event, func);
	    }
	    return dom;
	  },
	
	  /**
	   *
	   * @param elem
	   * @param event
	   * @param func
	   * @param bool
	   */
	  unbind: function unbind(elem, event, func, newBool) {
	    var bool = newBool || false;
	    if (elem.removeEventListener) {
	      elem.removeEventListener(event, func, bool);
	    } else if (elem.detachEvent) {
	      elem.detachEvent('on' + event, func);
	    }
	    return dom;
	  },
	
	  /**
	   *
	   * @param elem
	   * @param className
	   */
	  addClass: function addClass(elem, className) {
	    if (elem.className === undefined) {
	      elem.className = className;
	    } else if (elem.className !== className) {
	      var classes = elem.className.split(/ +/);
	      if (classes.indexOf(className) === -1) {
	        classes.push(className);
	        elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
	      }
	    }
	    return dom;
	  },
	
	  /**
	   *
	   * @param elem
	   * @param className
	   */
	  removeClass: function removeClass(elem, className) {
	    if (className) {
	      if (elem.className === className) {
	        elem.removeAttribute('class');
	      } else {
	        var classes = elem.className.split(/ +/);
	        var index = classes.indexOf(className);
	        if (index !== -1) {
	          classes.splice(index, 1);
	          elem.className = classes.join(' ');
	        }
	      }
	    } else {
	      elem.className = undefined;
	    }
	    return dom;
	  },
	
	  hasClass: function hasClass(elem, className) {
	    return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
	  },
	
	  /**
	   *
	   * @param elem
	   */
	  getWidth: function getWidth(elem) {
	    var style = getComputedStyle(elem);
	
	    return cssValueToPixels(style['border-left-width']) + cssValueToPixels(style['border-right-width']) + cssValueToPixels(style['padding-left']) + cssValueToPixels(style['padding-right']) + cssValueToPixels(style.width);
	  },
	
	  /**
	   *
	   * @param elem
	   */
	  getHeight: function getHeight(elem) {
	    var style = getComputedStyle(elem);
	
	    return cssValueToPixels(style['border-top-width']) + cssValueToPixels(style['border-bottom-width']) + cssValueToPixels(style['padding-top']) + cssValueToPixels(style['padding-bottom']) + cssValueToPixels(style.height);
	  },
	
	  /**
	   *
	   * @param el
	   */
	  getOffset: function getOffset(el) {
	    var elem = el;
	    var offset = { left: 0, top: 0 };
	    if (elem.offsetParent) {
	      do {
	        offset.left += elem.offsetLeft;
	        offset.top += elem.offsetTop;
	        elem = elem.offsetParent;
	      } while (elem);
	    }
	    return offset;
	  },
	
	  // http://stackoverflow.com/posts/2684561/revisions
	  /**
	   *
	   * @param elem
	   */
	  isActive: function isActive(elem) {
	    return elem === document.activeElement && (elem.type || elem.href);
	  }
	
	};
	
	exports['default'] = dom;
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _Controller2 = __webpack_require__(7);
	
	var _Controller3 = _interopRequireDefault(_Controller2);
	
	var _domDom = __webpack_require__(9);
	
	var _domDom2 = _interopRequireDefault(_domDom);
	
	var _utilsCommon = __webpack_require__(5);
	
	var _utilsCommon2 = _interopRequireDefault(_utilsCommon);
	
	/**
	 * @class Provides a select input to alter the property of an object, using a
	 * list of accepted values.
	 *
	 * @extends dat.controllers.Controller
	 *
	 * @param {Object} object The object to be manipulated
	 * @param {string} property The name of the property to be manipulated
	 * @param {Object|string[]} options A map of labels to acceptable values, or
	 * a list of acceptable string values.
	 *
	 * @member dat.controllers
	 */
	
	var OptionController = (function (_Controller) {
	  _inherits(OptionController, _Controller);
	
	  function OptionController(object, property, opts) {
	    _classCallCheck(this, OptionController);
	
	    _Controller.call(this, object, property);
	
	    var options = opts;
	
	    var _this = this;
	
	    /**
	     * The drop down menu
	     * @ignore
	     */
	    this.__select = document.createElement('select');
	
	    if (_utilsCommon2['default'].isArray(options)) {
	      (function () {
	        var map = {};
	        _utilsCommon2['default'].each(options, function (element) {
	          map[element] = element;
	        });
	        options = map;
	      })();
	    }
	
	    _utilsCommon2['default'].each(options, function (value, key) {
	      var opt = document.createElement('option');
	      opt.innerHTML = key;
	      opt.setAttribute('value', value);
	      _this.__select.appendChild(opt);
	    });
	
	    // Acknowledge original value
	    this.updateDisplay();
	
	    _domDom2['default'].bind(this.__select, 'change', function () {
	      var desiredValue = this.options[this.selectedIndex].value;
	      _this.setValue(desiredValue);
	    });
	
	    this.domElement.appendChild(this.__select);
	  }
	
	  OptionController.prototype.setValue = function setValue(v) {
	    var toReturn = _Controller.prototype.setValue.call(this, v);
	
	    if (this.__onFinishChange) {
	      this.__onFinishChange.call(this, this.getValue());
	    }
	    return toReturn;
	  };
	
	  OptionController.prototype.updateDisplay = function updateDisplay() {
	    this.__select.value = this.getValue();
	    return _Controller.prototype.updateDisplay.call(this);
	  };
	
	  return OptionController;
	})(_Controller3['default']);
	
	exports['default'] = OptionController;
	module.exports = exports['default'];

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _Controller2 = __webpack_require__(7);
	
	var _Controller3 = _interopRequireDefault(_Controller2);
	
	var _domDom = __webpack_require__(9);
	
	var _domDom2 = _interopRequireDefault(_domDom);
	
	/**
	 * @class Provides a text input to alter the string property of an object.
	 *
	 * @extends dat.controllers.Controller
	 *
	 * @param {Object} object The object to be manipulated
	 * @param {string} property The name of the property to be manipulated
	 *
	 * @member dat.controllers
	 */
	
	var StringController = (function (_Controller) {
	  _inherits(StringController, _Controller);
	
	  function StringController(object, property) {
	    _classCallCheck(this, StringController);
	
	    _Controller.call(this, object, property);
	
	    var _this = this;
	
	    this.__input = document.createElement('input');
	    this.__input.setAttribute('type', 'text');
	
	    _domDom2['default'].bind(this.__input, 'keyup', onChange);
	    _domDom2['default'].bind(this.__input, 'change', onChange);
	    _domDom2['default'].bind(this.__input, 'blur', onBlur);
	    _domDom2['default'].bind(this.__input, 'keydown', function (e) {
	      if (e.keyCode === 13) {
	        this.blur();
	      }
	    });
	
	    function onChange() {
	      _this.setValue(_this.__input.value);
	    }
	
	    function onBlur() {
	      if (_this.__onFinishChange) {
	        _this.__onFinishChange.call(_this, _this.getValue());
	      }
	    }
	
	    this.updateDisplay();
	
	    this.domElement.appendChild(this.__input);
	  }
	
	  StringController.prototype.updateDisplay = function updateDisplay() {
	    // Stops the caret from moving on account of:
	    // keyup -> setValue -> updateDisplay
	    if (!_domDom2['default'].isActive(this.__input)) {
	      this.__input.value = this.getValue();
	    }
	    return _Controller.prototype.updateDisplay.call(this);
	  };
	
	  return StringController;
	})(_Controller3['default']);
	
	exports['default'] = StringController;
	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _Controller2 = __webpack_require__(7);
	
	var _Controller3 = _interopRequireDefault(_Controller2);
	
	var _utilsCommon = __webpack_require__(5);
	
	var _utilsCommon2 = _interopRequireDefault(_utilsCommon);
	
	function numDecimals(x) {
	  var _x = x.toString();
	  if (_x.indexOf('.') > -1) {
	    return _x.length - _x.indexOf('.') - 1;
	  }
	
	  return 0;
	}
	
	/**
	 * @class Represents a given property of an object that is a number.
	 *
	 * @extends dat.controllers.Controller
	 *
	 * @param {Object} object The object to be manipulated
	 * @param {string} property The name of the property to be manipulated
	 * @param {Object} [params] Optional parameters
	 * @param {Number} [params.min] Minimum allowed value
	 * @param {Number} [params.max] Maximum allowed value
	 * @param {Number} [params.step] Increment by which to change value
	 *
	 * @member dat.controllers
	 */
	
	var NumberController = (function (_Controller) {
	  _inherits(NumberController, _Controller);
	
	  function NumberController(object, property, params) {
	    _classCallCheck(this, NumberController);
	
	    _Controller.call(this, object, property);
	
	    var _params = params || {};
	
	    this.__min = _params.min;
	    this.__max = _params.max;
	    this.__step = _params.step;
	
	    if (_utilsCommon2['default'].isUndefined(this.__step)) {
	      if (this.initialValue === 0) {
	        this.__impliedStep = 1; // What are we, psychics?
	      } else {
	          // Hey Doug, check this out.
	          this.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(this.initialValue)) / Math.LN10)) / 10;
	        }
	    } else {
	      this.__impliedStep = this.__step;
	    }
	
	    this.__precision = numDecimals(this.__impliedStep);
	  }
	
	  NumberController.prototype.setValue = function setValue(v) {
	    var _v = v;
	
	    if (this.__min !== undefined && _v < this.__min) {
	      _v = this.__min;
	    } else if (this.__max !== undefined && _v > this.__max) {
	      _v = this.__max;
	    }
	
	    if (this.__step !== undefined && _v % this.__step !== 0) {
	      _v = Math.round(_v / this.__step) * this.__step;
	    }
	
	    return _Controller.prototype.setValue.call(this, _v);
	  };
	
	  /**
	   * Specify a minimum value for <code>object[property]</code>.
	   *
	   * @param {Number} minValue The minimum value for
	   * <code>object[property]</code>
	   * @returns {dat.controllers.NumberController} this
	   */
	
	  NumberController.prototype.min = function min(v) {
	    this.__min = v;
	    return this;
	  };
	
	  /**
	   * Specify a maximum value for <code>object[property]</code>.
	   *
	   * @param {Number} maxValue The maximum value for
	   * <code>object[property]</code>
	   * @returns {dat.controllers.NumberController} this
	   */
	
	  NumberController.prototype.max = function max(v) {
	    this.__max = v;
	    return this;
	  };
	
	  /**
	   * Specify a step value that dat.controllers.NumberController
	   * increments by.
	   *
	   * @param {Number} stepValue The step value for
	   * dat.controllers.NumberController
	   * @default if minimum and maximum specified increment is 1% of the
	   * difference otherwise stepValue is 1
	   * @returns {dat.controllers.NumberController} this
	   */
	
	  NumberController.prototype.step = function step(v) {
	    this.__step = v;
	    this.__impliedStep = v;
	    this.__precision = numDecimals(v);
	    return this;
	  };
	
	  return NumberController;
	})(_Controller3['default']);
	
	exports['default'] = NumberController;
	module.exports = exports['default'];

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _NumberController2 = __webpack_require__(12);
	
	var _NumberController3 = _interopRequireDefault(_NumberController2);
	
	var _domDom = __webpack_require__(9);
	
	var _domDom2 = _interopRequireDefault(_domDom);
	
	var _utilsCommon = __webpack_require__(5);
	
	var _utilsCommon2 = _interopRequireDefault(_utilsCommon);
	
	function roundToDecimal(value, decimals) {
	  var tenTo = Math.pow(10, decimals);
	  return Math.round(value * tenTo) / tenTo;
	}
	
	/**
	 * @class Represents a given property of an object that is a number and
	 * provides an input element with which to manipulate it.
	 *
	 * @extends dat.controllers.Controller
	 * @extends dat.controllers.NumberController
	 *
	 * @param {Object} object The object to be manipulated
	 * @param {string} property The name of the property to be manipulated
	 * @param {Object} [params] Optional parameters
	 * @param {Number} [params.min] Minimum allowed value
	 * @param {Number} [params.max] Maximum allowed value
	 * @param {Number} [params.step] Increment by which to change value
	 *
	 * @member dat.controllers
	 */
	
	var NumberControllerBox = (function (_NumberController) {
	  _inherits(NumberControllerBox, _NumberController);
	
	  function NumberControllerBox(object, property, params) {
	    _classCallCheck(this, NumberControllerBox);
	
	    _NumberController.call(this, object, property, params);
	
	    this.__truncationSuspended = false;
	
	    var _this = this;
	
	    /**
	     * {Number} Previous mouse y position
	     * @ignore
	     */
	    var prevY = undefined;
	
	    this.__input = document.createElement('input');
	    this.__input.setAttribute('type', 'text');
	
	    // Makes it so manually specified values are not truncated.
	
	    _domDom2['default'].bind(this.__input, 'change', onChange);
	    _domDom2['default'].bind(this.__input, 'blur', onBlur);
	    _domDom2['default'].bind(this.__input, 'mousedown', onMouseDown);
	    _domDom2['default'].bind(this.__input, 'keydown', function (e) {
	      // When pressing entire, you can be as precise as you want.
	      if (e.keyCode === 13) {
	        _this.__truncationSuspended = true;
	        this.blur();
	        _this.__truncationSuspended = false;
	      }
	    });
	
	    function onChange() {
	      var attempted = parseFloat(_this.__input.value);
	      if (!_utilsCommon2['default'].isNaN(attempted)) {
	        _this.setValue(attempted);
	      }
	    }
	
	    function onBlur() {
	      onChange();
	      if (_this.__onFinishChange) {
	        _this.__onFinishChange.call(_this, _this.getValue());
	      }
	    }
	
	    function onMouseDown(e) {
	      _domDom2['default'].bind(window, 'mousemove', onMouseDrag);
	      _domDom2['default'].bind(window, 'mouseup', onMouseUp);
	      prevY = e.clientY;
	    }
	
	    function onMouseDrag(e) {
	      var diff = prevY - e.clientY;
	      _this.setValue(_this.getValue() + diff * _this.__impliedStep);
	
	      prevY = e.clientY;
	    }
	
	    function onMouseUp() {
	      _domDom2['default'].unbind(window, 'mousemove', onMouseDrag);
	      _domDom2['default'].unbind(window, 'mouseup', onMouseUp);
	    }
	
	    this.updateDisplay();
	
	    this.domElement.appendChild(this.__input);
	  }
	
	  NumberControllerBox.prototype.updateDisplay = function updateDisplay() {
	    this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
	    return _NumberController.prototype.updateDisplay.call(this);
	  };
	
	  return NumberControllerBox;
	})(_NumberController3['default']);
	
	exports['default'] = NumberControllerBox;
	module.exports = exports['default'];

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _NumberController2 = __webpack_require__(12);
	
	var _NumberController3 = _interopRequireDefault(_NumberController2);
	
	var _domDom = __webpack_require__(9);
	
	var _domDom2 = _interopRequireDefault(_domDom);
	
	var _utilsCss = __webpack_require__(15);
	
	var _utilsCss2 = _interopRequireDefault(_utilsCss);
	
	var _styleCssSassNumberControllerSliderScss = __webpack_require__(16);
	
	var _styleCssSassNumberControllerSliderScss2 = _interopRequireDefault(_styleCssSassNumberControllerSliderScss);
	
	function map(v, i1, i2, o1, o2) {
	  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
	}
	
	/**
	 * @class Represents a given property of an object that is a number, contains
	 * a minimum and maximum, and provides a slider element with which to
	 * manipulate it. It should be noted that the slider element is made up of
	 * <code>&lt;div&gt;</code> tags, <strong>not</strong> the html5
	 * <code>&lt;slider&gt;</code> element.
	 *
	 * @extends dat.controllers.Controller
	 * @extends dat.controllers.NumberController
	 *
	 * @param {Object} object The object to be manipulated
	 * @param {string} property The name of the property to be manipulated
	 * @param {Number} minValue Minimum allowed value
	 * @param {Number} maxValue Maximum allowed value
	 * @param {Number} stepValue Increment by which to change value
	 *
	 * @member dat.controllers
	 */
	
	var NumberControllerSlider = (function (_NumberController) {
	  _inherits(NumberControllerSlider, _NumberController);
	
	  function NumberControllerSlider(object, property, min, max, step) {
	    _classCallCheck(this, NumberControllerSlider);
	
	    _NumberController.call(this, object, property, { min: min, max: max, step: step });
	
	    var _this = this;
	
	    this.__background = document.createElement('div');
	    this.__foreground = document.createElement('div');
	
	    _domDom2['default'].bind(this.__background, 'mousedown', onMouseDown);
	
	    _domDom2['default'].addClass(this.__background, 'slider');
	    _domDom2['default'].addClass(this.__foreground, 'slider-fg');
	
	    function onMouseDown(e) {
	      _domDom2['default'].bind(window, 'mousemove', onMouseDrag);
	      _domDom2['default'].bind(window, 'mouseup', onMouseUp);
	
	      onMouseDrag(e);
	    }
	
	    function onMouseDrag(e) {
	      e.preventDefault();
	
	      var offset = _domDom2['default'].getOffset(_this.__background);
	      var width = _domDom2['default'].getWidth(_this.__background);
	
	      _this.setValue(map(e.clientX, offset.left, offset.left + width, _this.__min, _this.__max));
	
	      return false;
	    }
	
	    function onMouseUp() {
	      _domDom2['default'].unbind(window, 'mousemove', onMouseDrag);
	      _domDom2['default'].unbind(window, 'mouseup', onMouseUp);
	      if (_this.__onFinishChange) {
	        _this.__onFinishChange.call(_this, _this.getValue());
	      }
	    }
	
	    this.updateDisplay();
	
	    this.__background.appendChild(this.__foreground);
	    this.domElement.appendChild(this.__background);
	  }
	
	  /**
	   * Injects default stylesheet for slider elements.
	   */
	
	  NumberControllerSlider.prototype.updateDisplay = function updateDisplay() {
	    var pct = (this.getValue() - this.__min) / (this.__max - this.__min);
	    this.__foreground.style.width = pct * 100 + '%';
	    return _NumberController.prototype.updateDisplay.call(this);
	  };
	
	  return NumberControllerSlider;
	})(_NumberController3['default']);
	
	NumberControllerSlider.useDefaultStyles = function () {
	  _utilsCss2['default'].inject(_styleCssSassNumberControllerSliderScss2['default']);
	};
	
	exports['default'] = NumberControllerSlider;
	module.exports = exports['default'];

/***/ },
/* 15 */
/***/ function(module, exports) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	
	'use strict';
	
	module.exports = {
	  load: function load(url, indoc) {
	    var doc = indoc || document;
	    var link = doc.createElement('link');
	    link.type = 'text/css';
	    link.rel = 'stylesheet';
	    link.href = url;
	    doc.getElementsByTagName('head')[0].appendChild(link);
	  },
	
	  inject: function inject(css, indoc) {
	    var doc = indoc || document;
	    var injected = document.createElement('style');
	    injected.type = 'text/css';
	    injected.innerHTML = css;
	    doc.getElementsByTagName('head')[0].appendChild(injected);
	  }
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(17);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(19)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./NumberControllerSlider.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./NumberControllerSlider.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(18)();
	// imports
	
	
	// module
	exports.push([module.id, "/**\n * dat-gui JavaScript Controller Library\n * http://code.google.com/p/dat-gui\n *\n * Copyright 2011 Data Arts Team, Google Creative Lab\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n * http://www.apache.org/licenses/LICENSE-2.0\n */\n.slider {\n  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);\n  height: 1em;\n  border-radius: 1em;\n  background-color: #eee;\n  padding: 0 0.5em;\n  overflow: hidden; }\n\n.slider-fg {\n  padding: 1px 0 2px 0;\n  background-color: #aaa;\n  height: 1em;\n  margin-left: -0.5em;\n  padding-right: 0.5em;\n  border-radius: 1em 0 0 1em; }\n\n.slider-fg:after {\n  display: inline-block;\n  border-radius: 1em;\n  background-color: #fff;\n  border: 1px solid #aaa;\n  content: '';\n  float: right;\n  margin-right: -1em;\n  margin-top: -1px;\n  height: 0.9em;\n  width: 0.9em; }\n", ""]);
	
	// exports


/***/ },
/* 18 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}
	
	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _Controller2 = __webpack_require__(7);
	
	var _Controller3 = _interopRequireDefault(_Controller2);
	
	var _domDom = __webpack_require__(9);
	
	var _domDom2 = _interopRequireDefault(_domDom);
	
	/**
	 * @class Provides a GUI interface to fire a specified method, a property of an object.
	 *
	 * @extends dat.controllers.Controller
	 *
	 * @param {Object} object The object to be manipulated
	 * @param {string} property The name of the property to be manipulated
	 *
	 * @member dat.controllers
	 */
	
	var FunctionController = (function (_Controller) {
	  _inherits(FunctionController, _Controller);
	
	  function FunctionController(object, property, text) {
	    _classCallCheck(this, FunctionController);
	
	    _Controller.call(this, object, property);
	
	    var _this = this;
	
	    this.__button = document.createElement('div');
	    this.__button.innerHTML = text === undefined ? 'Fire' : text;
	
	    _domDom2['default'].bind(this.__button, 'click', function (e) {
	      e.preventDefault();
	      _this.fire();
	      return false;
	    });
	
	    _domDom2['default'].addClass(this.__button, 'button');
	
	    this.domElement.appendChild(this.__button);
	  }
	
	  FunctionController.prototype.fire = function fire() {
	    if (this.__onChange) {
	      this.__onChange.call(this);
	    }
	    this.getValue().call(this.object);
	    if (this.__onFinishChange) {
	      this.__onFinishChange.call(this, this.getValue());
	    }
	  };
	
	  return FunctionController;
	})(_Controller3['default']);
	
	exports['default'] = FunctionController;
	module.exports = exports['default'];

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _Controller2 = __webpack_require__(7);
	
	var _Controller3 = _interopRequireDefault(_Controller2);
	
	var _domDom = __webpack_require__(9);
	
	var _domDom2 = _interopRequireDefault(_domDom);
	
	var _colorColor = __webpack_require__(2);
	
	var _colorColor2 = _interopRequireDefault(_colorColor);
	
	var _colorInterpret = __webpack_require__(3);
	
	var _colorInterpret2 = _interopRequireDefault(_colorInterpret);
	
	var _utilsCommon = __webpack_require__(5);
	
	var _utilsCommon2 = _interopRequireDefault(_utilsCommon);
	
	var ColorController = (function (_Controller) {
	  _inherits(ColorController, _Controller);
	
	  function ColorController(object, property) {
	    _classCallCheck(this, ColorController);
	
	    _Controller.call(this, object, property);
	
	    this.__color = new _colorColor2['default'](this.getValue());
	    this.__temp = new _colorColor2['default'](0);
	
	    var _this = this;
	
	    this.domElement = document.createElement('div');
	
	    _domDom2['default'].makeSelectable(this.domElement, false);
	
	    this.__selector = document.createElement('div');
	    this.__selector.className = 'selector';
	
	    this.__saturation_field = document.createElement('div');
	    this.__saturation_field.className = 'saturation-field';
	
	    this.__field_knob = document.createElement('div');
	    this.__field_knob.className = 'field-knob';
	    this.__field_knob_border = '2px solid ';
	
	    this.__hue_knob = document.createElement('div');
	    this.__hue_knob.className = 'hue-knob';
	
	    this.__hue_field = document.createElement('div');
	    this.__hue_field.className = 'hue-field';
	
	    this.__input = document.createElement('input');
	    this.__input.type = 'text';
	    this.__input_textShadow = '0 1px 1px ';
	
	    _domDom2['default'].bind(this.__input, 'keydown', function (e) {
	      if (e.keyCode === 13) {
	        // on enter
	        onBlur.call(this);
	      }
	    });
	
	    _domDom2['default'].bind(this.__input, 'blur', onBlur);
	
	    _domDom2['default'].bind(this.__selector, 'mousedown', function () /* e */{
	      _domDom2['default'].addClass(this, 'drag').bind(window, 'mouseup', function () /* e */{
	        _domDom2['default'].removeClass(_this.__selector, 'drag');
	      });
	    });
	
	    var valueField = document.createElement('div');
	
	    _utilsCommon2['default'].extend(this.__selector.style, {
	      width: '122px',
	      height: '102px',
	      padding: '3px',
	      backgroundColor: '#222',
	      boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
	    });
	
	    _utilsCommon2['default'].extend(this.__field_knob.style, {
	      position: 'absolute',
	      width: '12px',
	      height: '12px',
	      border: this.__field_knob_border + (this.__color.v < 0.5 ? '#fff' : '#000'),
	      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
	      borderRadius: '12px',
	      zIndex: 1
	    });
	
	    _utilsCommon2['default'].extend(this.__hue_knob.style, {
	      position: 'absolute',
	      width: '15px',
	      height: '2px',
	      borderRight: '4px solid #fff',
	      zIndex: 1
	    });
	
	    _utilsCommon2['default'].extend(this.__saturation_field.style, {
	      width: '100px',
	      height: '100px',
	      border: '1px solid #555',
	      marginRight: '3px',
	      display: 'inline-block',
	      cursor: 'pointer'
	    });
	
	    _utilsCommon2['default'].extend(valueField.style, {
	      width: '100%',
	      height: '100%',
	      background: 'none'
	    });
	
	    linearGradient(valueField, 'top', 'rgba(0,0,0,0)', '#000');
	
	    _utilsCommon2['default'].extend(this.__hue_field.style, {
	      width: '15px',
	      height: '100px',
	      display: 'inline-block',
	      border: '1px solid #555',
	      cursor: 'ns-resize'
	    });
	
	    hueGradient(this.__hue_field);
	
	    _utilsCommon2['default'].extend(this.__input.style, {
	      outline: 'none',
	      //      width: '120px',
	      textAlign: 'center',
	      //      padding: '4px',
	      //      marginBottom: '6px',
	      color: '#fff',
	      border: 0,
	      fontWeight: 'bold',
	      textShadow: this.__input_textShadow + 'rgba(0,0,0,0.7)'
	    });
	
	    _domDom2['default'].bind(this.__saturation_field, 'mousedown', fieldDown);
	    _domDom2['default'].bind(this.__field_knob, 'mousedown', fieldDown);
	
	    _domDom2['default'].bind(this.__hue_field, 'mousedown', function (e) {
	      setH(e);
	      _domDom2['default'].bind(window, 'mousemove', setH);
	      _domDom2['default'].bind(window, 'mouseup', unbindH);
	    });
	
	    function fieldDown(e) {
	      setSV(e);
	      // document.body.style.cursor = 'none';
	      _domDom2['default'].bind(window, 'mousemove', setSV);
	      _domDom2['default'].bind(window, 'mouseup', unbindSV);
	    }
	
	    function unbindSV() {
	      _domDom2['default'].unbind(window, 'mousemove', setSV);
	      _domDom2['default'].unbind(window, 'mouseup', unbindSV);
	      // document.body.style.cursor = 'default';
	    }
	
	    function onBlur() {
	      var i = _colorInterpret2['default'](this.value);
	      if (i !== false) {
	        _this.__color.__state = i;
	        _this.setValue(_this.__color.toOriginal());
	      } else {
	        this.value = _this.__color.toString();
	      }
	    }
	
	    function unbindH() {
	      _domDom2['default'].unbind(window, 'mousemove', setH);
	      _domDom2['default'].unbind(window, 'mouseup', unbindH);
	    }
	
	    this.__saturation_field.appendChild(valueField);
	    this.__selector.appendChild(this.__field_knob);
	    this.__selector.appendChild(this.__saturation_field);
	    this.__selector.appendChild(this.__hue_field);
	    this.__hue_field.appendChild(this.__hue_knob);
	
	    this.domElement.appendChild(this.__input);
	    this.domElement.appendChild(this.__selector);
	
	    this.updateDisplay();
	
	    function setSV(e) {
	      e.preventDefault();
	
	      var w = _domDom2['default'].getWidth(_this.__saturation_field);
	      var o = _domDom2['default'].getOffset(_this.__saturation_field);
	      var s = (e.clientX - o.left + document.body.scrollLeft) / w;
	      var v = 1 - (e.clientY - o.top + document.body.scrollTop) / w;
	
	      if (v > 1) {
	        v = 1;
	      } else if (v < 0) {
	        v = 0;
	      }
	
	      if (s > 1) {
	        s = 1;
	      } else if (s < 0) {
	        s = 0;
	      }
	
	      _this.__color.v = v;
	      _this.__color.s = s;
	
	      _this.setValue(_this.__color.toOriginal());
	
	      return false;
	    }
	
	    function setH(e) {
	      e.preventDefault();
	
	      var s = _domDom2['default'].getHeight(_this.__hue_field);
	      var o = _domDom2['default'].getOffset(_this.__hue_field);
	      var h = 1 - (e.clientY - o.top + document.body.scrollTop) / s;
	
	      if (h > 1) {
	        h = 1;
	      } else if (h < 0) {
	        h = 0;
	      }
	
	      _this.__color.h = h * 360;
	
	      _this.setValue(_this.__color.toOriginal());
	
	      return false;
	    }
	  }
	
	  ColorController.prototype.updateDisplay = function updateDisplay() {
	    var i = _colorInterpret2['default'](this.getValue());
	
	    if (i !== false) {
	      var mismatch = false;
	
	      // Check for mismatch on the interpreted value.
	
	      _utilsCommon2['default'].each(_colorColor2['default'].COMPONENTS, function (component) {
	        if (!_utilsCommon2['default'].isUndefined(i[component]) && !_utilsCommon2['default'].isUndefined(this.__color.__state[component]) && i[component] !== this.__color.__state[component]) {
	          mismatch = true;
	          return {}; // break
	        }
	      }, this);
	
	      // If nothing diverges, we keep our previous values
	      // for statefulness, otherwise we recalculate fresh
	      if (mismatch) {
	        _utilsCommon2['default'].extend(this.__color.__state, i);
	      }
	    }
	
	    _utilsCommon2['default'].extend(this.__temp.__state, this.__color.__state);
	
	    this.__temp.a = 1;
	
	    var flip = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0;
	    var _flip = 255 - flip;
	
	    _utilsCommon2['default'].extend(this.__field_knob.style, {
	      marginLeft: 100 * this.__color.s - 7 + 'px',
	      marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
	      backgroundColor: this.__temp.toString(),
	      border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
	    });
	
	    this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px';
	
	    this.__temp.s = 1;
	    this.__temp.v = 1;
	
	    linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toString());
	
	    _utilsCommon2['default'].extend(this.__input.style, {
	      backgroundColor: this.__input.value = this.__color.toString(),
	      color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
	      textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
	    });
	  };
	
	  return ColorController;
	})(_Controller3['default']);
	
	var vendors = ['-moz-', '-o-', '-webkit-', '-ms-', ''];
	
	function linearGradient(elem, x, a, b) {
	  elem.style.background = '';
	  _utilsCommon2['default'].each(vendors, function (vendor) {
	    elem.style.cssText += 'background: ' + vendor + 'linear-gradient(' + x + ', ' + a + ' 0%, ' + b + ' 100%); ';
	  });
	}
	
	function hueGradient(elem) {
	  elem.style.background = '';
	  elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
	  elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
	  elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
	  elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
	  elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
	}
	
	exports['default'] = ColorController;
	module.exports = exports['default'];

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	
	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _utilsCss = __webpack_require__(15);
	
	var _utilsCss2 = _interopRequireDefault(_utilsCss);
	
	var _htmlSaveDialogueHtml = __webpack_require__(23);
	
	var _htmlSaveDialogueHtml2 = _interopRequireDefault(_htmlSaveDialogueHtml);
	
	var _styleCssSassStyleScss = __webpack_require__(24);
	
	var _styleCssSassStyleScss2 = _interopRequireDefault(_styleCssSassStyleScss);
	
	var _controllersControllerFactory = __webpack_require__(26);
	
	var _controllersControllerFactory2 = _interopRequireDefault(_controllersControllerFactory);
	
	var _controllersController = __webpack_require__(7);
	
	var _controllersController2 = _interopRequireDefault(_controllersController);
	
	var _controllersBooleanController = __webpack_require__(8);
	
	var _controllersBooleanController2 = _interopRequireDefault(_controllersBooleanController);
	
	var _controllersFunctionController = __webpack_require__(20);
	
	var _controllersFunctionController2 = _interopRequireDefault(_controllersFunctionController);
	
	var _controllersNumberControllerBox = __webpack_require__(13);
	
	var _controllersNumberControllerBox2 = _interopRequireDefault(_controllersNumberControllerBox);
	
	var _controllersNumberControllerSlider = __webpack_require__(14);
	
	var _controllersNumberControllerSlider2 = _interopRequireDefault(_controllersNumberControllerSlider);
	
	var _controllersColorController = __webpack_require__(21);
	
	var _controllersColorController2 = _interopRequireDefault(_controllersColorController);
	
	var _utilsRequestAnimationFrame = __webpack_require__(27);
	
	var _utilsRequestAnimationFrame2 = _interopRequireDefault(_utilsRequestAnimationFrame);
	
	var _domCenteredDiv = __webpack_require__(28);
	
	var _domCenteredDiv2 = _interopRequireDefault(_domCenteredDiv);
	
	var _domDom = __webpack_require__(9);
	
	var _domDom2 = _interopRequireDefault(_domDom);
	
	var _utilsCommon = __webpack_require__(5);
	
	var _utilsCommon2 = _interopRequireDefault(_utilsCommon);
	
	_utilsCss2['default'].inject(_styleCssSassStyleScss2['default']);
	
	/** Outer-most className for GUI's */
	var CSS_NAMESPACE = 'dg';
	
	var HIDE_KEY_CODE = 72;
	
	/** The only value shared between the JS and SCSS. Use caution. */
	var CLOSE_BUTTON_HEIGHT = 20;
	
	var DEFAULT_DEFAULT_PRESET_NAME = 'Default';
	
	var SUPPORTS_LOCAL_STORAGE = (function () {
	  try {
	    return 'localStorage' in window && window.localStorage !== null;
	  } catch (e) {
	    return false;
	  }
	})();
	
	var SAVE_DIALOGUE = undefined;
	
	/** Have we yet to create an autoPlace GUI? */
	var autoPlaceVirgin = true;
	
	/** Fixed position div that auto place GUI's go inside */
	var autoPlaceContainer = undefined;
	
	/** Are we hiding the GUI's ? */
	var hide = false;
	
	/** GUI's which should be hidden */
	var hideableGuis = [];
	
	/**
	 * A lightweight controller library for JavaScript. It allows you to easily
	 * manipulate variables and fire functions on the fly.
	 * @class
	 *
	 * @member dat.gui
	 *
	 * @param {Object} [params]
	 * @param {String} [params.name] The name of this GUI.
	 * @param {Object} [params.load] JSON object representing the saved state of
	 * this GUI.
	 * @param {Boolean} [params.auto=true]
	 * @param {dat.gui.GUI} [params.parent] The GUI I'm nested in.
	 * @param {Boolean} [params.closed] If true, starts closed
	 */
	var GUI = function GUI(pars) {
	  var _this = this;
	
	  var params = pars || {};
	
	  /**
	   * Outermost DOM Element
	   * @type DOMElement
	   */
	  this.domElement = document.createElement('div');
	  this.__ul = document.createElement('ul');
	  this.domElement.appendChild(this.__ul);
	
	  _domDom2['default'].addClass(this.domElement, CSS_NAMESPACE);
	
	  /**
	   * Nested GUI's by name
	   * @ignore
	   */
	  this.__folders = {};
	
	  this.__controllers = [];
	
	  /**
	   * List of objects I'm remembering for save, only used in top level GUI
	   * @ignore
	   */
	  this.__rememberedObjects = [];
	
	  /**
	   * Maps the index of remembered objects to a map of controllers, only used
	   * in top level GUI.
	   *
	   * @private
	   * @ignore
	   *
	   * @example
	   * [
	   *  {
	     *    propertyName: Controller,
	     *    anotherPropertyName: Controller
	     *  },
	   *  {
	     *    propertyName: Controller
	     *  }
	   * ]
	   */
	  this.__rememberedObjectIndecesToControllers = [];
	
	  this.__listening = [];
	
	  // Default parameters
	  params = _utilsCommon2['default'].defaults(params, {
	    autoPlace: true,
	    width: GUI.DEFAULT_WIDTH
	  });
	
	  params = _utilsCommon2['default'].defaults(params, {
	    resizable: params.autoPlace,
	    hideable: params.autoPlace
	  });
	
	  if (!_utilsCommon2['default'].isUndefined(params.load)) {
	    // Explicit preset
	    if (params.preset) {
	      params.load.preset = params.preset;
	    }
	  } else {
	    params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };
	  }
	
	  if (_utilsCommon2['default'].isUndefined(params.parent) && params.hideable) {
	    hideableGuis.push(this);
	  }
	
	  // Only root level GUI's are resizable.
	  params.resizable = _utilsCommon2['default'].isUndefined(params.parent) && params.resizable;
	
	  if (params.autoPlace && _utilsCommon2['default'].isUndefined(params.scrollable)) {
	    params.scrollable = true;
	  }
	  //    params.scrollable = common.isUndefined(params.parent) && params.scrollable === true;
	
	  // Not part of params because I don't want people passing this in via
	  // constructor. Should be a 'remembered' value.
	  var useLocalStorage = SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';
	
	  var saveToLocalStorage = undefined;
	
	  Object.defineProperties(this,
	  /** @lends dat.gui.GUI.prototype */
	  {
	    /**
	     * The parent <code>GUI</code>
	     * @type dat.gui.GUI
	     */
	    parent: {
	      get: function get() {
	        return params.parent;
	      }
	    },
	
	    scrollable: {
	      get: function get() {
	        return params.scrollable;
	      }
	    },
	
	    /**
	     * Handles <code>GUI</code>'s element placement for you
	     * @type Boolean
	     */
	    autoPlace: {
	      get: function get() {
	        return params.autoPlace;
	      }
	    },
	
	    /**
	     * The identifier for a set of saved values
	     * @type String
	     */
	    preset: {
	      get: function get() {
	        if (_this.parent) {
	          return _this.getRoot().preset;
	        }
	
	        return params.load.preset;
	      },
	
	      set: function set(v) {
	        if (_this.parent) {
	          _this.getRoot().preset = v;
	        } else {
	          params.load.preset = v;
	        }
	        setPresetSelectIndex(this);
	        _this.revert();
	      }
	    },
	
	    /**
	     * The width of <code>GUI</code> element
	     * @type Number
	     */
	    width: {
	      get: function get() {
	        return params.width;
	      },
	      set: function set(v) {
	        params.width = v;
	        setWidth(_this, v);
	      }
	    },
	
	    /**
	     * The name of <code>GUI</code>. Used for folders. i.e
	     * a folder's name
	     * @type String
	     */
	    name: {
	      get: function get() {
	        return params.name;
	      },
	      set: function set(v) {
	        // TODO Check for collisions among sibling folders
	        params.name = v;
	        if (titleRowName) {
	          titleRowName.innerHTML = params.name;
	        }
	      }
	    },
	
	    /**
	     * Whether the <code>GUI</code> is collapsed or not
	     * @type Boolean
	     */
	    closed: {
	      get: function get() {
	        return params.closed;
	      },
	      set: function set(v) {
	        params.closed = v;
	        if (params.closed) {
	          _domDom2['default'].addClass(_this.__ul, GUI.CLASS_CLOSED);
	        } else {
	          _domDom2['default'].removeClass(_this.__ul, GUI.CLASS_CLOSED);
	        }
	        // For browsers that aren't going to respect the CSS transition,
	        // Lets just check our height against the window height right off
	        // the bat.
	        this.onResize();
	
	        if (_this.__closeButton) {
	          _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
	        }
	      }
	    },
	
	    /**
	     * Contains all presets
	     * @type Object
	     */
	    load: {
	      get: function get() {
	        return params.load;
	      }
	    },
	
	    /**
	     * Determines whether or not to use <a href="https://developer.mozilla.org/en/DOM/Storage#localStorage">localStorage</a> as the means for
	     * <code>remember</code>ing
	     * @type Boolean
	     */
	    useLocalStorage: {
	
	      get: function get() {
	        return useLocalStorage;
	      },
	      set: function set(bool) {
	        if (SUPPORTS_LOCAL_STORAGE) {
	          useLocalStorage = bool;
	          if (bool) {
	            _domDom2['default'].bind(window, 'unload', saveToLocalStorage);
	          } else {
	            _domDom2['default'].unbind(window, 'unload', saveToLocalStorage);
	          }
	          localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
	        }
	      }
	    }
	  });
	
	  // Are we a root level GUI?
	  if (_utilsCommon2['default'].isUndefined(params.parent)) {
	    params.closed = false;
	
	    _domDom2['default'].addClass(this.domElement, GUI.CLASS_MAIN);
	    _domDom2['default'].makeSelectable(this.domElement, false);
	
	    // Are we supposed to be loading locally?
	    if (SUPPORTS_LOCAL_STORAGE) {
	      if (useLocalStorage) {
	        _this.useLocalStorage = true;
	
	        var savedGui = localStorage.getItem(getLocalStorageHash(this, 'gui'));
	
	        if (savedGui) {
	          params.load = JSON.parse(savedGui);
	        }
	      }
	    }
	
	    this.__closeButton = document.createElement('div');
	    this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
	    _domDom2['default'].addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
	    this.domElement.appendChild(this.__closeButton);
	
	    _domDom2['default'].bind(this.__closeButton, 'click', function () {
	      _this.closed = !_this.closed;
	    });
	    // Oh, you're a nested GUI!
	  } else {
	      if (params.closed === undefined) {
	        params.closed = true;
	      }
	
	      var _titleRowName = document.createTextNode(params.name);
	      _domDom2['default'].addClass(_titleRowName, 'controller-name');
	
	      var titleRow = addRow(_this, _titleRowName);
	
	      var onClickTitle = function onClickTitle(e) {
	        e.preventDefault();
	        _this.closed = !_this.closed;
	        return false;
	      };
	
	      _domDom2['default'].addClass(this.__ul, GUI.CLASS_CLOSED);
	
	      _domDom2['default'].addClass(titleRow, 'title');
	      _domDom2['default'].bind(titleRow, 'click', onClickTitle);
	
	      if (!params.closed) {
	        this.closed = false;
	      }
	    }
	
	  if (params.autoPlace) {
	    if (_utilsCommon2['default'].isUndefined(params.parent)) {
	      if (autoPlaceVirgin) {
	        autoPlaceContainer = document.createElement('div');
	        _domDom2['default'].addClass(autoPlaceContainer, CSS_NAMESPACE);
	        _domDom2['default'].addClass(autoPlaceContainer, GUI.CLASS_AUTO_PLACE_CONTAINER);
	        document.body.appendChild(autoPlaceContainer);
	        autoPlaceVirgin = false;
	      }
	
	      // Put it in the dom for you.
	      autoPlaceContainer.appendChild(this.domElement);
	
	      // Apply the auto styles
	      _domDom2['default'].addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
	    }
	
	    // Make it not elastic.
	    if (!this.parent) {
	      setWidth(_this, params.width);
	    }
	  }
	
	  _domDom2['default'].bind(window, 'resize', function () {
	    _this.onResize();
	  });
	  _domDom2['default'].bind(this.__ul, 'webkitTransitionEnd', function () {
	    _this.onResize();
	  });
	  _domDom2['default'].bind(this.__ul, 'transitionend', function () {
	    _this.onResize();
	  });
	  _domDom2['default'].bind(this.__ul, 'oTransitionEnd', function () {
	    _this.onResize();
	  });
	  this.onResize();
	
	  if (params.resizable) {
	    addResizeHandle(this);
	  }
	
	  saveToLocalStorage = function () {
	    if (SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(_this, 'isLocal')) === 'true') {
	      localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
	    }
	  };
	
	  // expose this method publicly
	  this.saveToLocalStorageIfPossible = saveToLocalStorage;
	
	  function resetWidth() {
	    var root = _this.getRoot();
	    root.width += 1;
	    _utilsCommon2['default'].defer(function () {
	      root.width -= 1;
	    });
	  }
	
	  if (!params.parent) {
	    resetWidth();
	  }
	};
	
	GUI.toggleHide = function () {
	  hide = !hide;
	  _utilsCommon2['default'].each(hideableGuis, function (gui) {
	    gui.domElement.style.zIndex = hide ? -999 : 999;
	    gui.domElement.style.opacity = hide ? 0 : 1;
	  });
	};
	
	GUI.CLASS_AUTO_PLACE = 'a';
	GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
	GUI.CLASS_MAIN = 'main';
	GUI.CLASS_CONTROLLER_ROW = 'cr';
	GUI.CLASS_TOO_TALL = 'taller-than-window';
	GUI.CLASS_CLOSED = 'closed';
	GUI.CLASS_CLOSE_BUTTON = 'close-button';
	GUI.CLASS_DRAG = 'drag';
	
	GUI.DEFAULT_WIDTH = 245;
	GUI.TEXT_CLOSED = 'Close Controls';
	GUI.TEXT_OPEN = 'Open Controls';
	
	_domDom2['default'].bind(window, 'keydown', function (e) {
	  if (document.activeElement.type !== 'text' && (e.which === HIDE_KEY_CODE || e.keyCode === HIDE_KEY_CODE)) {
	    GUI.toggleHide();
	  }
	}, false);
	
	_utilsCommon2['default'].extend(GUI.prototype,
	
	/** @lends dat.gui.GUI */
	{
	
	  /**
	   * @param object
	   * @param property
	   * @returns {dat.controllers.Controller} The new controller that was added.
	   * @instance
	   */
	  add: (function (_add) {
	    function add(_x, _x2) {
	      return _add.apply(this, arguments);
	    }
	
	    add.toString = function () {
	      return _add.toString();
	    };
	
	    return add;
	  })(function (object, property) {
	    return add(this, object, property, {
	      factoryArgs: Array.prototype.slice.call(arguments, 2)
	    });
	  }),
	
	  /**
	   * @param object
	   * @param property
	   * @returns {dat.controllers.ColorController} The new controller that was added.
	   * @instance
	   */
	  addColor: function addColor(object, property) {
	    return add(this, object, property, {
	      color: true
	    });
	  },
	
	  /**
	   * @param controller
	   * @instance
	   */
	  remove: function remove(controller) {
	    // TODO listening?
	    this.__ul.removeChild(controller.__li);
	    this.__controllers.splice(this.__controllers.indexOf(controller), 1);
	    var _this = this;
	    _utilsCommon2['default'].defer(function () {
	      _this.onResize();
	    });
	  },
	
	  destroy: function destroy() {
	    if (this.autoPlace) {
	      autoPlaceContainer.removeChild(this.domElement);
	    }
	  },
	
	  /**
	   * @param name
	   * @returns {dat.gui.GUI} The new folder.
	   * @throws {Error} if this GUI already has a folder by the specified
	   * name
	   * @instance
	   */
	  addFolder: function addFolder(name) {
	    // We have to prevent collisions on names in order to have a key
	    // by which to remember saved values
	    if (this.__folders[name] !== undefined) {
	      throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
	    }
	
	    var newGuiParams = { name: name, parent: this };
	
	    // We need to pass down the autoPlace trait so that we can
	    // attach event listeners to open/close folder actions to
	    // ensure that a scrollbar appears if the window is too short.
	    newGuiParams.autoPlace = this.autoPlace;
	
	    // Do we have saved appearance data for this folder?
	
	    if (this.load && // Anything loaded?
	    this.load.folders && // Was my parent a dead-end?
	    this.load.folders[name]) {
	      // Did daddy remember me?
	
	      // Start me closed if I was closed
	      newGuiParams.closed = this.load.folders[name].closed;
	
	      // Pass down the loaded data
	      newGuiParams.load = this.load.folders[name];
	    }
	
	    var gui = new GUI(newGuiParams);
	    this.__folders[name] = gui;
	
	    var li = addRow(this, gui.domElement);
	    _domDom2['default'].addClass(li, 'folder');
	    return gui;
	  },
	
	  open: function open() {
	    this.closed = false;
	  },
	
	  close: function close() {
	    this.closed = true;
	  },
	
	  onResize: function onResize() {
	    var root = this.getRoot();
	    if (root.scrollable) {
	      var _top = _domDom2['default'].getOffset(root.__ul).top;
	      var h = 0;
	
	      _utilsCommon2['default'].each(root.__ul.childNodes, function (node) {
	        if (!(root.autoPlace && node === root.__save_row)) {
	          h += _domDom2['default'].getHeight(node);
	        }
	      });
	
	      if (window.innerHeight - _top - CLOSE_BUTTON_HEIGHT < h) {
	        _domDom2['default'].addClass(root.domElement, GUI.CLASS_TOO_TALL);
	        root.__ul.style.height = window.innerHeight - _top - CLOSE_BUTTON_HEIGHT + 'px';
	      } else {
	        _domDom2['default'].removeClass(root.domElement, GUI.CLASS_TOO_TALL);
	        root.__ul.style.height = 'auto';
	      }
	    }
	
	    if (root.__resize_handle) {
	      _utilsCommon2['default'].defer(function () {
	        root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
	      });
	    }
	
	    if (root.__closeButton) {
	      root.__closeButton.style.width = root.width + 'px';
	    }
	  },
	
	  /**
	   * Mark objects for saving. The order of these objects cannot change as
	   * the GUI grows. When remembering new objects, append them to the end
	   * of the list.
	   *
	   * @param {Object...} objects
	   * @throws {Error} if not called on a top level GUI.
	   * @instance
	   */
	  remember: function remember() {
	    if (_utilsCommon2['default'].isUndefined(SAVE_DIALOGUE)) {
	      SAVE_DIALOGUE = new _domCenteredDiv2['default']();
	      SAVE_DIALOGUE.domElement.innerHTML = _htmlSaveDialogueHtml2['default'];
	    }
	
	    if (this.parent) {
	      throw new Error('You can only call remember on a top level GUI.');
	    }
	
	    var _this = this;
	
	    _utilsCommon2['default'].each(Array.prototype.slice.call(arguments), function (object) {
	      if (_this.__rememberedObjects.length === 0) {
	        addSaveMenu(_this);
	      }
	      if (_this.__rememberedObjects.indexOf(object) === -1) {
	        _this.__rememberedObjects.push(object);
	      }
	    });
	
	    if (this.autoPlace) {
	      // Set save row width
	      setWidth(this, this.width);
	    }
	  },
	
	  /**
	   * @returns {dat.gui.GUI} the topmost parent GUI of a nested GUI.
	   * @instance
	   */
	  getRoot: function getRoot() {
	    var gui = this;
	    while (gui.parent) {
	      gui = gui.parent;
	    }
	    return gui;
	  },
	
	  /**
	   * @returns {Object} a JSON object representing the current state of
	   * this GUI as well as its remembered properties.
	   * @instance
	   */
	  getSaveObject: function getSaveObject() {
	    var toReturn = this.load;
	    toReturn.closed = this.closed;
	
	    // Am I remembering any values?
	    if (this.__rememberedObjects.length > 0) {
	      toReturn.preset = this.preset;
	
	      if (!toReturn.remembered) {
	        toReturn.remembered = {};
	      }
	
	      toReturn.remembered[this.preset] = getCurrentPreset(this);
	    }
	
	    toReturn.folders = {};
	    _utilsCommon2['default'].each(this.__folders, function (element, key) {
	      toReturn.folders[key] = element.getSaveObject();
	    });
	
	    return toReturn;
	  },
	
	  save: function save() {
	    if (!this.load.remembered) {
	      this.load.remembered = {};
	    }
	
	    this.load.remembered[this.preset] = getCurrentPreset(this);
	    markPresetModified(this, false);
	    this.saveToLocalStorageIfPossible();
	  },
	
	  saveAs: function saveAs(presetName) {
	    if (!this.load.remembered) {
	      // Retain default values upon first save
	      this.load.remembered = {};
	      this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
	    }
	
	    this.load.remembered[presetName] = getCurrentPreset(this);
	    this.preset = presetName;
	    addPresetOption(this, presetName, true);
	    this.saveToLocalStorageIfPossible();
	  },
	
	  revert: function revert(gui) {
	    _utilsCommon2['default'].each(this.__controllers, function (controller) {
	      // Make revert work on Default.
	      if (!this.getRoot().load.remembered) {
	        controller.setValue(controller.initialValue);
	      } else {
	        recallSavedValue(gui || this.getRoot(), controller);
	      }
	    }, this);
	
	    _utilsCommon2['default'].each(this.__folders, function (folder) {
	      folder.revert(folder);
	    });
	
	    if (!gui) {
	      markPresetModified(this.getRoot(), false);
	    }
	  },
	
	  listen: function listen(controller) {
	    var init = this.__listening.length === 0;
	    this.__listening.push(controller);
	    if (init) {
	      updateDisplays(this.__listening);
	    }
	  }
	});
	
	/**
	 * Add a row to the end of the GUI or before another row.
	 *
	 * @param gui
	 * @param [newDom] If specified, inserts the dom content in the new row
	 * @param [liBefore] If specified, places the new row before another row
	 */
	function addRow(gui, newDom, liBefore) {
	  var li = document.createElement('li');
	  if (newDom) {
	    li.appendChild(newDom);
	  }
	
	  if (liBefore) {
	    gui.__ul.insertBefore(li, params.before);
	  } else {
	    gui.__ul.appendChild(li);
	  }
	  gui.onResize();
	  return li;
	}
	
	function markPresetModified(gui, modified) {
	  var opt = gui.__preset_select[gui.__preset_select.selectedIndex];
	
	  // console.log('mark', modified, opt);
	  if (modified) {
	    opt.innerHTML = opt.value + '*';
	  } else {
	    opt.innerHTML = opt.value;
	  }
	}
	
	function augmentController(gui, li, controller) {
	  controller.__li = li;
	  controller.__gui = gui;
	
	  _utilsCommon2['default'].extend(controller, {
	    options: function options(_options) {
	      if (arguments.length > 1) {
	        controller.remove();
	
	        return add(gui, controller.object, controller.property, {
	          before: controller.__li.nextElementSibling,
	          factoryArgs: [_utilsCommon2['default'].toArray(arguments)]
	        });
	      }
	
	      if (_utilsCommon2['default'].isArray(_options) || _utilsCommon2['default'].isObject(_options)) {
	        controller.remove();
	
	        return add(gui, controller.object, controller.property, {
	          before: controller.__li.nextElementSibling,
	          factoryArgs: [_options]
	        });
	      }
	    },
	
	    name: function name(v) {
	      controller.__li.firstElementChild.firstElementChild.innerHTML = v;
	      return controller;
	    },
	
	    listen: function listen() {
	      controller.__gui.listen(controller);
	      return controller;
	    },
	
	    remove: function remove() {
	      controller.__gui.remove(controller);
	      return controller;
	    }
	  });
	
	  // All sliders should be accompanied by a box.
	  if (controller instanceof _controllersNumberControllerSlider2['default']) {
	    (function () {
	      var box = new _controllersNumberControllerBox2['default'](controller.object, controller.property, { min: controller.__min, max: controller.__max, step: controller.__step });
	
	      _utilsCommon2['default'].each(['updateDisplay', 'onChange', 'onFinishChange'], function (method) {
	        var pc = controller[method];
	        var pb = box[method];
	        controller[method] = box[method] = function () {
	          var args = Array.prototype.slice.call(arguments);
	          pc.apply(controller, args);
	          return pb.apply(box, args);
	        };
	      });
	
	      _domDom2['default'].addClass(li, 'has-slider');
	      controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
	    })();
	  } else if (controller instanceof _controllersNumberControllerBox2['default']) {
	    var r = function r(returned) {
	      // Have we defined both boundaries?
	      if (_utilsCommon2['default'].isNumber(controller.__min) && _utilsCommon2['default'].isNumber(controller.__max)) {
	        // Well, then lets just replace this with a slider.
	        controller.remove();
	        return add(gui, controller.object, controller.property, {
	          before: controller.__li.nextElementSibling,
	          factoryArgs: [controller.__min, controller.__max, controller.__step]
	        });
	      }
	
	      return returned;
	    };
	
	    controller.min = _utilsCommon2['default'].compose(r, controller.min);
	    controller.max = _utilsCommon2['default'].compose(r, controller.max);
	  } else if (controller instanceof _controllersBooleanController2['default']) {
	    _domDom2['default'].bind(li, 'click', function () {
	      _domDom2['default'].fakeEvent(controller.__checkbox, 'click');
	    });
	
	    _domDom2['default'].bind(controller.__checkbox, 'click', function (e) {
	      e.stopPropagation(); // Prevents double-toggle
	    });
	  } else if (controller instanceof _controllersFunctionController2['default']) {
	      _domDom2['default'].bind(li, 'click', function () {
	        _domDom2['default'].fakeEvent(controller.__button, 'click');
	      });
	
	      _domDom2['default'].bind(li, 'mouseover', function () {
	        _domDom2['default'].addClass(controller.__button, 'hover');
	      });
	
	      _domDom2['default'].bind(li, 'mouseout', function () {
	        _domDom2['default'].removeClass(controller.__button, 'hover');
	      });
	    } else if (controller instanceof _controllersColorController2['default']) {
	      _domDom2['default'].addClass(li, 'color');
	      controller.updateDisplay = _utilsCommon2['default'].compose(function (val) {
	        li.style.borderLeftColor = controller.__color.toString();
	        return val;
	      }, controller.updateDisplay);
	
	      controller.updateDisplay();
	    }
	
	  controller.setValue = _utilsCommon2['default'].compose(function (val) {
	    if (gui.getRoot().__preset_select && controller.isModified()) {
	      markPresetModified(gui.getRoot(), true);
	    }
	
	    return val;
	  }, controller.setValue);
	}
	
	function recallSavedValue(gui, controller) {
	  // Find the topmost GUI, that's where remembered objects live.
	  var root = gui.getRoot();
	
	  // Does the object we're controlling match anything we've been told to
	  // remember?
	  var matchedIndex = root.__rememberedObjects.indexOf(controller.object);
	
	  // Why yes, it does!
	  if (matchedIndex !== -1) {
	    // Let me fetch a map of controllers for thcommon.isObject.
	    var controllerMap = root.__rememberedObjectIndecesToControllers[matchedIndex];
	
	    // Ohp, I believe this is the first controller we've created for this
	    // object. Lets make the map fresh.
	    if (controllerMap === undefined) {
	      controllerMap = {};
	      root.__rememberedObjectIndecesToControllers[matchedIndex] = controllerMap;
	    }
	
	    // Keep track of this controller
	    controllerMap[controller.property] = controller;
	
	    // Okay, now have we saved any values for this controller?
	    if (root.load && root.load.remembered) {
	      var presetMap = root.load.remembered;
	
	      // Which preset are we trying to load?
	      var preset = undefined;
	
	      if (presetMap[gui.preset]) {
	        preset = presetMap[gui.preset];
	      } else if (presetMap[DEFAULT_DEFAULT_PRESET_NAME]) {
	        // Uhh, you can have the default instead?
	        preset = presetMap[DEFAULT_DEFAULT_PRESET_NAME];
	      } else {
	        // Nada.
	        return;
	      }
	
	      // Did the loaded object remember thcommon.isObject? &&  Did we remember this particular property?
	      if (preset[matchedIndex] && preset[matchedIndex][controller.property] !== undefined) {
	        // We did remember something for this guy ...
	        var value = preset[matchedIndex][controller.property];
	
	        // And that's what it is.
	        controller.initialValue = value;
	        controller.setValue(value);
	      }
	    }
	  }
	}
	
	function add(gui, object, property, params) {
	  if (object[property] === undefined) {
	    throw new Error('Object "' + object + '" has no property "' + property + '"');
	  }
	
	  var controller = undefined;
	
	  if (params.color) {
	    controller = new _controllersColorController2['default'](object, property);
	  } else {
	    var factoryArgs = [object, property].concat(params.factoryArgs);
	    controller = _controllersControllerFactory2['default'].apply(gui, factoryArgs);
	  }
	
	  if (params.before instanceof _controllersController2['default']) {
	    params.before = params.before.__li;
	  }
	
	  recallSavedValue(gui, controller);
	
	  _domDom2['default'].addClass(controller.domElement, 'c');
	
	  var name = document.createElement('span');
	  _domDom2['default'].addClass(name, 'property-name');
	  name.innerHTML = controller.property;
	
	  var container = document.createElement('div');
	  container.appendChild(name);
	  container.appendChild(controller.domElement);
	
	  var li = addRow(gui, container, params.before);
	
	  _domDom2['default'].addClass(li, GUI.CLASS_CONTROLLER_ROW);
	  if (controller instanceof _controllersColorController2['default']) {
	    _domDom2['default'].addClass(li, 'color');
	  } else {
	    _domDom2['default'].addClass(li, typeof controller.getValue());
	  }
	
	  augmentController(gui, li, controller);
	
	  gui.__controllers.push(controller);
	
	  return controller;
	}
	
	function getLocalStorageHash(gui, key) {
	  // TODO how does this deal with multiple GUI's?
	  return document.location.href + '.' + key;
	}
	
	function addPresetOption(gui, name, setSelected) {
	  var opt = document.createElement('option');
	  opt.innerHTML = name;
	  opt.value = name;
	  gui.__preset_select.appendChild(opt);
	  if (setSelected) {
	    gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
	  }
	}
	
	function showHideExplain(gui, explain) {
	  explain.style.display = gui.useLocalStorage ? 'block' : 'none';
	}
	
	function addSaveMenu(gui) {
	  var div = gui.__save_row = document.createElement('li');
	
	  _domDom2['default'].addClass(gui.domElement, 'has-save');
	
	  gui.__ul.insertBefore(div, gui.__ul.firstChild);
	
	  _domDom2['default'].addClass(div, 'save-row');
	
	  var gears = document.createElement('span');
	  gears.innerHTML = '&nbsp;';
	  _domDom2['default'].addClass(gears, 'button gears');
	
	  // TODO replace with FunctionController
	  var button = document.createElement('span');
	  button.innerHTML = 'Save';
	  _domDom2['default'].addClass(button, 'button');
	  _domDom2['default'].addClass(button, 'save');
	
	  var button2 = document.createElement('span');
	  button2.innerHTML = 'New';
	  _domDom2['default'].addClass(button2, 'button');
	  _domDom2['default'].addClass(button2, 'save-as');
	
	  var button3 = document.createElement('span');
	  button3.innerHTML = 'Revert';
	  _domDom2['default'].addClass(button3, 'button');
	  _domDom2['default'].addClass(button3, 'revert');
	
	  var select = gui.__preset_select = document.createElement('select');
	
	  if (gui.load && gui.load.remembered) {
	    _utilsCommon2['default'].each(gui.load.remembered, function (value, key) {
	      addPresetOption(gui, key, key === gui.preset);
	    });
	  } else {
	    addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
	  }
	
	  _domDom2['default'].bind(select, 'change', function () {
	    for (var index = 0; index < gui.__preset_select.length; index++) {
	      gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
	    }
	
	    gui.preset = this.value;
	  });
	
	  div.appendChild(select);
	  div.appendChild(gears);
	  div.appendChild(button);
	  div.appendChild(button2);
	  div.appendChild(button3);
	
	  if (SUPPORTS_LOCAL_STORAGE) {
	    (function () {
	      var explain = document.getElementById('dg-local-explain');
	      var localStorageCheckBox = document.getElementById('dg-local-storage');
	      var saveLocally = document.getElementById('dg-save-locally');
	
	      saveLocally.style.display = 'block';
	
	      if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
	        localStorageCheckBox.setAttribute('checked', 'checked');
	      }
	
	      showHideExplain(gui, explain);
	
	      // TODO: Use a boolean controller, fool!
	      _domDom2['default'].bind(localStorageCheckBox, 'change', function () {
	        gui.useLocalStorage = !gui.useLocalStorage;
	        showHideExplain(gui, explain);
	      });
	    })();
	  }
	
	  var newConstructorTextArea = document.getElementById('dg-new-constructor');
	
	  _domDom2['default'].bind(newConstructorTextArea, 'keydown', function (e) {
	    if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
	      SAVE_DIALOGUE.hide();
	    }
	  });
	
	  _domDom2['default'].bind(gears, 'click', function () {
	    newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
	    SAVE_DIALOGUE.show();
	    newConstructorTextArea.focus();
	    newConstructorTextArea.select();
	  });
	
	  _domDom2['default'].bind(button, 'click', function () {
	    gui.save();
	  });
	
	  _domDom2['default'].bind(button2, 'click', function () {
	    var presetName = prompt('Enter a new preset name.');
	    if (presetName) {
	      gui.saveAs(presetName);
	    }
	  });
	
	  _domDom2['default'].bind(button3, 'click', function () {
	    gui.revert();
	  });
	
	  // div.appendChild(button2);
	}
	
	function addResizeHandle(gui) {
	  var pmouseX = undefined;
	
	  gui.__resize_handle = document.createElement('div');
	
	  _utilsCommon2['default'].extend(gui.__resize_handle.style, {
	
	    width: '6px',
	    marginLeft: '-3px',
	    height: '200px',
	    cursor: 'ew-resize',
	    position: 'absolute'
	    // border: '1px solid blue'
	
	  });
	
	  function drag(e) {
	    e.preventDefault();
	
	    gui.width += pmouseX - e.clientX;
	    gui.onResize();
	    pmouseX = e.clientX;
	
	    return false;
	  }
	
	  function dragStop() {
	    _domDom2['default'].removeClass(gui.__closeButton, GUI.CLASS_DRAG);
	    _domDom2['default'].unbind(window, 'mousemove', drag);
	    _domDom2['default'].unbind(window, 'mouseup', dragStop);
	  }
	
	  function dragStart(e) {
	    e.preventDefault();
	
	    pmouseX = e.clientX;
	
	    _domDom2['default'].addClass(gui.__closeButton, GUI.CLASS_DRAG);
	    _domDom2['default'].bind(window, 'mousemove', drag);
	    _domDom2['default'].bind(window, 'mouseup', dragStop);
	
	    return false;
	  }
	
	  _domDom2['default'].bind(gui.__resize_handle, 'mousedown', dragStart);
	  _domDom2['default'].bind(gui.__closeButton, 'mousedown', dragStart);
	
	  gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);
	}
	
	function setWidth(gui, w) {
	  gui.domElement.style.width = w + 'px';
	  // Auto placed save-rows are position fixed, so we have to
	  // set the width manually if we want it to bleed to the edge
	  if (gui.__save_row && gui.autoPlace) {
	    gui.__save_row.style.width = w + 'px';
	  }
	  if (gui.__closeButton) {
	    gui.__closeButton.style.width = w + 'px';
	  }
	}
	
	function getCurrentPreset(gui, useInitialValues) {
	  var toReturn = {};
	
	  // For each object I'm remembering
	  _utilsCommon2['default'].each(gui.__rememberedObjects, function (val, index) {
	    var savedValues = {};
	
	    // The controllers I've made for thcommon.isObject by property
	    var controllerMap = gui.__rememberedObjectIndecesToControllers[index];
	
	    // Remember each value for each property
	    _utilsCommon2['default'].each(controllerMap, function (controller, property) {
	      savedValues[property] = useInitialValues ? controller.initialValue : controller.getValue();
	    });
	
	    // Save the values for thcommon.isObject
	    toReturn[index] = savedValues;
	  });
	
	  return toReturn;
	}
	
	function setPresetSelectIndex(gui) {
	  for (var index = 0; index < gui.__preset_select.length; index++) {
	    if (gui.__preset_select[index].value === gui.preset) {
	      gui.__preset_select.selectedIndex = index;
	    }
	  }
	}
	
	function updateDisplays(controllerArray) {
	  if (controllerArray.length !== 0) {
	    _utilsRequestAnimationFrame2['default'](function () {
	      updateDisplays(controllerArray);
	    });
	  }
	
	  _utilsCommon2['default'].each(controllerArray, function (c) {
	    c.updateDisplay();
	  });
	}
	
	module.exports = GUI;

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>";

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(25);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(19)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(18)();
	// imports
	
	
	// module
	exports.push([module.id, ".dg {\n  /** Clear list styles */\n  /* Auto-place container */\n  /* Auto-placed GUI's */\n  /* Line items that don't contain folders. */\n  /** Folder names */\n  /** Hides closed items */\n  /** Controller row */\n  /** Name-half (left) */\n  /** Controller-half (right) */\n  /** Controller placement */\n  /** Shorter number boxes when slider is present. */\n  /** Ensure the entire boolean and function row shows a hand */ }\n  .dg ul {\n    list-style: none;\n    margin: 0;\n    padding: 0;\n    width: 100%;\n    clear: both; }\n  .dg.ac {\n    position: fixed;\n    top: 0;\n    left: 0;\n    right: 0;\n    height: 0;\n    z-index: 0; }\n  .dg:not(.ac) .main {\n    /** Exclude mains in ac so that we don't hide close button */\n    overflow: hidden; }\n  .dg.main {\n    -webkit-transition: opacity 0.1s linear;\n    -o-transition: opacity 0.1s linear;\n    -moz-transition: opacity 0.1s linear;\n    transition: opacity 0.1s linear; }\n    .dg.main.taller-than-window {\n      overflow-y: auto; }\n      .dg.main.taller-than-window .close-button {\n        opacity: 1;\n        /* TODO, these are style notes */\n        margin-top: -1px;\n        border-top: 1px solid #2c2c2c; }\n    .dg.main ul.closed .close-button {\n      opacity: 1 !important; }\n    .dg.main:hover .close-button,\n    .dg.main .close-button.drag {\n      opacity: 1; }\n    .dg.main .close-button {\n      /*opacity: 0;*/\n      -webkit-transition: opacity 0.1s linear;\n      -o-transition: opacity 0.1s linear;\n      -moz-transition: opacity 0.1s linear;\n      transition: opacity 0.1s linear;\n      border: 0;\n      position: absolute;\n      line-height: 19px;\n      height: 20px;\n      /* TODO, these are style notes */\n      cursor: pointer;\n      text-align: center;\n      background-color: #000; }\n      .dg.main .close-button:hover {\n        background-color: #111; }\n  .dg.a {\n    float: right;\n    margin-right: 15px;\n    overflow-x: hidden; }\n    .dg.a.has-save > ul {\n      margin-top: 27px; }\n      .dg.a.has-save > ul.closed {\n        margin-top: 0; }\n    .dg.a .save-row {\n      position: fixed;\n      top: 0;\n      z-index: 1002; }\n  .dg li {\n    -webkit-transition: height 0.1s ease-out;\n    -o-transition: height 0.1s ease-out;\n    -moz-transition: height 0.1s ease-out;\n    transition: height 0.1s ease-out; }\n  .dg li:not(.folder) {\n    cursor: auto;\n    height: 27px;\n    line-height: 27px;\n    overflow: hidden;\n    padding: 0 4px 0 5px; }\n  .dg li.folder {\n    padding: 0;\n    border-left: 4px solid transparent; }\n  .dg li.title {\n    cursor: pointer;\n    margin-left: -4px; }\n  .dg .closed li:not(.title),\n  .dg .closed ul li,\n  .dg .closed ul li > * {\n    height: 0;\n    overflow: hidden;\n    border: 0; }\n  .dg .cr {\n    clear: both;\n    padding-left: 3px;\n    height: 27px; }\n  .dg .property-name {\n    cursor: default;\n    float: left;\n    clear: left;\n    width: 40%;\n    overflow: hidden;\n    text-overflow: ellipsis; }\n  .dg .c {\n    float: left;\n    width: 60%; }\n  .dg .c input[type=text] {\n    border: 0;\n    margin-top: 4px;\n    padding: 3px;\n    width: 100%;\n    float: right; }\n  .dg .has-slider input[type=text] {\n    width: 30%;\n    /*display: none;*/\n    margin-left: 0; }\n  .dg .slider {\n    float: left;\n    width: 66%;\n    margin-left: -5px;\n    margin-right: 0;\n    height: 19px;\n    margin-top: 4px; }\n  .dg .slider-fg {\n    height: 100%; }\n  .dg .c input[type=checkbox] {\n    margin-top: 9px; }\n  .dg .c select {\n    margin-top: 5px; }\n  .dg .cr.function,\n  .dg .cr.function .property-name, .dg .cr.function *,\n  .dg .cr.boolean,\n  .dg .cr.boolean * {\n    cursor: pointer; }\n  .dg .selector {\n    display: none;\n    position: absolute;\n    margin-left: -9px;\n    margin-top: 23px;\n    z-index: 10; }\n  .dg .c:hover .selector,\n  .dg .selector.drag {\n    display: block; }\n  .dg li.save-row {\n    padding: 0; }\n    .dg li.save-row .button {\n      display: inline-block;\n      padding: 0px 6px; }\n  .dg.dialogue {\n    background-color: #222;\n    width: 460px;\n    padding: 15px;\n    font-size: 13px;\n    line-height: 15px; }\n\n/* TODO Separate style and structure */\n#dg-new-constructor {\n  padding: 10px;\n  color: #222;\n  font-family: Monaco, monospace;\n  font-size: 10px;\n  border: 0;\n  resize: none;\n  box-shadow: inset 1px 1px 1px #888;\n  word-wrap: break-word;\n  margin: 12px 0;\n  display: block;\n  width: 440px;\n  overflow-y: scroll;\n  height: 100px;\n  position: relative; }\n\n#dg-local-explain {\n  display: none;\n  font-size: 11px;\n  line-height: 17px;\n  border-radius: 3px;\n  background-color: #333;\n  padding: 8px;\n  margin-top: 10px; }\n  #dg-local-explain code {\n    font-size: 10px; }\n\n#dat-gui-save-locally {\n  display: none; }\n\n/** Main type */\n.dg {\n  color: #eee;\n  font: 11px 'Lucida Grande', sans-serif;\n  text-shadow: 0 -1px 0 #111;\n  /** Auto place */\n  /* Controller row, <li> */\n  /** Controllers */ }\n  .dg.main {\n    /** Scrollbar */ }\n    .dg.main::-webkit-scrollbar {\n      width: 5px;\n      background: #1a1a1a; }\n    .dg.main::-webkit-scrollbar-corner {\n      height: 0;\n      display: none; }\n    .dg.main::-webkit-scrollbar-thumb {\n      border-radius: 5px;\n      background: #676767; }\n  .dg li:not(.folder) {\n    background: #1a1a1a;\n    border-bottom: 1px solid #2c2c2c; }\n  .dg li.save-row {\n    line-height: 25px;\n    background: #dad5cb;\n    border: 0; }\n    .dg li.save-row select {\n      margin-left: 5px;\n      width: 108px; }\n    .dg li.save-row .button {\n      margin-left: 5px;\n      margin-top: 1px;\n      border-radius: 2px;\n      font-size: 9px;\n      line-height: 7px;\n      padding: 4px 4px 5px 4px;\n      background: #c5bdad;\n      color: #fff;\n      text-shadow: 0 1px 0 #b0a58f;\n      box-shadow: 0 -1px 0 #b0a58f;\n      cursor: pointer; }\n      .dg li.save-row .button.gears {\n        background: #c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;\n        height: 7px;\n        width: 8px; }\n      .dg li.save-row .button:hover {\n        background-color: #bab19e;\n        box-shadow: 0 -1px 0 #b0a58f; }\n  .dg li.folder {\n    border-bottom: 0; }\n  .dg li.title {\n    padding-left: 16px;\n    background: #000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;\n    cursor: pointer;\n    border-bottom: 1px solid rgba(255, 255, 255, 0.2); }\n  .dg .closed li.title {\n    background-image: url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==); }\n  .dg .cr.boolean {\n    border-left: 3px solid #806787; }\n  .dg .cr.color {\n    border-left: 3px solid; }\n  .dg .cr.function {\n    border-left: 3px solid #e61d5f; }\n  .dg .cr.number {\n    border-left: 3px solid #2FA1D6; }\n    .dg .cr.number input[type=text] {\n      color: #2FA1D6; }\n  .dg .cr.string {\n    border-left: 3px solid #1ed36f; }\n    .dg .cr.string input[type=text] {\n      color: #1ed36f; }\n  .dg .cr.function:hover,\n  .dg .cr.boolean:hover {\n    background: #111; }\n  .dg .c input[type=text] {\n    background: #303030;\n    outline: none; }\n    .dg .c input[type=text]:hover {\n      background: #3c3c3c; }\n    .dg .c input[type=text]:focus {\n      background: #494949;\n      color: #fff; }\n  .dg .c .slider {\n    background: #303030;\n    cursor: ew-resize; }\n  .dg .c .slider-fg {\n    background: #2FA1D6; }\n  .dg .c .slider:hover {\n    background: #3c3c3c; }\n    .dg .c .slider:hover .slider-fg {\n      background: #44abda; }\n", ""]);
	
	// exports


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _OptionController = __webpack_require__(10);
	
	var _OptionController2 = _interopRequireDefault(_OptionController);
	
	var _NumberControllerBox = __webpack_require__(13);
	
	var _NumberControllerBox2 = _interopRequireDefault(_NumberControllerBox);
	
	var _NumberControllerSlider = __webpack_require__(14);
	
	var _NumberControllerSlider2 = _interopRequireDefault(_NumberControllerSlider);
	
	var _StringController = __webpack_require__(11);
	
	var _StringController2 = _interopRequireDefault(_StringController);
	
	var _FunctionController = __webpack_require__(20);
	
	var _FunctionController2 = _interopRequireDefault(_FunctionController);
	
	var _BooleanController = __webpack_require__(8);
	
	var _BooleanController2 = _interopRequireDefault(_BooleanController);
	
	var _utilsCommon = __webpack_require__(5);
	
	var _utilsCommon2 = _interopRequireDefault(_utilsCommon);
	
	var ControllerFactory = function ControllerFactory(object, property) {
	  var initialValue = object[property];
	
	  // Providing options?
	  if (_utilsCommon2['default'].isArray(arguments[2]) || _utilsCommon2['default'].isObject(arguments[2])) {
	    return new _OptionController2['default'](object, property, arguments[2]);
	  }
	
	  // Providing a map?
	  if (_utilsCommon2['default'].isNumber(initialValue)) {
	    if (_utilsCommon2['default'].isNumber(arguments[2]) && _utilsCommon2['default'].isNumber(arguments[3])) {
	      // Has min and max.
	      if (_utilsCommon2['default'].isNumber(arguments[4])) {
	        // has step
	        return new _NumberControllerSlider2['default'](object, property, arguments[2], arguments[3], arguments[4]);
	      }
	
	      return new _NumberControllerSlider2['default'](object, property, arguments[2], arguments[3]);
	    }
	    return new _NumberControllerBox2['default'](object, property, { min: arguments[2], max: arguments[3] });
	  }
	
	  if (_utilsCommon2['default'].isString(initialValue)) {
	    return new _StringController2['default'](object, property);
	  }
	
	  if (_utilsCommon2['default'].isFunction(initialValue)) {
	    return new _FunctionController2['default'](object, property, '');
	  }
	
	  if (_utilsCommon2['default'].isBoolean(initialValue)) {
	    return new _BooleanController2['default'](object, property);
	  }
	};
	
	exports['default'] = ControllerFactory;
	module.exports = exports['default'];

/***/ },
/* 27 */
/***/ function(module, exports) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	
	"use strict";
	
	exports.__esModule = true;
	
	exports["default"] = function () {
	  function requestAnimationFrame(callback) {
	    // TODO: Get rid of window
	    window.setTimeout(callback, 1000 / 60);
	  }
	
	  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame;
	};
	
	module.exports = exports["default"];

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * dat-gui JavaScript Controller Library
	 * http://code.google.com/p/dat-gui
	 *
	 * Copyright 2011 Data Arts Team, Google Creative Lab
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */
	
	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _domDom = __webpack_require__(9);
	
	var _domDom2 = _interopRequireDefault(_domDom);
	
	var _utilsCommon = __webpack_require__(5);
	
	var _utilsCommon2 = _interopRequireDefault(_utilsCommon);
	
	var CenteredDiv = (function () {
	  function CenteredDiv() {
	    _classCallCheck(this, CenteredDiv);
	
	    this.backgroundElement = document.createElement('div');
	    _utilsCommon2['default'].extend(this.backgroundElement.style, {
	      backgroundColor: 'rgba(0,0,0,0.8)',
	      top: 0,
	      left: 0,
	      display: 'none',
	      zIndex: '1000',
	      opacity: 0,
	      WebkitTransition: 'opacity 0.2s linear',
	      transition: 'opacity 0.2s linear'
	    });
	
	    _domDom2['default'].makeFullscreen(this.backgroundElement);
	    this.backgroundElement.style.position = 'fixed';
	
	    this.domElement = document.createElement('div');
	    _utilsCommon2['default'].extend(this.domElement.style, {
	      position: 'fixed',
	      display: 'none',
	      zIndex: '1001',
	      opacity: 0,
	      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear',
	      transition: 'transform 0.2s ease-out, opacity 0.2s linear'
	    });
	
	    document.body.appendChild(this.backgroundElement);
	    document.body.appendChild(this.domElement);
	
	    var _this = this;
	    _domDom2['default'].bind(this.backgroundElement, 'click', function () {
	      _this.hide();
	    });
	  }
	
	  CenteredDiv.prototype.show = function show() {
	    var _this = this;
	
	    this.backgroundElement.style.display = 'block';
	
	    this.domElement.style.display = 'block';
	    this.domElement.style.opacity = 0;
	    //    this.domElement.style.top = '52%';
	    this.domElement.style.webkitTransform = 'scale(1.1)';
	
	    this.layout();
	
	    _utilsCommon2['default'].defer(function () {
	      _this.backgroundElement.style.opacity = 1;
	      _this.domElement.style.opacity = 1;
	      _this.domElement.style.webkitTransform = 'scale(1)';
	    });
	  };
	
	  /**
	   * Hide centered div
	   */
	
	  CenteredDiv.prototype.hide = function hide() {
	    var _this = this;
	
	    var hide = function hide() {
	      _this.domElement.style.display = 'none';
	      _this.backgroundElement.style.display = 'none';
	
	      _domDom2['default'].unbind(_this.domElement, 'webkitTransitionEnd', hide);
	      _domDom2['default'].unbind(_this.domElement, 'transitionend', hide);
	      _domDom2['default'].unbind(_this.domElement, 'oTransitionEnd', hide);
	    };
	
	    _domDom2['default'].bind(this.domElement, 'webkitTransitionEnd', hide);
	    _domDom2['default'].bind(this.domElement, 'transitionend', hide);
	    _domDom2['default'].bind(this.domElement, 'oTransitionEnd', hide);
	
	    this.backgroundElement.style.opacity = 0;
	    //    this.domElement.style.top = '48%';
	    this.domElement.style.opacity = 0;
	    this.domElement.style.webkitTransform = 'scale(1.1)';
	  };
	
	  CenteredDiv.prototype.layout = function layout() {
	    this.domElement.style.left = window.innerWidth / 2 - _domDom2['default'].getWidth(this.domElement) / 2 + 'px';
	    this.domElement.style.top = window.innerHeight / 2 - _domDom2['default'].getHeight(this.domElement) / 2 + 'px';
	  };
	
	  return CenteredDiv;
	})();
	
	exports['default'] = CenteredDiv;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=dat.gui.js.map
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

/**
 * k-d Tree JavaScript - V 1.01
 *
 * https://github.com/ubilabs/kd-tree-javascript
 *
 * @author Mircea Pricop <pricop@ubilabs.net>, 2012
 * @author Martin Kleppe <kleppe@ubilabs.net>, 2012
 * @author Ubilabs http://ubilabs.net, 2012
 * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
 */

 (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports === 'object') {
        factory(exports);
    } else {
        factory((root.commonJsStrict = {}));
    }
}(this, function (exports) {
  function Node(obj, dimension, parent) {
    this.obj = obj;
    this.left = null;
    this.right = null;
    this.parent = parent;
    this.dimension = dimension;
  }

  function kdTree(points, metric, dimensions) {

    var self = this;
    
    function buildTree(points, depth, parent) {
      var dim = depth % dimensions.length,
        median,
        node;

      if (points.length === 0) {
        return null;
      }
      if (points.length === 1) {
        return new Node(points[0], dim, parent);
      }

      points.sort(function (a, b) {
        return a[dimensions[dim]] - b[dimensions[dim]];
      });

      median = Math.floor(points.length / 2);
      node = new Node(points[median], dim, parent);
      node.left = buildTree(points.slice(0, median), depth + 1, node);
      node.right = buildTree(points.slice(median + 1), depth + 1, node);

      return node;
    }

    // Reloads a serialied tree
    function loadTree (data) {
      // Just need to restore the `parent` parameter
      self.root = data;

      function restoreParent (root) {
        if (root.left) {
          root.left.parent = root;
          restoreParent(root.left);
        }

        if (root.right) {
          root.right.parent = root;
          restoreParent(root.right);
        }
      }

      restoreParent(self.root);
    }
    
    // If points is not an array, assume we're loading a pre-built tree
    if (!Array.isArray(points)) loadTree(points, metric, dimensions);
    else this.root = buildTree(points, 0, null);

    // Convert to a JSON serializable structure; this just requires removing 
    // the `parent` property
    this.toJSON = function (src) {
      if (!src) src = this.root;
      var dest = new Node(src.obj, src.dimension, null);
      if (src.left) dest.left = self.toJSON(src.left);
      if (src.right) dest.right = self.toJSON(src.right);
      return dest;
    };

    this.insert = function (point) {
      function innerSearch(node, parent) {

        if (node === null) {
          return parent;
        }

        var dimension = dimensions[node.dimension];
        if (point[dimension] < node.obj[dimension]) {
          return innerSearch(node.left, node);
        } else {
          return innerSearch(node.right, node);
        }
      }

      var insertPosition = innerSearch(this.root, null),
        newNode,
        dimension;

      if (insertPosition === null) {
        this.root = new Node(point, 0, null);
        return;
      }

      newNode = new Node(point, (insertPosition.dimension + 1) % dimensions.length, insertPosition);
      dimension = dimensions[insertPosition.dimension];

      if (point[dimension] < insertPosition.obj[dimension]) {
        insertPosition.left = newNode;
      } else {
        insertPosition.right = newNode;
      }
    };

    this.remove = function (point) {
      var node;

      function nodeSearch(node) {
        if (node === null) {
          return null;
        }

        if (node.obj === point) {
          return node;
        }

        var dimension = dimensions[node.dimension];

        if (point[dimension] < node.obj[dimension]) {
          return nodeSearch(node.left, node);
        } else {
          return nodeSearch(node.right, node);
        }
      }

      function removeNode(node) {
        var nextNode,
          nextObj,
          pDimension;

        function findMin(node, dim) {
          var dimension,
            own,
            left,
            right,
            min;

          if (node === null) {
            return null;
          }

          dimension = dimensions[dim];

          if (node.dimension === dim) {
            if (node.left !== null) {
              return findMin(node.left, dim);
            }
            return node;
          }

          own = node.obj[dimension];
          left = findMin(node.left, dim);
          right = findMin(node.right, dim);
          min = node;

          if (left !== null && left.obj[dimension] < own) {
            min = left;
          }
          if (right !== null && right.obj[dimension] < min.obj[dimension]) {
            min = right;
          }
          return min;
        }

        if (node.left === null && node.right === null) {
          if (node.parent === null) {
            self.root = null;
            return;
          }

          pDimension = dimensions[node.parent.dimension];

          if (node.obj[pDimension] < node.parent.obj[pDimension]) {
            node.parent.left = null;
          } else {
            node.parent.right = null;
          }
          return;
        }

        // If the right subtree is not empty, swap with the minimum element on the
        // node's dimension. If it is empty, we swap the left and right subtrees and
        // do the same.
        if (node.right !== null) {
          nextNode = findMin(node.right, node.dimension);
          nextObj = nextNode.obj;
          removeNode(nextNode);          
          node.obj = nextObj;
        } else {
          nextNode = findMin(node.left, node.dimension);
          nextObj = nextNode.obj;
          removeNode(nextNode);
          node.right = node.left;
          node.left = null;
          node.obj = nextObj;
        }

      }

      node = nodeSearch(self.root);

      if (node === null) { return; }

      removeNode(node);
    };

    this.nearest = function (point, maxNodes, maxDistance) {
      var i,
        result,
        bestNodes;

      bestNodes = new BinaryHeap(
        function (e) { return -e[1]; }
      );

      function nearestSearch(node) {
        var bestChild,
          dimension = dimensions[node.dimension],
          ownDistance = metric(point, node.obj),
          linearPoint = {},
          linearDistance,
          otherChild,
          i;

        function saveNode(node, distance) {
          bestNodes.push([node, distance]);
          if (bestNodes.size() > maxNodes) {
            bestNodes.pop();
          }
        }

        for (i = 0; i < dimensions.length; i += 1) {
          if (i === node.dimension) {
            linearPoint[dimensions[i]] = point[dimensions[i]];
          } else {
            linearPoint[dimensions[i]] = node.obj[dimensions[i]];
          }
        }

        linearDistance = metric(linearPoint, node.obj);

        if (node.right === null && node.left === null) {
          if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[1]) {
            saveNode(node, ownDistance);
          }
          return;
        }

        if (node.right === null) {
          bestChild = node.left;
        } else if (node.left === null) {
          bestChild = node.right;
        } else {
          if (point[dimension] < node.obj[dimension]) {
            bestChild = node.left;
          } else {
            bestChild = node.right;
          }
        }

        nearestSearch(bestChild);

        if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[1]) {
          saveNode(node, ownDistance);
        }

        if (bestNodes.size() < maxNodes || Math.abs(linearDistance) < bestNodes.peek()[1]) {
          if (bestChild === node.left) {
            otherChild = node.right;
          } else {
            otherChild = node.left;
          }
          if (otherChild !== null) {
            nearestSearch(otherChild);
          }
        }
      }

      if (maxDistance) {
        for (i = 0; i < maxNodes; i += 1) {
          bestNodes.push([null, maxDistance]);
        }
      }

      if(self.root)
        nearestSearch(self.root);

      result = [];

      for (i = 0; i < Math.min(maxNodes, bestNodes.content.length); i += 1) {
        if (bestNodes.content[i][0]) {
          result.push([bestNodes.content[i][0].obj, bestNodes.content[i][1]]);
        }
      }
      return result;
    };

    this.balanceFactor = function () {
      function height(node) {
        if (node === null) {
          return 0;
        }
        return Math.max(height(node.left), height(node.right)) + 1;
      }

      function count(node) {
        if (node === null) {
          return 0;
        }
        return count(node.left) + count(node.right) + 1;
      }

      return height(self.root) / (Math.log(count(self.root)) / Math.log(2));
    };
  }

  // Binary heap implementation from:
  // http://eloquentjavascript.net/appendix2.html

  function BinaryHeap(scoreFunction){
    this.content = [];
    this.scoreFunction = scoreFunction;
  }

  BinaryHeap.prototype = {
    push: function(element) {
      // Add the new element to the end of the array.
      this.content.push(element);
      // Allow it to bubble up.
      this.bubbleUp(this.content.length - 1);
    },

    pop: function() {
      // Store the first element so we can return it later.
      var result = this.content[0];
      // Get the element at the end of the array.
      var end = this.content.pop();
      // If there are any elements left, put the end element at the
      // start, and let it sink down.
      if (this.content.length > 0) {
        this.content[0] = end;
        this.sinkDown(0);
      }
      return result;
    },

    peek: function() {
      return this.content[0];
    },

    remove: function(node) {
      var len = this.content.length;
      // To remove a value, we must search through the array to find
      // it.
      for (var i = 0; i < len; i++) {
        if (this.content[i] == node) {
          // When it is found, the process seen in 'pop' is repeated
          // to fill up the hole.
          var end = this.content.pop();
          if (i != len - 1) {
            this.content[i] = end;
            if (this.scoreFunction(end) < this.scoreFunction(node))
              this.bubbleUp(i);
            else
              this.sinkDown(i);
          }
          return;
        }
      }
      throw new Error("Node not found.");
    },

    size: function() {
      return this.content.length;
    },

    bubbleUp: function(n) {
      // Fetch the element that has to be moved.
      var element = this.content[n];
      // When at 0, an element can not go up any further.
      while (n > 0) {
        // Compute the parent element's index, and fetch it.
        var parentN = Math.floor((n + 1) / 2) - 1,
            parent = this.content[parentN];
        // Swap the elements if the parent is greater.
        if (this.scoreFunction(element) < this.scoreFunction(parent)) {
          this.content[parentN] = element;
          this.content[n] = parent;
          // Update 'n' to continue at the new position.
          n = parentN;
        }
        // Found a parent that is less, no need to move it further.
        else {
          break;
        }
      }
    },

    sinkDown: function(n) {
      // Look up the target element and its score.
      var length = this.content.length,
          element = this.content[n],
          elemScore = this.scoreFunction(element);

      while(true) {
        // Compute the indices of the child elements.
        var child2N = (n + 1) * 2, child1N = child2N - 1;
        // This is used to store the new position of the element,
        // if any.
        var swap = null;
        // If the first child exists (is inside the array)...
        if (child1N < length) {
          // Look it up and compute its score.
          var child1 = this.content[child1N],
              child1Score = this.scoreFunction(child1);
          // If the score is less than our element's, we need to swap.
          if (child1Score < elemScore)
            swap = child1N;
        }
        // Do the same checks for the other child.
        if (child2N < length) {
          var child2 = this.content[child2N],
              child2Score = this.scoreFunction(child2);
          if (child2Score < (swap == null ? elemScore : child1Score)){
            swap = child2N;
          }
        }

        // If the element needs to be moved, swap it, and continue.
        if (swap != null) {
          this.content[n] = this.content[swap];
          this.content[swap] = element;
          n = swap;
        }
        // Otherwise, we are done.
        else {
          break;
        }
      }
    }
  };
  
  this.kdTree = kdTree;
  
  exports.kdTree = kdTree;
  exports.BinaryHeap = BinaryHeap;
}));

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var emulatedConsole;
        var lastLogId = (-Infinity).toString();
        //
        // Restore console.
        !function (window, document) {
            jQuery(document).ready(function () {
                emulatedConsole = jQuery('<iframe>').hide().appendTo('body')[0].contentWindow.console;
            });
        }(window, document);
        window.log = function () {
            if (window.logDebugging) {
                var stackFramesProcessor = function (stackframes) {
                    var stringifiedStack = stackframes.map(function (sf) {
                        return sf.toString();
                    }).join('\n');
                    return stringifiedStack.hashCode();
                };
                var thisId = stackFramesProcessor(StackTrace.getSync()).toString() + arguments[0].toString().hashCode();
                if (lastLogId != thisId) {
                    lastLogId = thisId;
                    emulatedConsole.log.apply(emulatedConsole, arguments);
                }
            }
        };
        // Inspired by PIXI
        // TODO : Review
        window.autobotSaidHello = false;
        window.autobotSayHello = function () {
            if (window.autobotSaidHello) {
                return;
            }
            var url = 'https://github.com/kmataru/kartwars.io-bot/';
            var me = "\n ____  __.               __                      \n|    |/ _| _____ _____ _/  |______ _______ __ __ \n|      <  /     \\\\__  \\\\   __\\__  \\\\_  __ \\  |  \\\n|    |  \\|  Y Y  \\/ __ \\|  |  / __ \\|  | \\/  |  /\n|____|__ \\__|_|  (____  /__| (____  /__|  |____/ \n        \\/     \\/     \\/          \\/             \n";
            if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
                var args = [
                    me + "\n %c %c %c kartwars.io-bot " + window.GM_info.script.version + "  %c  %c  " + url + "  %c %c \uD83D\uDE97%c\uD83D\uDE97%c\uD83D\uDE97 \n\n",
                    'background: #087E8B; padding:5px 0;',
                    'background: #087E8B; padding:5px 0;',
                    'color: #087E8B; background: #030307; padding:5px 0;',
                    'background: #087E8B; padding:5px 0;',
                    'color: #0B3954; background: #BFD7EA; padding:5px 0;',
                    'background: #087E8B; padding:5px 0;',
                    'color: #C81D25; background: #fff; padding:5px 0;',
                    'color: #C81D25; background: #fff; padding:5px 0;',
                    'color: #C81D25; background: #fff; padding:5px 0;',
                ];
                window.log.apply(emulatedConsole, args);
            }
            else if (window.log) {
                // window.log(`kartwars.io-bot ${window.GM_info.script.version} - ${url}`);
                window.log(me + "\nkartwars.io-bot " + window.GM_info.script.version + " - " + url);
            }
            window.autobotSaidHello = true;
        };
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var MethodDecoration;
        (function (MethodDecoration) {
            // TODO : Add comments
            // TODO : Add inspired by
            function intercept(fxInterceptor) {
                return function (target, propKey) {
                    var originalMethod = target[propKey];
                    if (typeof originalMethod !== 'function') {
                        throw new TypeError('@intercept can only be used on methods.');
                    }
                    if (typeof target === 'function') {
                        return {
                            value: function () {
                                var originalArguments = arguments;
                                return fxInterceptor(function () {
                                    return originalMethod.apply(target, originalArguments);
                                });
                            }
                        };
                    }
                    else if (typeof target === 'object') {
                        return {
                            get: function () {
                                var instance = this;
                                Object.defineProperty(instance, propKey.toString(), {
                                    value: function () {
                                        var originalArguments = arguments;
                                        return fxInterceptor(function () {
                                            return originalMethod.apply(instance, originalArguments);
                                        });
                                    }
                                });
                                return instance[propKey];
                            }
                        };
                    }
                };
            }
            MethodDecoration.intercept = intercept;
        })(MethodDecoration = KartwarsBot.MethodDecoration || (KartwarsBot.MethodDecoration = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

/* tslint:disable */
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var MethodDecoration;
        (function (MethodDecoration) {
            function registerTactic(constructor) {
                // constructor
                // constructor.prototype
            }
            MethodDecoration.registerTactic = registerTactic;
        })(MethodDecoration = KartwarsBot.MethodDecoration || (KartwarsBot.MethodDecoration = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

/* tslint:disable */
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var MethodDecoration;
        (function (MethodDecoration) {
            function sealed(constructor) {
                Object.seal(constructor);
                Object.seal(constructor.prototype);
            }
            MethodDecoration.sealed = sealed;
        })(MethodDecoration = KartwarsBot.MethodDecoration || (KartwarsBot.MethodDecoration = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

/* tslint:disable */
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var MethodDecoration;
        (function (MethodDecoration) {
            var TraceRegister = (function () {
                function TraceRegister() {
                }
                TraceRegister.registerMethodName = function (key, value) {
                    TraceRegister.originalNames[key] = value;
                };
                return TraceRegister;
            }());
            //static originalNames: { [key: string]: string };
            //static originalNames: { [key: string]: string }[] = [];
            //static originalNames: { [key: string]: any }[] = [];
            TraceRegister.originalNames = {};
            /**
             * Binds an instance method to the containing class to persist the lexical scope of 'this'.
             * @param target The target class or prototype; used by the TypeScript compiler (omit function call brackets to use as a decorator).
             * @param propKey The property key of the target method; used by the TypeScript compiler (omit function call brackets to use as a decorator).
             */
            function trace(target, propKey) {
                var originalMethod = target[propKey];
                // Ensure the above type-assertion is valid at runtime.
                if (typeof originalMethod !== "function")
                    throw new TypeError("@trace can only be used on methods.");
                if (typeof target === "function") {
                    // Static method, bind to class (if target is of type "function", the method decorator was used on a static method).
                    return {
                        value: function () {
                            return originalMethod.apply(target, arguments);
                        }
                    };
                }
                else if (typeof target === "object") {
                    return {
                        get: function () {
                            //TraceRegister.registerMethodName((arguments.callee as any).name, (propKey as string));
                            var stack = StackTrace.getSync();
                            /*
                            let targetKeys = Object.keys(target);
                            targetKeys.indexOf((propKey as string));
                            */
                            var targetName = target.constructor.toString().match(/\w+/g)[1];
                            TraceRegister.registerMethodName(targetName + "." + propKey, stack[2].functionName);
                            //window.stack = TraceRegister.originalNames;
                            window.stack = StackTrace.getSync();
                            if (window.botFactory && window.botFactory.externalGraph) {
                                window.botFactory.externalGraph.operation();
                            }
                            // window.log('Call 1 ' + (propKey as string), StackTrace.getSync());
                            return originalMethod;
                        }
                    };
                }
            }
            MethodDecoration.trace = trace;
        })(MethodDecoration = KartwarsBot.MethodDecoration || (KartwarsBot.MethodDecoration = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

!function (window) {
	if (!Object.prototype.watch) {
		Object.defineProperty(Object.prototype, "watch", {
			enumerable: false,
			configurable: true,
			writable: false,
			value: function (prop, handler) {
				var oldval = this[prop], newval = oldval, getter = function () {
					return newval;
				}, setter = function (val) {
					oldval = newval;
					return newval = handler.call(this, prop, oldval, val);
				};
				if (delete this[prop]) {
					Object.defineProperty(this, prop, {
						get: getter,
						set: setter,
						enumerable: true,
						configurable: true
					});
				}
			}
		});
	}

	if (!Object.prototype.unwatch) {
		Object.defineProperty(Object.prototype, "unwatch", {
			enumerable: false,
			configurable: true,
			writable: false,
			value: function (prop) {
				var val = this[prop];
				delete this[prop];
				this[prop] = val;
			}
		});
	}

	String.prototype.hashCode = function () {
		var hash = 0;
		if (this.length == 0)
			return hash;
		for (i = 0; i < this.length; i++) {
			char = this.charCodeAt(i);
			hash = ((hash << 5) - hash) + char;
			hash = hash & hash;
		}
		return hash;
	};

	if (!String.prototype.format) {
		String.prototype.format = function () {
			var args = arguments;
			return this.replace(/{(\d+)}/g, function (match, number) {
				return typeof args[number] != 'undefined'
					? args[number]
					: match;
			});
		};
	}
}(window);

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var CarWeapon;
        (function (CarWeapon) {
            CarWeapon[CarWeapon["None"] = 0] = "None";
            CarWeapon[CarWeapon["FastRocket"] = 1] = "FastRocket";
            CarWeapon[CarWeapon["ThreeFastRockets"] = 2] = "ThreeFastRockets";
            CarWeapon[CarWeapon["TeleRocket"] = 3] = "TeleRocket";
            CarWeapon[CarWeapon["Cloak"] = 4] = "Cloak";
            CarWeapon[CarWeapon["Mine"] = 5] = "Mine";
            CarWeapon[CarWeapon["ThreeMines"] = 6] = "ThreeMines";
            CarWeapon[CarWeapon["BigBang"] = 7] = "BigBang";
            CarWeapon[CarWeapon["ThreeTeleRocket"] = 8] = "ThreeTeleRocket";
            CarWeapon[CarWeapon["Shield"] = 9] = "Shield";
            CarWeapon[CarWeapon["Flashes"] = 10] = "Flashes";
            CarWeapon[CarWeapon["Magnet"] = 11] = "Magnet";
            CarWeapon[CarWeapon["HugeBash"] = 12] = "HugeBash";
        })(CarWeapon = KartwarsBot.CarWeapon || (KartwarsBot.CarWeapon = {}));
        var CarWeaponTrigger;
        (function (CarWeaponTrigger) {
            CarWeaponTrigger[CarWeaponTrigger["NotSet"] = 0] = "NotSet";
            CarWeaponTrigger[CarWeaponTrigger["Self"] = 1] = "Self";
            CarWeaponTrigger[CarWeaponTrigger["Front"] = 2] = "Front";
            CarWeaponTrigger[CarWeaponTrigger["Behind"] = 3] = "Behind";
        })(CarWeaponTrigger = KartwarsBot.CarWeaponTrigger || (KartwarsBot.CarWeaponTrigger = {}));
        var CarWeaponSpeed;
        (function (CarWeaponSpeed) {
            CarWeaponSpeed[CarWeaponSpeed["NotSet"] = 0] = "NotSet";
            CarWeaponSpeed[CarWeaponSpeed["NoSpeed"] = 1] = "NoSpeed";
            CarWeaponSpeed[CarWeaponSpeed["MediumSpeed"] = 2] = "MediumSpeed";
            CarWeaponSpeed[CarWeaponSpeed["HighSpeed"] = 3] = "HighSpeed";
        })(CarWeaponSpeed = KartwarsBot.CarWeaponSpeed || (KartwarsBot.CarWeaponSpeed = {}));
        var CollisionElementType;
        (function (CollisionElementType) {
            CollisionElementType[CollisionElementType["Circle"] = 0] = "Circle";
            CollisionElementType[CollisionElementType["Polygon"] = 1] = "Polygon";
        })(CollisionElementType = KartwarsBot.CollisionElementType || (KartwarsBot.CollisionElementType = {}));
        var CollisionElementDangerType;
        (function (CollisionElementDangerType) {
            CollisionElementDangerType[CollisionElementDangerType["NotDefined"] = 0] = "NotDefined";
            CollisionElementDangerType[CollisionElementDangerType["Enemy"] = 1] = "Enemy";
            CollisionElementDangerType[CollisionElementDangerType["Misile"] = 2] = "Misile";
            CollisionElementDangerType[CollisionElementDangerType["TeleMisile"] = 3] = "TeleMisile";
            CollisionElementDangerType[CollisionElementDangerType["Bomb"] = 4] = "Bomb";
            CollisionElementDangerType[CollisionElementDangerType["Mine"] = 5] = "Mine";
        })(CollisionElementDangerType = KartwarsBot.CollisionElementDangerType || (KartwarsBot.CollisionElementDangerType = {}));
        var ShapesIntersectionStatus;
        (function (ShapesIntersectionStatus) {
            ShapesIntersectionStatus[ShapesIntersectionStatus["NoIntersection"] = 1] = "NoIntersection";
            ShapesIntersectionStatus[ShapesIntersectionStatus["Tangent"] = 2] = "Tangent";
            ShapesIntersectionStatus[ShapesIntersectionStatus["ShapeInside"] = 3] = "ShapeInside";
            ShapesIntersectionStatus[ShapesIntersectionStatus["HasIntersections"] = 4] = "HasIntersections";
        })(ShapesIntersectionStatus = KartwarsBot.ShapesIntersectionStatus || (KartwarsBot.ShapesIntersectionStatus = {}));
        var AccelerationFlag;
        (function (AccelerationFlag) {
            AccelerationFlag[AccelerationFlag["NotDefined"] = 0] = "NotDefined";
            AccelerationFlag[AccelerationFlag["Yes"] = 1] = "Yes";
            // TODO : Review
            AccelerationFlag[AccelerationFlag["Default"] = 2] = "Default";
        })(AccelerationFlag = KartwarsBot.AccelerationFlag || (KartwarsBot.AccelerationFlag = {}));
        var IgnoreItemFlag;
        (function (IgnoreItemFlag) {
            IgnoreItemFlag[IgnoreItemFlag["Yes"] = 1] = "Yes";
            IgnoreItemFlag[IgnoreItemFlag["Delete"] = 2] = "Delete";
        })(IgnoreItemFlag = KartwarsBot.IgnoreItemFlag || (KartwarsBot.IgnoreItemFlag = {}));
        var GoalState;
        (function (GoalState) {
            GoalState[GoalState["Invalid"] = 0] = "Invalid";
            GoalState[GoalState["InFront"] = 1] = "InFront";
            GoalState[GoalState["InBack"] = 2] = "InBack";
        })(GoalState = KartwarsBot.GoalState || (KartwarsBot.GoalState = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Data;
        (function (Data) {
            Data.playerTurnRadius = 350 / 2;
            Data.weaponsMagnitudes = {};
            Data.weaponsMagnitudes[KartwarsBot.CarWeapon.None] =
                Data.weaponsMagnitudes[KartwarsBot.CarWeapon.Cloak] =
                    Data.weaponsMagnitudes[KartwarsBot.CarWeapon.Mine] =
                        Data.weaponsMagnitudes[KartwarsBot.CarWeapon.ThreeMines] =
                            Data.weaponsMagnitudes[KartwarsBot.CarWeapon.BigBang] =
                                Data.weaponsMagnitudes[KartwarsBot.CarWeapon.Shield] =
                                    Data.weaponsMagnitudes[KartwarsBot.CarWeapon.Magnet] = 0;
            Data.weaponsMagnitudes[KartwarsBot.CarWeapon.FastRocket] = Data.weaponsMagnitudes[KartwarsBot.CarWeapon.ThreeFastRockets] = 20; // TODO : Verify data
            Data.weaponsMagnitudes[KartwarsBot.CarWeapon.TeleRocket] = Data.weaponsMagnitudes[KartwarsBot.CarWeapon.ThreeTeleRocket] = 15; // TODO : Verify data
            Data.weaponsMagnitudes[KartwarsBot.CarWeapon.Flashes] = 40; // TODO : Verify data
            Data.weaponsMagnitudes[KartwarsBot.CarWeapon.HugeBash] = 12; // TODO : Verify data
        })(Data = KartwarsBot.Data || (KartwarsBot.Data = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var CarWeaponData = (function () {
            function CarWeaponData(weaponType) {
                this.weaponFired = false;
                this.weaponType = weaponType;
            }
            Object.defineProperty(CarWeaponData.prototype, "previousWeaponType", {
                get: function () {
                    return this._previousWeaponType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CarWeaponData.prototype, "weaponType", {
                get: function () {
                    return this._weaponType;
                },
                set: function (value) {
                    if (this._weaponType == value) {
                        return;
                    }
                    if (value == KartwarsBot.CarWeapon.None) {
                        this.weaponFired = false;
                    }
                    this._previousWeaponType = this._weaponType;
                    var thisWeaponType = this._weaponType = value;
                    this._magnitude = KartwarsBot.Data.weaponsMagnitudes[thisWeaponType];
                    //
                    // isLethalWeapon
                    switch (thisWeaponType) {
                        case KartwarsBot.CarWeapon.None:
                        case KartwarsBot.CarWeapon.Cloak:
                        case KartwarsBot.CarWeapon.Magnet:
                            {
                                this._isLethalWeapon = false;
                            }
                            break;
                        default:
                            {
                                this._isLethalWeapon = true;
                            }
                            break;
                    }
                    //
                    // triggerLocation
                    switch (thisWeaponType) {
                        case KartwarsBot.CarWeapon.Cloak:
                        case KartwarsBot.CarWeapon.Magnet:
                        case KartwarsBot.CarWeapon.Shield:
                        case KartwarsBot.CarWeapon.BigBang:
                            {
                                this._triggerLocation = KartwarsBot.CarWeaponTrigger.Self;
                            }
                            break;
                        case KartwarsBot.CarWeapon.FastRocket:
                        case KartwarsBot.CarWeapon.ThreeFastRockets:
                        case KartwarsBot.CarWeapon.TeleRocket:
                        case KartwarsBot.CarWeapon.ThreeTeleRocket:
                        case KartwarsBot.CarWeapon.Flashes:
                        case KartwarsBot.CarWeapon.HugeBash:
                            {
                                this._triggerLocation = KartwarsBot.CarWeaponTrigger.Front;
                            }
                            break;
                        case KartwarsBot.CarWeapon.Mine:
                        case KartwarsBot.CarWeapon.ThreeMines:
                            {
                                this._triggerLocation = KartwarsBot.CarWeaponTrigger.Behind;
                            }
                            break;
                        default:
                            {
                                this._triggerLocation = KartwarsBot.CarWeaponTrigger.NotSet;
                            }
                            break;
                    }
                    //
                    // speed
                    switch (thisWeaponType) {
                        case KartwarsBot.CarWeapon.Cloak:
                        case KartwarsBot.CarWeapon.Mine:
                        case KartwarsBot.CarWeapon.ThreeMines:
                        case KartwarsBot.CarWeapon.BigBang:
                        case KartwarsBot.CarWeapon.Shield:
                        case KartwarsBot.CarWeapon.Magnet:
                            {
                                this._speed = KartwarsBot.CarWeaponSpeed.NoSpeed;
                            }
                            break;
                        case KartwarsBot.CarWeapon.TeleRocket:
                        case KartwarsBot.CarWeapon.ThreeTeleRocket:
                        case KartwarsBot.CarWeapon.HugeBash:
                            {
                                this._speed = KartwarsBot.CarWeaponSpeed.MediumSpeed;
                            }
                            break;
                        case KartwarsBot.CarWeapon.FastRocket:
                        case KartwarsBot.CarWeapon.ThreeFastRockets:
                        case KartwarsBot.CarWeapon.Flashes:
                            {
                                this._speed = KartwarsBot.CarWeaponSpeed.HighSpeed;
                            }
                            break;
                        default:
                            {
                                this._speed = KartwarsBot.CarWeaponSpeed.NotSet;
                            }
                            break;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CarWeaponData.prototype, "isLethalWeapon", {
                get: function () {
                    return this._isLethalWeapon;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CarWeaponData.prototype, "triggerLocation", {
                get: function () {
                    return this._triggerLocation;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CarWeaponData.prototype, "speed", {
                get: function () {
                    return this._speed;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CarWeaponData.prototype, "magnitude", {
                get: function () {
                    return this._magnitude;
                },
                enumerable: true,
                configurable: true
            });
            return CarWeaponData;
        }());
        KartwarsBot.CarWeaponData = CarWeaponData;
        var Point2D = (function () {
            function Point2D(x, y) {
                if (x) {
                    this.x = x;
                }
                else {
                    this.x = 0;
                }
                if (y) {
                    this.y = y;
                }
                else {
                    this.y = 0;
                }
            }
            Point2D.prototype.lerp = function (that, t) {
                return new Point2D(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t);
            };
            Point2D.prototype.min = function (that) {
                return new Point2D(Math.min(this.x, that.x), Math.min(this.y, that.y));
            };
            Point2D.prototype.max = function (that) {
                return new Point2D(Math.max(this.x, that.x), Math.max(this.y, that.y));
            };
            return Point2D;
        }());
        KartwarsBot.Point2D = Point2D;
        //type Point2D = Victor;
        //const Point2D = <{ new (x: number, y: number): Point2D; }>Victor;
        // TODO : Review
        var BotPoint2D = (function (_super) {
            __extends(BotPoint2D, _super);
            function BotPoint2D(x, y, ang) {
                var _this = _super.call(this, x, y) || this;
                _this.ang = 0.0;
                _this.ang = ang;
                return _this;
            }
            BotPoint2D.fromPoint2D = function (point) {
                return new BotPoint2D(point.x, point.y);
            };
            return BotPoint2D;
        }(Point2D));
        KartwarsBot.BotPoint2D = BotPoint2D;
        // TODO : Review
        var Bot2Point2D = (function (_super) {
            __extends(Bot2Point2D, _super);
            function Bot2Point2D(x, y, sz, da, ang, distance, resourceId) {
                var _this = _super.call(this, x, y) || this;
                _this.sz = sz;
                _this.da = da;
                _this.ang = ang;
                _this.distance = distance;
                _this.resourceId = resourceId;
                return _this;
            }
            return Bot2Point2D;
        }(Point2D));
        KartwarsBot.Bot2Point2D = Bot2Point2D;
        var CollisionElement = (function (_super) {
            __extends(CollisionElement, _super);
            function CollisionElement(x, y, ang, shapeType, dangerType, radius, /*isHead: boolean,*/ distance) {
                var _this = _super.call(this, x, y) || this;
                _this.ang = ang;
                _this.shapeType = shapeType;
                _this.dangerType = dangerType;
                _this.radius = radius;
                //this.isHead = isHead;
                if (distance) {
                    _this.distance2 = distance;
                }
                else {
                    _this.distance2 = Infinity;
                }
                return _this;
            }
            return CollisionElement;
        }(Point2D));
        KartwarsBot.CollisionElement = CollisionElement;
        var CollisionAngle = (function (_super) {
            __extends(CollisionAngle, _super);
            function CollisionAngle(x, y, ang, dangerType, distance, radius, aIndex) {
                var _this = _super.call(this, x, y) || this;
                _this.ang = ang;
                _this.dangerType = dangerType;
                _this.distance2 = distance;
                _this.radius = radius;
                _this.aIndex = aIndex;
                return _this;
            }
            return CollisionAngle;
        }(Point2D));
        KartwarsBot.CollisionAngle = CollisionAngle;
        var CollisionDataRespons = (function () {
            function CollisionDataRespons(collisionElements, collisionAngles) {
                this.collisionElements = collisionElements;
                this.collisionAngles = collisionAngles;
            }
            return CollisionDataRespons;
        }());
        KartwarsBot.CollisionDataRespons = CollisionDataRespons;
        var FoodAngle = (function (_super) {
            __extends(FoodAngle, _super);
            function FoodAngle() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return FoodAngle;
        }(Point2D));
        KartwarsBot.FoodAngle = FoodAngle;
        var OpenAngle = (function () {
            function OpenAngle() {
            }
            return OpenAngle;
        }());
        KartwarsBot.OpenAngle = OpenAngle;
        var Bounds = (function () {
            function Bounds(width, height) {
                this.width = width;
                this.height = height;
            }
            return Bounds;
        }());
        KartwarsBot.Bounds = Bounds;
        var Line = (function () {
            // Constructor for vector type
            function Line(point1, point2) {
                this.point1 = point1;
                this.point2 = point2;
            }
            return Line;
        }());
        KartwarsBot.Line = Line;
        var Rect = (function (_super) {
            __extends(Rect, _super);
            // Constructor for rect type
            function Rect(x, y, width, height, rotation) {
                var _this = _super.call(this, width, height) || this;
                _this.x = x;
                _this.y = y;
                if (undefined != rotation) {
                    _this.rotation = rotation;
                }
                else {
                    rotation = 0.0;
                }
                return _this;
            }
            return Rect;
        }(Bounds));
        KartwarsBot.Rect = Rect;
        var Polygon = (function (_super) {
            __extends(Polygon, _super);
            function Polygon(x, y, geometry) {
                var _this = _super.call(this, x, y) || this;
                _this._minX = Infinity;
                _this._minY = Infinity;
                _this._maxX = -Infinity;
                _this._maxY = -Infinity;
                _this.geometry = geometry;
                _this.processGeometry();
                return _this;
            }
            Polygon.prototype.processGeometry = function () {
                var geometry = this.geometry;
                for (var p = 1, l = geometry.length; p < l; p++) {
                    if (geometry[p].x < this._minX) {
                        this._minX = geometry[p].x;
                    }
                    if (geometry[p].x > this._maxX) {
                        this._maxX = geometry[p].x;
                    }
                    if (geometry[p].y < this._minY) {
                        this._minY = geometry[p].y;
                    }
                    if (geometry[p].y > this._maxY) {
                        this._maxY = geometry[p].y;
                    }
                }
            };
            Object.defineProperty(Polygon.prototype, "geometryAsPoint2DArray", {
                get: function () {
                    if (!this._geometryAsPoint2DArray) {
                        this._geometryAsPoint2DArray = this.geometry.map(function (element) {
                            return new Point2D(element.x, element.y);
                        });
                    }
                    return this._geometryAsPoint2DArray;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Polygon.prototype, "minX", {
                get: function () {
                    return this._minX;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Polygon.prototype, "minY", {
                get: function () {
                    return this._minY;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Polygon.prototype, "maxX", {
                get: function () {
                    return this._maxX;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Polygon.prototype, "maxY", {
                get: function () {
                    return this._maxY;
                },
                enumerable: true,
                configurable: true
            });
            return Polygon;
        }(Point2D));
        KartwarsBot.Polygon = Polygon;
        var Circle = (function (_super) {
            __extends(Circle, _super);
            // Constructor for circle type
            function Circle(x, y, radius) {
                var _this = _super.call(this, x, y) || this;
                _this.radius = radius;
                return _this;
            }
            return Circle;
        }(Point2D));
        KartwarsBot.Circle = Circle;
        var Cluster = (function (_super) {
            __extends(Cluster, _super);
            // Constructor for circle type
            function Cluster(circle, data) {
                var _this = _super.call(this, circle.x, circle.y, circle.radius) || this;
                _this.elements = [];
                if (undefined != data) {
                    var $this_1 = _this;
                    data.forEach(function (element) {
                        element.distanceToCenterOfCluster = KartwarsBot.MathUtils.getDistance($this_1, element);
                    });
                    _this.elements = data;
                }
                return _this;
            }
            Object.defineProperty(Cluster.prototype, "score", {
                get: function () {
                    return (Math.pow(this.distance, 2) / this.elements.length);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Cluster.prototype, "highRadius", {
                get: function () {
                    return (this.radius * Cluster.radiusMultiplier);
                },
                enumerable: true,
                configurable: true
            });
            return Cluster;
        }(Circle));
        // TODO : Review
        Cluster.radiusMultiplier = 1.4;
        KartwarsBot.Cluster = Cluster;
        var ClusterWrapper = (function () {
            function ClusterWrapper() {
                this._foodClusters = [];
            }
            Object.defineProperty(ClusterWrapper.prototype, "foodClusters", {
                get: function () {
                    return this._foodClusters;
                },
                set: function (value) {
                    /*
                    value.sort(function (a, b) {
                        return b.score - a.score;
                    });
                    */
                    value.sort(function (a, b) {
                        return a.distance - b.distance;
                    });
                    this._foodClusters = value;
                },
                enumerable: true,
                configurable: true
            });
            ClusterWrapper.prototype.getBestCluster = function () {
                return this._foodClusters[0];
            };
            return ClusterWrapper;
        }());
        KartwarsBot.ClusterWrapper = ClusterWrapper;
        var ShapesIntersectionsResult = (function () {
            function ShapesIntersectionsResult(status) {
                this.status = KartwarsBot.ShapesIntersectionStatus.NoIntersection;
                this.points = [];
                if (status != undefined) {
                    this.status = status;
                }
            }
            Object.defineProperty(ShapesIntersectionsResult.prototype, "length", {
                get: function () {
                    return this.points.length;
                },
                enumerable: true,
                configurable: true
            });
            ShapesIntersectionsResult.prototype.addPoint = function (point) {
                this.points.push(point);
            };
            ShapesIntersectionsResult.prototype.addPoints = function (points) {
                this.points = this.points.concat(points);
            };
            return ShapesIntersectionsResult;
        }());
        KartwarsBot.ShapesIntersectionsResult = ShapesIntersectionsResult;
        var ActivityResult = (function () {
            function ActivityResult(isValid, goalCoordinates, customData, accelerate, speed) {
                if (customData === void 0) { customData = null; }
                if (accelerate === void 0) { accelerate = KartwarsBot.AccelerationFlag.NotDefined; }
                this._isValid = isValid;
                this._goalCoordinates = goalCoordinates;
                this._acceleration = accelerate;
                this._speed = speed;
                this._customData = customData;
            }
            ActivityResult.CreateValidResponse = function (goalCoordinates, accelerate, speed) {
                if (accelerate === void 0) { accelerate = KartwarsBot.AccelerationFlag.NotDefined; }
                return new ActivityResult(true, goalCoordinates, undefined, accelerate, speed);
            };
            ActivityResult.CreateInvalidResponse = function () {
                return new ActivityResult(false);
            };
            ActivityResult.CreateCustomResponse = function (customData) {
                return new ActivityResult(true, undefined, customData);
            };
            ActivityResult.Transfer = function (activityResult, goalCoordinates, customData, accelerate, speed) {
                var newActivityResult = new ActivityResult(activityResult._isValid, activityResult._goalCoordinates, activityResult._customData, activityResult._acceleration, activityResult._speed);
                //newActivityResult._isValid = isValid;
                if (goalCoordinates != null) {
                    newActivityResult._goalCoordinates = goalCoordinates;
                }
                if (accelerate != null) {
                    newActivityResult._acceleration = accelerate;
                }
                if (speed != null) {
                    newActivityResult._speed = speed;
                }
                if (customData != null) {
                    newActivityResult._customData = customData;
                }
                return newActivityResult;
            };
            Object.defineProperty(ActivityResult.prototype, "isValid", {
                get: function () {
                    return this._isValid;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ActivityResult.prototype, "goalCoordinates", {
                get: function () {
                    return this._goalCoordinates;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ActivityResult.prototype, "acceleration", {
                get: function () {
                    return this._acceleration;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ActivityResult.prototype, "speed", {
                // TODO : Maybe calculate speed here inside, based on player's position and goalCoordinates.
                get: function () {
                    return this._speed;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ActivityResult.prototype, "customData", {
                get: function () {
                    return this._customData;
                },
                enumerable: true,
                configurable: true
            });
            return ActivityResult;
        }());
        KartwarsBot.ActivityResult = ActivityResult;
        var GoalData = (function () {
            function GoalData() {
                this._isValid = false;
                this._isInTunnel = false;
                this._state = KartwarsBot.GoalState.Invalid;
                this.coordinates = new Point2D();
                // !`state` property
                //
            }
            Object.defineProperty(GoalData.prototype, "isInTunnel", {
                //
                // `isInTunnel` property
                get: function () {
                    return this._isInTunnel;
                },
                set: function (value) {
                    this._isValid = false;
                    this._isInTunnel = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GoalData.prototype, "state", {
                // !`isInTunnel` property
                //
                //
                // `state` property
                get: function () {
                    if (this._isValid) {
                        return this._state;
                    }
                    return KartwarsBot.GoalState.Invalid;
                },
                set: function (value) {
                    this._state = value;
                    this._isValid = true;
                },
                enumerable: true,
                configurable: true
            });
            return GoalData;
        }());
        KartwarsBot.GoalData = GoalData;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

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
        var GameWrapperInputMouse = (function () {
            // Constructor
            function GameWrapperInputMouse(gameWrapper) {
                this.gameWrapper = gameWrapper;
            }
            // window.xm
            // window.ym
            // gameWrapper.input.mouse.setCoordinates(point)
            GameWrapperInputMouse.prototype.setCoordinates = function (point) {
                window.game.input.mousePointer.x = point.x + (window.game.canvas.width / 2);
                window.game.input.mousePointer.y = point.y + (window.game.canvas.height / 2);
            };
            return GameWrapperInputMouse;
        }());
        KartwarsBot.GameWrapperInputMouse = GameWrapperInputMouse;
        var GameWrapperInputCanvas = (function () {
            // Constructor
            function GameWrapperInputCanvas(gameWrapper) {
                this.gameWrapper = gameWrapper;
                this._injectElement = true;
                this._addEvents = true;
            }
            // gameWrapper.input.canvas.forceClear()
            GameWrapperInputCanvas.prototype.forceClear = function () {
                var c = this._canvasElement;
                if (c != null) {
                    c.getContext('2d').clearRect(0, 0, c.width, c.height);
                }
            };
            // TODO : Review
            GameWrapperInputCanvas.prototype.registerEvent = function (fx) {
                if (this._addEvents) {
                    this._registeredEvent = fx;
                    this._addEvents = false;
                }
            };
            // gameWrapper.input.canvas.getContext()
            GameWrapperInputCanvas.prototype.getContext = function () {
                // return window.game.input.hitContext;
                /*
                let webGlContext = window.game.canvas.getContext('webgl');
                gameWrapper.input.canvas._canvasElement = webglToCanvas2d(webGlContext, gameWrapper.input.canvas._canvasElement);
                */
                var c = this._canvasElement;
                if (c == null) {
                    c = this._canvasElement = document.createElement('canvas');
                    c.width = window.game.canvas.width;
                    c.height = window.game.canvas.height;
                    c.style.zIndex = '9999';
                    c.style.position = 'absolute';
                    c.style.top = '0';
                    c.style.left = '0';
                    c.style.display = 'block';
                    c.style.touchAction = 'none';
                    c.style.webkitUserSelect = c.style.msUserSelect = 'none';
                    c.style.webkitTapHighlightColor = 'rgba(0, 0, 0, 0)';
                    c.style.cursor = 'inherit';
                    c.style.marginLeft = '0px';
                    c.style.marginTop = '0px';
                    c.oncontextmenu = function (e) {
                        e.preventDefault();
                    };
                    // Copy events
                    if (this._registeredEvent) {
                        this._registeredEvent(c);
                    }
                    c.addEventListener('mousedown', window.game.input.mouse._onMouseDown, !0);
                    c.addEventListener('mousemove', window.game.input.mouse._onMouseMove, !0);
                    c.addEventListener('mouseup', window.game.input.mouse._onMouseUp, !0);
                }
                if (this._injectElement) {
                    $('#game').append(this._canvasElement);
                    this._injectElement = false;
                }
                return this._canvasElement.getContext('2d');
            };
            GameWrapperInputCanvas.prototype.dispatchEvent = function (event) {
                this._canvasElement.dispatchEvent(event);
            };
            return GameWrapperInputCanvas;
        }());
        KartwarsBot.GameWrapperInputCanvas = GameWrapperInputCanvas;
        var GameWrapperUtil = (function () {
            // Constructor
            function GameWrapperUtil(gameWrapper) {
                this.gameWrapper = gameWrapper;
            }
            // gameWrapper.util.hasValidSprite(element)
            GameWrapperUtil.prototype.hasValidSprite = function (el) {
                var worldBounds = this.gameWrapper.world.getWorkingBounds(), img = el.img, position = img.position;
                // (!element.img.alive)
                return (position.x > worldBounds.x && position.y > worldBounds.y) && (position.x < worldBounds.width && position.y < worldBounds.height) &&
                    (img.visible && (img.alpha > 0) && img.renderable);
            };
            // gameWrapper.util.hasShieldActivated(element)
            GameWrapperUtil.prototype.hasShieldActivated = function (el) {
                var img = el.img.escudo2;
                return (img.visible && (img.alpha > 0) && img.renderable);
            };
            GameWrapperUtil.prototype.connect = function () {
                $('#play-btn').click();
            };
            GameWrapperUtil.prototype.delayedConnect = function () {
                if (!this.isPlaying) {
                    this.connect();
                    setTimeout(this.delayedConnect, 500);
                }
            };
            Object.defineProperty(GameWrapperUtil.prototype, "isPlaying", {
                get: function () {
                    return (window.mainCar && window.mainCar.img && window.mainCar.img.alive);
                },
                enumerable: true,
                configurable: true
            });
            return GameWrapperUtil;
        }());
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], GameWrapperUtil.prototype, "delayedConnect", null);
        KartwarsBot.GameWrapperUtil = GameWrapperUtil;
        var GameWrapperPlayer = (function () {
            // Constructor
            function GameWrapperPlayer(gameWrapper) {
                this.gameWrapper = gameWrapper;
                this.HALP_PI = Math.PI / 2;
                this.THREE_SQUARES_PI = Math.PI * 1.5;
            }
            // window.snake.ehang
            // gameWrapper.player.getRotation([enemy])
            GameWrapperPlayer.prototype.getRotation = function (enemy) {
                var rotation;
                if (undefined == enemy) {
                    rotation = window.mainCar.rotation;
                }
                else {
                    rotation = enemy.img.rotation;
                } /*else {
                    return;
                }*/
                if (rotation >= (-this.gameWrapper.player.HALP_PI) && rotation < Math.PI) {
                    rotation -= this.gameWrapper.player.HALP_PI;
                }
                else {
                    rotation += this.gameWrapper.player.THREE_SQUARES_PI;
                }
                return rotation;
            };
            // window.view_xx
            // window.view_yy
            // gameWrapper.player.getPosition()
            GameWrapperPlayer.prototype.getPosition = function () {
                return window.mainCar.img.position;
            };
            return GameWrapperPlayer;
        }());
        KartwarsBot.GameWrapperPlayer = GameWrapperPlayer;
        var GameWrapperItems = (function () {
            // Constructor
            function GameWrapperItems(gameWrapper) {
                this.gameWrapper = gameWrapper;
                this.ignoreMissilesDictionary = {};
                this.reset();
            }
            // TODO : Review this as WebSocket.onMessage refreshes data for each element.
            GameWrapperItems.prototype.reset = function () {
                if (GameWrapperItems.isItemCacherActive) {
                    //this.listOfElements = [];
                    this.listOfElements = null; // ???
                    this.listOfElements = {};
                }
            };
            GameWrapperItems.prototype.ignoreMissilesById = function (id) {
                this.ignoreMissilesDictionary[id] = KartwarsBot.IgnoreItemFlag.Yes;
            };
            // window.snakes
            // gameWrapper.items.getEnemies()
            GameWrapperItems.prototype.getEnemies = function () {
                return this._baseGetItems('Car', window.sprites, window.Car, true, window.mainCar.id);
            };
            // gameWrapper.items.getMissiles()
            GameWrapperItems.prototype.getMissiles = function () {
                return this._baseGetItems('Missile', window.misiles, window.Misil, true, undefined, this.ignoreMissilesDictionary);
            };
            // gameWrapper.items.getTeleMissiles()
            GameWrapperItems.prototype.getTeleMissiles = function () {
                return this._baseGetItems('TeleMissile', window.misiles, window.MisilTele, true, undefined, this.ignoreMissilesDictionary);
            };
            // gameWrapper.items.getBombes()
            GameWrapperItems.prototype.getBombs = function () {
                return this._baseGetItems('Bomb', window.bombas, window.Bomba, false);
            };
            // gameWrapper.items.getMines()
            GameWrapperItems.prototype.getMines = function () {
                return this._baseGetItems('Mine', window.minas, window.Mina, false);
            };
            // gameWrapper.items.getWeapons()
            GameWrapperItems.prototype.getWeapons = function () {
                return this._baseGetItems('Item', window.misItems, window.Item, false);
            };
            // window.foods
            // gameWrapper.items.getFood()
            GameWrapperItems.prototype.getFood = function () {
                // Example: (ac = coins.filter(function(el){ return el.activa == true; })).length
                var $this = this;
                var worldBounds = this.gameWrapper.world.getWorkingBounds();
                var playerPosition = this.gameWrapper.player.getPosition();
                return window.coins.filter(function (element) {
                    var img = element.img;
                    var position = img.position;
                    element.x = position.x;
                    element.y = position.y;
                    var isValid = $this.gameWrapper.util.hasValidSprite(element);
                    if (isValid) {
                        element.distance = KartwarsBot.MathUtils.getDistance(position, playerPosition);
                    }
                    return isValid;
                });
            };
            GameWrapperItems.prototype._ensureVelocityIsDefined = function (object) {
                var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor(object, 'x');
                var variableWatched = (typeof getOwnPropertyDescriptor == 'function');
                if (!variableWatched) {
                    object.img.position.watch('x', function (id, oldValue, newValue) {
                        var element = object;
                        var position = element.img.position;
                        if (element.velocity == undefined) {
                            element.lastPosition = new KartwarsBot.Point2D(position.x, position.y);
                            element.velocity = new KartwarsBot.Point2D(0, 0);
                        }
                        else {
                            element.velocity.x = (position.x - element.lastPosition.x);
                            element.velocity.y = (position.y - element.lastPosition.y);
                            element.lastPosition.x = position.x;
                            element.lastPosition.y = position.y;
                            element.magnitude = Math.sqrt(Math.pow(element.velocity.x, 2) + Math.pow(element.velocity.y, 2));
                        }
                        return newValue;
                    });
                }
            };
            GameWrapperItems.prototype._baseGetItems = function (category, items, type, defineVelocityProperty, skipId, ignoreList) {
                if (GameWrapperItems.isItemCacherActive) {
                    if (this.listOfElements[category] != undefined) {
                        return this.listOfElements[category];
                    }
                }
                var results = [], count = 0;
                /*
                let localElements = $.map(items, function (value:T, index) {
                    return [value];
                }) as Array<T>;
                */
                var clonedElements = jQuery.extend(true, {}, items);
                var playerPosition = this.gameWrapper.player.getPosition();
                // READ : http://stackoverflow.com/questions/5072136/javascript-filter-for-objects
                // TODO : Add properties to existing classes.
                /*
                Object.defineProperty(Car.prototype, 'x', {
                    get: function () {
                        return this.img.position.x;
                    },
                    enumerable: true,
                    configurable: true
                });
                */
                for (var localSpriteIdx in clonedElements) {
                    var element = clonedElements[localSpriteIdx];
                    var doContinue = false;
                    var hasValidSprite = this.gameWrapper.util.hasValidSprite(element);
                    if (ignoreList) {
                        var ignoreElement = ignoreList[localSpriteIdx];
                        //if (ignoreElement) {
                        if (ignoreElement == KartwarsBot.IgnoreItemFlag.Yes && hasValidSprite) {
                            ignoreList[localSpriteIdx] = KartwarsBot.IgnoreItemFlag.Delete;
                            doContinue = true;
                        }
                        else if (ignoreElement == KartwarsBot.IgnoreItemFlag.Delete) {
                            if (hasValidSprite) {
                                doContinue = true;
                            }
                            else {
                                delete (ignoreList[localSpriteIdx]);
                            }
                        }
                    }
                    if (doContinue || !(element instanceof type) || (!hasValidSprite)) {
                        delete (clonedElements[localSpriteIdx]);
                        continue;
                    }
                    var x = element.img.position.x, y = element.img.position.y;
                    element.x = x;
                    element.y = y;
                    element.distance = KartwarsBot.MathUtils.getDistance(element, playerPosition);
                    this._ensureVelocityIsDefined(element);
                    if (skipId && (element.id == skipId)) {
                        delete (clonedElements[localSpriteIdx]);
                        continue;
                    }
                    results[count++] = element;
                }
                if (count > 0) {
                    results.sort(KartwarsBot.ArrayUtils.sortDistance);
                }
                return results;
            };
            return GameWrapperItems;
        }());
        GameWrapperItems.isItemCacherActive = false;
        KartwarsBot.GameWrapperItems = GameWrapperItems;
        var GameWrapperWorld = (function () {
            // Constructor
            function GameWrapperWorld(gameWrapper) {
                this.gameWrapper = gameWrapper;
            }
            GameWrapperWorld.prototype.getWorkingBounds = function () {
                var worldBounds = window.game.world.bounds;
                var offset = GameWrapperWorld.offset;
                return new KartwarsBot.Rect(offset, offset, worldBounds.width - offset, worldBounds.height - offset);
            };
            // gameWrapper.world.getSectorSquaredWidth()
            GameWrapperWorld.prototype.getSectorSquaredWidth = function () {
                return 1661;
            };
            return GameWrapperWorld;
        }());
        GameWrapperWorld.offset = 1500 + 250;
        KartwarsBot.GameWrapperWorld = GameWrapperWorld;
        /**
         * Game variables Wrapper.
         */
        var GameWrapper = (function () {
            /*
                * || marcos
                e instanceof Misil || misiles
                e instanceof MisilTele || misiles
                e instanceof Car || sprites
                e instanceof Bomba || bombas
                e instanceof Mina || minas
                e instanceof Coin || coins
                e instanceof Item || misItems
            */
            function GameWrapper() {
                this.input = {
                    mouse: new GameWrapperInputMouse(this),
                    canvas: new GameWrapperInputCanvas(this)
                };
                this.util = new GameWrapperUtil(this);
                this.player = new GameWrapperPlayer(this);
                this.items = new GameWrapperItems(this);
                this.world = new GameWrapperWorld(this);
            }
            return GameWrapper;
        }());
        KartwarsBot.GameWrapper = GameWrapper;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var varExtractor1 = new RegExp("(.*)");
        var varExtractor2 = new RegExp("([^.]*)[;]?}");
        // EXPERIMENTAL
        // READ @ http://stackoverflow.com/questions/29191451/get-name-of-variable-in-typescript/29205712
        // TODO : Review
        function nameof(getVar) {
            var varFunctionAsString = getVar + '';
            if (varFunctionAsString.indexOf('function') == 0) {
                var m = varExtractor2.exec(varFunctionAsString);
                if (m == null) {
                    throw new Error("The function does not contain a statement matching 'return variableName;'");
                }
                var memberPart = m[1].split(';')[0];
                return memberPart;
            }
            else {
                var m = varExtractor1.exec(varFunctionAsString);
                if (m == null) {
                    throw new Error("The function does not contain a statement matching 'return variableName;'");
                }
                var fullMemberName = m[1];
                var memberParts = fullMemberName.split('.');
                return memberParts[memberParts.length - 1];
            }
        }
        KartwarsBot.nameof = nameof;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

/// <reference path="_references.ts" />
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        /**
         * Array utils.
         */
        var ArrayUtils = (function () {
            function ArrayUtils() {
            }
            /**
             * Sorting by 'score' property descending.
             * @param a
             * @param b
             */
            ArrayUtils.sortScore = function (a, b) {
                return b.score - a.score;
            };
            /**
             * Sorting by 'sz' property descending.
             * @param a
             * @param b
             */
            ArrayUtils.sortSz = function (a, b) {
                return b.sz - a.sz;
            };
            /**
             * Sorting by 'distance' property ascending.
             * @param a
             * @param b
             */
            ArrayUtils.sortDistance = function (a, b) {
                return a.distance - b.distance;
            };
            /**
             * Sorting by 'distance2' property ascending.
             * @param a
             * @param b
             */
            ArrayUtils.sortDistance2 = function (a, b) {
                return a.distance2 - b.distance2;
            };
            return ArrayUtils;
        }());
        KartwarsBot.ArrayUtils = ArrayUtils;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        /**
         * Math utils.
         */
        var MathUtils = (function () {
            function MathUtils() {
            }
            /**
             * Get the smallest angle between two angles (0-pi)
             * @param a1
             * @param a2
             */
            MathUtils.angleBetween = function (a1, a2) {
                var r1 = 0.0;
                var r2 = 0.0;
                r1 = (a1 - a2) % Math.PI;
                r2 = (a2 - a1) % Math.PI;
                return r1 < r2 ? -r1 : r2;
            };
            /**
             * Get clusters based on the given resources.
             * @param elements
             * @param sectorSize
             * @param minimumElementsPerCluster
             */
            // READ : http://stackoverflow.com/questions/356035/algorithm-for-detecting-clusters-of-dots
            MathUtils.get2DElementsDensity = function (elements, sectorSize, minimumElementsPerCluster) {
                var dataset = elements.map(function (el) {
                    return [el.x, el.y];
                });
                var mapScanner = new DBSCAN();
                var clusters = mapScanner.run(dataset, sectorSize, minimumElementsPerCluster);
                return clusters;
            };
            MathUtils.arcPoint = function (x, y, radius, angle) {
                return new KartwarsBot.Point2D(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
            };
            /**
             * Fast atan2
             * @param y
             * @param x
             */
            MathUtils.fastAtan2 = function (y, x) {
                var QPI = Math.PI / 4;
                var TQPI = 3 * Math.PI / 4;
                var r = 0.0;
                var angle = 0.0;
                var abs_y = Math.abs(y) + 1e-10;
                if (x < 0) {
                    r = (x + abs_y) / (abs_y - x);
                    angle = TQPI;
                }
                else {
                    r = (x - abs_y) / (x + abs_y);
                    angle = QPI;
                }
                angle += (0.1963 * r * r - 0.9817) * r;
                if (y < 0) {
                    return -angle;
                }
                return angle;
            };
            /**
             * Given the start and end of a line, is point left.
             * @param start
             * @param end
             * @param point
             */
            MathUtils.isLeft = function (start, end, point) {
                return ((end.x - start.x) * (point.y - start.y) -
                    (end.y - start.y) * (point.x - start.x)) > 0;
            };
            /**
             * Given the start and end of a line, is point right.
             * @param start
             * @param end
             * @param point
             */
            MathUtils.isRight = function (start, end, point) {
                return !MathUtils.isLeft(start, end, point);
            };
            /**
             * Get distance
             * @param point1
             * @param point2
             */
            MathUtils.getDistance = function (point1, point2) {
                var x1 = point1.x, y1 = point1.y, x2 = point2.x, y2 = point2.y;
                var distance2 = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
                return distance2;
            };
            /**
            * Get distance squared
            * @param point1
            * @param point2
            */
            MathUtils.getDistance2 = function (point1, point2) {
                var x1 = point1.x, y1 = point1.y, x2 = point2.x, y2 = point2.y;
                var distance2 = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
                return distance2;
            };
            /**
             * Return unit vector in the direction of the argument
             * @param v
             */
            /*
            public static unitVector(v) {
                let l = Math.sqrt(v.x * v.x + v.y * v.y);
                if (l > 0) {
                    return {
                        x: v.x / l,
                        y: v.y / l
                    };
                } else {
                    return {
                        x: 0,
                        y: 0
                    };
                }
            }
            */
            /*
            public static cross(o, a, b) {
                return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
            }
        
            public static convexHullSort(a, b) {
                return a.x == b.x ? a.y - b.y : a.x - b.x;
            }
            */
            /*
            public static convexHull(points) {
                points.sort(MathUtils.convexHullSort);
        
                let lower = [];
                for (let i = 0, l = points.length; i < l; i++) {
                    while (lower.length >= 2 && MathUtils.cross(
                        lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
                        lower.pop();
                    }
                    lower.push(points[i]);
                }
        
                let upper = [];
                for (let i = points.length - 1; i >= 0; i--) {
                    while (upper.length >= 2 && MathUtils.cross(
                        upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0) {
                        upper.pop();
                    }
                    upper.push(points[i]);
                }
        
                upper.pop();
                lower.pop();
                return lower.concat(upper);
            }
            */
            MathUtils.fromRadiansToDegrees = function (radians) {
                //convert from radians to degrees
                //let degrees = radians * (180 / Math.PI);
                var degrees = (360 + (radians * (180 / Math.PI))) % 360;
                return degrees;
            };
            MathUtils.fromDegreesToRadians = function (degrees) {
                var radians = degrees * (Math.PI / 180);
                if (radians > Math.PI) {
                    radians = Math.PI - radians;
                }
                return radians;
            };
            MathUtils.medianAngle = function (a, b) {
                a = a % 360;
                b = b % 360;
                var sum = a + b;
                if (sum > 360 && sum < 540) {
                    sum = sum % 180;
                }
                return sum / 2;
            };
            /**
             * Predicts the Goal Coordinates for a given enemy/sprite at which it might intersect with the player.
             * @param source
             * @param target
             */
            MathUtils.predictIntersection = function (source, target) {
                var sourceVector = new Victor(source.x, source.y), targetVector = new Victor(target.x, target.y), targetSpeed = target.magnitude;
                var targetVelocity = new Victor(target.velocity.x, target.velocity.y);
                var offset = targetVector.clone().subtract(sourceVector);
                var distanceDelta = offset.magnitude() / targetSpeed;
                var targetAverageVelocity = targetVelocity.clone().multiplyScalar(distanceDelta);
                var futureAt = targetVelocity.clone().add(targetAverageVelocity);
                var result = targetVector.add(futureAt);
                return new KartwarsBot.Point2D(result.x, result.y);
            };
            // README : http://stackoverflow.com/questions/2248876/2d-game-fire-at-a-moving-target-by-predicting-intersection-of-projectile-and-u
            /**
             * Return the firing solution for a projectile starting at 'sourcePoint' with
             * velocity 'v', to hit a target, 'dst'.
             *
             * @param Object source position of shooter
             * @param Object target position & velocity of target
             * @param Number projectileVelocity speed of projectile
             * @return Object Coordinate at which to fire (and where intercept occurs)
             *
             * E.g.
             * >>> intercept({x:2, y:4}, {x:5, y:7, vx: 2, vy:1}, 5)
             * = {x: 8, y: 8.5}
             */
            MathUtils.predictIntersectionEx = function (source, target, projectileVelocity) {
                var tx = target.x - source.x, ty = target.y - source.y, tvx = target.velocity.x, tvy = target.velocity.y;
                // Get quadratic equation components
                var a = tvx * tvx + tvy * tvy - projectileVelocity * projectileVelocity;
                var b = 2 * (tvx * tx + tvy * ty);
                var c = tx * tx + ty * ty;
                // Solve quadratic
                var ts = MathUtils.quad(a, b, c);
                // Find smallest positive solution
                var sol = null;
                if (ts) {
                    var t0 = ts[0], t1 = ts[1];
                    var t = Math.min(t0, t1);
                    if (t < 0)
                        t = Math.max(t0, t1);
                    if (t > 0) {
                        sol = new KartwarsBot.Point2D(target.x + target.velocity.x * t, target.y + target.velocity.y * t);
                    }
                }
                return sol;
            };
            /**
             * Return solutions for quadratic
             */
            MathUtils.quad = function (a, b, c) {
                var sol = null;
                if (Math.abs(a) < 1e-6) {
                    if (Math.abs(b) < 1e-6) {
                        sol = Math.abs(c) < 1e-6 ? [0, 0] : null;
                    }
                    else {
                        sol = [-c / b, -c / b];
                    }
                }
                else {
                    var disc = b * b - 4 * a * c;
                    if (disc >= 0) {
                        disc = Math.sqrt(disc);
                        a = 2 * a;
                        sol = [(-b - disc) / a, (-b + disc) / a];
                    }
                }
                return sol;
            };
            return MathUtils;
        }());
        KartwarsBot.MathUtils = MathUtils;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        /**
         * Some methods are based on Kevin Lindsey's work
         *
         * copyright 2002, Kevin Lindsey
         */
        var GeometryIntersectionsUtils = (function () {
            function GeometryIntersectionsUtils() {
            }
            /**
             * Check if circle and line intersects.
             * @param c
             * @param r
             * @param a1
             * @param a2
             */
            GeometryIntersectionsUtils.intersectCircleLine = function (c, r, a1, a2) {
                var result;
                var a = (a2.x - a1.x) * (a2.x - a1.x) +
                    (a2.y - a1.y) * (a2.y - a1.y);
                var b = 2 * ((a2.x - a1.x) * (a1.x - c.x) +
                    (a2.y - a1.y) * (a1.y - c.y));
                var cc = c.x * c.x + c.y * c.y + a1.x * a1.x + a1.y * a1.y -
                    2 * (c.x * a1.x + c.y * a1.y) - r * r;
                var deter = b * b - 4 * a * cc;
                if (deter < 0) {
                    result = new KartwarsBot.ShapesIntersectionsResult(KartwarsBot.ShapesIntersectionStatus.NoIntersection);
                }
                else if (deter == 0) {
                    result = new KartwarsBot.ShapesIntersectionsResult(KartwarsBot.ShapesIntersectionStatus.Tangent);
                }
                else {
                    var e = Math.sqrt(deter);
                    var u1 = (-b + e) / (2 * a);
                    var u2 = (-b - e) / (2 * a);
                    if ((u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1)) {
                        if ((u1 < 0 && u2 < 0) || (u1 > 1 && u2 > 1)) {
                            result = new KartwarsBot.ShapesIntersectionsResult(KartwarsBot.ShapesIntersectionStatus.NoIntersection);
                        }
                        else {
                            result = new KartwarsBot.ShapesIntersectionsResult(KartwarsBot.ShapesIntersectionStatus.ShapeInside);
                        }
                    }
                    else {
                        result = new KartwarsBot.ShapesIntersectionsResult(KartwarsBot.ShapesIntersectionStatus.HasIntersections);
                        if (0 <= u1 && u1 <= 1)
                            result.points.push(KartwarsBot.BotPoint2D.fromPoint2D(a1.lerp(a2, u1)));
                        if (0 <= u2 && u2 <= 1)
                            result.points.push(KartwarsBot.BotPoint2D.fromPoint2D(a1.lerp(a2, u2)));
                    }
                }
                return result;
            };
            /**
             * Check if circle and polygon intersects.
             * @param c
             * @param r
             * @param polygon
             */
            GeometryIntersectionsUtils.intersectCirclePolygon = function (c, r, polygon) {
                var result = new KartwarsBot.ShapesIntersectionsResult(KartwarsBot.ShapesIntersectionStatus.NoIntersection);
                var points = polygon.geometryAsPoint2DArray;
                var length = points.length;
                var inter;
                for (var i = 0; i < length; i++) {
                    var a1 = points[i];
                    var a2 = points[(i + 1) % length];
                    inter = GeometryIntersectionsUtils.intersectCircleLine(c, r, a1, a2);
                    result.addPoints(inter.points);
                }
                if (result.points.length > 0) {
                    result.status = KartwarsBot.ShapesIntersectionStatus.HasIntersections;
                }
                else {
                    var status_1 = inter.status;
                    if (status_1 == KartwarsBot.ShapesIntersectionStatus.NoIntersection) {
                        if (GeometryIntersectionsUtils.pointInPoly(c, polygon)) {
                            status_1 = KartwarsBot.ShapesIntersectionStatus.ShapeInside;
                        }
                    }
                    result.status = status_1;
                }
                return result;
            };
            /**
             * Check if point is in Rectangle.
             * @param point
             * @param rect
             */
            GeometryIntersectionsUtils.pointInRect = function (point, rect) {
                if (rect.x <= point.x && rect.y <= point.y &&
                    rect.x + rect.width >= point.x && rect.y + rect.height >= point.y) {
                    return true;
                }
                return false;
            };
            /**
             * Check if point is in polygon.
             * @param point
             * @param poly
             */
            GeometryIntersectionsUtils.pointInPoly = function (point, polygon) {
                if (point.x < polygon.minX || point.x > polygon.maxX ||
                    point.y < polygon.minY || point.y > polygon.maxY) {
                    return false;
                }
                var isInside = false;
                var geometry = polygon.geometry;
                var ll = geometry.length;
                for (var i = 0, j = ll - 1; i < ll; j = i++) {
                    if (((geometry[i].y > point.y) != (geometry[j].y > point.y)) &&
                        (point.x < (geometry[j].x - geometry[i].x) * (point.y - geometry[i].y) / (geometry[j].y - geometry[i].y) + geometry[i].x)) {
                        isInside = !isInside;
                    }
                }
                return isInside;
            };
            /**
             * Checks if a certain point is inside an arc.
             * @param point
             * @param center
             * @param radius
             * @param angle1
             * @param angle2
             */
            GeometryIntersectionsUtils.isInsideArcSector = function (point, center, radius, angle1, angle2) {
                function areClockwise(center, radius, angle, point2) {
                    var point1 = new KartwarsBot.Point2D((center.x + radius) * Math.cos(angle), (center.y + radius) * Math.sin(angle));
                    return -point1.x * point2.y + point1.y * point2.x > 0;
                }
                var relPoint = new KartwarsBot.Point2D(point.x - center.x, point.y - center.y);
                return !areClockwise(center, radius, angle1, relPoint) &&
                    areClockwise(center, radius, angle2, relPoint) &&
                    (relPoint.x * relPoint.x + relPoint.y * relPoint.y <= radius * radius);
            };
            /**
             * Check if circle and rect intersects.
             * @param circle
             * @param rect
             */
            GeometryIntersectionsUtils.circleRectIntersect = function (circle, rect) {
                var deltaX = Math.abs(circle.x - rect.x - rect.width / 2);
                var deltaY = Math.abs(circle.y - rect.y - rect.height / 2);
                if (deltaX > (rect.width / 2 + circle.radius)) {
                    return false;
                }
                if (deltaY > (rect.height / 2 + circle.radius)) {
                    return false;
                }
                if (deltaX <= (rect.width / 2)) {
                    return true;
                }
                if (deltaY <= (rect.height / 2)) {
                    return true;
                }
                var dx = deltaX - rect.width / 2;
                var dy = deltaY - rect.height / 2;
                var returnStatus = (dx * dx + dy * dy <= (circle.radius * circle.radius));
                return returnStatus;
            };
            /*
            // Ported to JavaScript from
            // http://www.migapro.com/circle-and-rotated-rectangle-collision-detection/
            //
            // An example:
            // let circle: { x: 20, y: 10, radius: 20 };
            // let rect: { x: 30, y: 30, width: 100, height: 100, rotation: Math.PI / 2 };
            // collideCircleWithRotatedRectangle( circle, rect );
            // // returns true.
            //
            //
            // Please note:
            // This code assumes that rect.x and rect.y are the CENTER coordinates
            // of the rectangle. You may want to to change this.
            // Also rotation values need to be in RADIANS.
            public static circleRectIntersect(circle: Circle, rect: Rect) {
                let rectCenterX = rect.x;
                let rectCenterY = rect.y;
    
                let rectX = rectCenterX - rect.width / 2;
                let rectY = rectCenterY - rect.height / 2;
    
                let rectReferenceX = rectX;
                let rectReferenceY = rectY;
    
                // Rotate circle's center point back
                let unrotatedCircleX = Math.cos(rect.rotation) * (circle.x - rectCenterX) - Math.sin(rect.rotation) * (circle.y - rectCenterY) + rectCenterX;
                let unrotatedCircleY = Math.sin(rect.rotation) * (circle.x - rectCenterX) + Math.cos(rect.rotation) * (circle.y - rectCenterY) + rectCenterY;
    
                // Closest point in the rectangle to the center of circle rotated backwards(unrotated)
                let closestX, closestY;
    
                // Find the unrotated closest x point from center of unrotated circle
                if (unrotatedCircleX < rectReferenceX) {
                    closestX = rectReferenceX;
                } else if (unrotatedCircleX > rectReferenceX + rect.width) {
                    closestX = rectReferenceX + rect.width;
                } else {
                    closestX = unrotatedCircleX;
                }
    
                // Find the unrotated closest y point from center of unrotated circle
                if (unrotatedCircleY < rectReferenceY) {
                    closestY = rectReferenceY;
                } else if (unrotatedCircleY > rectReferenceY + rect.height) {
                    closestY = rectReferenceY + rect.height;
                } else {
                    closestY = unrotatedCircleY;
                }
    
                // Determine collision
                let collision = false;
                let distance = MathUtils.getDistance(new Point2D(unrotatedCircleX, unrotatedCircleY), new Point2D(closestX, closestY));
    
                if (distance < circle.radius) {
                    collision = true;
                }
                else {
                    collision = false;
                }
    
                return collision;
            }
            */
            /**
             * Check if two circles intersect.
             * @param circle1
             * @param circle2
             */
            GeometryIntersectionsUtils.circleCircleIntersect = function (circle1, circle2) {
                var a, deltaX, deltaY, d, h, rx, ry;
                var x2, y2;
                var point;
                // deltaX and deltaY are the vertical and horizontal distances between the circle centers.
                deltaX = circle2.x - circle1.x;
                deltaY = circle2.y - circle1.y;
                // Determine the straight-line distance between the centers.
                d = Math.sqrt((deltaY * deltaY) + (deltaX * deltaX));
                // Check for solvability.
                if (d > (circle1.radius + circle2.radius)) {
                    // No solution. circles do not intersect.
                    return new KartwarsBot.ShapesIntersectionsResult(KartwarsBot.ShapesIntersectionStatus.NoIntersection);
                }
                if (d < Math.abs(circle1.radius - circle2.radius)) {
                    // No solution. one circle is contained in the other
                    return new KartwarsBot.ShapesIntersectionsResult(KartwarsBot.ShapesIntersectionStatus.ShapeInside);
                }
                var returnData = new KartwarsBot.ShapesIntersectionsResult(KartwarsBot.ShapesIntersectionStatus.HasIntersections);
                /* 'point 2' is the point where the line through the circle
                 * intersection points crosses the line between the circle
                 * centers.
                 */
                // Determine the distance from point 0 to point 2.
                a = ((circle1.radius * circle1.radius) - (circle2.radius * circle2.radius) + (d * d)) / (2.0 * d);
                // Determine the coordinates of point 2.
                x2 = circle1.x + (deltaX * a / d);
                y2 = circle1.y + (deltaY * a / d);
                // Determine the distance from point 2 to either of the intersection points.
                h = Math.sqrt((circle1.radius * circle1.radius) - (a * a));
                // Now determine the offsets of the intersection points from point 2.
                rx = -deltaY * (h / d);
                ry = deltaX * (h / d);
                // Determine the absolute intersection points and add them to stack.
                returnData.addPoint(new KartwarsBot.BotPoint2D(x2 + rx, y2 + ry));
                returnData.addPoint(new KartwarsBot.BotPoint2D(x2 - rx, y2 - ry));
                return returnData;
            };
            return GeometryIntersectionsUtils;
        }());
        KartwarsBot.GeometryIntersectionsUtils = GeometryIntersectionsUtils;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

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
        var CanvasUtilsDrawOptions = (function () {
            function CanvasUtilsDrawOptions() {
                this.player = true;
                this.dangers = true;
                this.food = true;
            }
            return CanvasUtilsDrawOptions;
        }());
        KartwarsBot.CanvasUtilsDrawOptions = CanvasUtilsDrawOptions;
        var CanvasUtilsColorsOptions = (function () {
            function CanvasUtilsColorsOptions() {
                this.goalLine = '#00ff00';
                this.goalDot = '#ff0000';
                this.goalCross = '#000000';
                this.collidedPoint = '#66ff66';
                this.collidedElement = '#ff9900';
                this.collisionAvoidancePointA = '#ffa500';
                this.collisionAvoidancePointB = '#ff0000';
                this.foodCluster = '#ffffff';
                this.foodClusterText = '#ffffff';
                this.foodClusterLine = '#ffffff';
                this.foodClusterBoundary = '#000000';
                this.inRangeResource = '#00ff00';
                this.collectableResource = '#ff0000';
                this.predictionLine = '#000000';
                this.predictionCircle = '#000000';
                this.encircledPlayerWarning = '#ffff00';
                this.encircledPlayerDanger = '#ff0000';
                this.collisionElement = '#ff0000';
                this.collisionLine = '#ff0000';
                this.playerRadius = '#ffff00';
                this.closeToImminentDangerRadius = '#ff0000';
                this.playerSideDetector = '#ffff00';
                this.playerHeadDetector = '#0000ff';
                this.playerTailDetector = '#ffc0cb';
                this.frontResourceGatherArc = '#00ff00';
                this.frontDangerArc = '#0000ff';
                this.tailDangerArc = '#0000ff';
            }
            return CanvasUtilsColorsOptions;
        }());
        KartwarsBot.CanvasUtilsColorsOptions = CanvasUtilsColorsOptions;
        var CanvasUtilsOptions = (function () {
            function CanvasUtilsOptions() {
                // Shadow Blur
                this.shadowBlur = 3;
                this.draw = new CanvasUtilsDrawOptions();
                this.colors = new CanvasUtilsColorsOptions();
            }
            return CanvasUtilsOptions;
        }());
        KartwarsBot.CanvasUtilsOptions = CanvasUtilsOptions;
        /**
         * Canvas draw for Base objects.
         */
        var CanvasUtilsBase = (function () {
            // Constructor
            function CanvasUtilsBase(gameWrapper) {
                this.gameWrapper = gameWrapper;
                this.opt = new CanvasUtilsOptions();
            }
            /**
             * Spoofs moving the mouse to the provided coordinates.
             * @param point
             */
            CanvasUtilsBase.prototype.setMouseCoordinates = function (point) {
                this.gameWrapper.input.mouse.setCoordinates(point);
            };
            /**
             * Convert map coordinates to mouse coordinates.
             * @param point
             */
            CanvasUtilsBase.prototype.mapToMouse = function (point) {
                var playerPosition = this.gameWrapper.player.getPosition();
                var mousePoint = new KartwarsBot.Point2D((point.x - playerPosition.x) * window.game.world.scale.x, (point.y - playerPosition.y) * window.game.world.scale.y);
                return mousePoint;
            };
            /**
             * Map cordinates to Canvas cordinate shortcut
             * @param point
             */
            CanvasUtilsBase.prototype.mapToCanvas = function (point) {
                var playerPosition = this.gameWrapper.player.getPosition();
                var canvasPoint = new KartwarsBot.Point2D((window.game.canvas.width / 2) + (point.x - playerPosition.x) * window.game.world.scale.x, (window.game.canvas.height / 2) + (point.y - playerPosition.y) * window.game.world.scale.y);
                return canvasPoint;
            };
            /**
             * Map to Canvas coordinate conversion for drawing circles.
             * Radius also needs to scale by .gsc
             * @param circle
             */
            CanvasUtilsBase.prototype.circleMapToCanvas = function (circle) {
                var newCircle = this.mapToCanvas(circle);
                return new KartwarsBot.Circle(newCircle.x, newCircle.y, circle.radius * window.game.world.scale.x);
            };
            /**
             * Adjusts zoom in response to the mouse wheel.
             * @param e
             */
            CanvasUtilsBase.prototype.setZoom = function (e) {
                // TODO : Review
                // let isInside = $('.dg.ac').data('isInside');
                var isInside = $(window.botFactory.datGUI.gui.domElement.parentElement).data('isInside');
                if (isInside) {
                    return;
                }
                //
                // Scaling ratio
                if (window.game.world.scale.x) {
                    var scaleValue = window.game.world.scale.x;
                    scaleValue *= Math.pow(0.9, e.wheelDelta / -120 || e.detail / 2 || 0);
                    if (scaleValue < 0.25) {
                        scaleValue = 0.25;
                    }
                    else if (scaleValue > 1.5) {
                        scaleValue = 1.5;
                    }
                    window.game.world.scale.x = window.game.world.scale.y = scaleValue;
                    window.desired_gsc = window.game.world.scale.x;
                }
            };
            /**
             * Restores zoom to the default value.
             */
            CanvasUtilsBase.prototype.resetZoom = function () {
                window.game.world.scale.x = window.game.world.scale.y = 0.8116666666666666;
                window.desired_gsc = 0.8116666666666666;
            };
            /**
             * Maintains Zoom
             */
            CanvasUtilsBase.prototype.maintainZoom = function () {
                if (window.desired_gsc !== undefined) {
                    window.game.world.scale.x = window.game.world.scale.y = window.desired_gsc;
                }
            };
            // Sets background to the given image URL.
            // Defaults to kartwars.io's own background.
            CanvasUtilsBase.prototype.setBackground = function (url) {
                throw new Error('Not implemented');
            };
            /**
             * Draw a rectangle on the canvas.
             * @param rect
             * @param rotation
             * @param color
             * @param fill
             * @param alpha
             */
            CanvasUtilsBase.prototype.drawRect = function (rect, rotation, color, fill, alpha) {
                if (alpha === undefined)
                    alpha = 1;
                var context = this.gameWrapper.input.canvas.getContext();
                //let lc = this.mapToCanvas({ x: rect.x, y: rect.y });
                //let lc = this.mapToCanvas({ x: rect.x - rect.width / 2, y: rect.y - rect.height / 2 });
                var lc = this.mapToCanvas(new KartwarsBot.Point2D(rect.x, rect.y));
                var width = rect.width * window.game.world.scale.x, height = rect.height * window.game.world.scale.y;
                // first save the untranslated/unrotated context
                context.save();
                context.beginPath();
                context.globalAlpha = alpha;
                context.shadowBlur = this.opt.shadowBlur;
                context.shadowColor = color;
                context.strokeStyle = color;
                // move the rotation point to the center of the rect
                context.translate(lc.x + width / 2, lc.y + height / 2);
                // rotate the rect
                //ctx.rotate(degrees * Math.PI / 180);
                context.rotate(rotation);
                // draw the rect on the transformed context
                // Note: after transforming [0,0] is visually [x,y]
                //       so the rect needs to be offset accordingly when drawn
                //ctx.rect(-width / 2, -height / 2, width, height);
                context.rect(-width / 2, -height / 2, width, height);
                context.stroke();
                if (fill) {
                    context.fillStyle = color;
                    context.fill();
                }
                // restore the context to its untranslated/unrotated state
                context.restore();
            };
            /**
             * Draw a circle on the canvas.
             * @param circle
             * @param color
             * @param fill
             * @param alpha
             */
            CanvasUtilsBase.prototype.drawCircle = function (circle, color, fill, alpha) {
                var thisCircle = circle;
                if (alpha === undefined)
                    alpha = 1;
                if (thisCircle.radius === undefined)
                    thisCircle.radius = 5;
                var context = this.gameWrapper.input.canvas.getContext();
                var drawCircle = this.circleMapToCanvas(thisCircle);
                context.save();
                context.globalAlpha = alpha;
                context.beginPath();
                context.shadowBlur = this.opt.shadowBlur;
                context.shadowColor = color;
                context.strokeStyle = color;
                context.arc(drawCircle.x, drawCircle.y, drawCircle.radius, 0, Math.PI * 2);
                context.stroke();
                if (fill) {
                    context.fillStyle = color;
                    context.fill();
                }
                context.restore();
            };
            /**
             * Draw a circle on the canvas.
             * @param circle
             * @param directionInRadian
             * @param emptyRadian
             * @param color
             * @param fill
             * @param alpha
             * @param clockwise
             */
            CanvasUtilsBase.prototype.drawArc = function (circle, directionInRadian, emptyRadian, color, fill, alpha, clockwise) {
                if (clockwise === undefined)
                    clockwise = true;
                if (alpha === undefined)
                    alpha = 1;
                if (circle.radius === undefined)
                    circle.radius = 5;
                var context = this.gameWrapper.input.canvas.getContext();
                var drawCircle = this.circleMapToCanvas(circle);
                var halfEmptyRadian = emptyRadian / 2;
                context.save();
                context.globalAlpha = alpha;
                context.beginPath();
                context.shadowBlur = this.opt.shadowBlur;
                context.shadowColor = color;
                context.strokeStyle = color;
                context.arc(drawCircle.x, drawCircle.y, drawCircle.radius, directionInRadian - halfEmptyRadian, directionInRadian + halfEmptyRadian, clockwise);
                context.stroke();
                if (fill) {
                    context.fillStyle = color;
                    context.fill();
                }
                context.restore();
            };
            /*
            // TODO : Unused
            // Draw an angle.
            // @param {number} start -- where to start the angle
            // @param {number} angle -- width of the angle
            // @param {bool} danger -- green if false, red if true
            @MethodDecoration.bound
            public drawAngle(start, angle, color, fill, alpha) {
                if (alpha === undefined) alpha = 0.6;
        
                let context = this.gameWrapper.input.canvas.getContext();
        
                context.save();
                context.globalAlpha = alpha;
                context.shadowBlur = this.opt.shadowBlur;
                context.shadowColor = color;
                context.beginPath();
                context.moveTo(window.game.canvas.width / 2, window.game.canvas.height / 2);
                context.arc(window.game.canvas.width / 2, window.game.canvas.height / 2, window.game.world.scale.x * 100, start, angle);
                context.lineTo(window.game.canvas.width / 2, window.game.canvas.height / 2);
                context.closePath();
                context.stroke();
                if (fill) {
                    context.fillStyle = color;
                    context.fill();
                }
                context.restore();
            }
            */
            /**
             * Draw a cross on the canvas.
             * @param point
             * @param color
             * @param width
             * @param alpha
             */
            CanvasUtilsBase.prototype.drawCross = function (point, color, width, alpha) {
                var context = this.gameWrapper.input.canvas.getContext();
                var canvas = context.canvas;
                point = this.mapToCanvas(point);
                this.drawLine(new KartwarsBot.Point2D(0, point.y), new KartwarsBot.Point2D(canvas.width, point.y), color, width, 0.15, false);
                this.drawLine(new KartwarsBot.Point2D(point.x, 0), new KartwarsBot.Point2D(point.x, canvas.height), color, width, alpha, false);
            };
            /**
             * Draw a line on the canvas.
             * @param p1
             * @param p2
             * @param color
             * @param width
             * @param alpha
             * @param mapToCanvas
             */
            CanvasUtilsBase.prototype.drawLine = function (p1, p2, color, width, alpha, mapToCanvas) {
                if (width === undefined)
                    width = 5;
                if (alpha === undefined)
                    alpha = 1.0;
                if (mapToCanvas === undefined)
                    mapToCanvas = true;
                var context = this.gameWrapper.input.canvas.getContext();
                if (mapToCanvas) {
                    p1 = this.mapToCanvas(p1);
                    p2 = this.mapToCanvas(p2);
                }
                context.save();
                context.globalAlpha = alpha;
                context.beginPath();
                context.lineWidth = width * window.game.world.scale.x;
                context.shadowBlur = this.opt.shadowBlur;
                context.shadowColor = color;
                context.strokeStyle = color;
                context.moveTo(p1.x, p1.y);
                context.lineTo(p2.x, p2.y);
                context.stroke();
                context.restore();
            };
            CanvasUtilsBase.prototype.drawTriangle = function (p1, p2, p3, color, width, fill, alpha, mapToCanvas) {
                if (width === undefined)
                    width = 5;
                if (alpha === undefined)
                    alpha = 1.0;
                if (mapToCanvas === undefined)
                    mapToCanvas = true;
                var context = this.gameWrapper.input.canvas.getContext();
                if (mapToCanvas) {
                    p1 = this.mapToCanvas(p1);
                    p2 = this.mapToCanvas(p2);
                    p3 = this.mapToCanvas(p3);
                }
                context.save();
                context.globalAlpha = alpha;
                context.beginPath();
                context.lineWidth = width * window.game.world.scale.x;
                context.shadowBlur = this.opt.shadowBlur;
                context.shadowColor = color;
                context.strokeStyle = color;
                context.moveTo(p1.x, p1.y);
                context.lineTo(p2.x, p2.y);
                context.lineTo(p3.x, p3.y);
                context.stroke();
                if (fill) {
                    context.fillStyle = color;
                    context.fill();
                }
                context.restore();
            };
            CanvasUtilsBase.prototype.drawPolygon = function (points, color, width, fill, alpha, mapToCanvas) {
                if (points.length < 3) {
                    throw new Error("Polygon must have more than 2 vertices. Supplied number of vertices: " + points.length);
                }
                if (width === undefined)
                    width = 5;
                if (alpha === undefined)
                    alpha = 1.0;
                if (mapToCanvas === undefined)
                    mapToCanvas = true;
                var context = this.gameWrapper.input.canvas.getContext();
                if (mapToCanvas) {
                    for (var idx = 0, length_1 = points.length; idx < length_1; idx++) {
                        points[idx] = this.mapToCanvas(points[idx]);
                    }
                }
                context.save();
                context.globalAlpha = alpha;
                context.beginPath();
                context.lineWidth = width * window.game.world.scale.x;
                context.shadowBlur = this.opt.shadowBlur;
                context.shadowColor = color;
                context.strokeStyle = color;
                context.moveTo(points[0].x, points[0].y);
                for (var idx = 1, length_2 = points.length, point = undefined; point = points[idx], idx < length_2; idx++) {
                    context.lineTo(point.x, point.y);
                }
                context.closePath();
                context.stroke();
                if (fill) {
                    context.fillStyle = color;
                    context.fill();
                }
                context.restore();
            };
            /**
             * Draw text on the canvas.
             * @param point
             * @param text
             * @param color
             * @param alpha
             * @param mapToCanvas
             */
            CanvasUtilsBase.prototype.drawText = function (point, text, color, alpha, mapToCanvas) {
                if (alpha === undefined)
                    alpha = 1.0;
                if (mapToCanvas === undefined)
                    mapToCanvas = true;
                var context = this.gameWrapper.input.canvas.getContext();
                if (mapToCanvas) {
                    point = this.mapToCanvas(point);
                }
                context.save();
                context.globalAlpha = alpha;
                context.shadowBlur = this.opt.shadowBlur;
                context.shadowColor = color;
                context.fillStyle = color;
                context.font = 'bold 20px Arial';
                context.fillText(text, point.x, point.y);
                //context.stroke();
                context.restore();
            };
            return CanvasUtilsBase;
        }());
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], CanvasUtilsBase.prototype, "setMouseCoordinates", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], CanvasUtilsBase.prototype, "mapToMouse", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], CanvasUtilsBase.prototype, "mapToCanvas", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], CanvasUtilsBase.prototype, "drawRect", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], CanvasUtilsBase.prototype, "drawCircle", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], CanvasUtilsBase.prototype, "drawArc", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], CanvasUtilsBase.prototype, "drawCross", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], CanvasUtilsBase.prototype, "drawLine", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], CanvasUtilsBase.prototype, "drawTriangle", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], CanvasUtilsBase.prototype, "drawPolygon", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], CanvasUtilsBase.prototype, "drawText", null);
        KartwarsBot.CanvasUtilsBase = CanvasUtilsBase;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
        /**
         * Canvas draw for Composed objects.
         */
        var CanvasUtils = (function (_super) {
            __extends(CanvasUtils, _super);
            function CanvasUtils() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            CanvasUtils.wrappedDrawInterceptor = function (fx) {
                CanvasUtils.interceptedWrappedDrawCalls.push(fx);
            };
            /**
             * Calls all below intercepted drawing methods.
             */
            CanvasUtils.prototype.drawAllInterceptedWrappedCalls = function () {
                window.botFactory.clock.startFrame();
                if (window.visualDebugging) {
                    CanvasUtils.interceptedWrappedDrawCalls.forEach(function (fx) {
                        fx();
                    });
                }
                CanvasUtils.interceptedWrappedDrawCalls = [];
                window.botFactory.clock.endFrame();
            };
            /**
             * Draw global goal on canvas on the canvas.
             * @param goalCoordinates
             */
            CanvasUtils.prototype.drawGoal = function (goalCoordinates) {
                var playerPosition = this.gameWrapper.player.getPosition();
                this.drawLine(playerPosition, goalCoordinates, this.opt.colors.goalLine, 2);
                this.drawCircle(goalCoordinates, this.opt.colors.goalDot, true);
                this.drawCross(goalCoordinates, this.opt.colors.goalCross, undefined, 0.05);
            };
            /**
             * Draw collision point on the canvas.
             * @param collisionPoint
             */
            CanvasUtils.prototype.drawCollisionPoint = function (collisionPoint) {
                this.drawCircle(collisionPoint, this.opt.colors.collidedPoint, true);
            };
            /**
             * Draw collision circle on the canvas.
             * @param collisionCircle
             */
            CanvasUtils.prototype.drawCollisionCircle = function (collisionCircle) {
                this.drawCircle(collisionCircle, this.opt.colors.collidedElement, false);
            };
            CanvasUtils.prototype.drawCollisionPolygon = function (polygon) {
                this.drawPolygon(polygon.geometryAsPoint2DArray, this.opt.colors.collidedElement, undefined, false);
            };
            /**
             * Draw collision avoidance lines on the canvas.
             * @param collisionPoint
             * @param avoidancePoint
             */
            CanvasUtils.prototype.drawCollisionAvoidance = function (collisionPoint, avoidancePoint) {
                var playerPosition = this.gameWrapper.player.getPosition();
                this.drawLine(playerPosition, avoidancePoint, this.opt.colors.collisionAvoidancePointA, 5);
                this.drawLine(playerPosition, collisionPoint, this.opt.colors.collisionAvoidancePointB, 5);
            };
            /**
             * Draw food cluster on the canvas.
             * @param circle
             * @param quantity
             */
            CanvasUtils.prototype.drawFoodCluster = function (circle, quantity) {
                var playerPosition = this.gameWrapper.player.getPosition();
                this.drawCircle(circle, this.opt.colors.foodCluster, false, 0.5);
                this.drawText(circle, quantity.toString(), this.opt.colors.foodClusterText);
                this.drawLine(playerPosition, circle, this.opt.colors.foodClusterLine, 2, 0.25);
                /*
                let bigCircle: Circle = {
                    x: clusterMedianX,
                    y: clusterMedianY,
                    radius: clusterRadius * Cluster.radiusMultiplier
                };
    
                this.drawCircle(bigCircle, 'white', false, 0.25);
                */
            };
            /**
             * Draw food cluster boundary on the canvas.
             * @param radius
             */
            CanvasUtils.prototype.drawFoodClusterBoundary = function (radius) {
                var playerPosition = this.gameWrapper.player.getPosition();
                var foodClusterBoundaryCircle = new KartwarsBot.Circle(playerPosition.x, playerPosition.y, radius);
                this.drawCircle(foodClusterBoundaryCircle, this.opt.colors.foodClusterBoundary, false);
            };
            /**
             * Draw resource on the canvas.
             * @param resourceCircle
             * @param canBeCollected
             */
            CanvasUtils.prototype.drawResource = function (resourceCircle, canBeCollected) {
                if (!this.opt.draw.food) {
                    return;
                }
                this.drawCircle(resourceCircle, this.opt.colors.inRangeResource);
                if (canBeCollected) {
                    var canBeCollectedResourceCircle = new KartwarsBot.Circle(resourceCircle.x, resourceCircle.y, resourceCircle.radius + 15);
                    this.drawCircle(canBeCollectedResourceCircle, this.opt.colors.collectableResource);
                }
            };
            // TODO : Review
            CanvasUtils.prototype.drawTunnel = function (left, right, alpha) {
                if (alpha == undefined) {
                    alpha = 0.15;
                }
                this.drawLine(left.point1, left.point2, 'black', 3, alpha);
                this.drawLine(right.point1, right.point2, 'black', 3, alpha);
            };
            /**
             * Draw intersection prediction on the canvas.
             * @param goalCoordinates
             */
            CanvasUtils.prototype.drawIntersectionPrediction = function (goalCoordinates) {
                var playerPosition = this.gameWrapper.player.getPosition();
                this.drawLine(playerPosition, goalCoordinates, this.opt.colors.predictionLine, 12, 0.75);
                this.drawCircle(goalCoordinates, this.opt.colors.predictionCircle, false, 0.75);
            };
            /**
             * Draw encircled player on the canvas.
             * @param playerCircle
             * @param danger
             */
            CanvasUtils.prototype.drawEncircledPlayer = function (playerCircle, danger) {
                var color = (danger ? this.opt.colors.encircledPlayerDanger : this.opt.colors.encircledPlayerWarning);
                this.drawCircle(playerCircle, color, true, 0.2);
            };
            /**
             * Draw collision elements and draw lines to collision angles on the canvas.
             * @param collisionElements
             * @param collisionAngles
             */
            CanvasUtils.prototype.drawCollisionElements = function (collisionElements, collisionAngles) {
                if (!this.opt.draw.dangers) {
                    return;
                }
                //if (this.bot.opt.draw.enemies) {
                var playerPosition = this.gameWrapper.player.getPosition();
                for (var idx = 0, ll = collisionElements.length; idx < ll; idx++) {
                    var thisCollisionPoint = collisionElements[idx];
                    if (thisCollisionPoint !== undefined) {
                        switch (thisCollisionPoint.shapeType) {
                            case KartwarsBot.CollisionElementType.Circle:
                                {
                                    this.drawCircle(thisCollisionPoint, this.opt.colors.collisionElement, false, 0.25);
                                }
                                break;
                            case KartwarsBot.CollisionElementType.Polygon:
                                {
                                    var points = thisCollisionPoint.geometry.map(function (element) {
                                        return new KartwarsBot.Point2D(element.x, element.y);
                                    });
                                    this.drawPolygon(points, this.opt.colors.collisionElement, undefined, true, 0.1);
                                }
                                break;
                        }
                    }
                }
                for (var idx = 0, ll = collisionAngles.length; idx < ll; idx++) {
                    var thisCollisionAngles = collisionAngles[idx];
                    if (thisCollisionAngles !== undefined) {
                        this.drawLine(playerPosition, new KartwarsBot.Point2D(thisCollisionAngles.x, thisCollisionAngles.y), this.opt.colors.collisionLine, 2, 0.25);
                    }
                }
                //}
            };
            /**
             * Draw player on the canvas.
             * @param playerCircle
             * @param playerResourceGatherCircle
             * @param headCircle
             * @param tailCircle
             * @param leftSideCircle
             * @param rightSideCircle
             * @param emptyDangerRadian
             */
            CanvasUtils.prototype.drawPlayer = function (playerCircle, playerResourceGatherCircle, headCircle, tailCircle, closeToImminentDangerCircle, leftSideCircle, rightSideCircle, emptyDangerRadian, emptyTailDangerRadian, emptyResourceGatherRadian) {
                if (!this.opt.draw.player) {
                    return;
                }
                var playerRotation = this.gameWrapper.player.getRotation();
                //
                // Draw Close To Imminent Danger Circle
                {
                    this.drawCircle(closeToImminentDangerCircle, this.opt.colors.closeToImminentDangerRadius, false, 0.35);
                }
                //
                // Draw Resource Gather Arc
                {
                    this.drawArc(playerResourceGatherCircle, playerRotation, emptyResourceGatherRadian, this.opt.colors.frontResourceGatherArc, undefined, undefined, false);
                }
                //
                // Draw front Resource Gather lines
                {
                    var pointA = KartwarsBot.MathUtils.arcPoint(playerResourceGatherCircle.x, playerResourceGatherCircle.y, playerResourceGatherCircle.radius, playerRotation - (emptyResourceGatherRadian / 2));
                    var pointB = KartwarsBot.MathUtils.arcPoint(playerResourceGatherCircle.x, playerResourceGatherCircle.y, playerResourceGatherCircle.radius, playerRotation + (emptyResourceGatherRadian / 2));
                    this.drawLine(new KartwarsBot.Point2D(playerResourceGatherCircle.x, playerResourceGatherCircle.y), pointA, this.opt.colors.frontResourceGatherArc);
                    this.drawLine(new KartwarsBot.Point2D(playerResourceGatherCircle.x, playerResourceGatherCircle.y), pointB, this.opt.colors.frontResourceGatherArc);
                }
                {
                    this.drawCircle(headCircle, this.opt.colors.playerHeadDetector, false);
                    this.drawCircle(tailCircle, this.opt.colors.playerTailDetector, false);
                    this.drawCircle(leftSideCircle, this.opt.colors.playerSideDetector, false);
                    this.drawCircle(rightSideCircle, this.opt.colors.playerSideDetector, false);
                }
                {
                    this.drawArc(playerCircle, playerRotation, emptyDangerRadian, this.opt.colors.playerRadius);
                    this.drawArc(playerCircle, playerRotation, emptyDangerRadian, this.opt.colors.frontDangerArc, true, 0.1, false);
                }
                //
                // Experimental
                /*
                this.drawRect(new Rect(
                    playerCircle.x, // - (circle.radius / 2),
                    playerCircle.y, // - (circle.radius / 2),
                    playerCircle.radius,
                    playerCircle.radius),
                    playerRotation,
                    'pink', false, 0.25
                );
                */
                //
                // Draw front lines
                {
                    var pointA = KartwarsBot.MathUtils.arcPoint(playerCircle.x, playerCircle.y, playerCircle.radius, playerRotation - (emptyDangerRadian / 2));
                    var pointB = KartwarsBot.MathUtils.arcPoint(playerCircle.x, playerCircle.y, playerCircle.radius, playerRotation + (emptyDangerRadian / 2));
                    this.drawTriangle(pointA, playerCircle, pointB, this.opt.colors.frontDangerArc, undefined, true, 0.1);
                    this.drawLine(new KartwarsBot.Point2D(playerCircle.x, playerCircle.y), pointA, this.opt.colors.playerRadius);
                    this.drawLine(new KartwarsBot.Point2D(playerCircle.x, playerCircle.y), pointB, this.opt.colors.playerRadius);
                }
                //
                // Draw tail lines
                {
                    var pointA = KartwarsBot.MathUtils.arcPoint(playerCircle.x, playerCircle.y, playerCircle.radius, playerRotation + Math.PI - (emptyTailDangerRadian / 2));
                    var pointB = KartwarsBot.MathUtils.arcPoint(playerCircle.x, playerCircle.y, playerCircle.radius, playerRotation + Math.PI + (emptyTailDangerRadian / 2));
                    this.drawLine(new KartwarsBot.Point2D(playerCircle.x, playerCircle.y), pointA, this.opt.colors.tailDangerArc);
                    this.drawLine(new KartwarsBot.Point2D(playerCircle.x, playerCircle.y), pointB, this.opt.colors.tailDangerArc);
                }
            };
            return CanvasUtils;
        }(KartwarsBot.CanvasUtilsBase));
        CanvasUtils.interceptedWrappedDrawCalls = [];
        __decorate([
            KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
        ], CanvasUtils.prototype, "drawGoal", null);
        __decorate([
            KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
        ], CanvasUtils.prototype, "drawCollisionPoint", null);
        __decorate([
            KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
        ], CanvasUtils.prototype, "drawCollisionCircle", null);
        __decorate([
            KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
        ], CanvasUtils.prototype, "drawCollisionPolygon", null);
        __decorate([
            KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
        ], CanvasUtils.prototype, "drawCollisionAvoidance", null);
        __decorate([
            KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
        ], CanvasUtils.prototype, "drawFoodCluster", null);
        __decorate([
            KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
        ], CanvasUtils.prototype, "drawFoodClusterBoundary", null);
        __decorate([
            KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
        ], CanvasUtils.prototype, "drawResource", null);
        __decorate([
            KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
        ], CanvasUtils.prototype, "drawTunnel", null);
        __decorate([
            KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
        ], CanvasUtils.prototype, "drawIntersectionPrediction", null);
        __decorate([
            KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
        ], CanvasUtils.prototype, "drawEncircledPlayer", null);
        __decorate([
            KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
        ], CanvasUtils.prototype, "drawCollisionElements", null);
        __decorate([
            KartwarsBot.MethodDecoration.intercept(CanvasUtils.wrappedDrawInterceptor)
        ], CanvasUtils.prototype, "drawPlayer", null);
        KartwarsBot.CanvasUtils = CanvasUtils;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

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
        var WebSocketDataTypeEnum;
        (function (WebSocketDataTypeEnum) {
            WebSocketDataTypeEnum[WebSocketDataTypeEnum["WeaponStatus"] = 31] = "WeaponStatus";
            WebSocketDataTypeEnum[WebSocketDataTypeEnum["SelfItemStatus"] = 7] = "SelfItemStatus";
            WebSocketDataTypeEnum[WebSocketDataTypeEnum["AddItem"] = 11] = "AddItem";
        })(WebSocketDataTypeEnum = KartwarsBot.WebSocketDataTypeEnum || (KartwarsBot.WebSocketDataTypeEnum = {}));
        var WebSocketSelfItemActivatedDataTypeEnum;
        (function (WebSocketSelfItemActivatedDataTypeEnum) {
            WebSocketSelfItemActivatedDataTypeEnum[WebSocketSelfItemActivatedDataTypeEnum["Shield"] = 28] = "Shield";
        })(WebSocketSelfItemActivatedDataTypeEnum = KartwarsBot.WebSocketSelfItemActivatedDataTypeEnum || (KartwarsBot.WebSocketSelfItemActivatedDataTypeEnum = {}));
        var WebSocketAddItemActivatedDataTypeEnum;
        (function (WebSocketAddItemActivatedDataTypeEnum) {
            WebSocketAddItemActivatedDataTypeEnum[WebSocketAddItemActivatedDataTypeEnum["Missile"] = 13] = "Missile";
            WebSocketAddItemActivatedDataTypeEnum[WebSocketAddItemActivatedDataTypeEnum["TeleMissile"] = 14] = "TeleMissile";
        })(WebSocketAddItemActivatedDataTypeEnum = KartwarsBot.WebSocketAddItemActivatedDataTypeEnum || (KartwarsBot.WebSocketAddItemActivatedDataTypeEnum = {}));
        var WebSocketInterfaceOptions = (function () {
            function WebSocketInterfaceOptions() {
                this.maxDistanceForDetectingSelfDeployedWeapons = 200;
            }
            return WebSocketInterfaceOptions;
        }());
        KartwarsBot.WebSocketInterfaceOptions = WebSocketInterfaceOptions;
        /**
         * Web Socket `Man-In-The-Middle` Attacker.
         */
        var WebSocketInterface = (function () {
            function WebSocketInterface() {
                this.opt = new WebSocketInterfaceOptions();
            }
            WebSocketInterface.prototype.onGameReadyDelegate = function () {
                this.original_WebSocketOnMessage = window.ws.onmessage;
                window.ws.onmessage = this.onMessage;
            };
            WebSocketInterface.prototype.onMessage = function (e) {
                window.botFactory.clock.startFrame('async');
                var myID = window.mainCar.id;
                function processCarWeapon(carId, weaponIndex) {
                    var thisCar = window.sprites[carId];
                    if (void 0 != thisCar) {
                        if (thisCar.weapon == undefined) {
                            thisCar.weapon = new KartwarsBot.CarWeaponData(weaponIndex);
                        }
                        //thisCar.weapon = weaponIndex;
                        thisCar.weapon.weaponType = weaponIndex;
                    }
                    /*
                    if (void 0 != window.sprites[myID]) {
                        if (carId == myID) {
                            if (0 == weaponIndex) {
                                window.log('WS: No item');
                            }
                            else {
                                switch (weaponIndex) {
                                    case CarWeapon.FastRocket:
                                        window.log('WS: Fast Rocket');
                                        break;
                                    case CarWeapon.ThreeFastRockets:
                                        window.log('WS: 3 x Fast Rockets');
                                        break;
                                    case CarWeapon.TeleRocket:
                                        window.log('WS: Tele Rocket');
                                        break;
                                    case CarWeapon.Cloak:
                                        window.log('WS: Cloak');
                                        break;
                                    case CarWeapon.Mine:
                                        window.log('WS: Mine');
                                        break;
                                    case CarWeapon.ThreeMines:
                                        window.log('WS: 3 x Mines');
                                        break;
                                    case CarWeapon.BigBang:
                                        window.log('WS: Big Bang');
                                        break;
                                    case CarWeapon.ThreeTeleRocket:
                                        window.log('WS: 3 x Tele Rocket');
                                        break;
                                    case CarWeapon.Shield:
                                        window.log('WS: Shield');
                                        break;
                                    case CarWeapon.Flashes:
                                        window.log('WS: Flashes');
                                        break;
                                    case CarWeapon.Magnet:
                                        window.log('WS: Magnet');
                                        break;
                                    case CarWeapon.HugeShield:
                                        window.log('WS: Huge Shield');
                                        break;
                                }
                            }
                        }
                        else {
                        }
                    }
                    */
                }
                function processCarShield(carId, specialCase, activationKey) {
                    var thisCar = window.sprites[carId];
                    if (0 != activationKey && 'undefined' != typeof thisCar) {
                        switch (specialCase) {
                            case WebSocketSelfItemActivatedDataTypeEnum.Shield:
                                {
                                    var active = (1 == activationKey);
                                    thisCar.isShieldActivated = active;
                                    thisCar.shieldActivationTime = active ? new Date() : null;
                                }
                                break;
                        }
                    }
                }
                function wsUnknownProcess1(carId, i, t, a, weaponIndex) {
                    window.sprites[carId] instanceof Car && null != weaponIndex && processCarWeapon(carId, weaponIndex);
                }
                var data = new Int16Array(e.data);
                switch (data[0]) {
                    case WebSocketDataTypeEnum.WeaponStatus:
                        {
                            // window.log('Got [31] data', data);
                            for (var f = data[1], b = 2, u = 0; f > u; u++) {
                                wsUnknownProcess1(data[b], data[b + 1], data[b + 2], data[b + 3], data[b + 4]),
                                    b += 5;
                            }
                        }
                        break;
                    case WebSocketDataTypeEnum.SelfItemStatus:
                        {
                            for (var b = 1; b + 4 < data.length;) {
                                var p = data[b++];
                                b++;
                                processCarShield(p, WebSocketSelfItemActivatedDataTypeEnum.Shield, data[b++]);
                                b++;
                                b++;
                            }
                        }
                        break;
                    case WebSocketDataTypeEnum.AddItem:
                        {
                            for (var b = 1; b + 3 < data.length;) {
                                var itemId = data[b++], addItemSpecialCase = data[b++], itemPositionX = data[b++], itemPositionY = data[b++], K = data[b++], D = data[b++];
                                // 11 == S ? esto.addItem(P, M, K, p, D, 0)
                                // 13 == S ? esto.addMisil(P, M, K, p, D)
                                // 14 == S ? esto.addMisilTele(P, M, K, p)
                                // 15 == S ? esto.addMina(P, M, K, p)
                                // 16 == S ? esto.addBomba(P, M, K, p, 0)
                                // TODO : Review
                                var bot = window.botFactory.bot;
                                var gameWrapper = window.botFactory.gameWrapper;
                                if (!bot.shapesHolster || !bot.shapesHolster.tunnelLeftSideLine || !bot.shapesHolster.tunnelRightSideLine) {
                                    return;
                                }
                                var deployedWeaponCoordinates = new KartwarsBot.Point2D(itemPositionX, itemPositionY);
                                var kartPosition = new KartwarsBot.Point2D(window.mainCar.img.position.x, window.mainCar.img.position.y);
                                var distance = KartwarsBot.MathUtils.getDistance(kartPosition, deployedWeaponCoordinates);
                                if (distance <= this.opt.maxDistanceForDetectingSelfDeployedWeapons /*&& window.mainCar.weapon.weaponType != CarWeapon.None*/) {
                                    var isDeployedWeaponInTunnel = KartwarsBot.MathUtils.isLeft(bot.shapesHolster.tunnelLeftSideLine.point1, bot.shapesHolster.tunnelLeftSideLine.point2, deployedWeaponCoordinates) &&
                                        KartwarsBot.MathUtils.isRight(bot.shapesHolster.tunnelRightSideLine.point1, bot.shapesHolster.tunnelRightSideLine.point2, deployedWeaponCoordinates);
                                    if (isDeployedWeaponInTunnel) {
                                        switch (addItemSpecialCase) {
                                            case WebSocketAddItemActivatedDataTypeEnum.Missile:
                                                {
                                                    gameWrapper.items.ignoreMissilesById(itemId);
                                                }
                                                break;
                                            case WebSocketAddItemActivatedDataTypeEnum.TeleMissile:
                                                {
                                                    gameWrapper.items.ignoreMissilesById(itemId);
                                                }
                                                break;
                                        }
                                    }
                                }
                            }
                        }
                        break;
                }
                window.botFactory.clock.endFrame('async');
                this.original_WebSocketOnMessage(e);
            };
            return WebSocketInterface;
        }());
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], WebSocketInterface.prototype, "onMessage", null);
        KartwarsBot.WebSocketInterface = WebSocketInterface;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Tactics;
        (function (Tactics) {
            var Fight;
            (function (Fight) {
                var FightTactics;
                (function (FightTactics) {
                    FightTactics[FightTactics["ShootWhenInRange"] = 0] = "ShootWhenInRange";
                })(FightTactics = Fight.FightTactics || (Fight.FightTactics = {}));
            })(Fight = Tactics.Fight || (Tactics.Fight = {}));
        })(Tactics = KartwarsBot.Tactics || (KartwarsBot.Tactics = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Tactics;
        (function (Tactics) {
            var Fight;
            (function (Fight) {
                /**
                 * Chase Closest enemy Tactic.
                 */
                var ChaseClosest = (function () {
                    // Constructor
                    function ChaseClosest(bot, gameWrapper, canvas) {
                        this.bot = bot;
                        this.gameWrapper = gameWrapper;
                        this.canvas = canvas;
                    }
                    /**
                     * Chase an enemy if player has a weapon that shoots in front.
                     */
                    ChaseClosest.prototype.action = function (projectileMagnitude) {
                        var enemies = this.gameWrapper.items.getEnemies();
                        var resetEnemy = true;
                        if (this.currentTarget != undefined) {
                            var enemyId = this.currentTarget.enemyId;
                            if (enemyId != undefined) {
                                for (var i = 0, ls = enemies.length; i < ls && enemies[i] !== null; i++) {
                                    var thisEnemy = enemies[i];
                                    if (thisEnemy.id == enemyId) {
                                        this.currentTarget.x = thisEnemy.x;
                                        this.currentTarget.y = thisEnemy.y;
                                        resetEnemy = false;
                                        break;
                                    }
                                }
                            }
                        }
                        if (resetEnemy) {
                            if (enemies.length > 0) {
                                for (var i = 0, ls = enemies.length; i < ls && enemies[i] !== null; i++) {
                                    var thisEnemy = enemies[i];
                                    if (thisEnemy.velocity) {
                                        window.log("Chasing new enemy with id " + thisEnemy.id);
                                        this.currentTarget = {
                                            reference: thisEnemy,
                                            x: thisEnemy.x,
                                            y: thisEnemy.y,
                                            enemyId: thisEnemy.id
                                        };
                                        break;
                                    }
                                }
                            }
                        }
                        if (this.currentTarget) {
                            var selectedEnemy = this.currentTarget.reference;
                            if (selectedEnemy) {
                                var goalCoordinates = void 0;
                                this.bot.stage = KartwarsBot.BotStageEnum.InterceptEnemy;
                                // This might fail if there's no quadratic solution
                                if (projectileMagnitude > 0) {
                                    goalCoordinates = KartwarsBot.MathUtils.predictIntersectionEx(window.mainCar, selectedEnemy, projectileMagnitude);
                                }
                                if (!goalCoordinates) {
                                    goalCoordinates = KartwarsBot.MathUtils.predictIntersection(window.mainCar, selectedEnemy);
                                }
                                // Draw intersection prediction
                                this.canvas.drawIntersectionPrediction(goalCoordinates);
                                return KartwarsBot.ActivityResult.CreateValidResponse(goalCoordinates);
                            }
                        }
                        return KartwarsBot.ActivityResult.CreateInvalidResponse();
                    };
                    return ChaseClosest;
                }());
                Fight.ChaseClosest = ChaseClosest;
            })(Fight = Tactics.Fight || (Tactics.Fight = {}));
        })(Tactics = KartwarsBot.Tactics || (KartwarsBot.Tactics = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Tactics;
        (function (Tactics) {
            var Fight;
            (function (Fight) {
                /**
                 * Shoot When In Range Tactic.
                 */
                var ShootWhenInRange = (function () {
                    // Constructor
                    function ShootWhenInRange(bot, gameWrapper, canvas) {
                        this.bot = bot;
                        this.gameWrapper = gameWrapper;
                        this.canvas = canvas;
                    }
                    ShootWhenInRange.prototype.noop = function () {
                        //
                    };
                    ShootWhenInRange.prototype.action = function (radiusCheck) {
                        if (window.mainCar.weapon) {
                            var enemies = this.gameWrapper.items.getEnemies();
                            var triggerWeaponAnywhere = window.mainCar.weapon.triggerLocation == KartwarsBot.CarWeaponTrigger.Self;
                            var triggerWeaponInFront = window.mainCar.weapon.triggerLocation == KartwarsBot.CarWeaponTrigger.Front;
                            var triggerWeaponBehind = window.mainCar.weapon.triggerLocation == KartwarsBot.CarWeaponTrigger.Behind;
                            for (var idx = 0, ll = enemies.length; idx < ll; idx++) {
                                var thisEnemy = enemies[idx];
                                // TODO : Check if enemy in range
                                if ((triggerWeaponInFront && this.bot.inFrontDangerAngle(thisEnemy, radiusCheck)) ||
                                    (triggerWeaponBehind && this.bot.inTailDangerAngle(thisEnemy, radiusCheck)) ||
                                    triggerWeaponAnywhere) {
                                    //this.bot.stage = BotStageEnum.DeployWeapon;
                                    this.bot.fireWeaponTick();
                                    break;
                                }
                            }
                        }
                    };
                    return ShootWhenInRange;
                }());
                Fight.ShootWhenInRange = ShootWhenInRange;
            })(Fight = Tactics.Fight || (Tactics.Fight = {}));
        })(Tactics = KartwarsBot.Tactics || (KartwarsBot.Tactics = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Tactics;
        (function (Tactics) {
            var Resource;
            (function (Resource) {
                var ResourcePriority;
                (function (ResourcePriority) {
                    ResourcePriority[ResourcePriority["Food"] = 0] = "Food";
                    ResourcePriority[ResourcePriority["Weapon"] = 1] = "Weapon";
                })(ResourcePriority = Resource.ResourcePriority || (Resource.ResourcePriority = {}));
            })(Resource = Tactics.Resource || (Tactics.Resource = {}));
        })(Tactics = KartwarsBot.Tactics || (KartwarsBot.Tactics = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Tactics;
        (function (Tactics) {
            var Resource;
            (function (Resource) {
                /**
                 * Base Find Closest Resource Tactic.
                 */
                var FindClosestResourceBase = (function () {
                    // Constructor
                    function FindClosestResourceBase(bot, gameWrapper, canvas) {
                        this.bot = bot;
                        this.gameWrapper = gameWrapper;
                        this.canvas = canvas;
                        this.currentTarget = undefined;
                    }
                    FindClosestResourceBase.prototype.noop = function () {
                        this.currentTarget = undefined;
                    };
                    FindClosestResourceBase.prototype.action = function (resources) {
                        if (!this.stabilizeResource(resources)) {
                            for (var i = 0, ll = resources.length, thisResource = null; i < ll && (thisResource = resources[i]) !== null; i++) {
                                if (!this.canBeCollected(thisResource)) {
                                    thisResource.distance = Infinity;
                                }
                            }
                            // Sort by distance
                            resources.sort(KartwarsBot.ArrayUtils.sortDistance);
                            //
                            // Select first available resource
                            var firstResource = null;
                            if (typeof (firstResource = resources[0]) !== 'undefined') {
                                this.currentTarget = new KartwarsBot.Bot2Point2D(firstResource.x, firstResource.y, 50, 0.1, // ??
                                0, 0, firstResource.id);
                            }
                            else {
                                this.currentTarget = new KartwarsBot.Bot2Point2D(this.bot.worldCenterX, this.bot.worldCenterY, 0, 0, 0, 0, undefined);
                            }
                        }
                        return KartwarsBot.ActivityResult.CreateValidResponse(this.currentTarget);
                    };
                    /**
                     * Determines if the resource is easy accessible and does require too many turns and misses.
                     * @param thisResource
                     */
                    FindClosestResourceBase.prototype.canBeCollected = function (thisResource) {
                        var thisResourceCircle = new KartwarsBot.Circle(thisResource.x, thisResource.y, 2);
                        if (!this.bot.inFrontResourceGatherAngle(thisResourceCircle)) {
                            return false;
                        }
                        var leftSideCircleIntersection = this.bot.math.circleIntersect(thisResourceCircle, this.bot.shapesHolster.playerLeftSideCircle);
                        if (leftSideCircleIntersection.status >= KartwarsBot.ShapesIntersectionStatus.ShapeInside) {
                            return false;
                        }
                        var rightSideCircleIntersection = this.bot.math.circleIntersect(thisResourceCircle, this.bot.shapesHolster.playerRightSideCircle);
                        if (rightSideCircleIntersection.status >= KartwarsBot.ShapesIntersectionStatus.ShapeInside) {
                            return false;
                        }
                        return true;
                    };
                    /**
                     * Decides if last chosen resource still exists and is collectable so there won't created a chaotic decision every time.
                     * @param resources
                     * @return true if resource is still valid, false otherwise.
                     */
                    FindClosestResourceBase.prototype.stabilizeResource = function (resources) {
                        //if (this.currentResource != undefined && this.bot.inFrontAngle(this.currentResource)) {
                        if (this.currentTarget != undefined) {
                            var resourceId = this.currentTarget.resourceId;
                            if (resourceId != undefined) {
                                for (var idx = 0, ll = resources.length, thisResource = null; idx < ll && (thisResource = resources[idx]) !== null; idx++) {
                                    if (thisResource.id == resourceId) {
                                        return this.canBeCollected(thisResource);
                                    }
                                }
                            }
                        }
                        return false;
                    };
                    /**
                     * Draw close resources based on the `canBeCollected` method.
                     * @param resources
                     * @param baseRadius
                     */
                    //@visualDebug
                    FindClosestResourceBase.prototype.drawResources = function (resources, baseRadius) {
                        if (window.visualDebugging && this.canvas.opt.draw.player) {
                            var playerResourceGatherRadius = this.bot.shapesHolster.playerResourceGatherCircle.radius;
                            for (var i = 0, ll = resources.length, thisResource = null; i < ll && (thisResource = resources[i]) !== null; i++) {
                                if (thisResource.distance <= playerResourceGatherRadius) {
                                    var canBeCollected = this.canBeCollected(thisResource);
                                    this.canvas.drawResource(new KartwarsBot.Circle(thisResource.x, thisResource.y, baseRadius), canBeCollected);
                                }
                                else {
                                    break;
                                }
                            }
                        }
                    };
                    return FindClosestResourceBase;
                }());
                Resource.FindClosestResourceBase = FindClosestResourceBase;
            })(Resource = Tactics.Resource || (Tactics.Resource = {}));
        })(Tactics = KartwarsBot.Tactics || (KartwarsBot.Tactics = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Tactics;
        (function (Tactics) {
            var Resource;
            (function (Resource) {
                var Food;
                (function (Food) {
                    var FoodTactics;
                    (function (FoodTactics) {
                        FoodTactics[FoodTactics["Default"] = 0] = "Default";
                    })(FoodTactics = Food.FoodTactics || (Food.FoodTactics = {}));
                })(Food = Resource.Food || (Resource.Food = {}));
            })(Resource = Tactics.Resource || (Tactics.Resource = {}));
        })(Tactics = KartwarsBot.Tactics || (KartwarsBot.Tactics = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Tactics;
        (function (Tactics) {
            var Resource;
            (function (Resource) {
                var Food;
                (function (Food) {
                    /**
                     * Find Closest food Tactic.
                     */
                    var FindClosest = (function (_super) {
                        __extends(FindClosest, _super);
                        function FindClosest() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        FindClosest.prototype.action = function (food) {
                            window.botFactory.clock.startFrame();
                            if (food == undefined) {
                                food = this.gameWrapper.items.getFood();
                            }
                            this.bot.stage = KartwarsBot.BotStageEnum.SeekFood;
                            var activityResult = _super.prototype.action.call(this, food);
                            this.drawResources(food, this.bot.opt.fixedRadius.food);
                            window.botFactory.clock.endFrame();
                            return activityResult;
                        };
                        return FindClosest;
                    }(Resource.FindClosestResourceBase));
                    Food.FindClosest = FindClosest;
                })(Food = Resource.Food || (Resource.Food = {}));
            })(Resource = Tactics.Resource || (Tactics.Resource = {}));
        })(Tactics = KartwarsBot.Tactics || (KartwarsBot.Tactics = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Tactics;
        (function (Tactics) {
            var Resource;
            (function (Resource) {
                var Food;
                (function (Food) {
                    var FindClosestClusterOptions = (function () {
                        function FindClosestClusterOptions() {
                            this.scanRadius = 3500 / 2;
                            this.sectorSize = 350;
                            this.minimumElementsPerCluster = 15;
                        }
                        return FindClosestClusterOptions;
                    }());
                    Food.FindClosestClusterOptions = FindClosestClusterOptions;
                })(Food = Resource.Food || (Resource.Food = {}));
            })(Resource = Tactics.Resource || (Tactics.Resource = {}));
        })(Tactics = KartwarsBot.Tactics || (KartwarsBot.Tactics = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

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
        var Tactics;
        (function (Tactics) {
            var Resource;
            (function (Resource) {
                var Food;
                (function (Food) {
                    /**
                     * Find Closest Cluster Tactic.
                     */
                    var FindClosestCluster = (function () {
                        // Constructor
                        function FindClosestCluster(bot, gameWrapper, canvas) {
                            this.bot = bot;
                            this.gameWrapper = gameWrapper;
                            this.canvas = canvas;
                            this.opt = new Food.FindClosestClusterOptions();
                            this.foodClusterWrapper = new KartwarsBot.ClusterWrapper();
                        }
                        FindClosestCluster.prototype.noop = function () {
                        };
                        // TODO : Add Weapons to list too
                        FindClosestCluster.prototype.action = function (food) {
                            window.botFactory.clock.startFrame();
                            if (food == undefined) {
                                food = this.gameWrapper.items.getFood();
                            }
                            //this.bot.stage = BotStageEnum.SeekFoodCluster;
                            var localFoodClusters = [];
                            var playerPosition = this.gameWrapper.player.getPosition();
                            var playerRadius = this.opt.scanRadius;
                            food = food.filter(function (el) {
                                return el.distance <= playerRadius;
                            });
                            window.botFactory.clock.startFrame('ElementsDensity');
                            var clusters = KartwarsBot.MathUtils.get2DElementsDensity(food, this.opt.sectorSize, this.opt.minimumElementsPerCluster);
                            window.botFactory.clock.endFrame('ElementsDensity');
                            for (var clusterIdx = 0, clusterLength = clusters.length; clusterIdx < clusterLength; clusterIdx++) {
                                var indexesInThisCluster = clusters[clusterIdx];
                                var clusterMinX = Infinity, clusterMinY = Infinity, clusterMaxX = -Infinity, clusterMaxY = -Infinity;
                                var localSprites = [];
                                for (var clusterIdy = 0, spritesLength = indexesInThisCluster.length; clusterIdy < spritesLength; clusterIdy++) {
                                    var element = indexesInThisCluster[clusterIdy];
                                    var sprite = food[element];
                                    clusterMinX = Math.min(clusterMinX, sprite.x);
                                    clusterMinY = Math.min(clusterMinY, sprite.y);
                                    clusterMaxX = Math.max(clusterMaxX, sprite.x);
                                    clusterMaxY = Math.max(clusterMaxY, sprite.y);
                                    localSprites.push(sprite);
                                }
                                var clusterMedianX = (clusterMinX + clusterMaxX) / 2, clusterMedianY = (clusterMinY + clusterMaxY) / 2, clusterRadius = Math.max(clusterMaxX - clusterMinX, clusterMaxY - clusterMinY) / 2;
                                var circle = new KartwarsBot.Circle(clusterMedianX, clusterMedianY, clusterRadius);
                                var thisCluster = new KartwarsBot.Cluster(circle, localSprites);
                                thisCluster.distance = KartwarsBot.MathUtils.getDistance(thisCluster, playerPosition);
                                localFoodClusters.push(thisCluster);
                                // Draw food cluster
                                this.canvas.drawFoodCluster(circle, indexesInThisCluster.length);
                            }
                            // Draw food cluster scan boundary
                            this.canvas.drawFoodClusterBoundary(playerRadius);
                            this.foodClusterWrapper.foodClusters = localFoodClusters;
                            window.botFactory.clock.endFrame();
                            return KartwarsBot.ActivityResult.CreateCustomResponse(this.foodClusterWrapper);
                        };
                        return FindClosestCluster;
                    }());
                    __decorate([
                        KartwarsBot.MethodDecoration.trace
                    ], FindClosestCluster.prototype, "action", null);
                    Food.FindClosestCluster = FindClosestCluster;
                })(Food = Resource.Food || (Resource.Food = {}));
            })(Resource = Tactics.Resource || (Tactics.Resource = {}));
        })(Tactics = KartwarsBot.Tactics || (KartwarsBot.Tactics = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Tactics;
        (function (Tactics) {
            var Resource;
            (function (Resource) {
                var Weapon;
                (function (Weapon) {
                    var WeaponTactics;
                    (function (WeaponTactics) {
                        WeaponTactics[WeaponTactics["WeaponTactics"] = 0] = "WeaponTactics";
                    })(WeaponTactics = Weapon.WeaponTactics || (Weapon.WeaponTactics = {}));
                })(Weapon = Resource.Weapon || (Resource.Weapon = {}));
            })(Resource = Tactics.Resource || (Tactics.Resource = {}));
        })(Tactics = KartwarsBot.Tactics || (KartwarsBot.Tactics = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Tactics;
        (function (Tactics) {
            var Resource;
            (function (Resource) {
                var Weapon;
                (function (Weapon) {
                    /**
                     * Find Closest weapon Tactic.
                     */
                    var FindClosest = (function (_super) {
                        __extends(FindClosest, _super);
                        function FindClosest() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        FindClosest.prototype.action = function (weapons) {
                            window.botFactory.clock.startFrame();
                            if (weapons == undefined) {
                                weapons = this.gameWrapper.items.getWeapons();
                            }
                            this.bot.stage = KartwarsBot.BotStageEnum.SeekWeapon;
                            var activityResult = _super.prototype.action.call(this, weapons);
                            this.drawResources(weapons, this.bot.opt.fixedRadius.weapon);
                            window.botFactory.clock.endFrame();
                            return activityResult;
                        };
                        return FindClosest;
                    }(Resource.FindClosestResourceBase));
                    Weapon.FindClosest = FindClosest;
                })(Weapon = Resource.Weapon || (Resource.Weapon = {}));
            })(Resource = Tactics.Resource || (Tactics.Resource = {}));
        })(Tactics = KartwarsBot.Tactics || (KartwarsBot.Tactics = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Behaviour;
        (function (Behaviour) {
            var FoodBehaviour;
            (function (FoodBehaviour) {
                FoodBehaviour[FoodBehaviour["DoNotSeekFood"] = 0] = "DoNotSeekFood";
                FoodBehaviour[FoodBehaviour["SeekFood"] = 1] = "SeekFood";
                // SeekFoodCluster,
                FoodBehaviour[FoodBehaviour["SeekFoodInsideFoodCluster"] = 2] = "SeekFoodInsideFoodCluster";
                // InterceptFood, // ??
                // StayInsideFoodCluster
            })(FoodBehaviour = Behaviour.FoodBehaviour || (Behaviour.FoodBehaviour = {}));
            var WeaponBehaviour;
            (function (WeaponBehaviour) {
                WeaponBehaviour[WeaponBehaviour["DoNotSeekWeapons"] = 0] = "DoNotSeekWeapons";
                WeaponBehaviour[WeaponBehaviour["SeekWeaponsBasedOnAggressivity"] = 1] = "SeekWeaponsBasedOnAggressivity";
            })(WeaponBehaviour = Behaviour.WeaponBehaviour || (Behaviour.WeaponBehaviour = {}));
            var FightBehaviour;
            (function (FightBehaviour) {
                FightBehaviour[FightBehaviour["DoNotFight"] = 0] = "DoNotFight";
                FightBehaviour[FightBehaviour["ShootImmediately"] = 1] = "ShootImmediately";
                FightBehaviour[FightBehaviour["ShootWhenEnemyInCloseRange"] = 2] = "ShootWhenEnemyInCloseRange";
                FightBehaviour[FightBehaviour["ShootWhenEnemyInBigRange"] = 3] = "ShootWhenEnemyInBigRange";
                FightBehaviour[FightBehaviour["InterceptAndShootWhenEnemyInTunnel"] = 4] = "InterceptAndShootWhenEnemyInTunnel";
            })(FightBehaviour = Behaviour.FightBehaviour || (Behaviour.FightBehaviour = {}));
            var AvoidanceBehaviour;
            (function (AvoidanceBehaviour) {
                AvoidanceBehaviour[AvoidanceBehaviour["DoNotAvoid"] = 0] = "DoNotAvoid";
                AvoidanceBehaviour[AvoidanceBehaviour["AvoidLethalEnemies"] = 1] = "AvoidLethalEnemies";
            })(AvoidanceBehaviour = Behaviour.AvoidanceBehaviour || (Behaviour.AvoidanceBehaviour = {}));
            var BehaviourBuilder = (function () {
                function BehaviourBuilder() {
                }
                BehaviourBuilder.getDefaultBehaviour = function () {
                    var behaviourData = new BehaviourData();
                    behaviourData.Food = FoodBehaviour.SeekFoodInsideFoodCluster;
                    behaviourData.Weapon = WeaponBehaviour.SeekWeaponsBasedOnAggressivity;
                    behaviourData.Fight = FightBehaviour.ShootImmediately;
                    behaviourData.Avoidance = AvoidanceBehaviour.AvoidLethalEnemies;
                    return behaviourData;
                };
                return BehaviourBuilder;
            }());
            Behaviour.BehaviourBuilder = BehaviourBuilder;
            var BehaviourData = (function () {
                function BehaviourData() {
                }
                Object.defineProperty(BehaviourData.prototype, "Food", {
                    get: function () {
                        return this._food;
                    },
                    set: function (value) {
                        this._food = FoodBehaviour[FoodBehaviour[value]];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BehaviourData.prototype, "Weapon", {
                    get: function () {
                        return this._weapon;
                    },
                    set: function (value) {
                        this._weapon = WeaponBehaviour[WeaponBehaviour[value]];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BehaviourData.prototype, "Fight", {
                    get: function () {
                        return this._fight;
                    },
                    set: function (value) {
                        this._fight = FightBehaviour[FightBehaviour[value]];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BehaviourData.prototype, "Avoidance", {
                    get: function () {
                        return this._avoidance;
                    },
                    set: function (value) {
                        this._avoidance = AvoidanceBehaviour[AvoidanceBehaviour[value]];
                    },
                    enumerable: true,
                    configurable: true
                });
                return BehaviourData;
            }());
            BehaviourData.defaultBehaviour = BehaviourBuilder.getDefaultBehaviour();
            Behaviour.BehaviourData = BehaviourData;
        })(Behaviour = KartwarsBot.Behaviour || (KartwarsBot.Behaviour = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Strategy;
        (function (Strategy) {
            var Strategies;
            (function (Strategies) {
                Strategies[Strategies["Default"] = 0] = "Default";
                // Tests
                Strategies[Strategies["CalculateTorque"] = 1] = "CalculateTorque";
                Strategies[Strategies["BasicPursuit"] = 2] = "BasicPursuit";
                Strategies[Strategies["PursuitAndShoot"] = 3] = "PursuitAndShoot";
                Strategies[Strategies["DrawEnemies"] = 4] = "DrawEnemies";
                Strategies[Strategies["InterconnectFood"] = 5] = "InterconnectFood";
            })(Strategies = Strategy.Strategies || (Strategy.Strategies = {}));
        })(Strategy = KartwarsBot.Strategy || (KartwarsBot.Strategy = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Strategy;
        (function (Strategy) {
            var StrategyBase = (function () {
                // Constructor
                function StrategyBase(bot, gameWrapper, canvas) {
                    this.bot = bot;
                    this.gameWrapper = gameWrapper;
                    this.canvas = canvas;
                    this._guiElements = [];
                    this._guiIsInitialised = false;
                    //
                    // canUseChasingPrediction property
                    this.useChasingPrediction = true;
                    this._forceChasingPrediction = false;
                    // !canUseChasingPrediction property
                    //
                    //
                    // selectedFoodTactics property
                    this._selectedFoodTactics = KartwarsBot.Tactics.Resource.Food.FoodTactics.Default;
                    // !selectedFoodTactics property
                    //
                    //
                    // selectedFightTactics property
                    this._selectedFightTactics = KartwarsBot.Tactics.Fight.FightTactics.ShootWhenInRange;
                    // !selectedFoodTactics property
                    //
                    //
                    // FoodTactics property
                    this._foodTactics = [];
                    // !FoodTactics property
                    //
                    //
                    // FightTactics property
                    this._fightTactics = [];
                    this.FindClosestClusterFoodTactics = new KartwarsBot.Tactics.Resource.Food.FindClosestCluster(bot, this.gameWrapper, this.canvas);
                    this.ChaseClosestFightTactics = new KartwarsBot.Tactics.Fight.ChaseClosest(bot, this.gameWrapper, this.canvas);
                    this.WeaponTactics = new KartwarsBot.Tactics.Resource.Weapon.FindClosest(bot, this.gameWrapper, this.canvas);
                }
                Object.defineProperty(StrategyBase.prototype, "canUseChasingPrediction", {
                    get: function () {
                        return this._forceChasingPrediction || this.useChasingPrediction;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(StrategyBase.prototype, "selectedFoodTactics", {
                    get: function () {
                        return this._selectedFoodTactics;
                    },
                    set: function (value) {
                        this._selectedFoodTactics = KartwarsBot.Tactics.Resource.Food.FoodTactics[KartwarsBot.Tactics.Resource.Food.FoodTactics[value]];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(StrategyBase.prototype, "selectedFightTactics", {
                    get: function () {
                        return this._selectedFightTactics;
                    },
                    set: function (value) {
                        this._selectedFightTactics = KartwarsBot.Tactics.Fight.FightTactics[KartwarsBot.Tactics.Fight.FightTactics[value]];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(StrategyBase.prototype, "FoodTactics", {
                    get: function () {
                        var selectedFoodTacticsOption = this.selectedFoodTactics;
                        var selectedFoodTactics = this._foodTactics[selectedFoodTacticsOption];
                        if (selectedFoodTactics == undefined) {
                            var instance = void 0;
                            switch (selectedFoodTacticsOption) {
                                case KartwarsBot.Tactics.Resource.Food.FoodTactics.Default:
                                    {
                                        instance = new KartwarsBot.Tactics.Resource.Food.FindClosest(this.bot, this.gameWrapper, this.canvas);
                                    }
                                    break;
                                default: {
                                    throw Error("Incompatible value or type '" + selectedFoodTacticsOption + "' in Strategy. Type: " + typeof selectedFoodTacticsOption + ".");
                                }
                            }
                            selectedFoodTactics = this._foodTactics[selectedFoodTacticsOption] = instance;
                        }
                        return selectedFoodTactics;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(StrategyBase.prototype, "FightTactics", {
                    get: function () {
                        var selectedFightTacticsOption = this.selectedFightTactics;
                        var selectedFightTactics = this._fightTactics[selectedFightTacticsOption];
                        if (selectedFightTactics == undefined) {
                            var instance = void 0;
                            switch (selectedFightTacticsOption) {
                                case KartwarsBot.Tactics.Fight.FightTactics.ShootWhenInRange:
                                    {
                                        instance = new KartwarsBot.Tactics.Fight.ShootWhenInRange(this.bot, this.gameWrapper, this.canvas);
                                    }
                                    break;
                                default: {
                                    throw Error("Incompatible value or type '" + selectedFightTacticsOption + "' in Strategy. Type: " + typeof selectedFightTacticsOption + ".");
                                }
                            }
                            selectedFightTactics = this._fightTactics[selectedFightTacticsOption] = instance;
                        }
                        return selectedFightTactics;
                    },
                    enumerable: true,
                    configurable: true
                });
                // !FightTactics property
                //
                StrategyBase.prototype.showDatGui = function (datGUIWrapper) {
                    if (!this._guiIsInitialised) {
                        this.initDatGui(datGUIWrapper);
                    }
                    else {
                        this._guiElements.forEach(function (element) {
                            $(element).show();
                        });
                    }
                };
                StrategyBase.prototype.hideDatGui = function () {
                    if (this._guiIsInitialised) {
                        this._guiElements.forEach(function (element) {
                            $(element).hide();
                        });
                    }
                };
                return StrategyBase;
            }());
            Strategy.StrategyBase = StrategyBase;
        })(Strategy = KartwarsBot.Strategy || (KartwarsBot.Strategy = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Strategy;
        (function (Strategy) {
            /**
             * Default working strategy.
             */
            var DefaultStrategy = (function (_super) {
                __extends(DefaultStrategy, _super);
                function DefaultStrategy() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    // TODO : Comments
                    _this.FOOD_VALUE = 1;
                    _this.WEAPON_VALUE = 5;
                    _this.aggressivity = 65;
                    _this._collectedWeapons = 0;
                    _this.lastWeaponStatus = KartwarsBot.CarWeapon.None;
                    return _this;
                }
                Object.defineProperty(DefaultStrategy.prototype, "collectedWeapons", {
                    get: function () {
                        return this._collectedWeapons;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * On Player Death's event.
                 */
                DefaultStrategy.prototype.onPlayerDeath = function () {
                    this._collectedWeapons = 0;
                };
                DefaultStrategy.prototype.action = function () {
                    var finalActivityResult;
                    window.botFactory.clock.startFrame();
                    // Show Rage message when Shield is activated
                    window.botFactory.userInterface.setRageVisible(window.mainCar.isShieldActivated);
                    // Decides whether to run for food or weapons
                    var resourcePriority = this.resourcePriority();
                    this.fightCheck();
                    var collisionManagerActivityResult;
                    var computeCollisions = true;
                    // Disable collision computations when shield is active
                    if (window.mainCar.isShieldActivated) {
                        var elepsedTime = +(new Date()) - (+window.mainCar.shieldActivationTime);
                        // Shield lasts for 10 seconds, but this will give time to evade any danger before it expires
                        if (elepsedTime < 7500) {
                            computeCollisions = false;
                        }
                    }
                    if (computeCollisions) {
                        collisionManagerActivityResult = this.bot.CollisionManager.action();
                    }
                    if (collisionManagerActivityResult && collisionManagerActivityResult.isValid) {
                        finalActivityResult = collisionManagerActivityResult;
                    }
                    else {
                        var chaseClosestFightTacticsActivityResult = null;
                        if (window.mainCar.weapon) {
                            var triggerWeaponInFront = window.mainCar.weapon.triggerLocation == KartwarsBot.CarWeaponTrigger.Front;
                            if (triggerWeaponInFront) {
                                if (this.canUseChasingPrediction) {
                                    var currentWeaponMagnitude = void 0;
                                    if (this._forceChasingPrediction) {
                                        currentWeaponMagnitude = window.mainCar.weapon.magnitude;
                                    }
                                    chaseClosestFightTacticsActivityResult = this.ChaseClosestFightTactics.action(currentWeaponMagnitude);
                                }
                            }
                        }
                        if (chaseClosestFightTacticsActivityResult && chaseClosestFightTacticsActivityResult.isValid) {
                            finalActivityResult = chaseClosestFightTacticsActivityResult;
                        }
                        else {
                            finalActivityResult = this.resourceAction(resourcePriority);
                        }
                    }
                    window.botFactory.clock.endFrame();
                    return finalActivityResult;
                };
                /**
                 * Decides whether to run for food or weapons.
                 */
                DefaultStrategy.prototype.resourcePriority = function () {
                    var currentWeaponType;
                    if (window.mainCar.weapon && (currentWeaponType = window.mainCar.weapon.weaponType) != KartwarsBot.CarWeapon.None) {
                        if (currentWeaponType != this.lastWeaponStatus) {
                            this._collectedWeapons++;
                            this.lastWeaponStatus = currentWeaponType;
                        }
                    }
                    else {
                        this.lastWeaponStatus = KartwarsBot.CarWeapon.None;
                    }
                    //
                    //
                    var aggressivity = this.aggressivity;
                    var weaponA = Math.ceil(aggressivity / this.WEAPON_VALUE);
                    var foodA = 100 - aggressivity;
                    var ratio = Math.ceil(foodA / weaponA);
                    //
                    //
                    // We don't ever care for food loss.
                    var collectedFood = window.myCoins;
                    var weaponsGoal = Math.floor(collectedFood / ratio);
                    if (weaponsGoal > this._collectedWeapons) {
                        return KartwarsBot.Tactics.Resource.ResourcePriority.Weapon;
                    }
                    return KartwarsBot.Tactics.Resource.ResourcePriority.Food;
                };
                /**
                 * Fight check.
                 */
                DefaultStrategy.prototype.fightCheck = function () {
                    window.botFactory.clock.startFrame();
                    if (this.aggressivity <= 0) {
                        return;
                    }
                    var defaultBehaviour = KartwarsBot.Behaviour.BehaviourData.defaultBehaviour;
                    // Reset Force Chasing Prediction
                    this._forceChasingPrediction = false;
                    switch (defaultBehaviour.Fight) {
                        case KartwarsBot.Behaviour.FightBehaviour.DoNotFight:
                            {
                                // NOOP
                                this.FightTactics.noop();
                            }
                            break;
                        case KartwarsBot.Behaviour.FightBehaviour.ShootImmediately:
                            {
                                this.bot.fireWeapon();
                            }
                            break;
                        case KartwarsBot.Behaviour.FightBehaviour.ShootWhenEnemyInCloseRange:
                            {
                                this.FightTactics.action();
                            }
                            break;
                        case KartwarsBot.Behaviour.FightBehaviour.ShootWhenEnemyInBigRange:
                            {
                                this.FightTactics.action(this.bot.shapesHolster.playerCircle.radius * 2);
                            }
                            break;
                        case KartwarsBot.Behaviour.FightBehaviour.InterceptAndShootWhenEnemyInTunnel: {
                            // TODO : Review
                            if (window.mainCar.weapon) {
                                var doFightTactics = false;
                                if (window.mainCar.weapon.isLethalWeapon) {
                                    var triggerWeaponInFront = window.mainCar.weapon.triggerLocation == KartwarsBot.CarWeaponTrigger.Front;
                                    var triggerWeaponBehind = window.mainCar.weapon.triggerLocation == KartwarsBot.CarWeaponTrigger.Behind;
                                    if (triggerWeaponInFront) {
                                        // window.log((+new Date()), `magnitude = ${window.mainCar.weapon.magnitude}`);
                                        if (window.mainCar.weapon.magnitude > 0) {
                                            this._forceChasingPrediction = true;
                                            if (this.bot.stage == KartwarsBot.BotStageEnum.InterceptEnemy) {
                                                if (this.bot.goal.state == KartwarsBot.GoalState.InFront) {
                                                    if (!window.mainCar.weapon.weaponFired) {
                                                        // window.log((+new Date()), `GoalIsInTunnel! WeaponType = ${CarWeapon[window.mainCar.weapon.weaponType]}`);
                                                        doFightTactics = true;
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            doFightTactics = true;
                                        }
                                    }
                                    else if (triggerWeaponBehind) {
                                        this._forceChasingPrediction = true;
                                        if (this.bot.stage == KartwarsBot.BotStageEnum.InterceptEnemy) {
                                            if (this.bot.goal.state == KartwarsBot.GoalState.InBack) {
                                                if (!window.mainCar.weapon.weaponFired) {
                                                    // window.log((+new Date()), `GoalIsInTunnel! WeaponType = ${CarWeapon[window.mainCar.weapon.weaponType]}`);
                                                    doFightTactics = true;
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        doFightTactics = true;
                                    }
                                }
                                else {
                                    doFightTactics = true;
                                }
                                if (doFightTactics) {
                                    this.FightTactics.action();
                                }
                            }
                        }
                    }
                    window.botFactory.clock.endFrame();
                };
                /**
                 * Based on Resource Priority seek food or weapons.
                 * @param resourcePriority
                 */
                DefaultStrategy.prototype.resourceAction = function (resourcePriority) {
                    var resourceActivityResult = null;
                    var defaultBehaviour = KartwarsBot.Behaviour.BehaviourData.defaultBehaviour;
                    if (defaultBehaviour.Weapon == KartwarsBot.Behaviour.WeaponBehaviour.DoNotSeekWeapons) {
                        return this.foodAction();
                    }
                    if (resourcePriority == KartwarsBot.Tactics.Resource.ResourcePriority.Food) {
                        resourceActivityResult = this.foodAction();
                    }
                    else {
                        resourceActivityResult = this.weaponAction();
                    }
                    return resourceActivityResult;
                };
                /**
                 * Weapon action.
                 */
                DefaultStrategy.prototype.weaponAction = function () {
                    return this.WeaponTactics.action();
                };
                /**
                 * Food action.
                 */
                DefaultStrategy.prototype.foodAction = function () {
                    var foodTacticsActivityResult = null;
                    window.botFactory.clock.startFrame();
                    var defaultBehaviour = KartwarsBot.Behaviour.BehaviourData.defaultBehaviour;
                    if (this.gameWrapper.util.isPlaying) {
                        switch (defaultBehaviour.Food) {
                            case KartwarsBot.Behaviour.FoodBehaviour.DoNotSeekFood:
                                {
                                    // NOOP
                                    this.FoodTactics.noop();
                                    foodTacticsActivityResult = KartwarsBot.ActivityResult.CreateInvalidResponse();
                                }
                                break;
                            case KartwarsBot.Behaviour.FoodBehaviour.SeekFood:
                                {
                                    foodTacticsActivityResult = this.FoodTactics.action();
                                }
                                break;
                            /*
                            case Behaviour.FoodBehaviour.SeekFoodCluster: {
                                // TODO : Not Implemented
                                this.FoodTactics.noop();
                            } break;
                            */
                            case KartwarsBot.Behaviour.FoodBehaviour.SeekFoodInsideFoodCluster:
                                {
                                    //
                                    // Experimental
                                    var activityResult = this.FindClosestClusterFoodTactics.action();
                                    var foodClusterWrapper = activityResult.customData;
                                    var cluster = foodClusterWrapper.getBestCluster();
                                    if ((cluster != undefined) && (cluster.distance < cluster.highRadius)) {
                                        this.canvas.drawCircle(cluster, 'white', true, 0.15);
                                        //TraceRegister.originalNames['FindClosestCluster'] = `${cluster.distance} with ${cluster.elements.length}`;
                                        foodTacticsActivityResult = this.FoodTactics.action(cluster.elements);
                                    }
                                    else {
                                        /*
                                        if (cluster != undefined) {
                                            TraceRegister.originalNames['FindClosestCluster'] = `${cluster.distance}`;
                                        } else {
                                            TraceRegister.originalNames['FindClosestCluster'] = 'none';
                                        }
                                        */
                                        foodTacticsActivityResult = this.FoodTactics.action();
                                    }
                                }
                                break;
                            default:
                                {
                                    foodTacticsActivityResult = KartwarsBot.ActivityResult.CreateInvalidResponse();
                                }
                                break;
                        }
                    }
                    window.botFactory.clock.endFrame();
                    return foodTacticsActivityResult;
                };
                DefaultStrategy.prototype.initDatGui = function (datGUIWrapper) {
                    var _this = this;
                    if (this._guiIsInitialised) {
                        return;
                    }
                    var gui = datGUIWrapper.gui;
                    var smallestRadianDivisions = 32;
                    var defaultBehaviour = KartwarsBot.Behaviour.BehaviourData.defaultBehaviour;
                    {
                        var botOptions = gui.addFolder('Bot Options');
                        this._guiElements.push(botOptions.domElement);
                        //botOptions.open();
                        gui.remember(this.bot);
                        gui.remember(this.bot.opt);
                        gui.remember(this.bot.opt.radiusEnchancer);
                        gui.remember(this.bot.opt.wall);
                        //botOptions.add(this.bot.opt, 'targetFps', 10, 60).step(5);
                        botOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.arcSize; }), Math.PI / smallestRadianDivisions, Math.PI * 2).step(Math.PI / smallestRadianDivisions).listen();
                        {
                            var radiusOptions = botOptions.addFolder('Radius');
                            radiusOptions.open();
                            radiusOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.playerRadiusMultiplier; }), 1, 50).step(0.5).name('Player');
                            radiusOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.playerResourceGatherRadiusMultiplier; }), 1, 50).step(0.5).name('Resource Gather');
                            radiusOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.radiusFrontDetectorMultiplier; }), 0.1, 50).step(0.1).name('Front Detector');
                            radiusOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.radiusBehindDetectorMultiplier; }), 0.1, 50).step(0.1).name('Behind Detector');
                            radiusOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.radiusSideDetectorsMultiplier; }), 1, 10).step(0.1).name('Side Detectors');
                            radiusOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.radiusDangerMultiplier; }), 0.1, 50).step(0.1).name('Danger');
                            radiusOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.closeToImminentDangerRange; }), 5, 1500).step(5).name('Close To Imminent Danger');
                            {
                                // TODO : WIP
                                var radiusIndividualOptions = radiusOptions.addFolder('Individual');
                            }
                        }
                        {
                            var anglesOptions = botOptions.addFolder('Angles');
                            anglesOptions.open();
                            anglesOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.frontResourceGatherAngle; }), Math.PI / smallestRadianDivisions, Math.PI * 2).step(Math.PI / smallestRadianDivisions).name('Front Resource Gather');
                            anglesOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.frontDangerAngle; }), Math.PI / smallestRadianDivisions, Math.PI * 2).step(Math.PI / smallestRadianDivisions).name('Front Danger');
                            anglesOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.tailDangerAngle; }), Math.PI / smallestRadianDivisions, Math.PI * 2).step(Math.PI / smallestRadianDivisions).name('Tail Danger');
                        }
                        {
                            var collisionManagerOptions = botOptions.addFolder('Collision Manager');
                            collisionManagerOptions.open();
                            collisionManagerOptions.add(this.bot.CollisionManager.opt, KartwarsBot.nameof(function () { return _this.bot.CollisionManager.opt.avoidanceAngle; }), -Math.PI, Math.PI).step(Math.PI / smallestRadianDivisions).name('Avoidance Angle');
                            collisionManagerOptions.add(this.bot.CollisionManager.opt, KartwarsBot.nameof(function () { return _this.bot.CollisionManager.opt.tailedDetectorAdditionalAvoidanceAngle; }), 0, Math.PI).step(Math.PI / smallestRadianDivisions).name('Tailed Avoidance Angle+');
                            collisionManagerOptions.add(this.bot.CollisionManager.opt, KartwarsBot.nameof(function () { return _this.bot.CollisionManager.opt.tailedDetectorThresholdAngle; }), Math.PI / smallestRadianDivisions, Math.PI).step(Math.PI / smallestRadianDivisions).name('Tailed Threshold Detector Angle');
                            collisionManagerOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.enCircleThreshold; }), 0.05, 1).step(0.0005).name('Encircle Threshold');
                            collisionManagerOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.enCircleAllThreshold; }), 0.05, 1).step(0.0005).name('Encircle All Threshold');
                            collisionManagerOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.enCircleDistanceMult; }), 1, 50).step(0.5).name('Encircle Distance Multiplier');
                        }
                        {
                            var wallOffsetOptions = botOptions.addFolder('Offsets');
                            wallOffsetOptions.open();
                            wallOffsetOptions.add(this.bot.opt.wall, KartwarsBot.nameof(function () { return _this.bot.opt.wall.offsetLeftX; }), -1000, 1000).step(5).name('Left X');
                            wallOffsetOptions.add(this.bot.opt.wall, KartwarsBot.nameof(function () { return _this.bot.opt.wall.offsetRightX; }), -1000, 1000).step(5).name('Right X');
                            wallOffsetOptions.add(this.bot.opt.wall, KartwarsBot.nameof(function () { return _this.bot.opt.wall.offsetTopY; }), -1000, 1000).step(5).name('Top Y');
                            wallOffsetOptions.add(this.bot.opt.wall, KartwarsBot.nameof(function () { return _this.bot.opt.wall.offsetBottomY; }), -1000, 1000).step(5).name('Bottom Y');
                        }
                        botOptions.add(this.bot.opt, KartwarsBot.nameof(function () { return _this.bot.opt.tunnelSideDistance; }), 10, 250).step(1).name('Tunnel Side Distance');
                        botOptions.add(this.bot, KartwarsBot.nameof(function () { return _this.bot.speedMult; }), 0.1, 10).step(0.1);
                        botOptions.add(this.bot.opt.radiusEnchancer, KartwarsBot.nameof(function () { return _this.bot.opt.radiusEnchancer.misiles; }), 50, 1500).step(25);
                        botOptions.add(this.bot.opt.radiusEnchancer, KartwarsBot.nameof(function () { return _this.bot.opt.radiusEnchancer.teleMisiles; }), 50, 1500).step(25);
                        botOptions.add(this.bot.opt.radiusEnchancer, KartwarsBot.nameof(function () { return _this.bot.opt.radiusEnchancer.bombs; }), 50, 1500).step(25);
                        botOptions.add(this.bot.opt.radiusEnchancer, KartwarsBot.nameof(function () { return _this.bot.opt.radiusEnchancer.mines; }), 50, 1500).step(25);
                    }
                    {
                        var foodActionsOptions = gui.addFolder('Tactics');
                        this._guiElements.push(foodActionsOptions.domElement);
                        foodActionsOptions.open();
                        gui.remember(this);
                        var foodFindClosestTacticsConstrains = {
                            'FindClosest': KartwarsBot.Tactics.Resource.Food.FoodTactics.Default,
                        };
                        foodActionsOptions.add(this, KartwarsBot.nameof(function () { return _this.aggressivity; }), 0, 100).listen();
                        foodActionsOptions.add(this, KartwarsBot.nameof(function () { return _this.selectedFoodTactics; }), foodFindClosestTacticsConstrains).listen();
                    }
                    {
                        var behaviourOptions = gui.addFolder('Behaviour');
                        this._guiElements.push(behaviourOptions.domElement);
                        behaviourOptions.open();
                        gui.remember(this);
                        gui.remember(defaultBehaviour);
                        /* tslint:disable:object-literal-sort-keys */
                        var foodBehaviourConstrains = {
                            'Do Not Seek Food': KartwarsBot.Behaviour.FoodBehaviour.DoNotSeekFood,
                            'Seek Food': KartwarsBot.Behaviour.FoodBehaviour.SeekFood,
                            //'Seek Food Cluster': Behaviour.FoodBehaviour.SeekFoodCluster,
                            'Seek Food Inside Food Cluster': KartwarsBot.Behaviour.FoodBehaviour.SeekFoodInsideFoodCluster,
                        };
                        var weaponBehaviourConstrains = {
                            'Do Not Seek Weapons': KartwarsBot.Behaviour.WeaponBehaviour.DoNotSeekWeapons,
                            'Seek Weapons Based On Aggressivity': KartwarsBot.Behaviour.WeaponBehaviour.SeekWeaponsBasedOnAggressivity,
                        };
                        var fightBehaviourConstrains = {
                            'Do Not Fight': KartwarsBot.Behaviour.FightBehaviour.DoNotFight,
                            'Shoot Immediately': KartwarsBot.Behaviour.FightBehaviour.ShootImmediately,
                            'Shoot When Enemy In Close Range': KartwarsBot.Behaviour.FightBehaviour.ShootWhenEnemyInCloseRange,
                            'Shoot When Enemy In Big Range': KartwarsBot.Behaviour.FightBehaviour.ShootWhenEnemyInBigRange,
                            //'Chase Closest & Shoot When Enemy In Close Range': Behaviour.FightBehaviour.ChaseClosest,
                            'Intercept And Shoot When Enemy In Tunnel': KartwarsBot.Behaviour.FightBehaviour.InterceptAndShootWhenEnemyInTunnel,
                        };
                        var avoidanceBehaviourConstrains = {
                            'Do Not Avoid': KartwarsBot.Behaviour.AvoidanceBehaviour.DoNotAvoid,
                            'Avoid Lethal Enemies': KartwarsBot.Behaviour.AvoidanceBehaviour.AvoidLethalEnemies,
                        };
                        /* tslint:enable:object-literal-sort-keys */
                        behaviourOptions.add(defaultBehaviour, KartwarsBot.nameof(function () { return defaultBehaviour.Food; }), foodBehaviourConstrains);
                        behaviourOptions.add(defaultBehaviour, KartwarsBot.nameof(function () { return defaultBehaviour.Weapon; }), weaponBehaviourConstrains);
                        behaviourOptions.add(defaultBehaviour, KartwarsBot.nameof(function () { return defaultBehaviour.Fight; }), fightBehaviourConstrains);
                        behaviourOptions.add(defaultBehaviour, KartwarsBot.nameof(function () { return defaultBehaviour.Avoidance; }), avoidanceBehaviourConstrains);
                        behaviourOptions.add(this, KartwarsBot.nameof(function () { return _this.useChasingPrediction; })).name('Use Chasing Prediction');
                    }
                    {
                        var findClosestClusterFoodTacticsOptions = gui.addFolder('Closest Cluster Food Tactics');
                        this._guiElements.push(findClosestClusterFoodTacticsOptions.domElement);
                        findClosestClusterFoodTacticsOptions.open();
                        gui.remember(this.FindClosestClusterFoodTactics.opt);
                        findClosestClusterFoodTacticsOptions.add(this.FindClosestClusterFoodTactics.opt, KartwarsBot.nameof(function () { return _this.FindClosestClusterFoodTactics.opt.scanRadius; }), 100, 10000).step(50);
                        findClosestClusterFoodTacticsOptions.add(this.FindClosestClusterFoodTactics.opt, KartwarsBot.nameof(function () { return _this.FindClosestClusterFoodTactics.opt.sectorSize; }), 10, 1000).step(5);
                        findClosestClusterFoodTacticsOptions.add(this.FindClosestClusterFoodTactics.opt, KartwarsBot.nameof(function () { return _this.FindClosestClusterFoodTactics.opt.minimumElementsPerCluster; }), 1, 350).step(1);
                    }
                    {
                        var visualDebuggingOptions = gui.addFolder('Visual Debugging');
                        this._guiElements.push(visualDebuggingOptions.domElement);
                        visualDebuggingOptions.open();
                        gui.remember(window);
                        gui.remember(this.canvas.opt);
                        gui.remember(this.canvas.opt.draw);
                        gui.remember(this.canvas.opt.colors);
                        visualDebuggingOptions.add(window, 'visualDebugging');
                        visualDebuggingOptions.add(this.canvas.opt, 'shadowBlur').name('Shadow Blur');
                        {
                            var visualDebuggingIndividualOptions = visualDebuggingOptions.addFolder('Individual');
                            visualDebuggingIndividualOptions.open();
                            visualDebuggingIndividualOptions.add(this.canvas.opt.draw, KartwarsBot.nameof(function () { return _this.canvas.opt.draw.player; }));
                            visualDebuggingIndividualOptions.add(this.canvas.opt.draw, KartwarsBot.nameof(function () { return _this.canvas.opt.draw.dangers; }));
                            visualDebuggingIndividualOptions.add(this.canvas.opt.draw, KartwarsBot.nameof(function () { return _this.canvas.opt.draw.food; }));
                        }
                        {
                            var visualDebuggingColorsOptions = visualDebuggingOptions.addFolder('Colors');
                            //visualDebuggingIndividualOptions.open();
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.goalLine; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.goalDot; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.goalCross; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.collidedPoint; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.collidedElement; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.collisionAvoidancePointA; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.collisionAvoidancePointB; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.foodCluster; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.foodClusterText; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.foodClusterLine; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.foodClusterBoundary; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.inRangeResource; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.collectableResource; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.predictionLine; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.predictionCircle; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.encircledPlayerWarning; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.encircledPlayerDanger; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.collisionElement; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.collisionLine; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.playerRadius; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.closeToImminentDangerRadius; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.playerSideDetector; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.playerHeadDetector; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.playerTailDetector; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.frontResourceGatherArc; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.frontDangerArc; }));
                            visualDebuggingColorsOptions.add(this.canvas.opt.colors, KartwarsBot.nameof(function () { return _this.canvas.opt.colors.tailDangerArc; }));
                        }
                    }
                    {
                        var fizzyTextOptions = gui.addFolder('Fizzy Text');
                        this._guiElements.push(fizzyTextOptions.domElement);
                        var fizzyText_1 = datGUIWrapper.userInterface.fizzyText;
                        gui.remember(fizzyText_1);
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.theme; })).name('Dark Theme');
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.message; })).name('Message');
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.speed; }), -5, 5).name('Speed');
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.displayOutline; })).name('Display Outline');
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.noiseStrength; })).step(5).name('Noise Strength');
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.growthSpeed; }), -5, 5).name('Growth Speed');
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.maxSize; })).min(0).step(0.25).name('maxSize');
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.color0; })).name('Color 1');
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.color1; })).name('Color 2');
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.color2; })).name('Color 3');
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.color3; })).name('Color 4');
                        fizzyTextOptions.add(fizzyText_1, KartwarsBot.nameof(function () { return fizzyText_1.explode; })).name('Explode');
                    }
                    this._guiIsInitialised = true;
                };
                return DefaultStrategy;
            }(Strategy.StrategyBase));
            Strategy.DefaultStrategy = DefaultStrategy;
        })(Strategy = KartwarsBot.Strategy || (KartwarsBot.Strategy = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

/* tslint:disable */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
        var Strategy;
        (function (Strategy) {
            /**
             * Calculate Torque Test Strategy.
             */
            var CalculateTorqueBotStrategy = (function (_super) {
                __extends(CalculateTorqueBotStrategy, _super);
                function CalculateTorqueBotStrategy() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.aggressivity = 0;
                    _this.stepx = 0;
                    _this.startTime = 0;
                    _this.xPoints = { p1: Infinity, p2: -Infinity };
                    _this.yPoints = { p1: Infinity, p2: -Infinity };
                    return _this;
                }
                CalculateTorqueBotStrategy.prototype.onPlayerDeath = function () {
                    //
                };
                CalculateTorqueBotStrategy.prototype.reset = function () {
                    this.startPosition = null;
                };
                CalculateTorqueBotStrategy.prototype.startTracking = function () {
                    this.xPoints = { p1: Infinity, p2: -Infinity };
                    this.yPoints = { p1: Infinity, p2: -Infinity };
                    this.startTime = 0;
                    this.stepx = 0;
                };
                /*
                window['xPoints'].p2 - window['xPoints'].p1
                window['yPoints'].p2 - window['yPoints'].p1
                == 350
            
                window['trackedTime']
                == 2500
            
                ==>
                
                r = 350 / 2
                p = 2 * Math.PI * r
                s = p * 1000 / 2500
                s == 439.822971502571 u/s
                */
                CalculateTorqueBotStrategy.prototype.action = function () {
                    var foodTacticsActivityResult = null;
                    var goalCoordinates;
                    window.botFactory.clock.startFrame();
                    this.gameWrapper.items.reset();
                    this.gameWrapper.items.getEnemies();
                    var playerPosition = this.gameWrapper.player.getPosition();
                    if (!this.startPosition) {
                        this.startPosition = playerPosition;
                        goalCoordinates = new KartwarsBot.Point2D(playerPosition.x, playerPosition.y);
                    }
                    this.xPoints.p1 = Math.min(this.xPoints.p1, playerPosition.x);
                    this.xPoints.p2 = Math.max(this.xPoints.p2, playerPosition.x);
                    this.yPoints.p1 = Math.min(this.yPoints.p1, playerPosition.y);
                    this.yPoints.p2 = Math.max(this.yPoints.p2, playerPosition.y);
                    if (this.stepx == 0) {
                        if (playerPosition.y < this.bot.goal.coordinates.y) {
                            this.stepx = 1;
                        }
                    }
                    if (this.stepx == 1) {
                        if (playerPosition.y >= this.bot.goal.coordinates.y) {
                            this.startTime = (+new Date());
                            this.stepx = 2;
                        }
                    }
                    if (this.stepx == 2) {
                        if (playerPosition.y < this.bot.goal.coordinates.y) {
                            this.stepx = 3;
                        }
                    }
                    if (this.stepx == 3) {
                        if (playerPosition.y >= this.bot.goal.coordinates.y) {
                            window['trackedTime'] = (+new Date()) - this.startTime;
                            this.stepx = 4;
                        }
                    }
                    window['xPoints'] = this.xPoints;
                    window['yPoints'] = this.yPoints;
                    if (goalCoordinates) {
                        foodTacticsActivityResult = KartwarsBot.ActivityResult.CreateValidResponse(goalCoordinates);
                    }
                    else {
                        foodTacticsActivityResult = KartwarsBot.ActivityResult.CreateValidResponse(this.bot.goal.coordinates);
                    }
                    window.botFactory.clock.endFrame();
                    return foodTacticsActivityResult;
                };
                CalculateTorqueBotStrategy.prototype.foodAction = function () {
                    // NOOP
                };
                CalculateTorqueBotStrategy.prototype.initDatGui = function (datGUIWrapper) {
                    var _this = this;
                    if (this._guiIsInitialised) {
                        return;
                    }
                    var gui = datGUIWrapper.gui;
                    var defaultBehaviour = KartwarsBot.Behaviour.BehaviourData.defaultBehaviour;
                    {
                        var baseControlsOptions = gui.addFolder('Torque Test Actions');
                        this._guiElements.push(baseControlsOptions.domElement);
                        baseControlsOptions.open();
                        //baseControlsOptions.add(this, 'xStaticRecalibration', -100, 100).listen();
                        baseControlsOptions.add(this, KartwarsBot.nameof(function () { return _this.reset; }));
                        baseControlsOptions.add(this, KartwarsBot.nameof(function () { return _this.startTracking; }));
                    }
                    this._guiIsInitialised = true;
                };
                return CalculateTorqueBotStrategy;
            }(Strategy.StrategyBase));
            CalculateTorqueBotStrategy = __decorate([
                KartwarsBot.MethodDecoration.sealed
            ], CalculateTorqueBotStrategy);
            Strategy.CalculateTorqueBotStrategy = CalculateTorqueBotStrategy;
        })(Strategy = KartwarsBot.Strategy || (KartwarsBot.Strategy = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

/* tslint:disable */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
        var Strategy;
        (function (Strategy) {
            /**
             * Pursuit Enemy Test Strategy.
             */
            var PursuitBotStrategy = (function (_super) {
                __extends(PursuitBotStrategy, _super);
                function PursuitBotStrategy() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.aggressivity = 0;
                    _this.usePrediction = false;
                    return _this;
                }
                PursuitBotStrategy.prototype.onPlayerDeath = function () {
                    //
                };
                PursuitBotStrategy.prototype.action = function () {
                    var foodTacticsActivityResult = null;
                    window.botFactory.clock.startFrame();
                    var resetEnemy = true;
                    this.gameWrapper.items.reset();
                    var enemies = this.gameWrapper.items.getEnemies();
                    if (this.currentEnemy != undefined) {
                        var enemyId = this.currentEnemy.enemyId;
                        if (enemyId != undefined) {
                            for (var i = 0, ls = enemies.length; i < ls && enemies[i] !== null; i++) {
                                var thisEnemy = enemies[i];
                                if (thisEnemy.id == enemyId) {
                                    this.currentEnemy.x = thisEnemy.x;
                                    this.currentEnemy.y = thisEnemy.y;
                                    resetEnemy = false;
                                    break;
                                }
                            }
                        }
                    }
                    if (resetEnemy) {
                        if (enemies.length > 0) {
                            var thisEnemy = enemies[0];
                            this.currentEnemy = {
                                thisEnemy: thisEnemy,
                                x: thisEnemy.x,
                                y: thisEnemy.y,
                                enemyId: thisEnemy.id
                            };
                        }
                        else {
                            this.currentEnemy = {
                                x: this.bot.worldCenterX,
                                y: this.bot.worldCenterY,
                                thisEnemy: undefined,
                                enemyId: undefined
                            };
                        }
                    }
                    var preprocessedGoalCoordinates = new KartwarsBot.Point2D(this.currentEnemy.x, this.currentEnemy.y);
                    var selectedEnemy = this.currentEnemy.thisEnemy;
                    if (this.usePrediction && selectedEnemy) {
                        if (selectedEnemy.velocity) {
                            preprocessedGoalCoordinates = KartwarsBot.MathUtils.predictIntersection(window.mainCar, selectedEnemy);
                            var goalCoordinatesEx = KartwarsBot.MathUtils.predictIntersectionEx(window.mainCar, selectedEnemy, 20.25);
                            if (goalCoordinatesEx) {
                                var playerPosition = this.gameWrapper.player.getPosition();
                                this.canvas.drawLine(playerPosition, goalCoordinatesEx, 'black', 10, 0.75);
                                this.canvas.drawCircle(goalCoordinatesEx, this.canvas.opt.colors.predictionCircle, false, 0.75);
                            }
                        }
                    }
                    foodTacticsActivityResult = KartwarsBot.ActivityResult.CreateValidResponse(preprocessedGoalCoordinates);
                    window.botFactory.clock.endFrame();
                    return foodTacticsActivityResult;
                };
                PursuitBotStrategy.prototype.foodAction = function () {
                    // NOOP
                };
                PursuitBotStrategy.prototype.initDatGui = function (datGUIWrapper) {
                    var _this = this;
                    if (this._guiIsInitialised) {
                        return;
                    }
                    var gui = datGUIWrapper.gui;
                    var defaultBehaviour = KartwarsBot.Behaviour.BehaviourData.defaultBehaviour;
                    {
                        var baseControlsOptions = gui.addFolder('Pursuit Test Actions');
                        this._guiElements.push(baseControlsOptions.domElement);
                        baseControlsOptions.open();
                        baseControlsOptions.add(this, KartwarsBot.nameof(function () { return _this.usePrediction; }));
                    }
                    this._guiIsInitialised = true;
                };
                return PursuitBotStrategy;
            }(Strategy.StrategyBase));
            PursuitBotStrategy = __decorate([
                KartwarsBot.MethodDecoration.sealed
            ], PursuitBotStrategy);
            Strategy.PursuitBotStrategy = PursuitBotStrategy;
        })(Strategy = KartwarsBot.Strategy || (KartwarsBot.Strategy = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

/* tslint:disable */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Strategy;
        (function (Strategy) {
            /**
             * Default working strategy.
             */
            var PursuitAndShootBotStrategy = (function (_super) {
                __extends(PursuitAndShootBotStrategy, _super);
                function PursuitAndShootBotStrategy() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.FOOD_VALUE = 1;
                    _this.WEAPON_VALUE = 5;
                    _this.aggressivity = 100;
                    _this.collectedWeapons = 0;
                    _this.lastWeaponStatus = KartwarsBot.CarWeapon.None;
                    return _this;
                }
                PursuitAndShootBotStrategy.prototype.onPlayerDeath = function () {
                    this.collectedWeapons = 0;
                };
                PursuitAndShootBotStrategy.prototype.action = function () {
                    var finalActivityResult;
                    window.botFactory.clock.startFrame();
                    this.fightCheck();
                    //
                    //
                    var chaseClosestFightTacticsActivityResult = null;
                    if (window.mainCar.weapon) {
                        var triggerWeaponInFront = window.mainCar.weapon.triggerLocation == KartwarsBot.CarWeaponTrigger.Front;
                        if (triggerWeaponInFront) {
                            if (this.canUseChasingPrediction) {
                                var currentWeaponMagnitude = void 0;
                                if (this._forceChasingPrediction) {
                                    currentWeaponMagnitude = window.mainCar.weapon.magnitude;
                                }
                                chaseClosestFightTacticsActivityResult = this.ChaseClosestFightTactics.action(currentWeaponMagnitude);
                            }
                        }
                    }
                    if (chaseClosestFightTacticsActivityResult && chaseClosestFightTacticsActivityResult.isValid) {
                        finalActivityResult = chaseClosestFightTacticsActivityResult;
                    }
                    else {
                        finalActivityResult = this.WeaponTactics.action();
                    }
                    window.botFactory.clock.endFrame();
                    return finalActivityResult;
                };
                /**
                 * Fight check.
                 */
                PursuitAndShootBotStrategy.prototype.fightCheck = function () {
                    window.botFactory.clock.startFrame();
                    if (this.aggressivity <= 0) {
                        return;
                    }
                    var defaultBehaviour = KartwarsBot.Behaviour.BehaviourData.defaultBehaviour;
                    // Reset Force Chasing Prediction
                    this._forceChasingPrediction = false;
                    switch (defaultBehaviour.Fight) {
                        case KartwarsBot.Behaviour.FightBehaviour.DoNotFight:
                            {
                                // NOOP
                                this.FightTactics.noop();
                            }
                            break;
                        case KartwarsBot.Behaviour.FightBehaviour.ShootImmediately:
                            {
                                this.bot.fireWeapon();
                            }
                            break;
                        case KartwarsBot.Behaviour.FightBehaviour.ShootWhenEnemyInCloseRange:
                            {
                                this.FightTactics.action();
                            }
                            break;
                        case KartwarsBot.Behaviour.FightBehaviour.ShootWhenEnemyInBigRange:
                            {
                                this.FightTactics.action(this.bot.shapesHolster.playerCircle.radius * 2);
                            }
                            break;
                        case KartwarsBot.Behaviour.FightBehaviour.InterceptAndShootWhenEnemyInTunnel: {
                            // TODO : Review
                            if (window.mainCar.weapon) {
                                var doFightTactics = false;
                                if (window.mainCar.weapon.isLethalWeapon) {
                                    /*
                                        Note!
                                    
                                        In combination when this case the `Chase Closest` tactic will only work with front weapons.
                                    */
                                    var triggerWeaponInFront = window.mainCar.weapon.triggerLocation == KartwarsBot.CarWeaponTrigger.Front;
                                    if (triggerWeaponInFront) {
                                        // window.log((+new Date()), `magnitude = ${window.mainCar.weapon.magnitude}`);
                                        if (window.mainCar.weapon.magnitude > 0) {
                                            this._forceChasingPrediction = true;
                                            if (this.bot.stage == KartwarsBot.BotStageEnum.InterceptEnemy) {
                                                if (this.bot.goal.isInTunnel) {
                                                    //debugger;
                                                    // window.log((+new Date()), `GoalIsInTunnel! WeaponType = ${CarWeapon[window.mainCar.weapon.weaponType]}; WeaponFired = ${window.mainCar.weapon.weaponFired}`);
                                                    if (!window.mainCar.weapon.weaponFired) {
                                                        window.log((+new Date()), "GoalIsInTunnel! WeaponType = " + KartwarsBot.CarWeapon[window.mainCar.weapon.weaponType] + "; WeaponFired = " + window.mainCar.weapon.weaponFired);
                                                        doFightTactics = true;
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            doFightTactics = true;
                                        }
                                    }
                                    else {
                                        doFightTactics = true;
                                    }
                                }
                                else {
                                    doFightTactics = true;
                                }
                                if (doFightTactics) {
                                    this.FightTactics.action();
                                }
                            }
                        }
                    }
                    window.botFactory.clock.endFrame();
                };
                /**
                 * Food action.
                 */
                PursuitAndShootBotStrategy.prototype.foodAction = function () {
                    return KartwarsBot.ActivityResult.CreateInvalidResponse();
                };
                PursuitAndShootBotStrategy.prototype.initDatGui = function (datGUIWrapper) {
                    var _this = this;
                    if (this._guiIsInitialised) {
                        return;
                    }
                    var gui = datGUIWrapper.gui;
                    var smallestRadianDivisions = 32;
                    var defaultBehaviour = KartwarsBot.Behaviour.BehaviourData.defaultBehaviour;
                    {
                        var foodActionsOptions = gui.addFolder('Tactics (Pursuit & Shoot)');
                        this._guiElements.push(foodActionsOptions.domElement);
                        foodActionsOptions.open();
                        gui.remember(this);
                        var foodFindClosestTacticsConstrains = {
                            'FindClosest': KartwarsBot.Tactics.Resource.Food.FoodTactics.Default,
                        };
                        foodActionsOptions.add(this, KartwarsBot.nameof(function () { return _this.aggressivity; }), 0, 100).listen();
                        foodActionsOptions.add(this, KartwarsBot.nameof(function () { return _this.selectedFoodTactics; }), foodFindClosestTacticsConstrains).listen();
                    }
                    {
                        var behaviourOptions = gui.addFolder('Behaviour (Pursuit & Shoot)');
                        this._guiElements.push(behaviourOptions.domElement);
                        behaviourOptions.open();
                        gui.remember(this);
                        gui.remember(defaultBehaviour);
                        var foodBehaviourConstrains = {
                            'Do Not Seek Food': KartwarsBot.Behaviour.FoodBehaviour.DoNotSeekFood,
                            'Seek Food': KartwarsBot.Behaviour.FoodBehaviour.SeekFood,
                            //'Seek Food Cluster': Behaviour.FoodBehaviour.SeekFoodCluster,
                            'Seek Food Inside Food Cluster': KartwarsBot.Behaviour.FoodBehaviour.SeekFoodInsideFoodCluster,
                        };
                        var weaponBehaviourConstrains = {
                            'Do Not Seek Weapons': KartwarsBot.Behaviour.WeaponBehaviour.DoNotSeekWeapons,
                            'Seek Weapons Based On Agresivity': KartwarsBot.Behaviour.WeaponBehaviour.SeekWeaponsBasedOnAggressivity,
                        };
                        var fightBehaviourConstrains = {
                            'Do Not Fight': KartwarsBot.Behaviour.FightBehaviour.DoNotFight,
                            'Shoot Immediately': KartwarsBot.Behaviour.FightBehaviour.ShootImmediately,
                            'Shoot When Enemy In Close Range': KartwarsBot.Behaviour.FightBehaviour.ShootWhenEnemyInCloseRange,
                            'Shoot When Enemy In Big Range': KartwarsBot.Behaviour.FightBehaviour.ShootWhenEnemyInBigRange,
                            //'Chase Closest & Shoot When Enemy In Close Range': Behaviour.FightBehaviour.ChaseClosest,
                            'Intercept And Shoot When Enemy In Tunnel': KartwarsBot.Behaviour.FightBehaviour.InterceptAndShootWhenEnemyInTunnel,
                        };
                        var avoidanceBehaviourConstrains = {
                            'Do Not Avoid': KartwarsBot.Behaviour.AvoidanceBehaviour.DoNotAvoid,
                            'Avoid Lethal Enemies': KartwarsBot.Behaviour.AvoidanceBehaviour.AvoidLethalEnemies,
                        };
                        behaviourOptions.add(defaultBehaviour, KartwarsBot.nameof(function () { return defaultBehaviour.Food; }), foodBehaviourConstrains);
                        behaviourOptions.add(defaultBehaviour, KartwarsBot.nameof(function () { return defaultBehaviour.Weapon; }), weaponBehaviourConstrains);
                        behaviourOptions.add(defaultBehaviour, KartwarsBot.nameof(function () { return defaultBehaviour.Fight; }), fightBehaviourConstrains);
                        behaviourOptions.add(defaultBehaviour, KartwarsBot.nameof(function () { return defaultBehaviour.Avoidance; }), avoidanceBehaviourConstrains);
                        behaviourOptions.add(this, KartwarsBot.nameof(function () { return _this.useChasingPrediction; })).name('Use Chasing Prediction');
                    }
                    {
                        var visualDebuggingOptions = gui.addFolder('Visual Debugging (Pursuit & Shoot)');
                        this._guiElements.push(visualDebuggingOptions.domElement);
                        visualDebuggingOptions.open();
                        gui.remember(window);
                        gui.remember(this.canvas.opt);
                        gui.remember(this.canvas.opt.draw);
                        gui.remember(this.canvas.opt.colors);
                        visualDebuggingOptions.add(window, 'visualDebugging');
                        visualDebuggingOptions.add(this.canvas.opt, 'shadowBlur').name('Shadow Blur');
                        {
                            var visualDebuggingIndividualOptions = visualDebuggingOptions.addFolder('Individual');
                            visualDebuggingIndividualOptions.open();
                            visualDebuggingIndividualOptions.add(this.canvas.opt.draw, KartwarsBot.nameof(function () { return _this.canvas.opt.draw.player; }));
                            visualDebuggingIndividualOptions.add(this.canvas.opt.draw, KartwarsBot.nameof(function () { return _this.canvas.opt.draw.dangers; }));
                            visualDebuggingIndividualOptions.add(this.canvas.opt.draw, KartwarsBot.nameof(function () { return _this.canvas.opt.draw.food; }));
                        }
                    }
                    this._guiIsInitialised = true;
                };
                return PursuitAndShootBotStrategy;
            }(Strategy.StrategyBase));
            Strategy.PursuitAndShootBotStrategy = PursuitAndShootBotStrategy;
        })(Strategy = KartwarsBot.Strategy || (KartwarsBot.Strategy = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

/* tslint:disable */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
        var Strategy;
        (function (Strategy) {
            /**
             * Draw Enemies Test Strategy.
             */
            var DrawEnemiesBotStrategy = (function (_super) {
                __extends(DrawEnemiesBotStrategy, _super);
                function DrawEnemiesBotStrategy() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.aggressivity = 0;
                    return _this;
                }
                DrawEnemiesBotStrategy.prototype.hasValidSprite = function (el) {
                    var worldBounds = this.gameWrapper.world.getWorkingBounds(), img = el.img, position = img.position;
                    //return (position.x > worldBounds.x && position.y > worldBounds.y) &&
                    //	(position.x < worldBounds.width && position.y < worldBounds.height) &&
                    //	(img.visible && (img.alpha > 0) && img.renderable);
                    return (position.x > worldBounds.x && position.y > worldBounds.y) &&
                        (position.x < worldBounds.width && position.y < worldBounds.height);
                };
                DrawEnemiesBotStrategy.prototype._baseGetItems = function (items, type, skipId) {
                    var results = [], count = 0;
                    var localElements = jQuery.extend(true, {}, items);
                    var playerPosition = this.gameWrapper.player.getPosition();
                    for (var localSprite in localElements) {
                        var element = localElements[localSprite];
                        element.img.visible = true;
                        element.img.alpha = 1;
                        element.img.renderable = true;
                        if (!(element instanceof type) || (!this.hasValidSprite(element))) {
                            delete (localElements[localSprite]);
                            continue;
                        }
                        var x = element.img.position.x, y = element.img.position.y;
                        element.x = x;
                        element.y = y;
                        element.distance = KartwarsBot.MathUtils.getDistance(element, playerPosition);
                        if (skipId && (element.id == skipId)) {
                            delete (localElements[localSprite]);
                            continue;
                        }
                        results[count++] = element;
                    }
                    return results;
                };
                DrawEnemiesBotStrategy.prototype.onPlayerDeath = function () {
                    //
                };
                DrawEnemiesBotStrategy.prototype.action = function () {
                    var foodTacticsActivityResult = null;
                    window.botFactory.clock.startFrame();
                    var enemies = this._baseGetItems(window.sprites, window.Car, window.mainCar.id);
                    var $this = this;
                    enemies.forEach(function (element) {
                        $this.canvas.drawCircle(new KartwarsBot.Circle(element.x, element.y, 75), 'red', true, 0.25);
                    });
                    //
                    //
                    foodTacticsActivityResult = KartwarsBot.ActivityResult.CreateValidResponse(new KartwarsBot.Point2D(this.bot.worldCenterX, this.bot.worldCenterY));
                    window.botFactory.clock.endFrame();
                    return foodTacticsActivityResult;
                };
                DrawEnemiesBotStrategy.prototype.foodAction = function () {
                    // NOOP
                };
                DrawEnemiesBotStrategy.prototype.initDatGui = function (datGUIWrapper) {
                    if (this._guiIsInitialised) {
                        return;
                    }
                    var gui = datGUIWrapper.gui;
                    var defaultBehaviour = KartwarsBot.Behaviour.BehaviourData.defaultBehaviour;
                    {
                        var baseControlsOptions = gui.addFolder('Draw Enemies Test Actions');
                        this._guiElements.push(baseControlsOptions.domElement);
                        baseControlsOptions.open();
                    }
                    this._guiIsInitialised = true;
                };
                return DrawEnemiesBotStrategy;
            }(Strategy.StrategyBase));
            DrawEnemiesBotStrategy = __decorate([
                KartwarsBot.MethodDecoration.sealed
            ], DrawEnemiesBotStrategy);
            Strategy.DrawEnemiesBotStrategy = DrawEnemiesBotStrategy;
        })(Strategy = KartwarsBot.Strategy || (KartwarsBot.Strategy = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

/* tslint:disable */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
        var Strategy;
        (function (Strategy) {
            /**
             * Interconnect Food Test Strategy.
             */
            var InterconnectFoodBotStrategy = InterconnectFoodBotStrategy_1 = (function (_super) {
                __extends(InterconnectFoodBotStrategy, _super);
                function InterconnectFoodBotStrategy() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.aggressivity = 0;
                    return _this;
                }
                InterconnectFoodBotStrategy.distance = function (a, b) {
                    return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
                };
                InterconnectFoodBotStrategy.prototype.drawI = function (tree, currentResource, deep) {
                    tree.remove(currentResource);
                    //let nearest = tree.nearest(currentResource, 1, [3500]);
                    var nearest = tree.nearest(currentResource, 1);
                    for (var j = 0; j < nearest.length; j++) {
                        var point = nearest[j][0];
                        this.canvas.drawLine(currentResource, point, 'black', 3, 0.5);
                        tree.remove(point);
                        if (--deep > 0) {
                            this.drawI(tree, point, deep);
                        }
                    }
                };
                InterconnectFoodBotStrategy.prototype.onPlayerDeath = function () {
                    //
                };
                InterconnectFoodBotStrategy.prototype.action = function () {
                    var foodTacticsActivityResult = null;
                    window.botFactory.clock.startFrame();
                    //let playerPosition = this.gameWrapper.player.getPosition();
                    var food = this.gameWrapper.items.getFood();
                    foodTacticsActivityResult = this.FoodTactics.action();
                    if (foodTacticsActivityResult.isValid) {
                        //let currentResource = (foodTacticsActivityResult.goalCoordinates as Bot2Point2D);
                        var currentResource = foodTacticsActivityResult.goalCoordinates;
                        var tree = new window.kdTree(food, InterconnectFoodBotStrategy_1.distance, ['x', 'y']);
                        this.drawI(tree, currentResource, 15);
                    }
                    window.botFactory.clock.endFrame();
                    return foodTacticsActivityResult;
                };
                InterconnectFoodBotStrategy.prototype.foodAction = function () {
                    // NOOP
                };
                InterconnectFoodBotStrategy.prototype.initDatGui = function (datGUIWrapper) {
                    if (this._guiIsInitialised) {
                        return;
                    }
                    var gui = datGUIWrapper.gui;
                    var defaultBehaviour = KartwarsBot.Behaviour.BehaviourData.defaultBehaviour;
                    {
                        var baseControlsOptions = gui.addFolder('Interconnect Food Test Actions');
                        this._guiElements.push(baseControlsOptions.domElement);
                        baseControlsOptions.open();
                    }
                    this._guiIsInitialised = true;
                };
                return InterconnectFoodBotStrategy;
            }(Strategy.StrategyBase));
            InterconnectFoodBotStrategy = InterconnectFoodBotStrategy_1 = __decorate([
                KartwarsBot.MethodDecoration.sealed
            ], InterconnectFoodBotStrategy);
            Strategy.InterconnectFoodBotStrategy = InterconnectFoodBotStrategy;
            var InterconnectFoodBotStrategy_1;
        })(Strategy = KartwarsBot.Strategy || (KartwarsBot.Strategy = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Design;
        (function (Design) {
            var Circle;
            (function (Circle) {
                // Default (!!To be kept for reference!!)
                var defaultCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                // Fast Rocket
                var fastRocketCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 2, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                // Tele Rocket
                var teleRocketCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 2, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                // Mine
                var mineCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 2, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                // Big Bang
                var bigBangCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 3, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                // Shield
                var shieldCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 2, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                // Flash
                var flashCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 2, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                // Huge Bash
                var hugeBashCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 2, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                var designsDictionary = {};
                designsDictionary[KartwarsBot.CarWeapon.None] = null;
                designsDictionary[KartwarsBot.CarWeapon.FastRocket] = fastRocketCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.ThreeFastRockets] = fastRocketCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.TeleRocket] = teleRocketCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.Cloak] = null;
                designsDictionary[KartwarsBot.CarWeapon.Mine] = mineCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.ThreeMines] = mineCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.BigBang] = bigBangCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.ThreeTeleRocket] = teleRocketCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.Shield] = shieldCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.Flashes] = flashCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.Magnet] = null;
                designsDictionary[KartwarsBot.CarWeapon.HugeBash] = hugeBashCarCollisionDesign;
                //
                var WarCarDesigns = (function () {
                    function WarCarDesigns() {
                    }
                    WarCarDesigns.getDesign = function (weaponType) {
                        return designsDictionary[weaponType];
                    };
                    Object.defineProperty(WarCarDesigns.prototype, "DesignDetails", {
                        get: function () {
                            return WarCarDesigns.DesignDetails;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    WarCarDesigns.prototype.getDesign = function (weaponType) {
                        return WarCarDesigns.getDesign(weaponType);
                    };
                    return WarCarDesigns;
                }());
                WarCarDesigns.Singleton = new WarCarDesigns();
                WarCarDesigns.DesignDetails = {
                    widthCenter: (defaultCarCollisionDesign[0].length - 1) / 2,
                    heightCenter: (defaultCarCollisionDesign.length - 1) / 2
                };
                Circle.WarCarDesigns = WarCarDesigns;
            })(Circle = Design.Circle || (Design.Circle = {}));
        })(Design = KartwarsBot.Design || (KartwarsBot.Design = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Design;
        (function (Design) {
            var Circle;
            (function (Circle) {
                // Default (!!To be kept for reference!!)
                var defaultCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                // Fast Rocket
                var fastRocketCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                // Tele Rocket
                var teleRocketCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 5, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                // Mine
                var mineCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                // Big Bang
                var bigBangCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 4, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                // Shield
                var shieldCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                // Flash
                var flashCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                // Huge Bash
                var hugeBashCarCollisionDesign = [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 4, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                ];
                var designsDictionary = {};
                designsDictionary[KartwarsBot.CarWeapon.None] = null;
                designsDictionary[KartwarsBot.CarWeapon.FastRocket] = fastRocketCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.ThreeFastRockets] = fastRocketCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.TeleRocket] = teleRocketCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.Cloak] = null;
                designsDictionary[KartwarsBot.CarWeapon.Mine] = mineCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.ThreeMines] = mineCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.BigBang] = bigBangCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.ThreeTeleRocket] = teleRocketCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.Shield] = shieldCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.Flashes] = flashCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.Magnet] = null;
                designsDictionary[KartwarsBot.CarWeapon.HugeBash] = hugeBashCarCollisionDesign;
                //
                var WeaponDesigns = (function () {
                    function WeaponDesigns() {
                    }
                    WeaponDesigns.getDesign = function (weaponType) {
                        return designsDictionary[weaponType];
                    };
                    Object.defineProperty(WeaponDesigns.prototype, "DesignDetails", {
                        get: function () {
                            return WeaponDesigns.DesignDetails;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    WeaponDesigns.prototype.getDesign = function (weaponType) {
                        return WeaponDesigns.getDesign(weaponType);
                    };
                    return WeaponDesigns;
                }());
                WeaponDesigns.Singleton = new WeaponDesigns();
                WeaponDesigns.DesignDetails = {
                    widthCenter: (defaultCarCollisionDesign[0].length - 1) / 2,
                    heightCenter: (defaultCarCollisionDesign.length - 1) / 2
                };
                Circle.WeaponDesigns = WeaponDesigns;
            })(Circle = Design.Circle || (Design.Circle = {}));
        })(Design = KartwarsBot.Design || (KartwarsBot.Design = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Design;
        (function (Design) {
            var Polygon;
            (function (Polygon) {
                // Default (!!To be kept for reference!!)
                var defaultCarCollisionDesign = [
                    new Victor(-0.5, 5.5),
                    new Victor(-1, 3.5),
                    new Victor(-1, 2),
                    new Victor(-1.5, 1.5),
                    new Victor(-3, 1),
                    new Victor(-3, -1.25),
                    new Victor(-1, -1),
                    new Victor(-1.25, -2.25),
                    new Victor(0, -1.75),
                    new Victor(1.25, -2.25),
                    new Victor(1, -1),
                    new Victor(3, -1.25),
                    new Victor(3, 1),
                    new Victor(1.5, 1.5),
                    new Victor(1, 2),
                    new Victor(1, 3.5),
                    new Victor(0.5, 5.5),
                ];
                // Fast Rocket
                var fastRocketCarCollisionDesign = [
                    new Victor(-0.25, 5.5),
                    new Victor(-0.75, 3.75),
                    new Victor(-0.75, 3),
                    new Victor(-0.75, 2),
                    new Victor(-1, 1.5),
                    new Victor(-1.25, 0.75),
                    new Victor(-1, 0),
                    new Victor(-0.75, -0.75),
                    new Victor(0, -1),
                    new Victor(0.75, -0.75),
                    new Victor(1, 0),
                    new Victor(1.25, 0.75),
                    new Victor(1, 1.5),
                    new Victor(0.75, 2),
                    new Victor(0.75, 3),
                    new Victor(0.75, 3.75),
                    new Victor(0.25, 5.5),
                ];
                // Tele Rocket
                var teleRocketCarCollisionDesign = defaultCarCollisionDesign;
                // Mine
                var mineCarCollisionDesign = [
                    new Victor(-0.25, 0.75),
                    new Victor(-0.25, 0.5),
                    new Victor(-0.5, 0.25),
                    new Victor(-1, 0),
                    new Victor(-1.25, -0.75),
                    new Victor(-1, -1),
                    new Victor(-1.25, -1.75),
                    new Victor(-0.5, -2),
                    new Victor(0, -2.25),
                    new Victor(0.5, -2),
                    new Victor(1.25, -1.75),
                    new Victor(1, -1),
                    new Victor(1.25, -0.75),
                    new Victor(1, 0),
                    new Victor(0.5, 0.25),
                    new Victor(0.25, 0.5),
                    new Victor(0.25, 0.75),
                ];
                // Big Bang
                var bigBangCarCollisionDesign = defaultCarCollisionDesign;
                // Shield
                var shieldCarCollisionDesign = defaultCarCollisionDesign;
                // Flash
                var flashCarCollisionDesign = [
                    new Victor(-0.25, 8),
                    new Victor(-0.5, 5),
                    new Victor(-0.75, 3),
                    new Victor(-0.75, 2),
                    new Victor(-1, 1.5),
                    new Victor(-1.25, 0.75),
                    new Victor(-1, 0),
                    new Victor(-0.75, -0.75),
                    new Victor(0, -1),
                    new Victor(0.75, -0.75),
                    new Victor(1, 0),
                    new Victor(1.25, 0.75),
                    new Victor(1, 1.5),
                    new Victor(0.75, 2),
                    new Victor(0.75, 3),
                    new Victor(0.5, 5),
                    new Victor(0.25, 8),
                ];
                // Huge Bash
                var hugeBashCarCollisionDesign = [
                    new Victor(-0.25, 4),
                    new Victor(-0.5, 3.5),
                    new Victor(-1.5, 3.25),
                    new Victor(-2, 3),
                    new Victor(-2, 2),
                    new Victor(-1.25, 0.75),
                    new Victor(-1, 0),
                    new Victor(-0.75, -0.75),
                    new Victor(0, -1),
                    new Victor(0.75, -0.75),
                    new Victor(1, 0),
                    new Victor(1.25, 0.75),
                    new Victor(2, 2),
                    new Victor(2, 3),
                    new Victor(1.5, 3.25),
                    new Victor(0.5, 3.5),
                    new Victor(0.25, 4),
                ];
                //
                //
                rotateSelf(defaultCarCollisionDesign);
                rotateSelf(fastRocketCarCollisionDesign);
                rotateSelf(mineCarCollisionDesign);
                rotateSelf(flashCarCollisionDesign);
                rotateSelf(hugeBashCarCollisionDesign);
                //
                //
                var designsDictionary = {};
                designsDictionary[KartwarsBot.CarWeapon.None] = null;
                designsDictionary[KartwarsBot.CarWeapon.FastRocket] = fastRocketCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.ThreeFastRockets] = fastRocketCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.TeleRocket] = teleRocketCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.Cloak] = null;
                designsDictionary[KartwarsBot.CarWeapon.Mine] = mineCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.ThreeMines] = mineCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.BigBang] = bigBangCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.ThreeTeleRocket] = teleRocketCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.Shield] = shieldCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.Flashes] = flashCarCollisionDesign;
                designsDictionary[KartwarsBot.CarWeapon.Magnet] = null;
                designsDictionary[KartwarsBot.CarWeapon.HugeBash] = hugeBashCarCollisionDesign;
                //
                function rotateSelf(thisDesign) {
                    var rotation = -Math.PI / 2;
                    for (var idx = 0; idx < thisDesign.length; idx++) {
                        thisDesign[idx].rotate(rotation);
                    }
                }
                var WarCarDesigns = (function () {
                    function WarCarDesigns() {
                    }
                    WarCarDesigns.getDesign = function (weaponType) {
                        return designsDictionary[weaponType];
                    };
                    WarCarDesigns.prototype.getDesign = function (weaponType) {
                        return WarCarDesigns.getDesign(weaponType);
                    };
                    return WarCarDesigns;
                }());
                WarCarDesigns.Singleton = new WarCarDesigns();
                Polygon.WarCarDesigns = WarCarDesigns;
            })(Polygon = Design.Polygon || (Design.Polygon = {}));
        })(Design = KartwarsBot.Design || (KartwarsBot.Design = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Manager;
        (function (Manager) {
            var Collision;
            (function (Collision) {
                var Managers;
                (function (Managers) {
                    Managers[Managers["Default"] = 0] = "Default";
                    Managers[Managers["Advanced"] = 1] = "Advanced";
                    Managers[Managers["\u00DCber"] = 2] = "\u00DCber";
                })(Managers = Collision.Managers || (Collision.Managers = {}));
            })(Collision = Manager.Collision || (Manager.Collision = {}));
        })(Manager = KartwarsBot.Manager || (KartwarsBot.Manager = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

/// <reference path="../../_references.ts" />
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Manager;
        (function (Manager) {
            var Collision;
            (function (Collision) {
                var CollisionManagerOptions = (function () {
                    function CollisionManagerOptions() {
                        this.avoidanceAngle = (Math.PI / 16 * 15);
                        this.tailedDetectorThresholdAngle = (Math.PI / 16);
                        this.tailedDetectorAdditionalAvoidanceAngle = (Math.PI / 16 * 2);
                    }
                    return CollisionManagerOptions;
                }());
                Collision.CollisionManagerOptions = CollisionManagerOptions;
                var CollisionBaseManager = (function () {
                    function CollisionBaseManager(bot, gameWrapper, canvas) {
                        this.bot = bot;
                        this.gameWrapper = gameWrapper;
                        this.canvas = canvas;
                        this.opt = new CollisionManagerOptions();
                    }
                    // get collision angle index, expects angle +/i 0 to Math.PI
                    CollisionBaseManager.prototype.getAngleIndex = function (angle) {
                        var index;
                        if (angle < 0) {
                            angle += 2 * Math.PI;
                        }
                        index = Math.round(angle * (1 / this.bot.opt.arcSize));
                        if (index === this.bot.MAXARC) {
                            return 0;
                        }
                        return index;
                    };
                    /**
                     * Change heading to the best angle for avoidance.
                     */
                    CollisionBaseManager.prototype.headingBestAngle = function (collisionAngles) {
                        var best;
                        var distance;
                        var openAngles = [];
                        var openStart;
                        var sIndex = this.getAngleIndex(this.gameWrapper.player.getRotation()) + this.bot.MAXARC / 2;
                        if (sIndex > this.bot.MAXARC) {
                            sIndex -= this.bot.MAXARC;
                        }
                        for (var i = 0; i < this.bot.MAXARC; i++) {
                            if (collisionAngles[i] === undefined) {
                                distance = 0;
                                if (openStart === undefined)
                                    openStart = i;
                            }
                            else {
                                distance = collisionAngles[i].distance2;
                                if (openStart) {
                                    openAngles.push({
                                        openStart: openStart,
                                        openEnd: i - 1,
                                        sz: (i - 1) - openStart
                                    });
                                    openStart = undefined;
                                }
                            }
                            if (best === undefined ||
                                (best.distance < distance && best.distance !== 0)) {
                                best = {
                                    distance: distance,
                                    aIndex: i
                                };
                            }
                        }
                        if (openStart && openAngles[0]) {
                            openAngles[0].openStart = openStart;
                            openAngles[0].sz = openAngles[0].openEnd - openStart;
                            if (openAngles[0].sz < 0)
                                openAngles[0].sz += this.bot.MAXARC;
                        }
                        else if (openStart) {
                            openAngles.push({ openStart: openStart, openEnd: openStart, sz: 0 });
                        }
                        if (openAngles.length > 0) {
                            openAngles.sort(KartwarsBot.ArrayUtils.sortSz);
                            return this.bot.changeHeadingAbs((openAngles[0].openEnd - openAngles[0].sz / 2) * this.bot.opt.arcSize);
                        }
                        else {
                            return this.bot.changeHeadingAbs(best.aIndex * this.bot.opt.arcSize);
                        }
                    };
                    /**
                     * Avoid collision point by ang.
                     * ang radians <= Math.PI (180deg)
                     * @param point
                     * @param ang
                     */
                    // TODO : Increase ang value if too low.
                    CollisionBaseManager.prototype.avoidCollisionPoint = function (point, ang) {
                        var playerPosition = this.gameWrapper.player.getPosition();
                        if (ang === undefined || ang > Math.PI) {
                            ang = Math.PI;
                        }
                        var end = new KartwarsBot.Point2D(playerPosition.x + 2000 * this.bot.cos, playerPosition.y + 2000 * this.bot.sin);
                        // Draw collision avoidance
                        this.canvas.drawCollisionAvoidance(point, end);
                        if (KartwarsBot.MathUtils.isLeft(playerPosition, end, point)) {
                            return this.bot.changeHeadingAbs(point.ang - ang);
                        }
                        else {
                            return this.bot.changeHeadingAbs(point.ang + ang);
                        }
                    };
                    /**
                     * Extract Collision Angles.
                     * @param collisionElements
                     */
                    CollisionBaseManager.prototype.getCollisionAngles = function (collisionElements) {
                        var collisionAngles = [];
                        var playerPosition = this.gameWrapper.player.getPosition();
                        for (var idx = 0, ll = collisionElements.length; idx < ll; idx++) {
                            var collisionElement = collisionElements[idx];
                            // Ensures the distance is set
                            this.bot.setDistance2FromPlayer(collisionElement);
                            var ang = KartwarsBot.MathUtils.fastAtan2(Math.round(collisionElement.y - playerPosition.y), Math.round(collisionElement.x - playerPosition.x));
                            var aIndex = this.getAngleIndex(ang);
                            var actualDistance = Math.round(Math.pow(Math.sqrt(collisionElement.distance2) - collisionElement.radius, 2));
                            // Add to collisionAngles if distance is closer
                            if (collisionAngles[aIndex] === undefined || collisionAngles[aIndex].distance2 > collisionElement.distance2) {
                                collisionAngles[aIndex] = new KartwarsBot.CollisionAngle(Math.round(collisionElement.x), Math.round(collisionElement.y), ang, collisionElement.dangerType, actualDistance, collisionElement.radius, aIndex);
                            }
                        }
                        return collisionAngles;
                    };
                    return CollisionBaseManager;
                }());
                Collision.CollisionBaseManager = CollisionBaseManager;
            })(Collision = Manager.Collision || (Manager.Collision = {}));
        })(Manager = KartwarsBot.Manager || (KartwarsBot.Manager = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

/// <reference path="CollisionBaseManager.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Manager;
        (function (Manager) {
            var Collision;
            (function (Collision) {
                /**
                 * Default Collision Manager.
                 */
                var CollisionCourseManager = (function (_super) {
                    __extends(CollisionCourseManager, _super);
                    function CollisionCourseManager() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    CollisionCourseManager.prototype.action = function () {
                        var collisionData = this.getCollisionData();
                        var checkCollisionActivityResult = this.checkCollision(collisionData.collisionElements);
                        if (checkCollisionActivityResult.isValid) {
                            this.bot.stage = KartwarsBot.BotStageEnum.AvoidCollision;
                            return checkCollisionActivityResult;
                        }
                        var checkEncircleActivityResult = this.checkEncircle(collisionData.collisionAngles);
                        if (checkEncircleActivityResult.isValid) {
                            this.bot.stage = KartwarsBot.BotStageEnum.AvoidEncirclement;
                            return checkEncircleActivityResult;
                        }
                        return KartwarsBot.ActivityResult.CreateInvalidResponse();
                    };
                    /**
                     * Extract collision elements based on the design map.
                     * @param collisionElements
                     * @param designer
                     * @param thisEnemy
                     * @param weaponType
                     * @param dangerType
                     */
                    CollisionCourseManager.prototype.pushCollisionElementsFromCircleDesignMap = function (collisionElements, designer, thisEnemy, weaponType, dangerType) {
                        var scPoint;
                        var designDetails = designer.DesignDetails, thisDesign = designer.getDesign(weaponType);
                        if (!thisDesign) {
                            return;
                        }
                        var sRadius = this.bot.opt.basePlayerWidth / 2;
                        var enemyXPosition = thisEnemy.x, enemyYPosition = thisEnemy.y;
                        var enemyRotation = this.gameWrapper.player.getRotation(thisEnemy), sin = Math.sin(enemyRotation), cos = Math.cos(enemyRotation);
                        var baseRadius = sRadius * this.bot.opt.radiusDangerMultiplier;
                        for (var idRow = 0; idRow < thisDesign.length; idRow++) {
                            var thisRow = thisDesign[idRow];
                            var h = idRow - designDetails.heightCenter;
                            for (var idColumn = 0; idColumn < thisRow.length; idColumn++) {
                                var thisElement = thisRow[idColumn];
                                if (thisElement == 0) {
                                    continue;
                                }
                                var w = idColumn - designDetails.widthCenter;
                                var newRadius = thisElement * baseRadius;
                                var wNewRadius = newRadius * Math.abs(w);
                                var hNewRadius = newRadius * Math.abs(h);
                                /*
                                    Guidance:
                                        Left:
                                            x+ sin
                                            y- cos
                                        Right:
                                            x- sin
                                            y+ cos
                                        Front:
                                            x+ cos
                                            y+ sin
                                        Behind:
                                            x- cos
                                            y- sin
                                */
                                var newX = enemyXPosition;
                                var newY = enemyYPosition;
                                if (w < 0) {
                                    // Left
                                    newX += sin * wNewRadius;
                                    newY -= cos * wNewRadius;
                                }
                                else if (w > 0) {
                                    // Right
                                    newX -= sin * wNewRadius;
                                    newY += cos * wNewRadius;
                                }
                                if (h < 0) {
                                    // Front
                                    newX += cos * hNewRadius;
                                    newY += sin * hNewRadius;
                                }
                                else if (h > 0) {
                                    // Behind
                                    newX -= cos * hNewRadius;
                                    newY -= sin * hNewRadius;
                                }
                                scPoint = new KartwarsBot.CollisionElement(newX, newY, enemyRotation, KartwarsBot.CollisionElementType.Circle, dangerType, newRadius /*,
                                true*/);
                                //this.bot.setDistance2FromPlayer(scPoint);
                                //this.addCollisionAngle(scPoint);
                                collisionElements.push(scPoint);
                                //if (window.visualDebugging) {
                                //	if (this.bot.opt.draw.enemies) {
                                //		this.canvas.drawCircle(scPoint, 'red', false, 0.25);
                                //	}
                                //}
                                scPoint = undefined;
                            }
                        }
                    };
                    /**
                     * Extract collision elements based on the design map from each enemy.
                     * @param collisionElements
                     */
                    CollisionCourseManager.prototype.pushEnemiesCollisionElements = function (collisionElements) {
                        var enemies = this.gameWrapper.items.getEnemies();
                        for (var enemyIdx = 0, ls = enemies.length; enemyIdx < ls; enemyIdx++) {
                            if (enemies[enemyIdx].id !== window.mainCar.id) {
                                var thisEnemy = enemies[enemyIdx];
                                // Skip if enemy has no weapon or has a non-lethal one
                                if (!thisEnemy.isShieldActivated && (!thisEnemy.weapon || !thisEnemy.weapon.isLethalWeapon)) {
                                    continue;
                                }
                                var designer = KartwarsBot.Design.Circle.WarCarDesigns.Singleton;
                                if (thisEnemy.isShieldActivated) {
                                    this.pushCollisionElementsFromCircleDesignMap(collisionElements, designer, thisEnemy, KartwarsBot.CarWeapon.Shield, KartwarsBot.CollisionElementDangerType.Enemy);
                                }
                                this.pushCollisionElementsFromCircleDesignMap(collisionElements, designer, thisEnemy, thisEnemy.weapon.weaponType, KartwarsBot.CollisionElementDangerType.Enemy);
                            }
                        }
                    };
                    /**
                     * Extract collision elements based on the design map from each element in the collection.
                     * @param collisionElements
                     * @param activatedWeaponsCollection
                     * @param weaponType
                     * @param dangerType
                     */
                    CollisionCourseManager.prototype.pushCustomWeaponsCollisionElements = function (collisionElements, activatedWeaponsCollection, weaponType, dangerType) {
                        for (var enemyIdx = 0, ls = activatedWeaponsCollection.length; enemyIdx < ls; enemyIdx++) {
                            var thisActivatedWeapon = activatedWeaponsCollection[enemyIdx];
                            var designer = KartwarsBot.Design.Circle.WeaponDesigns.Singleton;
                            this.pushCollisionElementsFromCircleDesignMap(collisionElements, designer, thisActivatedWeapon, weaponType, dangerType);
                        }
                    };
                    /**
                     * Extract collision elements based on the design map from each other danger (bombs, mines, rockets).
                     * @param collisionElements
                     */
                    CollisionCourseManager.prototype.pushWeaponsCollisionElements = function (collisionElements) {
                        var misiles = this.gameWrapper.items.getMissiles(), teleMisiles = this.gameWrapper.items.getTeleMissiles(), bombs = this.gameWrapper.items.getBombs(), mines = this.gameWrapper.items.getMines();
                        this.pushCustomWeaponsCollisionElements(collisionElements, misiles, KartwarsBot.CarWeapon.FastRocket, KartwarsBot.CollisionElementDangerType.Misile);
                        this.pushCustomWeaponsCollisionElements(collisionElements, teleMisiles, KartwarsBot.CarWeapon.TeleRocket, KartwarsBot.CollisionElementDangerType.TeleMisile);
                        this.pushCustomWeaponsCollisionElements(collisionElements, bombs, KartwarsBot.CarWeapon.BigBang, KartwarsBot.CollisionElementDangerType.Bomb);
                        this.pushCustomWeaponsCollisionElements(collisionElements, mines, KartwarsBot.CarWeapon.Mine, KartwarsBot.CollisionElementDangerType.Mine);
                    };
                    /**
                     * Get all collision elements.
                     */
                    CollisionCourseManager.prototype.getCollisionData = function () {
                        var collisionElements = [];
                        var collisionAngles;
                        this.pushWeaponsCollisionElements(collisionElements);
                        this.pushEnemiesCollisionElements(collisionElements);
                        collisionAngles = this.getCollisionAngles(collisionElements);
                        collisionElements.sort(KartwarsBot.ArrayUtils.sortDistance2);
                        /*
                        // WALL
                        // TODO : Review
                        if (MathUtils.getDistance2(this.MID_X, this.MID_Y, playerPosition.x, playerPosition.y) > Math.pow(this.MAP_R - 1000, 2)) {
                            //debugger;
                            let midAng = MathUtils.fastAtan2(playerPosition.y - this.MID_X, playerPosition.x - this.MID_Y);
                    
                            scPoint = {
                                x: this.MID_X + this.MAP_R * Math.cos(midAng),
                                y: this.MID_Y + this.MAP_R * Math.sin(midAng),
                                //snake: -1,
                                snake: null,
                                radius: this.snakeWidth,
                    
                                enemies: enemies,
                                head: true,
                                distance: -Infinity
                            };
                    
                            this.getDistance2FromPlayer(scPoint);
                            collisionPoints.push(scPoint);
                            this.addCollisionAngle(scPoint);
                    
                            if (window.visualDebugging) {
                                this.canvas.drawCircle(
                                    new Circle(
                                        scPoint.x,
                                        scPoint.y,
                                        scPoint.radius
                                    ),
                                    'yellow', false
                                );
                            }
                        }
                        //*/
                        this.canvas.drawCollisionElements(collisionElements, collisionAngles);
                        return new KartwarsBot.CollisionDataRespons(collisionElements, collisionAngles);
                    };
                    /**
                     * Get intersection points between the supplied Collision Element and the head detector.
                     * @param thisCollisionElement
                     */
                    CollisionCourseManager.prototype.getIntersectionPoints = function (thisCollisionElement) {
                        var pointsIntersection;
                        var collisionCircle = new KartwarsBot.Circle(thisCollisionElement.x, thisCollisionElement.y, thisCollisionElement.radius);
                        // -1 snake is special case for non kart object.
                        pointsIntersection = this.bot.math.circleIntersect(this.bot.shapesHolster.headCircle, collisionCircle);
                        return pointsIntersection;
                    };
                    /**
                     * Checks to see if you are going to collide with anything in the collision detection radius.
                     */
                    CollisionCourseManager.prototype.checkCollision = function (collisionElements) {
                        window.botFactory.clock.startFrame();
                        var intersectionResult;
                        if (collisionElements.length === 0) {
                            window.botFactory.clock.endFrame();
                            return KartwarsBot.ActivityResult.CreateInvalidResponse();
                        }
                        var accelerate = KartwarsBot.AccelerationFlag.NotDefined;
                        var playerRotation = this.gameWrapper.player.getRotation();
                        for (var i = 0; i < collisionElements.length; i++) {
                            var thisCollisionElement = collisionElements[i];
                            intersectionResult = this.getIntersectionPoints(thisCollisionElement);
                            if (intersectionResult.status >= KartwarsBot.ShapesIntersectionStatus.ShapeInside) {
                                var intersectionPoint = intersectionResult.points[0];
                                if (intersectionPoint) {
                                    // TODO : Test/Review
                                    if (thisCollisionElement.dangerType == KartwarsBot.CollisionElementDangerType.Misile || thisCollisionElement.dangerType == KartwarsBot.CollisionElementDangerType.TeleMisile) {
                                        if (Math.sqrt(thisCollisionElement.distance2) <= this.bot.opt.closeToImminentDangerRange) {
                                            accelerate = KartwarsBot.AccelerationFlag.Yes;
                                        }
                                    }
                                    if (((intersectionResult.status == KartwarsBot.ShapesIntersectionStatus.HasIntersections) && this.bot.inFrontDangerAngle(intersectionPoint)) ||
                                        (intersectionResult.status == KartwarsBot.ShapesIntersectionStatus.ShapeInside)) {
                                        //
                                        // Case when player is tailed.
                                        var additionalAvoidanceAngle = 0;
                                        var angleOffset = Math.abs(playerRotation - thisCollisionElement.ang);
                                        if (angleOffset < this.opt.tailedDetectorThresholdAngle) {
                                            additionalAvoidanceAngle = this.opt.tailedDetectorAdditionalAvoidanceAngle;
                                            accelerate = KartwarsBot.AccelerationFlag.Yes;
                                        }
                                        //
                                        var activityResult = this.avoidCollisionPoint(intersectionPoint, this.opt.avoidanceAngle - additionalAvoidanceAngle);
                                        window.botFactory.clock.endFrame();
                                        return KartwarsBot.ActivityResult.CreateValidResponse(activityResult.goalCoordinates, accelerate);
                                    }
                                }
                            }
                        }
                        window.botFactory.clock.endFrame();
                        return KartwarsBot.ActivityResult.CreateInvalidResponse();
                    };
                    /**
                     * Checks to see if you are surrounded by multiple dangerous point.
                     */
                    CollisionCourseManager.prototype.checkEncircle = function (collisionAngles) {
                        window.botFactory.clock.startFrame();
                        var encircledKart = [];
                        var high = 0;
                        //let highSnake;
                        var enAll = 0;
                        for (var i = 0; i < collisionAngles.length; i++) {
                            if (collisionAngles[i] !== undefined) {
                                // TODO : Review
                                if (KartwarsBot.CollisionElementDangerType.NotDefined != collisionAngles[i].dangerType) {
                                    var dangerType = collisionAngles[i].dangerType;
                                    if (encircledKart[dangerType]) {
                                        encircledKart[dangerType]++;
                                    }
                                    else {
                                        encircledKart[dangerType] = 1;
                                    }
                                    if (encircledKart[dangerType] > high) {
                                        high = encircledKart[dangerType];
                                    }
                                }
                                if (collisionAngles[i].distance2 < Math.pow(this.bot.kartRadius * this.bot.opt.enCircleDistanceMult, 2)) {
                                    enAll++;
                                }
                            }
                        }
                        var playerPosition = this.gameWrapper.player.getPosition();
                        if (high > this.bot.MAXARC * this.bot.opt.enCircleThreshold) {
                            var activityResult = this.headingBestAngle(collisionAngles);
                            //let enemies = this.gameWrapper.items.getEnemies();
                            //if (high !== this.MAXARC && enemies[highSnake].sp > 10) {
                            //if (high !== this.MAXARC && highSnake.sp > 10) {
                            /*
                            if (high !== this.bot.MAXARC) {
                                this.bot.setAcceleration(1);
                            } else {
                                this.bot.setAcceleration(this.bot.defaultAccel);
                            }
                            */
                            // Draw encircled player
                            this.canvas.drawEncircledPlayer(this.bot.shapesHolster.playerCircle, true);
                            window.botFactory.clock.endFrame();
                            return KartwarsBot.ActivityResult.Transfer(activityResult, null, null, KartwarsBot.AccelerationFlag.Yes);
                        }
                        if (enAll > this.bot.MAXARC * this.bot.opt.enCircleAllThreshold) {
                            var activityResult = this.headingBestAngle(collisionAngles);
                            //this.bot.setAcceleration(this.bot.defaultAccel);
                            // Draw encircled player
                            this.canvas.drawEncircledPlayer(this.bot.shapesHolster.playerCircle, false);
                            window.botFactory.clock.endFrame();
                            return KartwarsBot.ActivityResult.Transfer(activityResult, null, null, KartwarsBot.AccelerationFlag.Default);
                        }
                        else {
                            this.canvas.drawPlayer(this.bot.shapesHolster.playerCircle, this.bot.shapesHolster.playerResourceGatherCircle, this.bot.shapesHolster.headCircle, this.bot.shapesHolster.tailCircle, this.bot.shapesHolster.closeToImminentDangerCircle, this.bot.shapesHolster.playerLeftSideCircle, this.bot.shapesHolster.playerRightSideCircle, this.bot.opt.frontDangerAngle, this.bot.opt.tailDangerAngle, this.bot.opt.frontResourceGatherAngle);
                        }
                        // TODO : Review
                        //this.bot.setAcceleration(this.bot.defaultAccel);
                        window.botFactory.clock.endFrame();
                        return KartwarsBot.ActivityResult.CreateInvalidResponse();
                    };
                    return CollisionCourseManager;
                }(Collision.CollisionBaseManager));
                Collision.CollisionCourseManager = CollisionCourseManager;
            })(Collision = Manager.Collision || (Manager.Collision = {}));
        })(Manager = KartwarsBot.Manager || (KartwarsBot.Manager = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

/// <reference path="../../_references.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Manager;
        (function (Manager) {
            var Collision;
            (function (Collision) {
                /**
                 * Enhanced Collision Manager with polygon detectors.
                 */
                var AdvancedCollisionCourseManager = (function (_super) {
                    __extends(AdvancedCollisionCourseManager, _super);
                    function AdvancedCollisionCourseManager() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    /**
                     * Extract collision elements based on the design map.
                     * @param collisionElements
                     * @param designer
                     * @param thisEnemy
                     * @param weaponType
                     * @param dangerType
                     */
                    AdvancedCollisionCourseManager.prototype.pushCollisionElementsFromPolygonDesignMap = function (collisionElements, designer, thisEnemy, weaponType, dangerType) {
                        var scPoint;
                        var thisDesign = designer.getDesign(weaponType);
                        if (!thisDesign) {
                            return;
                        }
                        var enemyXPosition = thisEnemy.x, enemyYPosition = thisEnemy.y;
                        var enemyVector = new Victor(enemyXPosition, enemyYPosition);
                        var enemyRotation = this.gameWrapper.player.getRotation(thisEnemy), sin = Math.sin(enemyRotation), cos = Math.cos(enemyRotation);
                        var scaling = this.bot.kartRadius * this.bot.opt.radiusDangerMultiplier;
                        var thisDesignCopy = Array(thisDesign.length);
                        for (var idx = 0; idx < thisDesignCopy.length; idx++) {
                            var thisPoint = (thisDesignCopy[idx] = thisDesign[idx].clone());
                            thisPoint
                                .rotate(enemyRotation)
                                .multiplyScalar(scaling)
                                .add(enemyVector);
                        }
                        scPoint = new KartwarsBot.CollisionElement(enemyXPosition, enemyYPosition, enemyRotation, KartwarsBot.CollisionElementType.Polygon, dangerType, scaling /*,
                        true*/);
                        scPoint.geometry = thisDesignCopy;
                        //this.bot.setDistance2FromPlayer(scPoint);
                        //this.addCollisionAngle(scPoint);
                        collisionElements.push(scPoint);
                        scPoint = undefined;
                    };
                    /**
                     * Extract collision elements based on the design map from each enemy.
                     * @param collisionElements
                     */
                    AdvancedCollisionCourseManager.prototype.pushEnemiesCollisionElements = function (collisionElements) {
                        var enemies = this.gameWrapper.items.getEnemies();
                        for (var enemyIdx = 0, ls = enemies.length; enemyIdx < ls; enemyIdx++) {
                            if (enemies[enemyIdx].id !== window.mainCar.id) {
                                var thisEnemy = enemies[enemyIdx];
                                // Skip if enemy has no weapon or has a non-lethal one
                                if (!thisEnemy.isShieldActivated && (!thisEnemy.weapon || !thisEnemy.weapon.isLethalWeapon)) {
                                    continue;
                                }
                                var designer = KartwarsBot.Design.Polygon.WarCarDesigns.Singleton;
                                if (thisEnemy.isShieldActivated) {
                                    this.pushCollisionElementsFromPolygonDesignMap(collisionElements, designer, thisEnemy, KartwarsBot.CarWeapon.Shield, KartwarsBot.CollisionElementDangerType.Enemy);
                                }
                                this.pushCollisionElementsFromPolygonDesignMap(collisionElements, designer, thisEnemy, thisEnemy.weapon.weaponType, KartwarsBot.CollisionElementDangerType.Enemy);
                            }
                        }
                    };
                    /**
                     * Get all collision elements.
                     */
                    AdvancedCollisionCourseManager.prototype.getCollisionData = function () {
                        var collisionElements = [];
                        var collisionAngles;
                        _super.prototype.pushWeaponsCollisionElements.call(this, collisionElements);
                        this.pushEnemiesCollisionElements(collisionElements);
                        collisionAngles = this.getCollisionAngles(collisionElements);
                        collisionElements.sort(KartwarsBot.ArrayUtils.sortDistance2);
                        this.canvas.drawCollisionElements(collisionElements, collisionAngles);
                        return new KartwarsBot.CollisionDataRespons(collisionElements, collisionAngles);
                    };
                    /**
                     * Get intersection points betwwen the supplied Collision Element and the head detector.
                     * @param thisCollisionElement
                     */
                    AdvancedCollisionCourseManager.prototype.getIntersectionPoints = function (thisCollisionElement) {
                        var pointsIntersection;
                        switch (thisCollisionElement.shapeType) {
                            case KartwarsBot.CollisionElementType.Circle:
                                {
                                    var collisionCircle = new KartwarsBot.Circle(thisCollisionElement.x, thisCollisionElement.y, thisCollisionElement.radius);
                                    pointsIntersection = this.bot.math.circleIntersect(this.bot.shapesHolster.headCircle, collisionCircle);
                                }
                                break;
                            case KartwarsBot.CollisionElementType.Polygon:
                                {
                                    var collisionPolygon = new KartwarsBot.Polygon(thisCollisionElement.x, thisCollisionElement.y, thisCollisionElement.geometry);
                                    pointsIntersection = this.bot.math.circlePolygonIntersect(this.bot.shapesHolster.headCircle, collisionPolygon);
                                }
                                break;
                            default: {
                                throw new Error("Invalid CollisionElementType: '" + thisCollisionElement.shapeType + "'");
                            }
                        }
                        return pointsIntersection;
                    };
                    return AdvancedCollisionCourseManager;
                }(Collision.CollisionCourseManager));
                Collision.AdvancedCollisionCourseManager = AdvancedCollisionCourseManager;
            })(Collision = Manager.Collision || (Manager.Collision = {}));
        })(Manager = KartwarsBot.Manager || (KartwarsBot.Manager = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

/// <reference path="../../_references.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Manager;
        (function (Manager) {
            var Collision;
            (function (Collision) {
                var ÜberCollisionCourseManager = (function (_super) {
                    __extends(ÜberCollisionCourseManager, _super);
                    function ÜberCollisionCourseManager() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return ÜberCollisionCourseManager;
                }(Collision.AdvancedCollisionCourseManager));
                Collision.ÜberCollisionCourseManager = ÜberCollisionCourseManager;
            })(Collision = Manager.Collision || (Manager.Collision = {}));
        })(Manager = KartwarsBot.Manager || (KartwarsBot.Manager = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        /**
         * Bot Options.
         */
        var BotOptions = (function () {
            // Constructor
            function BotOptions() {
                // Target fps
                // targetFps: number = 30;
                // Size of arc for collisionAngles
                this.arcSize = Math.PI / 8;
                // Radius multiple for side detector circle intersects
                this.radiusSideDetectorsMultiplier = 1;
                // Radius multiple for front detector circle intersects
                this.radiusFrontDetectorMultiplier = 10;
                // Radius multiple for behind detector circle intersects
                this.radiusBehindDetectorMultiplier = 10;
                // Radius multiple for danger circle intersects
                this.radiusDangerMultiplier = 10;
                // Front resource gather angle size
                this.frontResourceGatherAngle = Math.PI * 2 / 3;
                // Front danger angle size
                this.frontDangerAngle = Math.PI / 2;
                // Tail danger angle size
                this.tailDangerAngle = Math.PI / 2;
                // Percent of angles covered by same danger type to be considered an encircle attempt
                this.enCircleThreshold = 0.5625;
                // Percent of angles covered by all dangers to move to safety
                this.enCircleAllThreshold = 0.5625;
                // Distance multiplier for enCircleAllThreshold
                this.enCircleDistanceMult = 20;
                // TODO : Description
                this.basePlayerWidth = 50;
                this.playerRadiusMultiplier = 20;
                this.playerResourceGatherRadiusMultiplier = 35;
                this.closeToImminentDangerRange = 350;
                this.tunnelSideDistance = 87.5;
                this.wall = {
                    offsetBottomY: 0,
                    offsetLeftX: 0,
                    offsetRightX: 0,
                    offsetTopY: 0,
                };
                this.fixedRadius = {
                    food: 15,
                    weapon: 45,
                };
                this.radiusEnchancer = {
                    bombs: 125 * 7.25,
                    mines: 125 * 1.75,
                    misiles: 125 * 3.5,
                    teleMisiles: 125 * 5,
                };
            }
            return BotOptions;
        }());
        KartwarsBot.BotOptions = BotOptions;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

/// <reference path="_references.ts" />
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
        var BotMathWrapper = (function () {
            // Constructor
            function BotMathWrapper(gameWrapper, canvas) {
                this.gameWrapper = gameWrapper;
                this.canvas = canvas;
            }
            /**
             * Checks if two circles intersects.
             * @param circle1
             * @param circle2
             */
            BotMathWrapper.prototype.circleIntersect = function (circle1, circle2) {
                var intersections = KartwarsBot.GeometryIntersectionsUtils.circleCircleIntersect(circle1, circle2);
                if (intersections.status == KartwarsBot.ShapesIntersectionStatus.ShapeInside) {
                    intersections.addPoint(new KartwarsBot.BotPoint2D(circle2.x, circle2.y));
                }
                else if (intersections.status != KartwarsBot.ShapesIntersectionStatus.HasIntersections) {
                    return intersections;
                }
                var playerPosition = this.gameWrapper.player.getPosition();
                for (var intersectionIdx = 0, ls = intersections.length; intersectionIdx < ls; intersectionIdx++) {
                    var point = intersections.points[intersectionIdx];
                    point.ang = KartwarsBot.MathUtils.fastAtan2(point.y - playerPosition.y, point.x - playerPosition.x);
                    // Draw collision point
                    this.canvas.drawCollisionPoint(point);
                }
                // Draw collision circle
                this.canvas.drawCollisionCircle(circle2);
                return intersections;
            };
            /**
             * Checks if the circle and the polygon intersects.
             * @param circle
             * @param polygon
             */
            BotMathWrapper.prototype.circlePolygonIntersect = function (circle, polygon) {
                var intersections = KartwarsBot.GeometryIntersectionsUtils.intersectCirclePolygon(circle, circle.radius, polygon);
                if (intersections.status == KartwarsBot.ShapesIntersectionStatus.ShapeInside) {
                    intersections.addPoint(new KartwarsBot.BotPoint2D(polygon.x, polygon.y));
                }
                else if (intersections.status != KartwarsBot.ShapesIntersectionStatus.HasIntersections) {
                    return intersections;
                }
                var playerPosition = this.gameWrapper.player.getPosition();
                for (var intersectionIdx = 0, ls = intersections.length; intersectionIdx < ls; intersectionIdx++) {
                    var point = intersections.points[intersectionIdx];
                    point.ang = KartwarsBot.MathUtils.fastAtan2(point.y - playerPosition.y, point.x - playerPosition.x);
                    // Draw collision point
                    this.canvas.drawCollisionPoint(point);
                }
                // Draw collision circle
                this.canvas.drawCollisionPolygon(polygon);
                return intersections;
            };
            return BotMathWrapper;
        }());
        var BotBase = (function () {
            // Constructor
            function BotBase(gameWrapper, canvas) {
                this.gameWrapper = gameWrapper;
                this.canvas = canvas;
                this.isBotRunning = false;
                this.isBotEnabled = true;
                this.stage = KartwarsBot.BotStageEnum.NotStarted;
                this.scores = [];
                this.defaultAccel = 0;
                this.sectorBoxSide = 0;
                this.shapesHolster = {
                    closeToImminentDangerCircle: null,
                    headCircle: null,
                    playerCircle: null,
                    playerLeftSideCircle: null,
                    playerResourceGatherCircle: null,
                    playerRightSideCircle: null,
                    tailCircle: null,
                    tunnelLeftSideLine: null,
                    tunnelRightSideLine: null,
                };
                // TODO : Review
                this.speedMult = 25 / 5.78;
                var worldBounds = this.gameWrapper.world.getWorkingBounds();
                this.worldCenterX = (worldBounds.width / 2);
                this.worldCenterY = (worldBounds.height / 2);
                this.opt = new KartwarsBot.BotOptions();
                this.math = new BotMathWrapper(gameWrapper, canvas);
                this.goal = new KartwarsBot.GoalData();
            }
            Object.defineProperty(BotBase.prototype, "kartWidth", {
                get: function () { return this.opt.basePlayerWidth; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BotBase.prototype, "kartRadius", {
                get: function () { return this.kartWidth / 2; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BotBase.prototype, "MAXARC", {
                // affects enclosed detection
                get: function () { return (2 * Math.PI) / this.opt.arcSize; },
                enumerable: true,
                configurable: true
            });
            /**
             * Set Acceleration.
             * @param flag
             */
            BotBase.prototype.setAcceleration = function (flag) {
                if (flag == KartwarsBot.AccelerationFlag.Yes) {
                    if (!window.mainCar.isAccelerating) {
                        window.mainCar.isAccelerating = true;
                        window.log('Speed up!!');
                        var e = new MouseEvent('mousedown', {
                            altKey: false,
                            bubbles: true,
                            button: 2,
                            buttons: 2,
                            cancelable: true,
                            ctrlKey: false,
                            shiftKey: false,
                        });
                        this.gameWrapper.input.canvas.dispatchEvent(e);
                    }
                }
                else {
                    if (window.mainCar.isAccelerating) {
                        window.mainCar.isAccelerating = false;
                        window.log('Stop speeding up!!');
                        var e = new MouseEvent('mouseup', {
                            altKey: false,
                            bubbles: true,
                            button: 2,
                            buttons: 2,
                            cancelable: true,
                            ctrlKey: false,
                            shiftKey: false,
                        });
                        this.gameWrapper.input.canvas.dispatchEvent(e);
                    }
                }
            };
            /**
             * Fires weapon. (Obsolete)
             */
            BotBase.prototype.fireWeapon = function () {
                if (window.mainCar.weapon) {
                    var thisWeapon = window.mainCar.weapon;
                    if (thisWeapon.weaponType != KartwarsBot.CarWeapon.None) {
                        if (!thisWeapon.weaponFired) {
                            thisWeapon.weaponFired = true;
                            // window.log('Fire weapon!!');
                            var e = new MouseEvent('mousedown', {
                                altKey: false,
                                bubbles: true,
                                button: 1,
                                buttons: 1,
                                cancelable: true,
                                ctrlKey: false,
                                shiftKey: false,
                            });
                            this.gameWrapper.input.canvas.dispatchEvent(e);
                        }
                    }
                    else {
                        if (thisWeapon.weaponFired == true) {
                            thisWeapon.weaponFired = false;
                            // window.log('Stop firing weapon!!');
                            var e = new MouseEvent('mouseup', {
                                altKey: false,
                                bubbles: true,
                                button: 1,
                                buttons: 1,
                                cancelable: true,
                                ctrlKey: false,
                                shiftKey: false,
                            });
                            this.gameWrapper.input.canvas.dispatchEvent(e);
                        }
                    }
                }
            };
            /**
             * Fires weapon once. (Experimental)
             */
            BotBase.prototype.fireWeaponTick = function () {
                if (window.mainCar.weapon) {
                    var thisWeapon = window.mainCar.weapon;
                    if (thisWeapon.weaponType != KartwarsBot.CarWeapon.None) {
                        // window.log('Fire weapon!!');
                        var mouseDownEvent = new MouseEvent('mousedown', {
                            altKey: false,
                            bubbles: true,
                            button: 1,
                            buttons: 1,
                            cancelable: true,
                            ctrlKey: false,
                            shiftKey: false,
                        });
                        this.gameWrapper.input.canvas.dispatchEvent(mouseDownEvent);
                        // window.log('Stop firing weapon!!');
                        var mouseUpEvent = new MouseEvent('mouseup', {
                            altKey: false,
                            bubbles: true,
                            button: 1,
                            buttons: 1,
                            cancelable: true,
                            ctrlKey: false,
                            shiftKey: false,
                        });
                        this.gameWrapper.input.canvas.dispatchEvent(mouseUpEvent);
                        thisWeapon.weaponFired = true;
                    }
                }
            };
            /**
             * On Player Death's event.
             */
            BotBase.prototype.onPlayerDeath = function () {
                this.stage = KartwarsBot.BotStageEnum.NotStarted;
            };
            /**
             * Change heading to angle.
             * @param angle
             */
            BotBase.prototype.changeHeadingAbs = function (angle) {
                var playerPosition = this.gameWrapper.player.getPosition();
                var goalCoordinates = new KartwarsBot.Point2D(
                /*Math.round(*/ playerPosition.x + (Math.cos(angle) * (this.shapesHolster.headCircle.radius)) /*)*/, 
                /*Math.round(*/ playerPosition.y + (Math.sin(angle) * (this.shapesHolster.headCircle.radius)) /*)*/);
                return KartwarsBot.ActivityResult.CreateValidResponse(goalCoordinates);
            };
            /**
             * Set distance2 from player.
             * @param collisionElement
             */
            BotBase.prototype.setDistance2FromPlayer = function (collisionElement) {
                var playerPosition = this.gameWrapper.player.getPosition();
                collisionElement.distance2 = KartwarsBot.MathUtils.getDistance2(playerPosition, collisionElement);
                return collisionElement;
            };
            /**
             * Checks if the given point is in the specified angle based on player's position and rotation.
             * @param point
             * @param radiusCheck
             */
            BotBase.prototype.inFrontAngle = function (point, angle, radiusCheck) {
                var playerPosition = this.gameWrapper.player.getPosition();
                var playerRotation = this.gameWrapper.player.getRotation();
                return KartwarsBot.GeometryIntersectionsUtils.isInsideArcSector(
                //new Point2D(point.x, point.y),
                point, 
                //new Point2D(playerPosition.x, playerPosition.y),
                playerPosition, radiusCheck, playerRotation - (angle / 2), playerRotation + (angle / 2));
            };
            BotBase.prototype.inBackAngle = function (point, angle, radiusCheck) {
                var playerPosition = this.gameWrapper.player.getPosition();
                var playerRotation = this.gameWrapper.player.getRotation();
                return KartwarsBot.GeometryIntersectionsUtils.isInsideArcSector(
                //new Point2D(point.x, point.y),
                point, 
                //new Point2D(playerPosition.x, playerPosition.y),
                playerPosition, radiusCheck, playerRotation + Math.PI - (angle / 2), playerRotation + Math.PI + (angle / 2));
            };
            /**
             * Checks if the given point is in frontResourceGatherAngle based on player's position and rotation.
             * @param point
             * @param radiusCheck
             */
            BotBase.prototype.inFrontResourceGatherAngle = function (point, radiusCheck) {
                if (radiusCheck == undefined) {
                    radiusCheck = this.shapesHolster.playerResourceGatherCircle.radius;
                }
                return this.inFrontAngle(point, this.opt.frontResourceGatherAngle, radiusCheck);
            };
            /**
             * Checks if the given point is in frontDangerAngle based on player's position and rotation.
             * @param point
             * @param radiusCheck
             */
            BotBase.prototype.inFrontDangerAngle = function (point, radiusCheck) {
                if (radiusCheck == undefined) {
                    radiusCheck = this.shapesHolster.playerCircle.radius;
                }
                return this.inFrontAngle(point, this.opt.frontDangerAngle, radiusCheck);
            };
            /**
             * Checks if the given point is in tailDangerAngle based on player's position and rotation.
             * @param point
             * @param radiusCheck
             */
            BotBase.prototype.inTailDangerAngle = function (point, radiusCheck) {
                if (radiusCheck == undefined) {
                    radiusCheck = this.shapesHolster.playerCircle.radius;
                }
                return this.inFrontAngle(point, this.opt.tailDangerAngle, radiusCheck);
            };
            BotBase.prototype.inFront = function (point) {
                return this.inFrontAngle(point, Math.PI, Infinity);
            };
            BotBase.prototype.inBack = function (point) {
                return this.inBackAngle(point, Math.PI, Infinity);
            };
            /**
             * Checks if player is alive and bot is enabled.
             */
            BotBase.prototype.isBotInGame = function () {
                return (this.gameWrapper.util.isPlaying) && (this.isBotEnabled);
            };
            return BotBase;
        }());
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "setAcceleration", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "fireWeapon", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "fireWeaponTick", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "changeHeadingAbs", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "setDistance2FromPlayer", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "inFrontAngle", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "inBackAngle", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "inFrontResourceGatherAngle", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "inFrontDangerAngle", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "inTailDangerAngle", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "inFront", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "inBack", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], BotBase.prototype, "isBotInGame", null);
        KartwarsBot.BotBase = BotBase;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

/// <reference path="_references.ts" />
/// <reference path="BotBase.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
        var BotStageEnum;
        (function (BotStageEnum) {
            BotStageEnum[BotStageEnum["NotStarted"] = 0] = "NotStarted";
            BotStageEnum[BotStageEnum["AvoidCollision"] = 1] = "AvoidCollision";
            BotStageEnum[BotStageEnum["AvoidEncirclement"] = 2] = "AvoidEncirclement";
            BotStageEnum[BotStageEnum["SeekFood"] = 3] = "SeekFood";
            // TODO : Review
            // SeekFoodCluster,
            BotStageEnum[BotStageEnum["SeekWeapon"] = 4] = "SeekWeapon";
            // TODO : Review
            // DeployWeapon,
            BotStageEnum[BotStageEnum["InterceptEnemy"] = 5] = "InterceptEnemy";
        })(BotStageEnum = KartwarsBot.BotStageEnum || (KartwarsBot.BotStageEnum = {}));
        /**
         * Kartwars.io Bot.
         */
        var Bot = (function (_super) {
            __extends(Bot, _super);
            // Constructor
            function Bot(gameWrapper, canvas, datGUI) {
                var _this = _super.call(this, gameWrapper, canvas) || this;
                _this.datGUI = datGUI;
                _this._selectedStrategy = KartwarsBot.Strategy.Strategies.Default;
                _this._selectedCollisionManager = KartwarsBot.Manager.Collision.Managers.Default;
                _this._strategies = [];
                _this._collisionManagers = [];
                return _this;
            }
            Object.defineProperty(Bot.prototype, "selectedStrategy", {
                //
                // selectedStrategy property
                get: function () {
                    return this._selectedStrategy;
                },
                set: function (value) {
                    var newValue = KartwarsBot.Strategy.Strategies[KartwarsBot.Strategy.Strategies[value]];
                    if (this._selectedStrategy != newValue) {
                        var oldSelectionStrategy = this._strategies[this._selectedStrategy];
                        oldSelectionStrategy.hideDatGui();
                        this._selectedStrategy = newValue;
                        // Forces the creation of the strategy based on selection
                        var selectedStrategy = this.Strategy;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Bot.prototype, "selectedCollisionManager", {
                // !selectedStrategy property
                //
                //
                // selectedCollisionManager property
                get: function () {
                    return this._selectedCollisionManager;
                },
                set: function (value) {
                    this._selectedCollisionManager = KartwarsBot.Manager.Collision.Managers[KartwarsBot.Manager.Collision.Managers[value]];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Bot.prototype, "Strategy", {
                // !selectedStrategy property
                //
                //
                // Strategy property
                get: function () {
                    var selectedStrategyOption = this.selectedStrategy;
                    var selectedStrategy = this._strategies[selectedStrategyOption];
                    if (selectedStrategy == undefined) {
                        var instance = void 0;
                        switch (selectedStrategyOption) {
                            case KartwarsBot.Strategy.Strategies.Default:
                                {
                                    instance = new KartwarsBot.Strategy.DefaultStrategy(this, this.gameWrapper, this.canvas);
                                }
                                break;
                            case KartwarsBot.Strategy.Strategies.CalculateTorque:
                                {
                                    instance = new KartwarsBot.Strategy.CalculateTorqueBotStrategy(this, this.gameWrapper, this.canvas);
                                }
                                break;
                            case KartwarsBot.Strategy.Strategies.BasicPursuit:
                                {
                                    instance = new KartwarsBot.Strategy.PursuitBotStrategy(this, this.gameWrapper, this.canvas);
                                }
                                break;
                            case KartwarsBot.Strategy.Strategies.PursuitAndShoot:
                                {
                                    instance = new KartwarsBot.Strategy.PursuitAndShootBotStrategy(this, this.gameWrapper, this.canvas);
                                }
                                break;
                            case KartwarsBot.Strategy.Strategies.DrawEnemies:
                                {
                                    instance = new KartwarsBot.Strategy.DrawEnemiesBotStrategy(this, this.gameWrapper, this.canvas);
                                }
                                break;
                            case KartwarsBot.Strategy.Strategies.InterconnectFood:
                                {
                                    instance = new KartwarsBot.Strategy.InterconnectFoodBotStrategy(this, this.gameWrapper, this.canvas);
                                }
                                break;
                            default: {
                                throw Error("Incompatible value or type '" + selectedStrategyOption + "' in Strategy. Type: " + typeof selectedStrategyOption + ".");
                            }
                        }
                        selectedStrategy = this._strategies[selectedStrategyOption] = instance;
                    }
                    // Ensure dat GUI is showed up
                    selectedStrategy.showDatGui(this.datGUI);
                    return selectedStrategy;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Bot.prototype, "CollisionManager", {
                // !Strategy property
                //
                //
                // CollisionManager property
                get: function () {
                    var selectedCollisionManagerOption = this.selectedCollisionManager;
                    var selectedCollisionManager = this._collisionManagers[selectedCollisionManagerOption];
                    if (selectedCollisionManager == undefined) {
                        var instance = void 0;
                        switch (selectedCollisionManagerOption) {
                            case KartwarsBot.Manager.Collision.Managers.Default:
                                {
                                    instance = new KartwarsBot.Manager.Collision.CollisionCourseManager(this, this.gameWrapper, this.canvas);
                                }
                                break;
                            case KartwarsBot.Manager.Collision.Managers.Advanced:
                                {
                                    instance = new KartwarsBot.Manager.Collision.AdvancedCollisionCourseManager(this, this.gameWrapper, this.canvas);
                                }
                                break;
                            case KartwarsBot.Manager.Collision.Managers.Über:
                                {
                                    instance = new KartwarsBot.Manager.Collision.ÜberCollisionCourseManager(this, this.gameWrapper, this.canvas);
                                }
                                break;
                            default: {
                                throw Error("Incompatible value or type '" + selectedCollisionManagerOption + "' in CollisionManager. Type: " + typeof selectedCollisionManagerOption + ".");
                            }
                        }
                        selectedCollisionManager = this._collisionManagers[selectedCollisionManagerOption] = instance;
                    }
                    return selectedCollisionManager;
                },
                enumerable: true,
                configurable: true
            });
            // !CollisionManager property
            //
            /**
             * Main entry for bot.
             */
            Bot.prototype.go = function () {
                this.updateGeometry();
                this.gameWrapper.input.canvas.forceClear();
                var thisStrategyActivityResult = this.Strategy.action();
                if (!thisStrategyActivityResult) {
                    throw new Error('Invalid Strategy Activity Result.');
                }
                this.processActivity(thisStrategyActivityResult);
            };
            /**
             * Does recalculations based on world environment changes and player changes.
             */
            // TODO : Add a watcher on dependent variables. (???)
            Bot.prototype.updateGeometry = function () {
                window.botFactory.clock.startFrame();
                var playerPosition = this.gameWrapper.player.getPosition();
                var playerRotation = this.gameWrapper.player.getRotation();
                var worldBounds = this.gameWrapper.world.getWorkingBounds();
                //
                //
                this.sectorBoxSide = this.gameWrapper.world.getSectorSquaredWidth();
                this.sectorBox = new KartwarsBot.Rect(playerPosition.x - (this.sectorBoxSide / 2), playerPosition.y - (this.sectorBoxSide / 2), this.sectorBoxSide, this.sectorBoxSide);
                // if (window.visualDebugging) this.canvas.drawRect(this.sectorBox, '#c0c0c0', true, 0.1);
                this.canvas.drawRect(this.sectorBox, 0, '#c0c0c0', true, 0.1);
                var thisCos = this.cos = Math.cos(playerRotation);
                var thisSin = this.sin = Math.sin(playerRotation);
                //
                // Base player
                {
                    this.shapesHolster.playerCircle = new KartwarsBot.Circle(playerPosition.x, playerPosition.y, this.kartRadius * this.opt.playerRadiusMultiplier);
                    this.shapesHolster.playerResourceGatherCircle = new KartwarsBot.Circle(playerPosition.x, playerPosition.y, this.kartRadius * this.opt.playerResourceGatherRadiusMultiplier);
                }
                //
                //
                //
                // Close To Imminent Danger detector
                {
                    this.shapesHolster.closeToImminentDangerCircle = new KartwarsBot.Circle(playerPosition.x, playerPosition.y, this.opt.closeToImminentDangerRange);
                }
                //
                //
                //
                // Head & tail collision "detectors"
                {
                    var unknown = Math.min(1, this.speedMult - 1);
                    var headCircleRadius = this.opt.radiusFrontDetectorMultiplier / 2 * this.kartRadius;
                    var tailCircleRadius = this.opt.radiusBehindDetectorMultiplier / 2 * this.kartRadius;
                    this.shapesHolster.headCircle = new KartwarsBot.Circle(playerPosition.x + thisCos * unknown * headCircleRadius, playerPosition.y + thisSin * unknown * headCircleRadius, headCircleRadius);
                    this.shapesHolster.tailCircle = new KartwarsBot.Circle(playerPosition.x - thisCos * unknown * tailCircleRadius, playerPosition.y - thisSin * unknown * tailCircleRadius, tailCircleRadius);
                }
                //
                //
                //
                // Food collector enhancers
                {
                    var playerLeftSideCircleRadius = KartwarsBot.Data.playerTurnRadius * this.opt.radiusSideDetectorsMultiplier;
                    var playerLeftSideCircleSin = thisSin * playerLeftSideCircleRadius;
                    var playerLeftSideCircleCos = thisCos * playerLeftSideCircleRadius;
                    this.shapesHolster.playerLeftSideCircle = new KartwarsBot.Circle(playerPosition.x + playerLeftSideCircleSin, playerPosition.y - playerLeftSideCircleCos, playerLeftSideCircleRadius);
                    this.shapesHolster.playerRightSideCircle = new KartwarsBot.Circle(playerPosition.x - playerLeftSideCircleSin, playerPosition.y + playerLeftSideCircleCos, playerLeftSideCircleRadius);
                }
                //
                //
                //
                // Tunnel
                {
                    var goalCoordinates = this.goal.coordinates;
                    var distance2goalCoordinates = KartwarsBot.MathUtils.getDistance(playerPosition, goalCoordinates);
                    var tunnelSideDistance = this.opt.tunnelSideDistance;
                    var tunnelSideStartSin = thisSin * tunnelSideDistance;
                    var tunnelSideStartCos = thisCos * tunnelSideDistance;
                    var tunnelSideEndSin = thisSin * distance2goalCoordinates;
                    var tunnelSideEndCos = thisCos * distance2goalCoordinates;
                    //
                    var tunnelLeftSideStartPoint = new KartwarsBot.Point2D(playerPosition.x + tunnelSideStartSin, playerPosition.y - tunnelSideStartCos);
                    var tunnelLeftSideLine = this.shapesHolster.tunnelLeftSideLine = new KartwarsBot.Line(tunnelLeftSideStartPoint, new KartwarsBot.Point2D(tunnelLeftSideStartPoint.x + tunnelSideEndCos, tunnelLeftSideStartPoint.y + tunnelSideEndSin));
                    var tunnelRightSideStartPoint = new KartwarsBot.Point2D(playerPosition.x - tunnelSideStartSin, playerPosition.y + tunnelSideStartCos);
                    var tunnelRightSideLine = this.shapesHolster.tunnelRightSideLine = new KartwarsBot.Line(tunnelRightSideStartPoint, new KartwarsBot.Point2D(tunnelRightSideStartPoint.x + tunnelSideEndCos, tunnelRightSideStartPoint.y + tunnelSideEndSin));
                    //
                    var alpha = undefined;
                    var isGoalInTunnel = this.goal.isInTunnel =
                        KartwarsBot.MathUtils.isLeft(tunnelLeftSideLine.point1, tunnelLeftSideLine.point2, goalCoordinates) &&
                            KartwarsBot.MathUtils.isRight(tunnelRightSideLine.point1, tunnelRightSideLine.point2, goalCoordinates);
                    if (isGoalInTunnel) {
                        alpha = 0.85;
                        this.goal.state = this.inFront(goalCoordinates) ? KartwarsBot.GoalState.InFront : KartwarsBot.GoalState.InBack;
                    }
                    this.canvas.drawTunnel(tunnelLeftSideLine, tunnelRightSideLine, alpha);
                }
                //
                //
                window.botFactory.clock.endFrame();
            };
            /**
             * Processes activity response.
             * @param thisActivityResult
             */
            Bot.prototype.processActivity = function (thisActivityResult) {
                if (thisActivityResult.isValid) {
                    //
                    // Process Goal Coordinates.
                    var goalCoordinates = thisActivityResult.goalCoordinates;
                    var worldBounds = this.gameWrapper.world.getWorkingBounds();
                    if (goalCoordinates.x < worldBounds.x) {
                        goalCoordinates.x = worldBounds.x + this.opt.wall.offsetLeftX;
                    }
                    if (goalCoordinates.y < worldBounds.y) {
                        goalCoordinates.y = worldBounds.y + this.opt.wall.offsetTopY;
                    }
                    if (goalCoordinates.x > worldBounds.width) {
                        goalCoordinates.x = worldBounds.width + this.opt.wall.offsetRightX;
                    }
                    if (goalCoordinates.y > worldBounds.height) {
                        goalCoordinates.y = worldBounds.height + this.opt.wall.offsetBottomY;
                    }
                    this.goal.coordinates = goalCoordinates;
                    this.canvas.setMouseCoordinates(this.canvas.mapToMouse(goalCoordinates));
                    //
                    //
                    // Process Acceleration
                    this.setAcceleration(thisActivityResult.acceleration);
                    //
                    // Draw goal
                    this.canvas.drawGoal(goalCoordinates);
                }
            };
            return Bot;
        }(KartwarsBot.BotBase));
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], Bot.prototype, "go", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], Bot.prototype, "updateGeometry", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], Bot.prototype, "processActivity", null);
        KartwarsBot.Bot = Bot;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

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
        var ContextMenuActions;
        (function (ContextMenuActions) {
            ContextMenuActions[ContextMenuActions["First"] = 0] = "First";
            ContextMenuActions[ContextMenuActions["Default"] = 0] = "Default";
            ContextMenuActions[ContextMenuActions["Torque"] = 1] = "Torque";
            ContextMenuActions[ContextMenuActions["Pursuit"] = 2] = "Pursuit";
            ContextMenuActions[ContextMenuActions["Enemies"] = 3] = "Enemies";
            ContextMenuActions[ContextMenuActions["Food"] = 4] = "Food";
            ContextMenuActions[ContextMenuActions["Last"] = 4] = "Last";
        })(ContextMenuActions = KartwarsBot.ContextMenuActions || (KartwarsBot.ContextMenuActions = {}));
        // let actions: IDictionary<ContextMenuAction> = {};
        //actions[ContextMenuActions.Facebook] = {
        //	type: ContextMenuActions.Facebook,
        //	icon: '',
        //	href: ''
        //};
        var icons = {};
        /*
        icons[ContextMenuActions.Default] = 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMzM5LjA5MSAyNzUuOTI4IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzMzkuMDkxIDI3NS45Mjg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cGF0aCBkPSJNNC45MjIsMTAyLjg4NmMyNy41OTksMTEuNTA1LDQ3LjcyMiwxNS4yNTYsNjIuNDQyLDE1LjI2NWMwLjAxOSwwLDAuMDQsMCwwLjA2LDBjMTEuNTM0LDAsMTkuNzM0LTIuMzczLDI1LjE3Ni01LjA3OSAgIGMxLjcwOC0wLjg0NCwzLjEzOC0xLjcxNiw0LjMxNS0yLjU0bDE0OC40MjMsNjEuOTA2YzYuMzAyLDIuNjI5LDEzLjU0Mi0wLjM1MiwxNi4xNy02LjY1MWMyLjYyOC02LjMwMi0wLjM0OS0xMy41NDMtNi42NS0xNi4xNzIgICBsLTgzLjMxNy0zNC43NWwxLjc4NC00LjI3N2w4My4zMTYsMzQuNzVjNi4zMDMsMi42MjksMTMuNTQzLTAuMzUxLDE2LjE3LTYuNjUxYzIuNjI5LTYuMzAyLTAuMzQ5LTEzLjU0My02LjY1LTE2LjE3MSAgIEwxMTcuNzM5LDYwLjYwOWMtMC44NzItNS0zLjU0NS0xMi42MzktMTAuNzg4LTIxLjMxYy05LjY5NS0xMS42NjItMjcuMjQ5LTI1LjI3NC01OS4zNzQtMzguNjggICBDNDMuNS0xLjA4MywzOC44MTUsMC44NDYsMzcuMTEzLDQuOTI0Yy0xLjY5OSw0LjA3OCwwLjIyNyw4Ljc2Myw0LjMwNSwxMC40NjJjMjEuOTk1LDkuMTY5LDM2LjA1OCwxOC4xNzQsNDQuOTg5LDI1Ljg2MSAgIGMwLjM5OC0wLjAxOSwwLjc5Ny0wLjA0NCwxLjE5OS0wLjA0NGMzLjIzOCwwLDYuNDEsMC42MzgsOS40MjQsMS44OTRjNi4wMzksMi41MiwxMC43MzUsNy4yMzgsMTMuMjI1LDEzLjI5MSAgIGMyLjQ5MSw2LjA1NSwyLjQ3NCwxMi43MTMtMC4wNDQsMTguNzUyYy0zLjM2Niw4LjA2OC0xMC42NiwxMy42MTUtMTkuMTMzLDE0LjgyMmwtMy4wMDcsNy4yMDkgICBjLTEuOTUsMS40OTQtNy42NzcsNC45MDktMjAuNzA3LDQuOThjLTExLjk1NywwLjAwNi0zMC4wOTEtMy4xMDItNTYuMjg0LTE0LjAzYy00LjA3OS0xLjctOC43NjIsMC4yMjctMTAuNDYyLDQuMzA0ICAgQy0xLjA4Miw5Ni41LDAuODQ1LDEwMS4xODUsNC45MjIsMTAyLjg4NnoiLz48ZWxsaXBzZSB0cmFuc2Zvcm09Im1hdHJpeCgwLjM4NSAtMC45MjI5IDAuOTIyOSAwLjM4NSAtNi43NjcyIDEyMS4yNTg4KSIgY3g9Ijg3LjU5OCIgY3k9IjY1LjcwNyIgcng9IjIyLjUiIHJ5PSIyMi40OTkiLz48cGF0aCBkPSJNMjk5LjQ2NiwxNDQuNDc5YzAuNjE4LDAuNzI3LDEuMjcxLDEuNDM0LDEuOTk1LDIuMDkyYzkuMTg4LDguMzYsMjMuNDE2LDcuNjg4LDMxLjc3Ni0xLjUwMiAgIGM4LjM1OC05LjE5LDcuNjg1LTIzLjQxOC0xLjUwNS0zMS43NzdjLTguNjI2LTcuODQ4LTIxLjY5LTcuNzM1LTMwLjE3My0wLjA5Yy0xLjkyMiw2LjU4OS0yLjkwOCwxMy4zNTgtMi45MjEsMjAuMjczICAgQzI5OC42MzIsMTM3LjQwOSwyOTguOTU3LDE0MS4xMDYsMjk5LjQ2NiwxNDQuNDc5eiIvPjxwYXRoIGQ9Ik0zMDYuMTMzLDE3MS43NzhjLTAuNzU4LDIuNTY0LTIuNDY3LDQuNjc4LTQuODE1LDUuOTUzYy0xLjQ2MiwwLjc5OC0zLjExMiwxLjIxOS00Ljc3MSwxLjIxOSAgIGMtMy42NjcsMC03LjAzNS0xLjk5OS04Ljc5MS01LjIxOWwtMC4wNzQtMC4xNDJjLTEuMDE3LTEuOTU3LTMuMTQxLTYuNDMyLTUuMDc1LTEyLjg5OGMtMC42NjksMC42NDctMS4zMTUsMS4zMTktMS45MDYsMi4wNCAgIGMtOS45NTksMTAuMTk3LTIzLjcxNCwyNS41ODMtMzkuMTYzLDMzLjQ1M2MtNS43MTYsMS40NjgtMTUuNjg5LDQuNTE5LTI3LjU4MywxMC4yNjljLTE4LjE4Myw4Ljc5OC00MC45OTQsMjQuMDQ3LTU5LjA3OCw0OS43ODkgICBjLTMuOTY3LDUuNjUxLTIuNjA0LDEzLjQ0OCwzLjA0OCwxNy40MTRjMi4xODQsMS41MzUsNC42OSwyLjI3Miw3LjE3MiwyLjI3MmMzLjkzNiwwLDcuODA5LTEuODUzLDEwLjI0Mi01LjMxOCAgIGMxNS4wMDctMjEuMzgzLDM0LjA3OS0zNC4xODQsNDkuNTA4LTQxLjY1NGM2LjcxNy0zLjI1MSwxMi43MS01LjQ3MiwxNy4yNzEtNi45MjZjNC45MDEsNC4yOSwxMS42NzMsNi41NjgsMjEuODI1LDIuMTMzICAgYzE5Ljc1My0xMC40ODYsMjkuNzMyLTE5LjE0Niw0Mi40NzMtMzYuMjA0YzkuMTk1LTEyLjQ1OSw1Ljk4NC0yNS4yNzgtMC42MTYtMzEuMDk3Yy0xLjIwNy0xLjA2NC0yLjU5Ni0xLjgwNC00LjA5NS0yLjI2NSAgIGMxLjczOSw1LjkyMywzLjU3OCw5LjQ5NywzLjYxMiw5LjU2MUMzMDYuNjAyLDE2Ni41MTQsMzA2Ljg4OCwxNjkuMjE4LDMwNi4xMzMsMTcxLjc3OHoiLz48cGF0aCBkPSJNMjg5LjUxMywxNzIuNzczYzEuNDUyLDIuNjY2LDQuMTk4LDQuMTc3LDcuMDM0LDQuMTc3YzEuMjkyLDAsMi42MDMtMC4zMTMsMy44MTYtMC45NzYgICBjMy44ODMtMi4xMTEsNS4zMTYtNi45NywzLjIwNS0xMC44NTFsLTAuMDAyLDAuMDAxYy0wLjM2NS0wLjY1Ny02Ljk2LTEzLjY3LTYuOTI3LTMxLjY1NGMwLjAyMy0xMi42NzMsMy4xMDYtMjcuNzY5LDEzLjg5MS00My43MzIgICBjMi40NzctMy42NTksMS41MTgtOC42MzItMi4xMzktMTEuMTA5Yy0zLjY1OS0yLjQ3Ny04LjYzMy0xLjUyLTExLjEwOSwyLjEzOWMtMTIuNzExLDE4LjczMi0xNi42NjYsMzcuMzgxLTE2LjY0Myw1Mi43MDIgICBDMjgwLjY3OCwxNTYuNDY2LDI4OS4xNTcsMTcyLjA2NywyODkuNTEzLDE3Mi43NzN6Ii8+PHBvbHlnb24gcG9pbnRzPSIyNDIuOTA1LDE3Ni45MiAxNjcuOTA1LDE4MS45MiAxNjkuOTA2LDE5Ni41ODcgMjQzLjkwNiwxODEuOTIgICIvPjxwb2x5Z29uIHBvaW50cz0iMjc2LjUwNiwxMTUuMzM4IDIyOS44MjgsNTYuNzk3IDIxOS42NjIsNjcuNTU2IDI3My4yNCwxMTkuMjU0ICAiLz48L2c+PC9zdmc+';
        icons[ContextMenuActions.Torque] = 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+PHBhdGggZD0iTTMyMC4zLDIxOC4ybDE1LjItMTUuMmwtMjYuNS0yNi41bC0xNS4yLDE1LjJjLTUuOS0zLjUtMTIuMy02LjItMTkuMS04di0yMS40aC0zNy41djIxLjRjLTYuOCwxLjgtMTMuMiw0LjUtMTkuMSw4ICAgbC0xNS4yLTE1LjJMMTc2LjQsMjAzbDE1LjIsMTUuMmMtMy41LDUuOS02LjIsMTIuMy04LDE5LjFoLTIxLjR2MzcuNWgyMS40YzEuOCw2LjgsNC41LDEzLjIsOCwxOS4xbC0xNS4yLDE1LjJsMjYuNSwyNi41ICAgbDE1LjItMTUuMmM1LjksMy41LDEyLjMsNi4yLDE5LjEsOHYyMS40aDM3LjV2LTIxLjRjNi44LTEuOCwxMy4yLTQuNSwxOS4xLThsMTUuMiwxNS4ybDI2LjUtMjYuNWwtMTUuMi0xNS4yICAgYzMuNS01LjksNi4yLTEyLjMsOC0xOS4xaDIxLjR2LTM3LjVoLTIxLjRDMzI2LjUsMjMwLjUsMzIzLjgsMjI0LjEsMzIwLjMsMjE4LjJ6IE0yNTUuOSwyOTMuNWMtMjAuNywwLTM3LjUtMTYuOC0zNy41LTM3LjUgICBjMC0yMC43LDE2LjgtMzcuNSwzNy41LTM3LjVjMjAuNywwLDM3LjUsMTYuOCwzNy41LDM3LjVDMjkzLjQsMjc2LjcsMjc2LjYsMjkzLjUsMjU1LjksMjkzLjV6Ii8+PHBhdGggZD0iTTMyNS42LDgybC0xNCwzNC44QzM2OSwxMzkuOSw0MDYsMTk0LjUsNDA2LDI1NmMwLDQwLjEtMTUuNiw3Ny44LTQ0LDEwNmwyNi40LDI2LjZjMzUuNS0zNS4zLDU1LTgyLjQsNTUtMTMyLjYgICBDNDQzLjUsMTc5LjEsMzk3LjIsMTEwLjgsMzI1LjYsODJ6Ii8+PHBhdGggZD0iTTI1Niw0MDZjLTgyLjcsMC0xNTAtNjcuMy0xNTAtMTUwYzAtMTguNywzLjQtMzYuOCwxMC01My44TDgxLDE4OC42Yy04LjMsMjEuMy0xMi41LDQ0LTEyLjUsNjcuNCAgIGMwLDEwMy40LDg0LjEsMTg3LjUsMTg3LjUsMTg3LjVjMjQuOSwwLDQ4LjktNC44LDcxLjQtMTQuMmwtMTQuNS0zNC42QzI5NSw0MDIuMiwyNzUuOSw0MDYsMjU2LDQwNnoiLz48cGF0aCBkPSJNMjU2LDEwNlY2OC41Yy01MC4xLDAtOTcuMiwxOS41LTEzMi43LDU1bDI2LjUsMjYuNUMxNzguMiwxMjEuNiwyMTUuOSwxMDYsMjU2LDEwNnoiLz48L2c+PC9zdmc+';
        icons[ContextMenuActions.Pursuit] = 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNzIgNzIiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDcyIDcyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMzYsMC41QzE2LjQsMC41LDAuNSwxNi40LDAuNSwzNlMxNi40LDcxLjUsMzYsNzEuNVM3MS41LDU1LjYsNzEuNSwzNlM1NS42LDAuNSwzNiwwLjV6IE02Ni41LDM0aC02LjUgIGMtMC41LDAtMC44LTAuMy0wLjktMC44Yy0wLjMtMi43LTEuMS01LjMtMi4zLTcuNmMtMC4xLTAuMi0wLjEtMC41LDAtMC44YzAuMy0wLjYsMC41LTEuMywwLjUtMmMwLTIuNi0yLjEtNC42LTQuNi00LjYgIGMtMC4zLDAtMC43LDAtMSwwLjFjLTAuMywwLjEtMC42LDAtMC44LTAuMmMtMy4zLTIuOC03LjQtNC42LTEyLTUuMmMtMC41LTAuMS0wLjgtMC40LTAuOC0wLjlWNS41YzAtMC41LDAuNC0wLjksMS0wLjkgIEM1NCw2LjEsNjUuOSwxOCw2Ny40LDMzQzY3LjQsMzMuNiw2NywzNCw2Ni41LDM0eiBNNDkuMSw1MGMtMC4zLDAuMy0wLjgsMC4zLTEuMSwwLjFjLTAuNy0wLjUtMS42LTAuOC0yLjUtMC44ICBjLTIuNiwwLTQuNiwyLjEtNC42LDQuNmMwLDAuMiwwLDAuNCwwLjEsMC42Yy0wLjYsMC4yLTEuMywwLjMtMS45LDAuNGMtMC41LDAuMS0xLTAuMy0xLTAuOXYtNmMwLTAuNCwwLjMtMC44LDAuNy0wLjkgIGM0LjItMSw3LjUtNC4zLDguNS04LjVjMC4xLTAuNCwwLjUtMC43LDAuOS0wLjdoNmMwLjYsMCwxLDAuNSwwLjksMS4xQzU0LjMsNDMuMyw1Mi4yLDQ3LjEsNDkuMSw1MHogTTM0LDM4LjlWNDIgIGMwLDAuNy0wLjcsMS4xLTEuMywwLjhjLTEuNS0wLjctMi43LTItMy41LTMuNUMyOC45LDM4LjcsMjkuNCwzOCwzMCwzOGgzLjFDMzMuNiwzOCwzNCwzOC40LDM0LDM4Ljl6IE0yOS4yLDMyLjcgIGMwLjgtMS42LDIuMS0yLjksMy44LTMuNmMwLjUtMC4yLDEsMC4xLDEsMC42djMuNGMwLDAuNS0wLjQsMC45LTAuOSwwLjlIMzBDMjkuNCwzNCwyOC45LDMzLjMsMjkuMiwzMi43eiBNMzguOSwzOEg0MiAgYzAuNywwLDEuMSwwLjcsMC44LDEuM2MtMC43LDEuNS0yLDIuNy0zLjUsMy41QzM4LjcsNDMuMSwzOCw0Mi42LDM4LDQydi0zLjFDMzgsMzguNCwzOC40LDM4LDM4LjksMzh6IE0zOCwzMy4xdi0zLjQgIGMwLTAuNSwwLjUtMC44LDEtMC42YzEuNywwLjcsMywyLDMuOCwzLjZjMC4zLDAuNi0wLjEsMS4zLTAuOCwxLjNoLTMuMUMzOC40LDM0LDM4LDMzLjYsMzgsMzMuMXogTTM0LDI0LjV2MC4yICBjLTQuNSwwLjgtOC4yLDQuMi05LjIsOC43Yy0wLjEsMC40LTAuNSwwLjctMC45LDAuN2gtNmMtMC42LDAtMS0wLjUtMC45LTFjMS4zLTcuOCw3LjItMTQsMTQuOS0xNS43YzAuMiwwLDAuNCwwLjIsMC4zLDAuNCAgYy0wLjUsMC44LTAuOCwxLjctMC44LDIuN0MzMS40LDIyLjEsMzIuNCwyMy43LDM0LDI0LjV6IE0yNC44LDM4LjdjMSw0LjIsNC4zLDcuNSw4LjUsOC41YzAuNCwwLjEsMC43LDAuNSwwLjcsMC45djYgIGMwLDAuNi0wLjUsMS0xLjEsMC45Yy04LjItMS4zLTE0LjYtNy44LTE1LjktMTUuOWMtMC4xLTAuNSwwLjMtMS4xLDAuOS0xLjFoNkMyNC4zLDM4LDI0LjcsMzguMywyNC44LDM4Ljd6IE00OC4xLDM0ICBjLTAuNCwwLTAuOC0wLjMtMC45LTAuN2MtMS4xLTQuNC00LjctNy45LTkuMi04Ljd2LTAuMmMxLjYtMC43LDIuNi0yLjMsMi42LTQuMmMwLTEtMC4zLTEuOS0wLjgtMi43Yy0wLjEtMC4yLDAtMC40LDAuMy0wLjQgIGMyLjgsMC42LDUuNSwxLjgsNy43LDMuNmMwLjMsMC4yLDAuNCwwLjYsMC4zLDAuOWMtMC4xLDAuMy0wLjEsMC43LTAuMSwxLjFjMCwyLjYsMi4xLDQuNiw0LjYsNC42aDBjMC40LDAsMC43LDAuMiwwLjksMC41ICBjMC43LDEuNSwxLjIsMy4yLDEuNSw0LjljMC4xLDAuNi0wLjMsMS4xLTAuOSwxLjFINDguMXogTTM0LDUuNXY2LjVjMCwwLjUtMC40LDAuOC0wLjgsMC45QzIyLjYsMTQuMiwxNC4yLDIyLjYsMTMsMzMuMiAgYy0wLjEsMC41LTAuNCwwLjgtMC45LDAuOEg1LjVjLTAuNSwwLTAuOS0wLjQtMC45LTFDNi4xLDE4LDE4LDYuMSwzMyw0LjZDMzMuNiw0LjYsMzQsNSwzNCw1LjV6IE01LjUsMzhoNi41YzAuNSwwLDAuOCwwLjQsMC45LDAuOCAgYzEuMywxMC42LDkuNywxOC45LDIwLjIsMjAuMmMwLjUsMC4xLDAuOCwwLjQsMC44LDAuOXY2LjVjMCwwLjUtMC40LDAuOS0xLDAuOUMxOCw2NS45LDYuMSw1NCw0LjYsMzlDNC42LDM4LjQsNSwzOCw1LjUsMzh6ICAgTTM4LDY2LjV2LTYuNWMwLTAuNSwwLjMtMC44LDAuOC0wLjljMS40LTAuMiwyLjgtMC41LDQuMi0wLjljMC4yLTAuMSwwLjUtMC4xLDAuNywwYzAuNiwwLjMsMS4yLDAuNCwxLjksMC40ICBjMi4zLDAsNC4yLTEuNyw0LjYtMy45YzAtMC4yLDAuMS0wLjQsMC4zLTAuNmM0LjctMy43LDcuOS05LjIsOC42LTE1LjRjMC4xLTAuNSwwLjQtMC44LDAuOS0wLjhoNi41YzAuNSwwLDAuOSwwLjQsMC45LDEgIEM2NS45LDU0LDU0LDY1LjksMzksNjcuNEMzOC40LDY3LjQsMzgsNjcsMzgsNjYuNXoiLz48L3N2Zz4=';
        icons[ContextMenuActions.Enemies] = 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgOTYgOTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDk2IDk2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7fQoJLnN0MXtmaWxsOiMwMDAwMDA7fQo8L3N0eWxlPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik05LDM2LjhsNy4yLTguOGMwLjYtMC44LDEuNS0xLjIsMi41LTEuMmwxMy4xLDBjMC44LDAsMS43LDAuMSwyLjUsMC40bDAuMiwwYzIuMiwwLjcsNCwyLjEsNSw0LjFsMC4yLDAuMyAgIGMwLjMsMC41LDAuNCwxLjEsMC4zLDEuN2wtMC43LDcuNGMtMC4xLDAuNywwLjIsMS4zLDAuOCwxLjdsNy4xLDUuMWMxLDAuNSwxLjMsMS43LDAuOCwyLjdsMCwwYy0wLjUsMC45LTEuNiwxLjMtMi41LDFsLTEwLjgtNC45ICAgYy0wLjUtMC4yLTAuOS0wLjctMS0xLjJjLTAuMi0wLjktMC42LTItMC44LTEuN2wtNiw4LjJsLTYuNiwxMy40Yy0wLjUsMS4xLTEuNiwxLjctMi44LDEuOEwyLjIsNjcuMWMtMC45LDAtMS43LTAuNy0xLjctMS43VjYzICAgYzAtMC44LDAuNi0xLjYsMS41LTEuN0wxMy4yLDYwYzAuMywwLDAuNS0wLjIsMC42LTAuNWwzLTExLjljMC4xLTAuOCwwLjQtMS41LDAuOS0yLjFMMjQsMzZjMC40LTAuNiwwLjEtMS40LTAuNi0xLjZsLTMuMi0xICAgYy0wLjUtMC4yLTEuMSwwLTEuNSwwLjRMMTIuNSw0MGMtMC45LDAuOS0yLjQsMC45LTMuMywwbDAsMEM4LjMsMzkuMSw4LjIsMzcuNyw5LDM2Ljh6Ii8+PHBhdGggY2xhc3M9InN0MCIgZD0iTTI4LjUsNTQuNWMwLjEtMC4zLDAuNS0wLjMsMC43LTAuMWw1LDUuOGMwLjUsMC42LDAuNywxLjMsMC41LDJsLTMuNSwxMy45Yy0wLjMsMS4yLTEuNSwyLTIuNywxLjhsLTEuMi0wLjIgICBjLTEuMy0wLjItMi4yLTEuNS0yLTIuOGwxLjctOC44YzAuMS0wLjYsMC0xLjItMC40LTEuN2wtMS41LTIuMmMtMC4yLTAuMy0wLjItMC43LTAuMS0xLjFMMjguNSw1NC41eiIvPjxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjQyIiBjeT0iMjIuNCIgcj0iNi4yIi8+PGNpcmNsZSBjbGFzcz0ic3QwIiBjeD0iODkuMyIgY3k9IjIyLjMiIHI9IjYuMiIvPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik02Mi4zLDU0LjNsLTEuMyw1LjFjLTAuMSwwLjMtMC4zLDAuNS0wLjYsMC41bC0xMS4yLDEuNGMtMC44LDAuMS0xLjUsMC44LTEuNSwxLjd2Mi40YzAsMC45LDAuOCwxLjcsMS43LDEuNyAgIGwxNS4yLTAuM2MxLjIsMCwyLjItMC43LDIuOC0xLjhsMS40LTIuOWMwLjItMC4zLDAuMS0wLjgtMC4xLTEuMWwtNS44LTYuOUM2Mi44LDUzLjksNjIuNCw1NCw2Mi4zLDU0LjN6Ii8+PHBhdGggY2xhc3M9InN0MCIgZD0iTTk0LjUsNDcuNWwtNy4xLTUuMWMtMC42LTAuNC0wLjktMS4xLTAuOC0xLjdsMC43LTcuNGMwLjEtMC42LTAuMS0xLjItMC4zLTEuN2wtMC4yLTAuM2MtMS4xLTItMi45LTMuNS01LTQuMSAgIGwtMC4yLTAuMWMtMC44LTAuMi0xLjYtMC40LTIuNS0wLjRsLTEzLjEsMGMtMSwwLTEuOSwwLjQtMi41LDEuMmwtNy4xLDguN2MtMC43LDAuOS0wLjgsMi4zLDAsMy4yYzAuOSwxLDIuNSwxLjEsMy40LDAuMWw2LjMtNi4yICAgYzAuNC0wLjQsMC45LTAuNSwxLjUtMC40bDMuMiwxYzAuNywwLjIsMC45LDEsMC42LDEuNmwtNi40LDkuNGMtMC40LDAuNi0wLjcsMS40LTAuOSwyLjFsLTAuMiwwLjdjLTAuNCwxLjcsMCwzLjYsMS4xLDVsNS4yLDYuMyAgIGwwLDBsMy44LDQuOWMwLjQsMC41LDAuNSwxLjEsMC40LDEuN2wtMS43LDguOGMtMC4zLDEuMywwLjYsMi42LDIsMi44bDEuMiwwLjJjMS4yLDAuMiwyLjQtMC42LDIuNy0xLjhsMy41LTEzLjkgICBjMC4yLTAuNywwLTEuNS0wLjUtMmwtNy41LTguNWw1LjktOC4xYzAuMi0wLjQsMC42LDAuOCwwLjgsMS43YzAuMiwwLjUsMC41LDEsMSwxLjJsMTAuOCw0LjljMSwwLjQsMi4xLDAsMi41LTEgICBDOTUuOCw0OS4yLDk1LjQsNDgsOTQuNSw0Ny41eiIvPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zOS45LDUxLjFMMzksNTIuNWMtMC4xLDAuMi0wLjEsMC40LDAuMSwwLjZsMi40LDEuNWMwLjIsMC4xLDAuNCwwLjEsMC42LTAuMWwxLjEtMS44YzAuMS0wLjIsMC0wLjUtMC4yLTAuNiAgICBMNDAuNCw1MUM0MC4yLDUwLjksNDAsNTAuOSwzOS45LDUxLjF6Ii8+PHBhdGggY2xhc3M9InN0MCIgZD0iTTQ1LjMsNDMuNmw0LjYsMy40bDAuMy0wLjZjMS43LTQuMiwyLjctOC42LDIuOC0xMy4xbDAtMC45YzAtMC4yLTAuMy0wLjMtMC40LTAuMWwtNy40LDEwLjkgICAgQzQ1LDQzLjMsNDUuMSw0My41LDQ1LjMsNDMuNnoiLz48L2c+PC9nPjwvc3ZnPg==';
        icons[ContextMenuActions.Food] = 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+PHBhdGggZD0iTTQ0OC42LDI4MS40aC0zMC41Yy01LjQsMC05LjYsNC4zLTkuOSw5LjdDNDAzLDM4NS40LDMyNCw0NjAuNCwyMjguMSw0NTljLTk0LjMtMS40LTE3My42LTgwLjctMTc1LTE3NSAgIGMtMS40LTk1LjksNzMuNi0xNzQuOSwxNjcuOS0xODBjNS40LTAuMyw5LjctNC41LDkuNy05LjlWNjMuNWMwLTUuOC00LjktMTAuNi0xMC42LTEwLjNDOTYuOSw1OC45LTEuMSwxNjIuNiwyLjQsMjg4ICAgQzUuOCw0MDcuMSwxMDUsNTA2LjMsMjI0LjEsNTA5LjdjMTI1LjQsMy42LDIyOS4xLTk0LjUsMjM0LjgtMjE3LjdDNDU5LjIsMjg2LjIsNDU0LjMsMjgxLjQsNDQ4LjYsMjgxLjR6Ii8+PHBhdGggZD0iTTI4MS41LDIuMkwyODEuNSwyLjJWNTNsMCwwYzk0LjcsMCwxNzIuMyw3NC41LDE3Ny40LDE2Ny45YzAuMyw1LjQsNC41LDkuNywxMCw5LjdoMzAuNWM1LjgsMCwxMC42LTQuOCwxMC4zLTEwLjYgICBDNTA0LjEsOTksNDAzLjksMi4yLDI4MS41LDIuMnoiLz48cGF0aCBkPSJNMjIwLDE1NC45Yy02NSw1LjUtMTE2LjEsNjAtMTE2LjEsMTI2LjRjMCw2OC42LDU4LjMsMTI2LjksMTI2LjksMTI2LjljNjYuNCwwLDEyMS01MS4xLDEyNi40LTExNi4xICAgYzAuNS01LjgtNC41LTEwLjgtMTAuMy0xMC44SDIzMC43VjE2NS4yQzIzMC43LDE1OS40LDIyNS44LDE1NC40LDIyMCwxNTQuOXogTTE4MC4xLDI4MS42Yy0xNC4xLDAtMjUuNS0xMS40LTI1LjUtMjUuNSAgIGMwLTE0LjEsMTEuNC0yNS41LDI1LjUtMjUuNXMyNS41LDExLjQsMjUuNSwyNS41QzIwNS42LDI3MC4yLDE5NC4yLDI4MS42LDE4MC4xLDI4MS42eiBNMjU2LjIsMzU3LjVjMCwxNC4xLTExLjQsMjUuNS0yNS41LDI1LjUgICBjLTE0LjEsMC0yNS41LTExLjQtMjUuNS0yNS41YzAtMTQuMSwxMS40LTI1LjUsMjUuNS0yNS41QzI0NC44LDMzMiwyNTYuMiwzNDMuNCwyNTYuMiwzNTcuNXoiLz48cGF0aCBkPSJNMjkxLjYsMjMwLjZoMTA2LjFjNS44LDAsMTAuNy00LjksMTAuMi0xMC43Yy01LjQtNjUuMS02MC0xMTYuMi0xMjYuNS0xMTYuMmwwLDB2MTE2LjdDMjgxLjUsMjI2LjEsMjg2LDIzMC42LDI5MS42LDIzMC42ICAgeiBNMzMyLjMsMTU0LjRjMTQuMSwwLDI1LjUsMTEuNCwyNS41LDI1LjVjMCwxNC4xLTExLjQsMjUuNS0yNS41LDI1LjVjLTE0LjEsMC0yNS41LTExLjQtMjUuNS0yNS41ICAgQzMwNi44LDE2NS44LDMxOC4yLDE1NC40LDMzMi4zLDE1NC40eiIvPjwvZz48L3N2Zz4=';
        */
        icons[ContextMenuActions.Default] = 'fighter-jet';
        icons[ContextMenuActions.Torque] = 'cogs';
        icons[ContextMenuActions.Pursuit] = 'line-chart';
        icons[ContextMenuActions.Enemies] = 'exclamation';
        icons[ContextMenuActions.Food] = 'cutlery';
        /**
         * W.I.P.
         */
        var ContextMenu = (function () {
            function ContextMenu() {
                this.showFancyMenu = false;
                this.destroyedByInvalidCtrlKey = undefined;
                this.mouseClientPosition = {
                    clientX: 0,
                    clientY: 0
                };
                var itemTemplate__0 = "\n<li class='menu-item'>\n\t<a class='fa fa-{0}' href='{1}' target='_blank' data-context-menu-action='{2}'></a>\n</li>\n";
                var itemTemplate__1 = "\n<li class='menu-item'>\n\t<a href='#' target='_blank' data-context-menu-action='{0}'>\n\t\t<img src='{1}' />\n\t</a>\n</li>\n";
                var itemTemplate = "\n<li class='menu-item'>\n\t<a class='fa fa-{1}' href='#' target='_blank' data-context-menu-action='{0}'></a>\n</li>\n";
                var items = '';
                for (var idx = ContextMenuActions.First; idx <= ContextMenuActions.Last; idx++) {
                    //items += itemTemplate.format('github', 'https://github.com/', ContextMenuActions[idx]);
                    items += itemTemplate.format(ContextMenuActions[idx], icons[idx]);
                }
                var content = "\n<nav class='menu'>\n\t<input class='menu-toggler' id='menu-toggler' type='checkbox'>\n\t<label for='menu-toggler'></label>\n\t<ul id='menu-ul-list'>{0}</ul>\n</nav>\n".format(items);
                var contextMenuOverlay = document.createElement('div');
                contextMenuOverlay.className = 'menu-wrapper';
                contextMenuOverlay.id = 'menu-wrapper';
                contextMenuOverlay.style.visibility = 'hidden';
                contextMenuOverlay.innerHTML = content;
                document.body.appendChild(contextMenuOverlay);
                contextMenuOverlay.oncontextmenu = function (e) {
                    e.preventDefault();
                };
                this.domMenuWrapperElement = document.getElementById('menu-wrapper');
                this.domMenuTogglerElement = document.getElementById('menu-toggler');
            }
            Object.defineProperty(ContextMenu.prototype, "isActive", {
                get: function () {
                    return this.showFancyMenu;
                },
                enumerable: true,
                configurable: true
            });
            ContextMenu.prototype.init = function (gameWrapper, canvas, userInterface, bot, developerInterface, webSocketInterface) {
                this.gameWrapper = gameWrapper;
                this.canvas = canvas;
                this.userInterface = userInterface;
                this.bot = bot;
                this.developerInterface = developerInterface;
                this.webSocketInterface = webSocketInterface;
                this.domMenuTogglerElement.disabled = true;
                //let canvas = this.gameWrapper.input.canvas.getContext().canvas;
                var self = this;
                this.gameWrapper.input.canvas.registerEvent(function (canvas) {
                    canvas.addEventListener('contextmenu', self.onContextMouseDown, !0);
                    canvas.addEventListener('mousedown', self.onMouseDown, !0);
                    canvas.addEventListener('mouseup', self.onMouseUp, !0);
                    canvas.addEventListener('mousemove', self.onMouseMove, !0);
                    document.addEventListener('keydown', self.onKeyDown, !0);
                    document.addEventListener('keyup', self.onKeyUp, !0);
                });
                //canvas.addEventListener('contextmenu', this.onContextMouseDown);
                //canvas.addEventListener('mousedown', this.onMouseDown);
                //canvas.addEventListener('mouseup', this.onMouseUp);
                //document.addEventListener('keydown', this.onKeyDown);
                //document.addEventListener('keyup', this.onKeyUp);
            };
            ContextMenu.prototype.setMenuVisibility = function (visible) {
                this.showFancyMenu = visible;
                this.domMenuTogglerElement.checked = this.showFancyMenu;
                this.domMenuWrapperElement.style.visibility = this.showFancyMenu ? 'visible' : 'hidden';
                //console.log(`toggle Status = ${this.showFancyMenu}`);
            };
            ContextMenu.prototype.toggleMenuVisibility = function () {
                this.setMenuVisibility(!this.showFancyMenu);
            };
            ContextMenu.prototype.getElementFromPoint = function (e) {
                //let selectedElement = (document.elementFromPoint(e.clientX, e.clientY) as HTMLAnchorElement);
                var hovers = document.querySelectorAll(':hover');
                var selectedElement = hovers[hovers.length - 1];
                //let selectedElement = (hovers[hovers.length - 2] as HTMLAnchorElement);
                //selectedElement.click();
                var dataContextMenuActionValue = selectedElement.getAttribute('data-context-menu-action');
                switch (ContextMenuActions[dataContextMenuActionValue]) {
                    case ContextMenuActions.Default:
                        {
                            this.bot.selectedStrategy = KartwarsBot.Strategy.Strategies.Default;
                        }
                        break;
                    case ContextMenuActions.Torque:
                        {
                            this.bot.selectedStrategy = KartwarsBot.Strategy.Strategies.CalculateTorque;
                        }
                        break;
                    case ContextMenuActions.Pursuit:
                        {
                            this.bot.selectedStrategy = KartwarsBot.Strategy.Strategies.BasicPursuit;
                        }
                        break;
                    case ContextMenuActions.Enemies:
                        {
                            this.bot.selectedStrategy = KartwarsBot.Strategy.Strategies.DrawEnemies;
                        }
                        break;
                    case ContextMenuActions.Food:
                        {
                            this.bot.selectedStrategy = KartwarsBot.Strategy.Strategies.InterconnectFood;
                        }
                        break;
                }
            };
            ContextMenu.prototype.onContextMouseDown = function (e) {
                if (this.destroyedByInvalidCtrlKey || (e.ctrlKey && e.button == 2 && e.buttons == 0 && (!e.altKey && !e.shiftKey))) {
                    e.preventDefault();
                    this.destroyedByInvalidCtrlKey = false;
                    window.log((+new Date()), '----------> onContextMouseDown');
                }
            };
            ContextMenu.prototype.onMouseDown = function (e) {
                if (this.bot.isBotInGame()) {
                    //console.log((+new Date()), `Which: ${e.which}; Buttons: ${e.buttons}`, e);
                    // Ensure no other key is being pressed
                    if (e.ctrlKey && e.button == 2 && e.buttons == 2 && (!e.altKey && !e.shiftKey)) {
                        e.preventDefault();
                        window.log((+new Date()), '----------> onMouseDown');
                        this.toggleMenuVisibility();
                    }
                }
            };
            ContextMenu.prototype.onMouseUp = function (e) {
                // window.log((+new Date()), `----------> onMouseUp XXX; this.showFancyMenu = ${this.showFancyMenu}`);
                if (this.showFancyMenu) {
                    //console.log((+new Date()), `Which: ${e.which}; Buttons: ${e.buttons}`, e);
                    this.getElementFromPoint(e);
                    window.log((+new Date()), '----------> onMouseUp');
                    this.setMenuVisibility(false);
                }
            };
            ContextMenu.prototype.onMouseMove = function (e) {
                if (this.showFancyMenu) {
                    this.mouseClientPosition.clientX = e.clientX;
                    this.mouseClientPosition.clientY = e.clientY;
                }
            };
            ContextMenu.prototype.onKeyDown = function (e) {
                if (this.showFancyMenu && (e.ctrlKey && (e.altKey || e.shiftKey))) {
                    this.destroyedByInvalidCtrlKey = true;
                    window.log((+new Date()), '----------> onKeyDown');
                    this.setMenuVisibility(false);
                }
            };
            ContextMenu.prototype.onKeyUp = function (e) {
                if (this.showFancyMenu && (!e.ctrlKey && (!e.altKey && !e.shiftKey))) {
                    //console.log((+new Date()), e);
                    this.destroyedByInvalidCtrlKey = true;
                    window.log((+new Date()), '----------> onKeyUp');
                    this.getElementFromPoint();
                    this.setMenuVisibility(false);
                }
            };
            return ContextMenu;
        }());
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], ContextMenu.prototype, "setMenuVisibility", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], ContextMenu.prototype, "toggleMenuVisibility", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], ContextMenu.prototype, "getElementFromPoint", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], ContextMenu.prototype, "onContextMouseDown", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], ContextMenu.prototype, "onMouseDown", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], ContextMenu.prototype, "onMouseUp", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], ContextMenu.prototype, "onMouseMove", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], ContextMenu.prototype, "onKeyDown", null);
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], ContextMenu.prototype, "onKeyUp", null);
        KartwarsBot.ContextMenu = ContextMenu;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

/// <reference path="_references.ts" />
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
        /**
         * User Interface Helper.
         */
        var UserInterface = (function () {
            // Constructor
            function UserInterface(gameWrapper, contextMenu, canvas, bot) {
                this.gameWrapper = gameWrapper;
                this.contextMenu = contextMenu;
                this.canvas = canvas;
                this.bot = bot;
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
                //
                // Load preferences
                window.logDebugging = true;
                window.visualDebugging = false;
                window.autoRespawn = false;
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
                window.log('Called [onPlayerDeath]');
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
                    var deathTriggeredCheckPlayedTimeIntervalId_1 = window.setInterval(function () {
                        var jTimePlayed = $('#top-time-played span');
                        if (jTimePlayed.is(':visible')) {
                            var formattedTimePlayed = jTimePlayed.text();
                            var timePlayed = (parseInt(formattedTimePlayed.split('m')[0]) * 60) + parseInt(formattedTimePlayed.split('m')[1].split(' ')[1].split('s')[0]);
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
                window.log('Triggered [playButtonClickListener]');
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
             * Calls original kartwars.io onkeyup function + whatever is under it
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
        KartwarsBot.UserInterface = UserInterface;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

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
        var DeveloperInterface = (function () {
            // Constructor
            function DeveloperInterface(gameWrapper, bot, userInterface) {
                this.gameWrapper = gameWrapper;
                this.bot = bot;
                this.userInterface = userInterface;
            }
            DeveloperInterface.prototype.boot = function () {
                // Note! This Will pollute the console.
                //*
                this.bot.watch('stage', function (id, oldValue, newValue) {
                    if (oldValue != newValue) {
                        window.log("Bot Stage: " + KartwarsBot.BotStageEnum[+oldValue] + " -> " + KartwarsBot.BotStageEnum[+newValue]);
                    }
                    return newValue;
                });
                //*/
            };
            DeveloperInterface.prototype.onGameReadyDelegate = function () {
                var _this = this;
                window.mainCar.img.watch('alive', function (id, oldValue, newValue) {
                    if (oldValue != newValue) {
                        window.log('Player Alive:', newValue);
                        _this.bot.onPlayerDeath();
                        _this.bot.Strategy.onPlayerDeath();
                        _this.userInterface.onPlayerDeath();
                        if (window.autoRespawn) {
                            setTimeout(_this.gameWrapper.util.delayedConnect, 5000);
                        }
                    }
                    return newValue;
                });
            };
            return DeveloperInterface;
        }());
        __decorate([
            KartwarsBot.MethodDecoration.bound
        ], DeveloperInterface.prototype, "onGameReadyDelegate", null);
        KartwarsBot.DeveloperInterface = DeveloperInterface;
        var AdsInterface = (function () {
            function AdsInterface() {
                (function (i, s, o, g, r, a, m) {
                    i['GoogleAnalyticsObject'] = r;
                    i[r] = i[r] || function () {
                        (i[r].q = i[r].q || []).push(arguments);
                    }, i[r].l = +(new Date());
                    a = s.createElement(o),
                        m = s.getElementsByTagName(o)[0];
                    a.async = 1;
                    a.src = g;
                    m.parentNode.insertBefore(a, m);
                })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'kga');
                kga('create', 'UA-64079204-4', 'auto');
                kga('send', 'pageview');
            }
            return AdsInterface;
        }());
        KartwarsBot.AdsInterface = AdsInterface;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var DatGuiThemes;
        (function (DatGuiThemes) {
            DatGuiThemes[DatGuiThemes["Default"] = 0] = "Default";
            DatGuiThemes[DatGuiThemes["Lighter"] = 1] = "Lighter";
        })(DatGuiThemes = KartwarsBot.DatGuiThemes || (KartwarsBot.DatGuiThemes = {}));
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
                    gui.remember(window);
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
                        'Über': KartwarsBot.Manager.Collision.Managers.Über,
                    };
                    /* tslint:enable:object-literal-sort-keys */
                    baseControlsOptions.add(this, KartwarsBot.nameof(function () { return _this.selectedTheme; }), datGuiThemesConstrains).name('GUI Theme');
                    baseControlsOptions.add(bot, KartwarsBot.nameof(function () { return bot.isBotEnabled; })).name('Enable Bot');
                    baseControlsOptions.add(bot, KartwarsBot.nameof(function () { return bot.selectedStrategy; }), strategiesConstrains).name('Strategy');
                    baseControlsOptions.add(bot, KartwarsBot.nameof(function () { return bot.selectedCollisionManager; }), collisionManagersConstrains).name('Collision Manager');
                    baseControlsOptions.add(window, KartwarsBot.nameof(function () { return window.autoRespawn; })).name('Auto Respawn');
                    baseControlsOptions.add(userInterface, KartwarsBot.nameof(function () { return userInterface.toggleOverlays; })).name('Toggle Overlays');
                    baseControlsOptions.add(userInterface, KartwarsBot.nameof(function () { return userInterface.resetZoom; })).name('Reset Zoom');
                    baseControlsOptions.add(userInterface, KartwarsBot.nameof(function () { return userInterface.quit; })).name('Quit');
                }
                var forcedatGUIInitialization = bot.Strategy;
            };
            return DatGUI;
        }());
        KartwarsBot.DatGUI = DatGUI;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

/* tslint:disable */
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        /**
         * Experimental Graph.
         */
        var ExternalGraph = (function () {
            function ExternalGraph() {
                //
            }
            ExternalGraph.prototype.createPopup = function () {
                this.popup = window.open("http://scripts.local.com/lib/html/test.htm", "_blank", "location=yes,width=800,height=600,scrollbars=yes,status=yes");
                this.popup.moveTo(50, 50);
                this.popup.resizeTo(window.screen.width - 100, window.screen.height - 100);
            };
            ExternalGraph.prototype.operation = function () {
                if (null != this.popup) {
                    /*
                    let scene = {
                        "edges": [{
                            "id": 1,
                            "block1": 1,
                            "connector1": ["out", "output"],
                            "block2": 2,
                            "connector2": ["in", "input"]
                        }],
                        "blocks": [{
                            "id": 1,
                            "x": -300,
                            "y": 0,
                            "type": "Function",
                            "module": null,
                            "values": {
                                "in": 0,
                                "out": 0
                            }
                        }, {
                            "id": 2,
                            "x": (-300 + 175),
                            "y": 0,
                            "type": "Function",
                            "module": null,
                            "values": {
                                "in": 0,
                                "out": 0
                            }
                        }]
                    };
                    */
                    var scene = {
                        "edges": [],
                        "blocks": []
                    };
                    //blocks.clear();
                    //blocks.load(scene);
                    var stack = window.stack;
                    stack.reverse();
                    stack.pop();
                    stack.pop();
                    for (var stackIdx in stack) {
                        var sf = stack[stackIdx];
                        var stackIdxAsInt = parseInt(stackIdx);
                        //oContent.push(`${stackIdx} => ${sf}`);
                        if (stackIdxAsInt > 0) {
                            scene['edges'].push({
                                "id": stackIdx,
                                "block1": (stackIdxAsInt - 1),
                                "connector1": ["out", "output"],
                                "block2": stackIdxAsInt,
                                "connector2": ["in", "input"]
                            });
                        }
                        scene['blocks'].push({
                            "id": stackIdx,
                            "x": (-900 + 175 * stackIdxAsInt),
                            "y": 0,
                            "type": "Function",
                            "module": null,
                            "values": {
                                "in": sf.functionName,
                                "out": '0'
                            }
                        });
                    }
                    var data = JSON.stringify(scene);
                    this.popup.postMessage(data, "http://scripts.local.com");
                }
            };
            return ExternalGraph;
        }());
        KartwarsBot.ExternalGraph = ExternalGraph;
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));

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
                var datGUI = this.datGUI = new KartwarsBot.DatGUI();
                var gameWrapper = this.gameWrapper = new KartwarsBot.GameWrapper();
                var canvas = this.canvas = new KartwarsBot.CanvasUtils(gameWrapper);
                var bot = this.bot = new KartwarsBot.Bot(gameWrapper, canvas, datGUI);
                var contextMenu = this.contextMenu = new KartwarsBot.ContextMenu();
                var userInterface = this.userInterface = new KartwarsBot.UserInterface(gameWrapper, contextMenu, canvas, bot);
                var developerInterface = this.developerInterface = new KartwarsBot.DeveloperInterface(gameWrapper, bot, userInterface);
                var adsInterface = this.adsInterface = new KartwarsBot.AdsInterface();
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
                    window.log('Call: [gameReadyDelegate]');
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
