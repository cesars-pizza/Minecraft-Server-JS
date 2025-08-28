const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

/**
 * @param {number} id 
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @param {number} velocityX 
 * @param {number} velocityY 
 * @param {number} velocityZ 
 * @param {number} yaw 
 * @param {number} pitch 
 * @param {{relativeX: boolean, relativeY: boolean, relativeZ: boolean, relativePitch: boolean, relativeYaw: boolean, relativeVelocityX: boolean, relativeVelocityY: boolean, relativeVelocityZ: boolean, rotateVelocity: boolean} | null} flags 
 * @param {Socket} socket
 */
function write(socket, id, x, y, z, velocityX, velocityY, velocityZ, yaw, pitch, flags) {
    socket.writePacket(65, "minecraft:player_position", get(id, x, y, z, velocityX, velocityY, velocityZ, yaw, pitch, flags))
}

/**
 * @param {number} id 
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @param {number} velocityX 
 * @param {number} velocityY 
 * @param {number} velocityZ 
 * @param {number} yaw 
 * @param {number} pitch 
 * @param {{relativeX: boolean, relativeY: boolean, relativeZ: boolean, relativePitch: boolean, relativeYaw: boolean, relativeVelocityX: boolean, relativeVelocityY: boolean, relativeVelocityZ: boolean, rotateVelocity: boolean} | null} flags 
 * @param {Socket} socket
 */
function buffer(socket, id, x, y, z, velocityX, velocityY, velocityZ, yaw, pitch, flags) {
    socket.bufferPacket(65, "minecraft:player_position", get(id, x, y, z, velocityX, velocityY, velocityZ, yaw, pitch, flags))
}

function get(id, x, y, z, velocityX, velocityY, velocityZ, yaw, pitch, flags) {
    var data = writer.WriteVarInt(id).concat(
        writer.WriteDouble(x),
        writer.WriteDouble(y),
        writer.WriteDouble(z),
        writer.WriteDouble(velocityX),
        writer.WriteDouble(velocityY),
        writer.WriteDouble(velocityZ),
        writer.WriteFloat(yaw),
        writer.WriteFloat(pitch)
    )
    if (flags == null || flags == undefined) data = data.concat(writer.WriteInt(0))
    else data = data.concat(writer.WriteTeleportFlags(flags.relativeX, flags.relativeY, flags.relativeZ, flags.relativePitch, flags.relativeYaw, flags.relativeVelocityX, flags.relativeVelocityY, flags.relativeVelocityZ, flags.rotateVelocity))

    return data
}

module.exports = {write, buffer}