const { Socket } = require("../data_structures")

/** @param {Socket} socket  */
function LogPlayerPos(socket) {
    socket.log(`Player Pos:\n   X: ${socket.playerPos.x}\n   Y: ${socket.playerPos.y}\n   Z: ${socket.playerPos.z}\n   Pitch: ${socket.playerPos.pitch}\n   Yaw: ${socket.playerPos.yaw}\n   On Ground: ${socket.playerPos.on_ground.toString()}\n   Against Wall: ${socket.playerPos.against_wall.toString()}`)
}

function DebugByteArrayNumbers(data) {
    var message = ""
    for (var i = 0; i < data.length; i++) {
        message += Number(data[i]).toString() + " "
    }
    return message
}

function DebugByteArrayString(data) {
    return Buffer.from(new Uint8Array(data)).toString()
}

module.exports = {LogPlayerPos, DebugByteArrayString, DebugByteArrayNumbers}