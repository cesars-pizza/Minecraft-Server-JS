const { Socket } = require('../../../data_structures.js')
const reader = require('../../data_reader.js')
const packetWriter = require('../../packet_writer/class.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:ping_request / 37 packet (${length} bytes)`)

    var payload = reader.ReadLong(data, 0)

    packetWriter.play.pong_response.buffer(socket, payload.value)
}
module.exports = {read}