const { Socket } = require('../../../data_structures.js')
const reader = require('../../data_reader.js')
const writer = require('../../data_writer.js')
const packetWriter = require('../../packet_writer/class.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    var sharedSecret = reader.ReadPrefixedByteArray(data, 0)
    var verifyToken = reader.ReadPrefixedByteArray(data, sharedSecret.nextPos)

    socket.log(`INCOMING minecraft:key / 1 packet (${length} bytes)`)

    packetWriter.login.login_finished.write(socket, socket.player.uuid, socket.player.name, [{name: "textures", value: "", signature: null}])
}
module.exports = {read}