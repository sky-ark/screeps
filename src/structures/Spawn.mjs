const spawn = Game.spawns['Spawn1'];
let canSpawnCreep = true;

if (spawn) {
    const energyStored = spawn.store[RESOURCE_ENERGY];

    if (energyStored !== undefined) {
        canSpawnCreep = energyStored >= 300;
    }
    else {console.log("Can't find the Core");
    }
}