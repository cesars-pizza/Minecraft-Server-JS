const reader = require('../../data_reader.js')
const writer = require('../../data_writer.js')
const nbt = require('../../nbt_writer.js')
const registryReader = require('../../registry_reader.js')
const packetWriter = require('../../packet_writer/class.js')
const { Socket } = require('../../../data_structures.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:swing / 60 packet (${length} bytes)`)

    var hand = reader.ReadVarInt(data, 0)
}
module.exports = {read}