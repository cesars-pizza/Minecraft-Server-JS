const { Socket } = require('../../../data_structures.js')
const reader = require('../../data_reader.js')
const writer = require('../../data_writer.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:player_input / 42 packet (${length} bytes)`, false)

    var playerFlags = reader.ReadUByte(data, 0).value

    var inputForward = (playerFlags & 0x01) == 1
    var inputBackward = ((playerFlags & 0x02) >> 1) == 1
    var inputLeft = ((playerFlags & 0x04) >> 2) == 1
    var inputRight = ((playerFlags & 0x08) >> 3) == 1
    var inputJump = ((playerFlags & 0x10) >> 4) == 1
    var inputSneak = ((playerFlags & 0x20) >> 5) == 1
    var inputSprint = ((playerFlags & 0x40) >> 6) == 1
}
module.exports = {read}