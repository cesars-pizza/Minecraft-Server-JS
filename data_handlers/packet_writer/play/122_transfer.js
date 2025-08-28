const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

/**
 * @param {string} host 
 * @param {number} port 
 * @param {Socket} socket
 */
function write(socket, host, port) {
    socket.writePacket(122, "minecraft:transfer", get(host, port))
}

/**
 * @param {string} host 
 * @param {number} port 
 * @param {Socket} socket
 */
function buffer(socket, host, port) {
    socket.bufferPacket(122, "minecraft:transfeer", get(host, port))
}

function get(host, port) {
    return writer.WriteString(host).concat(writer.WriteVarInt(port))
}

module.exports = {write, buffer}