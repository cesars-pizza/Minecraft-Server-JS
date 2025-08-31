const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

/**
 * @param {Number | bigint} entityID 
 * @param {bigint | number | string} entityUUID 
 * @param {number} type 
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @param {number} pitch 
 * @param {number} yaw 
 * @param {number} headYaw 
 * @param {number} data 
 * @param {number} velocityX 
 * @param {Number} velocityY 
 * @param {number} velocityZ 
 * @param {Socket} socket
 */
function write(socket, entityID, entityUUID, type, x, y, z, pitch, yaw, headYaw, data, velocityX, velocityY, velocityZ) {
    socket.writePacket(1, "minecraft:add_entity", get(entityID, entityUUID, type, x, y, z, pitch, yaw, headYaw, data, velocityX, velocityY, velocityZ))
}

/**
 * @param {Number | bigint} entityID 
 * @param {bigint | number | string} entityUUID 
 * @param {number} type 
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @param {number} pitch 
 * @param {number} yaw 
 * @param {number} headYaw 
 * @param {number} data 
 * @param {number} velocityX 
 * @param {Number} velocityY 
 * @param {number} velocityZ 
 * @param {Socket} socket
 */
function buffer(socket, entityID, entityUUID, type, x, y, z, pitch, yaw, headYaw, data, velocityX, velocityY, velocityZ) {
    socket.bufferPacket(1, "minecraft:add_entity", get(entityID, entityUUID, type, x, y, z, pitch, yaw, headYaw, data, velocityX, velocityY, velocityZ))
}

function get(entityID, entityUUID, type, x, y, z, pitch, yaw, headYaw, data, velocityX, velocityY, velocityZ) {
    return writer.WriteVarInt(entityID).concat(
        (typeof(entityUUID) == "string") ? writer.WriteUUIDv3(entityUUID) : writer.WriteUUID(entityUUID),
        writer.WriteVarInt(type),
        writer.WriteDouble(x),
        writer.WriteDouble(y),
        writer.WriteDouble(z),
        writer.WriteAngle(pitch),
        writer.WriteAngle(yaw),
        writer.WriteAngle(headYaw),
        writer.WriteVarInt(data),
        writer.WriteShort(velocityX),
        writer.WriteShort(velocityY),
        writer.WriteShort(velocityZ)
    )
}

module.exports = {write, buffer}