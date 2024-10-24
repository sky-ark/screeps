const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/api/creeps', (req, res) => {
    const creeps = [
        { name: 'Harvester1', memory: { role: 'harvester', state: 'harvesting_energy' }, store: { getUsedCapacity: () => 50, getCapacity: () => 100 } },
        { name: 'Builder1', memory: { role: 'builder', state: 'building' }, store: { getUsedCapacity: () => 30, getCapacity: () => 100 } },
        { name: 'Upgrader1', memory: { role: 'upgrader', state: 'upgrading_controller' }, store: { getUsedCapacity: () => 70, getCapacity: () => 100 } }
    ];
    res.json(creeps);
});

app.get('/api/towers', (req, res) => {
    const towers = [
        { id: 'Tower1', store: { getUsedCapacity: () => 1000, getCapacity: () => 2000 } },
        { id: 'Tower2', store: { getUsedCapacity: () => 1500, getCapacity: () => 2000 } }
    ];
    res.json(towers);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
