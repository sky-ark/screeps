import {
    stateDepositEnergy,
    stateHarvestEnergy,
    stateLootEnergy,
    stateSearchingEnergy
} from "../states/workingStates.mjs";
import { STATES } from "../states/constants.mjs";

export const runHarvester = function (creep) {
    switch (creep.memory.state) {
        case STATES.HARVESTING_ENERGY:
            stateHarvestEnergy(creep);
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                delete creep.memory.targetSourceId;
                creep.memory.state = STATES.DEPOSITING_ENERGY;
                creep.say('📥');
            }
            break;
        case STATES.LOOTING_ENERGY:
            stateLootEnergy(creep);
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                delete creep.memory.targetSourceId;
                creep.memory.state = STATES.DEPOSITING_ENERGY;
                creep.say('📥');
            }
            break;
        case STATES.SEARCHING_ENERGY:
            stateSearchingEnergy(creep);
            break;
        case STATES.DEPOSITING_ENERGY:
            stateDepositEnergy(creep);
            if (creep.memory.targets && creep.memory.targets.length > 0 && creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
                const target = Game.getObjectById(creep.memory.targets[0]);
                if (target && creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                creep.memory.state = STATES.HARVESTING_ENERGY;
                creep.say('⛏️');
            }
            break;
        default:
            creep.memory.state = STATES.SEARCHING_ENERGY;
            break;
    }
};