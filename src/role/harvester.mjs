export const roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.store.getFreeCapacity() > 0) {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.memory.targetSourceId) {
                const source = sources.find(source => source.id === creep.memory.targetSourceId);
                if (creep.harvest(source) === ERR_NOT_IN_RANGE ) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});;
                }
            }
            else {
                const rndIndex = Math.floor(Math.random() * sources.length);
                this.memory.targetSourceId = sources[rndIndex].id; // Create a target choosing randomly from the sources list
            }
        } else {
            delete creep.memory.targetSourceId;
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if ( targets.length > 0 ) {
                if ( creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE ) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleHarvester;