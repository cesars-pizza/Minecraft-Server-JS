const { Socket } = require("../../../data_structures")

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:keep_alive / 27 packet (${length} bytes)`, false)
}
module.exports = {read}