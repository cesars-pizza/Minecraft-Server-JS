const { Socket } = require("../../../../data_structures")
const writer = require("../../../data_writer")

/** 
 * @param {number} event 
 * @param {number} value 
 * @param {Socket} socket
 */
function write(socket, event, value) {
    socket.writePacket(34, "minecraft:game_event", get(event, value))
}

/** 
 * @param {number} event 
 * @param {number} value 
 * @param {Socket} socket
 */
function buffer(socket, event, value) {
    socket.bufferPacket(34, "minecraft:game_event", get(event, value))
}

function get(event, value) {
    return writer.WriteUByte(event).concat(writer.WriteFloat(value))
}

module.exports = {write, buffer}