// Should not be required by anything. The lines are meant to be copied to the terminal when needed

// List how much energy is in the storage of each room
Object.keys(Game.empireManager.roomManagers).forEach(roomName => {let storage = Game.empireManager.roomManagers[roomName].energyManager.storage; console.log(roomName, storage ? storage.store.energy : "No storage")})

// List how many items are in the repair queues of the rooms
Object.keys(Game.empireManager.roomManagers).forEach(roomName => console.log(roomName, Game.empireManager.roomManagers[roomName].repairManager.repairQueue.size))
