var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Structures;
        (function (Structures) {
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
            Structures.CarWeaponData = CarWeaponData;
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
            Structures.Point2D = Point2D;
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
            Structures.BotPoint2D = BotPoint2D;
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
            Structures.Bot2Point2D = Bot2Point2D;
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
            Structures.CollisionElement = CollisionElement;
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
            Structures.CollisionAngle = CollisionAngle;
            var CollisionDataRespons = (function () {
                function CollisionDataRespons(collisionElements, collisionAngles) {
                    this.collisionElements = collisionElements;
                    this.collisionAngles = collisionAngles;
                }
                return CollisionDataRespons;
            }());
            Structures.CollisionDataRespons = CollisionDataRespons;
            var FoodAngle = (function (_super) {
                __extends(FoodAngle, _super);
                function FoodAngle() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return FoodAngle;
            }(Point2D));
            Structures.FoodAngle = FoodAngle;
            var OpenAngle = (function () {
                function OpenAngle() {
                }
                return OpenAngle;
            }());
            Structures.OpenAngle = OpenAngle;
            var Bounds = (function () {
                function Bounds(width, height) {
                    this.width = width;
                    this.height = height;
                }
                return Bounds;
            }());
            Structures.Bounds = Bounds;
            var Line = (function () {
                // Constructor for vector type
                function Line(point1, point2) {
                    this.point1 = point1;
                    this.point2 = point2;
                }
                return Line;
            }());
            Structures.Line = Line;
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
            Structures.Rect = Rect;
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
            Structures.Polygon = Polygon;
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
            Structures.Circle = Circle;
            var Cluster = (function (_super) {
                __extends(Cluster, _super);
                // Constructor for circle type
                function Cluster(circle, data) {
                    var _this = _super.call(this, circle.x, circle.y, circle.radius) || this;
                    _this.elements = [];
                    if (undefined != data) {
                        var $this_1 = _this;
                        data.forEach(function (element) {
                            element.distanceToCenterOfCluster = KartwarsBot.Utils.MathUtils.getDistance($this_1, element);
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
            Structures.Cluster = Cluster;
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
            Structures.ClusterWrapper = ClusterWrapper;
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
            Structures.ShapesIntersectionsResult = ShapesIntersectionsResult;
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
            Structures.ActivityResult = ActivityResult;
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
            Structures.GoalData = GoalData;
            var Score = (function () {
                function Score(playTime, top3Time, hexagons, kills, score, maxStreak) {
                    this.playTime = playTime;
                    this.top3Time = top3Time;
                    this.hexagons = hexagons;
                    this.kills = kills;
                    this.score = score;
                    this.maxStreak = maxStreak;
                }
                return Score;
            }());
            Structures.Score = Score;
        })(Structures = KartwarsBot.Structures || (KartwarsBot.Structures = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
