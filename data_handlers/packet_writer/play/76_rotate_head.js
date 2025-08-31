const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

var id = 76
var name = "minecraft:rotate_head"

/** 
 * @param {Socket} socket
 * @param {number | bigint} entity 
 * @param {number} angle  
 */
function write(socket, entity, angle) {
    socket.writePacket(id, name, get(entity, angle), false, false)
}

/** 
 * @param {Socket} socket
 * @param {number | bigint} entity 
 * @param {number} angle  
 */
function buffer(socket, entity, angle) {
    socket.bufferPacket(id, name, get(entity, angle), false, false)
}
function get(entity, angle) {
    return writer.WriteVarInt(entity).concat(writer.WriteAngle(angle))
}

module.exports = {write, buffer}