const { Socket } = require('../../../data_structures.js')
const reader = require('../../data_reader.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:client_information / 0 packet (${length} bytes)`)

    var clientLocale = reader.ReadString(data, 0)
    var clientRenderDist = reader.ReadByte(data, clientLocale.nextPos)
    var clientChatMode = reader.ReadVarInt(data, clientRenderDist.nextPos)
    var clientChatColors = reader.ReadBool(data, clientChatMode.nextPos)
    var clientSkinParts = reader.ReadUByte(data, clientChatColors.nextPos)
    var clientHand = reader.ReadVarInt(data, clientSkinParts.nextPos)
    var clientFilter = reader.ReadBool(data, clientHand.nextPos)
    var clientServerList = reader.ReadBool(data, clientFilter.nextPos)
    var clientParticles = reader.ReadVarInt(data, clientServerList)
}
module.exports = {read}