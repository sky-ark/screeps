import {STATES} from "./constants.mjs";

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
    const sources = creep.room.find (FIND_SOURCES); // Search for the sources in the room
    if ( sources.length > 0 ) {
        const rndIndex = Math.floor (Math.random () * sources.length);
        creep.memory.targetSourceId = sources[rndIndex].id; // Create a target choosing randomly from the sources list
        creep.memory.state = STATES.HARVESTING_ENERGY;
        creep.say ('⛏️');
    }
};

export const stateDepositEnergy = function (creep) {
  //  const targets = creep.room.find (FIND_STRUCTURES,
    creep.memory.targets = creep.room.find (FIND_MY_STRUCTURES,
        {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_TOWER ||
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_STORAGE) &&
                    structure.store.getFreeCapacity (RESOURCE_ENERGY) > 0;
            }
        });

    // if ( targets.length > 0 && creep.store.getUsedCapacity (RESOURCE_ENERGY) > 0 ) {
    //     if ( creep.transfer (targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE ) {
    //         creep.moveTo (targets[0], {visualizePathStyle: {stroke: '#ffffff'}})
    //     }
    // } else {
    //     creep.memory.state = STATES.HARVESTING_ENERGY;
    //     creep.say ('⛏️');
    // }
}

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

//Tower
export const stateDefending = function (tower) {
    var hostiles = tower.room.find (FIND_HOSTILE_CREEPS);
    if ( hostiles.length > 0) {
        for (var i = 0; i < hostiles.length; i++) {
            var hostile = hostiles[i];
           // if (hostile.owner.username !== 'Elk') { // delete tower
                tower.attack (hostiles[0]);
            }
        }
    else {
        Memory[tower.id].state = STATES.REPAIRING;
    }
};


//stateRepairing for towers
export const stateRepairingT = function (tower) {
    const structures = tower.room.find (FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.hits !== structure.hitsMax && structure.structureType !== STRUCTURE_CONTROLLER);
        }
    });
    tower.repair(structures[0]);

    if (structures.length === 0) { Memory[tower.id].state = STATES.DEFENDING;}
}




export const stateHealing = function (tower) {
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if ( creep.hits !== creep.hitsMax ) {
            tower.heal (creep);
        } else {
            Memory[tower.id].state = STATES.DEFENDING;
        }
    }

}