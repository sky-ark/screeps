var spawn = Game.spawns['Spawn1'];
var canSpawnCreep = true;

if (spawn) {
    var energyStored = spawn.store[RESOURCE_ENERGY];

    if (energyStored !== undefined) {
        if (energyStored >= 300){canSpawnCreep = true;}
        else {canSpawnCreep = false;}
    }
    else {console.log("Can't find the Core");
    }
}