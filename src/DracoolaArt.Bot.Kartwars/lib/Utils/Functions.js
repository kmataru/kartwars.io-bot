var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var varExtractor1 = new RegExp("(.*)");
        var varExtractor2 = new RegExp("([^.]*)[;]?}");
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
