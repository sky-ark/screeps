Creep.prototype.runUpgrader = function () {
    switch (this.memory.state) {
        case global.STATE_HARVESTING_ENERGY:
            this.stateHarvestEnergy();
            break;
        case global.STATE_LOOTING_ENERGY:
            this.stateLootEnergy();
            break;
        case global.STATE_SEARCHING_ENERGY:
            this.stateSearchingEnergy();
            break;
        case global.STATE_DEPOSITING_ENERGY:
            this.stateDepositEnergy();
            break;
        case global.STATE_ATTACKING_ENERGY:
            this.stateAttackEnergy();
        default:
            this.memory.state = global.STATE_SEARCHING_ENERGY;
            break;
    }
};

Creep.prototype.stateAttackEnergy = function () {
    var hostiles = Game.room.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
        for (var i = 0; i < hostiles.length; i++) {
            var hostile = hostiles[i]
            this.moveTo(hostile);
            this.attack(hostile);
        }

    }
}