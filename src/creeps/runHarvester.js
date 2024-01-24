Creep.prototype.runHarvester = function() {
    switch(this.memory.state) {
        case global.STATE_HARVESTING_ENERGY:
            this.stateHarvestEnergy();
            break;
        case global.STATE_LOOTING_ENERGY:
            this.stateLootEnergy();
            break;
        case global.STATE_SEARCHING_ENERGY:
            this.stateSearchEnergy();
            break;
        case global.STATE_DEPOSITING_ENERGY:
            this.stateDepositEnergy();
            break;
        default:
            this.memory.state = global.STATE_SEARCHING_ENERGY;
            break;
    }
};

Creep.prototype.stateHarvestEnergy = function() {
    const source = Game.getObjectById(this.memory.targetSourceId);
    if (source) {
        this.harvestOrMove(source);

        // Check if storage is full to transition to depositing
        if (this.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            this.memory.state = global.STATE_DEPOSITING_ENERGY;
            this.say('📥');
        }
    } else {
        // If the source is not found or invalid, switch back to finding energy
        this.memory.targetSourceId = null;
        this.memory.state = global.STATE_SEARCHING_ENERGY;
        this.say('🔍');
    }
};

/**
 * Harvest resources from a target and move towards it if necessary.
 * @param {Source} source - The energy source to harvest from.
 * @returns {number} The result code of the harvestOrMove action.
 */
Creep.prototype.harvestOrMove = function(source) {
    const harvestResult = this.harvest(source);

    if (harvestResult === ERR_NOT_IN_RANGE) {
        return this.moveTo(source, { visualizePathStyle: { stroke: '#00ffff' } });
    }

    return harvestResult;
};

global.STATE_HARVESTING_ENERGY = 'harvesting_energy';
global.STATE_DEPOSITING_ENERGY = 'depositing_energy';
global.STATE_SEARCHING_ENERGY = 'searching_energy';
global.STATE_LOOTING_ENERGY = 'looting_energy';
global.STATE_UPGRADING_CONTROLLER = 'upgrading_controller';
global.STATE_WITHDRAWING_ENERGY = 'withdrawing_energy';
