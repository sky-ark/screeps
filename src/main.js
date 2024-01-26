require ('creeps.runHarvester');
require ('creeps.runUpgrader');
require ('extensions.creepExtensions');
require ('states.constants');
require ('structures.Defend');
require ('structures.tower');
//var roleHarvester = require ('role.harvester');

var roleUpgrader = require ('role.upgrader');
var roleBuilder = require ('role.builder');

module.exports.loop = function () {
    for (var name in Memory.creeps) {
        if ( !Game.creeps[name] ) {
            delete Memory.creeps[name];
            console.log ('Clearing non-existing creep memory:', name);
        }
    }


    const harvesters = _.filter (Game.creeps, (creep) => creep.memory.role === 'harvester');
    const builders = _.filter (Game.creeps, (creep) => creep.memory.role === 'builder');
    const upgraders = _.filter (Game.creeps, (creep) => creep.memory.role === 'upgrader');
    const spawn = Game.spawns['Spawn1'];
    const towers = spawn.room.find (FIND_MY_STRUCTURES, {filter: {structureTYPE: STRUCTURE_TOWER}});

    if ( spawn.spawning ) {
        var spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text (
            '🛠️' + spawningCreep.memory.role,
            spawn.pos.x + 1,
            spawn.pos.y,
            {align: 'left', opacity: 0.8});
    } else {
        let newName;
        if ( harvesters.length < 6 ) {
            newName = 'Harvester' + Game.time;
            const spawnResult = spawn.spawnCreep ([WORK, CARRY, CARRY, MOVE, MOVE], newName, {
                memory: {
                    role: 'harvester'
                }
            });
            if ( spawnResult === OK ) {
                console.log ('Spawning new harvester: ' + newName);
            }
        } else if ( builders.length < 5 ) {
            newName = 'Builder' + Game.time;
            const spawnResult = spawn.spawnCreep ([WORK, WORK, CARRY, MOVE], newName, {
                memory: {
                    role: 'builder'
                }
            });
            if ( spawnResult === OK ) {
                console.log ('Spawning new builder: ' + newName);
            }
        } else if ( upgraders.length < 8 ) {
            newName = 'Upgrader' + Game.time;
            const spawnResult = spawn.spawnCreep ([WORK, WORK, CARRY, MOVE], newName, {
                memory: {
                    role: 'upgrader'
                }
            });
            if ( spawnResult === OK ) {
                console.log ('Spawning new upgrader: ' + newName);
            }
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if ( creep.memory.role === 'harvester' ) {
            creep.runHarvester (creep);
            //roleHarvester.run (creep);
        }
        if ( creep.memory.role === 'upgrader' ) {
            roleUpgrader.run (creep);
        }
        if ( creep.memory.role === 'builder' ) {
            roleBuilder.run (creep);
        }
    }

    towers.forEach (tower => tower.runTower ());


}
