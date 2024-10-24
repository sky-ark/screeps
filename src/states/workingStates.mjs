import {STATES} from "./constants.mjs";
import { calculateAvailableSpots } from "../utils/sourceUtils.mjs";


export const stateWithdrawEnergy = function (creep) {
    const containers = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0
    });

    if (containers.length > 0) {
        const target = creep.pos.findClosestByPath(containers);
        if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    } else {
        // Wait for harvesters to refill resources
        creep.memory.state = STATES.HARVESTING_ENERGY;
        creep.say('⛏️');
        creep.say('⏳ waiting');
    }
};
export const stateHarvestEnergy = function (creep) {
    const source = Game.getObjectById(creep.memory.targetSourceId);
    if (source) {
        creep.harvestOrMove(source);

        // Check if storage is full to transition to depositing
        // if ( creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0 ) {
        //     delete creep.memory.targetSourceId;
        //     creep.memory.state = STATES.DEPOSITING_ENERGY;
        //     creep.say('📥');
        // }
    } else {
        // If the source is not found or invalid, switch back to finding energy
        delete creep.memory.targetSourceId;
        creep.memory.state = STATES.SEARCHING_ENERGY;
        creep.say('🔍');
    }
}

export const stateLootEnergy = function (creep) {
    const source = Game.getObjectById (creep.memory.targetSourceId);
    if ( source ) {
        // creep.harvestOrMove (source);
        // if ( creep.store.getFreeCapacity (RESOURCE_ENERGY) === 0 ) {
        //     delete creep.memory.targetSourceId;
        //     creep.memory.state = STATES.DEPOSITING_ENERGY;
        //     creep.say ('📥');
        // }

    } else {
        delete creep.memory.targetSourceId;
        const sources = creep.room.find (FIND_TOMBSTONES);
        if ( !sources ) {
            creep.memory.state = STATES.SEARCHING_ENERGY;
        } else {
            creep.memory.targetSourceId = sources[0].id;
        }
    }

}

/**
 * creep state allow the creep to search a good energy source to harvest or withdraw in the next state
 */



export const stateSearchingEnergy = function (creep) {
    const sources = creep.room.find(FIND_SOURCES);

    for (const source of sources) {
        const availableSpots = calculateAvailableSpots(source);

        if (availableSpots > 0) {
            if (creep.memory.role === 'harvester') {
                // Harvesters always go to the first available source
                creep.memory.targetSourceId = source.id;
                creep.memory.state = STATES.HARVESTING_ENERGY;
                creep.say('⛏️');
                return;
            } else {
                // Non-harvesters go to the second source if it exists
                if (sources.length > 1 && availableSpots > 1) {
                    creep.memory.targetSourceId = sources[1].id;
                    creep.memory.state = STATES.HARVESTING_ENERGY;
                    creep.say('⛏️');
                    return;
                } else {
                    creep.memory.targetSourceId = source.id;
                    creep.memory.state = STATES.HARVESTING_ENERGY;
                    creep.say('⛏️');
                    return;
                }
            }
        }
    }

    // If no sources are available, fallback to the first source
    if (sources.length > 0) {
        creep.memory.targetSourceId = sources[0].id;
        creep.memory.state = STATES.HARVESTING_ENERGY;
        creep.say('⛏️');
    }
};


export const stateDepositEnergy = function (creep) {
    // Check for adjacent upgraders or builders
    const adjacentCreeps = creep.pos.findInRange(FIND_MY_CREEPS, 1, {
        filter: (c) => c.memory.role === 'upgrader' || c.memory.role === 'builder'
    });

    if (adjacentCreeps.length > 0) {
        const targetCreep = adjacentCreeps[0];
        if (creep.transfer(targetCreep, RESOURCE_ENERGY) === OK) {
            return;
        }
    }

    // If no adjacent upgraders or builders, find the closest structure
    const target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_TOWER ||
                    structure.structureType === STRUCTURE_SPAWN ||
                    structure.structureType === STRUCTURE_EXTENSION ||
                    structure.structureType === STRUCTURE_STORAGE) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });

    if (target && creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    } else {
        creep.memory.state = STATES.HARVESTING_ENERGY;
        creep.say('⛏️');
    }
};
export const stateAttackEnergy = function (creep) {
    const hostiles = Game.room.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
        for (var i = 0; i < hostiles.length; i++) {
            var hostile = hostiles[i]
            creep.moveTo(hostile);
            creep.attack(hostile);
        }

    }
}

export const stateRepairing = function (creep) {
    creep.memory.structures = creep.room.find (FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.hits !== structure.hitsMax && structure.structureType !== STRUCTURE_CONTROLLER);
        }
    });
    creep.repair(creep.memory.structures[0]); }
export const stateBuilding = function (creep) {
    creep.memory.constSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
    if(creep.memory.constSites.length) {
        if(creep.build(creep.memory.constSites[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.memory.constSites[0], {visualizePathStyle: {stroke: '#ff12ff'}});
        }
    }
}

export const stateUpgradingController = function (creep) {
   if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
       creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
   }
}

//Tower
export const stateDefending = function (tower) {
    Memory[tower.id].hostiles = tower.room.find (FIND_HOSTILE_CREEPS);
    if ( Memory[tower.id].hostiles.length > 0) {
        for (var i = 0; i < Memory[tower.id].hostiles.length; i++) {
            Memory[tower.id].hostile = Memory[tower.id].hostiles[i];
           // if (hostile.owner.username !== 'Elk') { // delete tower
                tower.attack (Memory[tower.id].hostiles[0]);
            }
        }

};


//stateRepairing for towers
export const stateRepairingT = function (tower) {
    Memory[tower.id].structures = tower.room.find (FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.hits !== structure.hitsMax && structure.structureType !== STRUCTURE_CONTROLLER);
        }
    });
    tower.repair(Memory[tower.id].structures[0]);

}




export const stateHealing = function (tower) {
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if ( creep.hits !== creep.hitsMax ) {
            tower.heal (creep);
        } else {
            Memory[tower.id].state = STATES.DEFENDING;
        }
    }

}

