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
