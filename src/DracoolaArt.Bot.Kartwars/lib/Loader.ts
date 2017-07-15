/// <reference path="_references.ts" />
/// <reference path="Factory.ts" />

namespace DracoolaArt.KartwarsBot {
	/*
	window.botSettings.LOAD_DEBUG_SCRIPTS = false;
	//*/

	/**
	 * Smart Loader.
	 */
	export class Loader implements IBoot {
		static scripts2Load: Array<string>;

		constructor(protected readonly baseURL: string, protected readonly baseScriptPath: string) {
			window.botSettings.baseURL = baseURL;

			if (!Loader.scripts2Load) {
				if (window.botSettings.LOAD_DEBUG_SCRIPTS) {
					Loader.scripts2Load = [
						//`https://cdnjs.cloudflare.com/ajax/libs/stats.js/r16/Stats.js`,
						`${baseURL}dist/MethodDecorations/bound.js`,
						`${baseURL}bower_components/density-clustering/dist/clustering.min.js`,
						`${baseURL}bower_components/victor/build/victor.min.js`,
						`${baseURL}node_modules/dat.gui/build/dat.gui.js`,
						`${baseURL}dist/lib/FizzyText/FizzyText.js`,
						`${baseURL}dist/lib/kd-tree-javascript/kdTree.js`,
						`${baseScriptPath}Logging.js`,
						`${baseScriptPath}MethodDecorations/intercept.js`,
						`${baseScriptPath}MethodDecorations/registers.js`,
						`${baseScriptPath}MethodDecorations/sealed.js`,
						`${baseScriptPath}MethodDecorations/trace.js`,
						`${baseScriptPath}Polyfills.js`,
						`${baseScriptPath}Enums.js`,
						`${baseScriptPath}Data/CollectedGameData.js`,
						`${baseScriptPath}Structures.js`,
						`${baseScriptPath}Manager/Time/Timer.js`,
						`${baseScriptPath}Manager/Time/TimerFrame.js`,
						`${baseScriptPath}GameWrapper.js`,
						`${baseScriptPath}Utils/Functions.js`,
						`${baseScriptPath}Utils/ArrayUtils.js`,
						`${baseScriptPath}Utils/MathUtils.js`,
						`${baseScriptPath}Utils/GeometryIntersectionsUtils.js`,
						`${baseScriptPath}Utils/CanvasUtilsBase.js`,
						`${baseScriptPath}Utils/CanvasUtils.js`,
						`${baseScriptPath}WebSocket.js`,
						`${baseScriptPath}Tactics/Fight/__.js`,
						`${baseScriptPath}Tactics/Fight/ChaseClosest.js`,
						`${baseScriptPath}Tactics/Fight/ShootWhenInRange.js`,
						`${baseScriptPath}Tactics/Resource/__.js`,
						`${baseScriptPath}Tactics/Resource/FindClosestResourceBase.js`,
						`${baseScriptPath}Tactics/Resource/Food/__.js`,
						`${baseScriptPath}Tactics/Resource/Food/FindClosest.js`,
						`${baseScriptPath}Tactics/Resource/Food/FindClosestClusterOptions.js`,
						`${baseScriptPath}Tactics/Resource/Food/FindClosestCluster.js`,
						`${baseScriptPath}Tactics/Resource/Weapon/__.js`,
						`${baseScriptPath}Tactics/Resource/Weapon/FindClosest.js`,
						`${baseScriptPath}Strategy/Behaviour.js`,
						`${baseScriptPath}Strategy/__.js`,
						`${baseScriptPath}Strategy/BotStrategyBase.js`,
						`${baseScriptPath}Strategy/Default.js`,
						`${baseScriptPath}Strategy/Tests/CalculateTorqueBotStrategy.js`,
						`${baseScriptPath}Strategy/Tests/PursuitBotStrategy.js`,
						`${baseScriptPath}Strategy/Tests/PursuitAndShootBotStrategy.js`,
						`${baseScriptPath}Strategy/Tests/DrawEnemiesBotStrategy.js`,
						`${baseScriptPath}Strategy/Tests/InterconnectFoodBotStrategy.js`,
						`${baseScriptPath}Design/Circle/WarCarDesigns.js`,
						`${baseScriptPath}Design/Circle/WeaponDesigns.js`,
						`${baseScriptPath}Design/Polygon/WarCarDesigns.js`,
						`${baseScriptPath}Manager/Collision/__.js`,
						`${baseScriptPath}Manager/Collision/CollisionBaseManager.js`,
						`${baseScriptPath}Manager/Collision/CollisionCourseManager.js`,
						`${baseScriptPath}Manager/Collision/AdvancedCollisionCourseManager.js`,
						//`${baseScriptPath}Manager/Collision/UberCollisionCourseManager.js`,
						`${baseScriptPath}BotOptions.js`,
						`${baseScriptPath}BotBase.js`,
						`${baseScriptPath}Bot.js`,
						`${baseScriptPath}Utils/Interface/ContextMenu.js`,
						`${baseScriptPath}Utils/ScoreHolster.js`,
						`${baseScriptPath}Utils/Interface/Interface.js`,
						`${baseScriptPath}Utils/Interface/DeveloperInterface.js`,
						`${baseScriptPath}Utils/Interface/DatGUI.js`,
						`${baseScriptPath}Experimental/ExternalGraph.js`,
						`${baseScriptPath}Factory.js`
					];
				} else {
					Loader.scripts2Load = [
						`${baseURL}../../build/kartwars.io-bot.min.js`,
					];
				}
			}
		}

		public boot() {
			let scripts2Load = Loader.scripts2Load;

			let self = this;
			// Experimental
			let loadRequireJs = false;
			let time = (+new Date());

			// READ @ https://www.npmjs.com/package/definitely-typed-requirejs
			function loadScriptEx() {
				let remoteScript = document.createElement('script');
				remoteScript.setAttribute('data-main', `${self.baseScriptPath}RequireConfig.js`);
				remoteScript.src = `${self.baseURL}Scripts/require.js` + '?time=' + (window.GM_info.script.version);

				document.body.appendChild(remoteScript);
			}

			function loadScript(scriptIdx: number) {
				let remoteScript = document.createElement('script');
				remoteScript.src = scripts2Load[scriptIdx] + '?time=' + time;
				remoteScript.onload = function () {
					if (scriptIdx < (scripts2Load.length - 1)) {
						setTimeout(function () {
							loadScript(++scriptIdx);
						}, 0);
					} else {
						setTimeout(function () {
							if (loadRequireJs) {
								loadScriptEx();
							}
							else {
								(window.botFactory = new DracoolaArt.KartwarsBot.BotFactory()).boot();
							}
						}, 0);
					}
				};

				document.body.appendChild(remoteScript);
			}

			loadScript(0);
		}
	}
}
