const { Socket } = require("../../../data_structures")

/** @param {Socket} socket  */
function write(socket) {
    socket.writeEmptyPacket(3, "minecraft:finish_configuration")
}

/** @param {Socket} socket  */
function buffer(socket) {
    socket.bufferEmptyPacket(3, "minecraft:finish_configuration")
}

module.exports = {write, buffer}