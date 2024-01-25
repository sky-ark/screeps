/** var towers = Game.Room.find(
    FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    var hostiles = Room.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
        for (var i = 0; i < hostiles.length; i++){
            var hostile = hostiles[i];
            towers.forEach(tower => tower.attack(hostiles[0]));
        }
    }
**/