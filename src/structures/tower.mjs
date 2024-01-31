import {STATES} from "../states/constants.mjs";
import {stateDefending, stateHealing, stateRepairing, stateRepairingT} from "../states/workingStates.mjs";

export const runTower = function (tower) {
    if ( Memory[tower.id] === undefined ) Memory[tower.id] = {};
    switch (Memory[tower.id].state) {
        case STATES.DEFENDING:

            stateDefending(tower);
            if (Memory[tower.id].hostiles === 0)  {
            Memory[tower.id].state = STATES.REPAIRING;
        }
            break;
        case STATES.REPAIRING:

            stateRepairingT(tower);
            if (Memory[tower.id].structures.length === 0) {
                Memory[tower.id].state = STATES.DEFENDING;
            }

            break;
        case STATES.HEALING:

            stateHealing(tower);
            break;
        default:
            Memory[tower.id].state = STATES.DEFENDING;
            break;

    }
};

