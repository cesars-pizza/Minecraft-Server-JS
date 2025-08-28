const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

/**
 * @param {string | number[]} text 
 * @param {boolean} overlay 
 * @param {Socket} socket
 */
function write(socket, text, overlay) {
    socket.writePacket(114, "minecraft:system_chat", get(text, overlay))
}

/**
 * @param {string | number[]} text 
 * @param {boolean} overlay 
 * @param {Socket} socket
 */
function buffer(socket, text, overlay) {
    socket.bufferPacket(114, "minecraft:system_chat", get(text, overlay))
}

function get(text, overlay) {
    return ((typeof(text) == "string") ? writer.WriteString(text) : text).concat(writer.WriteBool(overlay))
}

module.exports = {write, buffer}