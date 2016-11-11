// Should not be required by anything. The lines are meant to be copied to the terminal when needed

// List how much energy is in the storage of each room
Object.keys(Game.empireManager.roomManagers).forEach(roomName => {let storage = Game.empireManager.roomManagers[roomName].energyManager.storage; console.log(roomName, storage ? storage.store.energy : "No storage")})

// List how many items are in the repair queues of the rooms
Object.keys(Game.empireManager.roomManagers).forEach(roomName => console.log(roomName, Game.empireManager.roomManagers[roomName].repairManager.repairQueue.size))

// List abundant resources in rooms
Object.keys(Game.empireManager.roomManagers).map(name => Game.empireManager.roomManagers[name]).forEach(rm => console.log(rm.roomName, JSON.stringify(rm.terminalManager.abundantResources)))

// List how many of each mineral type my owned rooms contain
let minerals = {}; Object.keys(Game.empireManager.roomManagers).forEach(roomName => {let mineral = Game.empireManager.roomManagers[roomName].mineralManager.mineralInRoom; if (!minerals[mineral.mineralType]) minerals[mineral.mineralType] = 0; minerals[mineral.mineralType]++}); console.log(JSON.stringify(minerals, null, " "))
