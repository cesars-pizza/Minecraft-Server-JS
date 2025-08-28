const { Socket } = require("../../../data_structures")

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:login_acknowledged / 3 packet (${length} bytes)`)

    socket.setState('configuration')    
}
module.exports = {read}