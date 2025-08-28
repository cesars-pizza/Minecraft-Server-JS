const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

/** 
 * @param {number} slot  
 * @param {Socket} socket
 */
function write(socket, slot) {
    socket.writePacket(98, "minecraft:set_held_slot", get(slot))
}

/** 
 * @param {number} slot  
 * @param {Socket} socket
 */
function buffer(socket, slot) {
    socket.bufferPacket(98, "minecraft:set_held_slot", get(slot))
}

function get(slot) {
    return writer.WriteVarInt(slot)
}

module.exports = {write, buffer}