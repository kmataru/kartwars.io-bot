/// <reference path="../_references.ts" />

namespace DracoolaArt.KartwarsBot.Utils {
	export class ScoreHolster {
		public scores: Array<Structures.Score> = [];

		public addScore(playTime: string, top3Time: string, hexagons: string, kills: string, score: string, maxStreak: string) {
			let thisScore = new Structures.Score(
				playTime,
				top3Time,
				parseInt(hexagons),
				parseInt(kills),
				parseInt(score),
				parseInt(maxStreak)
			);

			this.scores.push(thisScore);

			return this.scores;
		}

		public printResults() {
			let scoreMapper = function (thisScore) {
				return {
					'Play Time': thisScore.playTime,
					'Top 3 Time': thisScore.top3Time,
					'Hexagons': thisScore.hexagons,
					'Kills': thisScore.kills,
					'Score': thisScore.score,
					'Max Streak': thisScore.maxStreak
				}
			};

			let bestScore = this.scores.reduce(function (prev: Structures.Score, current: Structures.Score) {
				return (prev.score > current.score) ? prev : current;
			});

			let bestScoreTable = [bestScore];

			let table = this.scores.map(function (thisScore) {
				return {
					'Play Time': thisScore.playTime,
					'Top 3 Time': thisScore.top3Time,
					'Hexagons': thisScore.hexagons,
					'Kills': thisScore.kills,
					'Score': thisScore.score,
					'Max Streak': thisScore.maxStreak
				}
			}); //.filter(function (h) { return h.Value !== undefined; });

			console.group("Scores");
			console.table(bestScoreTable);
			console.table(table);
			console.groupEnd();
		}
	}
}
