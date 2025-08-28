const { Socket } = require("../data_structures")

/** @param {Socket} socket  */
function LogPlayerPos(socket) {
    socket.log(`Player Pos:\n   X: ${socket.playerPos.x}\n   Y: ${socket.playerPos.y}\n   Z: ${socket.playerPos.z}\n   Pitch: ${socket.playerPos.pitch}\n   Yaw: ${socket.playerPos.yaw}\n   On Ground: ${socket.playerPos.on_ground.toString()}\n   Against Wall: ${socket.playerPos.against_wall.toString()}`)
}

module.exports = {LogPlayerPos}