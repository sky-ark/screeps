// src/utils.mjs

import { STATES } from './states/constants.mjs';


export const switchTargetSource = function (creep) {
    const sources = creep.room.find(FIND_SOURCES);
    if (sources.length > 0) {
        sources.sort((a, b) => {
            const aSpots = calculateAvailableSpots(a) - a.pos.findInRange(FIND_MY_CREEPS, 1).length;
            const bSpots = calculateAvailableSpots(b) - b.pos.findInRange(FIND_MY_CREEPS, 1).length;
            return bSpots - aSpots;
        });

        let bestSource = sources[0];
        let bestSpots = calculateAvailableSpots(bestSource) - bestSource.pos.findInRange(FIND_MY_CREEPS, 1).length;

        for (let source of sources) {
            const availableSpots = calculateAvailableSpots(source) - source.pos.findInRange(FIND_MY_CREEPS, 1).length;
            if (availableSpots > bestSpots) {
                bestSource = source;
                bestSpots = availableSpots;
            }
        }

        if (bestSource) {
            creep.memory.targetSourceId = bestSource.id;
            creep.memory.state = STATES.HARVESTING_ENERGY;
            creep.say('⛏️');
        } else {
            creep.say('No available sources!');
        }
    } else {
        creep.say('No sources!');
    }
};

export const calculateAvailableSpots = function (source) {
    const terrain = source.room.getTerrain();
    let availableSpots = 0;

    for (let x = source.pos.x - 1; x <= source.pos.x + 1; x++) {
        for (let y = source.pos.y - 1; y <= source.pos.y + 1; y++) {
            if (x === source.pos.x && y === source.pos.y) continue;
            if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
                availableSpots++;
            }
        }
    }

    return availableSpots;
};
