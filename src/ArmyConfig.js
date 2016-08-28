"use strict";

module.exports = {
	E33N13: {
		isWar: false,
		useStoredEnergy: false,
		targetRoom: {
			name: "E38N14",
			entryX: 1,
			entryY: 23,
			protectX: 15,
			protectY: 27
		},
		breachpoints: [],
		allies: [],
		wantedCreeps: {
			attacker: {
				amount: 3,
				body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK]
			},
			healer: {
				amount: 2,
				body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
			}
		}
	},
	E7S35: {
		isWar: false,
		useStoredEnergy: false,
		targetRoom: {
			name: "E4S37",
			entryX: 45,
			entryY: 32,
			protectX: 32,
			protectY: 47
		},
		breachpoints: [],
		allies: [],
		wantedCreeps: {
			attacker: {
				amount: 2,
				body: [MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK]
			},
			healer: {
				amount: 1,
				body: [MOVE, MOVE, HEAL]
			}
		}
	}
};
