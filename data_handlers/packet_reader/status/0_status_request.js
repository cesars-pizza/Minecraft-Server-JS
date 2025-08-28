const writer = require('../../data_writer.js')
const serverStatusText = require('../../../data/server_status.json')
const serverStatusOldClientText = require('../../../data/server_status_old_client.json')
const serverStatusOldServerText = require('../../../data/server_status_old_server.json')
const packetWriter = require('../../packet_writer/class.js')
const { Socket } = require('../../../data_structures.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:status_request / 0 packet (${length} bytes)`)

    var responseData = JSON.stringify(serverStatusText)

    if (socket.inputProtocol < 772) responseData = JSON.stringify(serverStatusOldClientText)
    else if (socket.inputProtocol > 772) responseData = JSON.stringify(serverStatusOldServerText)
    packetWriter.status.status_response.write(socket, responseData)
}
module.exports = {read}