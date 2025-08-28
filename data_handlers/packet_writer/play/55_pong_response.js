const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

/** 
 * @param {number | bigint} payload 
 * @param {Socket} socket
 */
function write(socket, payload) {
    socket.writePacket(55, "minecraft:pong_response", get(payload), false, false)
}

/** 
 * @param {number | bigint} payload 
 * @param {Socket} socket
 */
function buffer(socket, payload) {
    socket.bufferPacket(55, "minecraft:pong_response", get(payload), false, false)
}

function get(payload) {
    return writer.WriteLong(payload)
}

module.exports = {write, buffer}