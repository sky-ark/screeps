
Creep.prototype.runHarvester = function () {
    switch (this.memory.state) {
        case global.STATE_HARVESTING_ENERGY:
            this.stateHarvestEnergy();
            break;
        case global.STATE_LOOTING_ENERGY:
            this.stateLootEnergy();
            break;
        case global.STATE_SEARCHING_ENERGY:
            this.stateSearchingEnergy();
            break;
        case global.STATE_DEPOSITING_ENERGY:
            this.stateDepositEnergy();
            break;
        default:
            this.memory.state = global.STATE_SEARCHING_ENERGY;
            break;
    }
};

Creep.prototype.stateHarvestEnergy = function () {
    const source = Game.getObjectById(this.memory.targetSourceId);
    if (source) {
        this.harvestOrMove(source);

        // Check if storage is full to transition to depositing
        if ( this.store.getFreeCapacity(RESOURCE_ENERGY) === 0 ) {
            delete this.memory.targetSourceId;
            this.memory.state = global.STATE_DEPOSITING_ENERGY;
            this.say('📥');
        }
    } else {
        // If the source is not found or invalid, switch back to finding energy
        delete this.memory.targetSourceId;
        this.memory.state = global.STATE_SEARCHING_ENERGY;
        this.say('🔍');
    }
}

Creep.prototype.stateLootEnergy = function () {
    const source = Game.getObjectById (this.memory.targetSourceId);
    if ( source ) {
        this.harvestOrMove (source);
        if ( this.store.getFreeCapacity (RESOURCE_ENERGY) === 0 ) {
            delete this.memory.targetSourceId;
            this.memory.state = global.STATE_DEPOSITING_ENERGY;
            this.say ('📥');
        }

    } else {
        delete this.memory.targetSourceId;
        const sources = this.room.find (FIND_TOMBSTONES);
        if ( !sources ) {
            this.memory.state = global.STATE_SEARCHING_ENERGY;
        } else {
            this.memory.targetSourceId = sources[0].id;
        }
    }

}

/**
 * This state allow the creep to search a good energy source to harvest or withdraw in the next state
 */
Creep.prototype.stateSearchingEnergy = function () {
    const sources = this.room.find (FIND_SOURCES); // Search for the sources in the room
    if ( sources.length > 0 ) {
        const rndIndex = Math.floor (Math.random () * sources.length);
        this.memory.targetSourceId = sources[rndIndex].id; // Create a target choosing randomly from the sources list
        this.memory.state = global.STATE_HARVESTING_ENERGY;
        this.say ('⛏️');
    }
};

Creep.prototype.stateDepositEnergy = function () {
    const targets = this.room.find (FIND_STRUCTURES,
        {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_TOWER ||
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_EXTENSION) &&
                    structure.store.getFreeCapacity (RESOURCE_ENERGY) > 0;
            }
        });

    if ( targets.length > 0 && this.store.getUsedCapacity (RESOURCE_ENERGY) > 0 ) {
        if ( this.transfer (targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE ) {
            this.moveTo (targets[0], {visualizePathStyle: {stroke: '#ffffff'}})
        }
    } else {
        this.memory.state = global.STATE_HARVESTING_ENERGY;
        this.say ('⛏️');
    }
}