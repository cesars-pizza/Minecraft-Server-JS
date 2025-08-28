const { Socket } = require('../../../data_structures.js')
const reader = require('../../data_reader.js')
const writer = require('../../data_writer.js')
const packetWriter = require('../../packet_writer/class.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:move_player_pos_rot / 30 packet (${length} bytes)`, false)

    var playerX = reader.ReadDouble(data, 0)
    var playerY = reader.ReadDouble(data, playerX.nextPos)
    var playerZ = reader.ReadDouble(data, playerY.nextPos)
    var playerYaw = reader.ReadFloat(data, playerZ.nextPos)
    var playerPitch = reader.ReadFloat(data, playerYaw.nextPos)
    var playerFlags = reader.ReadByte(data, playerPitch.nextPos)

    socket.playerPos.x = playerX.value
    socket.playerPos.y = playerY.value
    socket.playerPos.z = playerZ.value
    socket.playerPos.yaw = playerYaw.value
    socket.playerPos.pitch = playerPitch.value
    socket.playerPos.on_ground = (playerFlags.value & 0x01) == 1
    socket.playerPos.against_wall = ((playerFlags.value & 0x02) >> 1) == 1

    if (socket.playerPos.y <= -128.0) {
        packetWriter.play.player_position.buffer(socket, 0, 8, -10, 8, 0, 0, 0, socket.playerPos.yaw, socket.playerPos.pitch, null)

        socket.playerPos.x = 8.0
        socket.playerPos.y = -10.0
        socket.playerPos.z = 8.0
    }
}
module.exports = {read}