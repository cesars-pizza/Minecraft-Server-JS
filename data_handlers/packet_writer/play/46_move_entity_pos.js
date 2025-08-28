const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

/**
 * @param {number} id 
 * @param {number} deltaX 
 * @param {number} deltaY 
 * @param {number} deltaZ 
 * @param {boolean} onGround 
 * @param {Socket} socket
 */
function write(socket, id, deltaX, deltaY, deltaZ, onGround) {
    socket.writePacket(46, "minecraft:move_entity_pos", get(id, deltaX, deltaY, deltaZ, onGround), false, false)
}

/**
 * @param {number} id 
 * @param {number} deltaX 
 * @param {number} deltaY 
 * @param {number} deltaZ 
 * @param {boolean} onGround 
 * @param {Socket} socket
 */
function buffer(socket, id, deltaX, deltaY, deltaZ, onGround) {
    socket.bufferPacket(46, "minecraft:move_entity_pos", get(id, deltaX, deltaY, deltaZ, onGround), false, false)
}

function get(id, deltaX, deltaY, deltaZ, onGround) {
    return writer.WriteVarInt(id).concat(
        writer.WriteShort(deltaX),
        writer.WriteShort(deltaY),
        writer.WriteShort(deltaZ),
        writer.WriteBool(onGround),
    )
}

module.exports = {write, buffer}