const { Socket } = require('../../../data_structures.js')
const reader = require('../../data_reader.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:close_container / 18 packet (${length} bytes)`)

    var window = reader.ReadVarInt(data, 0)
}
module.exports = {read}