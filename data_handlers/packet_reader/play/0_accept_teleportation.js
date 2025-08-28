const { Socket } = require("../../../data_structures")

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:accept_teleportation / 0 packet (${length} bytes)`)
}
module.exports = {read}