const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

/**
 * @param {number} id 
 * @param {number} deltaX 
 * @param {number} deltaY 
 * @param {number} deltaZ 
 * @param {number} pitch 
 * @param {number} yaw 
 * @param {boolean} onGround 
 * @param {Socket} socket
 */
function write(socket, id, deltaX, deltaY, deltaZ, pitch, yaw, onGround) {
    socket.writePacket(47, "minecraft:move_entity_pos_rot", get(id, deltaX, deltaY, deltaZ, pitch, yaw, onGround), false, false)
}

/**
 * @param {number} id 
 * @param {number} deltaX 
 * @param {number} deltaY 
 * @param {number} deltaZ 
 * @param {number} pitch 
 * @param {number} yaw 
 * @param {boolean} onGround 
 * @param {Socket} socket
 */
function buffer(socket, id, deltaX, deltaY, deltaZ, pitch, yaw, onGround) {
    socket.bufferPacket(47, "minecraft:move_entity_pos_rot", get(id, deltaX, deltaY, deltaZ, pitch, yaw, onGround), false, false)
}

function get(id, deltaX, deltaY, deltaZ, pitch, yaw, onGround) {
    return writer.WriteVarInt(id).concat(
        writer.WriteShort(deltaX),
        writer.WriteShort(deltaY),
        writer.WriteShort(deltaZ),
        writer.WriteAngle(yaw),
        writer.WriteAngle(pitch),
        writer.WriteBool(onGround),
    )
}

module.exports = {write, buffer}