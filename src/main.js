const roleHarvester = require('src/role/harvester');
const roleUpgrader = require('src/role/upgrader');
const roleBuilder = require('src/role/builder');

const defaultBody = [WORK, CARRY, MOVE];
const roles = ["harvester", "harvester", "builder", "upgrader"];
let currentRoleIndex = 0;

module.exports.loop = function () {

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