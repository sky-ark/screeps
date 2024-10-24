/**
 * Harvest resources from a target and move towards it if necessary.
 * @param {Source} source - The energy source to harvest from.
 * @returns {number} The result code of the harvestOrMove action.
 */
Creep.prototype.harvestOrMove = function (source) {
    const harvestResult = this.harvest(source);

    if ( harvestResult === ERR_NOT_IN_RANGE ) {
        return this.moveTo(source, {visualizePathStyle: {stroke: '#00ffff'}});
    }

    return harvestResult;
};

