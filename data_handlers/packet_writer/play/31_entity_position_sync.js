const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

var id = 31
var name = "minecraft:entity_position_sync"

/**
 * @param {number | bigint} entityID 
 * @param {{x: number, y: number, z: number}} position 
 * @param {{x: number, y: number, z: number}} velocity 
 * @param {{pitch: number, yaw: number}} rotation 
 * @param {boolean} onGround 
 * @param {Socket} socket
 */
function write(socket, entityID, position, velocity, rotation, onGround) {
    socket.writePacket(id, name, get(entityID, position, velocity, rotation, onGround), false, false)
}

/**
 * @param {number | bigint} entityID 
 * @param {{x: number, y: number, z: number}} position 
 * @param {{x: number, y: number, z: number}} velocity 
 * @param {{pitch: number, yaw: number}} rotation 
 * @param {boolean} onGround 
 * @param {Socket} socket
 */
function buffer(socket, entityID, position, velocity, rotation, onGround) {
    socket.bufferPacket(id, name, get(entityID, position, velocity, rotation, onGround), false, false)
}

function get(entityID, position, velocity, rotation, onGround) {
    return writer.WriteVarInt(entityID).concat(
        writer.WriteDouble(position.x),
        writer.WriteDouble(position.y),
        writer.WriteDouble(position.z),
        writer.WriteDouble(velocity.x),
        writer.WriteDouble(velocity.y),
        writer.WriteDouble(velocity.z),
        writer.WriteFloat(rotation.yaw),
        writer.WriteFloat(rotation.pitch),
        writer.WriteBool(onGround),
    )
}

module.exports = {write, buffer}