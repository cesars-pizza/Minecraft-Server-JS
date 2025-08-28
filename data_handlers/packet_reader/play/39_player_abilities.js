const { Socket } = require('../../../data_structures.js')
const reader = require('../../data_reader.js')
const writer = require('../../data_writer.js')
const nbt = require('../../nbt_writer.js')
const packetWriter = require('../../packet_writer/class.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:player_abilities / 39 packet (${length} bytes)`)

    var playerFlags = reader.ReadByte(data, 0).value
    var isFlying = ((playerFlags & 0x02) >> 1) == 1

    socket.playerPos.is_flying = isFlying

    if (isFlying) {
        packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
            nbt.WriteString("type", "text"),
            nbt.WriteString("text", "You started flying"),
        ]), false)
    }
}
module.exports = {read}