import "./creeps/runHarvester.mjs";
import "./extensions/creepExtensions.mjs";
import {roleUpgrader} from "./role/upgrader.mjs";
import {roleBuilder} from "./role/builder.mjs";
import {runHarvester} from "./creeps/runHarvester.mjs";
import {runTower} from "./structures/tower.mjs";

module.exports.loop = function () {
    for (const name in Memory.creeps) {
        if ( !Game.creeps[name] ) {
            delete Memory.creeps[name];
            console.log ('Clearing non-existing creep memory:', name);
        }
    }


    const harvesters = _.filter (Game.creeps, (creep) => creep.memory.role === 'harvester');
    const builders = _.filter (Game.creeps, (creep) => creep.memory.role === 'builder');
    const upgraders = _.filter (Game.creeps, (creep) => creep.memory.role === 'upgrader');
    const spawn = Game.spawns['Spawn1'];
    const towers = spawn.room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_TOWER) ;
        }
    });



    if ( spawn.spawning ) {
        var spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text (
            '🛠️' + spawningCreep.memory.role,
            spawn.pos.x + 1,
            spawn.pos.y,
            {align: 'left', opacity: 0.8});
    } else {
        let newName;
        if ( harvesters.length < 8 ) {
            newName = 'Harvester' + Game.time;
            const spawnResult = spawn.spawnCreep ([WORK, CARRY, CARRY, MOVE, MOVE], newName, {
                memory: {
                    role: 'harvester'
                }
            });
            if ( spawnResult === OK ) {
                console.log ('Spawning new harvester: ' + newName);
            }
        } else if ( builders.length < 6 ) {
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

    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if ( creep.memory.role === 'harvester' ) {
            runHarvester (creep);
            //roleHarvester.run (creep);
        }
        if ( creep.memory.role === 'upgrader' ) {
            roleUpgrader.run (creep);
        }
        if ( creep.memory.role === 'builder' ) {
            roleBuilder.run (creep);
        }
    }

    towers.forEach (tower => runTower(tower));


}
