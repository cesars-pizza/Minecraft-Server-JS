const { Socket } = require('../../../data_structures.js')
const reader = require('../../data_reader.js')
const packetWriter = require('../../packet_writer/class.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:ping_request / 1 packet (${length} bytes)`)
    
    var payload = reader.ReadLong(data, 0)

    packetWriter.status.pong_response.write(socket, payload.value)
}
module.exports = {read}