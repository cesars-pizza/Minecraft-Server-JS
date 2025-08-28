const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

/** 
 * @param {number[] | string} text  
 * @param {Socket} socket
 */
function write(socket, text) {
    socket.writePacket(0, "minecraft:login_disconnect", get(socket, text))
}

/** 
 * @param {number[] | string} text  
 * @param {Socket} socket
 */
function buffer(socket, text) {
    socket.bufferPacket(0, "minecraft:login_disconnect", get(socket, text))
}

function get(text) {
    if (typeof(text) == 'string') return writer.WriteString(text)
    else return text
}

module.exports = {write, buffer}