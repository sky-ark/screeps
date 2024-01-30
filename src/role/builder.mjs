export const roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }

        if(!creep.memory.building && creep.store.getFreeCapacity() === 0) {
            creep.memory.building = true;
            creep.memory.targetSourceId = null;

            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ff12ff'}});
                }
            }
        }
        else {
            const sources = creep.room.find(FIND_SOURCES);
            if ( creep.memory.targetSourceId ) {
                const source = sources.find(source => source.id === creep.memory.targetSourceId);
                if ( creep.harvest(source) === ERR_NOT_IN_RANGE ) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffcc00'}});
                }
            } else {
                creep.say('Target')
                const rndIndex = Math.floor(Math.random() * sources.length);
                creep.memory.targetSourceId = sources[rndIndex].id;
            }



        }
        }

};