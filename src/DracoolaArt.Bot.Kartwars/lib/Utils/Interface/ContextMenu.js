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
        var Utils;
        (function (Utils) {
            var Interface;
            (function (Interface) {
                var ContextMenuActions;
                (function (ContextMenuActions) {
                    ContextMenuActions[ContextMenuActions["First"] = 0] = "First";
                    ContextMenuActions[ContextMenuActions["Default"] = 0] = "Default";
                    ContextMenuActions[ContextMenuActions["Torque"] = 1] = "Torque";
                    ContextMenuActions[ContextMenuActions["Pursuit"] = 2] = "Pursuit";
                    ContextMenuActions[ContextMenuActions["Enemies"] = 3] = "Enemies";
                    ContextMenuActions[ContextMenuActions["Food"] = 4] = "Food";
                    ContextMenuActions[ContextMenuActions["Last"] = 4] = "Last";
                })(ContextMenuActions = Interface.ContextMenuActions || (Interface.ContextMenuActions = {}));
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
                            if (window.botFactory.developerInterface.opt.individual.experimentalContextMenu) {
                                window.log((+new Date()), '----------> onContextMouseDown');
                            }
                            //console.log('onContextMouseDown');
                            //console.log(`destroyedByCtrlKeyRelease = ${destroyedByCtrlKeyRelease}`);
                        }
                    };
                    ContextMenu.prototype.onMouseDown = function (e) {
                        if (this.bot.isBotInGame()) {
                            //console.log((+new Date()), `Which: ${e.which}; Buttons: ${e.buttons}`, e);
                            // Ensure no other key is being pressed
                            if (e.ctrlKey && e.button == 2 && e.buttons == 2 && (!e.altKey && !e.shiftKey)) {
                                e.preventDefault();
                                if (window.botFactory.developerInterface.opt.individual.experimentalContextMenu) {
                                    window.log((+new Date()), '----------> onMouseDown');
                                }
                                this.toggleMenuVisibility();
                            }
                        }
                    };
                    ContextMenu.prototype.onMouseUp = function (e) {
                        // window.log((+new Date()), `----------> onMouseUp XXX; this.showFancyMenu = ${this.showFancyMenu}`);
                        if (this.showFancyMenu) {
                            //console.log((+new Date()), `Which: ${e.which}; Buttons: ${e.buttons}`, e);
                            this.getElementFromPoint(e);
                            if (window.botFactory.developerInterface.opt.individual.experimentalContextMenu) {
                                window.log((+new Date()), '----------> onMouseUp');
                            }
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
                            if (window.botFactory.developerInterface.opt.individual.experimentalContextMenu) {
                                window.log((+new Date()), '----------> onKeyDown');
                            }
                            this.setMenuVisibility(false);
                        }
                    };
                    ContextMenu.prototype.onKeyUp = function (e) {
                        if (this.showFancyMenu && (!e.ctrlKey && (!e.altKey && !e.shiftKey))) {
                            //console.log((+new Date()), e);
                            this.destroyedByInvalidCtrlKey = true;
                            if (window.botFactory.developerInterface.opt.individual.experimentalContextMenu) {
                                window.log((+new Date()), '----------> onKeyUp');
                            }
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
                Interface.ContextMenu = ContextMenu;
            })(Interface = Utils.Interface || (Utils.Interface = {}));
        })(Utils = KartwarsBot.Utils || (KartwarsBot.Utils = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
