import {
    stateBuilding,
    stateHarvestEnergy,
    stateRepairing,
    stateSearchingEnergy,
    stateWithdrawEnergy
} from "../states/workingStates.mjs";
import {STATES} from "../states/constants.mjs";

export const runBuilder = function (creep) {
    switch (creep.memory.state) {
        case STATES.SEARCHING_ENERGY:
            stateSearchingEnergy(creep);
            break;
        case STATES.WITHDRAWING_ENERGY:
            stateWithdrawEnergy(creep);
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                delete creep.memory.targetSourceId;
                creep.memory.state = STATES.BUILDING;
                creep.say('REP');
            }
            break;
        case STATES.HARVESTING_ENERGY:
            stateHarvestEnergy(creep);
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                delete creep.memory.targetSourceId;
                creep.memory.state = STATES.BUILDING;
                creep.say('REP');
            }
            break;
        case STATES.REPAIRING:
            stateRepairing(creep);
            if (creep.memory.structures.length === 0) {
                creep.memory.state = STATES.WITHDRAWING_ENERGY;
                creep.say ('🔍');

            }
            break;
        case STATES.BUILDING:
            stateBuilding(creep);
            if(creep.memory.constSites.length === 0) {
                creep.memory.state = STATES.WITHDRAWING_ENERGY;
                creep.say ('🔍');
            }
            if(creep.store[RESOURCE_ENERGY] === 0) {
                creep.memory.state = STATES.WITHDRAWING_ENERGY;
                creep.say ('🔍');
            }
            break;
        default:
            creep.memory.state = STATES.WITHDRAWING_ENERGY;
            break;

    }

}