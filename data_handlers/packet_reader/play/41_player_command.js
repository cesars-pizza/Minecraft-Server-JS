const { Socket } = require('../../../data_structures.js')
const reader = require('../../data_reader.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:player_command / 41 packet (${length} bytes)`)

    var PlayerID = reader.ReadVarInt(data, 0)
    var ActionID = reader.ReadVarInt(data, PlayerID.nextPos)
    var JumpBoost = reader.ReadVarInt(data,ActionID.nextPos)
}
module.exports = {read}