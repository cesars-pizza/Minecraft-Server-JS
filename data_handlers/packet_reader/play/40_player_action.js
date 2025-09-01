const reader = require('../../data_reader.js')
const { Socket } = require('../../../data_structures.js')
const packetWriter = require('../../packet_writer/class.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:player_action / 40 packet (${length} bytes)`)

    var status = reader.ReadVarInt(data, 0)
    var location = reader.ReadPosition(data, status.nextPos)
    var face = reader.ReadByte(data, location.nextPos)
    var sequence = reader.ReadVarInt(data, face.nextPos)

    if (status.value == 0 || status.value == 2) {
        if (location.value.y > -49) {
            packetWriter.play.block_update.buffer(socket, location.value.x, location.value.y, location.value.z, "minecraft:air")
        }
        packetWriter.play.block_changed_ack.buffer(socket, sequence.value)
    }
}
module.exports = {read}