const { Socket } = require("../../../../data_structures")
const writer = require("../../../data_writer")

/** 
 * @param {0 | 1} value 
 * @param {Socket} socket
 */
function write(socket, value) {
    socket.writePacket(34, "minecraft:game_event", get(value))
}

/** 
 * @param {0 | 1} value 
 * @param {Socket} socket
 */
function buffer(socket, value) {
    socket.bufferPacket(34, "minecraft:game_event", get(value))
}

function get(value) {
    return writer.WriteUByte(12).concat(writer.WriteFloat(value))
}

module.exports = {write, buffer}