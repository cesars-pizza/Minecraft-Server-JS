const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

var id = 0
var name = "minecraft:"

/** @param {Socket} socket  */
function write(socket) {
    socket.writePacket(id, name, get())
}

/** @param {Socket} socket  */
function buffer(socket) {
    socket.bufferPacket(id, name, get())
}

function get() {
    return []
}

module.exports = {write, buffer}