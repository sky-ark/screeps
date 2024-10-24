document.addEventListener('DOMContentLoaded', () => {
    const creepsListContainer = document.getElementById('creepsList');
    const towersListContainer = document.getElementById('towersList');

    function displayCreeps(creeps) {
        creepsListContainer.innerHTML = "";
        creeps.forEach(creep => {
            const creepElement = document.createElement('div');
            creepElement.classList.add('creep');
            creepElement.innerHTML = `
                <strong>${creep.name}</strong> - Role: ${creep.memory.role}<br>
                State: ${creep.memory.state}<br>
                Energy: ${creep.store.getUsedCapacity(RESOURCE_ENERGY)} / ${creep.store.getCapacity(RESOURCE_ENERGY)}
            `;
            creepsListContainer.appendChild(creepElement);
        });
    }

    function displayTowers(towers) {
        towersListContainer.innerHTML = "";
        towers.forEach(tower => {
            const towerElement = document.createElement('div');
            towerElement.classList.add('tower');
            towerElement.innerHTML = `
                <strong>${tower.id}</strong><br>
                Energy: ${tower.store.getUsedCapacity(RESOURCE_ENERGY)} / ${tower.store.getCapacity(RESOURCE_ENERGY)}
            `;
            towersListContainer.appendChild(towerElement);
        });
    }

    fetch('/api/creeps')
        .then(response => response.json())
        .then(data => displayCreeps(data));

    fetch('/api/towers')
        .then(response => response.json())
        .then(data => displayTowers(data));
});
