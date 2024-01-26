StructureTower.prototype.runTower = function () {
    if ( Memory[this.id] === undefined ) Memory[this.id] = {};
    switch (Memory[this.id].state) {
        case global.STATE_DEFENDING:

            this.stateDefending ();
            break;
        case global.STATE_REPAIRING:

            this.stateRepairing ();
            break;
        case global.STATE_HEALING:

            this.stateHealing ();
            break;
        default:
            Memory[this.id].state = global.STATE_DEFENDING;
            break;

    }
};

StructureTower.prototype.stateDefending = function () {
    var hostiles = this.room.find (FIND_HOSTILE_CREEPS);
    if ( hostiles.length > 0) {
        for (var i = 0; i < hostiles.length; i++) {
            var hostile = hostiles[i];
            if (hostile.owner.username !== 'Elk') { // delete this
                this.attack (hostiles[0]);
            }
        }
    } else {
        Memory[this.id].state = global.STATE_REPAIRING;
    }
};

StructureTower.prototype.stateRepairing = function () {
    const structures = this.room.find (FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.hits !== structure.hitsMax && structure.structureType !== STRUCTURE_CONTROLLER);
        }
    });
    this.repair(structures[0]);

    if (structures.length === 0) { Memory[this.id].state = global.STATE_DEFENDING;}
}

StructureTower.prototype.stateHealing = function () {
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if ( creep.hits !== creep.hitsMax ) {
            this.heal (creep);
        } else {
            Memory[this.id].state = global.STATE_DEFENDING;
        }
    }

}