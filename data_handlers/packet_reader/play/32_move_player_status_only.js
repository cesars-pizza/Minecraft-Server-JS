const { Socket } = require('../../../data_structures.js')
const reader = require('../../data_reader.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:move_player_status_only / 32 packet (${length} bytes)`)

    var playerFlags = reader.ReadByte(data, 0).value

    socket.playerPos.on_ground = (playerFlags & 0x01) == 1
    socket.playerPos.against_wall = ((playerFlags & 0x02) >> 1) == 1
}
module.exports = {read}