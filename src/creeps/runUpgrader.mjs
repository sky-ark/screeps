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