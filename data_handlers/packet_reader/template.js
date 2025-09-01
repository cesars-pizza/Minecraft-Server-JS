const reader = require('../../data_reader.js')
const { Socket } = require('../../../data_structures.js')
const packetWriter = require('../../packet_writer/class.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft: / 0 packet (${length} bytes)`)
}
module.exports = {read}