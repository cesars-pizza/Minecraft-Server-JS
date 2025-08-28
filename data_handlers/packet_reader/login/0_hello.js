const { Socket } = require('../../../data_structures.js')
const reader = require('../../data_reader.js')
const writer = require('../../data_writer.js')
const packetWriter = require('../../packet_writer/class.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    var name = reader.ReadString(data, 0)
    var uuid = reader.ReadUUID(data, name.nextPos)

    socket.player = {name: name.value, uuid: uuid.value}

    socket.log(`INCOMING minecraft:hello / 0 packet (${length} bytes)`)

    packetWriter.login.login_finished.write(socket, socket.player.uuid, socket.player.name, [{name: "textures", value: "", signature: null}])
}
module.exports = {read}