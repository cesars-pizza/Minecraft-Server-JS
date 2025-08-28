const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

/** 
 * @param {number | bigint} value 
 * @param {Socket} socket
 */
function write(socket, value) {
    socket.writePacket(1, "minecraft:pong_response", get(value))
}

/** 
 * @param {number | bigint} value 
 * @param {Socket} socket
 */
function buffer(socket, value) {
    socket.bufferPacket(1, "minecraft:pong_response", get(value))
}

function get(value) {
    return writer.WriteLong(value)
}

module.exports = {write, buffer}