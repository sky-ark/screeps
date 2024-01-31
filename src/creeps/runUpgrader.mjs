import {STATES} from "../states/constants.mjs";
import {
    stateAttackEnergy,
    stateDepositEnergy,
    stateHarvestEnergy,
    stateLootEnergy,
    stateSearchingEnergy
} from "../states/workingStates.mjs";

export const runUpgrader = function (creep) {
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
            break;
        case STATES.SEARCHING_ENERGY:
            stateSearchingEnergy(creep);
            break;
        case STATES.DEPOSITING_ENERGY:
            stateDepositEnergy(creep);
            break;
        case STATES.ATTACKING_ENERGY:
            stateAttackEnergy(creep);
            break;
        default:
            creep.memory.state = STATES.SEARCHING_ENERGY;
            break;
    }
};