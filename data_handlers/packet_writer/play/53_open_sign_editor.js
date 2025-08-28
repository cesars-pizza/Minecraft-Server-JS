const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

/**
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @param {boolean} isFront 
 * @param {Socket} socket
 */
function write(socket, x, y, z, isFront) {
    socket.writePacket(53, "minecraft:open_sign_editor", get(x, y, z, isFront))
}

/**
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @param {boolean} isFront 
 * @param {Socket} socket
 */
function buffer(socket, x, y, z, isFront) {
    socket.bufferPacket(53, "minecraft:open_sign_editor", get(x, y, z, isFront))
}

function get(x, y, z, isFront) {
    return writer.WritePosition(x, y, z).concat(writer.WriteBool(isFront))
}

module.exports = {write, buffer}