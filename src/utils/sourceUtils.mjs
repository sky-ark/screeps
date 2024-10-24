import { STATES } from '../states/constants.mjs';
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

export let resetCreepStates = function () {
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (name.memory.state === STATES.HARVESTING_ENERGY) {
            name.memory.state = STATES.SEARCHING_ENERGY;
            name.say('🔍');
        }
    }
};