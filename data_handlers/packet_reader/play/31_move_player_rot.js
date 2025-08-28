const { Socket } = require('../../../data_structures.js')
const reader = require('../../data_reader.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:move_player_rot / 31 packet (${length} bytes)`, false)

    var playerYaw = reader.ReadFloat(data, 0)
    var playerPitch = reader.ReadFloat(data, playerYaw.nextPos)
    var playerFlags = reader.ReadByte(data, playerPitch.nextPos)

    socket.playerPos.yaw = playerYaw.value
    socket.playerPos.pitch = playerPitch.value
    socket.playerPos.on_ground = (playerFlags.value & 0x01) == 1
    socket.playerPos.against_wall = ((playerFlags.value & 0x02) >> 1) == 1
}
module.exports = {read}