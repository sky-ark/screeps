const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const utils = require('utils');

const defaultBody = [WORK, CARRY, MOVE];
const roles = ["harvester", "harvester", "builder", "upgrader"];
let currentRoleIndex = 0;

module.exports.loop = function () {

    const roomName = 'Spawn1';
    const availableEnergy = Game.spawns[roomName].room.energyAvailable;
    const energyCost = utils.calculateCreepCost(defaultBody);
    if (availableEnergy >= energyCost) {
        const role = roles[currentRoleIndex];
        const newName = role + Game.time; // Crée un nom unique
        console.log(`Spawning new ${role}: ${newName}`);
        Game.spawns['Spawn1'].spawnCreep(defaultBody, newName,
            {memory: {role: role}});
        currentRoleIndex++;
        if (currentRoleIndex > roles.length) currentRoleIndex = 0;
    }

    // // Auto spawn
    // const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    // console.log(`Currently ${HARVESTER_COUNT} harvesters`);
    // if(harvesters.length < HARVESTER_COUNT) {
    //     const newName = 'Harvester' + Game.time; // Crée un nom unique
    //     console.log('Spawning new harvester: ' + newName);
    //     Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
    //         {memory: {role: 'harvester'}});
    // }

    // Role attribution
    for(const name in Game.creeps) {
        const creep = Game.creeps[name];
        if(creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
    }
}