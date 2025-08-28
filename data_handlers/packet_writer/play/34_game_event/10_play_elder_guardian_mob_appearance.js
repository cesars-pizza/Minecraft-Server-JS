const { Socket } = require("../../../../data_structures")
const writer = require("../../../data_writer")

/** @param {Socket} socket  */
function write(socket) {
    socket.writePacket(34, "minecraft:game_event", get())
}

/** @param {Socket} socket  */
function buffer(socket) {
    socket.bufferPacket(34, "minecraft:game_event", get())
}

function get(value) {
    return writer.WriteUByte(10).concat(writer.WriteFloat(0))
}

module.exports = {write, buffer}