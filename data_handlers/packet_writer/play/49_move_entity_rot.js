const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

/**
 * @param {number} id
 * @param {number} pitch 
 * @param {number} yaw 
 * @param {boolean} onGround 
 * @param {Socket} socket
 */
function write(socket, id, pitch, yaw, onGround) {
    socket.writePacket(49, "minecraft:move_entity_rot", get(id, pitch, yaw, onGround), false, false)
}

/**
 * @param {number} id
 * @param {number} pitch 
 * @param {number} yaw 
 * @param {boolean} onGround 
 * @param {Socket} socket
 */
function buffer(socket, id, pitch, yaw, onGround) {
    socket.bufferPacket(49, "minecraft:move_entity_rot", get(id, pitch, yaw, onGround), false, false)
}

function get(id, pitch, yaw, onGround) {
    return writer.WriteVarInt(id).concat(
        writer.WriteAngle(yaw),
        writer.WriteAngle(pitch),
        writer.WriteBool(onGround),
    )
}

module.exports = {write, buffer}