const { Socket } = require("../../../../data_structures")
const writer = require("../../../data_writer")

/** 
 * @param {number} value 
 * @param {Socket} socket
 */
function write(socket, value) {
    socket.writePacket(34, "minecraft:game_event", get(value))
}

/** 
 * @param {number} value 
 * @param {Socket} socket
 */
function buffer(socket, value) {
    socket.bufferPacket(34, "minecraft:game_event", get(value))
}

function get(value) {
    return writer.WriteUByte(8).concat(writer.WriteFloat(value))
}

module.exports = {write, buffer}