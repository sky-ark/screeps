import {STATES} from "../states/constants.mjs";
import {
    stateAttackEnergy,
    stateDepositEnergy,
    stateHarvestEnergy,
    stateLootEnergy,
    stateSearchingEnergy, stateUpgradingController
} from "../states/workingStates.mjs";

export const runUpgrader = function (creep) {
    switch (creep.memory.state) {
        case STATES.HARVESTING_ENERGY:
            stateHarvestEnergy(creep);
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                delete creep.memory.targetSourceId;
                creep.memory.state = STATES.UPGRADING_CONTROLLER;
                creep.say('📥');
            }
            break;
        case STATES.LOOTING_ENERGY:
            stateLootEnergy(creep);
            break;
        case STATES.SEARCHING_ENERGY:
            stateSearchingEnergy(creep);
            break;
        case STATES.UPGRADING_CONTROLLER:
            stateUpgradingController(creep);
            if(creep.store[RESOURCE_ENERGY] === 0) {
                creep.memory.state = STATES.SEARCHING_ENERGY;
            }
            break;
        case STATES.ATTACKING_ENERGY:
            stateAttackEnergy(creep);
            break;
        default:
            creep.memory.state = STATES.SEARCHING_ENERGY;
            break;
    }
};