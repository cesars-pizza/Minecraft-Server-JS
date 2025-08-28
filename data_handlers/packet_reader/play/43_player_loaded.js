const { Socket } = require("../../../data_structures")

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:player_loaded / 43 packet (${length} bytes)`)
}
module.exports = {read}