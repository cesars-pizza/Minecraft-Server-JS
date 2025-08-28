const { Socket } = require('../../../data_structures.js')
const reader = require('../../data_reader.js')
const writer = require('../../data_writer.js')
const packetWriter = require('../../packet_writer/class.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:custom_payload / 2 packet (${length} bytes)`)
    
    var channel = reader.ReadIdentifier(data, 0)
    var payloadData = data.subarray(channel.nextPos)

    packetWriter.configuration.select_known_packs.write(socket, [{namespace: "minecraft", id: "core", version: "1.21.8"}])
}
module.exports = {read}